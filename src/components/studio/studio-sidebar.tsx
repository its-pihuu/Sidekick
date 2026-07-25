"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AI_REGISTRY,
  getAIsByCategory,
  AIConfig,
} from "@/data/ai-registry";
import {
  getConversationsByAI,
  searchConversations,
  StudioConversation,
  deleteConversation,
  formatTimestamp,
} from "@/lib/studio-history";

interface StudioSidebarProps {
  activeAIId: string;
  activeConversationId: string | null;
  onSelectAI: (aiId: string) => void;
  onSelectConversation: (conv: StudioConversation) => void;
  onNewChat: () => void;
  refreshTick: number;
}

export default function StudioSidebar({
  activeAIId,
  activeConversationId,
  onSelectAI,
  onSelectConversation,
  onNewChat,
  refreshTick,
}: StudioSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedAIs, setExpandedAIs] = useState<Record<string, boolean>>({
    [activeAIId]: true,
  });
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    generalist: true,
    section: true,
    visual: true,
  });
  const [hoveredConvId, setHoveredConvId] = useState<string | null>(null);
  const [internalTick, setInternalTick] = useState(0);

  useEffect(() => {
    setExpandedAIs((prev) => ({ ...prev, [activeAIId]: true }));
  }, [activeAIId]);

  useEffect(() => {
    const interval = setInterval(() => setInternalTick((t) => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchConversations(searchQuery);
  }, [searchQuery, refreshTick, internalTick]);

  const generalistAIs = getAIsByCategory("generalist");
  const sectionAIs = getAIsByCategory("section");
  const visualAIs = getAIsByCategory("visual");

  const toggleAI = (aiId: string) => {
    setExpandedAIs((prev) => ({ ...prev, [aiId]: !prev[aiId] }));
  };

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteConv = (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(convId);
    setInternalTick((t) => t + 1);
  };

  const renderAIWithChats = (ai: AIConfig) => {
    const isActive = activeAIId === ai.id;
    const isExpanded = expandedAIs[ai.id];
    const convs = getConversationsByAI(ai.id);
    const hasChats = convs.length > 0;

    return (
      <div key={ai.id}>
        <button
          onClick={() => {
            onSelectAI(ai.id);
            if (hasChats) toggleAI(ai.id);
          }}
          className="w-full text-left flex items-center justify-between px-5 py-2.5"
          style={{
            borderLeft: isActive
              ? "2px solid var(--sk-accent)"
              : "2px solid transparent",
            background: isActive
              ? "rgba(207, 157, 123, 0.08)"
              : "transparent",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            if (!isActive)
              e.currentTarget.style.background =
                "rgba(240, 230, 210, 0.03)";
          }}
          onMouseLeave={(e) => {
            if (!isActive)
              e.currentTarget.style.background = "transparent";
          }}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {hasChats && (
              <motion.span
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: "var(--sk-text)",
                  opacity: 0.35,
                  fontSize: "8px",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                ▸
              </motion.span>
            )}
            {!hasChats && (
              <span
                style={{
                  width: "8px",
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                color: "var(--sk-accent-bright)",
                fontSize: "9px",
                opacity: isActive ? 1 : 0.65,
                flexShrink: 0,
              }}
            >
              ●
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "12.5px",
                color: "var(--sk-text)",
                opacity: isActive ? 0.95 : 0.7,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {ai.name}
            </span>
          </div>
          {convs.length > 0 && (
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                color: "var(--sk-accent-bright)",
                opacity: 0.8,
                flexShrink: 0,
                marginLeft: "8px",
              }}
            >
              {convs.length}
            </span>
          )}
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && hasChats && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              {convs.map((conv) => {
                const isConvActive = activeConversationId === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => onSelectConversation(conv)}
                    onMouseEnter={() => setHoveredConvId(conv.id)}
                    onMouseLeave={() => setHoveredConvId(null)}
                    className="relative cursor-pointer pl-11 pr-5 py-2 group"
                    style={{
                      background: isConvActive
                        ? "rgba(207, 157, 123, 0.06)"
                        : "transparent",
                      transition: "background 0.15s",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "11.5px",
                        color: "var(--sk-text)",
                        opacity: isConvActive ? 0.9 : 0.55,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        paddingRight:
                          hoveredConvId === conv.id ? "20px" : "0",
                        transition: "padding 0.2s",
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {conv.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "8.5px",
                        letterSpacing: "0.08em",
                        color: "var(--sk-accent-bright)",
                        opacity: 0.6,
                        marginTop: "2px",
                      }}
                    >
                      {formatTimestamp(conv.updatedAt)}
                    </p>

                    <AnimatePresence>
                      {hoveredConvId === conv.id && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          onClick={(e) => handleDeleteConv(conv.id, e)}
                          className="absolute right-3 top-1/2"
                          style={{
                            transform: "translateY(-50%)",
                            background: "transparent",
                            border: "none",
                            color: "var(--sk-text)",
                            opacity: 0.4,
                            cursor: "pointer",
                            fontSize: "13px",
                            lineHeight: 1,
                            padding: "3px 5px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.85")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "0.4")
                          }
                        >
                          ×
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderGroup = (label: string, key: string, ais: AIConfig[]) => {
    const isExpanded = expandedGroups[key];
    return (
      <div className="mb-1">
        <button
          onClick={() => toggleGroup(key)}
          className="w-full flex items-center justify-between px-5 py-2"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "9px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--sk-accent-bright)",
              opacity: 0.9,
            }}
          >
            {label}
          </span>
          <motion.span
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              color: "var(--sk-text)",
              opacity: 0.35,
              fontSize: "9px",
              lineHeight: 1,
            }}
          >
            ▸
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: "hidden" }}
            >
              {ais.map((ai) => renderAIWithChats(ai))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: "300px",
        flexShrink: 0,
        background: "var(--sk-bg)",
        borderRight: "1px solid rgba(240, 230, 210, 0.06)",
      }}
    >
      {/* HEADER */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid rgba(240, 230, 210, 0.06)" }}
      >
        <Link href="/canvas" className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "22px",
              fontStyle: "italic",
              fontWeight: 600,
              color: "var(--sk-text)",
            }}
          >
            Sidekick
          </span>
          <motion.span
            animate={{
              boxShadow: [
                "0 0 6px 1px rgba(207, 157, 123, 0.65)",
                "0 0 14px 3px rgba(207, 157, 123, 1)",
                "0 0 6px 1px rgba(207, 157, 123, 0.65)",
              ],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--sk-accent)",
              display: "inline-block",
              marginBottom: "3px",
            }}
          />
        </Link>
        <p
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--sk-text)",
            opacity: 0.35,
            marginTop: "6px",
          }}
        >
          Studio
        </p>
      </div>

      {/* NEW CHAT + SEARCH */}
      <div
        className="px-5 py-4 flex flex-col gap-3"
        style={{ borderBottom: "1px solid rgba(240, 230, 210, 0.06)" }}
      >
        <button
          onClick={onNewChat}
          style={{
            width: "100%",
            padding: "9px 12px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--sk-accent-bright)",
            background: "rgba(207, 157, 123, 0.1)",
            border: "1px solid rgba(207, 157, 123, 0.35)",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(207, 157, 123, 0.18)";
            e.currentTarget.style.borderColor = "rgba(207, 157, 123, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(207, 157, 123, 0.1)";
            e.currentTarget.style.borderColor = "rgba(207, 157, 123, 0.35)";
          }}
        >
          + New Chat
        </button>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          style={{
            width: "100%",
            background: "transparent",
            border: "1px solid rgba(240, 230, 210, 0.1)",
            borderRadius: "4px",
            padding: "8px 12px",
            fontFamily: "'Inter', sans-serif",
            fontSize: "12px",
            color: "var(--sk-text)",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "rgba(207, 157, 123, 0.5)")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.1)")
          }
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto py-3">
        {searchResults !== null ? (
          <div className="px-5 py-2">
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--sk-accent-bright)",
                opacity: 0.9,
                marginBottom: "10px",
              }}
            >
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""}
            </p>
            {searchResults.length === 0 ? (
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "14px",
                  fontStyle: "italic",
                  color: "var(--sk-text)",
                  opacity: 0.4,
                }}
              >
                Nothing found.
              </p>
            ) : (
              <div className="flex flex-col gap-1">
                {searchResults.map((conv) => {
                  const ai = AI_REGISTRY.find((a) => a.id === conv.aiId);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv);
                        setSearchQuery("");
                      }}
                      className="text-left px-2 py-2 rounded"
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(240, 230, 210, 0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "12px",
                          color: "var(--sk-text)",
                          opacity: 0.8,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          margin: 0,
                        }}
                      >
                        {conv.title}
                      </p>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "8.5px",
                          color: "var(--sk-accent-bright)",
                          opacity: 0.7,
                          marginTop: "2px",
                        }}
                      >
                        {ai?.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            {renderGroup("Generalist", "generalist", generalistAIs)}
            {renderGroup("Section Experts", "section", sectionAIs)}
            {renderGroup("Visual", "visual", visualAIs)}
          </>
        )}
      </div>

      {/* FOOTER */}
      <div
        className="px-5 py-4"
        style={{ borderTop: "1px solid rgba(240, 230, 210, 0.06)" }}
      >
        <Link
          href="/canvas"
          style={{
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--sk-text)",
            opacity: 0.5,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
        >
          ← Back to Canvas
        </Link>
      </div>
    </aside>
  );
}