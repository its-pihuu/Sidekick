import { ThemeTokens } from "./types";

export const roseQuartz: ThemeTokens = {
  id: "rose-quartz",
  name: "Rose Quartz",
  category: "luxury",
  description: "Muted dark plum with rose-gold metallic borders and warm blush text.",

  canvasBackground: "radial-gradient(circle at 50% 0%, #230F17 0%, #12060B 60%, #060205 100%)",
  gridColor: "rgba(251, 113, 133, 0.05)",

  cardBackground: "linear-gradient(180deg, rgba(42, 18, 28, 0.8) 0%, rgba(22, 9, 14, 0.92) 100%)",
  cardHoverBackground: "linear-gradient(180deg, rgba(56, 24, 38, 0.9) 0%, rgba(30, 12, 20, 0.98) 100%)",
  borderColor: "rgba(251, 113, 133, 0.25)",
  borderHoverColor: "rgba(251, 113, 133, 0.65)",
  topAccentBar: "linear-gradient(90deg, #FB7185, #F43F5E, transparent)",
  glowShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(251, 113, 133, 0.12)",
  glowHoverShadow: "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(251, 113, 133, 0.32)",
  backdropBlur: "blur(20px)",

  fontDisplay: "font-serif italic",
  fontBody: "font-sans",
  fontFamily: "'Cormorant Garamond', Georgia, serif",
  primaryTextColor: "#FFE4E6",
  secondaryTextColor: "#FECDD3",
  mutedTextColor: "#9F1239",
  accentColor: "#FB7185",
  accentGlow: "rgba(251, 113, 133, 0.4)",

  badgeBackground: "rgba(251, 113, 133, 0.12)",
  badgeTextColor: "#FECDD3",
  badgeBorder: "rgba(251, 113, 133, 0.3)",

  bulletColor: "#FB7185",
  edgeColor: "rgba(251, 113, 133, 0.3)",
  edgeActiveColor: "#FB7185"
};