"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const aboutLines = [
  "> whoami",
  "",
  "Backend engineer who builds the invisible infrastructure",
  "that keeps a financial company running.",
  "",
  "My systems process 100K+ messages daily, route 10K+ calls,",
  "and handle payment transactions — all with zero downtime.",
  "",
  "I care about: clean architecture, measurable performance,",
  "and systems that scale without drama.",
  "",
  "> stack --primary",
  "Python | FastAPI | AWS | MongoDB | PostgreSQL",
  "Docker | Kubernetes | Redis | SQS | REST",
  "",
  "> education",
  "B.Tech Computer Science — 2024",
  "Rajasthan Technical University",
  "",
  "> certifications",
  "AWS Cloud Practitioner (In Progress)",
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    setIsTouchDevice(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);



  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  };

  const handleMouseLeave = () => {
    if (isTouchDevice || !cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-section"
    >
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <span className="text-caption font-mono text-primary uppercase tracking-[0.2em]">
            01 / About
          </span>
          <h2 className="text-display-md font-display font-bold mt-4">
            About Me
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* 3D Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-start"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-md transition-transform duration-200 ease-out preserve-3d"
            >
              <div className="glass glass-shimmer rounded-2xl p-8 glow-box">
                {/* Card header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                    <span className="text-2xl font-bold gradient-text">M</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text">
                      Mritunjay Pratap Singh
                    </h3>
                    <p className="text-sm text-text-secondary">
                      Backend Software Engineer
                    </p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Experience", value: "1+ Years" },
                    { label: "Systems Built", value: "6+" },
                    { label: "Daily Msgs", value: "100K+" },
                    { label: "APIs Built", value: "40+" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-lg bg-surface-light/50 border border-border/30"
                    >
                      <p className="text-xs text-text-muted">{stat.label}</p>
                      <p className="text-lg font-bold text-primary mt-0.5">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Status indicators */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                    Open to Opportunities
                  </span>
                  <span className="text-text-muted">|</span>
                  <span className="text-text-secondary">
                    Kogta Financial (India) Ltd
                  </span>
                </div>
              </div>

              {/* Glow effect behind card */}
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10" />
            </div>
          </motion.div>

          {/* Terminal output */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass rounded-xl overflow-hidden">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-light/60 border-b border-border/50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[11px] font-mono text-text-muted">
                  about.sh
                </span>
              </div>

              {/* Terminal content */}
              <div className="p-5 font-mono text-sm leading-relaxed h-[400px] overflow-y-auto">
                {aboutLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className={`${
                      line.startsWith(">")
                        ? "text-primary"
                        : line.startsWith("Python") ||
                          line.startsWith("Docker") ||
                          line.startsWith("B.Tech") ||
                          line.startsWith("AWS Cloud") ||
                          line.startsWith("Rajasthan")
                        ? "text-neon/80"
                        : "text-text-secondary"
                    }`}
                  >
                    {line || "\u00A0"}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
