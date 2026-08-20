// src/app/page.tsx
// SIDEKICK — Full Luxury Landing Page (Mobile Responsive)

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CinematicIntro } from "@/components/brand/cinematic-intro";

// ─── DATA ────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Answer 6 questions.",
    detail: "We learn how you think — your stage, your blocker, your vision.",
  },
  {
    step: "02",
    title: "Chat with your Sidekick.",
    detail: "Thirteen specialist AIs led by The Architect. Every angle sharpened.",
  },
  {
    step: "03",
    title: "Ship your plan.",
    detail: "A real executable document. Ready to share or execute.",
  },
];

const WHATS_INSIDE = [
  "The Problem",
  "Your Solution",
  "Target Users",
  "Value Proposition",
  "Revenue Model",
  "Competitors",
  "Key Features",
  "Go-To-Market",
  "Key Metrics",
  "Risks & Assumptions",
  "The Big Vision",
];

const BELIEFS = [
  { n: "01", text: "Your idea isn't bad. Your plan is." },
  { n: "02", text: "Stop pitching your idea to your dog. Pitch it to your Sidekick." },
  { n: "03", text: "Dreams in your head. Specs on the page. Product in the world." },
  { n: "04", text: "Every empire started as a sketch." },
  { n: "05", text: "Confused ideas ship confused products." },
  { n: "06", text: "The gap between dreamers and builders is one document." },
  { n: "07", text: "Sure, build without a plan. We love bankruptcy stories." },
  { n: "08", text: "AI can't sharpen an idea you haven't written down." },
  { n: "09", text: "Your cofounder isn't psychic. Write it down." },
];

const TESTIMONIALS = [
  "I'd been sitting on the same idea for eight months. Sidekick turned it into a plan in an afternoon.",
  "It's like having a strategist on retainer, minus the ₹50,000/hour bill.",
  "Finally — an AI that pushes back instead of just agreeing with me.",
  "Walked in with a vague hunch. Walked out with a pitch deck outline. That's the whole promise.",
];

