"use client";

import React, { useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Sparkles, GripVertical, Check, Pencil } from "lucide-react";

export function CustomNode({ data }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState((data?.label as string) || "Strategic Point");
  const [description, setDescription] = useState(
    (data?.description as string) || "Add description..."
  );

  const theme = (data?.theme as any) || {
    bg: "#0C1519",
    cardBg: "#131F24",
    border: "rgba(207, 157, 123, 0.25)",
    text: "#F0E6D2",
    subtext: "rgba(240, 230, 210, 0.6)",
    accent: "#CF9D7B",
  };

  return (
    <div className="relative group font-sans">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#CF9D7B] !border-2 !border-[#0C1519] hover:!scale-125 transition-transform"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!w-3 !h-3 !bg-[#CF9D7B] !border-2 !border-[#0C1519] hover:!scale-125 transition-transform"
      />

      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto flex items-center gap-1.5 bg-[#131F24] border border-[#CF9D7B]/30 px-2.5 py-1 rounded-lg shadow-xl backdrop-blur-md z-30">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-1 text-[#F0E6D2]/70 hover:text-[#CF9D7B] transition-colors"
          title="Edit Node"
        >
          {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
        </button>
        <div className="w-[1px] h-3 bg-[#CF9D7B]/20" />
        <div className="flex items-center gap-1 text-[10px] font-mono text-[#CF9D7B]">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>AI SHARPENED</span>
        </div>
      </div>

      <div
        className="w-[280px] p-5 rounded-2xl border transition-all duration-300 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        style={{
          backgroundColor: theme.cardBg || "#131F24",
          borderColor: theme.border || "rgba(207, 157, 123, 0.25)",
        }}
      >
        <div
          className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-10 blur-xl pointer-events-none"
          style={{ backgroundColor: theme.accent || "#CF9D7B" }}
        />

        <div className="flex items-center justify-between mb-2">
          <span
            className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-md border"
            style={{
              color: theme.accent || "#CF9D7B",
              borderColor: theme.border || "rgba(207, 157, 123, 0.25)",
              backgroundColor: "rgba(207, 157, 123, 0.05)",
            }}
          >
            {(data?.category as string) || "STRATEGIC BLOCK"}
          </span>
          <GripVertical className="w-3.5 h-3.5 text-[#F0E6D2]/30 cursor-grab active:cursor-grabbing" />
        </div>

        {isEditing ? (
          <div className="space-y-2 mt-2">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full bg-[#0C1519] border border-[#CF9D7B]/40 rounded-lg px-2.5 py-1.5 font-serif italic text-base text-[#F0E6D2] focus:outline-none"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#0C1519] border border-[#CF9D7B]/40 rounded-lg px-2.5 py-1.5 font-sans text-xs text-[#F0E6D2]/70 focus:outline-none resize-none"
            />
            <button
              onClick={() => setIsEditing(false)}
              className="w-full py-1.5 bg-[#CF9D7B] text-[#0C1519] rounded-lg font-mono text-[10px] uppercase font-bold"
            >
              DONE EDITING
            </button>
          </div>
        ) : (
          <div onDoubleClick={() => setIsEditing(true)}>
            <h4
              className="font-serif italic text-lg leading-snug mb-1 font-semibold"
              style={{ color: theme.text || "#F0E6D2" }}
            >
              {label}
            </h4>
            <p
              className="font-sans text-xs leading-relaxed line-clamp-3"
              style={{ color: theme.subtext || "rgba(240, 230, 210, 0.6)" }}
            >
              {description}
            </p>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#CF9D7B] !border-2 !border-[#0C1519] hover:!scale-125 transition-transform"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!w-3 !h-3 !bg-[#CF9D7B] !border-2 !border-[#0C1519] hover:!scale-125 transition-transform"
      />
    </div>
  );
}

export default CustomNode;