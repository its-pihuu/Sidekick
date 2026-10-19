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
  Sliders, 
  Eye, 
  Check, 
  Plus, 
  Trash2, 
  GripVertical,
  Maximize2
} from "lucide-react";
import { CanvasType, CanvasTheme, OutlineSection } from "@/types/canvas";
import { CANVAS_THEMES } from "@/data/canvas-templates";
import { SpatialCanvasView } from "@/components/canvas/spatial-canvas-view";

// 6 Pure Spatial Map Types
const SPATIAL_FORMATS: {
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
      "MSME Cables & Wires Supply Chain Expansion",
      "D2C Brand Omni-channel GTM Strategy",
      "AI SaaS Competitive Moat Architecture"
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
      "12-Month Factory Modernization & Dealer Network",
      "Zero to 10k MRR B2B Client Acquisition",
      "Product-Led Growth Launch Sprint"
    ]
  },
  {
    id: "flowchart",
    title: "System Flowchart",
    subtitle: "Decision logic & pipelines",
    tag: "Operations",
    icon: Workflow,
    description: "Step-by-step logic trees, conditional branches, and operational operational workflows.",
    examples: [
      "Wholesale Dealer Credit Verification & Onboarding",
      "Lead Qualification to Signed Contract Pipeline",
      "Automated Inventory Reorder & Quality Control"
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
      "Industrial Cables Business Diagnostic Matrix",
      "Founder Strategy & Resource Allocation Grid",
      "Market Landscape & Positioning Pillars"
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
      "Copper Commodity Price Fluctuation Impact Web",
      "Consumer Psychology in B2B Procurement",
      "AI Tech Stack Dependencies & Data Flow"
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
      "Manufacturing Plant Operational Hierarchy",
      "Venture Scale Org Chart from Seed to Series A",
      "Channel Distribution Tier Architecture"
    ]
  }
];