const FAQS = [
  {
    q: "Who is this for?",
    a: "First-time founders, indie hackers, students with an idea, side-project builders — anyone who has more vision than plan.",
  },
  {
    q: "Is it really free?",
    a: "Yes. 100% free. All 13 AI specialists are unlocked with zero tier gating.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT is a blank box. Sidekick has 13 specialist personas with signature moves, project workspace isolation, and The Architect voice.",
  },
  {
    q: "Do I need to know how to code?",
    a: "No. Sidekick is for thinkers, not coders. If you can type, you can use it.",
  },
  {
    q: "What happens to my data?",
    a: "Everything stays in your browser's localStorage. We don't sell your ideas. We don't train models on them.",
  },
  {
    q: "Are the AIs available right now?",
    a: "Live now. All 13 AI specialists, voice input, and image analysis are working today.",
  },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter();
  const [introDone, setIntroDone] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [isReturningUser, setIsReturningUser] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);

  // ─── CHECK IF USER HAS COMPLETED ONBOARDING ────────────────
  useEffect(() => {
    try {
      const onboarded = localStorage.getItem("sidekick_onboarded");
      if (onboarded === "true") {
        setIsReturningUser(true);
      }
    } catch {
      // localStorage unavailable — treat as new user
    }
    setCheckedAuth(true);
  }, []);

  // ─── AUTO-REDIRECT RETURNING USERS AFTER INTRO ──────────────
  useEffect(() => {
    if (introDone && isReturningUser && checkedAuth) {
      router.push("/studio");
    }
  }, [introDone, isReturningUser, checkedAuth, router]);

  const primaryCTA = isReturningUser ? "/studio" : "/onboarding";
  const primaryCTALabel = isReturningUser ? "Continue" : "Begin";

  return (
    <>
      {!introDone && <CinematicIntro onComplete={() => setIntroDone(true)} />}

      <main
        className="min-h-screen relative overflow-x-hidden"
        style={{ backgroundColor: "var(--sk-bg)" }}
      >
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HEADER                                                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <header className="relative z-10 flex justify-between items-center px-5 sm:px-12 py-6 sm:py-8">
          <div className="flex items-end leading-none">
            <span
              className="italic"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text)",
                fontSize: "24px",
                fontWeight: 500,
              }}
            >
              Sidekick
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full ml-1.5 mb-1.5"
              style={{
                backgroundColor: "var(--sk-accent)",
                boxShadow: "0 0 8px var(--sk-accent-soft)",
              }}
            />
          </div>

          <nav className="flex items-center gap-5 sm:gap-8">
            <Link
              href="/about"
              className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
              style={{ color: "var(--sk-text-muted)" }}
            >
              About
            </Link>
            <a
              href="#beliefs"
              className="hidden sm:block font-mono text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
              style={{ color: "var(--sk-text-muted)" }}
            >
              Beliefs
            </a>
            <Link
              href={primaryCTA}
              className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
              style={{ color: "var(--sk-accent)" }}
            >
              {isReturningUser ? "Continue →" : "Enter →"}
            </Link>
          </nav>
        </header>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HERO                                                              */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="relative flex flex-col items-center justify-center px-5 sm:px-6 text-center pt-16 sm:pt-24 pb-20 sm:pb-32">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: introDone ? 0.2 : 3.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 max-w-5xl"
          >
            <div
              className="font-mono text-[9px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-10"
              style={{ color: "var(--sk-text-faint)" }}
            >
              — For the founder with an idea —
            </div>

            <h1
              className="italic mb-6 sm:mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text)",
                fontSize: "clamp(38px, 7.5vw, 104px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.08,
              }}
            >
              Walk in with a vision.
              <br />
              <span style={{ color: "var(--sk-accent)" }}>
                Walk out with a plan.
              </span>
            </h1>

            <p
              className="italic max-w-2xl mx-auto mb-10 sm:mb-14 px-2"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text-muted)",
                fontSize: "clamp(16px, 2.2vw, 24px)",
                lineHeight: 1.45,
              }}
            >
              The thinking partner that turns your messy idea into a real product plan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href={primaryCTA} className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-md font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase transition-all"
                  style={{
                    backgroundColor: "var(--sk-accent)",
                    color: "var(--sk-bg)",
                    boxShadow: "0 8px 32px var(--sk-accent-glow)",
                  }}
                >
                  {primaryCTALabel}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* PROBLEM                                                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionWrap>
          <SectionLabel>The Problem</SectionLabel>
          <SectionHeadline>
            Your idea is dying in your head.
          </SectionHeadline>
          <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
            <p
              className="italic"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text-muted)",
                fontSize: "clamp(18px, 2.5vw, 22px)",
                lineHeight: 1.6,
              }}
            >
              You&apos;ve pitched it to your friends. To your dog. To yourself, at 2 a.m.
            </p>
            <p
              className="italic"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text-muted)",
                fontSize: "clamp(18px, 2.5vw, 22px)",
                lineHeight: 1.6,
              }}
            >
              It still lives nowhere but inside you.
            </p>
            <div className="pt-6 sm:pt-8">
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "var(--sk-accent)",
                  fontSize: "clamp(20px, 3vw, 32px)",
                  fontStyle: "italic",
                  lineHeight: 1.3,
                }}
              >
                Sidekick is where it finally lands on paper.
              </p>
            </div>
          </div>
        </SectionWrap>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HOW IT WORKS                                                      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionWrap id="how">
          <SectionLabel>How It Works</SectionLabel>
          <SectionHeadline>Three quiet steps.</SectionHeadline>

          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 sm:gap-12 mt-6 sm:mt-8">
            {HOW_IT_WORKS.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="text-center px-2"
              >
                <div
                  className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase mb-4 sm:mb-6"
                  style={{ color: "var(--sk-accent)" }}
                >
                  Step · {s.step}
                </div>
                <h3
                  className="italic mb-3 sm:mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "var(--sk-text)",
                    fontSize: "clamp(22px, 3vw, 32px)",
                    fontWeight: 500,
                    lineHeight: 1.2,
                  }}
                >
                  {s.title}
                </h3>
                <p
                  className="italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "var(--sk-text-muted)",
                    fontSize: "16px",
                    lineHeight: 1.6,
                  }}
                >
                  {s.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionWrap>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WHAT'S INSIDE                                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionWrap>
          <SectionLabel>What&apos;s Inside</SectionLabel>
          <SectionHeadline>Eleven sections. Every question that matters.</SectionHeadline>

          <div className="max-w-4xl mx-auto mt-6 sm:mt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 sm:gap-y-4">
              {WHATS_INSIDE.map((s, i) => (
                <motion.div
                  key={s}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="flex items-baseline gap-4 py-2.5 sm:py-3"
                  style={{ borderBottom: "1px solid var(--sk-border)" }}
                >
                  <span
                    className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em]"
                    style={{ color: "var(--sk-text-faint)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="italic"
                    style={{
                      fontFamily: "'Cormorant Garamond', Georgia, serif",
                      color: "var(--sk-text)",
                      fontSize: "18px",
                    }}
                  >
                    {s}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </SectionWrap>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* THE 9 BELIEFS                                                     */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionWrap id="beliefs">
          <SectionLabel>The Manifesto</SectionLabel>
          <SectionHeadline>Nine things we believe.</SectionHeadline>

          <div className="max-w-3xl mx-auto mt-8 sm:mt-12 space-y-6 sm:space-y-8">
            {BELIEFS.map((b, i) => (
              <motion.div
                key={b.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="flex items-baseline gap-4 sm:gap-10"
              >
                <span
                  className="font-mono text-[10px] sm:text-[11px] tracking-[0.25em] flex-shrink-0"
                  style={{ color: "var(--sk-accent)" }}
                >
                  {b.n}
                </span>
                <p
                  className="italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "var(--sk-text)",
                    fontSize: "clamp(18px, 2.4vw, 28px)",
                    lineHeight: 1.4,
                    fontWeight: 400,
                  }}
                >
                  {b.text}
                </p>
              </motion.div>
            ))}
          </div>
        </SectionWrap>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TESTIMONIALS                                                      */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionWrap>
          <SectionLabel>Whispers</SectionLabel>
          <SectionHeadline>What early founders are saying.</SectionHeadline>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 sm:gap-8 mt-6 sm:mt-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 sm:p-8 rounded-lg"
                style={{
                  border: "1px solid var(--sk-border)",
                  backgroundColor: "var(--sk-bg-card)",
                }}
              >
                <p
                  className="italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "var(--sk-text)",
                    fontSize: "18px",
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;{t}&rdquo;
                </p>
                <div
                  className="mt-4 sm:mt-6 h-px w-8"
                  style={{ backgroundColor: "var(--sk-accent-soft)" }}
                />
              </motion.div>
            ))}
          </div>
        </SectionWrap>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FAQ                                                               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <SectionWrap>
          <SectionLabel>Questions</SectionLabel>
          <SectionHeadline>You were going to ask anyway.</SectionHeadline>

          <div className="max-w-3xl mx-auto mt-6 sm:mt-10">
            {FAQS.map((f, i) => {
              const isOpen = openFAQ === i;
              return (
                <div
                  key={i}
                  style={{ borderTop: "1px solid var(--sk-border)" }}
                >
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                    className="w-full flex items-center justify-between py-4 sm:py-6 text-left transition-opacity hover:opacity-80"
                  >
                    <span
                      className="italic pr-4 sm:pr-6"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: "var(--sk-text)",
                        fontSize: "clamp(18px, 2.4vw, 26px)",
                        lineHeight: 1.3,
                      }}
                    >
                      {f.q}
                    </span>
                    <span
                      className="font-mono text-[14px] flex-shrink-0 transition-transform"
                      style={{
                        color: "var(--sk-accent)",
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      +
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      className="italic pb-6 sm:pb-8 pr-6 sm:pr-12"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        color: "var(--sk-text-muted)",
                        fontSize: "16px",
                        lineHeight: 1.6,
                      }}
                    >
                      {f.a}
                    </p>
                  </motion.div>
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid var(--sk-border)" }} />
          </div>
        </SectionWrap>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FINAL CTA                                                         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="relative py-20 sm:py-32 px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h2
              className="italic mb-4 sm:mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text)",
                fontSize: "clamp(32px, 6vw, 72px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              Stop dreaming.
              <br />
              <span style={{ color: "var(--sk-accent)" }}>Start planning.</span>
            </h2>
            <p
              className="italic mb-8 sm:mb-12 max-w-xl mx-auto"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "var(--sk-text-muted)",
                fontSize: "18px",
              }}
            >
              Your idea has waited long enough.
            </p>

            <Link href={primaryCTA} className="inline-block w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 sm:px-12 py-4 sm:py-5 rounded-md font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase transition-all"
                style={{
                  backgroundColor: "var(--sk-accent)",
                  color: "var(--sk-bg)",
                  boxShadow: "0 8px 40px var(--sk-accent-glow)",
                }}
              >
                {primaryCTALabel}
              </motion.button>
            </Link>
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* FOOTER                                                            */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <footer
          className="relative py-12 sm:py-16 px-5 sm:px-8"
          style={{ borderTop: "1px solid var(--sk-border)" }}
        >
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            {/* Left — wordmark + tagline */}
            <div className="flex flex-col items-center md:items-start gap-2 sm:gap-3">
              <div className="flex items-end leading-none">
                <span
                  className="italic"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    color: "var(--sk-text)",
                    fontSize: "20px",
                    fontWeight: 500,
                  }}
                >
                  Sidekick
                </span>
                <span
                  className="w-1 h-1 rounded-full ml-1 mb-1"
                  style={{
                    backgroundColor: "var(--sk-accent)",
                  }}
                />
              </div>
              <p
                className="italic text-center md:text-left"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: "var(--sk-text-muted)",
                  fontSize: "13px",
                }}
              >
                Every great founder has a sidekick.
              </p>
            </div>

            {/* Right — links + copyright */}
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                <Link
                  href="/about"
                  className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
                  style={{ color: "var(--sk-text-muted)" }}
                >
                  About
                </Link>
                <a
                  href="#beliefs"
                  className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
                  style={{ color: "var(--sk-text-muted)" }}
                >
                  Beliefs
                </a>
                <Link
                  href="/studio"
                  className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
                  style={{ color: "var(--sk-text-muted)" }}
                >
                  Studio
                </Link>
                <Link
                  href="/settings"
                  className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
                  style={{ color: "var(--sk-text-muted)" }}
                >
                  Settings
                </Link>
              </div>
              <p
                className="font-mono text-[8px] sm:text-[9px] tracking-[0.25em] uppercase"
                style={{ color: "var(--sk-text-faint)" }}
              >
                © 2026 Sidekick · Built for founders
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

// ─── HELPER COMPONENTS ───────────────────────────────────────────────────

function SectionWrap({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section
      id={id}
      className="relative py-16 sm:py-32 px-4 sm:px-6"
      style={{ borderTop: "1px solid var(--sk-border)" }}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-center font-mono text-[10px] sm:text-[11px] tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-6 sm:mb-8"
      style={{ color: "var(--sk-accent)" }}
    >
      — {children} —
    </div>
  );
}

function SectionHeadline({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-center italic mb-10 sm:mb-16 max-w-4xl mx-auto px-2"
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        color: "var(--sk-text)",
        fontSize: "clamp(28px, 5vw, 64px)",
        fontWeight: 400,
        letterSpacing: "-0.015em",
        lineHeight: 1.15,
      }}
    >
      {children}
    </h2>
  );
}