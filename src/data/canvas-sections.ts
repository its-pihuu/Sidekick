// data/canvas-sections.ts
// 11 canvas sections — the full product brain

export interface CanvasSection {
    id: string;
    title: string;
    emoji: string;
    description: string;
    placeholder: string;
    tip: string;
    order: number;
    color: string; // accent color for this card's doodle/border
  }
  
  export const CANVAS_SECTIONS: CanvasSection[] = [
    {
      id: "problem",
      title: "The Problem",
      emoji: "🔥",
      description: "What painful problem are you solving? Be brutally honest.",
      placeholder:
        "e.g. Students waste 3 hours a day searching for study resources across 10 different apps. Nobody has built one clean place for everything...",
      tip: "If you can't explain the problem in 2 sentences, you don't understand it yet.",
      order: 1,
      color: "#D67DF0",
    },
    {
      id: "solution",
      title: "Your Solution",
      emoji: "💡",
      description: "What are you building? What makes it actually work?",
      placeholder:
        "e.g. A single dashboard that aggregates study materials, tracks progress, and uses AI to recommend what to study next based on your exam date...",
      tip: "Your solution should make the problem look obvious in hindsight.",
      order: 2,
      color: "#6B8AFF",
    },
    {
      id: "target-users",
      title: "Target Users",
      emoji: "🎯",
      description: "Who exactly is this for? Get uncomfortably specific.",
      placeholder:
        "e.g. Indian students aged 16-22 preparing for JEE/NEET who are self-studying, overwhelmed by content, and already using YouTube + Notion but stitching them together manually...",
      tip: "\"Everyone\" is not a target market. The riches are in the niches.",
      order: 3,
      color: "#A872E8",
    },
    {
      id: "value-proposition",
      title: "Value Proposition",
      emoji: "✨",
      description: "Why should they choose YOU over everything else?",
      placeholder:
        "e.g. The only study tool built specifically for Indian competitive exam students — with AI that understands the JEE/NEET syllabus, not generic content...",
      tip: "Complete this: \"Only we ___. That's why customers choose us.\"",
      order: 4,
      color: "#E8D26B",
    },
    {
      id: "revenue-model",
      title: "Revenue Model",
      emoji: "💰",
      description: "How does this make money? Be specific about pricing.",
      placeholder:
        "e.g. Freemium — free for 3 subjects, ₹199/month for unlimited. Target: 1000 paid users in 6 months = ₹2L MRR. Annual plan at ₹1499 (2 months free)...",
      tip: "\"We'll figure out monetization later\" is how you build a hobby, not a business.",
      order: 5,
      color: "#E89BC7",
    },
    {
      id: "competitors",
      title: "Competitors & Alternatives",
      emoji: "⚔️",
      description: "Who else is playing this game? What's missing from their moves?",
      placeholder:
        "e.g. Unacademy (too expensive, video-heavy), Notion (too generic, no AI), YouTube (no structure). Gap: nobody has built an AI-powered personalized study planner for Indian students...",
      tip: "No competitors = no market. Lots of competitors = proven demand. Win on execution.",
      order: 6,
      color: "#6B8AFF",
    },
    {
      id: "key-features",
      title: "Key Features",
      emoji: "🛠️",
      description: "What are the 3-5 features that make this actually work?",
      placeholder:
        "e.g. \n1. Smart study planner (AI-generated daily schedule based on exam date)\n2. Resource aggregator (YouTube + PDFs + notes in one place)\n3. Progress tracker with weak area detection\n4. Peer study groups\n5. Mock test analyzer...",
      tip: "List features in order of impact. Build #1 first. Ship. Then add #2.",
      order: 7,
      color: "#D67DF0",
    },
    {
      id: "go-to-market",
      title: "Go-To-Market Strategy",
      emoji: "🚀",
      description: "How will you get your first 100 users? Then your first 1000?",
      placeholder:
        "e.g. First 100: Post in JEE preparation Facebook groups + Reddit r/JEEpreparation. DM 50 students personally. First 1000: Partner with 5 coaching institutes for free access. YouTube channel with study tips...",
      tip: "\"Build it and they will come\" is a movie quote, not a strategy.",
      order: 8,
      color: "#A872E8",
    },
    {
      id: "metrics",
      title: "Key Metrics",
      emoji: "📊",
      description: "What numbers will tell you if this is working?",
      placeholder:
        "e.g. North Star: Weekly Active Users. Supporting: DAU/MAU ratio (target >40%), session length (target >25 min), D7 retention (target >30%), MRR growth (target 20% MoM)...",
      tip: "Pick ONE north star metric. Everything else is context.",
      order: 9,
      color: "#E8D26B",
    },
    {
      id: "risks",
      title: "Risks & Assumptions",
      emoji: "⚡",
      description: "What has to be true for this to work? What could kill it?",
      placeholder:
        "e.g. Assumptions: Students will pay ₹199/month (unproven). Risks: Unacademy copies us in 6 months. Mitigation: Build community + data moat before they notice us...",
      tip: "Write down your scariest assumption. Then figure out how to test it this week.",
      order: 10,
      color: "#E89BC7",
    },
    {
      id: "vision",
      title: "The Big Vision",
      emoji: "🌍",
      description: "Where is this going in 3-5 years? Why does it matter?",
      placeholder:
        "e.g. In 5 years: The default study platform for every Indian student preparing for competitive exams. 10M students. Expand to UPSC, CA, MBA entrance. Eventually — the \"Duolingo for Indian exams\"...",
      tip: "Think bigger than you're comfortable with. Then double it.",
      order: 11,
      color: "#6B8AFF",
    },
  ];
  
  // Helper to get section by id
  export const getSectionById = (id: string): CanvasSection | undefined =>
    CANVAS_SECTIONS.find((s) => s.id === id);
  
  // Helper to get sections in order
  export const getSectionsInOrder = (): CanvasSection[] =>
    [...CANVAS_SECTIONS].sort((a, b) => a.order - b.order);