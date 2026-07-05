// lib/canvas-store.ts
// Saves and loads canvas data from localStorage
// Auto-save ready — just call saveCanvas() whenever content changes

export interface CanvasData {
    projectId: string;
    projectName: string;
    sections: Record<string, string>; // sectionId → user's text content
    createdAt: string;
    updatedAt: string;
  }
  
  const CANVAS_KEY = "sidekick_canvas";
  const PROJECT_LIST_KEY = "sidekick_projects";
  
  // ─── SAVE ────────────────────────────────────────────────────────────────────
  
  export function saveCanvas(data: CanvasData): void {
    try {
      const updated = {
        ...data,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`${CANVAS_KEY}_${data.projectId}`, JSON.stringify(updated));
  
      // Also update the project list
      const projects = getProjectList();
      const existingIndex = projects.findIndex((p) => p.id === data.projectId);
  
      const projectMeta = {
        id: data.projectId,
        name: data.projectName,
        updatedAt: updated.updatedAt,
        createdAt: data.createdAt,
      };
  
      if (existingIndex >= 0) {
        projects[existingIndex] = projectMeta;
      } else {
        projects.unshift(projectMeta); // newest first
      }
  
      localStorage.setItem(PROJECT_LIST_KEY, JSON.stringify(projects));
    } catch (err) {
      console.error("Sidekick: Failed to save canvas →", err);
    }
  }
  
  // ─── LOAD ────────────────────────────────────────────────────────────────────
  
  export function loadCanvas(projectId: string): CanvasData | null {
    try {
      const raw = localStorage.getItem(`${CANVAS_KEY}_${projectId}`);
      if (!raw) return null;
      return JSON.parse(raw) as CanvasData;
    } catch (err) {
      console.error("Sidekick: Failed to load canvas →", err);
      return null;
    }
  }
  
  // ─── LOAD MOST RECENT ────────────────────────────────────────────────────────
  
  export function loadMostRecentCanvas(): CanvasData | null {
    try {
      const projects = getProjectList();
      if (projects.length === 0) return null;
  
      // Most recent is first in list
      const mostRecent = projects[0];
      return loadCanvas(mostRecent.id);
    } catch (err) {
      console.error("Sidekick: Failed to load most recent canvas →", err);
      return null;
    }
  }
  
  // ─── CREATE NEW ──────────────────────────────────────────────────────────────
  
  export function createNewCanvas(projectName: string): CanvasData {
    const now = new Date().toISOString();
    const newCanvas: CanvasData = {
      projectId: generateId(),
      projectName,
      sections: {}, // empty — user fills it in
      createdAt: now,
      updatedAt: now,
    };
  
    saveCanvas(newCanvas);
    return newCanvas;
  }
  
  // ─── DELETE ──────────────────────────────────────────────────────────────────
  
  export function deleteCanvas(projectId: string): void {
    try {
      localStorage.removeItem(`${CANVAS_KEY}_${projectId}`);
  
      const projects = getProjectList().filter((p) => p.id !== projectId);
      localStorage.setItem(PROJECT_LIST_KEY, JSON.stringify(projects));
    } catch (err) {
      console.error("Sidekick: Failed to delete canvas →", err);
    }
  }
  
  // ─── PROJECT LIST ────────────────────────────────────────────────────────────
  
  export interface ProjectMeta {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export function getProjectList(): ProjectMeta[] {
    try {
      const raw = localStorage.getItem(PROJECT_LIST_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as ProjectMeta[];
    } catch {
      return [];
    }
  }
  
  // ─── UPDATE SECTION ──────────────────────────────────────────────────────────
  // Call this on every keystroke (debounced in the UI)
  
  export function updateSection(
    canvas: CanvasData,
    sectionId: string,
    content: string
  ): CanvasData {
    const updated: CanvasData = {
      ...canvas,
      sections: {
        ...canvas.sections,
        [sectionId]: content,
      },
      updatedAt: new Date().toISOString(),
    };
    return updated; // caller saves this with saveCanvas()
  }
  
  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  
  function generateId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
  
  export function getWordCount(text: string): number {
    return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  }
  
  export function getSectionCompletion(sections: Record<string, string>): number {
    const total = 11;
    const filled = Object.values(sections).filter(
      (v) => v && v.trim().length > 20
    ).length;
    return Math.round((filled / total) * 100);
  }