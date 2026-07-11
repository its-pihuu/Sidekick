// src/components/canvas/ai-popup.tsx
// Sidekick's AI chat — powered by Gemini, with per-section conversation history

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getProfile, buildProfileContext } from "@/lib/onboarding-store";
import {
  Conversation,
  ChatMessage,
  getConversationsForSection,
  getConversation,
  createConversation,
  appendMessage,
  deleteConversation,
  formatRelativeTime,
  isHistoryEnabled,
} from "@/lib/chat-history";

interface AIPopupProps {
  sectionId: string;
  sectionName: string;
  sectionContent: string;
  onClose: () => void;
}

export function AIPopup({
  sectionId,
  sectionName,
  sectionContent,
  onClose,
}: AIPopupProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── LOAD CONVERSATIONS ON MOUNT ─────────────────────────────────────
  const refreshConversations = useCallback(() => {
    const convs = getConversationsForSection(sectionId);
    setConversations(convs);
  }, [sectionId]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  // ─── FOCUS INPUT ─────────────────────────────────────────────────────
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeConversationId]);

  // ─── AUTO-SCROLL TO BOTTOM ───────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // ─── CLOSE ON ESCAPE ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // ─── SWITCH TO CONVERSATION ──────────────────────────────────────────
  const openConversation = (id: string) => {
    const conv = getConversation(id);
    if (!conv) return;
    setActiveConversationId(id);
    setMessages(conv.messages);
    setError(null);
    setInput("");
  };

  // ─── START NEW CONVERSATION ──────────────────────────────────────────
  const startNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setError(null);
    setInput("");
    inputRef.current?.focus();
  };

  // ─── DELETE CONVERSATION ─────────────────────────────────────────────
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this conversation? This can't be undone.")) return;
    deleteConversation(id);
    if (activeConversationId === id) {
      startNewConversation();
    }
    refreshConversations();
  };

  // ─── SEND MESSAGE ────────────────────────────────────────────────────
  const handleAsk = async () => {
    const question = input.trim();
    if (!question || isLoading) return;

    setError(null);
    setInput("");
    setIsLoading(true);

    const userMessage: ChatMessage = {
      role: "user",
      text: question,
      timestamp: Date.now(),
    };

    // Determine which conversation we're adding to (create if new)
    let convId = activeConversationId;
    if (!convId) {
      const newConv = createConversation(sectionId, question);
      convId = newConv.id;
      setActiveConversationId(convId);
    }

    // Optimistic UI update
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Persist user message
    if (isHistoryEnabled()) {
      appendMessage(convId, userMessage);
    }

    try {
      const profile = getProfile();
      const profileContext = buildProfileContext(profile);

      // Build history array for the API (all past messages for context)
      const historyForAPI = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionName,
          sectionContent,
          question,
          profileContext,
          history: historyForAPI,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      const sidekickMessage: ChatMessage = {
        role: "sidekick",
        text: data.answer,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, sidekickMessage]);

      if (isHistoryEnabled()) {
        appendMessage(convId, sidekickMessage);
        refreshConversations();
      }
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
        className="w-full max-w-5xl flex overflow-hidden"
        style={{
          backgroundColor: "var(--sk-bg-card)",
          border: "1px solid rgba(240,230,210,0.08)",
          borderRadius: "4px",
          maxHeight: "85vh",
          height: "85vh",
        }}
      >
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SIDEBAR                                                      */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex-shrink-0 flex flex-col overflow-hidden"
              style={{
                borderRight: "1px solid rgba(240,230,210,0.08)",
                backgroundColor: "rgba(0,0,0,0.15)",
              }}
            >
              {/* Sidebar Header */}
              <div
                className="px-5 py-5 flex items-center justify-between"
                style={{ borderBottom: "1px solid rgba(240,230,210,0.08)" }}
              >
                <p
                  className="text-[9px] uppercase tracking-widest"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--sk-accent)",
                    opacity: 0.7,
                  }}
                >
                  Conversations
                </p>
                <button
                  onClick={startNewConversation}
                  className="text-[9px] uppercase tracking-widest px-2 py-1 transition-opacity hover:opacity-100"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--sk-text)",
                    opacity: 0.6,
                    background: "none",
                    border: "1px solid rgba(240,230,210,0.15)",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                >
                  + New
                </button>
              </div>

              {/* Sidebar List */}
              <div className="flex-1 overflow-y-auto py-2">
                {conversations.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p
                      className="text-xs italic"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        color: "var(--sk-text)",
                        opacity: 0.4,
                        lineHeight: 1.6,
                      }}
                    >
                      No conversations yet.
                      <br />
                      Ask something to begin.
                    </p>
                  </div>
                )}

                {conversations.map((conv) => {
                  const isActive = conv.id === activeConversationId;
                  return (
                    <div
                      key={conv.id}
                      onClick={() => openConversation(conv.id)}
                      className="group relative px-5 py-3 cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(240,230,210,0.06)"
                          : "transparent",
                        borderLeft: isActive
                          ? "2px solid var(--sk-accent)"
                          : "2px solid transparent",
                      }}
                    >
                      <p
                        className="text-[13px] mb-1 truncate pr-6"
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          color: "var(--sk-text)",
                          opacity: isActive ? 1 : 0.85,
                          lineHeight: 1.35,
                        }}
                      >
                        {conv.title}
                      </p>
                      <p
                        className="text-[9px] uppercase tracking-widest"
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          color: "var(--sk-text)",
                          opacity: 0.35,
                        }}
                      >
                        {formatRelativeTime(conv.updatedAt)}
                      </p>

                      {/* Delete button (visible on hover) */}
                      <button
                        onClick={(e) => handleDelete(conv.id, e)}
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-70 hover:opacity-100 transition-opacity"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--sk-text)",
                          padding: "2px",
                        }}
                        title="Delete conversation"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* MAIN CHAT                                                    */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* HEADER */}
          <div
            className="px-8 py-6 flex items-center justify-between gap-4"
            style={{ borderBottom: "1px solid rgba(240,230,210,0.08)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Sidebar toggle */}
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="flex-shrink-0 transition-opacity hover:opacity-100"
                style={{
                  background: "none",
                  border: "1px solid rgba(240,230,210,0.15)",
                  borderRadius: "2px",
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: "var(--sk-text)",
                  opacity: 0.5,
                }}
                title={sidebarOpen ? "Hide history" : "Show history"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              </button>

              <div className="min-w-0">
                <p
                  className="text-[10px] uppercase tracking-widest mb-1"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "var(--sk-accent)",
                    opacity: 0.7,
                  }}
                >
                  Sidekick · Thinking with you
                </p>
                <h3
                  className="text-xl italic truncate"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--sk-text)",
                  }}
                >
                  {sectionName}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-xs uppercase tracking-widest transition-opacity hover:opacity-60 flex-shrink-0"
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

          {/* MESSAGES */}
          <div
            className="flex-1 overflow-y-auto px-8 py-6 space-y-5"
            style={{ minHeight: "200px" }}
          >
            {messages.length === 0 && !isLoading && (
              <div className="text-center py-12">
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

          {/* INPUT */}
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
        </div>
      </motion.div>
    </motion.div>
  );
}