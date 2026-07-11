// src/lib/document-palette.ts
// Document color palettes — user-selectable, persisted

export type DocumentPalette = "classic" | "newsprint" | "midnight" | "botanical";

export interface PaletteColors {
  id: DocumentPalette;
  name: string;
  description: string;
  bg: string;          // card background
  text: string;        // body text
  heading: string;     // section titles + main title
  label: string;       // small mono labels
  divider: string;     // hairline dividers
  swatchOuter: string; // small swatch preview outer
  swatchInner: string; // small swatch preview inner
}

export const PALETTES: Record<DocumentPalette, PaletteColors> = {
  classic: {
    id: "classic",
    name: "Classic",
    description: "Warm cream, ink brown",
    bg: "#F0E6D2",
    text: "#3A2418",
    heading: "#2A0A0E",
    label: "#8B5A2B",
    divider: "#2A0A0E",
    swatchOuter: "#F0E6D2",
    swatchInner: "#2A0A0E",
  },
  newsprint: {
    id: "newsprint",
    name: "Newsprint",
    description: "Pure white, sharp black",
    bg: "#FAFAF7",
    text: "#1A1A1A",
    heading: "#000000",
    label: "#555555",
    divider: "#000000",
    swatchOuter: "#FAFAF7",
    swatchInner: "#000000",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Deep navy, cream ink",
    bg: "#0F1A2E",
    text: "#E8DFCC",
    heading: "#F0E6D2",
    label: "#CF9D7B",
    divider: "#F0E6D2",
    swatchOuter: "#0F1A2E",
    swatchInner: "#CF9D7B",
  },
  botanical: {
    id: "botanical",
    name: "Botanical",
    description: "Deep forest, beige ink",
    bg: "#0D2A1D",
    text: "#EDE6C8",
    heading: "#F7F4D5",
    label: "#D3968C",
    divider: "#F7F4D5",
    swatchOuter: "#0D2A1D",
    swatchInner: "#D3968C",
  },
};

const STORAGE_KEY = "sidekick_document_palette";

export const loadPalette = (): DocumentPalette => {
  if (typeof window === "undefined") return "classic";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved in PALETTES) {
    return saved as DocumentPalette;
  }
  return "classic";
};

export const savePalette = (palette: DocumentPalette): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, palette);
};