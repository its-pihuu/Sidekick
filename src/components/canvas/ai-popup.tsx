// src/components/canvas/ai-popup.tsx
// The real AI chat — powered by Gemini in Sidekick's voice

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "sidekick";
  text: string;
}

interface AIPopupProps {
  sectionId: string;
  sectionName: string;
  sectionContent: string;
  onClose: () => void;
}

export function AIPopup({
  sectionName,
  sectionContent,
  onClose,
}: AIPopupProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleAsk = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    setError(null);
    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionName,
          sectionContent,
          question,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "sidekick", text: data.answer },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something broke.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 16, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl flex flex-col"
        style={{
          backgroundColor: "var(--sk-bg-card)",
          border: "1px solid rgba(240,230,210,0.08)",
          borderRadius: "4px",
          maxHeight: "85vh",
        }}
      >
        {/* HEADER */}
        <div
          className="px-8 py-6 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(240,230,210,0.08)" }}
        >
          <div>
            <p
              className="text-[10px] uppercase tracking-widest mb-1.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "var(--sk-accent)",
                opacity: 0.7,
              }}
            >
              Sidekick · Thinking with you
            </p>
            <h3
              className="text-xl italic"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "var(--sk-text)",
              }}
            >
              {sectionName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--sk-text)",
              opacity: 0.4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            Esc
          </button>
        </div>

        {/* MESSAGES AREA */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 space-y-5"
          style={{ minHeight: "200px" }}
        >
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <div
                className="w-8 h-px mx-auto mb-6"
                style={{ backgroundColor: "var(--sk-accent)" }}
              />
              <p
                className="text-lg italic mb-2"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--sk-text)",
                  opacity: 0.7,
                }}
              >
                What are we sharpening?
              </p>
              <p
                className="text-xs"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "var(--sk-text)",
                  opacity: 0.35,
                }}
              >
                Ask anything about your {sectionName.toLowerCase()}.
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={msg.role === "user" ? "text-right" : "text-left"}
            >
              <p
                className="text-[9px] uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color:
                    msg.role === "user"
                      ? "var(--sk-text)"
                      : "var(--sk-accent)",
                  opacity: 0.5,
                }}
              >
                {msg.role === "user" ? "You" : "Sidekick"}
              </p>
              <div
                className="inline-block max-w-[85%] text-left"
                style={{
                  fontFamily:
                    msg.role === "user"
                      ? "'Inter', sans-serif"
                      : "'Cormorant Garamond', serif",
                  color: "var(--sk-text)",
                  fontSize: msg.role === "user" ? "14px" : "17px",
                  fontStyle: msg.role === "sidekick" ? "italic" : "normal",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  opacity: msg.role === "user" ? 0.75 : 1,
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-left"
            >
              <p
                className="text-[9px] uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "var(--sk-accent)",
                  opacity: 0.5,
                }}
              >
                Sidekick
              </p>
              <p
                className="italic"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--sk-text)",
                  opacity: 0.4,
                  fontSize: "16px",
                }}
              >
                thinking...
              </p>
            </motion.div>
          )}

          {error && (
            <div
              className="text-center py-4 px-4"
              style={{
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "2px",
                backgroundColor: "rgba(239,68,68,0.05)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  color: "#EF4444",
                  opacity: 0.9,
                }}
              >
                {error}
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA */}
        <div
          className="px-8 py-5"
          style={{ borderTop: "1px solid rgba(240,230,210,0.08)" }}
        >
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Sidekick..."
              disabled={isLoading}
              rows={1}
              className="flex-1 resize-none bg-transparent focus:outline-none"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "var(--sk-text)",
                fontSize: "14px",
                lineHeight: 1.5,
                minHeight: "24px",
                maxHeight: "120px",
              }}
            />
            <button
              onClick={handleAsk}
              disabled={!input.trim() || isLoading}
              className="px-5 py-2 text-[10px] uppercase tracking-widest transition-opacity"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                backgroundColor: "var(--sk-accent)",
                color: "var(--sk-bg)",
                border: "none",
                borderRadius: "2px",
                cursor:
                  !input.trim() || isLoading ? "not-allowed" : "pointer",
                opacity: !input.trim() || isLoading ? 0.4 : 1,
              }}
            >
              {isLoading ? "..." : "Ask"}
            </button>
          </div>
          <p
            className="text-[9px] uppercase tracking-widest mt-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "var(--sk-text)",
              opacity: 0.3,
            }}
          >
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}