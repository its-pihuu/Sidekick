"use client";

import React, { useState, useCallback, useMemo } from "react";
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
  BackgroundVariant
} from "@xyflow/react";
// @ts-expect-error - xyflow CSS import
import "@xyflow/react/dist/style.css";
import { CanvasTheme, CanvasType } from "@/types/canvas";
import { CustomCanvasNode } from "./custom-node";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Bot, 
  Send, 
  X,
  Layers
} from "lucide-react";

interface SpatialCanvasViewProps {
  initialNodes: Node[];
  initialEdges: Edge[];
  theme: CanvasTheme;
  canvasType: CanvasType;
}

export function SpatialCanvasView({
  initialNodes,
  initialEdges,
  theme,
  canvasType
}: SpatialCanvasViewProps) {
  // Register custom node type
  const nodeTypes = useMemo(() => ({ custom: CustomCanvasNode }), []);

  // Inject theme data into initial nodes
  const themedNodes = useMemo(() => {
    return initialNodes.map((node) => ({
      ...node,
      type: "custom",
      data: {
        ...node.data,
        theme
      }
    }));
  }, [initialNodes, theme]);

  const [nodes, setNodes, onNodesChange] = useNodesState(themedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Inspector Sidebar & AI Side-Chat
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiHistory, setAiHistory] = useState<Array<{ role: "user" | "architect"; text: string }>>([
    {
      role: "architect",
      text: "Spatial map initialized. Select any node to inspect parameters or prompt me to restructure execution branches."
    }
  ]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, style: { stroke: theme.edgeColor, strokeWidth: 2 } }, eds)),
    [setEdges, theme.edgeColor]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const handleSendAiCommand = () => {
    if (!aiPrompt.trim()) return;
    const userMsg = aiPrompt;
    setAiPrompt("");
    
    setAiHistory((prev) => [
      ...prev,
      { role: "user", text: userMsg },
      {
        role: "architect",
        text: `Command acknowledged: "${userMsg}". Restructuring node topology to optimize structural flow.`
      }
    ]);
  };

  return (
    <div
      className="relative w-full h-screen overflow-hidden font-sans"
      style={{ background: theme.canvasBackground }}
    >
      {/* ReactFlow Board Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="touch-none"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color={theme.gridColor || "rgba(255,255,255,0.05)"}
        />
        <Controls className="!bg-[#0C1519]/90 !border-white/10 !fill-[#F0E6D2] !rounded-xl !overflow-hidden !shadow-2xl" />
        <MiniMap
          nodeStrokeColor={theme.borderColor}
          nodeColor={theme.cardBackground}
          maskColor="rgba(12, 21, 25, 0.8)"
          className="!bg-[#0C1519]/90 !border-white/10 !rounded-xl !overflow-hidden"
        />
      </ReactFlow>

      {/* Floating Action HUD (Top Right) */}
      <div className="absolute top-4 right-6 z-20 flex items-center gap-3">
        <button
          onClick={() => setIsAiPanelOpen(!isAiPanelOpen)}
          className="px-4 py-2 rounded-xl bg-[#142026]/90 border border-[#CF9D7B]/40 hover:border-[#CF9D7B] text-xs font-mono text-[#CF9D7B] transition-all backdrop-blur-md flex items-center gap-2 shadow-lg"
        >
          <Bot className="w-4 h-4" />
          <span>Architect Assist</span>
        </button>
      </div>

      {/* Right AI Consigliere Drawer */}
      <AnimatePresence>
        {isAiPanelOpen && (
          <motion.div
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 z-30 w-80 h-full bg-[#0E171B]/95 border-l border-white/10 p-5 flex flex-col justify-between backdrop-blur-2xl shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#CF9D7B]" />
                  <span className="text-xs font-mono font-bold text-[#F0E6D2] tracking-wider uppercase">
                    Architect Spatial Copilot
                  </span>
                </div>
                <button
                  onClick={() => setIsAiPanelOpen(false)}
                  className="p-1 rounded text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Log */}
              <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 custom-scrollbar">
                {aiHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xs font-sans leading-relaxed ${
                      msg.role === "architect"
                        ? "bg-[#16242B] border border-white/5 text-[#F0E6D2]"
                        : "bg-[#CF9D7B]/10 border border-[#CF9D7B]/30 text-[#CF9D7B] ml-4"
                    }`}
                  >
                    <span className="block text-[9px] font-mono text-white/30 uppercase mb-1">
                      {msg.role === "architect" ? "The Architect" : "You"}
                    </span>
                    {msg.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="pt-3 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendAiCommand()}
                  placeholder="e.g. Expand branch 2 into 3 tactical sub-nodes..."
                  className="w-full bg-[#060A0C] border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-xs text-[#F0E6D2] placeholder-white/30 focus:outline-none focus:border-[#CF9D7B]"
                />
                <button
                  onClick={handleSendAiCommand}
                  className="absolute right-2 top-2 p-1 rounded-lg bg-[#CF9D7B] text-[#0C1519] hover:bg-[#d8ab8c] transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}