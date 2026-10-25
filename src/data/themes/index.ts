import { architectBrass } from "./architect-brass";
import { gammaObsidian } from "./gamma-obsidian";
import { oasisEmerald } from "./oasis-emerald";
import { volcanoBasalt } from "./volcano-basalt";
import { cyberShibuya } from "./cyber-shibuya";
import { midnightSapphire } from "./midnight-sapphire";
import { emeraldVault } from "./emerald-vault";
import { roseQuartz } from "./rose-quartz";
import { sunsetCrimson } from "./sunset-crimson";
import { nordicFog } from "./nordic-fog";
import { parisParchment } from "./paris-parchment";
import { swissBrutalist } from "./swiss-brutalist";
import { botanicalSage } from "./botanical-sage";

export const CANVAS_THEMES = [
  architectBrass,
  gammaObsidian,
  oasisEmerald,
  volcanoBasalt,
  cyberShibuya,
  midnightSapphire,
  emeraldVault,
  roseQuartz,
  sunsetCrimson,
  nordicFog,
  parisParchment,
  swissBrutalist,
  botanicalSage,
];

export const themes: Record<string, any> = {
  "architect-brass": architectBrass,
  "gamma-obsidian": gammaObsidian,
  "oasis-emerald": oasisEmerald,
  "volcano-basalt": volcanoBasalt,
  "cyber-shibuya": cyberShibuya,
  "midnight-sapphire": midnightSapphire,
  "emerald-vault": emeraldVault,
  "rose-quartz": roseQuartz,
  "sunset-crimson": sunsetCrimson,
  "nordic-fog": nordicFog,
  "paris-parchment": parisParchment,
  "swiss-brutalist": swissBrutalist,
  "botanical-sage": botanicalSage,
};

export const THEMES = themes;
export const themeRegistry = themes;

export function parseTheme(raw: any) {
  if (typeof raw === "string" && themes[raw]) return themes[raw];
  if (raw && typeof raw === "object") return raw;
  return architectBrass;
}

export default CANVAS_THEMES;