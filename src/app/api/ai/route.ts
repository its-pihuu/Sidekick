// src/app/api/ai/route.ts
// Unified API for all 13 Studio AIs
// Supports Quick + Deep modes + STREAMING

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";
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
The user just toggled DEEP mode. This means they want a THOROUGH, RESEARCHED, MULTI-ANGLE response.

Rules for DEEP mode:
- Length: 6-12 paragraphs. Use as much space as the topic ACTUALLY needs.
- Structure: Use short headers (##) to organize sections if the answer has 3+ angles.
- Depth: Include real examples, benchmarks, frameworks, counterexamples, edge cases.
- Voice: STAY IN CHARACTER. The Architect voice throughout. Never turn into a Wikipedia article.
- Structure example (adapt as needed):
  1. Cold observation or reframe (1 para)
  2. The framework or angles (headers + explanation)
  3. Real examples or benchmarks
  4. Common traps to avoid
  5. What to ACTUALLY do (specific next steps)
  6. End with a dare or a mirror
- Still no emojis. Still no "great question!" Still no "as an AI."
`
      : `
# CURRENT MODE: QUICK
Punchy, tight, 2-4 short paragraphs max. No headers. Fast reality check energy. Every sentence earns its spot. End with a dare or a quiet question.
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
// POST HANDLER — STREAMING
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
      return new Response(
        JSON.stringify({ error: "No AI selected." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!message?.trim()) {
      return new Response(
        JSON.stringify({ error: "Empty message." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const ai = getAIById(aiId);
    if (!ai) {
      return new Response(
        JSON.stringify({ error: "AI not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key missing." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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

    const generationConfig =
      mode === "deep"
        ? { temperature: 0.9, maxOutputTokens: 2000, topP: 0.98 }
        : { temperature: 0.95, maxOutputTokens: 700, topP: 0.98 };

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig,
    });

    // ── STREAM ────────────────────────────────────────────────
    const streamResult = await chat.sendMessageStream(message);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of streamResult.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Studio AI API error:", errorMessage);

    let userMessage = "Something broke on my end. Try again.";
    if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      userMessage = "Usage limit reached. Wait a moment and try again.";
    } else if (errorMessage.includes("API key")) {
      userMessage = "API configuration issue.";
    } else if (errorMessage.includes("SAFETY")) {
      userMessage = "Blocked for safety. Try rephrasing.";
    }

    return new Response(userMessage, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}