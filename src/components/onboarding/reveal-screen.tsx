// components/onboarding/reveal-screen.tsx

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface RevealScreenProps {
  userName: string;
}

export function RevealScreen({ userName }: RevealScreenProps) {
  const router = useRouter();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 text-center relative min-h-[70vh] flex flex-col items-center justify-center">

      {/* Tiny magazine label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="font-mono text-[11px] tracking-[0.3em] uppercase mb-10"
        style={{ color: "var(--sk-text-faint)" }}
      >
        — The Door Opens —
      </motion.div>

      {/* Hairline flourish */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{
          duration: 1.4,
          delay: 0.5,
          ease: [0.65, 0, 0.35, 1],
        }}
        className="h-px mb-12"
        style={{
          width: "120px",
          backgroundColor: "var(--sk-accent)",
          boxShadow: "0 0 12px var(--sk-accent-glow)",
        }}
      />

      {/* MAIN HEADLINE */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          delay: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="italic mb-8"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "var(--sk-text)",
          fontSize: "clamp(44px, 7vw, 88px)",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        Welcome home,
        <br />
        <span style={{ color: "var(--sk-accent)" }}>
          {userName || "founder"}.
        </span>
      </motion.h1>

      {/* SUBTITLE */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 1.9,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="italic max-w-xl mb-14"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          color: "var(--sk-text-muted)",
          fontSize: "clamp(20px, 2.6vw, 26px)",
          lineHeight: 1.5,
        }}
      >
        Your canvas is set.
        <br />
        The pen is in your hand.
      </motion.p>

      {/* CTA */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          delay: 2.5,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => router.push("/canvas")}
        className="px-12 py-4 rounded-md font-mono text-[11px] tracking-[0.25em] uppercase transition-all"
        style={{
          backgroundColor: "var(--sk-accent)",
          color: "var(--sk-bg)",
          boxShadow: "0 8px 32px var(--sk-accent-glow)",
        }}
      >
        Enter your canvas →
      </motion.button>

      {/* Tiny footer whisper */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3.2 }}
        className="mt-14 font-mono text-[10px] tracking-[0.3em] uppercase"
        style={{ color: "var(--sk-text-faint)" }}
      >
        Every empire begins with a single line.
      </motion.p>
    </div>
  );
}