"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Station {
  id: string;
  title: string;
  company: string;
  period: string;
  status: "completed" | "current" | "future";
  highlights: string[];
}

const stations: Station[] = [
  {
    id: "kogta",
    title: "Software Developer",
    company: "Kogta Financial (India) Limited",
    period: "2024 — Present",
    status: "current",
    highlights: [
      "Built Communication Aggregator (100K+ msgs/day)",
      "Designed Multi-Vendor Dialer architecture",
      "Built Receivable Engine for payment processing",
      "Reduced manual operations by 80%",
      "40+ REST APIs in production",
    ],
  },
  {
    id: "senior",
    title: "Senior Backend Engineer",
    company: "Next Destination",
    period: "Future",
    status: "future",
    highlights: [
      "Distributed systems at massive scale",
      "Team leadership & architecture decisions",
      "Event-driven microservices",
      "Platform engineering",
    ],
  },
];

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLDivElement>(null);
  const stationDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!railFillRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Rail fill animation
      gsap.fromTo(
        railFillRef.current,
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
            onUpdate: (self) => {
              // Calculate which stations should pulse based on progress
              const progress = self.progress;
              const stationCount = stations.length;

              stationDotsRef.current.forEach((dot, i) => {
                if (!dot) return;
                const stationThreshold = (i + 1) / (stationCount + 0.5);

                // Trigger pulse when progress crosses station threshold
                if (
                  progress >= stationThreshold &&
                  !dot.dataset.pulsed
                ) {
                  dot.dataset.pulsed = "true";

                  // Scale pulse animation
                  gsap.fromTo(
                    dot,
                    { scale: 1 },
                    {
                      scale: 1.3,
                      duration: 0.2,
                      ease: "power2.out",
                      yoyo: true,
                      repeat: 1,
                      onComplete: () => {
                        gsap.set(dot, { scale: 1 });
                      },
                    }
                  );

                  // Glow flash
                  gsap.fromTo(
                    dot,
                    { boxShadow: "0 0 0px rgba(0, 212, 255, 0)" },
                    {
                      boxShadow: "0 0 20px rgba(0, 212, 255, 0.8)",
                      duration: 0.2,
                      ease: "power2.out",
                      yoyo: true,
                      repeat: 1,
                      onComplete: () => {
                        gsap.set(dot, {
                          boxShadow:
                            stations[i].status === "current"
                              ? "0 0 10px rgba(0, 212, 255, 0.3)"
                              : "none",
                        });
                      },
                    }
                  );
                }
              });
            },
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);



  return (
    <section id="experience" ref={sectionRef} className="relative py-section">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <span className="text-caption font-mono text-primary uppercase tracking-[0.2em]">
            04 / Experience
          </span>
          <h2 className="text-display-md font-display font-bold mt-4">
            Career Metro
          </h2>
          <p className="text-text-secondary mt-3 max-w-lg">
            Stations on the engineering journey. Each stop shaped the systems I
            build today.
          </p>
        </motion.div>

        {/* Metro map */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical rail — background track */}
          <div
            ref={railRef}
            className="absolute left-8 top-0 bottom-0 w-[2px] bg-border/40"
          />
          {/* Filled portion — animated with GSAP scrub */}
          <div
            ref={railFillRef}
            className="absolute left-8 top-0 w-[2px] bg-gradient-to-b from-primary via-accent to-neon"
            style={{ height: "0%" }}
          />

          {/* Stations */}
          <div className="space-y-16">
            {stations.map((station, i) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, x: -40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
                className="relative pl-14 sm:pl-20"
              >
                {/* Station dot */}
                <div className="absolute left-[22px] top-2">
                  <div
                    ref={(el) => { stationDotsRef.current[i] = el; }}
                    className={`w-[14px] h-[14px] rounded-full border-[3px] transition-all duration-300 ${
                      station.status === "current"
                        ? "bg-primary border-primary shadow-glow-sm"
                        : station.status === "future"
                        ? "bg-transparent border-accent/50"
                        : "bg-neon border-neon"
                    }`}
                  />
                  {station.status === "current" && (
                    <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                  )}
                </div>

                {/* Station content */}
                <div
                  className={`glass rounded-xl p-6 transition-all duration-300 ${
                    station.status === "current"
                      ? "border-primary/30 glow-box"
                      : station.status === "future"
                      ? "border-accent/20 opacity-70"
                      : ""
                  }`}
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text">
                        {station.title}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {station.company}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono ${
                        station.status === "current"
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : station.status === "future"
                          ? "bg-accent/10 text-accent border border-accent/30"
                          : "bg-neon/10 text-neon border border-neon/30"
                      }`}
                    >
                      {station.period}
                    </span>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {station.highlights.map((highlight, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.5 + i * 0.2 + j * 0.05 }}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span className="text-primary mt-1 text-xs">▸</span>
                        {highlight}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
