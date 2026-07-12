"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

interface Achievement {
  value: number;
  suffix: string;
  label: string;
  description: string;
  isStatic?: boolean;
  staticDisplay?: string;
}

const achievements: Achievement[] = [
  {
    value: 99.9,
    suffix: "%",
    label: "Uptime",
    description: "Across all production systems",
  },
  {
    value: 6,
    suffix: "+",
    label: "Systems Built",
    description: "End-to-end from architecture to deploy",
  },
  {
    value: 500,
    suffix: "+",
    label: "Problems Solved",
    description: "LeetCode & competitive programming",
  },
  {
    value: 0,
    suffix: "",
    label: "Zero Downtime",
    description: "On critical payment systems",
    isStatic: true,
    staticDisplay: "Zero",
  },
];

function AnimatedCounter({
  target,
  suffix,
  isInView,
}: {
  target: number;
  suffix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);
  const isDecimal = target % 1 !== 0;

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let cancelled = false;
    let rafHandle: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (cancelled) return;
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        rafHandle = requestAnimationFrame(animate);
      }
    };

    rafHandle = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafHandle);
    };
  }, [isInView, target, isDecimal]);

  return (
    <span className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function AchievementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="relative py-section-sm">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <span className="text-caption font-mono text-primary uppercase tracking-[0.2em]">
            04.5 / Impact
          </span>
          <h2 className="text-display-md font-display font-bold mt-4">
            Numbers That Matter
          </h2>
        </motion.div>

        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              className="relative group"
            >
              <div className="glass rounded-2xl p-6 text-center h-full transition-all duration-500 hover:border-primary/30 hover:shadow-glow-sm">
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {item.isStatic ? (
                    <span className="bg-gradient-to-r from-primary to-neon bg-clip-text text-transparent">
                      {item.staticDisplay}
                    </span>
                  ) : (
                    <AnimatedCounter
                      target={item.value}
                      suffix={item.suffix}
                      isInView={isInView}
                    />
                  )}
                </div>

                {/* Label */}
                <h3 className="text-sm font-semibold text-text mb-1">
                  {item.label}
                </h3>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
