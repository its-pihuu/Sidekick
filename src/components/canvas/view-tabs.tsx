"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export type ViewMode = "canvas" | "document";

interface ViewTabsProps {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const TABS: { id: ViewMode; label: string }[] = [
  { id: "canvas", label: "Canvas" },
  { id: "document", label: "Document" },
];

export function ViewTabs({ current, onChange }: ViewTabsProps) {
  const router = useRouter();

  return (
    <div className="relative z-10 flex items-center justify-center gap-10 pt-8 pb-6">
      {/* STUDIO — first, links to /studio */}
      <button
        onClick={() => router.push("/studio")}
        className="relative"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px 4px",
        }}
      >
        <span
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "20px",
            fontStyle: "italic",
            fontWeight: 400,
            color: "var(--sk-text)",
            opacity: 0.55,
            transition: "opacity 0.25s",
            letterSpacing: "0.01em",
          }}
          className="hover:opacity-100"
        >
          Studio
        </span>
      </button>

      {/* CANVAS / DOCUMENT tabs */}
      {TABS.map((tab) => {
        const isActive = current === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "6px 4px",
            }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "20px",
                fontStyle: "italic",
                fontWeight: isActive ? 700 : 400,
                color: "var(--sk-text)",
                opacity: isActive ? 1 : 0.45,
                transition: "opacity 0.25s, font-weight 0.25s",
                letterSpacing: "0.01em",
              }}
            >
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId="active-tab-underline"
                className="absolute -bottom-1 left-0 right-0"
                style={{
                  height: "1px",
                  background: "var(--sk-accent)",
                  opacity: 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}