// components/onboarding/question-screen.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { OnboardingQuestion } from "@/data/onboarding-questions";
import { ProgressBar } from "./progress-bar";

interface QuestionScreenProps {
  question: OnboardingQuestion;
  current: number;
  total: number;
  onAnswer: (value: string) => void;
  onBack?: () => void;
  initialValue?: string;
}

export function QuestionScreen({
  question,
  current,
  total,
  onAnswer,
  onBack,
  initialValue = "",
}: QuestionScreenProps) {
  const [textValue, setTextValue] = useState(initialValue);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      onAnswer(textValue.trim());
    }
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-3xl mx-auto px-6 relative"
    >
      {/* Progress bar (top) */}
      <ProgressBar current={current} total={total} />

      {/* Question label + headline */}
      <div className="text-center mb-14 mt-2">
        <div
          className="font-mono text-[11px] tracking-[0.3em] uppercase mb-8"
          style={{ color: "var(--sk-text-faint)" }}
        >
          Question · {String(current).padStart(2, "0")} of {String(total).padStart(2, "0")}
        </div>

        <h1
          className="italic mb-5 max-w-2xl mx-auto"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "var(--sk-text)",
            fontSize: "clamp(32px, 5.5vw, 56px)",
            fontWeight: 400,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}
        >
          {question.question}
        </h1>

        {question.subtext && (
          <p
            className="italic max-w-xl mx-auto"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "var(--sk-text-muted)",
              fontSize: "18px",
              lineHeight: 1.5,
            }}
          >
            {question.subtext}
          </p>
        )}
      </div>

      {/* Text input OR options */}
      {question.type === "text" ? (
        <div className="max-w-lg mx-auto">
          <input
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
            placeholder={question.placeholder}
            autoFocus
            className="w-full bg-transparent border-0 text-center outline-none italic transition-colors"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "var(--sk-text)",
              fontSize: "clamp(24px, 3.5vw, 34px)",
              fontWeight: 400,
              borderBottom: "1px solid var(--sk-border-strong)",
              paddingBottom: "10px",
            }}
          />

          <motion.button
            onClick={handleTextSubmit}
            disabled={!textValue.trim()}
            whileHover={textValue.trim() ? { scale: 1.02 } : {}}
            whileTap={textValue.trim() ? { scale: 0.98 } : {}}
            className="mx-auto mt-10 block px-10 py-4 rounded-md font-mono text-[11px] tracking-[0.25em] uppercase transition-all"
            style={{
              backgroundColor: textValue.trim()
                ? "var(--sk-accent)"
                : "transparent",
              color: textValue.trim()
                ? "var(--sk-bg)"
                : "var(--sk-text-faint)",
              border: textValue.trim()
                ? "1px solid var(--sk-accent)"
                : "1px solid var(--sk-border)",
              boxShadow: textValue.trim()
                ? "0 8px 32px var(--sk-accent-glow)"
                : "none",
              cursor: textValue.trim() ? "pointer" : "not-allowed",
            }}
          >
            Continue →
          </motion.button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {question.options?.map((option, i) => {
            const num = String(i + 1).padStart(2, "0");
            const isHover = hoverIndex === i;
            return (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => onAnswer(option.value)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="w-full text-left py-6 px-2 flex items-baseline gap-6 transition-all"
                style={{
                  borderTop: "1px solid var(--sk-border)",
                  borderBottom:
                    i === (question.options?.length ?? 0) - 1
                      ? "1px solid var(--sk-border)"
                      : "none",
                }}
              >
                {/* Number */}
                <span
                  className="font-mono text-[11px] tracking-[0.25em] flex-shrink-0 transition-colors"
                  style={{
                    color: isHover
                      ? "var(--sk-accent)"
                      : "var(--sk-text-faint)",
                    width: "24px",
                  }}
                >
                  {num}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="italic transition-colors"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: isHover
                        ? "var(--sk-accent)"
                        : "var(--sk-text)",
                      fontSize: "clamp(20px, 2.4vw, 26px)",
                      fontWeight: 400,
                      lineHeight: 1.3,
                    }}
                  >
                    {option.label}
                  </p>
                  {option.description && (
                    <p
                      className="italic mt-1"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: "var(--sk-text-muted)",
                        fontSize: "15px",
                        lineHeight: 1.4,
                      }}
                    >
                      {option.description}
                    </p>
                  )}
                </div>

                {/* Arrow indicator on hover */}
                <motion.span
                  animate={{
                    opacity: isHover ? 1 : 0,
                    x: isHover ? 0 : -6,
                  }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-[14px] flex-shrink-0"
                  style={{ color: "var(--sk-accent)" }}
                >
                  →
                </motion.span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* Back link */}
      {onBack && (
        <div className="text-center mt-12">
          <button
            onClick={onBack}
            className="font-mono text-[10px] tracking-[0.25em] uppercase transition-opacity hover:opacity-100 inline-flex items-center gap-2"
            style={{ color: "var(--sk-text-faint)" }}
          >
            ← Back
          </button>
        </div>
      )}
    </motion.div>
  );
}