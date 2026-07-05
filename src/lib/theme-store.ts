// lib/theme-store.ts
// Saves and loads the user's chosen canvas theme

export type CanvasTheme = "chocolate" | "midnight" | "botanical";

export interface ThemeMeta {
  id: CanvasTheme;
  name: string;
  tagline: string;
  swatch: {
    bg: string;
    card: string;
    accent: string;
    text: string;
  };
}

// ─── ALL AVAILABLE THEMES ────────────────────────────────────────────────
export const THEMES: ThemeMeta[] = [
  {
    id: "chocolate",
    name: "Burgundy",
    tagline: "Velvet theater at midnight.",
    swatch: {
      bg: "#2A0A0E",
      card: "#3D0F14",
      accent: "#B8860B",
      text: "#F0E6D2",
    },
  },
  {
    id: "midnight",
    name: "Midnight",
    tagline: "Whiskey bar at 2 a.m.",
    swatch: {
      bg: "#0C1519",
      card: "#162127",
      accent: "#CF9D7B",
      text: "#F0E6D2",
    },
  },
  {
    id: "botanical",
    name: "Botanical",
    tagline: "Garden after the rain.",
    swatch: {
      bg: "#0A3323",
      card: "#105666",
      accent: "#D3968C",
      text: "#F7F4D5",
    },
  },
];

const THEME_KEY = "sidekick_canvas_theme";
const DEFAULT_THEME: CanvasTheme = "chocolate";

// ─── LOAD ─────────────────────────────────────────────────────────────────
export function loadTheme(): CanvasTheme {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const saved = localStorage.getItem(THEME_KEY) as CanvasTheme | null;
    if (saved && THEMES.find((t) => t.id === saved)) {
      return saved;
    }
    return DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

// ─── SAVE ─────────────────────────────────────────────────────────────────
export function saveTheme(theme: CanvasTheme): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (err) {
    console.error("Sidekick: Failed to save theme →", err);
  }
}

// ─── APPLY TO DOCUMENT ────────────────────────────────────────────────────
export function applyTheme(theme: CanvasTheme): void {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  html.classList.remove("theme-chocolate", "theme-midnight", "theme-botanical");
  html.classList.add(`theme-${theme}`);
}

// ─── REMOVE ───────────────────────────────────────────────────────────────
export function clearTheme(): void {
  if (typeof window === "undefined") return;
  const html = document.documentElement;
  html.classList.remove("theme-chocolate", "theme-midnight", "theme-botanical");
}

// ─── GET META ─────────────────────────────────────────────────────────────
export function getThemeMeta(theme: CanvasTheme): ThemeMeta {
  return THEMES.find((t) => t.id === theme) || THEMES[0];
}