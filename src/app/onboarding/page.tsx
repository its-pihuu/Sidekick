// src/app/onboarding/page.tsx

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { onboardingQuestions } from "@/data/onboarding-questions";
import { QuestionScreen } from "@/components/onboarding/question-screen";
import { CalibrationScreen } from "@/components/onboarding/calibration-screen";
import { ManifestoScreen } from "@/components/onboarding/manifesto-screen";
import { RevealScreen } from "@/components/onboarding/reveal-screen";
import {
  saveProfile,
  hasSeenManifesto,
  markManifestoSeen,
} from "@/lib/onboarding-store";

type Phase = "welcome" | "questions" | "calibrating" | "manifesto" | "reveal";

export default function OnboardingPage() {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // ─── APPLY DARK GREEN "ONBOARDING" PALETTE ────────────────────────────────
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("zone-onboarding");
    return () => {
      html.classList.remove("zone-onboarding");
    };
  }, []);

  const handleAnswer = (value: string) => {
    const question = onboardingQuestions[questionIndex];
    const newAnswers = { ...answers, [question.field]: value };
    setAnswers(newAnswers);
    saveProfile({ [question.field]: value });

    if (questionIndex < onboardingQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setPhase("calibrating");
    }
  };

  const handleBack = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    } else {
      setPhase("welcome");
    }
  };

  const handleCalibrationComplete = () => {
    if (!hasSeenManifesto()) {
      setPhase("manifesto");
    } else {
      setPhase("reveal");
    }
  };

  const handleManifestoComplete = () => {
    markManifestoSeen();
    setPhase("reveal");
  };

  return (
    <main
      className="min-h-screen flex flex-col overflow-hidden relative"
      style={{ backgroundColor: "var(--sk-bg)" }}
    >
      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Small wordmark in corner (minimal) */}
      <div className="relative z-10 px-8 sm:px-12 py-8 flex justify-between items-center">
        <div className="flex items-end leading-none">
          <span
            className="italic"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "var(--sk-text)",
              fontSize: "22px",
              fontWeight: 500,
            }}
          >
            Sidekick
          </span>
          <span
            className="w-1 h-1 rounded-full ml-1 mb-1"
            style={{
              backgroundColor: "var(--sk-accent)",
              boxShadow: "0 0 6px var(--sk-accent-soft)",
            }}
          />
        </div>

        {phase === "welcome" && (
          <Link
            href="/"
            className="font-mono text-[10px] tracking-[0.25em] uppercase transition-opacity hover:opacity-70"
            style={{ color: "var(--sk-text-muted)" }}
          >
            ← Home
          </Link>
        )}
      </div>

      {/* Main content — centered */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center px-6 pb-16">
        <AnimatePresence mode="wait">

          {/* ─── WELCOME ─────────────────────────────────────────────── */}
          {phase === "welcome" && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-3xl"
            >
              {/* Tiny label */}
              <div
                className="font-mono text-[11px] tracking-[0.3em] uppercase mb-8"
                style={{ color: "var(--sk-text-faint)" }}
              >
                — Before we begin —
              </div>

              {/* Headline */}
              <h1
                className="italic mb-8"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "var(--sk-text)",
                  fontSize: "clamp(44px, 7vw, 88px)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                Let&apos;s give your idea
                <br />
                <span style={{ color: "var(--sk-accent)" }}>
                  a real plan.
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="italic max-w-xl mx-auto mb-14"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "var(--sk-text-muted)",
                  fontSize: "clamp(18px, 2.2vw, 22px)",
                  lineHeight: 1.5,
                }}
              >
                Seven quiet questions. Two minutes.
                <br />
                We&apos;ll learn how you think.
              </p>

              {/* CTA */}
              <motion.button
                onClick={() => setPhase("questions")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-4 rounded-md font-mono text-[11px] tracking-[0.25em] uppercase transition-all"
                style={{
                  backgroundColor: "var(--sk-accent)",
                  color: "var(--sk-bg)",
                  boxShadow: "0 8px 32px var(--sk-accent-glow)",
                }}
              >
                Begin
              </motion.button>

              {/* Tiny reassurance */}
              <p
                className="mt-10 font-mono text-[10px] tracking-[0.25em] uppercase"
                style={{ color: "var(--sk-text-faint)" }}
              >
                Your answers stay on your device.
              </p>
            </motion.div>
          )}

          {/* ─── QUESTIONS ────────────────────────────────────────────── */}
          {phase === "questions" && (
            <QuestionScreen
              key={`q-${questionIndex}`}
              question={onboardingQuestions[questionIndex]}
              current={questionIndex + 1}
              total={onboardingQuestions.length}
              onAnswer={handleAnswer}
              onBack={questionIndex > 0 ? handleBack : undefined}
              initialValue={answers[onboardingQuestions[questionIndex].field] || ""}
            />
          )}

          {/* ─── CALIBRATING ─────────────────────────────────────────── */}
          {phase === "calibrating" && (
            <CalibrationScreen
              key="calibrating"
              onComplete={handleCalibrationComplete}
            />
          )}

          {/* ─── MANIFESTO ───────────────────────────────────────────── */}
          {phase === "manifesto" && (
            <ManifestoScreen
              key="manifesto"
              userName={answers.name || "founder"}
              onComplete={handleManifestoComplete}
            />
          )}

          {/* ─── REVEAL ──────────────────────────────────────────────── */}
          {phase === "reveal" && (
            <RevealScreen
              key="reveal"
              userName={answers.name || "founder"}
            />
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}