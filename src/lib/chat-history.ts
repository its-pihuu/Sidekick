// src/lib/chat-history.ts
// Per-section chat history — localStorage storage layer

"use client";

export interface ChatMessage {
  role: "user" | "sidekick";
  text: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  sectionId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "sidekick_chat_history";
const HISTORY_ENABLED_KEY = "sidekick_history_enabled";

// ─── ENABLE / DISABLE HISTORY (for future Settings) ─────────────────────
export const isHistoryEnabled = (): boolean => {
  if (typeof window === "undefined") return true;
  const val = localStorage.getItem(HISTORY_ENABLED_KEY);
  // Default: enabled
  return val === null ? true : val === "true";
};

export const setHistoryEnabled = (enabled: boolean): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_ENABLED_KEY, String(enabled));
};

// ─── LOAD ALL CONVERSATIONS ─────────────────────────────────────────────
const loadAll = (): Conversation[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveAll = (conversations: Conversation[]): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (err) {
    console.warn("Failed to save chat history:", err);
  }
};

// ─── GET CONVERSATIONS FOR A SECTION ────────────────────────────────────
export const getConversationsForSection = (
  sectionId: string
): Conversation[] => {
  return loadAll()
    .filter((c) => c.sectionId === sectionId)
    .sort((a, b) => b.updatedAt - a.updatedAt); // newest first
};

// ─── GET SINGLE CONVERSATION BY ID ──────────────────────────────────────
export const getConversation = (id: string): Conversation | null => {
  return loadAll().find((c) => c.id === id) || null;
};

// ─── CREATE A NEW CONVERSATION ──────────────────────────────────────────
export const createConversation = (
  sectionId: string,
  firstUserMessage: string
): Conversation => {
  const now = Date.now();
  const conversation: Conversation = {
    id: `conv_${now}_${Math.random().toString(36).slice(2, 8)}`,
    sectionId,
    title: generateTitle(firstUserMessage),
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  if (isHistoryEnabled()) {
    const all = loadAll();
    all.push(conversation);
    saveAll(all);
  }

  return conversation;
};

// ─── APPEND MESSAGE TO CONVERSATION ─────────────────────────────────────
export const appendMessage = (
  conversationId: string,
  message: ChatMessage
): Conversation | null => {
  if (!isHistoryEnabled()) return null;

  const all = loadAll();
  const idx = all.findIndex((c) => c.id === conversationId);
  if (idx === -1) return null;

  all[idx].messages.push(message);
  all[idx].updatedAt = Date.now();

  // Auto-update title from first user message if still default
  if (
    all[idx].title === "New conversation" &&
    message.role === "user" &&
    all[idx].messages.filter((m) => m.role === "user").length === 1
  ) {
    all[idx].title = generateTitle(message.text);
  }

  saveAll(all);
  return all[idx];
};

// ─── DELETE CONVERSATION ────────────────────────────────────────────────
export const deleteConversation = (id: string): void => {
  const all = loadAll().filter((c) => c.id !== id);
  saveAll(all);
};

// ─── DELETE ALL CONVERSATIONS FOR A SECTION ─────────────────────────────
export const deleteAllForSection = (sectionId: string): void => {
  const all = loadAll().filter((c) => c.sectionId !== sectionId);
  saveAll(all);
};

// ─── CLEAR EVERYTHING ───────────────────────────────────────────────────
export const clearAllHistory = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

// ─── HELPER: GENERATE CONVERSATION TITLE ────────────────────────────────
const generateTitle = (text: string): string => {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "New conversation";
  const truncated = cleaned.length > 42 ? cleaned.slice(0, 42) + "…" : cleaned;
  return truncated;
};

// ─── HELPER: FORMAT RELATIVE TIME ───────────────────────────────────────
export const formatRelativeTime = (timestamp: number): string => {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
};