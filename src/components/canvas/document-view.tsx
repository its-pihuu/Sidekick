// src/components/canvas/document-view.tsx
// Editorial document layout + PDF export + palette picker

"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { CanvasData } from "@/lib/canvas-store";
import { getSectionsInOrder } from "@/data/canvas-sections";
import { getProfile } from "@/lib/onboarding-store";
import {
  DocumentPalette,
  PALETTES,
  loadPalette,
  savePalette,
} from "@/lib/document-palette";

interface DocumentViewProps {
  canvas: CanvasData;
}

export function DocumentView({ canvas }: DocumentViewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [palette, setPalette] = useState<DocumentPalette>("classic");
  const [pickerOpen, setPickerOpen] = useState(false);

  // Load saved palette on mount
  useEffect(() => {
    setPalette(loadPalette());
  }, []);

  const handlePaletteChange = (id: DocumentPalette) => {
    setPalette(id);
    savePalette(id);
    setPickerOpen(false);
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${canvas.projectName || "Sidekick Plan"} · Sidekick`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  const sections = getSectionsInOrder();
  const profile = getProfile();
  const filledSections = sections.filter(
    (s) => canvas.sections[s.id] && canvas.sections[s.id].trim().length > 0
  );
  const p = PALETTES[palette]; // active palette

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const completion = Math.round(
    (filledSections.length / sections.length) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="pt-4"
    >
      {/* ─── TOP BAR (not printed) ─────────────────────────────────── */}
      <div
        className="max-w-3xl mx-auto flex items-center justify-between mb-8 pb-6 gap-4"
        style={{ borderBottom: "1px solid rgba(240,230,210,0.08)" }}
      >
        <div>
          <p
            className="text-[10px] uppercase tracking-widest mb-1"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--sk-accent)",
              opacity: 0.7,
            }}
          >
            Document · {completion}% complete
          </p>
          <p
            className="text-xs"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "var(--sk-text)",
              opacity: 0.4,
            }}
          >
            {filledSections.length} of {sections.length} sections written
          </p>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* ─── PALETTE PICKER ────────────────────────────────────── */}
          <div className="relative">
            <button
              onClick={() => setPickerOpen((prev) => !prev)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-[10px] uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                backgroundColor: "transparent",
                color: "var(--sk-text)",
                border: "1px solid rgba(240,230,210,0.15)",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{
                  background: p.swatchOuter,
                  border: `2px solid ${p.swatchInner}`,
                }}
              />
              Palette
            </button>

            <AnimatePresence>
              {pickerOpen && (
                <>
                  {/* Backdrop to close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setPickerOpen(false)}
                  />

                  {/* Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 mt-2 w-64 z-50 overflow-hidden"
                    style={{
                      backgroundColor: "var(--sk-bg-card)",
                      border: "1px solid rgba(240,230,210,0.1)",
                      borderRadius: "3px",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                    }}
                  >
                    <div
                      className="px-4 py-3"
                      style={{
                        borderBottom: "1px solid rgba(240,230,210,0.08)",
                      }}
                    >
                      <p
                        className="text-[9px] uppercase tracking-widest"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "var(--sk-accent)",
                          opacity: 0.6,
                        }}
                      >
                        Choose a palette
                      </p>
                    </div>

                    <div className="py-2">
                      {Object.values(PALETTES).map((option) => {
                        const isActive = option.id === palette;
                        return (
                          <button
                            key={option.id}
                            onClick={() => handlePaletteChange(option.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                            style={{
                              background: isActive
                                ? "rgba(240,230,210,0.05)"
                                : "transparent",
                              cursor: "pointer",
                              border: "none",
                            }}
                          >
                            {/* Swatch */}
                            <span
                              className="w-6 h-6 rounded-full flex-shrink-0"
                              style={{
                                background: option.swatchOuter,
                                border: `2px solid ${option.swatchInner}`,
                              }}
                            />
                            <div className="flex-1">
                              <p
                                className="text-sm"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  color: "var(--sk-text)",
                                  opacity: isActive ? 1 : 0.85,
                                }}
                              >
                                {option.name}
                              </p>
                              <p
                                className="text-[10px]"
                                style={{
                                  fontFamily: "'Inter', sans-serif",
                                  color: "var(--sk-text)",
                                  opacity: 0.45,
                                }}
                              >
                                {option.description}
                              </p>
                            </div>
                            {isActive && (
                              <span
                                className="text-[9px] uppercase tracking-widest"
                                style={{
                                  fontFamily: "'JetBrains Mono', monospace",
                                  color: "var(--sk-accent)",
                                }}
                              >
                                Active
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* ─── DOWNLOAD PDF ──────────────────────────────────────── */}
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 text-[10px] uppercase tracking-widest transition-opacity hover:opacity-80"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              backgroundColor: "var(--sk-accent)",
              color: "var(--sk-bg)",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* ─── EMPTY STATE ────────────────────────────────────────────── */}
      {filledSections.length === 0 ? (
        <div className="max-w-3xl mx-auto text-center py-32">
          <div
            className="w-8 h-px mx-auto mb-6"
            style={{ backgroundColor: "var(--sk-accent)" }}
          />
          <p
            className="text-2xl italic mb-3"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "var(--sk-text)",
            }}
          >
            Nothing to document yet.
          </p>
          <p
            className="text-sm max-w-xs mx-auto"
            style={{
              fontFamily: "'Inter', sans-serif",
              color: "var(--sk-text)",
              opacity: 0.4,
              lineHeight: 1.7,
            }}
          >
            Head to <span style={{ color: "var(--sk-accent)" }}>Write</span> mode and fill a section.
            Your plan will start taking shape here.
          </p>
        </div>
      ) : (
        /* ─── PRINTABLE DOCUMENT ─────────────────────────────────── */
        <div
          ref={printRef}
          className="max-w-3xl mx-auto px-10 sm:px-16 py-16 sm:py-20 print-document"
          style={{
            backgroundColor: p.bg,
            color: p.text,
            borderRadius: "4px",
            minHeight: "80vh",
          }}
        >
          {/* ─── COVER ─────────────────────────────────────────────── */}
          <div className="text-center mb-16">
            <p
              className="text-[10px] uppercase tracking-widest mb-10"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: p.label,
                opacity: 0.75,
              }}
            >
              — Product Plan —
            </p>

            <h1
              className="italic mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(40px, 6vw, 68px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: p.heading,
              }}
            >
              {canvas.projectName || "Untitled Plan"}
            </h1>

            <div
              className="w-16 h-px mx-auto my-8"
              style={{ backgroundColor: p.divider, opacity: 0.35 }}
            />

            <div
              className="text-[10px] uppercase tracking-widest space-y-2"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: p.label,
                opacity: 0.8,
              }}
            >
              {profile.name && <p>By {profile.name}</p>}
              <p>{today}</p>
            </div>
          </div>

          {/* ─── SECTIONS ──────────────────────────────────────────── */}
          <div className="space-y-14">
            {filledSections.map((section, i) => (
              <div key={section.id} className="section-block">
                {/* Section number + label */}
                <p
                  className="text-[10px] uppercase tracking-widest mb-3"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: p.label,
                    opacity: 0.75,
                  }}
                >
                  Section · {String(i + 1).padStart(2, "0")}
                </p>

                {/* Section title */}
                <h2
                  className="italic mb-6"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(28px, 3.5vw, 38px)",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                    color: p.heading,
                  }}
                >
                  {section.title}
                </h2>

                {/* Content */}
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "15px",
                    lineHeight: 1.75,
                    whiteSpace: "pre-wrap",
                    color: p.text,
                    opacity: 0.9,
                  }}
                >
                  {canvas.sections[section.id]}
                </div>

                {/* Hairline divider */}
                {i < filledSections.length - 1 && (
                  <div
                    className="w-full h-px mt-14"
                    style={{ backgroundColor: p.divider, opacity: 0.1 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ─── FOOTER ────────────────────────────────────────────── */}
          <div
            className="text-center mt-20 pt-8"
            style={{ borderTop: `1px solid ${p.divider}`, opacity: 1 }}
          >
            <p
              className="text-[10px] uppercase tracking-widest"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: p.label,
                opacity: 0.55,
              }}
            >
              Built with Sidekick·
            </p>
          </div>
        </div>
      )}

      {/* ─── PRINT STYLES ──────────────────────────────────────────── */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-document,
          .print-document * {
            visibility: visible;
          }
          .print-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border-radius: 0 !important;
            padding: 40px 60px !important;
          }
          .section-block {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </motion.div>
  );
}