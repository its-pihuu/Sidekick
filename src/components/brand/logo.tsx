// components/brand/logo.tsx

"use client";

import { motion } from "framer-motion";

type LogoSize = "sm" | "md" | "lg" | "xl";

interface LogoProps {
  size?: LogoSize;
  showDot?: boolean;
  animated?: boolean;
  className?: string;
}

const SIZE_MAP: Record<LogoSize, { text: string; dot: string; gap: string }> = {
  sm: { text: "text-2xl",                    dot: "w-1 h-1",       gap: "ml-1" },
  md: { text: "text-4xl",                    dot: "w-1.5 h-1.5",   gap: "ml-1.5" },
  lg: { text: "text-7xl sm:text-8xl",        dot: "w-2.5 h-2.5",   gap: "ml-2" },
  xl: { text: "text-8xl sm:text-9xl",        dot: "w-3 h-3",       gap: "ml-2.5" },
};

export function Logo({
  size = "md",
  showDot = true,
  animated = false,
  className = "",
}: LogoProps) {
  // Bulletproof — fallback to "md" if invalid size passed
  const s = SIZE_MAP[size] || SIZE_MAP.md;

  const content = (
    <div className={`inline-flex items-end leading-none ${className}`}>
      <span
        className={`${s.text} italic font-medium tracking-tight`}
        style={{
          color: "var(--sk-gold)",
          fontFamily: "'Cormorant Garamond', Georgia, serif",
        }}
      >
        Sidekick
      </span>

      {showDot && (
        <span
          className={`${s.dot} ${s.gap} rounded-full mb-[0.15em] flex-shrink-0`}
          style={{
            backgroundColor: "var(--sk-gold)",
            boxShadow: "0 0 8px rgba(184, 134, 11, 0.6)",
          }}
        />
      )}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {content}
    </motion.div>
  );
}

// ─── LEGACY ALIAS — keeps old imports working ────────────────────────────────
// In case landing page / onboarding still imports LogoMark from logo-mark.tsx,
// we also export it here as a re-export-friendly version

export function LogoMark(props: LogoProps) {
  return <Logo size="lg" {...props} />;
}