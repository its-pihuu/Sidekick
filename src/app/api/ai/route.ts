// src/app/api/ai/route.ts
// Unified API for all 13 Studio AIs
// Supports Quick + Deep modes

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getAIById } from "@/data/ai-registry";

const GEMINI_MODEL = "gemini-flash-lite-latest";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

interface RequestBody {
  aiId: string;
  message: string;
  history: Message[];
  canvasContext: string;
  projectName: string;
  userProfile?: string;
  mode?: "quick" | "deep";
}

// ═══════════════════════════════════════════
// BUILD FINAL SYSTEM PROMPT
// ═══════════════════════════════════════════
function buildFinalPrompt(
  aiSystemPrompt: string,
  canvasContext: string,
  projectName: string,
  userProfile: string,
  mode: "quick" | "deep"
): string {
  const modeInstructions =
    mode === "deep"
      ? `
# CURRENT MODE: DEEP RESEARCH
The user just toggled DEEP mode. This means they want a THOROUGH, RESEARCHED, MULTI-ANGLE response — not your usual punchy 3-paragraph reply.

Rules for DEEP mode:
- Length: 6-12 paragraphs is fine. Use as much space as the topic ACTUALLY needs.
- Structure: Use short headers (##) to organize sections if the answer has 3+ angles.
- Depth: Include real examples, benchmarks, frameworks, counterexamples, edge cases.
- Voice: STAY IN CHARACTER. Full Pihu voice throughout. "yoo", "bruh", "look", "here's the thing" — sprinkled naturally. Never turn into a Wikipedia article. You're a founder-brain best friend going DEEP on a topic, not a textbook.
- Structure example (adapt as needed):
  1. Quick reframe/reality check (1 para — "ok so let me tell u what's really going on...")
  2. The framework or angles (headers + explanation)
  3. Real examples or benchmarks ("look at how X did it...")
  4. Common traps to avoid
  5. What to ACTUALLY do (the specific next steps)
  6. End with a DARE (always)
- Still no emojis. Still no "great question!" Still no "as an AI." Still ends with a dare.
`
      : `
# CURRENT MODE: QUICK
Punchy, tight, 2-4 short paragraphs max. No headers. Fast reality check energy. Every sentence earns its spot. End with a dare.
`;

  return `${aiSystemPrompt}

${modeInstructions}

# CURRENT PROJECT
Project Name: "${projectName}"

# FOUNDER PROFILE (from onboarding)
${userProfile || "The founder hasn't completed onboarding yet. Adapt based on the conversation."}

# THEIR CANVAS RIGHT NOW
${canvasContext || "The canvas is empty. Everything you know comes from this conversation."}

Now respond to their message. Stay in character. Match the mode.`;
}

// ═══════════════════════════════════════════
// SANITIZE HISTORY FOR GEMINI
// ═══════════════════════════════════════════
function sanitizeHistoryForGemini(
  history: Message[]
): { role: "user" | "model"; parts: { text: string }[] }[] {
  if (!history || history.length === 0) return [];

  const mapped = history.map((msg) => ({
    role: (msg.role === "user" ? "user" : "model") as "user" | "model",
    parts: [{ text: msg.content }],
  }));

  let startIdx = 0;
  while (startIdx < mapped.length && mapped[startIdx].role === "model") {
    startIdx++;
  }

  const trimmed = mapped.slice(startIdx);

  while (trimmed.length > 0 && trimmed[trimmed.length - 1].role === "model") {
    trimmed.pop();
  }

  return trimmed;
}

// ═══════════════════════════════════════════
// POST HANDLER
// ═══════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const {
      aiId,
      message,
      history,
      canvasContext,
      projectName,
      userProfile,
      mode = "quick",
    } = body;

    if (!aiId?.trim()) {
      return NextResponse.json(
        { reply: "no AI selected bruh. something's off." },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { reply: "send an actual question dude, i'm not psychic." },
        { status: 400 }
      );
    }

    const ai = getAIById(aiId);
    if (!ai) {
      console.error("AI not found in registry:", aiId);
      return NextResponse.json(
        { reply: "that AI doesn't exist. reload and try again." },
        { status: 404 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY missing");
      return NextResponse.json(
        { reply: "AI is offline. server config issue." },
        { status: 500 }
      );
    }

    const finalSystemPrompt = buildFinalPrompt(
      ai.systemPrompt,
      canvasContext || "",
      projectName || "Untitled Project",
      userProfile || "",
      mode
    );

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: finalSystemPrompt,
    });

    const geminiHistory = sanitizeHistoryForGemini(history || []);

    // Different generation config per mode
    const generationConfig =
      mode === "deep"
        ? {
            temperature: 0.9,
            maxOutputTokens: 2000,
            topP: 0.98,
          }
        : {
            temperature: 0.95,
            maxOutputTokens: 700,
            topP: 0.98,
          };

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig,
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";
    console.error("Studio AI API error:", errorMessage);

    let userMessage = "something broke on my end. try again in a sec.";
    if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      userMessage =
        "hit the AI usage limit. wait a min and try again.";
    } else if (errorMessage.includes("API key")) {
      userMessage = "AI config issue. check the server.";
    } else if (errorMessage.includes("SAFETY")) {
      userMessage =
        "gemini blocked that for safety. try rephrasing.";
    }

    return NextResponse.json({ reply: userMessage }, { status: 500 });
  }
}