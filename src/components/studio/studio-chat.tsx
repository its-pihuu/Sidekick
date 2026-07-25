"use client";

import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion } from "framer-motion";
import { AIConfig } from "@/data/ai-registry";
import {
  StudioMessage,
  StudioConversation,
  saveConversation,
  generateConversationId,
  generateTitle,
} from "@/lib/studio-history";
import { loadMostRecentCanvas } from "@/lib/canvas-store";
import { buildProfileContext, getProfile } from "@/lib/onboarding-store";

export interface StudioChatHandle {
  loadConversation: (conv: StudioConversation) => void;
  startNew: () => void;
}

interface StudioChatProps {
  ai: AIConfig;
  onConversationSaved?: () => void;
}

const StudioChat = forwardRef<StudioChatHandle, StudioChatProps>(
  ({ ai, onConversationSaved }, ref) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<StudioMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // ─── EXPOSE METHODS TO PARENT ─────────────────────────────
    useImperativeHandle(ref, () => ({
      loadConversation: (conv: StudioConversation) => {
        setActiveId(conv.id);
        setMessages(conv.messages);
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      startNew: () => {
        setActiveId(null);
        setMessages([]);
        setInput("");
        setTimeout(() => inputRef.current?.focus(), 100);
      },
    }));

    // ─── RESET ON AI CHANGE ───────────────────────────────────
    useEffect(() => {
      setActiveId(null);
      setMessages([]);
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }, [ai.id]);

    // ─── AUTO-SCROLL ──────────────────────────────────────────
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ─── BUILD CANVAS CONTEXT ─────────────────────────────────
    const buildCanvasContext = useCallback((): string => {
      const canvas = loadMostRecentCanvas();
      if (!canvas) return "No canvas loaded.";
      const filled = Object.entries(canvas.sections).filter(([, v]) =>
        v?.trim()
      );
      if (filled.length === 0)
        return "The founder hasn't filled any canvas sections yet.";
      return filled
        .map(([sectionId, content]) => `## ${sectionId}\n${content}`)
        .join("\n\n");
    }, []);

    // ─── SEND MESSAGE ─────────────────────────────────────────
    const handleSend = async () => {
      const text = input.trim();
      if (!text || loading) return;

      const userMessage: StudioMessage = {
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput("");
      setLoading(true);

      try {
        const canvas = loadMostRecentCanvas();
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aiId: ai.id,
            message: text,
            history: messages,
            canvasContext: buildCanvasContext(),
            projectName: canvas?.projectName || "Untitled Project",
            userProfile: buildProfileContext(getProfile()),
          }),
        });

        const data = await response.json();
        const aiMessage: StudioMessage = {
          role: "assistant",
          content: data.reply || "Something went wrong. Try again.",
          timestamp: Date.now(),
        };

        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);

        const convId = activeId || generateConversationId();
        const updatedConv: StudioConversation = {
          id: convId,
          aiId: ai.id,
          title: generateTitle(text),
          messages: finalMessages,
          createdAt: activeId ? Date.now() : Date.now(),
          updatedAt: Date.now(),
        };

        saveConversation(updatedConv);
        setActiveId(convId);
        onConversationSaved?.();
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Something went wrong. Check your connection and try again.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    // ─── HANDLE ENTER KEY ─────────────────────────────────────
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    return (
      <main
        className="flex flex-col flex-1 h-full"
        style={{ background: "var(--sk-bg)" }}
      >
        {/* ─── CHAT HEADER ────────────────────────────────── */}
        <header
          className="px-12 py-6 flex items-center justify-between"
          style={{
            borderBottom: "1px solid rgba(240, 230, 210, 0.06)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--sk-accent)",
                opacity: 0.75,
                marginBottom: "6px",
              }}
            >
              {ai.tagline}
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "28px",
                fontStyle: "italic",
                fontWeight: 600,
                color: "var(--sk-text)",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {ai.name}
              <span
                style={{
                  color: "var(--sk-accent)",
                  marginLeft: "3px",
                }}
              >
                ·
              </span>
            </h2>
          </div>
        </header>

        {/* ─── MESSAGES ───────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-12 py-10">
          {messages.length === 0 ? (
            // EMPTY STATE
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center h-full text-center"
              style={{ minHeight: "400px" }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "36px",
                  fontStyle: "italic",
                  fontWeight: 600,
                  color: "var(--sk-text)",
                  marginBottom: "14px",
                  lineHeight: 1.25,
                  maxWidth: "580px",
                }}
              >
                What are we sharpening?
              </p>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  color: "var(--sk-text)",
                  opacity: 0.5,
                  maxWidth: "440px",
                  lineHeight: 1.7,
                  marginBottom: "40px",
                }}
              >
                {ai.description}
              </p>

              {/* Suggested prompts */}
              <div
                className="flex flex-col gap-2 w-full"
                style={{ maxWidth: "520px" }}
              >
                {ai.suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "13px",
                      color: "var(--sk-text)",
                      opacity: 0.6,
                      background: "transparent",
                      border: "1px solid rgba(240, 230, 210, 0.08)",
                      borderRadius: "4px",
                      padding: "12px 18px",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.borderColor =
                        "rgba(207, 157, 123, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.6";
                      e.currentTarget.style.borderColor =
                        "rgba(240, 230, 210, 0.08)";
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            // MESSAGES LIST
            <div className="flex flex-col gap-8 max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {msg.role === "user" ? (
                    // USER — right-aligned bubble
                    <div className="flex justify-end">
                      <div
                        style={{
                          maxWidth: "80%",
                          padding: "12px 20px",
                          background: "rgba(207, 157, 123, 0.09)",
                          border:
                            "1px solid rgba(207, 157, 123, 0.18)",
                          borderRadius: "5px",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "14px",
                            lineHeight: 1.65,
                            color: "var(--sk-text)",
                            opacity: 0.95,
                            whiteSpace: "pre-wrap",
                            margin: 0,
                          }}
                        >
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // AI — magazine style, no bubble
                    <div>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--sk-accent)",
                          opacity: 0.75,
                          marginBottom: "10px",
                        }}
                      >
                        {ai.name} ·
                      </p>
                      <div
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "15px",
                          lineHeight: 1.8,
                          color: "var(--sk-text)",
                          opacity: 0.9,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--sk-accent)",
                      opacity: 0.75,
                      marginBottom: "10px",
                    }}
                  >
                    {ai.name} ·
                  </p>
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: "var(--sk-accent)",
                          display: "inline-block",
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* ─── INPUT AREA ─────────────────────────────────── */}
        <div
          className="px-12 py-6"
          style={{
            borderTop: "1px solid rgba(240, 230, 210, 0.06)",
          }}
        >
          <div
            className="flex gap-3 items-end max-w-3xl mx-auto"
            style={{
              background: "var(--sk-bg-card)",
              border: "1px solid rgba(240, 230, 210, 0.1)",
              borderRadius: "5px",
              padding: "14px 18px",
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${ai.name}...`}
              rows={1}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                color: "var(--sk-text)",
                lineHeight: 1.65,
                maxHeight: "140px",
                overflowY: "auto",
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height =
                  Math.min(el.scrollHeight, 140) + "px";
              }}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                flexShrink: 0,
                padding: "8px 20px",
                borderRadius: "4px",
                border: "1px solid rgba(207, 157, 123, 0.35)",
                background:
                  input.trim() && !loading
                    ? "rgba(207, 157, 123, 0.18)"
                    : "transparent",
                color: "var(--sk-accent)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                cursor:
                  input.trim() && !loading ? "pointer" : "default",
                opacity: input.trim() && !loading ? 1 : 0.3,
                transition: "all 0.2s",
              }}
            >
              {loading ? "..." : "Ask"}
            </button>
          </div>

          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--sk-text)",
              opacity: 0.25,
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </main>
    );
  }
);

StudioChat.displayName = "StudioChat";

export default StudioChat;