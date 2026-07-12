"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface TechNode {
  id: string;
  label: string;
  category: "core" | "framework" | "database" | "infra" | "tool";
  x: number;
  y: number;
  connections: string[];
  description: string;
}

const techNodes: TechNode[] = [
  { id: "python", label: "Python", category: "core", x: 50, y: 50, connections: ["fastapi", "django", "beanie"], description: "Primary language — async-first, 100K+ msgs/day" },
  { id: "fastapi", label: "FastAPI", category: "framework", x: 25, y: 30, connections: ["rest", "python"], description: "High-performance async framework for all APIs" },
  { id: "django", label: "Django", category: "framework", x: 75, y: 25, connections: ["python", "postgres"], description: "ORM & admin for legacy service management" },
  { id: "rest", label: "REST APIs", category: "tool", x: 10, y: 55, connections: ["fastapi", "webhooks"], description: "40+ production endpoints with OAuth2" },
  { id: "webhooks", label: "Webhooks", category: "tool", x: 8, y: 75, connections: ["rest", "sqs"], description: "Event-driven webhook processing pipeline" },
  { id: "aws", label: "AWS", category: "infra", x: 72, y: 65, connections: ["sqs", "s3", "docker"], description: "Cloud infrastructure — SQS, S3, EC2, Lambda" },
  { id: "sqs", label: "AWS SQS", category: "infra", x: 55, y: 78, connections: ["aws", "python", "workers"], description: "Message queues — 100K+ daily message throughput" },
  { id: "workers", label: "Workers", category: "tool", x: 38, y: 88, connections: ["sqs", "mongo"], description: "Async consumers processing queued events" },
  { id: "mongo", label: "MongoDB", category: "database", x: 30, y: 68, connections: ["beanie", "workers"], description: "Document store for communication & call data" },
  { id: "beanie", label: "Beanie ODM", category: "framework", x: 38, y: 52, connections: ["python", "mongo"], description: "Async ODM — elegant MongoDB data modeling" },
  { id: "postgres", label: "PostgreSQL", category: "database", x: 82, y: 42, connections: ["django", "payments"], description: "Relational DB for financial transactions" },
  { id: "redis", label: "Redis", category: "database", x: 65, y: 88, connections: ["python", "caching"], description: "Cache & pub/sub for real-time operations" },
  { id: "caching", label: "Caching", category: "tool", x: 80, y: 82, connections: ["redis"], description: "Session, rate limiting & response caching" },
  { id: "docker", label: "Docker", category: "infra", x: 90, y: 58, connections: ["aws", "k8s"], description: "Containerized deployments — EKS ready" },
  { id: "k8s", label: "Kubernetes", category: "infra", x: 92, y: 38, connections: ["docker"], description: "Orchestration for production workloads" },
  { id: "s3", label: "S3", category: "infra", x: 88, y: 75, connections: ["aws"], description: "Object storage for recordings & documents" },
  { id: "payments", label: "Payments", category: "tool", x: 72, y: 15, connections: ["postgres", "rest"], description: "NACH, cheque, bank reversal processing" },
];

const categoryColors: Record<string, string> = {
  core: "#00d4ff",
  framework: "#7b61ff",
  database: "#00ff88",
  infra: "#ffd700",
  tool: "#ff6b6b",
};

const categoryLabels: Record<string, string> = {
  core: "Core Language",
  framework: "Frameworks",
  database: "Databases",
  infra: "Infrastructure",
  tool: "Tools & APIs",
};

