"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  listProjects,
  createProject,
  renameProject,
  deleteProject,
  setActiveProjectId,
  ensureActiveProject,
} from "@/lib/projects-store";
import type { ProjectMeta } from "@/lib/canvas-store";

interface ProjectSwitcherProps {
  onProjectChange?: () => void;
}

export default function ProjectSwitcher({ onProjectChange }: ProjectSwitcherProps) {
  const [active, setActive] = useState<ProjectMeta | null>(null);
  const [projects, setProjects] = useState<ProjectMeta[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"list" | "create" | "rename" | "confirm-delete">("list");
  const [inputValue, setInputValue] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    const current = ensureActiveProject();
    setActive(current);
    setProjects(listProjects());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("sidekick:project-changed", handler);
    window.addEventListener("sidekick:project-renamed", handler);
    window.addEventListener("sidekick:project-deleted", handler);
    return () => {
      window.removeEventListener("sidekick:project-changed", handler);
      window.removeEventListener("sidekick:project-renamed", handler);
      window.removeEventListener("sidekick:project-deleted", handler);
    };
  }, [refresh]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setMode("list");
        setInputValue("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (mode === "create" || mode === "rename") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [mode]);

  const handleSwitch = (id: string) => {
    if (id === active?.id) {
      setOpen(false);
      return;
    }
    setActiveProjectId(id);
    setOpen(false);
    setMode("list");
    refresh();
    onProjectChange?.();
  };

  const handleCreate = () => {
    const name = inputValue.trim();
    if (!name) return;
    createProject(name);
    setInputValue("");
    setMode("list");
    setOpen(false);
    refresh();
    onProjectChange?.();
  };

  const handleRename = () => {
    const name = inputValue.trim();
    if (!name || !active) return;
    renameProject(active.id, name);
    setInputValue("");
    setMode("list");
    refresh();
  };

  const handleDelete = () => {
    if (!pendingDeleteId) return;
    deleteProject(pendingDeleteId);
    setPendingDeleteId(null);
    setMode("list");
    refresh();
    onProjectChange?.();
  };

  const startRename = () => {
    if (!active) return;
    setInputValue(active.name);
    setMode("rename");
  };

  const startDelete = (id: string) => {
    setPendingDeleteId(id);
    setMode("confirm-delete");
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (mode === "create") handleCreate();
      else handleRename();
    }
    if (e.key === "Escape") {
      setMode("list");
      setInputValue("");
    }
  };

  if (!active) return null;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      {/* TRIGGER */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "10px 14px",
          background: open ? "rgba(207, 157, 123, 0.08)" : "var(--sk-bg-card)",
          border: open
            ? "1px solid rgba(207, 157, 123, 0.35)"
            : "1px solid rgba(240, 230, 210, 0.08)",
          borderRadius: "5px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.18)";
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.08)";
        }}
      >
        <div style={{ overflow: "hidden", flex: 1 }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "8px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--sk-accent)",
              opacity: 0.7,
              margin: 0,
              marginBottom: "3px",
            }}
          >
            Project
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "16px",
              fontStyle: "italic",
              fontWeight: 600,
              color: "var(--sk-text)",
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {active.name}
          </p>
        </div>
        <ChevronIcon open={open} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              left: 0,
              right: 0,
              background: "var(--sk-bg-card)",
              border: "1px solid rgba(207, 157, 123, 0.25)",
              borderRadius: "5px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            {mode === "list" && (
              <>
                <div style={{ maxHeight: "280px", overflowY: "auto" }}>
                  {projects.map((p) => {
                    const isActive = p.id === active.id;
                    return (
                      <div
                        key={p.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "10px 14px",
                          borderBottom: "1px solid rgba(240, 230, 210, 0.04)",
                          background: isActive ? "rgba(207, 157, 123, 0.06)" : "transparent",
                          cursor: "pointer",
                          transition: "background 0.15s",
                          gap: "8px",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = "rgba(240, 230, 210, 0.03)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <div onClick={() => handleSwitch(p.id)} style={{ flex: 1, overflow: "hidden" }}>
                          <p
                            style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: "13px",
                              color: "var(--sk-text)",
                              opacity: isActive ? 1 : 0.85,
                              margin: 0,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {p.name}
                          </p>
                          {isActive && (
                            <p
                              style={{
                                fontFamily: "'JetBrains Mono', monospace",
                                fontSize: "8px",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                color: "var(--sk-accent)",
                                opacity: 0.85,
                                margin: 0,
                                marginTop: "2px",
                              }}
                            >
                              Active
                            </p>
                          )}
                        </div>
                        {projects.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startDelete(p.id);
                            }}
                            title="Delete project"
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "3px",
                              border: "1px solid transparent",
                              background: "transparent",
                              color: "var(--sk-text)",
                              opacity: 0.4,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.15s",
                              padding: 0,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.borderColor = "rgba(240, 230, 210, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0.4";
                              e.currentTarget.style.borderColor = "transparent";
                            }}
                          >
                            <TrashIcon />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    borderTop: "1px solid rgba(240, 230, 210, 0.06)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    onClick={() => setMode("create")}
                    style={actionButtonStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(207, 157, 123, 0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <PlusIcon />
                    <span>New Project</span>
                  </button>
                  <button
                    onClick={startRename}
                    style={actionButtonStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(207, 157, 123, 0.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <EditIcon />
                    <span>Rename Current</span>
                  </button>
                </div>
              </>
            )}

            {(mode === "create" || mode === "rename") && (
              <div style={{ padding: "14px" }}>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "var(--sk-accent)",
                    opacity: 0.85,
                    marginBottom: "10px",
                  }}
                >
                  {mode === "create" ? "New Project" : "Rename Project"}
                </p>
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Project name..."
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    background: "var(--sk-bg)",
                    border: "1px solid rgba(207, 157, 123, 0.3)",
                    borderRadius: "4px",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "13px",
                    color: "var(--sk-text)",
                    outline: "none",
                    marginBottom: "10px",
                  }}
                />
                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      setMode("list");
                      setInputValue("");
                    }}
                    style={secondaryBtn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={mode === "create" ? handleCreate : handleRename}
                    disabled={!inputValue.trim()}
                    style={{
                      ...primaryBtn,
                      opacity: inputValue.trim() ? 1 : 0.3,
                      cursor: inputValue.trim() ? "pointer" : "default",
                    }}
                  >
                    {mode === "create" ? "Create" : "Save"}
                  </button>
                </div>
              </div>
            )}

            {mode === "confirm-delete" && (
              <div style={{ padding: "14px" }}>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#d97757",
                    opacity: 0.95,
                    marginBottom: "8px",
                  }}
                >
                  Delete Project
                </p>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "12px",
                    color: "var(--sk-text)",
                    opacity: 0.75,
                    lineHeight: 1.5,
                    marginBottom: "14px",
                  }}
                >
                  This deletes the canvas and every conversation in this project. There is no undo.
                </p>
                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      setMode("list");
                      setPendingDeleteId(null);
                    }}
                    style={secondaryBtn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    style={{
                      ...primaryBtn,
                      background: "rgba(217, 119, 87, 0.15)",
                      border: "1px solid rgba(217, 119, 87, 0.5)",
                      color: "#d97757",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const actionButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 14px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "10px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--sk-accent)",
  transition: "background 0.15s",
  textAlign: "left",
};

const primaryBtn: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--sk-accent)",
  background: "rgba(207, 157, 123, 0.15)",
  border: "1px solid rgba(207, 157, 123, 0.4)",
  borderRadius: "3px",
  padding: "6px 12px",
  cursor: "pointer",
};

const secondaryBtn: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "9px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--sk-text)",
  opacity: 0.5,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "6px 8px",
};

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.2 }}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: "var(--sk-accent)", opacity: 0.7, flexShrink: 0 }}
    >
      <polyline points="6 9 12 15 18 9" />
    </motion.svg>
  );
}

function PlusIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}