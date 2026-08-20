"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AI_REGISTRY, getAIById } from "@/data/ai-registry";
import { StudioConversation } from "@/lib/studio-history";
import { ensureActiveProject } from "@/lib/projects-store";
import StudioSidebar from "@/components/studio/studio-sidebar";
import StudioChat, {
  StudioChatHandle,
} from "@/components/studio/studio-chat";

function StudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeAIId, setActiveAIId] = useState<string>("sidekick-global");
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const chatRef = useRef<StudioChatHandle>(null);

  // ─── ENSURE ACTIVE PROJECT + MARK READY ────────────────────
  useEffect(() => {
    ensureActiveProject();
    setThemeLoaded(true);
  }, []);

  // ─── READ URL PARAMS ───────────────────────────────────────
  useEffect(() => {
    const aiParam = searchParams.get("ai");
    const sectionParam = searchParams.get("section");

    if (aiParam) {
      const ai = getAIById(aiParam);
      if (ai) {
        setActiveAIId(aiParam);
        return;
      }
    }

    if (sectionParam) {
      const ai = AI_REGISTRY.find((a) => a.id === sectionParam);
      if (ai) {
        setActiveAIId(ai.id);
      }
    }
  }, [searchParams]);

  // ─── HANDLE AI SELECTION ───────────────────────────────────
  const handleSelectAI = (aiId: string) => {
    setActiveAIId(aiId);
    setActiveConvId(null);
    setMobileSidebarOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.set("ai", aiId);
    url.searchParams.delete("section");
    router.replace(url.pathname + url.search);
    chatRef.current?.startNew();
  };

  // ─── HANDLE CONVERSATION SELECTION ─────────────────────────
  const handleSelectConversation = (conv: StudioConversation) => {
    if (conv.aiId !== activeAIId) {
      setActiveAIId(conv.aiId);
      const url = new URL(window.location.href);
      url.searchParams.set("ai", conv.aiId);
      url.searchParams.delete("section");
      router.replace(url.pathname + url.search);
    }
    setActiveConvId(conv.id);
    setMobileSidebarOpen(false);
    setTimeout(() => {
      chatRef.current?.loadConversation(conv);
    }, 50);
  };

  // ─── HANDLE NEW CHAT ───────────────────────────────────────
  const handleNewChat = () => {
    setActiveConvId(null);
    setMobileSidebarOpen(false);
    chatRef.current?.startNew();
  };

  // ─── HANDLE CONVERSATION SAVED ─────────────────────────────
  const handleConversationSaved = () => {
    setRefreshTick((t) => t + 1);
  };

  // ─── HANDLE PROJECT CHANGE ─────────────────────────────────
  const handleProjectChange = () => {
    setActiveConvId(null);
    setActiveAIId("sidekick-global");
    setMobileSidebarOpen(false);
    chatRef.current?.startNew();
    setRefreshTick((t) => t + 1);
    const url = new URL(window.location.href);
    url.searchParams.delete("ai");
    url.searchParams.delete("section");
    router.replace(url.pathname + url.search);
  };

  const activeAI = getAIById(activeAIId);

  if (!themeLoaded || !activeAI) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--sk-bg)" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full"
          style={{
            border: "1px solid rgba(240,230,210,0.08)",
            borderTopColor: "var(--sk-accent)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="h-screen w-screen overflow-hidden flex relative"
      style={{ background: "var(--sk-bg)" }}
    >
      {/* MOBILE BACKDROP */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-40"
            style={{ background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(2px)" }}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR (Desktop fixed width, Mobile overlay drawer) */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:transform-none ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <StudioSidebar
          activeAIId={activeAIId}
          activeConversationId={activeConvId}
          onSelectAI={handleSelectAI}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onProjectChange={handleProjectChange}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          refreshTick={refreshTick}
        />
      </div>

      {/* CHAT MAIN */}
      <StudioChat
        ref={chatRef}
        ai={activeAI}
        onConversationSaved={handleConversationSaved}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
      />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: "var(--sk-bg)" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-full"
            style={{
              border: "1px solid rgba(240,230,210,0.08)",
              borderTopColor: "var(--sk-accent)",
            }}
          />
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}