// src/app/api/ai/route.ts
// Unified API for all 13 Studio AIs
// Reads AI_REGISTRY, injects canvas + profile context, calls Gemini

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
}

// ═══════════════════════════════════════════
// BUILD FINAL SYSTEM PROMPT
// ═══════════════════════════════════════════
function buildFinalPrompt(
  aiSystemPrompt: string,
  canvasContext: string,
  projectName: string,
  userProfile: string
): string {
  return `${aiSystemPrompt}

# CURRENT PROJECT
Project Name: "${projectName}"

# FOUNDER PROFILE (from onboarding)
${userProfile || "The founder hasn't completed onboarding yet. Adapt based on the conversation."}

# THEIR CANVAS RIGHT NOW
${canvasContext || "The canvas is empty. If they ask something specific about a section, tell them the section is empty and ask what they've been thinking."}

Now respond to their message. Stay in character. Reference their canvas when relevant. Keep it tight.`;
}

// ═══════════════════════════════════════════
// SANITIZE HISTORY FOR GEMINI
// Rule: history must start with a user message.
// If it starts with a model (assistant) message, drop leading models.
// Also drop any trailing model messages so the last item is always a user turn.
// ═══════════════════════════════════════════
function sanitizeHistoryForGemini(
  history: Message[]
): { role: "user" | "model"; parts: { text: string }[] }[] {
  if (!history || history.length === 0) return [];

  // Map to Gemini format
  const mapped = history.map((msg) => ({
    role: (msg.role === "user" ? "user" : "model") as "user" | "model",
    parts: [{ text: msg.content }],
  }));

  // Drop leading model messages (e.g., the auto-greeting)
  let startIdx = 0;
  while (startIdx < mapped.length && mapped[startIdx].role === "model") {
    startIdx++;
  }

  const trimmed = mapped.slice(startIdx);

  // Drop trailing model messages (shouldn't happen but defensive)
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
    const { aiId, message, history, canvasContext, projectName, userProfile } =
      body;

    // ── VALIDATE ──────────────────────────────────────────
    if (!aiId?.trim()) {
      return NextResponse.json(
        { reply: "No AI selected. Something's off." },
        { status: 400 }
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { reply: "Send an actual question. I'm not psychic." },
        { status: 400 }
      );
    }

    // ── FIND THE AI IN REGISTRY ──────────────────────────
    const ai = getAIById(aiId);
    if (!ai) {
      console.error("AI not found in registry:", aiId);
      return NextResponse.json(
        { reply: "That AI doesn't exist. Reload the page and try again." },
        { status: 404 }
      );
    }

    // ── CHECK API KEY ────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY missing");
      return NextResponse.json(
        { reply: "AI is offline. Server config issue." },
        { status: 500 }
      );
    }

    // ── BUILD THE FINAL PROMPT ───────────────────────────
    const finalSystemPrompt = buildFinalPrompt(
      ai.systemPrompt,
      canvasContext || "",
      projectName || "Untitled Project",
      userProfile || ""
    );

    // ── CALL GEMINI ──────────────────────────────────────
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: finalSystemPrompt,
    });

    // Sanitize history so it always starts with a user message
    const geminiHistory = sanitizeHistoryForGemini(history || []);

    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 900,
        topP: 0.95,
      },
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";
    console.error("Studio AI API error:", errorMessage);

    let userMessage = "Something broke on my end. Try again in a sec.";
    if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
      userMessage =
        "Hit the AI usage limit. Wait a minute and try again.";
    } else if (errorMessage.includes("API key")) {
      userMessage = "AI config issue. Check the server.";
    } else if (errorMessage.includes("SAFETY")) {
      userMessage =
        "Gemini blocked that response for safety. Try rephrasing your question.";
    }

    return NextResponse.json({ reply: userMessage }, { status: 500 });
  }
}