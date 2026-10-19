import { ThemeTokens } from "./types";

export const midnightSapphire: ThemeTokens = {
  id: "midnight-sapphire",
  name: "Midnight Sapphire",
  category: "dark",
  description: "Deep galactic navy with electric blue connector lines and sapphire highlights.",

  canvasBackground: "radial-gradient(circle at 50% 0%, #0A192F 0%, #030C1B 60%, #01050E 100%)",
  gridColor: "rgba(59, 130, 246, 0.06)",

  cardBackground: "linear-gradient(180deg, rgba(15, 30, 58, 0.8) 0%, rgba(7, 16, 32, 0.92) 100%)",
  cardHoverBackground: "linear-gradient(180deg, rgba(22, 42, 80, 0.9) 0%, rgba(10, 22, 44, 0.98) 100%)",
  borderColor: "rgba(59, 130, 246, 0.3)",
  borderHoverColor: "rgba(96, 165, 250, 0.7)",
  topAccentBar: "linear-gradient(90deg, #3B82F6, #60A5FA, transparent)",
  glowShadow: "0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.18)",
  glowHoverShadow: "0 20px 40px rgba(0, 0, 0, 0.85), 0 0 35px rgba(96, 165, 250, 0.38)",
  backdropBlur: "blur(20px)",

  fontDisplay: "font-sans font-bold",
  fontBody: "font-sans",
  fontFamily: "'Inter', system-ui, sans-serif",
  primaryTextColor: "#EFF6FF",
  secondaryTextColor: "#93C5FD",
  mutedTextColor: "#1E40AF",
  accentColor: "#3B82F6",
  accentGlow: "rgba(59, 130, 246, 0.5)",

  badgeBackground: "rgba(59, 130, 246, 0.15)",
  badgeTextColor: "#BFDBFE",
  badgeBorder: "rgba(59, 130, 246, 0.3)",

  bulletColor: "#60A5FA",
  edgeColor: "rgba(59, 130, 246, 0.35)",
  edgeActiveColor: "#3B82F6"
};