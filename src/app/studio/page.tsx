"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AI_REGISTRY, getAIById } from "@/data/ai-registry";
import { StudioConversation } from "@/lib/studio-history";
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
  const chatRef = useRef<StudioChatHandle>(null);

  // ─── MARK READY ────────────────────────────────────────────
  useEffect(() => {
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
      const ai = AI_REGISTRY.find((a) => a.sectionId === sectionParam);
      if (ai) {
        setActiveAIId(ai.id);
      }
    }
  }, [searchParams]);

  // ─── HANDLE AI SELECTION ───────────────────────────────────
  const handleSelectAI = (aiId: string) => {
    setActiveAIId(aiId);
    setActiveConvId(null);
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
    setTimeout(() => {
      chatRef.current?.loadConversation(conv);
    }, 50);
  };

  // ─── HANDLE NEW CHAT ───────────────────────────────────────
  const handleNewChat = () => {
    setActiveConvId(null);
    chatRef.current?.startNew();
  };

  // ─── HANDLE CONVERSATION SAVED ─────────────────────────────
  const handleConversationSaved = () => {
    setRefreshTick((t) => t + 1);
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
      className="h-screen w-screen overflow-hidden flex"
      style={{ background: "var(--sk-bg)" }}
    >
      <StudioSidebar
        activeAIId={activeAIId}
        activeConversationId={activeConvId}
        onSelectAI={handleSelectAI}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        refreshTick={refreshTick}
      />
      <StudioChat
        ref={chatRef}
        ai={activeAI}
        onConversationSaved={handleConversationSaved}
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