"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Network, 
  GitFork, 
  Workflow, 
  Boxes, 
  GitCommit, 
  FolderTree, 
  Sparkles, 
  ArrowRight, 
  Shuffle, 
  Layers, 
  Eye, 
  Check, 
  Plus, 
  Trash2, 
  GripVertical
} from "lucide-react";
import { CanvasType, CanvasTheme, OutlineSection } from "@/types/canvas";
import { CANVAS_THEMES } from "@/data/themes";
import { SpatialCanvasView } from "@/components/canvas/spatial-canvas-view";

export const SPATIAL_FORMATS: {
  id: CanvasType;
  title: string;
  subtitle: string;
  tag: string;
  icon: any;
  description: string;
  examples: string[];
}[] = [
  {
    id: "mindmap",
    title: "Strategic Mindmap",
    subtitle: "Radial concept expansion",
    tag: "Ideation",
    icon: Network,
    description: "Deconstruct complex ideas from a central core into tactical nodes and leaf executions.",
    examples: [
      "How to scale a regional cable factory into a national B2B brand",
      "Deconstructing a competitor's hidden distribution network",
      "Zero to 100,000 active users with ₹0 marketing budget"
    ]
  },
  {
    id: "roadmap",
    title: "Quarterly Roadmap",
    subtitle: "Milestone execution track",
    tag: "Strategy",
    icon: GitCommit,
    description: "Chronological milestone horizons mapping dependencies, risks, and quarterly targets.",
    examples: [
      "12-Month factory automation and wholesale dealer expansion",
      "The 90-day turnaround plan for a stagnant sales pipeline",
      "Building and launching a market-ready app during school holidays"
    ]
  },
  {
    id: "flowchart",
    title: "System Flowchart",
    subtitle: "Decision logic & pipelines",
    tag: "Operations",
    icon: Workflow,
    description: "Step-by-step logic trees, conditional branches, and operational workflows.",
    examples: [
      "High-value wholesale credit approval and dealer onboarding pipeline",
      "Inbound buyer lead qualification and contract signing loop",
      "Automated factory raw material reordering and quality check flow"
    ]
  },
  {
    id: "bento",
    title: "Bento Strategy Grid",
    subtitle: "High-density spatial matrix",
    tag: "Architecture",
    icon: Boxes,
    description: "Asymmetrical visual compartments highlighting core pillars, metrics, and tactical moats.",
    examples: [
      "Full business breakdown: Profit margins, supply bottlenecks, and growth moats",
      "Product-market fit audit and competitive positioning matrix",
      "Solo founder resource allocation and daily high-leverage priorities"
    ]
  },
  {
    id: "concept",
    title: "Concept Knowledge Map",
    subtitle: "Interconnected node web",
    tag: "Research",
    icon: GitFork,
    description: "Complex relational graph linking theories, market forces, and execution variables.",
    examples: [
      "Copper price surges vs. wholesale distributor profit margins",
      "Psychology of B2B procurement officers and closing triggers",
      "AI architecture dependencies and real-time streaming data flow"
    ]
  },
  {
    id: "hierarchical",
    title: "Organizational Tree",
    subtitle: "Top-down governance structure",
    tag: "Structure",
    icon: FolderTree,
    description: "Multi-tier operational chains, command structures, and structural accountability trees.",
    examples: [
      "Manufacturing plant chain of command and factory floor accountability",
      "Lean 10-person core team structure vs 100-person enterprise scale",
      "Tier-1, Tier-2, and Tier-3 dealer distribution network hierarchy"
    ]
  }
];

export const CANVAS_FORMATS = SPATIAL_FORMATS;

