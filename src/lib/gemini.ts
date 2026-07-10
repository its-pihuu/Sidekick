// src/lib/gemini.ts
// The brain — talks to Google's Gemini AI in Sidekick's voice

import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── SETUP ────────────────────────────────────────────────────────────────
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️  GEMINI_API_KEY missing in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey as string);
const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

// ─── SIDEKICK'S SYSTEM PROMPT (the personality) ──────────────────────────
const SIDEKICK_PERSONA = `You are Sidekick — a thinking partner for founders.

VOICE RULES:
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
- If they wrote nothing in the section yet, ask ONE sharp question to get them started.
- If they wrote something weak, name the weakness and suggest a fix.
- If they wrote something strong, sharpen it further — never just praise.

CONTEXT:
You'll be given:
1. The section they're working on (Problem, Solution, etc.)
2. What they've written so far in that section (may be empty)
3. Their specific question

Respond as Sidekick — their honest thinking partner.`;

// ─── ASK SIDEKICK ─────────────────────────────────────────────────────────
export async function askSidekick(params: {
  sectionName: string;
  sectionContent: string;
  question: string;
}): Promise<string> {
  const { sectionName, sectionContent, question } = params;

  const userPrompt = `
SECTION: ${sectionName}

WHAT THEY'VE WRITTEN SO FAR:
${sectionContent.trim() || "(nothing yet — this section is empty)"}

THEIR QUESTION:
${question.trim()}

Respond as Sidekick.`;

  try {
    const result = await model.generateContent([
      { text: SIDEKICK_PERSONA },
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