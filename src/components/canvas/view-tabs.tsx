// components/canvas/view-tabs.tsx

"use client";

import { motion } from "framer-motion";

export type ViewMode = "edit" | "canvas" | "document";

interface ViewTabsProps {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const TABS: { id: ViewMode; label: string }[] = [
  { id: "edit",     label: "Write" },
  { id: "canvas",   label: "Canvas" },
  { id: "document", label: "Document" },
];

export function ViewTabs({ current, onChange }: ViewTabsProps) {
  return (
    <div className="flex justify-center w-full px-4 py-10">
      <div className="relative inline-flex items-center gap-8">
        {TABS.map((tab) => {
          const isActive = current === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative pb-2 transition-colors"
              style={{
                color: isActive
                  ? "var(--sk-gold)"
                  : "var(--sk-text-muted)",
              }}
            >
              <span
                className="italic"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "20px",
                  fontWeight: 500,
                  letterSpacing: "-0.005em",
                }}
              >
                {tab.label}
              </span>

              {/* Active underline — hairline gold */}
              {isActive && (
                <motion.div
                  layoutId="active-view-tab"
                  className="absolute left-0 right-0 -bottom-px h-px"
                  style={{ backgroundColor: "var(--sk-gold)" }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}