import { ThemeTokens } from "./types";

export const nordicFog: ThemeTokens = {
  id: "nordic-fog",
  name: "Nordic Fog",
  category: "light",
  description: "Crisp alabaster light canvas with sharp indigo structural cards.",

  canvasBackground: "radial-gradient(circle at 50% 0%, #F1F5F9 0%, #E2E8F0 60%, #CBD5E1 100%)",
  gridColor: "rgba(99, 102, 241, 0.08)",

  cardBackground: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
  cardHoverBackground: "#FFFFFF",
  borderColor: "rgba(99, 102, 241, 0.2)",
  borderHoverColor: "rgba(79, 70, 229, 0.6)",
  topAccentBar: "linear-gradient(90deg, #4F46E5, #6366F1, transparent)",
  glowShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
  glowHoverShadow: "0 20px 35px -5px rgba(79, 70, 229, 0.18)",
  backdropBlur: "none",

  fontDisplay: "font-sans font-bold",
  fontBody: "font-sans",
  fontFamily: "'Inter', system-ui, sans-serif",
  primaryTextColor: "#0F172A",
  secondaryTextColor: "#475569",
  mutedTextColor: "#94A3B8",
  accentColor: "#4F46E5",
  accentGlow: "rgba(79, 70, 229, 0.3)",

  badgeBackground: "rgba(79, 70, 229, 0.08)",
  badgeTextColor: "#4F46E5",
  badgeBorder: "rgba(79, 70, 229, 0.2)",

  bulletColor: "#4F46E5",
  edgeColor: "rgba(79, 70, 229, 0.25)",
  edgeActiveColor: "#4F46E5"
};