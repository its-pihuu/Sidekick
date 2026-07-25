// src/components/onboarding/reveal-screen.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { UserProfile, markOnboardingComplete } from "@/lib/onboarding-store";

interface RevealScreenProps {
  profile: UserProfile;
}

export default function RevealScreen({ profile }: RevealScreenProps) {
  const router = useRouter();

  useEffect(() => {
    // Mark onboarding as complete
    markOnboardingComplete();

    // Redirect to Studio after 3.5 seconds
    const timer = setTimeout(() => {
      router.push("/studio");
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  const stageLines: Record<UserProfile["ideaStage"], string> = {
    vague: "Let's find the signal in the noise.",
    clear: "You have clarity. Now let's build the plan.",
    validating: "Smart. Let's pressure-test everything.",
    building: "You're already moving. Let's sharpen the edge.",
    launched: "You're live. Let's figure out what's next.",
  };

  const blockerLines: Record<UserProfile["biggestBlocker"], string> = {
    "no-start": "We start today.",
    "too-many-ideas": "We pick one and go all in.",
    "no-tech": "Tech is a tool. Ideas are the weapon.",
    "no-time": "Every hour counts. Let's make them count.",
    "no-confidence": "Doubt is normal. Quitting is optional.",
    "no-plan": "That's exactly what we're building.",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--sk-bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      {/* Top accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: "var(--sk-accent)",
          transformOrigin: "left",
        }}
      />

      {/* Mono label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          color: "var(--sk-accent)",
          textTransform: "uppercase",
          marginBottom: "2rem",
        }}
      >
        Sidekick · Ready
      </motion.p>

      {/* Main greeting */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "clamp(2.2rem, 6vw, 4rem)",
          color: "var(--sk-text)",
          lineHeight: 1.15,
          marginBottom: "1.5rem",
          maxWidth: "600px",
        }}
      >
        Welcome, {profile.name}.
      </motion.h1>

      {/* Divider */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
        style={{
          width: "40px",
          height: "1px",
          backgroundColor: "var(--sk-accent)",
          marginBottom: "1.5rem",
          transformOrigin: "center",
        }}
      />

      {/* Stage line */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "1.1rem",
          color: "var(--sk-text)",
          opacity: 0.7,
          marginBottom: "0.75rem",
          maxWidth: "480px",
        }}
      >
        {stageLines[profile.ideaStage]}
      </motion.p>

      {/* Blocker line */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 1.1 }}
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "1.25rem",
          color: "var(--sk-accent)",
          marginBottom: "3rem",
          maxWidth: "480px",
        }}
      >
        {blockerLines[profile.biggestBlocker]}
      </motion.p>

      {/* Redirecting indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.6 }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Animated progress bar */}
        <div
          style={{
            width: "120px",
            height: "1px",
            backgroundColor: "rgba(240, 230, 210, 0.1)",
            borderRadius: "1px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.5, ease: "linear", delay: 1.6 }}
            style={{
              height: "100%",
              backgroundColor: "var(--sk-accent)",
              transformOrigin: "left",
            }}
          />
        </div>

        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            letterSpacing: "0.12em",
            color: "var(--sk-text)",
            opacity: 0.3,
            textTransform: "uppercase",
          }}
        >
          Opening Studio
        </p>
      </motion.div>
    </div>
  );
}