export default function CanvasPage() {
  // Step State: 'select-format' | 'configure' | 'outline' | 'theme-modal' | 'rendered-board'
  const [step, setStep] = useState<"select-format" | "configure" | "outline" | "theme-modal" | "rendered-board">("select-format");
  
  // Creation States
  const [selectedFormat, setSelectedFormat] = useState<CanvasType>("roadmap");
  const [prompt, setPrompt] = useState("");
  const [complexity, setComplexity] = useState<"concise" | "balanced" | "exhaustive">("balanced");
  const [selectedTheme, setSelectedTheme] = useState<CanvasTheme>(CANVAS_THEMES[0]);
  const [themeCategory, setThemeCategory] = useState<"all" | "editorial" | "dark" | "light" | "vibrant">("all");
  
  // Outline States
  const [outline, setOutline] = useState<OutlineSection[]>([]);
  const [isLoadingOutline, setIsLoadingOutline] = useState(false);
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);

  // Graph Output State
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
        body: JSON.stringify({
          prompt,
          format: selectedFormat,
          complexity
        })
      });

      if (!res.ok) throw new Error("Failed to formulate outline");
      const data = await res.json();
      setOutline(data.sections || []);
    } catch (err) {
      console.error(err);
      // Resilient fallback outline so user is never blocked
      setOutline([
        { id: "1", title: "Strategic Foundation & Core Objective", description: "Establish anchor parameters and operational bounds", order: 0 },
        { id: "2", title: "Primary Execution Vectors", description: "High-priority initiatives mapped with hard dependencies", order: 1 },
        { id: "3", title: "Operational Bottlenecks & Risk Moats", description: "Contingency protocols and defensive buffers", order: 2 },
        { id: "4", title: "Scale Trajectory & Milestone Outputs", description: "Target deliverables and verified metrics", order: 3 }
      ]);
    } finally {
      setIsLoadingOutline(false);
    }
  };

  const handleAddOutlineSection = () => {
    const newSection: OutlineSection = {
      id: Date.now().toString(),
      title: "New Strategic Phase",
      description: "Define nodes and key deliverables",
      order: outline.length
    };
    setOutline([...outline, newSection]);
  };

  const handleRemoveOutlineSection = (index: number) => {
    setOutline(outline.filter((_, i) => i !== index));
  };

  const handleUpdateOutline = (index: number, field: "title" | "description", val: string) => {
    const updated = [...outline];
    updated[index][field] = val;
    setOutline(updated);
  };

  const handleDeployCanvas = async () => {
    setIsGeneratingGraph(true);
    try {
      const res = await fetch("/api/canvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          format: selectedFormat,
          complexity,
          theme: selectedTheme,
          sections: outline
        })
      });

      if (!res.ok) throw new Error("Generation error");
      const data = await res.json();
      setGraphData({ nodes: data.nodes, edges: data.edges });
      setStep("rendered-board");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingGraph(false);
    }
  };

  const filteredThemes = themeCategory === "all" 
    ? CANVAS_THEMES 
    : CANVAS_THEMES.filter(t => t.category === themeCategory);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Active Spatial Board
  // ═══════════════════════════════════════════════════════════════════════════
  if (step === "rendered-board" && graphData) {
    return (
      <div className="relative w-full h-screen bg-[#0C1519] overflow-hidden">
        {/* Floating Top Control HUD */}
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

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER: Creation Engine (Forge)
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#0C1519] text-[#F0E6D2] font-sans selection:bg-[#CF9D7B]/30 selection:text-[#F0E6D2] relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-[#CF9D7B]/5 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#182830]/40 blur-[160px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
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
          {/* ─────────────────────────────────────────────────────────────
              STEP 1: Select Spatial Format
              ───────────────────────────────────────────────────────────── */}
          {step === "select-format" && (
            <motion.div
              key="format-grid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {SPATIAL_FORMATS.map((fmt) => {
                const Icon = fmt.icon;
                return (
                  <button
                    key={fmt.id}
                    onClick={() => handleSelectFormat(fmt.id)}
                    className="group text-left p-6 rounded-2xl bg-[#131F24]/80 hover:bg-[#182830] border border-white/5 hover:border-[#CF9D7B]/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between hover:shadow-[0_8px_30px_rgba(207,157,123,0.08)]"
                  >
                    <div className="absolute top-0 right-0 w-28 h-28 bg-[#CF9D7B]/5 rounded-bl-full group-hover:bg-[#CF9D7B]/10 transition-colors pointer-events-none" />
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#1D2E36] flex items-center justify-center text-[#CF9D7B] group-hover:scale-110 group-hover:bg-[#CF9D7B] group-hover:text-[#0C1519] transition-all duration-300">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 text-[#F0E6D2]/60 border border-white/5">
                          {fmt.tag}
                        </span>
                      </div>

                      <h3 className="font-serif italic text-2xl text-[#F0E6D2] mb-1 group-hover:text-[#CF9D7B] transition-colors">
                        {fmt.title}
                      </h3>
                      <p className="text-xs font-mono text-[#CF9D7B]/80 mb-3">
                        {fmt.subtitle}
                      </p>
                      <p className="text-xs text-[#F0E6D2]/60 leading-relaxed">
                        {fmt.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#F0E6D2]/40 group-hover:text-[#CF9D7B] transition-colors">
                      <span>Initialize Board</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 2: Configure & Prompt
              ───────────────────────────────────────────────────────────── */}
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
                  className="text-xs font-mono text-[#F0E6D2]/50 hover:text-[#F0E6D2] transition-colors"
                >
                  Change Format
                </button>
              </div>

              {/* Strategic Prompt Input */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#F0E6D2]/70">
                    Define Objective or Domain
                  </label>
                  <button
                    onClick={handleShufflePrompt}
                    className="flex items-center gap-1.5 text-xs font-mono text-[#CF9D7B] hover:text-[#CF9D7B]/80 transition-colors"
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
                  className="w-full bg-[#0C1519] border border-white/10 rounded-xl p-4 text-sm text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus:border-[#CF9D7B] transition-all resize-none font-sans"
                />
              </div>

              {/* Complexity Selector */}
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

              {/* CTA */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setStep("select-format")}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-[#F0E6D2]/70 hover:text-[#F0E6D2] hover:bg-white/5 transition-all"
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

          {/* ─────────────────────────────────────────────────────────────
              STEP 3: Interactive Gamma-Style Outline Editor
              ───────────────────────────────────────────────────────────── */}
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
                      <div className="pt-2 text-[#F0E6D2]/30 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div className="w-6 h-6 rounded-lg bg-[#182830] flex items-center justify-center text-[11px] font-mono text-[#CF9D7B] shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleUpdateOutline(idx, "title", e.target.value)}
                          className="w-full bg-transparent text-sm font-medium text-[#F0E6D2] focus:outline-none border-b border-transparent focus:border-[#CF9D7B]"
                        />
                        <input
                          type="text"
                          value={sec.description}
                          onChange={(e) => handleUpdateOutline(idx, "description", e.target.value)}
                          className="w-full bg-transparent text-xs text-[#F0E6D2]/50 focus:outline-none"
                          placeholder="Node description & deliverables"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveOutlineSection(idx)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-[#F0E6D2]/40 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleAddOutlineSection}
                    className="w-full py-3 rounded-xl border border-dashed border-white/10 hover:border-[#CF9D7B]/40 text-xs font-mono text-[#F0E6D2]/60 hover:text-[#CF9D7B] flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Node Branch
                  </button>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setStep("configure")}
                  className="text-xs font-mono text-[#F0E6D2]/50 hover:text-[#F0E6D2]"
                >
                  ← Back to Prompt
                </button>
                <span className="text-xs font-mono text-[#F0E6D2]/40">
                  {outline.length} Primary Branches
                </span>
              </div>
            </motion.div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              STEP 4: Gamma-Grade Live Theme Gallery Modal
              ───────────────────────────────────────────────────────────── */}
          {step === "theme-modal" && (
            <motion.div
              key="theme-gallery"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-5xl mx-auto bg-[#131F24]/95 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left Theme Selector Grid (7 cols) */}
              <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#CF9D7B]">Step 4 of 4</span>
                      <h2 className="text-xl font-serif italic text-[#F0E6D2]">Select Visual Theme</h2>
                    </div>
                    {/* Category filter pills */}
                    <div className="flex gap-1 bg-[#0C1519] p-1 rounded-lg border border-white/5 text-[11px] font-mono">
                      {(["all", "editorial", "dark", "light"] as const).map((cat) => (
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

                  {/* Grid of themes */}
                  <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredThemes.map((thm) => {
                      const isSelected = selectedTheme.id === thm.id;
                      return (
                        <button
                          key={thm.id}
                          onClick={() => setSelectedTheme(thm)}
                          className={`group text-left p-3.5 rounded-xl border transition-all relative overflow-hidden ${
                            isSelected
                              ? "bg-[#1A2A33] border-[#CF9D7B] shadow-[0_0_20px_rgba(207,157,123,0.2)]"
                              : "bg-[#0C1519]/60 border-white/5 hover:border-white/20"
                          }`}
                        >
                          {/* Top mini preview bar */}
                          <div
                            className="w-full h-8 rounded-lg mb-2.5 flex items-center justify-end px-2 border border-white/10"
                            style={{ background: thm.canvasBackground }}
                          >
                            <div
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ background: thm.accentColor }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs font-serif italic text-[#F0E6D2] group-hover:text-[#CF9D7B]">
                              {thm.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#CF9D7B]" />}
                          </div>
                          <span className="text-[10px] font-mono text-[#F0E6D2]/40 block uppercase">
                            {thm.fontFamily}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    onClick={() => setStep("outline")}
                    className="text-xs font-mono text-[#F0E6D2]/50 hover:text-[#F0E6D2]"
                  >
                    ← Back to Outline
                  </button>
                </div>
              </div>

              {/* Right Live Preview Panel (5 cols) */}
              <div className="lg:col-span-5 p-6 bg-[#0A1014] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#F0E6D2]/60 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#CF9D7B]" />
                      Live Theme Preview
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#CF9D7B]">
                      {selectedTheme.name}
                    </span>
                  </div>

                  {/* Rendered Mock Node Card */}
                  <div
                    className="p-5 rounded-2xl border transition-all duration-500 shadow-xl relative overflow-hidden"
                    style={{
                      background: selectedTheme.cardBackground,
                      borderColor: selectedTheme.borderColor,
                      boxShadow: selectedTheme.glowShadow,
                      fontFamily: selectedTheme.fontFamily
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          background: selectedTheme.badgeBackground,
                          color: selectedTheme.badgeTextColor,
                          border: `1px solid ${selectedTheme.borderColor}`
                        }}
                      >
                        Phase 01 • Priority
                      </span>
                      <Sparkles className="w-3.5 h-3.5" style={{ color: selectedTheme.accentColor }} />
                    </div>

                    <h4
                      className="text-lg font-serif italic mb-2"
                      style={{ color: selectedTheme.primaryTextColor }}
                    >
                      Infrastructure Modernization
                    </h4>
                    <p
                      className="text-xs leading-relaxed mb-4"
                      style={{ color: selectedTheme.secondaryTextColor }}
                    >
                      Establish automated dealer management lines and live inventory sync to eliminate order latency.
                    </p>

                    <div className="space-y-1.5 pt-3 border-t" style={{ borderColor: selectedTheme.borderColor }}>
                      <div className="flex items-center gap-2 text-xs" style={{ color: selectedTheme.primaryTextColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedTheme.bulletColor }} />
                        <span>Real-time ERP distributor integration</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs" style={{ color: selectedTheme.secondaryTextColor }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedTheme.bulletColor }} />
                        <span>Working capital debt reduction (-18%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deploy Button */}
                <button
                  onClick={handleDeployCanvas}
                  disabled={isGeneratingGraph}
                  className="w-full mt-6 py-3.5 rounded-xl bg-[#CF9D7B] hover:bg-[#d8ab8c] text-[#0C1519] text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_4px_25px_rgba(207,157,123,0.35)] disabled:opacity-50 flex items-center justify-center gap-2"
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