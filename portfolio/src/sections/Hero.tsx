"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);

  // Magnetic button effect
  const handleMagneticMove = useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxMove = 8;
    const moveX = (x / rect.width) * maxMove * 2;
    const moveY = (y / rect.height) * maxMove * 2;
    btn.style.transform = `translate(${moveX}px, ${moveY}px)`;
  }, []);

  const handleMagneticLeave = useCallback((e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    btn.style.transform = "translate(0px, 0px)";
    btn.style.transition = "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
    setTimeout(() => {
      btn.style.transition = "";
    }, 400);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character stagger animation for first name
      if (firstNameRef.current) {
        const chars = firstNameRef.current.querySelectorAll(".char");
        gsap.fromTo(
          chars,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.out",
            delay: 0.5,
          }
        );
      }

      // Character stagger animation for last name
      if (lastNameRef.current) {
        const chars = lastNameRef.current.querySelectorAll(".char");
        gsap.fromTo(
          chars,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.03,
            ease: "power3.out",
            delay: 0.8,
          }
        );
      }

      // Parallax heading on scroll
      gsap.to(headingRef.current, {
        scale: 0.85,
        opacity: 0,
        y: -100,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Subtitle fade on scroll
      gsap.to(subtitleRef.current, {
        y: -60,
        opacity: 0,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "30% top",
          end: "80% top",
          scrub: 1,
        },
      });

      // Scroll indicator fade out on first 20% scroll
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "20% top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const firstName = "Mritunjay";
  const lastName = "Pratap Singh";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh flex items-center justify-center overflow-hidden"
    >
      {/* Radial gradient accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/8 to-transparent rounded-full blur-3xl" />

      {/* Content */}
      <div className="section-container relative z-10 text-center">
        {/* Pre-heading label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs font-mono text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse" />
            System Online — All Services Operational
          </span>
        </motion.div>

        {/* Main heading */}
        <h1
          ref={headingRef}
          className="text-display-xl font-display font-bold tracking-tight"
        >
          <span ref={firstNameRef} className="block text-text overflow-hidden">
            {firstName.split("").map((char, i) => (
              <span
                key={`fn-${i}`}
                className="char inline-block"
                style={{ opacity: 0 }}
              >
                {char}
              </span>
            ))}
          </span>
          <span ref={lastNameRef} className="block overflow-hidden">
            <span className="gradient-text-animated inline-block">
              {lastName.split("").map((char, i) => (
                <span
                  key={`ln-${i}`}
                  className="char inline-block"
                  style={{ opacity: 0 }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          ref={subtitleRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-6 text-body-lg text-text-secondary max-w-xl mx-auto"
        >
          100K+ messages processed daily. 10K+ calls routed. Zero downtime.
        </motion.p>

        {/* CTA */}
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <button
            onClick={() => {
              const lenis = (window as any).lenis;
              if (lenis) {
                lenis.scrollTo("#about", { duration: 1.2 });
              } else {
                document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
            data-cursor-hover
            className="group relative px-8 py-3.5 bg-primary/10 border border-primary/40 rounded-xl text-primary font-medium overflow-hidden transition-all duration-500 hover:border-primary/70 hover:shadow-glow-md will-change-transform"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

          <a
            href="/mritunjay-resume.pdf"
            target="_blank"
            onMouseMove={handleMagneticMove as any}
            onMouseLeave={handleMagneticLeave as any}
            data-cursor-hover
            className="px-8 py-3.5 border border-border text-text-secondary rounded-xl font-medium hover:border-border-light hover:text-text transition-all duration-300 will-change-transform inline-block"
          >
            Resume
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              Scroll
            </span>
            <div className="w-5 h-8 rounded-full border border-border/60 flex justify-center p-1.5">
              <div className="scroll-dot w-1 h-1 rounded-full bg-primary" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
