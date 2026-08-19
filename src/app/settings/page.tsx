"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProfile, clearProfile, UserProfile } from "@/lib/onboarding-store";
import {
  isHistoryEnabled,
  setHistoryEnabled,
  clearAllHistory,
  getConversationCount,
} from "@/lib/studio-history";
import { listProjects } from "@/lib/projects-store";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [historyOn, setHistoryOn] = useState(true);
  const [convCount, setConvCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmMode, setConfirmMode] = useState<null | "clear-history" | "nuclear">(null);

  useEffect(() => {
    setProfile(getProfile());
    setHistoryOn(isHistoryEnabled());
    setConvCount(getConversationCount());
    setProjectCount(listProjects().length);
  }, []);

  const flashToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 1800);
  };

  // ─── DATA EXPORT ──────────────────────────────────────
  const handleExport = () => {
    try {
      const data: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("sidekick_")) {
          try {
            const val = localStorage.getItem(key);
            data[key] = val ? JSON.parse(val) : val;
          } catch {
            data[key] = localStorage.getItem(key);
          }
        }
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const date = new Date().toISOString().split("T")[0];
      a.download = `sidekick-backup-${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
      flashToast("Backup downloaded");
    } catch {
      flashToast("Export failed");
    }
  };

  // ─── HISTORY TOGGLE ───────────────────────────────────
  const handleHistoryToggle = () => {
    const newState = !historyOn;
    setHistoryOn(newState);
    setHistoryEnabled(newState);
    flashToast(newState ? "History enabled" : "History disabled");
  };

  // ─── CLEAR HISTORY ────────────────────────────────────
  const handleClearHistory = () => {
    clearAllHistory();
    setConvCount(0);
    setConfirmMode(null);
    flashToast("All conversations cleared");
  };

  // ─── NUCLEAR RESET ────────────────────────────────────
  const handleNuclearReset = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("sidekick_")) keys.push(key);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    setConfirmMode(null);
    flashToast("Everything reset");
    setTimeout(() => router.push("/"), 800);
  };

  // ─── EDIT PROFILE ─────────────────────────────────────
  const handleEditProfile = () => {
    clearProfile();
    router.push("/onboarding");
  };

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
          ← Back to Studio
        </Link>
      </nav>

      {/* HERO */}
      <section className="px-8 md:px-16 pt-16 md:pt-24 pb-12 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--sk-accent)",
            opacity: 0.85,
            marginBottom: "18px",
          }}
        >
          Settings · Command
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(40px, 6vw, 68px)",
            fontStyle: "italic",
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Your workspace
          <span style={{ color: "var(--sk-accent)" }}>·</span>
        </motion.h1>
      </section>

      {/* PROFILE */}
      <Section label="Profile · 01">
        {profile ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Name" value={profile.name} />
            <Field label="Background" value={formatValue(profile.background)} />
            <Field label="Experience" value={formatValue(profile.experience)} />
            <Field label="Stage" value={formatValue(profile.ideaStage)} />
            <Field label="Time" value={formatValue(profile.timeCommitment)} />
            <Field label="Blocker" value={formatValue(profile.biggestBlocker)} />
          </div>
        ) : (
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: "18px",
              opacity: 0.5,
            }}
          >
            No profile found. Complete onboarding first.
          </p>
        )}
        <div style={{ marginTop: "28px" }}>
          <ActionButton onClick={handleEditProfile} variant="secondary">
            {profile ? "Edit Profile" : "Start Onboarding"}
          </ActionButton>
        </div>
      </Section>

      {/* WORKSPACE STATS */}
      <Section label="Workspace · 02">
        <div className="grid grid-cols-2 gap-6">
          <StatCard label="Projects" value={projectCount} />
          <StatCard label="Conversations" value={convCount} />
        </div>
      </Section>

      {/* HISTORY */}
      <Section label="History · 03">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            background: "var(--sk-bg-card)",
            border: "1px solid rgba(240, 230, 210, 0.08)",
            borderRadius: "5px",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                color: "var(--sk-text)",
                opacity: 0.9,
                marginBottom: "4px",
              }}
            >
              Save conversation history
            </p>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12px",
                color: "var(--sk-text)",
                opacity: 0.5,
              }}
            >
              When off, new conversations vanish when you close the tab.
            </p>
          </div>
          <Toggle on={historyOn} onClick={handleHistoryToggle} />
        </div>

        <div style={{ marginTop: "20px" }}>
          <ActionButton
            onClick={() => setConfirmMode("clear-history")}
            variant="danger-secondary"
          >
            Clear All Conversations
          </ActionButton>
        </div>
      </Section>

      {/* DATA */}
      <Section label="Data · 04">
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            color: "var(--sk-text)",
            opacity: 0.7,
            lineHeight: 1.7,
            marginBottom: "24px",
            maxWidth: "600px",
          }}
        >
          Everything lives in your browser. Nothing on our servers. Back it up before you switch devices.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <ActionButton onClick={handleExport} variant="primary">
            Download Backup
          </ActionButton>
          <ActionButton
            onClick={() => setConfirmMode("nuclear")}
            variant="danger"
          >
            Reset Everything
          </ActionButton>
        </div>
      </Section>

      {/* ABOUT */}
      <Section label="About · 05">
        <div className="flex flex-col gap-2">
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.14em",
              color: "var(--sk-text)",
              opacity: 0.65,
            }}
          >
            Version 0.1 · Beta
          </p>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.14em",
              color: "var(--sk-text)",
              opacity: 0.65,
            }}
          >
            Model · Gemini Flash Lite
          </p>
          <div style={{ marginTop: "16px" }}>
            <Link
              href="/about"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--sk-accent)",
                textDecoration: "none",
              }}
            >
              Read the Manifesto →
            </Link>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer
        className="px-8 md:px-16 py-10 mt-16"
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
            textAlign: "center",
          }}
        >
          © 2026 Sidekick
        </p>
      </footer>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setConfirmMode(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 100,
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: "440px",
                width: "100%",
                background: "var(--sk-bg-card)",
                border: "1px solid rgba(217, 119, 87, 0.35)",
                borderRadius: "6px",
                padding: "28px",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#d97757",
                  marginBottom: "14px",
                }}
              >
                {confirmMode === "nuclear" ? "Reset Everything" : "Clear History"}
              </p>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "24px",
                  fontStyle: "italic",
                  fontWeight: 600,
                  marginBottom: "14px",
                  lineHeight: 1.3,
                }}
              >
                {confirmMode === "nuclear"
                  ? "This deletes everything. No recovery."
                  : "This deletes every conversation. No recovery."}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  opacity: 0.7,
                  lineHeight: 1.6,
                  marginBottom: "24px",
                }}
              >
                {confirmMode === "nuclear"
                  ? "Profile, projects, canvas, conversations, saves — gone. You will land back on the intro page."
                  : "All chat threads across all AIs, across all projects. Canvas and profile stay intact."}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmMode(null)}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--sk-text)",
                    opacity: 0.6,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "8px 12px",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={
                    confirmMode === "nuclear" ? handleNuclearReset : handleClearHistory
                  }
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#d97757",
                    background: "rgba(217, 119, 87, 0.12)",
                    border: "1px solid rgba(217, 119, 87, 0.4)",
                    borderRadius: "3px",
                    cursor: "pointer",
                    padding: "8px 16px",
                  }}
                >
                  {confirmMode === "nuclear" ? "Reset All" : "Clear"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              padding: "10px 20px",
              background: "var(--sk-bg-card)",
              border: "1px solid rgba(207, 157, 123, 0.4)",
              borderRadius: "4px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--sk-accent)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              zIndex: 200,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════
// SUBCOMPONENTS
// ═══════════════════════════════════════════

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section
      className="px-8 md:px-16 py-12 max-w-4xl mx-auto"
      style={{ borderTop: "1px solid rgba(240, 230, 210, 0.06)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: "14px 18px",
        background: "var(--sk-bg-card)",
        border: "1px solid rgba(240, 230, 210, 0.06)",
        borderRadius: "5px",
      }}
    >
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--sk-accent)",
          opacity: 0.7,
          marginBottom: "6px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          color: "var(--sk-text)",
          opacity: 0.9,
        }}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      style={{
        padding: "20px 22px",
        background: "var(--sk-bg-card)",
        border: "1px solid rgba(240, 230, 210, 0.06)",
        borderRadius: "5px",
      }}
    >
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "9px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--sk-accent)",
          opacity: 0.7,
          marginBottom: "8px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "38px",
          fontStyle: "italic",
          fontWeight: 500,
          color: "var(--sk-text)",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "relative",
        width: "44px",
        height: "24px",
        borderRadius: "12px",
        background: on ? "rgba(207, 157, 123, 0.9)" : "rgba(240, 230, 210, 0.12)",
        border: "1px solid",
        borderColor: on ? "var(--sk-accent)" : "rgba(240, 230, 210, 0.15)",
        cursor: "pointer",
        transition: "all 0.2s",
        padding: 0,
        flexShrink: 0,
      }}
    >
      <motion.span
        animate={{ x: on ? 20 : 2 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: on ? "var(--sk-bg)" : "var(--sk-text)",
          display: "block",
        }}
      />
    </button>
  );
}

function ActionButton({
  onClick,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "danger-secondary";
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      color: "var(--sk-bg)",
      background: "var(--sk-accent)",
      border: "1px solid var(--sk-accent)",
    },
    secondary: {
      color: "var(--sk-accent)",
      background: "transparent",
      border: "1px solid rgba(207, 157, 123, 0.4)",
    },
    danger: {
      color: "#d97757",
      background: "rgba(217, 119, 87, 0.1)",
      border: "1px solid rgba(217, 119, 87, 0.45)",
    },
    "danger-secondary": {
      color: "#d97757",
      background: "transparent",
      border: "1px solid rgba(217, 119, 87, 0.3)",
    },
  };
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        padding: "12px 22px",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "all 0.2s",
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}

function formatValue(v: string): string {
  if (!v) return "—";
  return v
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}