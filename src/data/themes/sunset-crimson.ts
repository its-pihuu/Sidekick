import { ThemeTokens } from "./types";

export const sunsetCrimson: ThemeTokens = {
  id: "sunset-crimson",
  name: "Sunset Crimson",
  category: "vibrant",
  description: "Rich mahogany and velvet burgundy with electric coral accent lines.",

  canvasBackground: "radial-gradient(circle at 50% 0%, #2a0b12 0%, #150408 60%, #080103 100%)",
  gridColor: "rgba(249, 115, 22, 0.05)",

  cardBackground: "linear-gradient(180deg, rgba(48, 14, 22, 0.8) 0%, rgba(26, 7, 12, 0.92) 100%)",
  cardHoverBackground: "linear-gradient(180deg, rgba(64, 20, 30, 0.9) 0%, rgba(36, 10, 18, 0.98) 100%)",
  borderColor: "rgba(249, 115, 22, 0.3)",
  borderHoverColor: "rgba(251, 146, 60, 0.7)",
  topAccentBar: "linear-gradient(90deg, #FB923C, #F97316, transparent)",
  glowShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(249, 115, 22, 0.15)",
  glowHoverShadow: "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 35px rgba(251, 146, 60, 0.4)",
  backdropBlur: "blur(20px)",

  fontDisplay: "font-serif italic",
  fontBody: "font-sans",
  fontFamily: "'Playfair Display', Georgia, serif",
  primaryTextColor: "#FFEDD5",
  secondaryTextColor: "#FDBA74",
  mutedTextColor: "#9A3412",
  accentColor: "#FB923C",
  accentGlow: "rgba(251, 146, 60, 0.5)",

  badgeBackground: "rgba(249, 115, 22, 0.15)",
  badgeTextColor: "#FFEDD5",
  badgeBorder: "rgba(249, 115, 22, 0.3)",

  bulletColor: "#FB923C",
  edgeColor: "rgba(249, 115, 22, 0.35)",
  edgeActiveColor: "#FB923C"
};