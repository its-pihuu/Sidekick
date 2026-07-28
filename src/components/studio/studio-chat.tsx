"use client";

import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIConfig } from "@/data/ai-registry";
import {
  StudioMessage,
  StudioConversation,
  saveConversation,
  generateConversationId,
  generateTitle,
  getConversationsByAI,
} from "@/lib/studio-history";
import { loadMostRecentCanvas } from "@/lib/canvas-store";
import { buildProfileContext, getProfile } from "@/lib/onboarding-store";
import VoiceVisualizer from "./voice-visualizer";

export interface StudioChatHandle {
  loadConversation: (conv: StudioConversation) => void;
  startNew: () => void;
}

interface StudioChatProps {
  ai: AIConfig;
  onConversationSaved?: () => void;
}

type ChatMode = "quick" | "deep";

// ── Browser SpeechRecognition types ──────────────────────────
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: { transcript: string };
      isFinal: boolean;
    };
    length: number;
  };
}
interface WindowWithSpeech extends Window {
  SpeechRecognition?: new () => ISpeechRecognition;
  webkitSpeechRecognition?: new () => ISpeechRecognition;
}

const StudioChat = forwardRef<StudioChatHandle, StudioChatProps>(
  ({ ai, onConversationSaved }, ref) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [messages, setMessages] = useState<StudioMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [greetingLoading, setGreetingLoading] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [toast, setToast] = useState<string | null>(null);
    const [listening, setListening] = useState(false);
    const [voiceSupported, setVoiceSupported] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState("");
    const [mode, setMode] = useState<ChatMode>("quick");

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const greetingAttempted = useRef<string | null>(null);
    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const voiceBaseRef = useRef<string>("");

    useImperativeHandle(ref, () => ({
      loadConversation: (conv: StudioConversation) => {
        setActiveId(conv.id);
        setMessages(conv.messages);
        greetingAttempted.current = ai.id + "-loaded";
        setTimeout(() => inputRef.current?.focus(), 100);
      },
      startNew: () => {
        setActiveId(null);
        setMessages([]);
        setInput("");
        greetingAttempted.current = null;
        setTimeout(() => inputRef.current?.focus(), 100);
      },
    }));

    // ── VOICE RECOGNITION SETUP ───────────────────────────────
    useEffect(() => {
      if (typeof window === "undefined") return;
      const w = window as WindowWithSpeech;
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!SR) return;

      setVoiceSupported(true);
      const recognition = new SR();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = "";
        let interimTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const t = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += t;
          else interimTranscript += t;
        }
        const base = voiceBaseRef.current;
        const spoken = (finalTranscript + " " + interimTranscript).trim();
        const combined = base ? `${base} ${spoken}`.trim() : spoken;
        setLiveTranscript(combined);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;

      return () => {
        recognition.stop();
      };
    }, []);

    const toggleVoice = () => {
      if (!recognitionRef.current) return;
      if (listening) {
        recognitionRef.current.stop();
        setListening(false);
        if (liveTranscript.trim()) setInput(liveTranscript.trim());
        setLiveTranscript("");
        voiceBaseRef.current = "";
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        try {
          voiceBaseRef.current = input.trim();
          setLiveTranscript(input.trim());
          recognitionRef.current.start();
          setListening(true);
        } catch {
          setListening(false);
        }
      }
    };

    // ── BUILD CANVAS CONTEXT ──────────────────────────────────
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

    // ── RESET ON AI CHANGE ────────────────────────────────────
    useEffect(() => {
      setActiveId(null);
      setMessages([]);
      setInput("");
      setEditingIndex(null);
      setLiveTranscript("");
      if (listening) {
        recognitionRef.current?.stop();
        setListening(false);
      }
      greetingAttempted.current = null;
      setTimeout(() => inputRef.current?.focus(), 100);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ai.id]);

    // ── AUTO-GREETING ─────────────────────────────────────────
    useEffect(() => {
      if (ai.id !== "sidekick-global") return;
      if (messages.length > 0) return;
      const profile = getProfile();
      if (!profile) return;
      const existingConvs = getConversationsByAI(ai.id);
      if (existingConvs.length > 0) return;
      if (greetingAttempted.current === ai.id) return;
      greetingAttempted.current = ai.id;

      const fetchGreeting = async () => {
        setGreetingLoading(true);
        try {
          const canvas = loadMostRecentCanvas();
          const greetingPrompt = `[SYSTEM: This is the user's FIRST TIME opening Sidekick after onboarding. Do NOT respond to any question — instead, deliver a warm, personalized, slightly cheeky welcome greeting. Use their name, reference their stage and blocker, match their communication style. Keep it under 4 sentences. End with an open invitation to start the conversation. Do not use emojis. Do not use headers or lists. Just flowing text like a sidekick meeting them at the door.]`;

          const response = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              aiId: ai.id,
              message: greetingPrompt,
              history: [],
              canvasContext: buildCanvasContext(),
              projectName: canvas?.projectName || "Untitled Project",
              userProfile: buildProfileContext(profile),
              mode: "quick",
            }),
          });

          const data = await response.json();
          if (data.reply) {
            setMessages([{ role: "assistant", content: data.reply, timestamp: Date.now() }]);
          }
        } catch {
          // silent fail
        } finally {
          setGreetingLoading(false);
        }
      };
      fetchGreeting();
    }, [ai.id, messages.length, buildCanvasContext]);

    // ── AUTO-SCROLL ───────────────────────────────────────────
    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── TOAST ─────────────────────────────────────────────────
    const flashToast = (text: string) => {
      setToast(text);
      setTimeout(() => setToast(null), 1500);
    };

    const handleCopy = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        flashToast("Copied");
      } catch {
        flashToast("Copy failed");
      }
    };

    const handleSaveToDocument = (text: string) => {
      try {
        const key = "sidekick_document_saves";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push({
          content: text,
          aiName: ai.name,
          savedAt: Date.now(),
        });
        localStorage.setItem(key, JSON.stringify(existing));
        flashToast("Saved to Document");
      } catch {
        flashToast("Save failed");
      }
    };

    // ── SEND MESSAGE ──────────────────────────────────────────
    const sendMessage = async (text: string, replaceFromIndex?: number) => {
      if (!text.trim() || loading) return;

      const userMessage: StudioMessage = {
        role: "user",
        content: text.trim(),
        timestamp: Date.now(),
      };

      const baseMessages =
        replaceFromIndex !== undefined
          ? messages.slice(0, replaceFromIndex)
          : messages;

      const newMessages = [...baseMessages, userMessage];
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
            message: text.trim(),
            history: baseMessages,
            canvasContext: buildCanvasContext(),
            projectName: canvas?.projectName || "Untitled Project",
            userProfile: buildProfileContext(getProfile()),
            mode,
          }),
        });

        const data = await response.json();
        const aiMessage: StudioMessage = {
          role: "assistant",
          content: data.reply || "something went wrong. try again.",
          timestamp: Date.now(),
        };

        const finalMessages = [...newMessages, aiMessage];
        setMessages(finalMessages);

        const convId = activeId || generateConversationId();
        const updatedConv: StudioConversation = {
          id: convId,
          aiId: ai.id,
          title: generateTitle(text.trim()),
          messages: finalMessages,
          createdAt: Date.now(),
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
            content: "something broke. check your connection and try again.",
            timestamp: Date.now(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    const handleSend = () => {
      if (listening) {
        recognitionRef.current?.stop();
        setListening(false);
        const finalText = liveTranscript.trim() || input.trim();
        setLiveTranscript("");
        voiceBaseRef.current = "";
        sendMessage(finalText);
      } else {
        sendMessage(input);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const startEdit = (index: number, currentText: string) => {
      setEditingIndex(index);
      setEditValue(currentText);
    };

    const cancelEdit = () => {
      setEditingIndex(null);
      setEditValue("");
    };

    const saveEdit = (index: number) => {
      if (!editValue.trim()) return;
      const newText = editValue.trim();
      setEditingIndex(null);
      setEditValue("");
      sendMessage(newText, index);
    };

    const canSend = listening
      ? liveTranscript.trim().length > 0 && !loading
      : input.trim().length > 0 && !loading;

    return (
      <main
        className="flex flex-col flex-1 h-full relative"
        style={{ background: "var(--sk-bg)" }}
      >
        {/* HEADER */}
        <header
          className="px-12 py-6 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(240, 230, 210, 0.06)" }}
        >
          <div>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--sk-accent)",
                opacity: 0.85,
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
              <span style={{ color: "var(--sk-accent)", marginLeft: "3px" }}>·</span>
            </h2>
          </div>

          {/* MODE INDICATOR */}
          {mode === "deep" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--sk-accent)",
                opacity: 0.85,
                padding: "6px 12px",
                border: "1px solid rgba(207, 157, 123, 0.35)",
                borderRadius: "3px",
                background: "rgba(207, 157, 123, 0.08)",
              }}
            >
              Deep Mode
            </motion.div>
          )}
        </header>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-12 py-10">
          {messages.length === 0 && !greetingLoading ? (
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
              <div className="flex flex-col gap-2 w-full" style={{ maxWidth: "520px" }}>
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
                      e.currentTarget.style.borderColor = "rgba(207, 157, 123, 0.35)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.6";
                      e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.08)";
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : messages.length === 0 && greetingLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center h-full"
              style={{ minHeight: "400px" }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--sk-accent)",
                  opacity: 0.7,
                  marginBottom: "18px",
                }}
              >
                Sidekick is stepping in
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
          ) : (
            <div className="flex flex-col gap-8 max-w-3xl mx-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative"
                >
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      {editingIndex === i ? (
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "80%",
                            padding: "12px 20px",
                            background: "rgba(207, 157, 123, 0.09)",
                            border: "1px solid rgba(207, 157, 123, 0.35)",
                            borderRadius: "5px",
                          }}
                        >
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            rows={2}
                            style={{
                              width: "100%",
                              background: "transparent",
                              border: "none",
                              outline: "none",
                              resize: "none",
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "14px",
                              lineHeight: 1.65,
                              color: "var(--sk-text)",
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                saveEdit(i);
                              }
                              if (e.key === "Escape") cancelEdit();
                            }}
                          />
                          <div className="flex gap-2 mt-2 justify-end">
                            <button
                              onClick={cancelEdit}
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "9px",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--sk-text)",
                                opacity: 0.5,
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                padding: "4px 8px",
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => saveEdit(i)}
                              disabled={!editValue.trim()}
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "9px",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--sk-accent)",
                                background: "rgba(207, 157, 123, 0.15)",
                                border: "1px solid rgba(207, 157, 123, 0.4)",
                                borderRadius: "3px",
                                cursor: editValue.trim() ? "pointer" : "default",
                                opacity: editValue.trim() ? 1 : 0.3,
                                padding: "4px 10px",
                              }}
                            >
                              Regenerate
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1.5 max-w-[80%]">
                          <div
                            style={{
                              padding: "12px 20px",
                              background: "rgba(207, 157, 123, 0.09)",
                              border: "1px solid rgba(207, 157, 123, 0.18)",
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
                          <div
                            className="flex gap-1 opacity-0 group-hover:opacity-100"
                            style={{ transition: "opacity 0.2s" }}
                          >
                            <IconButton label="Copy" onClick={() => handleCopy(msg.content)}>
                              <CopyIcon />
                            </IconButton>
                            <IconButton label="Edit" onClick={() => startEdit(i, msg.content)}>
                              <EditIcon />
                            </IconButton>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "9px",
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "var(--sk-accent)",
                          opacity: 0.85,
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
                      <div
                        className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100"
                        style={{ transition: "opacity 0.2s" }}
                      >
                        <IconButton label="Copy" onClick={() => handleCopy(msg.content)}>
                          <CopyIcon />
                        </IconButton>
                        <IconButton label="Save to Document" onClick={() => handleSaveToDocument(msg.content)}>
                          <SaveIcon />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "9px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--sk-accent)",
                      opacity: 0.85,
                      marginBottom: "10px",
                    }}
                  >
                    {mode === "deep" ? `${ai.name} is going deep` : `${ai.name} ·`}
                  </p>
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{
                          duration: mode === "deep" ? 1.8 : 1.2,
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

        {/* INPUT AREA */}
        <div
          className="px-12 py-6"
          style={{ borderTop: "1px solid rgba(240, 230, 210, 0.06)" }}
        >
          <div
            className="flex gap-2 items-end max-w-3xl mx-auto"
            style={{
              background: "var(--sk-bg-card)",
              border: listening
                ? "1px solid rgba(207, 157, 123, 0.4)"
                : "1px solid rgba(240, 230, 210, 0.1)",
              borderRadius: "6px",
              padding: "14px 12px 14px 18px",
              transition: "border-color 0.2s",
              minHeight: "64px",
            }}
          >
            <AnimatePresence mode="wait">
              {listening ? (
                <VoiceVisualizer
                  key="voice"
                  active={listening}
                  transcript={liveTranscript}
                />
              ) : (
                <motion.textarea
                  key="textarea"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
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
                    el.style.height = Math.min(el.scrollHeight, 140) + "px";
                  }}
                />
              )}
            </AnimatePresence>

            {/* PAPERCLIP (file upload placeholder) */}
            <button
              onClick={() => flashToast("File upload — coming soon")}
              title="Attach file — coming soon"
              style={{
                flexShrink: 0,
                width: "36px",
                height: "36px",
                borderRadius: "5px",
                border: "1px solid rgba(240, 230, 210, 0.12)",
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.12)";
              }}
            >
              <PaperclipIcon />
            </button>

            {/* MODE TOGGLE (Quick / Deep) */}
            <button
              onClick={() => setMode(mode === "quick" ? "deep" : "quick")}
              title={mode === "quick" ? "Switch to Deep Mode" : "Switch to Quick Mode"}
              style={{
                flexShrink: 0,
                height: "36px",
                padding: "0 10px",
                borderRadius: "5px",
                border:
                  mode === "deep"
                    ? "1px solid var(--sk-accent)"
                    : "1px solid rgba(240, 230, 210, 0.12)",
                background:
                  mode === "deep"
                    ? "rgba(207, 157, 123, 0.15)"
                    : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: mode === "deep" ? "var(--sk-accent)" : "var(--sk-text)",
                opacity: mode === "deep" ? 1 : 0.6,
              }}
            >
              {mode === "deep" ? <DeepIcon /> : <QuickIcon />}
              {mode === "deep" ? "Deep" : "Quick"}
            </button>

            {/* MIC BUTTON */}
            {voiceSupported && (
              <button
                onClick={toggleVoice}
                title={listening ? "Stop recording" : "Voice input"}
                style={{
                  flexShrink: 0,
                  width: "36px",
                  height: "36px",
                  borderRadius: "5px",
                  border: listening
                    ? "1px solid var(--sk-accent)"
                    : "1px solid rgba(240, 230, 210, 0.12)",
                  background: listening
                    ? "rgba(207, 157, 123, 0.15)"
                    : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <MicIcon
                  color={listening ? "var(--sk-accent)" : "var(--sk-text)"}
                  opacity={listening ? 1 : 0.5}
                />
              </button>
            )}

            {/* SEND BUTTON */}
            <motion.button
              onClick={handleSend}
              disabled={!canSend}
              animate={{
                opacity: canSend ? 1 : 0.25,
                scale: canSend ? 1 : 0.95,
              }}
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{
                flexShrink: 0,
                width: "36px",
                height: "36px",
                borderRadius: "5px",
                border: canSend
                  ? "1px solid var(--sk-accent)"
                  : "1px solid rgba(240, 230, 210, 0.08)",
                background: canSend ? "var(--sk-accent)" : "transparent",
                cursor: canSend ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: canSend
                  ? "0 0 14px rgba(207, 157, 123, 0.4)"
                  : "none",
                transition: "background 0.2s, border 0.2s, box-shadow 0.2s",
              }}
            >
              {loading ? (
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px",
                    color: canSend ? "var(--sk-bg)" : "var(--sk-text)",
                    opacity: 0.7,
                  }}
                >
                  ···
                </span>
              ) : (
                <ArrowIcon color={canSend ? "var(--sk-bg)" : "var(--sk-text)"} />
              )}
            </motion.button>
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
            Enter to send · Shift+Enter for new line{voiceSupported ? " · Mic to speak" : ""} · Toggle Deep for detailed answers
          </p>
        </div>

        {/* TOAST */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                bottom: "110px",
                left: "50%",
                transform: "translateX(-50%)",
                padding: "8px 16px",
                background: "var(--sk-bg-card)",
                border: "1px solid rgba(207, 157, 123, 0.4)",
                borderRadius: "4px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--sk-accent)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                pointerEvents: "none",
                zIndex: 50,
              }}
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    );
  }
);

StudioChat.displayName = "StudioChat";

export default StudioChat;

// ── ICON SUBCOMPONENTS ─────────────────────────────────────

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: "26px",
        height: "26px",
        borderRadius: "4px",
        border: "1px solid transparent",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(240, 230, 210, 0.06)";
        e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sk-text)", opacity: 0.6 }}>
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sk-text)", opacity: 0.6 }}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sk-text)", opacity: 0.6 }}>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function ArrowIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MicIcon({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ opacity }}>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--sk-text)", opacity: 0.5 }}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function QuickIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function DeepIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}