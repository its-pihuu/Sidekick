"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ background: "var(--sk-bg)", color: "var(--sk-text)" }}
    >
      {/* NAV */}
      <nav
        className="px-8 md:px-16 py-6 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(240, 230, 210, 0.06)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "22px",
              fontStyle: "italic",
              fontWeight: 600,
              color: "var(--sk-text)",
            }}
          >
            Sidekick
          </span>
          <motion.span
            animate={{
              boxShadow: [
                "0 0 6px 1px rgba(207, 157, 123, 0.65)",
                "0 0 14px 3px rgba(207, 157, 123, 1)",
                "0 0 6px 1px rgba(207, 157, 123, 0.65)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--sk-accent)",
              display: "inline-block",
              marginBottom: "3px",
            }}
          />
        </Link>
        <Link
          href="/studio"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sk-accent)",
            textDecoration: "none",
          }}
        >
          Enter Studio →
        </Link>
      </nav>

      {/* HERO */}
      <section className="px-8 md:px-16 pt-24 md:pt-32 pb-20 md:pb-32 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--sk-accent)",
            opacity: 0.85,
            marginBottom: "24px",
          }}
        >
          About · Sidekick
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(48px, 8vw, 96px)",
            fontStyle: "italic",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "32px",
          }}
        >
          Every great founder
          <br />
          has a sidekick
          <span style={{ color: "var(--sk-accent)" }}>·</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "20px",
            lineHeight: 1.6,
            color: "var(--sk-text)",
            opacity: 0.7,
            maxWidth: "620px",
          }}
        >
          The thinking partner that turns messy ambition into cold, executable empire.
        </motion.p>
      </section>

      {/* THE MANIFESTO */}
      <Section label="Manifesto · 01">
        <SectionTitle>
          Most founders die alone
          <span style={{ color: "var(--sk-accent)" }}>.</span>
        </SectionTitle>
        <Body>
          Not from lack of ideas. From lack of a mirror. They talk to their friends and hear applause. They talk to their families and hear worry. They talk to consultants and hear invoices.
        </Body>
        <Body>
          Nobody tells them the truth. Nobody asks the quiet question that makes them sit up. Nobody sees the whole board.
        </Body>
        <Body>
          Sidekick was built to be the room where founders go before every important decision — the presence that treats their ambition seriously, tells them exactly what is fragile, and refuses to flatter them into ruin.
        </Body>
      </Section>

      {/* THE VOICE */}
      <Section label="Voice · 02">
        <SectionTitle>
          The Architect
          <span style={{ color: "var(--sk-accent)" }}>·</span>
        </SectionTitle>
        <Body>
          Sidekick does not speak like a chatbot. It does not open with greetings. It does not soften truths. It does not say &ldquo;great question.&rdquo;
        </Body>
        <Body>
          It speaks like the person you consult in secret. Cold. Precise. Every word costs money. Every response contains one line you would screenshot.
        </Body>
        <Body>
          There is one voice, worn by thirteen minds. A generalist who sees the whole board. Eleven experts, each obsessed with one section of your empire. A cartographer who maps the shape of your strategy.
        </Body>
      </Section>

      {/* THE ORIGIN */}
      <Section label="Origin · 03">
        <SectionTitle>
          Built from zero
          <span style={{ color: "var(--sk-accent)" }}>.</span>
        </SectionTitle>
        <Body>
          Zero budget. Zero permission. Zero investors.
        </Body>
        <Body>
          One founder, one keyboard, one refusal to build another mediocre tool. Sidekick exists because the world does not need another dashboard, another notes app, another chatbot pretending to be your friend.
        </Body>
        <Body>
          It needs a mirror that speaks back. So we built one.
        </Body>
      </Section>

      {/* CTA */}
      <section className="px-8 md:px-16 py-32 md:py-40 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--sk-accent)",
              opacity: 0.85,
              marginBottom: "20px",
            }}
          >
            The Move
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1.1,
              marginBottom: "32px",
              letterSpacing: "-0.02em",
            }}
          >
            Walk in with a vision.
            <br />
            Walk out with a plan
            <span style={{ color: "var(--sk-accent)" }}>·</span>
          </h2>
          <Link
            href="/studio"
            style={{
              display: "inline-block",
              padding: "14px 28px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--sk-bg)",
              background: "var(--sk-accent)",
              border: "1px solid var(--sk-accent)",
              borderRadius: "3px",
              textDecoration: "none",
              transition: "all 0.2s",
              boxShadow: "0 0 20px rgba(207, 157, 123, 0.35)",
            }}
          >
            Enter Studio →
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-8 md:px-16 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ borderTop: "1px solid rgba(240, 230, 210, 0.06)" }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--sk-text)",
            opacity: 0.4,
          }}
        >
          © 2026 Sidekick · All rights reserved
        </p>
        <div className="flex gap-6">
          <Link
            href="/"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--sk-text)",
              opacity: 0.5,
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <Link
            href="/studio"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--sk-text)",
              opacity: 0.5,
              textDecoration: "none",
            }}
          >
            Studio
          </Link>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════
// SECTION SUBCOMPONENTS
// ═══════════════════════════════════════════

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section
      className="px-8 md:px-16 py-20 md:py-28 max-w-5xl mx-auto"
      style={{ borderTop: "1px solid rgba(240, 230, 210, 0.06)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--sk-accent)",
            opacity: 0.85,
            marginBottom: "24px",
          }}
        >
          {label}
        </p>
        {children}
      </motion.div>
    </section>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(36px, 5.5vw, 60px)",
        fontStyle: "italic",
        fontWeight: 500,
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        marginBottom: "32px",
      }}
    >
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "17px",
        lineHeight: 1.75,
        color: "var(--sk-text)",
        opacity: 0.75,
        marginBottom: "20px",
        maxWidth: "680px",
      }}
    >
      {children}
    </p>
  );
}