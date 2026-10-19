import { NextResponse } from "next/server";
import { CanvasType, CanvasTheme, OutlineSection } from "@/types/canvas";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, format, complexity, theme, sections } = body as {
      prompt: string;
      format: CanvasType;
      complexity: "concise" | "balanced" | "exhaustive";
      theme: CanvasTheme;
      sections: OutlineSection[];
    };

    const inputSections = sections && sections.length > 0 ? sections : [
      { id: "1", title: "Core Architecture Anchor", description: "Primary strategic objective", order: 0 },
      { id: "2", title: "Phase 1 Execution Vector", description: "Immediate tactical deliverables", order: 1 },
      { id: "3", title: "Phase 2 Scale Horizons", description: "Operational expansion and risk moats", order: 2 },
      { id: "4", title: "Key Deliverables & Verified Metrics", description: "Milestones and output targets", order: 3 }
    ];

    // Compute spatial positions based on selected format
    const { nodes, edges } = calculateSpatialLayout(format, inputSections, theme, prompt);

    return NextResponse.json({ nodes, edges });
  } catch (error) {
    console.error("Canvas API error:", error);
    return NextResponse.json({ error: "Failed to build spatial layout" }, { status: 500 });
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// SPATIAL LAYOUT MATH ENGINE
// ═════════════════════════════════════════════════════════════════════════════

function calculateSpatialLayout(
  format: CanvasType,
  sections: OutlineSection[],
  theme: CanvasTheme,
  prompt: string
) {
  const nodes: any[] = [];
  const edges: any[] = [];

  switch (format) {
    // ─────────────────────────────────────────────────────────────────────────
    // 1. MINDMAP: Central Root Node + Radial Polar Math
    // ─────────────────────────────────────────────────────────────────────────
    case "mindmap": {
      const centerX = 500;
      const centerY = 350;
      const radius = 380;

      // Central Core Node
      nodes.push({
        id: "root",
        type: "custom",
        position: { x: centerX, y: centerY },
        data: {
          title: prompt.length > 35 ? prompt.slice(0, 35) + "..." : prompt,
          subtitle: "Central Domain Core",
          description: "Root anchor directing sub-branch execution vectors.",
          phaseTag: "CENTRAL CORE",
          theme
        }
      });

      const total = sections.length;
      sections.forEach((sec, idx) => {
        const angle = (idx / total) * 2 * Math.PI - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const nodeId = `node-${idx + 1}`;

        nodes.push({
          id: nodeId,
          type: "custom",
          position: { x: Math.round(x), y: Math.round(y) },
          data: {
            title: sec.title,
            description: sec.description,
            bullets: [
              `Primary vector deliverable #${idx + 1}`,
              `Risk mitigation buffer`
            ],
            phaseTag: `BRANCH 0${idx + 1}`,
            theme
          }
        });

        edges.push({
          id: `edge-root-${nodeId}`,
          source: "root",
          target: nodeId,
          animated: true,
          style: { stroke: theme?.accentColor || "#CF9D7B", strokeWidth: 2 }
        });
      });
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. ROADMAP: Horizontal Chronological Track
    // ─────────────────────────────────────────────────────────────────────────
    case "roadmap": {
      const startX = 100;
      const trackY = 250;
      const cardWidth = 360;

      sections.forEach((sec, idx) => {
        const x = startX + idx * cardWidth;
        // Alternate Y slightly for visual rhythm
        const y = trackY + (idx % 2 === 0 ? 0 : 60);
        const nodeId = `node-${idx + 1}`;

        nodes.push({
          id: nodeId,
          type: "custom",
          position: { x, y },
          data: {
            title: sec.title,
            subtitle: `Horizon Q${idx + 1}`,
            description: sec.description,
            bullets: [
              `Critical milestone deliverable`,
              `Resource allocation checkpoint`
            ],
            phaseTag: `PHASE 0${idx + 1}`,
            theme
          }
        });

        if (idx > 0) {
          const prevId = `node-${idx}`;
          edges.push({
            id: `edge-${prevId}-${nodeId}`,
            source: prevId,
            target: nodeId,
            animated: true,
            style: { stroke: theme?.accentColor || "#CF9D7B", strokeWidth: 2.5 }
          });
        }
      });
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. BENTO: Asymmetrical High-Density Grid Matrix
    // ─────────────────────────────────────────────────────────────────────────
    case "bento": {
      const colWidth = 380;
      const rowHeight = 260;

      sections.forEach((sec, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const x = 100 + col * colWidth;
        const y = 80 + row * rowHeight;
        const nodeId = `node-${idx + 1}`;

        nodes.push({
          id: nodeId,
          type: "custom",
          position: { x, y },
          data: {
            title: sec.title,
            subtitle: `Quadrant 0${idx + 1}`,
            description: sec.description,
            bullets: [
              `Operational metric threshold`,
              `Core dependency vector`
            ],
            phaseTag: `PILLAR 0${idx + 1}`,
            theme
          }
        });
      });
      break;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. FLOWCHART / SYSTEM LOGIC: Vertical/Branching Decision Tree
    // ─────────────────────────────────────────────────────────────────────────
    case "flowchart":
    case "concept":
    case "hierarchical":
    case "timeline":
    default: {
      const startX = 400;
      const startY = 80;
      const ySpacing = 240;

      sections.forEach((sec, idx) => {
        const x = startX + (idx % 2 === 0 ? -120 : 120);
        const y = startY + idx * ySpacing;
        const nodeId = `node-${idx + 1}`;

        nodes.push({
          id: nodeId,
          type: "custom",
          position: { x, y },
          data: {
            title: sec.title,
            subtitle: `Step 0${idx + 1}`,
            description: sec.description,
            bullets: [
              `Conditional logic branch`,
              `System output verification`
            ],
            phaseTag: `STEP 0${idx + 1}`,
            theme
          }
        });

        if (idx > 0) {
          const prevId = `node-${idx}`;
          edges.push({
            id: `edge-${prevId}-${nodeId}`,
            source: prevId,
            target: nodeId,
            animated: true,
            style: { stroke: theme?.accentColor || "#CF9D7B", strokeWidth: 2 }
          });
        }
      });
      break;
    }
  }

  return { nodes, edges };
}