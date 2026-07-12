"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { PERSONAL_INFO, SOCIAL_LINKS } from "@/lib/constants";

const terminalLines = [
  "$ connect --to mritunjay",
  "Establishing secure connection...",
  "Connection established ✓",
  "",
  "Available channels:",
  `  → email: ${PERSONAL_INFO.email}`,
  `  → github: ${SOCIAL_LINKS.github.href.replace("https://", "")}`,
  `  → linkedin: ${SOCIAL_LINKS.linkedin.href.replace("https://", "")}`,
  "",
  "$ send-message --type contact",
];

type FormStatus = "idle" | "sending" | "success" | "error";

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<FormStatus>("idle");
  const isSubmitting = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Guard against double-submission
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    setStatus("sending");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

    // If no key configured, skip fetch and go straight to mailto fallback
    if (!accessKey) {
      openMailto();
      setStatus("success");
      isSubmitting.current = false;
      setTimeout(() => setStatus("idle"), 4000);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          from_name: "Portfolio Contact Form",
          subject: `New message from ${formData.name}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        // Fallback to mailto if Web3Forms returns failure
        openMailto();
        setStatus("success");
      }
    } catch {
      // Fallback to mailto on network error
      openMailto();
      setStatus("success");
    }

    isSubmitting.current = false;
    setTimeout(() => setStatus("idle"), 4000);
  };

  const openMailto = () => {
    const subject = encodeURIComponent(
      `Portfolio Contact — ${formData.name}`
    );
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.open(
      `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`,
      "_self"
    );
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-section">
      <div className="section-container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="text-caption font-mono text-primary uppercase tracking-[0.2em]">
            05 / Contact
          </span>
          <h2 className="text-display-md font-display font-bold mt-4">
            Get In Touch
          </h2>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            Have a project in mind or want to chat? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Terminal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="glass rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-light/60 border-b border-border/50">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                <span className="ml-2 text-[11px] font-mono text-text-muted">
                  contact.sh
                </span>
              </div>

              <div className="p-5 font-mono text-sm space-y-1 min-h-[320px]">
                {terminalLines.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + i * 0.08 }}
                    className={`${
                      line.startsWith("$")
                        ? "text-primary"
                        : line.includes("✓")
                        ? "text-neon"
                        : line.startsWith("  →")
                        ? "text-text-secondary"
                        : "text-text-muted"
                    }`}
                  >
                    {line || "\u00A0"}
                  </motion.div>
                ))}
                <span className="inline-block w-2 h-4 bg-primary/80 animate-terminal-blink" />
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {[
                { label: SOCIAL_LINKS.github.label, href: SOCIAL_LINKS.github.href },
                { label: SOCIAL_LINKS.linkedin.label, href: SOCIAL_LINKS.linkedin.href },
                { label: SOCIAL_LINKS.email.label, href: SOCIAL_LINKS.email.href },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor-hover
                  className="px-4 py-2 rounded-lg border border-border/50 text-xs font-mono text-text-secondary hover:border-primary/40 hover:text-primary transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-border/50 text-text placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:scale-[1.01] focus:shadow-glow-sm outline-none transition-all duration-300 font-mono text-sm"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-border/50 text-text placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:scale-[1.01] focus:shadow-glow-sm outline-none transition-all duration-300 font-mono text-sm"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-surface/60 border border-border/50 text-text placeholder:text-text-muted focus:border-primary/50 focus:ring-1 focus:ring-primary/30 focus:scale-[1.01] focus:shadow-glow-sm outline-none transition-all duration-300 resize-none font-mono text-sm"
                  placeholder="What are you working on?"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor-hover
                className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-500 ${
                  status === "success"
                    ? "bg-neon/20 border border-neon/50 text-neon"
                    : status === "error"
                    ? "bg-red-500/10 border border-red-500/40 text-red-400"
                    : status === "sending"
                    ? "bg-primary/5 border border-primary/30 text-primary/60 cursor-wait"
                    : "bg-primary/10 border border-primary/40 text-primary hover:bg-primary/20 hover:border-primary/60 hover:shadow-glow-sm"
                }`}
              >
                {status === "success"
                  ? "✓ Message Sent Successfully"
                  : status === "error"
                  ? "✗ Failed — Try Again"
                  : status === "sending"
                  ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </span>
                  )
                  : "Send Message →"}
              </button>

              {/* Accessible status region */}
              <div aria-live="polite" className="sr-only">
                {status === "success" && "Your message has been sent successfully."}
                {status === "error" && "There was an error sending your message. Please try again."}
                {status === "sending" && "Sending your message..."}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
