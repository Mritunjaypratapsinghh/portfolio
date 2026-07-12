"use client";

export function Footer() {
  return (
    <footer className="relative py-12 overflow-hidden">
      {/* Top shimmer gradient line */}
      <div className="footer-shimmer-line w-full" />

      {/* Subtle particle-like dot pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0, 212, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="section-container relative z-10 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-bold text-xs">M</span>
            </div>
            <span className="text-sm text-text-secondary">
              Designed & Built by{" "}
              <span className="text-text font-medium">Mritunjay Pratap Singh</span>
            </span>
          </div>

          {/* Center */}
          <span className="text-xs text-text-muted font-mono">
            Built with Next.js, Three.js &amp; too much caffeine ☕
          </span>

          {/* Right — social links with hover animations */}
          <div className="flex items-center gap-4">
            {[
              { label: "GitHub", href: "https://github.com/mritunjay-ps" },
              { label: "LinkedIn", href: "https://linkedin.com/in/mritunjay-pratap-singh" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="text-xs text-text-secondary transition-all duration-300 hover:text-primary hover:-translate-y-0.5 hover:drop-shadow-[0_0_6px_rgba(0,212,255,0.5)]"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
