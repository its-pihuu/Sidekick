// components/canvas/section-card.tsx

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { CanvasSection } from "@/data/canvas-sections";
import { getWordCount } from "@/lib/canvas-store";

interface SectionCardProps {
  section: CanvasSection;
  content: string;
  onChange: (content: string) => void;
  onAIClick: (sectionId: string) => void;
  index: number;
}

export function SectionCard({
  section,
  content,
  onChange,
  onAIClick,
  index,
}: SectionCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.max(ta.scrollHeight, 160)}px`;
  }, [content]);

  const wordCount = getWordCount(content);
  const isEmpty = content.trim().length === 0;
  const isStarted = content.trim().length > 0 && content.trim().length < 20;
  const isComplete = content.trim().length >= 20;

  const sectionNumber = String(section.order).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
      className="relative group"
    >
      <div
        className="relative rounded-xl transition-all duration-500 px-8 sm:px-10 py-9 sm:py-11"
        style={{
          /* INVERTED CARD — cream/accent card on themed background */
          backgroundColor: "var(--sk-text)",
          color: "var(--sk-bg)",
          border: `1px solid var(--sk-border-accent)`,
          boxShadow: isComplete
            ? "0 0 60px var(--sk-accent-glow), 0 20px 60px rgba(0,0,0,0.35)"
            : "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* TOP: Magazine label + status */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="font-mono text-[11px] tracking-[0.25em] uppercase"
            style={{ color: "var(--sk-bg)", opacity: 0.5 }}
          >
            Section · {sectionNumber} / 11
          </div>

          <div className="flex items-center gap-2">
            {isComplete && (
              <span
                className="text-[10px] font-mono tracking-[0.2em] uppercase"
                style={{ color: "var(--sk-secondary)" }}
              >
                Complete
              </span>
            )}
            <div
              className="w-1.5 h-1.5 rounded-full transition-colors duration-500"
              style={{
                backgroundColor: isComplete
                  ? "var(--sk-secondary)"
                  : isStarted
                  ? "var(--sk-bg)"
                  : "transparent",
                opacity: isStarted && !isComplete ? 0.3 : 1,
                border: !isComplete && !isStarted
                  ? "1px solid var(--sk-bg)"
                  : "none",
                boxShadow: isComplete
                  ? "0 0 8px var(--sk-accent-glow)"
                  : "none",
              }}
            />
          </div>
        </div>

        {/* TITLE — deep bg color, Cormorant italic — the signature */}
        <h3
          className="text-3xl sm:text-4xl mb-3 italic"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "var(--sk-bg)",
            fontWeight: 500,
            letterSpacing: "-0.005em",
            lineHeight: 1.1,
          }}
        >
          {section.title}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="text-[15px] leading-relaxed mb-7 max-w-xl"
          style={{ color: "var(--sk-bg)", opacity: 0.7 }}
        >
          {section.description}
        </p>

        {/* Hairline divider */}
        <div
          className="h-px w-12 mb-7"
          style={{ backgroundColor: "var(--sk-bg)", opacity: 0.25 }}
        />

        {/* TEXTAREA */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={section.placeholder}
            className="w-full bg-transparent border-0 text-[15px] sm:text-base leading-[1.75] outline-none resize-none"
            style={{
              minHeight: "160px",
              color: "var(--sk-bg)",
              fontFamily: "var(--font-sans)",
            }}
          />

          {isEmpty && index === 0 && (
            <div
              className="absolute bottom-1 right-1 pointer-events-none italic text-base"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-bg)",
                opacity: 0.35,
              }}
            >
              begin.
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div
          className="mt-7 pt-6 flex items-start justify-between gap-8 flex-wrap"
          style={{ borderTop: "1px solid var(--sk-bg)", borderColor: "rgba(0,0,0,0.12)" }}
        >
          <p
            className="text-[15px] italic leading-relaxed flex-1 min-w-0"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "var(--sk-bg)",
              opacity: 0.7,
              fontWeight: 400,
            }}
          >
            &ldquo;{section.tip}&rdquo;
          </p>

          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase flex-shrink-0 mt-1"
            style={{
              color: "var(--sk-bg)",
              opacity: isComplete ? 0.7 : isStarted ? 0.5 : 0.3,
            }}
          >
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
        </div>

        {/* ASK button — bottom right, minimal, inverted on card */}
        <motion.button
          onClick={() => onAIClick(section.id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="absolute top-7 right-8 flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[11px] font-mono tracking-[0.2em] uppercase transition-all"
          style={{
            color: "var(--sk-text)",
            backgroundColor: "var(--sk-bg)",
            border: "1px solid var(--sk-bg)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sk-accent)";
            e.currentTarget.style.color = "var(--sk-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sk-bg)";
            e.currentTarget.style.color = "var(--sk-text)";
          }}
        >
          <span style={{ fontSize: "11px" }}>✦</span>
          <span>Ask</span>
        </motion.button>
      </div>
    </motion.div>
  );
}