function MobileGrid({
  activeNode,
  setActiveNode,
}: {
  activeNode: string | null;
  setActiveNode: (id: string | null) => void;
}) {
  const categories = Object.keys(categoryColors) as Array<keyof typeof categoryColors>;

  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const nodes = techNodes.filter((n) => n.category === cat);
        if (nodes.length === 0) return null;
        const color = categoryColors[cat];

        return (
          <div key={cat}>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <h4 className="text-xs font-mono text-text-muted uppercase tracking-wider">
                {categoryLabels[cat]}
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nodes.map((node) => {
                const isActive = activeNode === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() =>
                      setActiveNode(isActive ? null : node.id)
                    }
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 ${
                      isActive
                        ? "bg-surface-lighter border-primary/50 shadow-glow-sm"
                        : "bg-surface/60 border-border/50 active:scale-95"
                    }`}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: color,
                        boxShadow: isActive ? `0 0 8px ${color}` : "none",
                      }}
                    />
                    <span
                      className={`text-sm font-medium truncate ${
                        isActive ? "text-text" : "text-text-secondary"
                      }`}
                    >
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* Show description for active node in this category */}
            {activeNode &&
              nodes.find((n) => n.id === activeNode) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 px-3 py-2 rounded-lg bg-surface-lighter/50 border border-border/30"
                >
                  <p className="text-xs text-text-secondary">
                    {nodes.find((n) => n.id === activeNode)?.description}
                  </p>
                </motion.div>
              )}
          </div>
        );
      })}
    </div>
  );
}

export function TechStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [linesDrawn, setLinesDrawn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Trigger line-draw animation after mount
  useEffect(() => {
    const timer = setTimeout(() => setLinesDrawn(true), 800);
    return () => clearTimeout(timer);
  }, []);



  const activeConnections = hoveredNode
    ? techNodes.find((n) => n.id === hoveredNode)?.connections || []
    : [];

  // Generate all connection lines with indices for stagger
  const connectionLines: {
    key: string;
    x1: string;
    y1: string;
    x2: string;
    y2: string;
    nodeId: string;
    connId: string;
    index: number;
  }[] = [];
  let lineIndex = 0;
  techNodes.forEach((node) => {
    node.connections.forEach((connId) => {
      const target = techNodes.find((n) => n.id === connId);
      if (!target) return;
      connectionLines.push({
        key: `${node.id}-${connId}`,
        x1: `${node.x}%`,
        y1: `${node.y}%`,
        x2: `${target.x}%`,
        y2: `${target.y}%`,
        nodeId: node.id,
        connId,
        index: lineIndex++,
      });
    });
  });

  return (
    <section id="tech-stack" ref={sectionRef} className="relative py-section">
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
            02 / Tech Stack
          </span>
          <h2 className="text-display-md font-display font-bold mt-4">
            Technology Network
          </h2>
          <p className="text-text-secondary mt-3 max-w-lg">
            {isMobile
              ? "Tap a technology to explore details."
              : "An interconnected ecosystem of tools and technologies. Hover to explore connections."}
          </p>
        </motion.div>

        {/* Mobile: Categorized Grid */}
        {isMobile ? (
          <MobileGrid activeNode={activeNode} setActiveNode={setActiveNode} />
        ) : (
          /* Desktop: Network Graph */
          <div className="grid lg:grid-cols-[1fr,340px] gap-8">
            {/* Network Graph */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative aspect-[4/3] glass rounded-2xl overflow-hidden p-4"
            >
              {/* SVG connections with line-draw animation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connectionLines.map((line) => {
                  const isActive =
                    hoveredNode === line.nodeId ||
                    hoveredNode === line.connId ||
                    activeConnections.includes(line.nodeId) ||
                    activeConnections.includes(line.connId);

                  const lineLength = 600;

                  return (
                    <line
                      key={line.key}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={isActive ? "#00d4ff" : "rgba(255,255,255,0.06)"}
                      strokeWidth={isActive ? 1.5 : 0.5}
                      strokeDasharray={lineLength}
                      strokeDashoffset={linesDrawn ? 0 : lineLength}
                      style={{
                        transition: `stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${line.index * 0.04}s, stroke 0.5s, stroke-width 0.5s`,
                      }}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {techNodes.map((node, i) => {
                const isActive =
                  hoveredNode === node.id ||
                  activeConnections.includes(node.id);
                const color = categoryColors[node.category];

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                    animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                    transition={{ delay: 0.2 + i * 0.03, duration: 0.5, type: "spring" }}
                    className="absolute z-10"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setActiveNode(node.id === activeNode ? null : node.id)}
                    data-cursor-hover
                  >
                    <div
                      className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                        isActive
                          ? "bg-surface-lighter border-primary/50 shadow-glow-sm scale-110"
                          : "bg-surface/80 border-border/50 hover:border-border-light"
                      }`}
                    >
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: color,
                          boxShadow: isActive ? `0 0 8px ${color}` : "none",
                        }}
                      />
                      <span
                        className={`text-xs font-medium whitespace-nowrap transition-colors ${
                          isActive ? "text-text" : "text-text-secondary"
                        }`}
                      >
                        {node.label}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Info Panel */}
            <div className="space-y-4">
              {/* Active node detail */}
              <div className="glass rounded-xl p-5 min-h-[120px]">
                {hoveredNode || activeNode ? (
                  <motion.div
                    key={hoveredNode || activeNode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {(() => {
                      const node = techNodes.find(
                        (n) => n.id === (hoveredNode || activeNode)
                      );
                      if (!node) return null;
                      return (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: categoryColors[node.category] }}
                            />
                            <h4 className="font-semibold text-text">{node.label}</h4>
                          </div>
                          <p className="text-sm text-text-secondary">
                            {node.description}
                          </p>
                          <p className="text-xs text-text-muted mt-2 font-mono">
                            {node.connections.length} connections
                          </p>
                        </>
                      );
                    })()}
                  </motion.div>
                ) : (
                  <p className="text-sm text-text-muted italic">
                    Hover over a node to see details
                  </p>
                )}
              </div>

              {/* Legend */}
              <div className="glass rounded-xl p-5">
                <p className="text-xs font-mono text-text-muted uppercase tracking-wider mb-3" aria-label="Legend categories">
                  Categories
                </p>
                <div className="space-y-2">
                  {Object.entries(categoryColors).map(([cat, color]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-text-secondary capitalize">
                        {cat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
