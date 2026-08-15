// src/lib/projects-store.ts
// Central project management — active project, list, CRUD, migration

"use client";

import {
  createNewCanvas,
  deleteCanvas,
  getProjectList,
  loadCanvas,
  saveCanvas,
  type ProjectMeta,
} from "./canvas-store";

const ACTIVE_PROJECT_KEY = "sidekick_active_project_id";
const MIGRATION_FLAG_KEY = "sidekick_projects_migrated_v1";

// ═══════════════════════════════════════════
// GET ACTIVE PROJECT ID
// ═══════════════════════════════════════════
export function getActiveProjectId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  } catch {
    return null;
  }
}

export function setActiveProjectId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
    // Dispatch event so all components can react
    window.dispatchEvent(new CustomEvent("sidekick:project-changed", { detail: { id } }));
  } catch (err) {
    console.error("Failed to set active project:", err);
  }
}

// ═══════════════════════════════════════════
// GET ACTIVE PROJECT (full meta)
// ═══════════════════════════════════════════
export function getActiveProject(): ProjectMeta | null {
  const id = getActiveProjectId();
  if (!id) return null;
  const list = getProjectList();
  return list.find((p) => p.id === id) || null;
}

// ═══════════════════════════════════════════
// LIST ALL PROJECTS
// ═══════════════════════════════════════════
export function listProjects(): ProjectMeta[] {
  return getProjectList();
}

// ═══════════════════════════════════════════
// CREATE PROJECT
// ═══════════════════════════════════════════
export function createProject(name: string): ProjectMeta {
  const cleanName = name.trim() || "Untitled Project";
  const canvas = createNewCanvas(cleanName);
  setActiveProjectId(canvas.projectId);
  return {
    id: canvas.projectId,
    name: canvas.projectName,
    createdAt: canvas.createdAt,
    updatedAt: canvas.updatedAt,
  };
}

// ═══════════════════════════════════════════
// RENAME PROJECT
// ═══════════════════════════════════════════
export function renameProject(id: string, newName: string): void {
  const cleanName = newName.trim();
  if (!cleanName) return;
  const canvas = loadCanvas(id);
  if (!canvas) return;
  saveCanvas({ ...canvas, projectName: cleanName });
  window.dispatchEvent(new CustomEvent("sidekick:project-renamed", { detail: { id, name: cleanName } }));
}

// ═══════════════════════════════════════════
// DELETE PROJECT (and its conversations)
// ═══════════════════════════════════════════
export function deleteProject(id: string): void {
  deleteCanvas(id);

  // Also delete conversations tied to this project
  try {
    const historyKey = "sidekick_studio_history";
    const raw = localStorage.getItem(historyKey);
    if (raw) {
      const all = JSON.parse(raw);
      // Filter out conversations belonging to this project
      const filtered = all.filter((c: { projectId?: string }) => c.projectId !== id);
      localStorage.setItem(historyKey, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error("Failed to clean project conversations:", err);
  }

  // If we deleted the active project, pick another or create default
  if (getActiveProjectId() === id) {
    const remaining = listProjects();
    if (remaining.length > 0) {
      setActiveProjectId(remaining[0].id);
    } else {
      const fresh = createProject("Untitled Project");
      setActiveProjectId(fresh.id);
    }
  }

  window.dispatchEvent(new CustomEvent("sidekick:project-deleted", { detail: { id } }));
}

// ═══════════════════════════════════════════
// ENSURE ACTIVE PROJECT EXISTS
// Called on app boot. Creates default if none exists,
// migrates old data if this is first time seeing projects.
// ═══════════════════════════════════════════
export function ensureActiveProject(): ProjectMeta {
  const projects = listProjects();

  // First-time migration: if user has existing canvas data but no active project set
  if (typeof window !== "undefined") {
    const migrated = localStorage.getItem(MIGRATION_FLAG_KEY);
    if (!migrated) {
      // If there are projects already (from canvas-store), just pick the most recent one
      if (projects.length > 0) {
        setActiveProjectId(projects[0].id);
        localStorage.setItem(MIGRATION_FLAG_KEY, "1");
        return projects[0];
      }
      localStorage.setItem(MIGRATION_FLAG_KEY, "1");
    }
  }

  const activeId = getActiveProjectId();
  const active = projects.find((p) => p.id === activeId);

  if (active) return active;

  // If active ID is stale or missing but projects exist, pick most recent
  if (projects.length > 0) {
    setActiveProjectId(projects[0].id);
    return projects[0];
  }

  // No projects at all — create default
  return createProject("Untitled Project");
}