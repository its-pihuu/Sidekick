import { ThemeTokens } from "./types";
import { gammaObsidian } from "./gamma-obsidian";
import { architectBrass } from "./architect-brass";
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

export * from "./types";

export const CANVAS_THEMES: ThemeTokens[] = [
  gammaObsidian,
  architectBrass,
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
  botanicalSage
];

export const getThemeById = (id: string): ThemeTokens => {
  return CANVAS_THEMES.find((t) => t.id === id) || gammaObsidian;
};