export default function CanvasPage() {
  const [step, setStep] = useState<"select-format" | "configure" | "outline" | "theme-modal" | "rendered-board">("select-format");
  
  const [selectedFormat, setSelectedFormat] = useState<CanvasType>("roadmap");
  const [prompt, setPrompt] = useState("");
  const [complexity, setComplexity] = useState<"concise" | "balanced" | "exhaustive">("balanced");
  const [selectedTheme, setSelectedTheme] = useState<CanvasTheme>(CANVAS_THEMES[0]);
  const [themeCategory, setThemeCategory] = useState<string>("all");
  
  const [outline, setOutline] = useState<OutlineSection[]>([]);
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[] } | null>(null);

  const currentFormatMeta = SPATIAL_FORMATS.find(f => f.id === selectedFormat) || SPATIAL_FORMATS[0];

  const handleSelectFormat = (formatId: CanvasType) => {
    setSelectedFormat(formatId);
    const meta = SPATIAL_FORMATS.find(f => f.id === formatId);
    if (meta && meta.examples.length > 0) {
      setPrompt(meta.examples[0]);
    }
    setStep("configure");
  };

  const handleShufflePrompt = () => {
    const list = currentFormatMeta.examples;
    const next = list[(list.indexOf(prompt) + 1) % list.length] || list[0];
    setPrompt(next);
  };

  const handleFetchOutline = async () => {
    if (!prompt.trim()) return;
    setIsLoadingOutline(true);
    setStep("outline");

    try {
      const res = await fetch("/api/canvas/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, format: selectedFormat, complexity })
      });

      if (!res.ok) throw new Error("Failed outline fetch");
      const data = await res.json();
      setOutline(data.sections || []);
    } catch (err) {
      console.error(err);
      setOutline([
        { id: "1", title: "Strategic Foundation & Objective", description: "Establish anchor parameters and operational bounds", order: 0 },
        { id: "2", title: "Primary Execution Vectors", description: "High-priority initiatives mapped with hard dependencies", order: 1 },
        { id: "3", title: "Operational Bottlenecks & Risk Moats", description: "Contingency protocols and defensive buffers", order: 2 },
        { id: "4", title: "Scale Trajectory & Milestone Outputs", description: "Target deliverables and verified metrics", order: 3 }
      ]);
    } finally {
      setIsLoadingOutline(false);
    }
  };

  const handleDeployCanvas = async () => {
    setIsGeneratingGraph(true);
    const defaultSections = outline.length > 0 ? outline : [
      { id: "1", title: "Strategic Foundation & Objective", description: "Establish anchor parameters and operational bounds", order: 0 },
      { id: "2", title: "Primary Execution Vectors", description: "High-priority initiatives mapped with hard dependencies", order: 1 },
      { id: "3", title: "Operational Bottlenecks & Risk Moats", description: "Contingency protocols and defensive buffers", order: 2 },
      { id: "4", title: "Scale Trajectory & Milestone Outputs", description: "Target deliverables and verified metrics", order: 3 }
    ];

    try {
      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          format: selectedFormat,
          complexity,
          theme: selectedTheme,
          sections: defaultSections
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGraphData({ nodes: data.nodes, edges: data.edges });
      } else {
        throw new Error("API status non-200");
      }
    } catch (err) {
      console.warn("API fallback engaged:", err);
      const fallbackNodes = defaultSections.map((sec, idx) => ({
        id: `node-${idx + 1}`,
        type: "custom",
        position: selectedFormat === "roadmap" 
          ? { x: 80 + idx * 380, y: 220 } 
          : { x: 380 + (idx % 2 === 0 ? -140 : 140), y: 80 + idx * 240 },
        data: {
          title: sec.title,
          description: sec.description,
          bullets: ["Primary execution deliverable", "Risk moat verification"],
          phaseTag: `PHASE 0${idx + 1}`,
          theme: selectedTheme
        }
      }));

      const fallbackEdges = defaultSections.slice(1).map((_, idx) => ({
        id: `edge-${idx + 1}-${idx + 2}`,
        source: `node-${idx + 1}`,
        target: `node-${idx + 2}`,
        animated: true,
        style: { stroke: selectedTheme.accentColor || "#CF9D7B", strokeWidth: 2 }
      }));

      setGraphData({ nodes: fallbackNodes, edges: fallbackEdges });
    } finally {
      setIsGeneratingGraph(false);
      setStep("rendered-board");
    }
  };

  const filteredThemes = themeCategory === "all" 
    ? CANVAS_THEMES 
    : CANVAS_THEMES.filter(t => t.category === themeCategory);

  if (step === "rendered-board" && graphData) {
    return (
      <div className="relative w-full h-screen bg-[#0C1519] overflow-hidden">
        <div className="absolute top-4 left-6 z-20 flex items-center gap-3">
          <button
            onClick={() => setStep("select-format")}
            className="px-3.5 py-1.5 rounded-lg bg-[#142026]/90 border border-white/10 hover:border-[#CF9D7B]/50 text-xs font-mono text-[#F0E6D2] transition-all backdrop-blur-md flex items-center gap-2"
          >
            <Layers className="w-3.5 h-3.5 text-[#CF9D7B]" />
            Back to Forge
          </button>
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-xs font-mono text-[#F0E6D2]/60 uppercase tracking-wider">
            {selectedFormat} • {selectedTheme.name}
          </span>
        </div>

        <SpatialCanvasView
          initialNodes={graphData.nodes}
          initialEdges={graphData.edges}
          theme={selectedTheme}
          canvasType={selectedFormat}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C1519] text-[#F0E6D2] font-sans selection:bg-[#CF9D7B]/30 selection:text-[#F0E6D2] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#CF9D7B]/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#182830]/40 blur-[160px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <header className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16232A] border border-[#CF9D7B]/30 text-xs font-mono text-[#CF9D7B] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            THE ARCHITECT'S SPATIAL FORGE
          </div>
          <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-[#F0E6D2] tracking-tight mb-4">
            Spatial Strategy & Visual Maps
          </h1>
          <p className="text-[#F0E6D2]/60 text-base max-w-xl">
            Generate node-based visual architectures, roadmaps, and decision logic trees. Cold clarity before execution.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {step === "select-format" && (
            <motion.div
              key="format-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {SPATIAL_FORMATS.map((fmt) => {
                const Icon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => handleSelectFormat(fmt.id)}
                    className="group text-left p-6 rounded-2xl bg-[#131F24]/80 hover:bg-[#182830] border border-white/5 hover:border-[#CF9D7B]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1D2E36] flex items-center justify-center text-[#CF9D7B] group-hover:scale-110 group-hover:bg-[#CF9D7B] group-hover:text-[#0C1519] transition-all">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-[#F0E6D2]/60 border border-white/5">
                          {fmt.tag}
                        </span>
                      </div>
                      <h3 className="font-serif italic text-2xl text-[#F0E6D2] mb-1 group-hover:text-[#CF9D7B] transition-colors">
                        {fmt.title}
                      </h3>
                      <p className="text-xs font-mono text-[#CF9D7B]/80 mb-3">{fmt.subtitle}</p>
                      <p className="text-xs text-[#F0E6D2]/60 leading-relaxed">{fmt.description}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#F0E6D2]/40 group-hover:text-[#CF9D7B]">
                      <span>Initialize Board</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {step === "configure" && (
            <motion.div
              key="configure-panel"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto bg-[#131F24]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1D2E36] flex items-center justify-center text-[#CF9D7B]">
                    <currentFormatMeta.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif italic text-[#F0E6D2]">{currentFormatMeta.title}</h2>
                    <p className="text-xs font-mono text-[#CF9D7B]">{currentFormatMeta.subtitle}</p>
                  </div>
                </div>
                <button
                  onClick={() => setStep("select-format")}
                  className="text-xs font-mono text-[#F0E6D2]/50 hover:text-[#F0E6D2]"
                >
                  Change Format
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#F0E6D2]/70">
                    Define Objective or Domain
                  </label>
                  <button
                    onClick={handleShufflePrompt}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#CF9D7B]"
                  >
                    <Shuffle className="w-3 h-3" />
                    Spark Example
                  </button>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="e.g. 10-year Indian Wires & Cables distribution roadmap with supply chain risk moats..."
                  className="w-full bg-[#0C1519] border border-white/10 rounded-xl p-4 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus:border-[#CF9D7B] resize-none font-sans"
                />
              </div>

              <div className="mb-8">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#F0E6D2]/70 mb-3">
                  Granularity & Depth
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["concise", "balanced", "exhaustive"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setComplexity(level)}
                      className={`py-3 px-4 rounded-xl text-xs font-mono capitalize border transition-all ${
                        complexity === level
                          ? "bg-[#CF9D7B]/10 border-[#CF9D7B] text-[#CF9D7B]"
                          : "bg-[#0C1519]/50 border-white/5 text-[#F0E6D2]/60 hover:border-white/20"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setStep("select-format")}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-[#F0E6D2]/70 hover:text-[#F0E6D2]"
                >
                  Back
                </button>
                <button
                  onClick={handleFetchOutline}
                  disabled={!prompt.trim() || isLoadingOutline}
                  className="px-6 py-2.5 rounded-xl bg-[#CF9D7B] hover:bg-[#d8ab8c] text-[#0C1519] text-xs font-mono font-medium tracking-wide transition-all shadow-[0_4px_20px_rgba(207,157,123,0.3)] disabled:opacity-50 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isLoadingOutline ? "Drafting Architecture..." : "Draft Strategy Outline"}
                </button>
              </div>
            </motion.div>
          )}

          {step === "outline" && (
            <motion.div
              key="outline-editor"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto bg-[#131F24]/95 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
            >
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#CF9D7B]">Step 3 of 4</span>
                  <h2 className="text-xl font-serif italic text-[#F0E6D2]">Review Node Architecture</h2>
                </div>
                <button
                  onClick={() => setStep("theme-modal")}
                  className="px-4 py-2 rounded-xl bg-[#CF9D7B] hover:bg-[#d8ab8c] text-[#0C1519] text-xs font-mono font-medium transition-all shadow-md flex items-center gap-2"
                >
                  Select Theme
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {isLoadingOutline ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#CF9D7B] border-t-transparent animate-spin" />
                  <p className="text-xs font-mono text-[#F0E6D2]/60">The Cartographer is mapping structural nodes...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                  {outline.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="group flex items-start gap-3 p-3.5 rounded-xl bg-[#0C1519]/60 border border-white/5 hover:border-white/20 transition-all"
                    >
                      <div className="pt-2 text-[#F0E6D2]/30">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-[#182830] flex items-center justify-center text-[11px] font-mono text-[#CF9D7B] shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => {
                            const updated = [...outline];
                            updated[idx].title = e.target.value;
                            setOutline(updated);
                          }}
                          className="w-full bg-transparent text-sm font-medium text-[#F0E6D2] focus:outline-none border-b border-transparent focus:border-[#CF9D7B]"
                        />
                        <input
                          type="text"
                          value={sec.description}
                          onChange={(e) => {
                            const updated = [...outline];
                            updated[idx].description = e.target.value;
                            setOutline(updated);
                          }}
                          className="w-full bg-transparent text-xs text-[#F0E6D2]/50 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => setOutline(outline.filter((_, i) => i !== idx))}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[#F0E6D2]/40 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setOutline([...outline, { id: Date.now().toString(), title: "New Strategic Vector", description: "Define phase deliverables", order: outline.length }])}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 hover:border-[#CF9D7B]/40 text-xs font-mono text-[#F0E6D2]/60 hover:text-[#CF9D7B] flex items-center justify-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Node Branch
                  </button>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <button onClick={() => setStep("configure")} className="text-xs font-mono text-[#F0E6D2]/50 hover:text-[#F0E6D2]">
                  ← Back to Prompt
                </button>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 4: True Gamma Theme Gallery (Mini Slide Cards + Live Preview)
              ───────────────────────────────────────────────────────────── */}
          {step === "theme-modal" && (
            <motion.div
              key="theme-gallery"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-5xl mx-auto bg-[#131F24]/95 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left Grid: Filterable Mini Slide Thumbnails */}
              <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#CF9D7B]">Step 4 of 4</span>
                      <h2 className="text-xl font-serif italic text-[#F0E6D2]">Select Visual Theme</h2>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex gap-1 bg-[#0C1519] p-1 rounded-lg border border-white/5 text-[11px] font-mono">
                      {(["all", "dark", "light", "luxury", "vibrant", "editorial"] as const).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setThemeCategory(cat)}
                          className={`px-2.5 py-1 rounded capitalize transition-all ${
                            themeCategory === cat
                              ? "bg-[#CF9D7B] text-[#0C1519] font-medium"
                              : "text-[#F0E6D2]/60 hover:text-[#F0E6D2]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Mini-Card Grid */}
                  <div className="grid grid-cols-2 gap-3.5 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredThemes.map((thm) => {
                      const isSelected = selectedTheme.id === thm.id;
                      return (
                        <button
                          key={thm.id}
                          onClick={() => setSelectedTheme(thm)}
                          className={`group text-left p-3 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                            isSelected
                              ? "border-[#CF9D7B] shadow-[0_0_25px_rgba(207,157,123,0.3)] ring-1 ring-[#CF9D7B]"
                              : "border-white/10 hover:border-white/30"
                          }`}
                          style={{ background: thm.canvasBackground }}
                        >
                          {/* Mini Card Skeleton inside picker */}
                          <div 
                            className="w-full p-2.5 rounded-lg border mb-2.5"
                            style={{ 
                              background: thm.cardBackground, 
                              borderColor: thm.borderColor,
                              fontFamily: thm.fontFamily 
                            }}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span 
                                className="text-[8px] font-mono uppercase px-1.5 py-0.5 rounded"
                                style={{ background: thm.badgeBackground, color: thm.badgeTextColor }}
                              >
                                {thm.category}
                              </span>
                              {isSelected && <Check className="w-3 h-3 text-[#CF9D7B]" />}
                            </div>
                            <div className="text-xs font-bold truncate mb-1" style={{ color: thm.primaryTextColor }}>
                              {thm.name}
                            </div>
                            <div className="h-1.5 w-3/4 rounded bg-current opacity-20 mb-1" style={{ color: thm.secondaryTextColor }} />
                            <div className="h-1.5 w-1/2 rounded bg-current opacity-15" style={{ color: thm.secondaryTextColor }} />
                          </div>

                          {/* 3 Color Swatch Dots */}
                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-[9px] font-mono text-white/50 truncate max-w-[90px]">
                              {thm.name}
                            </span>
                            <div className="flex items-center gap-1">
                              <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ background: thm.accentColor }} />
                              <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ background: thm.primaryTextColor }} />
                              <div className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ background: thm.badgeBackground }} />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5">
                  <button onClick={() => setStep("outline")} className="text-xs font-mono text-[#F0E6D2]/50 hover:text-[#F0E6D2]">
                    ← Back to Outline
                  </button>
                </div>
              </div>

              {/* Right Side: Live Multi-Block Presentation Card Preview */}
              <div 
                className="lg:col-span-5 p-6 flex flex-col justify-between transition-colors duration-500"
                style={{ background: selectedTheme.canvasBackground }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5" style={{ color: selectedTheme.primaryTextColor }}>
                      <Eye className="w-3.5 h-3.5" style={{ color: selectedTheme.accentColor }} />
                      Live Theme Card Render
                    </span>
                    <span 
                      className="text-[10px] font-mono px-2 py-0.5 rounded border"
                      style={{ 
                        background: selectedTheme.badgeBackground, 
                        color: selectedTheme.badgeTextColor,
                        borderColor: selectedTheme.badgeBorder 
                      }}
                    >
                      {selectedTheme.name}
                    </span>
                  </div>

                  {/* Gamma Multi-Block Card */}
                  <div
                    className="p-5 rounded-2xl border transition-all duration-500 shadow-2xl relative overflow-hidden"
                    style={{
                      background: selectedTheme.cardBackground,
                      borderColor: selectedTheme.borderColor,
                      boxShadow: selectedTheme.glowShadow,
                      fontFamily: selectedTheme.fontFamily
                    }}
                  >
                    {/* Top Accent Gradient Bar */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5"
                      style={{ background: selectedTheme.topAccentBar }}
                    />

                    <div className="flex items-center justify-between mb-3 pt-1">
                      <span
                        className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                        style={{
                          background: selectedTheme.badgeBackground,
                          color: selectedTheme.badgeTextColor,
                          border: `1px solid ${selectedTheme.badgeBorder}`
                        }}
                      >
                        PHASE 01 • STRATEGY
                      </span>
                      <Sparkles className="w-3.5 h-3.5" style={{ color: selectedTheme.accentColor }} />
                    </div>

                    <h4 className="text-xl font-bold mb-1.5 leading-snug" style={{ color: selectedTheme.primaryTextColor }}>
                      Industrial Cables & Supply Chain Expansion
                    </h4>
                    
                    <p className="text-xs leading-relaxed mb-4" style={{ color: selectedTheme.secondaryTextColor }}>
                      Modernizing B2B factory operations, dealer networks, and credit verification pipelines.
                    </p>

                    {/* Bullet List */}
                    <div className="space-y-2 pt-3 mb-4 border-t" style={{ borderColor: selectedTheme.borderColor }}>
                      <div className="flex items-center gap-2 text-xs" style={{ color: selectedTheme.primaryTextColor }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedTheme.bulletColor }} />
                        <span>Automated wholesale distributor onboarding</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: selectedTheme.secondaryTextColor }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: selectedTheme.bulletColor }} />
                        <span>Inventory lead-time compression (-22%)</span>
                      </div>
                    </div>

                    {/* Mini Callout Box */}
                    <div 
                      className="p-3 rounded-xl border text-xs leading-normal"
                      style={{ 
                        background: selectedTheme.badgeBackground, 
                        borderColor: selectedTheme.badgeBorder,
                        color: selectedTheme.primaryTextColor
                      }}
                    >
                      <span className="font-bold block mb-0.5" style={{ color: selectedTheme.accentColor }}>Architect Note:</span>
                      Eliminates working capital lag across 15 regional dealers.
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDeployCanvas}
                  disabled={isGeneratingGraph}
                  className="w-full mt-6 py-3.5 rounded-xl bg-[#CF9D7B] hover:bg-[#d8ab8c] text-[#0C1519] text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(207,157,123,0.35)] flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  {isGeneratingGraph ? "Constructing Spatial Board..." : "Deploy Spatial Canvas"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}