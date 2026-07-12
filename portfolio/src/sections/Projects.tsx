"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  techStack: string[];
  architecture: {
    nodes: { label: string; type: "service" | "queue" | "db" | "external" }[];
    flows: string[];
  };
}

const projects: Project[] = [
  {
    id: "communication-aggregator",
    number: "01",
    title: "Communication Aggregator",
    subtitle: "Multi-channel messaging at scale",
    description:
      "Unified messaging platform that enables ₹50Cr+ in monthly collections by delivering 100K+ daily messages across WhatsApp, SMS, and RCS. If this system goes down, the company's entire collections outreach stops.",
    metrics: [
      { label: "Daily Messages", value: "100K+" },
      { label: "Channels", value: "3" },
      { label: "Avg Latency", value: "<200ms" },
      { label: "Uptime", value: "99.9%" },
    ],
    techStack: ["Python", "FastAPI", "AWS SQS", "MongoDB", "OpenSearch", "REST APIs"],
    architecture: {
      nodes: [
        { label: "API Gateway", type: "service" },
        { label: "SQS Queue", type: "queue" },
        { label: "Message Worker", type: "service" },
        { label: "WhatsApp API", type: "external" },
        { label: "SMS Gateway", type: "external" },
        { label: "MongoDB", type: "db" },
        { label: "Webhook Handler", type: "service" },
        { label: "OpenSearch", type: "db" },
      ],
      flows: [
        "Request → API Gateway → SQS Queue",
        "SQS Queue → Message Worker → Vendor APIs",
        "Webhook → Handler → Status Update → MongoDB",
        "Events → OpenSearch (Analytics)",
      ],
    },
  },
  {
    id: "multi-vendor-dialer",
    number: "02",
    title: "Multi-Vendor Dialer",
    subtitle: "Intelligent call routing engine",
    description:
      "Vendor-agnostic calling platform that replaced 3 separate dialer contracts with one unified system. Reduced telephony costs by 40% while routing 10K+ calls daily with RBI-compliant DND filtering.",
    metrics: [
      { label: "Calls/Day", value: "10K+" },
      { label: "Vendors", value: "3+" },
      { label: "Agents", value: "50+" },
      { label: "Recording", value: "100%" },
    ],
    techStack: ["Python", "FastAPI", "Webhooks", "MongoDB", "Redis", "Docker"],
    architecture: {
      nodes: [
        { label: "Dialer Engine", type: "service" },
        { label: "Vendor Adapter", type: "service" },
        { label: "Call Router", type: "service" },
        { label: "Webhook Receiver", type: "service" },
        { label: "Ozonetel", type: "external" },
        { label: "Redis Cache", type: "db" },
        { label: "MongoDB", type: "db" },
        { label: "Recording Store", type: "db" },
      ],
      flows: [
        "Trigger → Dialer Engine → Vendor Adapter",
        "Adapter → Ozonetel / Other Vendors",
        "Call Events → Webhook Receiver → State Machine",
        "Recordings → S3 Storage",
      ],
    },
  },
  {
    id: "receivable-engine",
    number: "03",
    title: "Receivable Engine",
    subtitle: "Financial transaction processing",
    description:
      "Payment reconciliation system that eliminated 4 FTEs of manual work (80% reduction). Processes NACH mandates, cheque instruments, and bank reversals with 99.99% accuracy and full audit trails.",
    metrics: [
      { label: "Accuracy", value: "99.99%" },
      { label: "Instruments", value: "NACH, Cheque" },
      { label: "Processing", value: "Real-time" },
      { label: "Reduction", value: "80%" },
    ],
    techStack: ["Python", "Django", "PostgreSQL", "AWS SQS", "Celery"],
    architecture: {
      nodes: [
        { label: "Payment Gateway", type: "service" },
        { label: "Validation Engine", type: "service" },
        { label: "NACH Processor", type: "service" },
        { label: "Cheque Handler", type: "service" },
        { label: "PostgreSQL", type: "db" },
        { label: "Bank API", type: "external" },
        { label: "Reversal Worker", type: "service" },
        { label: "Audit Logger", type: "service" },
      ],
      flows: [
        "Instrument → Validation → Type Router",
        "NACH → Bank API → Confirmation → PostgreSQL",
        "Failed → Reversal Worker → Reprocess / Flag",
        "All Events → Audit Logger (immutable)",
      ],
    },
  },
];

const nodeTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  service: { bg: "bg-primary/10", border: "border-primary/40", text: "text-primary" },
  queue: { bg: "bg-accent/10", border: "border-accent/40", text: "text-accent" },
  db: { bg: "bg-neon/10", border: "border-neon/40", text: "text-neon" },
  external: { bg: "bg-gold/10", border: "border-gold/40", text: "text-gold" },
};

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(0);



  // Arrow key navigation for tabs
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveProject((prev) => (prev + 1) % projects.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveProject((prev) => (prev - 1 + projects.length) % projects.length);
      }
    },
    []
  );

  return (
    <section id="projects" ref={sectionRef} className="relative py-section">
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
            03 / Projects
          </span>
          <h2 className="text-display-md font-display font-bold mt-4">
            Projects
          </h2>
        </motion.div>

        {/* Project tabs with scroll fade */}
        <div className="relative mb-12">
          <div
            role="tablist"
            aria-label="Project selector"
            className="flex gap-2 overflow-x-auto pb-2"
            onKeyDown={handleTabKeyDown}
          >
            {projects.map((project, i) => (
              <button
                key={project.id}
                role="tab"
                aria-selected={activeProject === i}
                aria-controls={`panel-${i}`}
                tabIndex={activeProject === i ? 0 : -1}
                onClick={() => setActiveProject(i)}
                data-cursor-hover
                className={`flex items-center gap-3 px-5 py-3 rounded-xl border whitespace-nowrap transition-all duration-300 ${
                  activeProject === i
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-surface/50 border-border/50 text-text-secondary hover:border-border-light"
                }`}
              >
                <span className="text-xs font-mono text-text-secondary">
                  {project.number}
                </span>
                <span className="text-sm font-medium">{project.title}</span>
              </button>
            ))}
          </div>
          {/* Scroll fade indicator for mobile */}
          <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none lg:hidden" />
        </div>

        {/* Active project content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject}
            id={`panel-${activeProject}`}
            role="tabpanel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ProjectCard project={projects[activeProject]} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-8">
      {/* Left: Info */}
      <div className="space-y-6">
        <div>
          <h3 className="text-display-sm font-bold text-text">
            {project.title}
          </h3>
          <p className="text-text-secondary mt-1">{project.subtitle}</p>
        </div>

        <p className="text-body-md text-text-secondary leading-relaxed">
          {project.description}
        </p>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {project.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-4 rounded-xl bg-surface/60 border border-border/30"
            >
              <p className="text-xl font-bold text-primary">{metric.value}</p>
              <p className="text-xs text-text-muted mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full text-xs font-mono bg-surface-light border border-border/50 text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Right: Architecture diagram */}
      <div className="glass rounded-2xl p-6 lg:p-8">
        <h4 className="text-xs font-mono text-primary uppercase tracking-wider mb-6">
          Architecture Diagram
        </h4>

        {/* Nodes */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {project.architecture.nodes.map((node, i) => {
            const style = nodeTypeColors[node.type];
            return (
              <motion.div
                key={node.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 + i * 0.05, type: "spring" }}
                className={`px-3 py-2.5 rounded-lg border ${style.bg} ${style.border}`}
              >
                <span className={`text-xs font-medium ${style.text}`}>
                  {node.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Data flows */}
        <div className="space-y-2">
          <h5 className="text-[10px] font-mono text-text-muted uppercase tracking-wider mb-2">
            Data Flow
          </h5>
          {project.architecture.flows.map((flow, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-2 text-xs font-mono text-text-secondary"
            >
              <span className="text-primary">→</span>
              {flow}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
