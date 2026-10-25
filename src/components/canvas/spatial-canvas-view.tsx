"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  ReactFlowProvider,
} from "@xyflow/react";
// @ts-ignore
import "@xyflow/react/dist/style.css";
import {
  Download,
  Sparkles,
  Plus,
  Send,
  X,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import CustomNode from "./custom-node";
import { parseTheme, themes } from "@/data/themes";

const nodeTypes = {
  custom: CustomNode,
};

function SpatialCanvasInner({ themeKey = "architect-brass" }: { themeKey?: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [activeTheme, setActiveTheme] = useState<any>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const rawInit = typeof window !== "undefined" ? sessionStorage.getItem("sidekick_canvas_init") : null;
    let themeObj = parseTheme(themes[themeKey] || themeKey);
    setActiveTheme(themeObj);

    if (rawInit) {
      try {
        const parsed = JSON.parse(rawInit);
        if (parsed.nodes && Array.isArray(parsed.nodes)) {
          const formattedNodes: Node[] = parsed.nodes.map((n: any, idx: number) => {
            const x = (idx % 3) * 350 + 100;
            const y = Math.floor(idx / 3) * 250 + 100;

            return {
              id: n.id || `node-${idx + 1}`,
              type: "custom",
              position: { x, y },
              data: {
                label: n.label || `Node ${idx + 1}`,
                description: n.desc || n.description || "",
                category: n.category || `PHASE 0${idx + 1}`,
                theme: themeObj,
              },
            };
          });

          const formattedEdges: Edge[] = [];
          for (let i = 0; i < formattedNodes.length - 1; i++) {
            formattedEdges.push({
              id: `e-${i}-${i + 1}`,
              source: formattedNodes[i].id,
              target: formattedNodes[i + 1].id,
              animated: true,
              style: { stroke: themeObj.accent || "#CF9D7B", strokeWidth: 2 },
            });
          }

          setNodes(formattedNodes);
          setEdges(formattedEdges);
        }
      } catch (err) {
        console.error("Failed to parse canvas init payload:", err);
      }
    } else {
      setNodes([
        {
          id: "1",
          type: "custom",
          position: { x: 250, y: 150 },
          data: {
            label: "Core Strategic Vision",
            description: "Main focal point. Double click to edit or use hover toolbar.",
            category: "ROOT NODE",
            theme: themeObj,
          },
        },
      ]);
    }
  }, [themeKey, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        animated: true,
        style: { stroke: activeTheme?.accent || "#CF9D7B", strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges, activeTheme]
  );

  const handleAddNode = () => {
    const newId = `node-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: "custom",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: {
        label: "New Strategic Node",
        description: "Click to add action items or descriptions.",
        category: "CUSTOM BLOCK",
        theme: activeTheme,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleExportPng = async () => {
    if (typeof window === "undefined") return;
    const viewportEl = document.querySelector(".react-flow__viewport") as HTMLElement;
    if (!viewportEl) return;

    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(viewportEl, {
        backgroundColor: activeTheme?.bg || "#0C1519",
        width: viewportEl.scrollWidth + 100,
        height: viewportEl.scrollHeight + 100,
        style: {
          width: "100%",
          height: "100%",
        },
      });

      const link = document.createElement("a");
      link.download = `sidekick-canvas-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG export error:", err);
    }
  };

  const handleSendAiMessage = async () => {
    if (!aiInput.trim() || isAiLoading) return;

    const userText = aiInput;
    setAiInput("");
    setAiMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: userText,
          context: "canvas",
          messages: aiMessages,
        }),
      });

      if (!response.ok) throw new Error("AI stream request failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setAiMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantText += chunk;

        setAiMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantText };
          return updated;
        });
      }
    } catch (err) {
      console.error("AI side drawer error:", err);
      setAiMessages((prev) => [
        ...prev,
        { role: "assistant", content: "An error occurred while streaming AI guidance." },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!activeTheme) return <div className="min-h-screen bg-[#0C1519]" />;

  return (
    <div
      className="w-full h-screen relative overflow-hidden font-sans"
      style={{ backgroundColor: activeTheme.bg, color: activeTheme.text }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color={activeTheme.accent} gap={24} size={1} />
        <Controls className="!bg-[#131F24] !border-[#CF9D7B]/20 !text-[#F0E6D2] fill-current" />
        <MiniMap
          nodeColor={() => activeTheme.accent}
          maskColor="rgba(12, 21, 25, 0.8)"
          className="!bg-[#131F24] !border-[#CF9D7B]/20"
        />

        <Panel position="top-left" className="m-6 flex items-center gap-3">
          <Link
            href="/canvas"
            className="p-3 rounded-xl bg-[#131F24] border border-[#CF9D7B]/25 hover:border-[#CF9D7B] text-[#F0E6D2] transition-all flex items-center gap-2 font-mono text-xs shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 text-[#CF9D7B]" />
            <span>EXIT CANVAS</span>
          </Link>

          <div className="h-6 w-[1px] bg-[#CF9D7B]/20" />

          <button
            onClick={handleAddNode}
            className="px-4 py-3 rounded-xl bg-[#131F24] border border-[#CF9D7B]/25 hover:border-[#CF9D7B] text-[#F0E6D2] transition-all flex items-center gap-2 font-mono text-xs shadow-lg"
          >
            <Plus className="w-4 h-4 text-[#CF9D7B]" />
            <span>ADD BLOCK</span>
          </button>

          <button
            onClick={handleExportPng}
            className="px-4 py-3 rounded-xl bg-[#CF9D7B] text-[#0C1519] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#d8a887] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(207,157,123,0.25)]"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT PNG</span>
          </button>
        </Panel>

        <Panel position="top-right" className="m-6">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-3 rounded-xl bg-[#131F24] border border-[#CF9D7B]/30 hover:border-[#CF9D7B] text-[#CF9D7B] font-mono text-xs flex items-center gap-2 shadow-xl backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>ARCHITECT SPARRING</span>
          </button>
        </Panel>
      </ReactFlow>

      {isDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-[#0C1519]/95 border-l border-[#CF9D7B]/20 z-50 flex flex-col justify-between backdrop-blur-2xl shadow-2xl p-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#CF9D7B]/15">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CF9D7B]" />
                <span className="font-serif italic text-lg text-[#F0E6D2]">The Architect</span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#F0E6D2]/50 hover:text-[#CF9D7B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2 custom-scrollbar">
              {aiMessages.length === 0 ? (
                <div className="text-xs font-sans text-[#F0E6D2]/50 italic text-center py-8">
                  Ask The Architect to review your node hierarchy, suggest sub-branches, or sharpen your strategy.
                </div>
              ) : (
                aiMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-xs font-sans leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#CF9D7B]/15 text-[#F0E6D2] border border-[#CF9D7B]/30 ml-6"
                        : "bg-[#131F24] text-[#F0E6D2]/90 border border-[#F0E6D2]/10 mr-4"
                    }`}
                  >
                    {msg.content || "..."}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-[#CF9D7B]/15 flex items-center gap-2">
            <input
              type="text"
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
              placeholder="Ask for feedback on this canvas..."
              className="flex-1 bg-[#131F24] border border-[#CF9D7B]/25 rounded-xl px-4 py-3 text-xs text-[#F0E6D2] placeholder-[#F0E6D2]/30 focus:outline-none focus:border-[#CF9D7B]"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading}
              className="p-3 bg-[#CF9D7B] text-[#0C1519] rounded-xl font-bold hover:bg-[#d8a887] transition-all disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SpatialCanvasView(props: { themeKey?: string }) {
  return (
    <ReactFlowProvider>
      <SpatialCanvasInner {...props} />
    </ReactFlowProvider>
  );
}

export default SpatialCanvasView;