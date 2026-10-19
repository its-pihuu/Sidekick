"use client";

import React, { memo, useState } from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, GripVertical, RefreshCw, Wand2, Layers } from "lucide-react";
import { CanvasTheme } from "@/types/canvas";

export interface CustomNodeData extends Record<string, unknown> {
  title: string;
  subtitle?: string;
  description: string;
  bullets?: string[];
  theme: CanvasTheme;
  phaseTag?: string;
}

export type CustomNodeType = Node<CustomNodeData, "custom">;

export const CustomCanvasNode = memo(({ id, data, isConnectable }: NodeProps<CustomNodeType>) => {
  const { title, subtitle, description, bullets, theme, phaseTag } = data;
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(title || "");
  const [localDesc, setLocalDesc] = useState(description || "");

  const activeTheme = theme || {
    cardBackground: "rgba(18, 12, 32, 0.85)",
    cardHoverBackground: "rgba(24, 15, 42, 0.9)",
    borderColor: "rgba(168, 85, 247, 0.3)",
    borderHoverColor: "#E879F9",
    glowShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
    glowHoverShadow: "0 0 30px rgba(232, 121, 249, 0.3)",
    fontFamily: "sans-serif",
    primaryTextColor: "#F3E8FF",
    secondaryTextColor: "#C084FC",
    accentColor: "#E879F9",
    accentGlow: "rgba(232, 121, 249, 0.4)",
    badgeBackground: "rgba(168, 85, 247, 0.15)",
    badgeTextColor: "#F0ABFC",
    badgeBorder: "rgba(168, 85, 247, 0.3)",
    bulletColor: "#E879F9"
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative min-w-[320px] max-w-[400px] rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-2xl select-none"
      style={{
        background: isHovered ? activeTheme.cardHoverBackground : activeTheme.cardBackground,
        border: `1px solid ${isHovered ? activeTheme.borderHoverColor : activeTheme.borderColor}`,
        boxShadow: isHovered ? activeTheme.glowHoverShadow : activeTheme.glowShadow,
        fontFamily: activeTheme.fontFamily
      }}
    >
      {/* Top Accent Gradient Bar (Gamma Signature) */}
      <div 
        className="h-1.5 w-full transition-opacity duration-300"
        style={{ 
          background: `linear-gradient(90deg, ${activeTheme.accentColor}, transparent)`,
          opacity: isHovered ? 1 : 0.6
        }} 
      />

      {/* ReactFlow Connector Handles */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !border-2 !border-[#0C1519]"
        style={{ background: activeTheme.accentColor }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !border-2 !border-[#0C1519]"
        style={{ background: activeTheme.accentColor }}
      />

      {/* Floating Gamma Hover Toolbar */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-[#0C1519]/90 border border-white/10 rounded-lg px-2 py-1 backdrop-blur-md"
          >
            <button className="p-1 hover:bg-white/10 rounded text-[10px] font-mono flex items-center gap-1" style={{ color: activeTheme.accentColor }}>
              <Sparkles className="w-3 h-3" />
              <span>AI Edit</span>
            </button>
            <div className="w-[1px] h-3 bg-white/10" />
            <GripVertical className="w-3.5 h-3.5 text-white/40 cursor-grab" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-5">
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-medium"
            style={{
              background: activeTheme.badgeBackground,
              color: activeTheme.badgeTextColor,
              border: `1px solid ${activeTheme.badgeBorder}`
            }}
          >
            {phaseTag || "BLOCK"}
          </span>
        </div>

        {/* Card Title */}
        {isEditing ? (
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={() => setIsEditing(false)}
            autoFocus
            className="w-full bg-transparent text-lg font-bold border-b focus:outline-none mb-2"
            style={{ color: activeTheme.primaryTextColor, borderColor: activeTheme.accentColor }}
          />
        ) : (
          <h3
            onDoubleClick={() => setIsEditing(true)}
            className="text-lg font-bold mb-1.5 leading-snug cursor-text tracking-tight"
            style={{ color: activeTheme.primaryTextColor }}
          >
            {localTitle}
          </h3>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs font-mono mb-2.5 font-medium" style={{ color: activeTheme.accentColor }}>
            {subtitle}
          </p>
        )}

        {/* Description Body */}
        <p
          onDoubleClick={() => setIsEditing(true)}
          className="text-xs leading-relaxed mb-4"
          style={{ color: activeTheme.secondaryTextColor }}
        >
          {localDesc}
        </p>

        {/* Structured Multi-Item Block (Gamma Style) */}
        {bullets && bullets.length > 0 && (
          <div className="space-y-2 pt-3 border-t" style={{ borderColor: activeTheme.borderColor }}>
            {bullets.map((b: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color: activeTheme.primaryTextColor }}>
                <div 
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                  style={{ background: activeTheme.bulletColor, boxShadow: `0 0 6px ${activeTheme.accentGlow}` }} 
                />
                <span className="leading-normal">{b}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

CustomCanvasNode.displayName = "CustomCanvasNode";