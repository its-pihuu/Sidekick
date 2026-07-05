// components/onboarding/progress-bar.tsx

"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-16">
      {/* Label row */}
      <div className="flex justify-between mb-3">
        <span
          className="font-mono text-[10px] tracking-[0.25em] uppercase"
          style={{ color: "var(--sk-text-faint)" }}
        >
          Step {String(current).padStart(2, "0")} · {String(total).padStart(2, "0")}
        </span>
        <span
          className="font-mono text-[10px] tracking-[0.25em] uppercase"
          style={{ color: "var(--sk-accent)" }}
        >
          {Math.round(percentage)}%
        </span>
      </div>

      {/* Hairline progress track */}
      <div
        className="h-px w-full relative overflow-hidden"
        style={{ backgroundColor: "var(--sk-border)" }}
      >
        <motion.div
          className="h-full absolute left-0 top-0"
          style={{
            backgroundColor: "var(--sk-accent)",
            boxShadow: "0 0 12px var(--sk-accent-glow)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}