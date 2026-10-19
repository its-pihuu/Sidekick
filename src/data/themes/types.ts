export type ThemeCategory = "dark" | "light" | "luxury" | "vibrant" | "editorial";

export interface ThemeTokens {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;

  // Background Canvas Physics
  canvasBackground: string;
  gridColor: string;

  // Card Container Physics
  cardBackground: string;
  cardHoverBackground: string;
  borderColor: string;
  borderHoverColor: string;
  topAccentBar: string;
  glowShadow: string;
  glowHoverShadow: string;
  backdropBlur: string;

  // Typography Tokens
  fontDisplay: string;
  fontBody: string;
  fontFamily: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  mutedTextColor: string;
  accentColor: string;
  accentGlow: string;

  // Badge & Pill Tokens
  badgeBackground: string;
  badgeTextColor: string;
  badgeBorder: string;

  // List & Edge Tokens
  bulletColor: string;
  edgeColor: string;
  edgeActiveColor: string;
}