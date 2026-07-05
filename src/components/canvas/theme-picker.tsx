// components/canvas/theme-picker.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CanvasTheme,
  THEMES,
  loadTheme,
  saveTheme,
  applyTheme,
} from "@/lib/theme-store";

export function ThemePicker() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<CanvasTheme>("chocolate");
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load saved theme on mount
  useEffect(() => {
    const saved = loadTheme();
    setCurrent(saved);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleSelect(theme: CanvasTheme) {
    setCurrent(theme);
    saveTheme(theme);
    applyTheme(theme);
    setTimeout(() => setIsOpen(false), 300);
  }

  const currentMeta = THEMES.find((t) => t.id === current) || THEMES[0];

  return (
    <div className="relative">
      {/* TRIGGER — tiny elegant swatch preview */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ opacity: 0.75 }}
        whileTap={{ scale: 0.96 }}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all"
        style={{
          border: "1px solid var(--sk-border)",
          backgroundColor: "transparent",
        }}
        title="Change theme"
      >
        {/* Three tiny swatches showing current theme */}
        <div className="flex items-center gap-0.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentMeta.swatch.bg }}
          />
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentMeta.swatch.card }}
          />
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: currentMeta.swatch.accent }}
          />
        </div>
        <span
          className="font-mono text-[10px] tracking-[0.2em] uppercase hidden sm:inline"
          style={{ color: "var(--sk-text-muted)" }}
        >
          Theme
        </span>
      </motion.button>

      {/* POPUP */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full mt-3 z-50"
            style={{ minWidth: "280px" }}
          >
            <div
              className="rounded-xl p-3 backdrop-blur-xl"
              style={{
                backgroundColor: "var(--sk-bg-elevated)",
                border: "1px solid var(--sk-border-strong)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* Label */}
              <div
                className="px-3 pt-1 pb-3 font-mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "var(--sk-text-faint)" }}
              >
                Choose Atmosphere
              </div>

              {/* Theme options */}
              <div className="flex flex-col gap-1">
                {THEMES.map((theme) => {
                  const isActive = current === theme.id;
                  return (
                    <motion.button
                      key={theme.id}
                      onClick={() => handleSelect(theme.id)}
                      whileHover={{ x: 2 }}
                      className="flex items-center gap-3 p-3 rounded-lg transition-all text-left"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(255,255,255,0.04)"
                          : "transparent",
                        border: isActive
                          ? "1px solid var(--sk-border-accent)"
                          : "1px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive)
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.02)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      {/* Swatch preview — 4 colors */}
                      <div
                        className="flex-shrink-0 rounded-md overflow-hidden flex"
                        style={{
                          width: "44px",
                          height: "44px",
                          border: "1px solid var(--sk-border)",
                        }}
                      >
                        <div
                          style={{
                            flex: 2,
                            backgroundColor: theme.swatch.bg,
                          }}
                        />
                        <div className="flex flex-col" style={{ flex: 1 }}>
                          <div
                            style={{
                              flex: 1,
                              backgroundColor: theme.swatch.card,
                            }}
                          />
                          <div
                            style={{
                              flex: 1,
                              backgroundColor: theme.swatch.accent,
                            }}
                          />
                        </div>
                      </div>

                      {/* Name + tagline */}
                      <div className="flex-1 min-w-0">
                        <div
                          className="italic"
                          style={{
                            fontFamily:
                              "'Cormorant Garamond', Georgia, serif",
                            color: isActive
                              ? "var(--sk-text)"
                              : "var(--sk-text-muted)",
                            fontSize: "18px",
                            fontWeight: 500,
                            lineHeight: 1.2,
                          }}
                        >
                          {theme.name}
                        </div>
                        <div
                          className="italic mt-0.5"
                          style={{
                            fontFamily:
                              "'Cormorant Garamond', Georgia, serif",
                            color: "var(--sk-text-dim)",
                            fontSize: "13px",
                            lineHeight: 1.3,
                          }}
                        >
                          {theme.tagline}
                        </div>
                      </div>

                      {/* Active checkmark */}
                      {isActive && (
                        <div
                          className="flex-shrink-0 w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: "var(--sk-accent)",
                            boxShadow: "0 0 8px var(--sk-accent-glow)",
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer hint */}
              <div
                className="mt-2 pt-3 px-3 pb-1 font-mono text-[9px] tracking-[0.2em] uppercase text-center"
                style={{
                  color: "var(--sk-text-faint)",
                  borderTop: "1px solid var(--sk-border)",
                }}
              >
                Personality themes coming soon
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}