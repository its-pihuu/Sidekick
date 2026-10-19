import { ThemeTokens } from "./types";

export const cyberShibuya: ThemeTokens = {
  id: "cyber-shibuya",
  name: "Cyber Shibuya",
  category: "vibrant",
  description: "Hyper-saturated cyan and electric magenta over pitch-black carbon.",

  canvasBackground: "radial-gradient(circle at 50% 0%, #121218 0%, #08080C 60%, #020204 100%)",
  gridColor: "rgba(6, 182, 212, 0.06)",

  cardBackground: "linear-gradient(180deg, rgba(20, 20, 30, 0.85) 0%, rgba(10, 10, 16, 0.95) 100%)",
  cardHoverBackground: "linear-gradient(180deg, rgba(28, 28, 42, 0.95) 0%, rgba(14, 14, 22, 0.98) 100%)",
  borderColor: "rgba(6, 182, 212, 0.3)",
  borderHoverColor: "rgba(236, 72, 153, 0.7)",
  topAccentBar: "linear-gradient(90deg, #06B6D4, #EC4899, transparent)",
  glowShadow: "0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(6, 182, 212, 0.2)",
  glowHoverShadow: "0 20px 45px rgba(0, 0, 0, 0.9), 0 0 40px rgba(236, 72, 153, 0.4)",
  backdropBlur: "blur(20px)",

  fontDisplay: "font-mono font-bold uppercase",
  fontBody: "font-sans",
  fontFamily: "'JetBrains Mono', monospace",
  primaryTextColor: "#F8FAFC",
  secondaryTextColor: "#A5F3FC",
  mutedTextColor: "#0891B2",
  accentColor: "#EC4899",
  accentGlow: "rgba(236, 72, 153, 0.5)",

  badgeBackground: "rgba(6, 182, 212, 0.15)",
  badgeTextColor: "#67E8F9",
  badgeBorder: "rgba(6, 182, 212, 0.3)",

  bulletColor: "#EC4899",
  edgeColor: "rgba(6, 182, 212, 0.35)",
  edgeActiveColor: "#EC4899"
};