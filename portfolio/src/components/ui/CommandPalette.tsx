"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
  label: string;
  description: string;
  action: () => void;
  icon: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    {
      label: "About",
      description: "Jump to about section",
      action: () => scrollToSection("#about"),
      icon: "👤",
    },
    {
      label: "Tech Stack",
      description: "View technology network",
      action: () => scrollToSection("#tech-stack"),
      icon: "⚡",
    },
    {
      label: "Projects",
      description: "Explore system chapters",
      action: () => scrollToSection("#projects"),
      icon: "🏗️",
    },
    {
      label: "Experience",
      description: "Career metro map",
      action: () => scrollToSection("#experience"),
      icon: "🚀",
    },
    {
      label: "Contact",
      description: "Open a connection",
      action: () => scrollToSection("#contact"),
      icon: "📡",
    },
    {
      label: "Resume",
      description: "Download PDF resume",
      action: () => window.open("/mritunjay-resume.pdf", "_blank"),
      icon: "📄",
    },
    {
      label: "GitHub",
      description: "View source code",
      action: () => window.open("https://github.com/mritunjay-ps", "_blank"),
      icon: "🐙",
    },
    {
      label: "Top",
      description: "Scroll to top",
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      icon: "⬆️",
    },
  ];

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch("");
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      // Timeout to ensure element is rendered
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Focus trap within the palette
  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusable = listRef.current?.querySelectorAll<HTMLElement>(
        'button, input, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;

      const first = inputRef.current || focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
  };

  const runCommand = (cmd: Command) => {
    cmd.action();
    setIsOpen(false);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Palette */}
          <motion.div
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[201] w-full max-w-lg mx-4"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={handlePaletteKeyDown}
            ref={listRef}
          >
            <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border/50">
                <svg
                  className="w-4 h-4 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command..."
                  aria-label="Search commands"
                  className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
                />
                <kbd className="px-2 py-0.5 rounded text-[10px] font-mono text-text-muted bg-surface-light border border-border/50">
                  ESC
                </kbd>
              </div>

              {/* Commands list */}
              <div className="max-h-[300px] overflow-y-auto p-2" role="listbox">
                {filteredCommands.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => runCommand(cmd)}
                    role="option"
                    aria-selected={false}
                    data-cursor-hover
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-surface-lighter transition-colors"
                  >
                    <span className="text-lg" aria-hidden="true">
                      {cmd.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text">
                        {cmd.label}
                      </p>
                      <p className="text-xs text-text-muted">
                        {cmd.description}
                      </p>
                    </div>
                  </button>
                ))}

                {filteredCommands.length === 0 && (
                  <p className="text-center text-sm text-text-muted py-8">
                    No commands found
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
