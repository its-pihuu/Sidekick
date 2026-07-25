// src/lib/studio-history.ts
// Unified chat history for all 13 Studio AIs
// Each AI has its own conversation list, all stored in localStorage

"use client";

export interface StudioMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface StudioConversation {
  id: string;
  aiId: string; // links to AI_REGISTRY (e.g. "sidekick-global", "expert-problem")
  title: string;
  messages: StudioMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "sidekick_studio_history";
const ENABLED_KEY = "sidekick_studio_history_enabled";

// ═══════════════════════════════════════════════════════════════
// CORE — get all conversations across all AIs
// ═══════════════════════════════════════════════════════════════
export function getAllConversations(): StudioConversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StudioConversation[] = JSON.parse(raw);
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// FILTERED — get conversations for a specific AI
// ═══════════════════════════════════════════════════════════════
export function getConversationsByAI(aiId: string): StudioConversation[] {
  return getAllConversations().filter((c) => c.aiId === aiId);
}

// ═══════════════════════════════════════════════════════════════
// SEARCH — search across all conversations
// ═══════════════════════════════════════════════════════════════
export function searchConversations(query: string): StudioConversation[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllConversations().filter((conv) => {
    if (conv.title.toLowerCase().includes(q)) return true;
    return conv.messages.some((m) => m.content.toLowerCase().includes(q));
  });
}

// ═══════════════════════════════════════════════════════════════
// SAVE — create or update a conversation
// ═══════════════════════════════════════════════════════════════
export function saveConversation(conv: StudioConversation): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllConversations();
    const idx = all.findIndex((c) => c.id === conv.id);
    if (idx >= 0) {
      all[idx] = conv;
    } else {
      all.push(conv);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error("Failed to save conversation:", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE — remove a specific conversation
// ═══════════════════════════════════════════════════════════════
export function deleteConversation(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllConversations();
    const filtered = all.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to delete conversation:", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE ALL — clear all history (nuclear option)
// ═══════════════════════════════════════════════════════════════
export function clearAllHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE BY AI — clear all conversations for one specific AI
// ═══════════════════════════════════════════════════════════════
export function clearHistoryForAI(aiId: string): void {
  if (typeof window === "undefined") return;
  try {
    const all = getAllConversations();
    const filtered = all.filter((c) => c.aiId !== aiId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to clear AI history:", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// ENABLE / DISABLE — history toggle (for future Settings page)
// ═══════════════════════════════════════════════════════════════
export function isHistoryEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const val = localStorage.getItem(ENABLED_KEY);
    return val === null ? true : val === "true";
  } catch {
    return true;
  }
}

export function setHistoryEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ENABLED_KEY, String(enabled));
  } catch (err) {
    console.error("Failed to set history preference:", err);
  }
}

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

// Generate a unique conversation ID
export function generateConversationId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Auto-generate a title from the first user message
export function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 50) return cleaned;
  return cleaned.slice(0, 47) + "...";
}

// Format a timestamp as "just now", "5m", "2h", "3d", or a date
export function formatTimestamp(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  const date = new Date(ts);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Get total conversation count (for badges / stats)
export function getConversationCount(): number {
  return getAllConversations().length;
}

// Get count per AI (for showing "12 chats" next to each AI in sidebar)
export function getConversationCountByAI(aiId: string): number {
  return getConversationsByAI(aiId).length;
}