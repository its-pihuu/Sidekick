import { ThemeTokens } from "./types";

export const gammaObsidian: ThemeTokens = {
  id: "gamma-obsidian",
  name: "Gamma Obsidian",
  category: "dark",
  description: "Gamma's iconic violet-dark glass surface with electric neon borders.",
  
  canvasBackground: "radial-gradient(ellipse 80% 80% at 50% -20%, #1a102f 0%, #0d0818 60%, #05030a 100%)",
  gridColor: "rgba(168, 85, 247, 0.06)",

  cardBackground: "linear-gradient(180deg, rgba(30, 20, 50, 0.8) 0%, rgba(18, 12, 32, 0.95) 100%)",
  cardHoverBackground: "linear-gradient(180deg, rgba(42, 28, 70, 0.9) 0%, rgba(24, 16, 42, 0.98) 100%)",
  borderColor: "rgba(168, 85, 247, 0.3)",
  borderHoverColor: "rgba(217, 70, 239, 0.7)",
  topAccentBar: "linear-gradient(90deg, #E879F9, #A855F7, transparent)",
  glowShadow: "0 10px 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(168, 85, 247, 0.15)",
  glowHoverShadow: "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 35px rgba(217, 70, 239, 0.35)",
  backdropBlur: "blur(20px)",

  fontDisplay: "font-sans font-bold",
  fontBody: "font-sans",
  fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  primaryTextColor: "#F3E8FF",
  secondaryTextColor: "#C084FC",
  mutedTextColor: "#7E22CE",
  accentColor: "#E879F9",
  accentGlow: "rgba(232, 121, 249, 0.5)",

  badgeBackground: "rgba(168, 85, 247, 0.15)",
  badgeTextColor: "#F0ABFC",
  badgeBorder: "rgba(168, 85, 247, 0.3)",

  bulletColor: "#E879F9",
  edgeColor: "rgba(168, 85, 247, 0.35)",
  edgeActiveColor: "#E879F9"
};