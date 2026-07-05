// components/canvas/canvas-header.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/brand/logo";
import { CanvasData } from "@/lib/canvas-store";
import { ThemePicker } from "@/components/canvas/theme-picker";

interface CanvasHeaderProps {
  canvas: CanvasData;
  completion: number;
  lastSaved: string | null;
  onProjectNameChange: (name: string) => void;
  onNewProject: () => void;
}

export function CanvasHeader({
  canvas,
  completion,
  lastSaved,
  onProjectNameChange,
  onNewProject,
}: CanvasHeaderProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(canvas.projectName);

  function handleNameBlur() {
    setEditingName(false);
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== canvas.projectName) {
      onProjectNameChange(trimmed);
    } else {
      setNameValue(canvas.projectName);
    }
  }

  function handleNameKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") (e.target as HTMLInputElement).blur();
    if (e.key === "Escape") {
      setNameValue(canvas.projectName);
      setEditingName(false);
    }
  }

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: "var(--sk-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--sk-border)",
      }}
    >
      {/* Hairline progress bar at top */}
      <div
        className="h-px w-full"
        style={{ backgroundColor: "var(--sk-border)" }}
      >
        <motion.div
          className="h-full"
          style={{ backgroundColor: "var(--sk-accent)" }}
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="flex items-center justify-between px-6 sm:px-10 py-5 gap-6">

        {/* LEFT — Logo */}
        <div className="flex-shrink-0">
          <Logo size="sm" />
        </div>

        {/* CENTER — Project name + status */}
        <div className="flex flex-col items-center gap-1 flex-1 min-w-0">
          {editingName ? (
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              maxLength={60}
              className="bg-transparent border-0 text-center outline-none italic"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text)",
                fontSize: "20px",
                fontWeight: 500,
                borderBottom: "1px solid var(--sk-border-accent)",
                paddingBottom: "2px",
                minWidth: "180px",
                maxWidth: "320px",
              }}
            />
          ) : (
            <button
              onClick={() => setEditingName(true)}
              className="italic transition-opacity hover:opacity-70"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text)",
                fontSize: "20px",
                fontWeight: 500,
                letterSpacing: "-0.005em",
              }}
              title="Rename project"
            >
              {canvas.projectName}
            </button>
          )}

          <div
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: "var(--sk-text-faint)" }}
          >
            {lastSaved ? `Saved ${lastSaved}` : "Saving..."}
          </div>
        </div>

        {/* RIGHT — Completion + Theme + New */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {/* Completion */}
          <div
            className="hidden md:block font-mono text-[11px] tracking-[0.2em] uppercase"
            style={{ color: "var(--sk-text-muted)" }}
          >
            <span style={{ color: "var(--sk-accent)" }}>
              {Math.round((completion / 100) * 11)}
            </span>
            <span style={{ color: "var(--sk-text-faint)" }}> / 11 </span>
            <span className="hidden lg:inline">complete</span>
          </div>

          {/* Divider */}
          <div
            className="hidden md:block w-px h-5"
            style={{ backgroundColor: "var(--sk-border)" }}
          />

          {/* Theme picker */}
          <ThemePicker />

          {/* Divider */}
          <div
            className="w-px h-5"
            style={{ backgroundColor: "var(--sk-border)" }}
          />

          {/* New Project */}
          <motion.button
            onClick={onNewProject}
            whileHover={{ opacity: 0.7 }}
            whileTap={{ scale: 0.97 }}
            className="font-mono text-[11px] tracking-[0.2em] uppercase transition-opacity"
            style={{ color: "var(--sk-text-muted)" }}
          >
            + New
          </motion.button>

        </div>
      </div>
    </header>
  );
}