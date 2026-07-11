// src/components/canvas/document-view.tsx
// Editorial document layout + PDF export

"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useReactToPrint } from "react-to-print";
import { CanvasData } from "@/lib/canvas-store";
import { getSectionsInOrder } from "@/data/canvas-sections";
import { getProfile } from "@/lib/onboarding-store";

interface DocumentViewProps {
  canvas: CanvasData;
}

export function DocumentView({ canvas }: DocumentViewProps) {
  const printRef = useRef<HTMLDivElement>(null);

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
        className="max-w-3xl mx-auto flex items-center justify-between mb-8 pb-6"
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
          className="max-w-3xl mx-auto px-8 py-16 print-document"
          style={{
            backgroundColor: "var(--sk-card-bg, #F0E6D2)",
            color: "var(--sk-card-text, #2A0A0E)",
            borderRadius: "4px",
            minHeight: "80vh",
          }}
        >
          {/* ─── COVER ─────────────────────────────────────────────── */}
          <div className="text-center mb-20">
            <p
              className="text-[10px] uppercase tracking-widest mb-8"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                opacity: 0.5,
              }}
            >
              — Product Plan —
            </p>

            <h1
              className="italic mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(40px, 6vw, 64px)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              {canvas.projectName || "Untitled Plan"}
            </h1>

            <div
              className="w-12 h-px mx-auto my-8"
              style={{ backgroundColor: "currentColor", opacity: 0.3 }}
            />

            <div
              className="text-xs uppercase tracking-widest space-y-2"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                opacity: 0.6,
              }}
            >
              {profile.name && <p>By {profile.name}</p>}
              <p>{today}</p>
            </div>
          </div>

          {/* ─── SECTIONS ──────────────────────────────────────────── */}
          <div className="space-y-16">
            {filledSections.map((section, i) => (
              <div key={section.id} className="section-block">
                {/* Section number + label */}
                <p
                  className="text-[10px] uppercase tracking-widest mb-3"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    opacity: 0.5,
                  }}
                >
                  Section · {String(i + 1).padStart(2, "0")}
                </p>

                {/* Section title */}
                <h2
                  className="italic mb-6"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(28px, 3.5vw, 36px)",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
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
                    opacity: 0.85,
                  }}
                >
                  {canvas.sections[section.id]}
                </div>

                {/* Hairline divider */}
                {i < filledSections.length - 1 && (
                  <div
                    className="w-full h-px mt-16"
                    style={{ backgroundColor: "currentColor", opacity: 0.08 }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ─── FOOTER ────────────────────────────────────────────── */}
          <div
            className="text-center mt-20 pt-8"
            style={{ borderTop: "1px solid currentColor" }}
          >
            <p
              className="text-[10px] uppercase tracking-widest"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                opacity: 0.4,
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
            background: #ffffff !important;
            color: #000000 !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          .section-block {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </motion.div>
  );
}