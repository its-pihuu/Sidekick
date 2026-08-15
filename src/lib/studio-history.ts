// src/lib/studio-history.ts
// Unified chat history for all 13 Studio AIs — scoped by project

"use client";

export interface StudioMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface StudioConversation {
  id: string;
  aiId: string;
  projectId: string;
  title: string;
  messages: StudioMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "sidekick_studio_history";
const ENABLED_KEY = "sidekick_studio_history_enabled";
const MIGRATION_FLAG_KEY = "sidekick_studio_history_migrated_v1";

// ═══════════════════════════════════════════
// GET ACTIVE PROJECT ID (local lookup — avoids circular import)
// ═══════════════════════════════════════════
function getActiveProjectIdLocal(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("sidekick_active_project_id");
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════
// MIGRATION — assign projectId to old conversations (one time)
// ═══════════════════════════════════════════
function migrateIfNeeded(): void {
  if (typeof window === "undefined") return;
  try {
    const migrated = localStorage.getItem(MIGRATION_FLAG_KEY);
    if (migrated) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(MIGRATION_FLAG_KEY, "1");
      return;
    }

    const all = JSON.parse(raw) as Partial<StudioConversation>[];
    const activeId = getActiveProjectIdLocal();
    if (!activeId) return; // wait until active project exists

    const migratedList = all.map((c) => ({
      ...c,
      projectId: c.projectId || activeId,
    }));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedList));
    localStorage.setItem(MIGRATION_FLAG_KEY, "1");
  } catch (err) {
    console.error("History migration failed:", err);
  }
}

// ═══════════════════════════════════════════
// GET ALL — every conversation across every project & AI
// ═══════════════════════════════════════════
export function getAllConversations(): StudioConversation[] {
  if (typeof window === "undefined") return [];
  migrateIfNeeded();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: StudioConversation[] = JSON.parse(raw);
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════
// GET FOR ACTIVE PROJECT (used by sidebar)
// ═══════════════════════════════════════════
export function getConversationsForActiveProject(): StudioConversation[] {
  const activeId = getActiveProjectIdLocal();
  if (!activeId) return [];
  return getAllConversations().filter((c) => c.projectId === activeId);
}

// ═══════════════════════════════════════════
// FILTERED — get conversations for a specific AI in ACTIVE project
// ═══════════════════════════════════════════
export function getConversationsByAI(aiId: string): StudioConversation[] {
  const activeId = getActiveProjectIdLocal();
  if (!activeId) return [];
  return getAllConversations().filter(
    (c) => c.aiId === aiId && c.projectId === activeId
  );
}

// ═══════════════════════════════════════════
// FILTERED — get conversations for a specific AI in ANY project
// ═══════════════════════════════════════════
export function getConversationsByAIAllProjects(aiId: string): StudioConversation[] {
  return getAllConversations().filter((c) => c.aiId === aiId);
}

// ═══════════════════════════════════════════
// SEARCH — within active project only
// ═══════════════════════════════════════════
export function searchConversations(query: string): StudioConversation[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const activeId = getActiveProjectIdLocal();
  const scope = activeId
    ? getAllConversations().filter((c) => c.projectId === activeId)
    : getAllConversations();
  return scope.filter((conv) => {
    if (conv.title.toLowerCase().includes(q)) return true;
    return conv.messages.some((m) => m.content.toLowerCase().includes(q));
  });
}

// ═══════════════════════════════════════════
// SAVE — auto-attaches active project ID if missing
// ═══════════════════════════════════════════
export function saveConversation(conv: StudioConversation): void {
  if (typeof window === "undefined") return;
  try {
    const withProject: StudioConversation = {
      ...conv,
      projectId: conv.projectId || getActiveProjectIdLocal() || "orphan",
    };
    const all = getAllConversations();
    const idx = all.findIndex((c) => c.id === withProject.id);
    if (idx >= 0) {
      all[idx] = withProject;
    } else {
      all.push(withProject);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error("Failed to save conversation:", err);
  }
}

// ═══════════════════════════════════════════
// DELETE — one conversation
// ═══════════════════════════════════════════
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

// ═══════════════════════════════════════════
// DELETE ALL — nuclear
// ═══════════════════════════════════════════
export function clearAllHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear history:", err);
  }
}

// ═══════════════════════════════════════════
// DELETE BY AI — within active project
// ═══════════════════════════════════════════
export function clearHistoryForAI(aiId: string): void {
  if (typeof window === "undefined") return;
  try {
    const activeId = getActiveProjectIdLocal();
    const all = getAllConversations();
    const filtered = all.filter(
      (c) => !(c.aiId === aiId && (!activeId || c.projectId === activeId))
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error("Failed to clear AI history:", err);
  }
}

// ═══════════════════════════════════════════
// ENABLED TOGGLE
// ═══════════════════════════════════════════
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

// ═══════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════

export function generateConversationId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 50) return cleaned;
  return cleaned.slice(0, 47) + "...";
}

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

export function getConversationCount(): number {
  return getAllConversations().length;
}

export function getConversationCountByAI(aiId: string): number {
  return getConversationsByAI(aiId).length;
}