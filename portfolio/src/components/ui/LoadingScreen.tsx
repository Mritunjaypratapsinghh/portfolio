"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const bootSequence = [
  { text: "Initializing system...", delay: 200 },
  { text: "Loading kernel modules...", delay: 400 },
  { text: "Connecting to services...", delay: 300 },
  { text: "├── FastAPI Gateway............ ✓", delay: 250 },
  { text: "├── PostgreSQL Cluster......... ✓", delay: 300 },
  { text: "├── MongoDB (DocumentDB)...... ✓", delay: 250 },
  { text: "├── Redis Cache Layer.......... ✓", delay: 200 },
  { text: "├── AWS SQS Queues............ ✓", delay: 300 },
  { text: "├── Authentication Module...... ✓", delay: 250 },
  { text: "└── Worker Processes........... ✓", delay: 300 },
  { text: "", delay: 100 },
  { text: "All systems operational.", delay: 400 },
  { text: "", delay: 200 },
  { text: "WELCOME", delay: 600 },
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= bootSequence.length) {
      // WELCOME text is now visible — trigger zoom animation
      setWelcomeVisible(true);
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(onComplete, 600);
      }, 900);
      return;
    }

    const timer = setTimeout(() => {
      setLines((prev) => [...prev, bootSequence[currentIndex].text]);
      setCurrentIndex((i) => i + 1);
      setProgress(((currentIndex + 1) / bootSequence.length) * 100);
    }, bootSequence[currentIndex].delay);

    return () => clearTimeout(timer);
  }, [currentIndex, onComplete]);

  // Auto-scroll terminal
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-label="Loading portfolio"
        >
          {/* Background grid */}
          <div className="absolute inset-0 grid-overlay opacity-30" />

          {/* Ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />

          {/* Terminal window — scales down on exit for zoom-through feel */}
          <motion.div
            className="relative w-full max-w-2xl mx-6"
            animate={
              welcomeVisible
                ? { scale: 0.9, opacity: 0, filter: "blur(4px)" }
                : { scale: 1, opacity: 1, filter: "blur(0px)" }
            }
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-surface-light/80 backdrop-blur-sm border border-border rounded-t-lg">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs font-mono text-text-muted">
                system.boot — mritunjay@backend
              </span>
            </div>

            {/* Terminal body */}
            <div
              ref={containerRef}
              className="bg-surface/90 backdrop-blur-xl border border-border border-t-0 rounded-b-lg p-6 h-[360px] overflow-y-auto"
            >
              <div className="font-mono text-sm space-y-1" aria-live="polite">
                {lines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`${
                      line === "WELCOME"
                        ? "text-2xl font-bold glow-text mt-4 text-primary"
                        : line.includes("✓")
                        ? "text-neon/90"
                        : line === "All systems operational."
                        ? "text-primary font-semibold"
                        : "text-text-secondary"
                    }`}
                  >
                    {line === "WELCOME" ? (
                      <motion.span
                        className="tracking-[0.3em] inline-block"
                        initial={{ scale: 1, filter: "blur(0px)" }}
                        animate={{ scale: 1.5, filter: "blur(2px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        {line}
                      </motion.span>
                    ) : (
                      <>
                        {line && (
                          <span className="text-primary/50 mr-2">›</span>
                        )}
                        {line}
                      </>
                    )}
                  </motion.div>
                ))}

                {/* Blinking cursor */}
                {!welcomeVisible && (
                  <span className="inline-block w-2 h-4 bg-primary/80 animate-terminal-blink ml-1" />
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-[2px] bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-accent to-neon"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            <p className="text-center text-xs text-text-muted mt-3 font-mono">
              {Math.round(progress)}% — Bootstrapping infrastructure
            </p>
          </motion.div>

          {currentIndex > 3 && (
            <button
              onClick={onComplete}
              className="absolute bottom-8 right-8 text-xs font-mono text-[#7a7a8e] hover:text-[#00d4ff] transition-colors z-50"
              aria-label="Skip loading animation"
            >
              Skip →
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
