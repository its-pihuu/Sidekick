"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Brain,
  Compass,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  LayoutGrid,
  GitFork,
  Workflow,
  Clock,
  Maximize2,
  Layers,
  Wand2,
} from "lucide-react";

import * as ThemesModule from "@/data/themes";

export type StructureLayout = "radial" | "tree" | "flow" | "timeline" | "freeform";
export type CanvasFormatType = "mindmap" | "roadmap";

// Extract theme map safely regardless of export name
const themeMap: Record<string, any> =
  (ThemesModule as any).themes ||
  (ThemesModule as any).THEMES ||
  (ThemesModule as any).themeRegistry ||
  (ThemesModule as any).default ||
  {};

// Universal theme parser supporting both flat and nested ThemeTokens
function parseTheme(raw: any) {
  if (!raw) {
    return {
      id: "architect-brass",
      name: "Architect Brass",
      bg: "#0C1519",
      cardBg: "#131F24",
      border: "rgba(207, 157, 123, 0.25)",
      text: "#F0E6D2",
      subtext: "rgba(240, 230, 210, 0.6)",
      accent: "#CF9D7B",
      displayFont: "Cormorant Garamond",
      bodyFont: "Inter",
    };
  }

  return {
    id: raw.id || "architect-brass",
    name: raw.name || "Architect Brass",
    bg: raw.bg || raw.colors?.bg || "#0C1519",
    cardBg: raw.cardBg || raw.surface || raw.colors?.cardBg || "#131F24",
    border: raw.border || raw.colors?.border || "rgba(207, 157, 123, 0.25)",
    text: raw.text || raw.colors?.text || "#F0E6D2",
    subtext: raw.subtext || raw.textMuted || raw.colors?.subtext || "rgba(240, 230, 210, 0.6)",
    accent: raw.accent || raw.colors?.accent || "#CF9D7B",
    displayFont: raw.displayFont || raw.fontDisplay || raw.fonts?.display || "Cormorant Garamond",
    bodyFont: raw.bodyFont || raw.fontBody || raw.fonts?.body || "Inter",
  };
}

const STRUCTURE_OPTIONS: Record<
  CanvasFormatType,
  { id: StructureLayout; title: string; desc: string; icon: React.ElementType }[]
> = {
  mindmap: [
    { id: "radial", title: "Radial Cluster", desc: "Core node in center, sub-ideas expanding outward in radial rings.", icon: LayoutGrid },
    { id: "tree", title: "Hierarchy Tree", desc: "Top-down organization for taxonomy and structured breakdown.", icon: GitFork },
    { id: "flow", title: "Decision Flow", desc: "Branching logical paths and conditional decision points.", icon: Workflow },
    { id: "freeform", title: "Freeform Canvas", desc: "Unconstrained layout with manual drag-and-drop node placement.", icon: Maximize2 },
  ],
  roadmap: [
    { id: "timeline", title: "Sequential Track", desc: "Linear horizontal track divided into clear phase milestones.", icon: Clock },
    { id: "flow", title: "Dependency Flow", desc: "Interconnected swimlanes showing critical path dependencies.", icon: Workflow },
    { id: "tree", title: "Phase Breakdown", desc: "Top-level timeline with nested work streams per milestone.", icon: GitFork },
    { id: "freeform", title: "Spatial Board", desc: "Freeform milestone clusters with flexible drag placement.", icon: Maximize2 },
  ],
};

