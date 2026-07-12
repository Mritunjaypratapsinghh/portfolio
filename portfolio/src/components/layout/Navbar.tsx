"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#tech-stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);

      // Determine active section
      const sections = document.querySelectorAll("section[id]");
      let current = "";
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
          current = `#${section.id}`;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        <motion.nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled
              ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
              : "bg-transparent"
          }`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          aria-label="Main navigation"
        >
          <div className="section-container flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 group"
              aria-label="mritunjay.dev, scroll to top"
              data-cursor-hover
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all duration-300" aria-hidden="true">
                <span className="text-primary font-bold text-sm">M</span>
              </div>
              <span className="text-sm font-mono text-text-secondary group-hover:text-text transition-colors hidden sm:inline">
                mritunjay.dev
              </span>
            </button>

            {/* Navigation Links — Desktop */}
            <div
              className="hidden md:flex items-center gap-1"
              onMouseLeave={() => setHoveredLink(null)}
            >
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  aria-label={`Navigate to ${link.label}`}
                  aria-current={activeSection === link.href ? "true" : undefined}
                  data-cursor-hover
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-lg ${
                    activeSection === link.href
                      ? "text-primary"
                      : "text-text-secondary hover:text-text"
                  }`}
                >
                  {/* Hover pill background */}
                  {hoveredLink === link.href && activeSection !== link.href && (
                    <motion.div
                      layoutId="navHover"
                      className="absolute inset-0 bg-surface-light/50 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}

                  {link.label}

                  {activeSection === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      layoutId="navIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-muted hidden lg:block">
                ⌘K
              </span>
              <button
                onClick={() => scrollTo("#contact")}
                aria-label="Let's Talk — Navigate to Contact section"
                data-cursor-hover
                className="hidden md:block px-4 py-2 text-sm font-medium bg-primary/10 border border-primary/30 text-primary rounded-lg hover:bg-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                Let&apos;s Talk
              </button>

              {/* Hamburger button — mobile only */}
              <button
                className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg border border-border/50 bg-surface/50"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
              >
                <span
                  className={`block w-5 h-0.5 bg-text transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-[3px]" : ""
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-text mt-1 transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-[2px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-md md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed inset-0 z-[70] flex flex-col items-center justify-center md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <nav className="flex flex-col items-center gap-6">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    onClick={() => scrollTo(link.href)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                    aria-label={`Navigate to ${link.label}`}
                    aria-current={activeSection === link.href ? "true" : undefined}
                    className={`text-2xl font-medium transition-colors ${
                      activeSection === link.href
                        ? "text-primary"
                        : "text-text-secondary hover:text-text"
                    }`}
                  >
                    {link.label}
                  </motion.button>
                ))}
                <motion.button
                  onClick={() => scrollTo("#contact")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: navLinks.length * 0.05, duration: 0.3 }}
                  className="mt-4 px-6 py-3 text-lg font-medium bg-primary/10 border border-primary/30 text-primary rounded-lg"
                >
                  Let&apos;s Talk
                </motion.button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
