"use client";

import React, { useState } from "react";
import { Sparkles, Dices, ArrowRight, Check, Compass, Layers, GitFork, Network, Network as TreeIcon, Clock } from "lucide-react";
import { MAP_TYPES, CANVAS_TEMPLATES, MapType, CanvasTemplate } from "@/data/canvas-templates";

interface CanvasWizardProps {
  onGenerate: (prompt: string, mapType: MapType, template: CanvasTemplate, useStudioContext: boolean) => Promise<void>;
  isLoading: boolean;
}

export function CanvasWizard({ onGenerate, isLoading }: CanvasWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [prompt, setPrompt] = useState("");
  const [useStudioContext, setUseStudioContext] = useState(true);
  const [selectedType, setSelectedType] = useState<MapType>("mindmap");
  const [selectedTemplate, setSelectedTemplate] = useState<CanvasTemplate>(
    CANVAS_TEMPLATES.find((t) => t.id === "mindmap-editorial") || CANVAS_TEMPLATES[0]
  );

  const getTypeIcon = (type: MapType) => {
    switch (type) {
      case "mindmap": return <Compass className="w-5 h-5" />;
      case "bento": return <Layers className="w-5 h-5" />;
      case "flowchart": return <GitFork className="w-5 h-5" />;
      case "concept": return <Network className="w-5 h-5" />;
      case "hierarchical": return <TreeIcon className="w-5 h-5" />;
      case "timeline": return <Clock className="w-5 h-5" />;
    }
  };

  const handleRandomize = () => {
    const activeTemplates = CANVAS_TEMPLATES.filter((t) => t.active);
    const randomTemplate = activeTemplates[Math.floor(Math.random() * activeTemplates.length)];
    setSelectedType(randomTemplate.mapType);
    setSelectedTemplate(randomTemplate);
    onGenerate(
      prompt || "Auto-construct a complete startup master blueprint.",
      randomTemplate.mapType,
      randomTemplate,
      useStudioContext
    );
  };

  const handleSelectType = (type: MapType, active: boolean) => {
    if (!active) return;
    setSelectedType(type);
    const matchingTemplate = CANVAS_TEMPLATES.find((t) => t.mapType === type && t.active);
    if (matchingTemplate) setSelectedTemplate(matchingTemplate);
  };

  const filteredTemplates = CANVAS_TEMPLATES.filter((t) => t.mapType === selectedType && t.active);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-10 px-4">
      {/* Wizard Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(207,157,123,0.1)] border border-[rgba(207,157,123,0.2)] text-[#CF9D7B] text-xs font-mono tracking-wider uppercase">
          <Compass className="w-3.5 h-3.5" />
          The Cartographer · Spatial Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#F0E6D2] italic font-normal tracking-tight">
          Transform thoughts into visual territory.
        </h1>
        <p className="text-sm text-[rgba(240,230,210,0.6)] font-sans max-w-md mx-auto">
          Choose a directive, pick your topology, and let the master strategist draft the visual architecture.
        </p>
      </div>

      {/* Wizard Card Container */}
      <div className="bg-[#162127] border border-[rgba(240,230,210,0.08)] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-8">
        {/* Step Indicators */}
        <div className="flex items-center justify-between border-b border-[rgba(240,230,210,0.06)] pb-5">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 text-xs font-mono transition-colors ${
                step === 1 ? "text-[#CF9D7B]" : "text-[rgba(240,230,210,0.4)]"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 1 ? "bg-[#CF9D7B] text-[#0C1519] font-bold" : "bg-[rgba(240,230,210,0.06)] text-[rgba(240,230,210,0.6)]"
              }`}>1</span>
              01 DIRECTIVE
            </button>
            <button
              onClick={() => prompt && setStep(2)}
              className={`flex items-center gap-2 text-xs font-mono transition-colors ${
                step === 2 ? "text-[#CF9D7B]" : "text-[rgba(240,230,210,0.4)]"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 2 ? "bg-[#CF9D7B] text-[#0C1519] font-bold" : "bg-[rgba(240,230,210,0.06)] text-[rgba(240,230,210,0.6)]"
              }`}>2</span>
              02 TOPOLOGY
            </button>
            <button
              onClick={() => prompt && setStep(3)}
              className={`flex items-center gap-2 text-xs font-mono transition-colors ${
                step === 3 ? "text-[#CF9D7B]" : "text-[rgba(240,230,210,0.4)]"
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 3 ? "bg-[#CF9D7B] text-[#0C1519] font-bold" : "bg-[rgba(240,230,210,0.06)] text-[rgba(240,230,210,0.6)]"
              }`}>3</span>
              03 TEMPLATE
            </button>
          </div>

          <button
            onClick={handleRandomize}
            disabled={isLoading}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(207,157,123,0.3)] bg-[rgba(207,157,123,0.08)] hover:bg-[rgba(207,157,123,0.16)] text-[#CF9D7B] text-xs font-mono tracking-wide transition-all"
          >
            <Dices className="w-3.5 h-3.5" />
            Randomizer
          </button>
        </div>

        {/* STEP 1: Prompt & Studio context */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-mono tracking-wider uppercase text-[rgba(240,230,210,0.7)]">
                What should The Cartographer construct?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Map out the full value chain, key moats, problem autopsy, and growth loops for Sidekick..."
                rows={4}
                className="w-full bg-[#0C1519] border border-[rgba(240,230,210,0.1)] focus:border-[#CF9D7B] rounded-xl p-4 text-sm text-[#F0E6D2] placeholder-[rgba(240,230,210,0.25)] outline-none transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0C1519] border border-[rgba(240,230,210,0.06)]">
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-[#F0E6D2]">Include Studio Brain Intelligence</p>
                <p className="text-[11px] text-[rgba(240,230,210,0.5)]">
                  Feeds recent chat logs from The Architect & Subject Experts into the map.
                </p>
              </div>
              <input
                type="checkbox"
                checked={useStudioContext}
                onChange={(e) => setUseStudioContext(e.target.checked)}
                className="w-4 h-4 accent-[#CF9D7B] rounded cursor-pointer"
              />
            </div>

            {/* Suggested quick sparks */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[rgba(240,230,210,0.4)] tracking-wide">
                OR INITIALIZE WITH A FOUNDATIONAL VECTOR:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Deconstruct my product architecture & core moat",
                  "Map the customer acquisition funnel & beachhead ops",
                  "Problem autopsy vs our unfair competitive weapons",
                  "Monetization model & pricing tier topology",
                ].map((sugg) => (
                  <button
                    key={sugg}
                    onClick={() => setPrompt(sugg)}
                    className="text-left text-xs p-2.5 rounded-lg bg-[rgba(240,230,210,0.03)] border border-[rgba(240,230,210,0.04)] hover:border-[rgba(207,157,123,0.3)] text-[rgba(240,230,210,0.7)] hover:text-[#F0E6D2] transition-all"
                  >
                    {sugg}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#CF9D7B] hover:bg-[#E5B896] text-[#0C1519] font-medium text-xs tracking-wider uppercase transition-all shadow-md"
              >
                Select Topology <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Map Type Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {MAP_TYPES.map((t) => (
                <div
                  key={t.type}
                  onClick={() => handleSelectType(t.type, t.active)}
                  className={`relative p-4 rounded-xl border transition-all text-left ${
                    !t.active
                      ? "opacity-40 border-[rgba(240,230,210,0.04)] bg-[#0C1519] cursor-not-allowed"
                      : selectedType === t.type
                      ? "border-[#CF9D7B] bg-[rgba(207,157,123,0.08)] cursor-pointer shadow-lg"
                      : "border-[rgba(240,230,210,0.06)] bg-[#0C1519] hover:border-[rgba(207,157,123,0.3)] cursor-pointer"
                  }`}
                >
                  {!t.active && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded bg-[rgba(240,230,210,0.08)] text-[rgba(240,230,210,0.5)] uppercase">
                      Soon
                    </span>
                  )}
                  <div className={`p-2 rounded-lg w-fit mb-3 ${selectedType === t.type ? "bg-[#CF9D7B] text-[#0C1519]" : "bg-[rgba(240,230,210,0.05)] text-[#CF9D7B]"}`}>
                    {getTypeIcon(t.type)}
                  </div>
                  <h3 className="text-sm font-serif font-medium text-[#F0E6D2]">{t.label}</h3>
                  <p className="text-[11px] text-[rgba(240,230,210,0.5)] font-sans mt-1 leading-snug">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-2">
              <button
                onClick={() => setStep(1)}
                className="text-xs font-mono text-[rgba(240,230,210,0.6)] hover:text-[#F0E6D2]"
              >
                ← Back to Directive
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#CF9D7B] hover:bg-[#E5B896] text-[#0C1519] font-medium text-xs tracking-wider uppercase transition-all shadow-md"
              >
                Choose Template <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Template Picker & Generate */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    selectedTemplate.id === template.id
                      ? "border-[#CF9D7B] bg-[rgba(207,157,123,0.08)] shadow-lg ring-1 ring-[#CF9D7B]"
                      : "border-[rgba(240,230,210,0.06)] bg-[#0C1519] hover:border-[rgba(207,157,123,0.3)]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-serif text-sm font-semibold text-[#F0E6D2]">
                      {template.name}
                    </span>
                    {selectedTemplate.id === template.id && (
                      <Check className="w-4 h-4 text-[#CF9D7B]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[rgba(240,230,210,0.6)] font-sans leading-relaxed mb-3">
                    {template.description}
                  </p>
                  <div className="p-2.5 rounded bg-[#162127] border border-[rgba(240,230,210,0.04)] text-[10px] font-mono text-[rgba(207,157,123,0.8)]">
                    {template.preview}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-[rgba(240,230,210,0.06)]">
              <button
                onClick={() => setStep(2)}
                className="text-xs font-mono text-[rgba(240,230,210,0.6)] hover:text-[#F0E6D2]"
              >
                ← Back to Topology
              </button>
              <button
                onClick={() => onGenerate(prompt || "Construct startup blueprint", selectedType, selectedTemplate, useStudioContext)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#CF9D7B] hover:bg-[#E5B896] text-[#0C1519] font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(207,157,123,0.25)]"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Plotting Coordinates...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Deploy Map
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}