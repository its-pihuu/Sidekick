// src/lib/gemini.ts
// The brain — Gemini AI in Sidekick's voice
// Now with USER PROFILE + MULTI-TURN CONVERSATION HISTORY

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── TYPES ────────────────────────────────────────────────────────────────
export interface ChatTurn {
  role: "user" | "sidekick";
  text: string;
}

// ─── SETUP ────────────────────────────────────────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️  GEMINI_API_KEY missing in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey || "");
const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

// ─── SIDEKICK'S CORE PERSONA ─────────────────────────────────────────────
const SIDEKICK_CORE_PERSONA = `You are Sidekick — a thinking partner for founders.

CORE VOICE:
- Sharp, witty, slightly cheeky. Never sycophantic.
- Like a friend in a ₹2 lakh suit who roasts you over whiskey, but genuinely wants you to win.
- Push back on lazy thinking. Ask hard questions.
- Zero corporate fluff. No "certainly!" or "great question!"
- Answer like a smart older sibling, not a chatbot.

FORMAT RULES:
- Keep replies TIGHT. Max 4-6 short paragraphs unless they ask for more.
- Use plain language. No jargon unless mocking it.
- No bullet points unless truly needed.
- No emojis.
- If the section is empty, ask ONE sharp question to get them started.
- If what they wrote is weak, name the weakness and suggest a fix.
- If what they wrote is strong, sharpen it further — never just praise.

CONVERSATION MEMORY:
- If there's prior conversation history, use it. Reference what was said before naturally.
- Don't repeat yourself. Build on the thread.
- If they ask a follow-up ("expand on that", "what about..."), assume they mean the last thing you said.`;

// ─── ASK SIDEKICK ─────────────────────────────────────────────────────────
export async function askSidekick(params: {
  sectionName: string;
  sectionContent: string;
  question: string;
  profileContext?: string;
  history?: ChatTurn[];
}): Promise<string> {
  const {
    sectionName,
    sectionContent,
    question,
    profileContext,
    history = [],
  } = params;

  // Build the full persona: core + personalization layer
  const fullPersona = profileContext
    ? `${SIDEKICK_CORE_PERSONA}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHO YOU ARE TALKING TO:
${profileContext}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Adapt your tone, examples, and depth to fit this person. If they're a first-time builder, don't assume knowledge. If they're experienced, skip the basics. If they asked for brutal honesty, deliver it. If they want warmth, warm up.`
    : SIDEKICK_CORE_PERSONA;

  // Build conversation history in text form (excluding the current question)
  // We slice off the last message because it's the current one being asked
  const priorTurns = history.slice(0, -1);
  const historyText =
    priorTurns.length > 0
      ? `\n\nPRIOR CONVERSATION IN THIS THREAD:\n${priorTurns
          .map(
            (t) => `${t.role === "user" ? "USER" : "SIDEKICK"}: ${t.text}`
          )
          .join("\n\n")}\n`
      : "";

  const userPrompt = `
SECTION: ${sectionName}

WHAT THEY'VE WRITTEN SO FAR IN THIS SECTION:
${sectionContent.trim() || "(nothing yet — this section is empty)"}
${historyText}
THEIR CURRENT QUESTION:
${question.trim()}

Respond as Sidekick.`;

  try {
    const result = await model.generateContent([
      { text: fullPersona },
      { text: userPrompt },
    ]);
    const response = result.response;
    return response.text().trim();
  } catch (error: unknown) {
    console.error("Gemini error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Sidekick couldn't respond: ${message}`);
  }
}