// components/onboarding/calibration-screen.tsx

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CalibrationScreenProps {
  onComplete: () => void;
}

const STEPS = [
  "Reading your rhythm",
  "Listening to your ambition",
  "Mapping your instincts",
  "Studying your voice",
  "Preparing your canvas",
  "Tuning the room",
  "Almost there",
];

const MESSAGES = [
  "We&apos;re listening.",
  "Learning how you think.",
  "Setting the room just for you.",
  "A moment of quiet before we begin.",
  "Almost ready.",
];

export function CalibrationScreen({ onComplete }: CalibrationScreenProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCompletedSteps((prev) => {
        if (prev.length >= STEPS.length) {
          clearInterval(stepInterval);
          setTimeout(onComplete, 1200);
          return prev;
        }
        return [...prev, prev.length];
      });
    }, 900);

    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % MESSAGES.length);
    }, 2000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-xl mx-auto px-6 relative"
    >
      {/* HEADER */}
      <div className="text-center mb-16">
        <div
          className="font-mono text-[11px] tracking-[0.3em] uppercase mb-8"
          style={{ color: "var(--sk-text-faint)" }}
        >
          — Calibrating —
        </div>

        <h1
          className="italic mb-6"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "var(--sk-text)",
            fontSize: "clamp(36px, 5.5vw, 56px)",
            fontWeight: 400,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}
        >
          Setting up your{" "}
          <span style={{ color: "var(--sk-accent)" }}>Sidekick</span>.
        </h1>

        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6 }}
          className="italic h-8"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            color: "var(--sk-text-muted)",
            fontSize: "20px",
          }}
        >
          {MESSAGES[currentMessage].replace(/&apos;/g, "'")}
        </motion.p>
      </div>

      {/* STEPS LIST */}
      <div className="space-y-5">
        {STEPS.map((step, i) => {
          const isComplete = completedSteps.includes(i);
          const isCurrent = completedSteps.length === i;
          const num = String(i + 1).padStart(2, "0");

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="flex items-baseline gap-5"
            >
              {/* Number */}
              <span
                className="font-mono text-[10px] tracking-[0.25em] flex-shrink-0 transition-colors duration-500"
                style={{
                  color: isComplete
                    ? "var(--sk-accent)"
                    : isCurrent
                    ? "var(--sk-text-muted)"
                    : "var(--sk-text-faint)",
                  width: "24px",
                }}
              >
                {num}
              </span>

              {/* Step content */}
              <div className="flex-1">
                <p
                  className="italic mb-2 transition-colors duration-500"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: isComplete
                      ? "var(--sk-text)"
                      : isCurrent
                      ? "var(--sk-text-muted)"
                      : "var(--sk-text-faint)",
                    fontSize: "19px",
                    fontWeight: 400,
                  }}
                >
                  {step}
                </p>

                {/* Hairline progress */}
                <div
                  className="h-px w-full relative overflow-hidden"
                  style={{ backgroundColor: "var(--sk-border)" }}
                >
                  <motion.div
                    className="h-full absolute left-0 top-0"
                    style={{
                      backgroundColor: "var(--sk-accent)",
                      boxShadow: isComplete
                        ? "0 0 10px var(--sk-accent-glow)"
                        : "none",
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: isComplete ? "100%" : isCurrent ? "55%" : "0%",
                    }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>

              {/* Status glyph */}
              <div className="flex-shrink-0 w-4 flex justify-end">
                {isComplete ? (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="font-mono text-[12px]"
                    style={{ color: "var(--sk-accent)" }}
                  >
                    ✓
                  </motion.span>
                ) : isCurrent ? (
                  <motion.span
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-1 rounded-full inline-block"
                    style={{ backgroundColor: "var(--sk-accent)" }}
                  />
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}