// app/canvas/page.tsx

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasHeader } from "@/components/canvas/canvas-header";
import { ViewTabs, ViewMode } from "@/components/canvas/view-tabs";
import { DocumentView } from "@/components/canvas/document-view";
import {
  CanvasData,
  loadMostRecentCanvas,
  createNewCanvas,
  saveCanvas,
  getSectionCompletion,
} from "@/lib/canvas-store";

export default function CanvasPage() {
  const [canvas, setCanvas] = useState<CanvasData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("canvas");
  const [lastSavedText, setLastSavedText] = useState<string | null>("just now");
  const [isLoading, setIsLoading] = useState(true);

  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());

  // ─── LOAD CANVAS ON MOUNT ────────────────────────────────
  useEffect(() => {
    const existing = loadMostRecentCanvas();
    if (existing) {
      setCanvas(existing);
    } else {
      const fresh = createNewCanvas("My First Product");
      setCanvas(fresh);
    }
    setIsLoading(false);
  }, []);

  // ─── UPDATE "LAST SAVED" TEXT ────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastSaveTimeRef.current) / 1000);
      if (seconds < 5) setLastSavedText("just now");
      else if (seconds < 60) setLastSavedText(`${seconds}s ago`);
      else if (seconds < 3600) setLastSavedText(`${Math.floor(seconds / 60)} min ago`);
      else setLastSavedText(`${Math.floor(seconds / 3600)}h ago`);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ─── SAVE WITH DEBOUNCE ──────────────────────────────────
  const triggerSave = useCallback((data: CanvasData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setLastSavedText(null);

    saveTimerRef.current = setTimeout(() => {
      saveCanvas(data);
      lastSaveTimeRef.current = Date.now();
      setLastSavedText("just now");
    }, 1000);
  }, []);

  // ─── PROJECT NAME CHANGE ─────────────────────────────────
  const handleProjectNameChange = useCallback(
    (name: string) => {
      if (!canvas) return;
      const updated = { ...canvas, projectName: name };
      setCanvas(updated);
      triggerSave(updated);
    },
    [canvas, triggerSave]
  );

  // ─── NEW PROJECT ─────────────────────────────────────────
  const handleNewProject = useCallback(() => {
    const confirmed = window.confirm(
      "Start a new project? Your current canvas will be saved."
    );
    if (!confirmed) return;

    if (canvas) saveCanvas(canvas);

    const projectName = window.prompt("What's the name of your new project?", "My New Product");
    if (!projectName) return;

    const fresh = createNewCanvas(projectName.trim());
    setCanvas(fresh);
    setLastSavedText("just now");
    lastSaveTimeRef.current = Date.now();

    try {
      localStorage.removeItem("sidekick_manifesto_seen");
    } catch {}

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [canvas]);

  // ─── LOADING STATE ───────────────────────────────────────
  if (isLoading || !canvas) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--sk-bg)" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full"
          style={{
            border: "1px solid rgba(240,230,210,0.08)",
            borderTopColor: "var(--sk-accent)",
          }}
        />
      </div>
    );
  }

  const completion = getSectionCompletion(canvas.sections);

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: "var(--sk-bg)" }}
    >
      {/* HEADER (sticky) */}
      <CanvasHeader
        canvas={canvas}
        completion={completion}
        lastSaved={lastSavedText}
        onProjectNameChange={handleProjectNameChange}
        onNewProject={handleNewProject}
      />

      {/* VIEW TABS */}
      <ViewTabs current={viewMode} onChange={setViewMode} />

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-32">
        <AnimatePresence mode="wait">

          {/* CANVAS MODE — placeholder for now, will be bento grid later */}
          {viewMode === "canvas" && (
            <motion.div
              key="canvas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center py-40 text-center"
            >
              <p
                className="text-xs uppercase tracking-widest mb-6"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--sk-accent)",
                  opacity: 0.6,
                }}
              >
                Visual Workspace
              </p>
              <h2
                className="text-3xl italic mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--sk-text)",
                }}
              >
                Your Canvas
              </h2>
              <p
                className="text-sm max-w-md"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--sk-text)",
                  opacity: 0.5,
                  lineHeight: "1.7",
                  marginBottom: "24px",
                }}
              >
                Bento grid, mindmaps, and roadmaps generated from your Studio chats.
                Coming in the next build.
              </p>
              <p
                className="text-xs italic"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--sk-text)",
                  opacity: 0.35,
                }}
              >
                For now, head to <span style={{ color: "var(--sk-accent)", opacity: 1 }}>Studio</span> to think, or <span style={{ color: "var(--sk-accent)", opacity: 1 }}>Document</span> to publish.
              </p>
            </motion.div>
          )}

          {/* DOCUMENT MODE — editorial doc + PDF export */}
          {viewMode === "document" && (
            <DocumentView key="document" canvas={canvas} />
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}