export default function CanvasHubPage() {
  const router = useRouter();

  // Step state: 1: Format -> 2: Prompt -> 3: Outline -> 4: Theme
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [canvasType, setCanvasType] = useState<CanvasFormatType>("mindmap");
  const [structure, setStructure] = useState<StructureLayout>("radial");
  const [prompt, setPrompt] = useState("");
  const [complexity, setComplexity] = useState<"focused" | "balanced" | "exhaustive">("balanced");
  const [selectedThemeKey, setSelectedThemeKey] = useState<string>("architect-brass");

  // Outline Generation State
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [outlineNodes, setOutlineNodes] = useState<
    { id: string; label: string; desc: string; category?: string }[]
  >([]);

  const handleSelectFormat = (type: CanvasFormatType) => {
    setCanvasType(type);
    setStructure(type === "mindmap" ? "radial" : "timeline");
    setStep(2);
  };

  const handleGenerateOutline = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingOutline(true);

    try {
      const res = await fetch("/api/canvas/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, canvasType, structure, complexity }),
      });

      if (!res.ok) throw new Error("Failed to generate outline");
      const data = await res.json();
      setOutlineNodes(data.nodes || []);
      setStep(3);
    } catch (err) {
      console.error("Outline generation fallback engaged:", err);
      setOutlineNodes([
        { id: "1", label: "Core Strategic Concept", desc: prompt },
        { id: "2", label: "Phase 1: Architectural Foundation", desc: "Initial technical validation and structural setup." },
        { id: "3", label: "Phase 2: Core Implementation", desc: "Primary feature assembly and system integration." },
        { id: "4", label: "Phase 3: Operational Deployment", desc: "Production release, monitoring, and scaling." },
      ]);
      setStep(3);
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  const handleDeployBoard = () => {
    const payload = {
      canvasType,
      structure,
      prompt,
      theme: selectedThemeKey,
      nodes: outlineNodes,
    };
    sessionStorage.setItem("sidekick_canvas_init", JSON.stringify(payload));
    router.push(`/canvas/board?theme=${selectedThemeKey}`);
  };

  const activeTheme = parseTheme(themeMap[selectedThemeKey]);
  const availableThemeKeys = Object.keys(themeMap).length > 0 ? Object.keys(themeMap) : ["architect-brass"];

  return (
    <div className="min-h-screen bg-[#0C1519] text-[#F0E6D2] font-sans selection:bg-[#CF9D7B]/30 relative overflow-x-hidden">
      {/* Background Mesh */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#CF9D7B]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between border-b border-[#CF9D7B]/15 pb-6">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-2xl text-[#CF9D7B] font-semibold">Sidekick</span>
            <span className="text-[#F0E6D2]/30">/</span>
            <span className="font-mono text-xs tracking-widest text-[#F0E6D2]/60 uppercase">
              Spatial Canvas Architect
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {[1, 2, 3, 4].map((s) => (
              <React.Fragment key={s}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    step === s
                      ? "bg-[#CF9D7B] text-[#0C1519] font-bold shadow-[0_0_12px_rgba(207,157,123,0.4)]"
                      : step > s
                      ? "bg-[#CF9D7B]/20 text-[#CF9D7B] border border-[#CF9D7B]/40"
                      : "bg-[#131F24] text-[#F0E6D2]/40 border border-[#F0E6D2]/10"
                  }`}
                >
                  {s}
                </div>
                {s < 4 && <div className="w-4 h-[1px] bg-[#CF9D7B]/20" />}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* STEP 1: SELECT FORMAT */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h1 className="font-serif text-4xl md:text-5xl italic font-bold text-[#F0E6D2] mb-4">
                What are we mapping out tonight?
              </h1>
              <p className="text-[#F0E6D2]/70 font-sans text-lg">
                Select a structural canvas format. Every generated node maintains clear visual hierarchy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <button
                onClick={() => handleSelectFormat("mindmap")}
                className="group relative p-8 rounded-2xl bg-[#131F24] border border-[#CF9D7B]/20 hover:border-[#CF9D7B] transition-all text-left backdrop-blur-xl hover:shadow-[0_0_30px_rgba(207,157,123,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#CF9D7B]/10 border border-[#CF9D7B]/30 flex items-center justify-center text-[#CF9D7B] mb-6 group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif italic text-2xl text-[#F0E6D2] mb-2 font-semibold">
                    Spatial Mindmap
                  </h3>
                  <p className="text-sm text-[#F0E6D2]/60 leading-relaxed font-sans mb-6">
                    Deconstruct strategic theses, product architectures, and raw concepts into visual spatial clusters.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#CF9D7B] group-hover:translate-x-1 transition-transform">
                  <span>SELECT MINDMAP</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <button
                onClick={() => handleSelectFormat("roadmap")}
                className="group relative p-8 rounded-2xl bg-[#131F24] border border-[#CF9D7B]/20 hover:border-[#CF9D7B] transition-all text-left backdrop-blur-xl hover:shadow-[0_0_30px_rgba(207,157,123,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#CF9D7B]/10 border border-[#CF9D7B]/30 flex items-center justify-center text-[#CF9D7B] mb-6 group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif italic text-2xl text-[#F0E6D2] mb-2 font-semibold">
                    Execution Roadmap
                  </h3>
                  <p className="text-sm text-[#F0E6D2]/60 leading-relaxed font-sans mb-6">
                    Transform intent into sequential tracks, phase dependencies, and execution swimlanes.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#CF9D7B] group-hover:translate-x-1 transition-transform">
                  <span>SELECT ROADMAP</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PROMPT & STRUCTURE */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-xs font-mono text-[#F0E6D2]/50 hover:text-[#CF9D7B] transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" /> BACK TO FORMATS
            </button>

            <h2 className="font-serif italic text-3xl md:text-4xl text-[#F0E6D2] mb-3">
              Define the vision & choose structural flow
            </h2>
            <p className="text-sm text-[#F0E6D2]/60 mb-8 font-sans">
              The Architect will parse your vision and generate a spatial structure tailored to your chosen layout math.
            </p>

            <div className="mb-8">
              <label className="block font-mono text-xs text-[#CF9D7B] uppercase tracking-wider mb-2">
                Core Strategic Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. A 90-day execution plan to transition our cables manufacturing business into a direct-to-enterprise supply chain partner..."
                className="w-full h-32 p-4 rounded-xl bg-[#131F24] border border-[#CF9D7B]/25 focus:border-[#CF9D7B] focus:outline-none text-[#F0E6D2] placeholder-[#F0E6D2]/30 font-sans resize-none transition-all shadow-inner"
              />
            </div>

            <div className="mb-8">
              <label className="block font-mono text-xs text-[#CF9D7B] uppercase tracking-wider mb-3">
                Select Layout Math Engine
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {STRUCTURE_OPTIONS[canvasType].map((opt) => {
                  const IconComp = opt.icon;
                  const isSelected = structure === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setStructure(opt.id)}
                      className={`p-4 rounded-xl text-left border transition-all flex items-start gap-3 ${
                        isSelected
                          ? "bg-[#CF9D7B]/15 border-[#CF9D7B] shadow-[0_0_15px_rgba(207,157,123,0.1)]"
                          : "bg-[#131F24] border-[#F0E6D2]/10 hover:border-[#CF9D7B]/40"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-[#CF9D7B] text-[#0C1519]" : "bg-[#0C1519] text-[#CF9D7B]"}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif italic font-semibold text-[#F0E6D2]">{opt.title}</div>
                        <div className="text-xs text-[#F0E6D2]/50 font-sans mt-1 leading-snug">{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-10">
              <label className="block font-mono text-xs text-[#CF9D7B] uppercase tracking-wider mb-3">
                Node Density & Depth
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["focused", "balanced", "exhaustive"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setComplexity(level)}
                    className={`py-3 rounded-xl font-mono text-xs capitalize border transition-all ${
                      complexity === level
                        ? "bg-[#CF9D7B] text-[#0C1519] font-bold border-[#CF9D7B]"
                        : "bg-[#131F24] text-[#F0E6D2]/60 border-[#F0E6D2]/10 hover:border-[#CF9D7B]/30"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateOutline}
              disabled={!prompt.trim() || isGeneratingOutline}
              className="w-full py-4 rounded-xl bg-[#CF9D7B] text-[#0C1519] font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#d8a887] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(207,157,123,0.25)]"
            >
              {isGeneratingOutline ? (
                <>
                  <Wand2 className="w-4 h-4 animate-spin" />
                  <span>THE ARCHITECT IS STRUCTURING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE OUTLINE & STRUCTURE</span>
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* STEP 3: EDIT OUTLINE */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 text-xs font-mono text-[#F0E6D2]/50 hover:text-[#CF9D7B] transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" /> BACK TO PROMPT
            </button>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif italic text-3xl text-[#F0E6D2]">Review Node Outline</h2>
                <p className="text-xs font-mono text-[#CF9D7B] mt-1">
                  STRUCTURE: {structure.toUpperCase()} · FORMAT: {canvasType.toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-xl bg-[#CF9D7B] text-[#0C1519] font-mono text-xs tracking-wider uppercase font-bold hover:bg-[#d8a887] transition-all flex items-center gap-2"
              >
                <span>CHOOSE THEME</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 mb-8">
              {outlineNodes.map((node, idx) => (
                <div
                  key={node.id || idx}
                  className="p-4 rounded-xl bg-[#131F24] border border-[#CF9D7B]/20 flex items-start justify-between gap-4"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={node.label}
                      onChange={(e) => {
                        const updated = [...outlineNodes];
                        updated[idx].label = e.target.value;
                        setOutlineNodes(updated);
                      }}
                      className="bg-transparent font-serif italic text-lg text-[#F0E6D2] focus:outline-none w-full border-b border-transparent focus:border-[#CF9D7B]/40 pb-1"
                    />
                    <textarea
                      value={node.desc}
                      onChange={(e) => {
                        const updated = [...outlineNodes];
                        updated[idx].desc = e.target.value;
                        setOutlineNodes(updated);
                      }}
                      className="bg-transparent font-sans text-xs text-[#F0E6D2]/60 focus:outline-none w-full mt-2 resize-none"
                      rows={2}
                    />
                  </div>
                  <span className="font-mono text-[10px] text-[#CF9D7B] px-2 py-1 bg-[#CF9D7B]/10 rounded border border-[#CF9D7B]/20">
                    NODE #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 4: THEME GALLERY */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 text-xs font-mono text-[#F0E6D2]/50 hover:text-[#CF9D7B] transition-colors mb-6"
            >
              <ChevronLeft className="w-4 h-4" /> BACK TO OUTLINE
            </button>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif italic text-3xl text-[#F0E6D2]">Select Theme Aesthetic</h2>
                <p className="text-xs font-mono text-[#CF9D7B] mt-1">
                  {availableThemeKeys.length} MODULAR THEME TOKENS REGISTERED
                </p>
              </div>
              <button
                onClick={handleDeployBoard}
                className="px-8 py-4 rounded-xl bg-[#CF9D7B] text-[#0C1519] font-mono text-xs tracking-widest uppercase font-bold hover:bg-[#d8a887] transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(207,157,123,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>DEPLOY TO LIVE CANVAS</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {availableThemeKeys.map((themeKey) => {
                  const t = parseTheme(themeMap[themeKey]);
                  const isSelected = selectedThemeKey === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => setSelectedThemeKey(themeKey)}
                      className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                        isSelected
                          ? "bg-[#CF9D7B]/20 border-[#CF9D7B] shadow-[0_0_15px_rgba(207,157,123,0.15)]"
                          : "bg-[#131F24] border-[#F0E6D2]/10 hover:border-[#CF9D7B]/30"
                      }`}
                    >
                      <div>
                        <div className="font-serif italic text-base text-[#F0E6D2]">{t.name}</div>
                        <div className="font-mono text-[10px] text-[#F0E6D2]/40 uppercase mt-0.5">
                          {t.displayFont}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: t.bg }} />
                        <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: t.accent }} />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="lg:col-span-2">
                <div
                  className="p-8 rounded-2xl border transition-all min-h-[400px] flex flex-col justify-between"
                  style={{
                    backgroundColor: activeTheme.bg,
                    borderColor: activeTheme.border,
                  }}
                >
                  <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: activeTheme.border }}>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4" style={{ color: activeTheme.accent }} />
                      <span className="font-mono text-xs uppercase tracking-wider" style={{ color: activeTheme.subtext }}>
                        LIVE PREVIEW
                      </span>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 rounded-full border" style={{ color: activeTheme.accent, borderColor: activeTheme.border }}>
                      {activeTheme.name}
                    </span>
                  </div>

                  <div className="my-8 space-y-4">
                    <h3 className="text-3xl font-serif italic" style={{ color: activeTheme.text }}>
                      {prompt || "Strategic Blueprint Preview"}
                    </h3>
                    <p className="text-sm font-sans max-w-lg leading-relaxed" style={{ color: activeTheme.subtext }}>
                      Nodes will render with dual-font pairing ({activeTheme.displayFont} display header + {activeTheme.bodyFont} body copy), custom accent bullets, and dynamic glow borders.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {outlineNodes.slice(0, 2).map((n, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border backdrop-blur-md"
                        style={{
                          backgroundColor: activeTheme.cardBg,
                          borderColor: activeTheme.border,
                        }}
                      >
                        <div className="font-serif italic text-base mb-1" style={{ color: activeTheme.text }}>
                          {n.label}
                        </div>
                        <div className="font-sans text-xs truncate" style={{ color: activeTheme.subtext }}>
                          {n.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}