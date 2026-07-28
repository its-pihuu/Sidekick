"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface VoiceVisualizerProps {
  active: boolean;
  transcript: string;
}

const BAR_COUNT = 7;

export default function VoiceVisualizer({ active, transcript }: VoiceVisualizerProps) {
  const [levels, setLevels] = useState<number[]>(Array(BAR_COUNT).fill(0.1));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) {
      // Teardown when mic stops
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setLevels(Array(BAR_COUNT).fill(0.1));
      return;
    }

    // Start listening for real audio amplitude
    const startAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioCtx();
        audioContextRef.current = audioContext;

        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);

          // Sample BAR_COUNT frequency buckets across the spectrum
          const newLevels: number[] = [];
          const chunkSize = Math.floor(bufferLength / BAR_COUNT);
          for (let i = 0; i < BAR_COUNT; i++) {
            let sum = 0;
            for (let j = 0; j < chunkSize; j++) {
              sum += dataArray[i * chunkSize + j];
            }
            const avg = sum / chunkSize;
            // Normalize to 0.1 – 1.0 (with slight floor so bars never fully die)
            const normalized = Math.max(0.1, Math.min(1, avg / 140));
            newLevels.push(normalized);
          }
          setLevels(newLevels);
          rafRef.current = requestAnimationFrame(tick);
        };

        tick();
      } catch {
        // Mic permission denied or unavailable
      }
    };

    startAudio();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [active]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: "40px",
      }}
    >
      {/* Label + bars row */}
      <div className="flex items-center gap-4 w-full">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--sk-accent)",
            opacity: 0.85,
            whiteSpace: "nowrap",
          }}
        >
          Listening
        </span>

        {/* THE BARS */}
        <div
          className="flex items-center gap-1.5"
          style={{ height: "28px" }}
        >
          {levels.map((level, i) => (
            <motion.div
              key={i}
              animate={{
                height: `${Math.max(4, level * 28)}px`,
                opacity: 0.5 + level * 0.5,
              }}
              transition={{
                duration: 0.08,
                ease: "easeOut",
              }}
              style={{
                width: "3px",
                borderRadius: "2px",
                background: "var(--sk-accent)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Live transcript below */}
      {transcript && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
            fontStyle: "italic",
            color: "var(--sk-text)",
            opacity: 0.85,
            lineHeight: 1.5,
            margin: 0,
            paddingLeft: "0",
          }}
        >
          {transcript}
        </motion.p>
      )}
    </motion.div>
  );
}