// components/onboarding/manifesto-screen.tsx

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ManifestoScreenProps {
  userName: string;
  onComplete: () => void;
}

interface Slide {
  title: string;
  subtitle: string;
  highlight?: string;
}

export function ManifestoScreen({ userName, onComplete }: ManifestoScreenProps) {
  const slides: Slide[] = [
    {
      title: "Your idea has been collecting dust in your head.",
      subtitle: "Today, we put it on paper.",
      highlight: "collecting dust",
    },
    {
      title: "I won't hype you up like your group chat does.",
      subtitle: "I'll give you the plan they can't.",
      highlight: "the plan they can't",
    },
    {
      title: `Every empire started as a sketch, ${userName || "founder"}.`,
      subtitle: "Let's draw yours.",
      highlight: userName || "founder",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  // Auto-advance every 6s (except last — user must confirm)
  useEffect(() => {
    if (isLastSlide) return;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide, isLastSlide]);

  const slide = slides[currentSlide];

  // Split the title around the highlight so we can style it
  function renderTitle() {
    if (!slide.highlight || !slide.title.includes(slide.highlight)) {
      return slide.title;
    }
    const [before, after] = slide.title.split(slide.highlight);
    return (
      <>
        {before}
        <span style={{ color: "var(--sk-accent)" }} className="italic">
          {slide.highlight}
        </span>
        {after}
      </>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 relative min-h-[70vh] flex flex-col items-center justify-center">

      {/* Tiny magazine label */}
      <div
        className="font-mono text-[11px] tracking-[0.3em] uppercase mb-14"
        style={{ color: "var(--sk-text-faint)" }}
      >
        — Sidekick, to you —
      </div>

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          {/* Big italic title */}
          <h1
            className="italic mb-8"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "var(--sk-text)",
              fontSize: "clamp(36px, 6vw, 76px)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {renderTitle()}
          </h1>

          {/* Subtitle */}
          <p
            className="italic"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "var(--sk-text-muted)",
              fontSize: "clamp(20px, 2.8vw, 30px)",
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            {slide.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Dot pagination — hairline elegance */}
      <div className="flex items-center gap-3 mt-20">
        {slides.map((_, i) => {
          const isActive = i === currentSlide;
          const isPast = i < currentSlide;
          return (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-500"
              style={{
                width: isActive ? "28px" : "6px",
                height: "2px",
                backgroundColor: isActive
                  ? "var(--sk-accent)"
                  : isPast
                  ? "var(--sk-text-muted)"
                  : "var(--sk-border-strong)",
                boxShadow: isActive
                  ? "0 0 8px var(--sk-accent-glow)"
                  : "none",
              }}
            />
          );
        })}
      </div>

      {/* CTA on last slide */}
      <AnimatePresence>
        {isLastSlide && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14"
          >
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-12 py-4 rounded-md font-mono text-[11px] tracking-[0.25em] uppercase transition-all"
              style={{
                backgroundColor: "var(--sk-accent)",
                color: "var(--sk-bg)",
                boxShadow: "0 8px 32px var(--sk-accent-glow)",
              }}
            >
              I&apos;m ready →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip link — bottom right, subtle */}
      {!isLastSlide && (
        <button
          onClick={handleNext}
          className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.25em] uppercase transition-opacity hover:opacity-100"
          style={{ color: "var(--sk-text-faint)" }}
        >
          Skip →
        </button>
      )}
    </div>
  );
}