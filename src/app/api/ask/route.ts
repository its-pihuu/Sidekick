// src/app/api/ask/route.ts
// The bridge — browser talks to this, this talks to Gemini

import { NextRequest, NextResponse } from "next/server";
import { askSidekick } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sectionName, sectionContent, question } = body;

    // ─── VALIDATE ───────────────────────────────────────────────────────
    if (!sectionName || typeof sectionName !== "string") {
      return NextResponse.json(
        { error: "Missing section name." },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { error: "Ask me something." },
        { status: 400 }
      );
    }

    if (question.length > 1000) {
      return NextResponse.json(
        { error: "Question too long. Keep it under 1000 characters." },
        { status: 400 }
      );
    }

    // ─── CALL SIDEKICK ──────────────────────────────────────────────────
    const answer = await askSidekick({
      sectionName,
      sectionContent: sectionContent || "",
      question,
    });

    return NextResponse.json({ answer });
  } catch (error: unknown) {
    console.error("API /ask error:", error);
    const message =
      error instanceof Error ? error.message : "Something broke on our end.";
    return NextResponse.json({ error: message }, { status: 500 }); 
  }
}