import { ThemeTokens } from "./types";

export const oasisEmerald: ThemeTokens = {
  id: "oasis-emerald",
  name: "Oasis Emerald",
  category: "dark",
  description: "Deep oceanic teal with neon mint highlights and frosted glass surfaces.",

  canvasBackground: "radial-gradient(circle at 50% 0%, #06201b 0%, #03100d 60%, #010806 100%)",
  gridColor: "rgba(45, 212, 191, 0.05)",

  cardBackground: "linear-gradient(180deg, rgba(10, 40, 34, 0.75) 0%, rgba(5, 24, 20, 0.9) 100%)",
  cardHoverBackground: "linear-gradient(180deg, rgba(16, 56, 48, 0.85) 0%, rgba(8, 32, 27, 0.95) 100%)",
  borderColor: "rgba(45, 212, 191, 0.25)",
  borderHoverColor: "rgba(45, 212, 191, 0.65)",
  topAccentBar: "linear-gradient(90deg, #2DD4BF, #14B8A6, transparent)",
  glowShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(45, 212, 191, 0.12)",
  glowHoverShadow: "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(45, 212, 191, 0.35)",
  backdropBlur: "blur(20px)",

  fontDisplay: "font-sans font-bold",
  fontBody: "font-sans",
  fontFamily: "'Inter', system-ui, sans-serif",
  primaryTextColor: "#CCFBF1",
  secondaryTextColor: "#5EEAD4",
  mutedTextColor: "#115E59",
  accentColor: "#2DD4BF",
  accentGlow: "rgba(45, 212, 191, 0.4)",

  badgeBackground: "rgba(45, 212, 191, 0.15)",
  badgeTextColor: "#5EEAD4",
  badgeBorder: "rgba(45, 212, 191, 0.3)",

  bulletColor: "#2DD4BF",
  edgeColor: "rgba(45, 212, 191, 0.3)",
  edgeActiveColor: "#2DD4BF"
};