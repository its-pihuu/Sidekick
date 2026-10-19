"use client";

import React, { useState } from "react";
import { Sparkles, ArrowLeft, Download, RefreshCw, X, Send } from "lucide-react";
import { OutlineSection } from "@/types/canvas";
import { CanvasTheme } from "@/data/canvas-templates";

interface GammaDocumentViewProps {
  sections: OutlineSection[];
  mapTitle: string;
  theme: CanvasTheme;
  format: "document" | "deck" | "webpage";
  onBackToOutline: () => void;
}

export function GammaDocumentView({
  sections: initialSections,
  mapTitle,
  theme,
  format,
  onBackToOutline,
}: GammaDocumentViewProps) {
  const [sections, setSections] = useState<OutlineSection[]>(initialSections);

  // AI Block Editing Drawer
  const [activeAiSection, setActiveAiSection] = useState<OutlineSection | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiRewriting, setIsAiRewriting] = useState(false);

  // Single Block AI Rewrite
  const handleBlockAiRewrite = async () => {
    if (!activeAiSection || !aiPrompt.trim()) return;
    setIsAiRewriting(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Rewrite section title and bullet points.
CURRENT TITLE: "${activeAiSection.title}"
CURRENT BULLETS: "${activeAiSection.bullets.join("; ")}"
INSTRUCTION: "${aiPrompt}"

Return strict JSON: {"newTitle": "...", "newBullets": ["bullet 1", "bullet 2"]}`,
            },
          ],
          aiId: "canvas",
          stream: false,
        }),
      });

      if (!res.ok) throw new Error("AI rewrite failed");

      const text = await res.text();
      let parsed = { newTitle: activeAiSection.title, newBullets: activeAiSection.bullets };
      try {
        parsed = JSON.parse(text);
      } catch {}

      setSections((prev) =>
        prev.map((s) =>
          s.id === activeAiSection.id
            ? {
                ...s,
                title: parsed.newTitle || s.title,
                bullets: parsed.newBullets || s.bullets,
              }
            : s
        )
      );

      setActiveAiSection(null);
      setAiPrompt("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiRewriting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full p-6 sm:p-12 overflow-y-auto selection:bg-[#CF9D7B] selection:text-[#0C1519]"
      style={{
        background: theme.style.canvasBg,
        color: theme.style.nodeText,
        fontFamily: theme.style.bodyFont,
      }}
    >
      {/* ─── TOP CONTROL TOOLBAR ─── */}
      <div className="max-w-4xl mx-auto mb-10 flex items-center justify-between border-b border-[rgba(240,230,210,0.08)] pb-4">
        <button
          onClick={onBackToOutline}
          className="flex items-center gap-2 text-xs font-mono text-[rgba(240,230,210,0.6)] hover:text-[#CF9D7B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Outline
        </button>

        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-mono px-3 py-1 rounded-full uppercase tracking-widest border"
            style={{
              borderColor: theme.style.nodeBorder,
              color: theme.style.accentColor,
              backgroundColor: theme.style.tagBg,
            }}
          >
            {format.toUpperCase()} · {theme.name}
          </span>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider shadow-lg"
            style={{
              backgroundColor: theme.style.accentColor,
              color: theme.style.canvasBg.includes("#") ? theme.style.canvasBg : "#0C1519",
            }}
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* ─── HERO COVER HEADLINE ─── */}
      <div className="max-w-4xl mx-auto space-y-4 mb-16 text-center">
        <span
          className="text-xs font-mono uppercase tracking-widest block"
          style={{ color: theme.style.accentColor }}
        >
          MASTER DIRECTIVE ARCHITECTURE
        </span>
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-tight tracking-tight"
          style={{ fontFamily: theme.style.headerFont }}
        >
          {mapTitle}
        </h1>
        <div
          className="w-16 h-[1px] mx-auto opacity-40"
          style={{ backgroundColor: theme.style.accentColor }}
        />
      </div>

      {/* ─── GAMMA SLIDES / CARDS STACK ─── */}
      <div className="max-w-4xl mx-auto space-y-8">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className="group relative p-8 sm:p-10 rounded-2xl border transition-all duration-300 shadow-2xl"
            style={{
              backgroundColor: theme.style.nodeBg,
              borderColor: theme.style.nodeBorder,
              boxShadow: theme.style.accentGlow,
            }}
          >
            {/* Top Sparkle AI Trigger on Hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setActiveAiSection(sec)}
                title="Ask Cartographer to rewrite this block"
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider transition-all"
                style={{
                  backgroundColor: theme.style.tagBg,
                  color: theme.style.accentColor,
                }}
              >
                <Sparkles className="w-3 h-3" /> AI REWRITE
              </button>
            </div>

            <div className="space-y-4">
              <span
                className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded inline-block"
                style={{
                  backgroundColor: theme.style.tagBg,
                  color: theme.style.tagText,
                }}
              >
                SECTION 0{idx + 1}
              </span>

              <h3
                className="text-2xl sm:text-3xl font-medium leading-snug"
                style={{ fontFamily: theme.style.headerFont }}
              >
                {sec.title}
              </h3>

              <div className="space-y-2.5 pt-3 border-t border-black/10">
                {sec.bullets.map((b: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span
                      className="text-base leading-none pt-0.5"
                      style={{ color: theme.style.bulletColor }}
                    >
                      •
                    </span>
                    <p
                      className="text-sm leading-relaxed font-light"
                      style={{ color: theme.style.secondaryText }}
                    >
                      {b}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── AI BLOCK REWRITE DRAWER ─── */}
      {activeAiSection && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-[#162127] border border-[#CF9D7B]/40 rounded-2xl p-5 space-y-4 shadow-2xl text-[#F0E6D2]">
          <div className="flex items-center justify-between border-b border-[rgba(240,230,210,0.06)] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#CF9D7B]" />
              <span className="font-serif italic text-sm">Rewrite Section</span>
            </div>
            <button onClick={() => setActiveAiSection(null)}>
              <X className="w-4 h-4 text-[rgba(240,230,210,0.4)]" />
            </button>
          </div>

          <p className="text-xs font-serif italic text-[rgba(240,230,210,0.7)]">
            "{activeAiSection.title}"
          </p>

          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Make this section punchier, add more strategic authority..."
            rows={3}
            className="w-full bg-[#0C1519] border border-[rgba(240,230,210,0.1)] rounded-xl p-3 text-xs text-[#F0E6D2] outline-none resize-none"
          />

          <button
            onClick={handleBlockAiRewrite}
            disabled={isAiRewriting || !aiPrompt.trim()}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#CF9D7B] hover:bg-[#E5B896] text-[#0C1519] font-bold text-xs font-mono uppercase tracking-wider rounded-xl transition-all disabled:opacity-40"
          >
            {isAiRewriting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Rewriting...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Apply AI Rewrite
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}