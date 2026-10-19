import { ThemeTokens } from "@/data/themes/types";

export type CanvasType = 
  | "mindmap" 
  | "roadmap" 
  | "flowchart" 
  | "concept" 
  | "bento" 
  | "hierarchical" 
  | "timeline";

// Unify CanvasTheme directly with ThemeTokens
export type CanvasTheme = ThemeTokens;

export interface OutlineSection {
  id: string;
  title: string;
  description: string;
  order: number;
}