// app/canvas/page.tsx

"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasHeader } from "@/components/canvas/canvas-header";
import { ViewTabs, ViewMode } from "@/components/canvas/view-tabs";
import { SectionCard } from "@/components/canvas/section-card";
import { AIPopup } from "@/components/canvas/ai-popup";
import { getSectionsInOrder } from "@/data/canvas-sections";
import {
  CanvasData,
  loadMostRecentCanvas,
  createNewCanvas,
  saveCanvas,
  updateSection,
  getSectionCompletion,
} from "@/lib/canvas-store";

export default function CanvasPage() {
  const [canvas, setCanvas] = useState<CanvasData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [lastSavedText, setLastSavedText] = useState<string | null>("just now");
  const [isLoading, setIsLoading] = useState(true);
  const [aiPopupSection, setAiPopupSection] = useState<string | null>(null);

  // Debounce timer ref
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTimeRef = useRef<number>(Date.now());

  // ─── LOAD CANVAS ON MOUNT ────────────────────────────────────────────────
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

  // ─── UPDATE "LAST SAVED" TEXT EVERY 30s ──────────────────────────────────
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

  // ─── SAVE WITH DEBOUNCE (1 second after user stops typing) ───────────────
  const triggerSave = useCallback((data: CanvasData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setLastSavedText(null);

    saveTimerRef.current = setTimeout(() => {
      saveCanvas(data);
      lastSaveTimeRef.current = Date.now();
      setLastSavedText("just now");
    }, 1000);
  }, []);

  // ─── HANDLE SECTION EDIT ─────────────────────────────────────────────────
  const handleSectionChange = useCallback(
    (sectionId: string, content: string) => {
      if (!canvas) return;
      const updated = updateSection(canvas, sectionId, content);
      setCanvas(updated);
      triggerSave(updated);
    },
    [canvas, triggerSave]
  );

  // ─── HANDLE PROJECT NAME CHANGE ──────────────────────────────────────────
  const handleProjectNameChange = useCallback(
    (name: string) => {
      if (!canvas) return;
      const updated = { ...canvas, projectName: name };
      setCanvas(updated);
      triggerSave(updated);
    },
    [canvas, triggerSave]
  );

  // ─── NEW PROJECT ─────────────────────────────────────────────────────────
  const handleNewProject = useCallback(() => {
    const confirmed = window.confirm(
      "Start a new project? Your current canvas will be saved and you can come back to it later."
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

  // ─── AI POPUP ─────────────────────────────────────────────────────────────
  const handleAIClick = useCallback((sectionId: string) => {
    setAiPopupSection(sectionId);
  }, []);

  // ─── LOADING STATE ───────────────────────────────────────────────────────
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

  const sections = getSectionsInOrder();
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

          {/* WRITE MODE */}
          {viewMode === "edit" && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 sm:space-y-8 pt-4"
            >
              {/* Intro line */}
              <div className="text-center mb-8 pt-2">
                <p
                  className="text-sm italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--sk-text)",
                    opacity: 0.4,
                    letterSpacing: "0.02em",
                  }}
                >
                  Fill these in one at a time. Auto-saves as you type.
                </p>
              </div>

              {sections.map((section, i) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  content={canvas.sections[section.id] || ""}
                  onChange={(content) => handleSectionChange(section.id, content)}
                  onAIClick={handleAIClick}
                  index={i}
                />
              ))}

              {/* Bottom encouragement */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center pt-12 pb-4"
              >
                <p
                  className="text-base italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--sk-text)",
                    opacity: 0.35,
                    letterSpacing: "0.02em",
                  }}
                >
                  {completion === 100
                    ? "You did it. Now go build it."
                    : completion >= 50
                    ? "Halfway there. The hard part is behind you."
                    : completion > 0
                    ? "Progress over perfection. Keep writing."
                    : "Every empire started as a sketch. Start anywhere."}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* CANVAS MODE — placeholder */}
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
                Coming Next
              </p>
              <h2
                className="text-3xl italic mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--sk-text)",
                }}
              >
                Canvas View
              </h2>
              <p
                className="text-sm max-w-xs"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--sk-text)",
                  opacity: 0.4,
                  lineHeight: "1.7",
                }}
              >
                Your eleven sections as a visual bento grid.
                See the whole picture at once.
              </p>
            </motion.div>
          )}

          {/* DOCUMENT MODE — placeholder */}
          {viewMode === "document" && (
            <motion.div
              key="document"
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
                Coming Next
              </p>
              <h2
                className="text-3xl italic mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--sk-text)",
                }}
              >
                Document View
              </h2>
              <p
                className="text-sm max-w-xs"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--sk-text)",
                  opacity: 0.4,
                  lineHeight: "1.7",
                }}
              >
                A clean, export-ready document from your canvas.
                PDF download included.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* AI POPUP — real Gemini-powered chat */}
      <AnimatePresence>
        {aiPopupSection && (
          <AIPopup
            sectionId={aiPopupSection}
            sectionName={
              sections.find((s) => s.id === aiPopupSection)?.title || "this section"
            }
            sectionContent={canvas.sections[aiPopupSection] || ""}
            onClose={() => setAiPopupSection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}