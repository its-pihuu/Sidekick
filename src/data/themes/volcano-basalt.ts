import { ThemeTokens } from "./types";

export const volcanoBasalt: ThemeTokens = {
  id: "volcano-basalt",
  name: "Volcano Basalt",
  category: "dark",
  description: "Pitch carbon backdrop with glowing magma crimson accents and lava borders.",

  canvasBackground: "radial-gradient(circle at 50% 0%, #200808 0%, #100303 60%, #050101 100%)",
  gridColor: "rgba(239, 68, 68, 0.05)",

  cardBackground: "linear-gradient(180deg, rgba(40, 12, 12, 0.8) 0%, rgba(20, 6, 6, 0.95) 100%)",
  cardHoverBackground: "linear-gradient(180deg, rgba(55, 18, 18, 0.9) 0%, rgba(28, 8, 8, 0.98) 100%)",
  borderColor: "rgba(239, 68, 68, 0.3)",
  borderHoverColor: "rgba(248, 113, 113, 0.7)",
  topAccentBar: "linear-gradient(90deg, #EF4444, #F87171, transparent)",
  glowShadow: "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(239, 68, 68, 0.15)",
  glowHoverShadow: "0 20px 40px rgba(0, 0, 0, 0.85), 0 0 35px rgba(248, 113, 113, 0.35)",
  backdropBlur: "blur(20px)",

  fontDisplay: "font-sans font-extrabold uppercase",
  fontBody: "font-sans",
  fontFamily: "'Inter', system-ui, sans-serif",
  primaryTextColor: "#FEF2F2",
  secondaryTextColor: "#FCA5A5",
  mutedTextColor: "#991B1B",
  accentColor: "#EF4444",
  accentGlow: "rgba(239, 68, 68, 0.5)",

  badgeBackground: "rgba(239, 68, 68, 0.15)",
  badgeTextColor: "#FECACA",
  badgeBorder: "rgba(239, 68, 68, 0.3)",

  bulletColor: "#EF4444",
  edgeColor: "rgba(239, 68, 68, 0.35)",
  edgeActiveColor: "#EF4444"
};