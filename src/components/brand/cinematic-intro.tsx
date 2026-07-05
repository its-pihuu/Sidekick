// components/brand/cinematic-intro.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CinematicIntroProps {
  onComplete?: () => void;
  duration?: number; // total ms before auto-complete
}

export function CinematicIntro({
  onComplete,
  duration = 3000,
}: CinematicIntroProps) {
  const [visible, setVisible] = useState(true);

  // Auto-complete after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  // Trigger onComplete after fade-out finishes
  useEffect(() => {
    if (!visible && onComplete) {
      const timer = setTimeout(onComplete, 700);
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  // Click anywhere to skip
  function handleSkip() {
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="cinematic-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          onClick={handleSkip}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer"
          style={{
            backgroundColor: "var(--sk-bg)", // themed — Chinese Black on landing
          }}
        >
          {/* Subtle vignette for cinematic depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)",
            }}
          />

          {/* CENTER CONTENT */}
          <div className="relative flex flex-col items-center gap-8">

            {/* WORDMARK — fades in after hairline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 1.0,
                ease: [0.16, 1, 0.3, 1], // expo out — luxe
              }}
              className="flex items-end leading-none"
            >
              <span
                className="italic"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "var(--sk-text)",
                  fontSize: "clamp(64px, 12vw, 144px)",
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  lineHeight: 1,
                }}
              >
                Sidekick
              </span>

              {/* Signature dot */}
              <motion.span
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 1.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-full flex-shrink-0"
                style={{
                  width: "clamp(8px, 1.2vw, 16px)",
                  height: "clamp(8px, 1.2vw, 16px)",
                  marginLeft: "clamp(8px, 1vw, 14px)",
                  marginBottom: "0.18em",
                  backgroundColor: "var(--sk-accent)",
                  boxShadow: "0 0 16px var(--sk-accent-soft)",
                }}
              />
            </motion.div>

            {/* HAIRLINE — draws horizontally, appears FIRST */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{
                duration: 1.4,
                delay: 0.5,
                ease: [0.65, 0, 0.35, 1],
              }}
              className="h-px origin-center"
              style={{
                width: "clamp(80px, 12vw, 180px)",
                backgroundColor: "var(--sk-accent)",
                opacity: 0.7,
              }}
            />

            {/* TAGLINE — fades in last */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 1.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="italic text-center"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text-muted)",
                fontSize: "clamp(18px, 2.2vw, 26px)",
                fontWeight: 400,
                letterSpacing: "0.01em",
              }}
            >
              Every great founder has a sidekick.
            </motion.p>
          </div>

          {/* SKIP HINT — bottom, ultra subtle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="absolute bottom-10 font-mono text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "var(--sk-text-faint)" }}
          >
            click anywhere to enter
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}