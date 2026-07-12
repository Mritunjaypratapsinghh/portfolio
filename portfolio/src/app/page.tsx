"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { HeroSection } from "@/sections/Hero";
import { AboutSection } from "@/sections/About";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

// Dynamic imports for below-fold sections (reduces initial bundle)
const ParticleBackground = dynamic(
  () =>
    import("@/components/three/ParticleBackground").then(
      (m) => m.ParticleBackground
    ),
  { ssr: false }
);

const TechStackSection = dynamic(
  () => import("@/sections/TechStack").then((m) => m.TechStackSection),
  { ssr: false }
);

const ProjectsSection = dynamic(
  () => import("@/sections/Projects").then((m) => m.ProjectsSection),
  { ssr: false }
);

const ExperienceSection = dynamic(
  () => import("@/sections/Experience").then((m) => m.ExperienceSection),
  { ssr: false }
);

const AchievementsSection = dynamic(
  () => import("@/sections/Achievements").then((m) => m.AchievementsSection),
  { ssr: false }
);

const ContactSection = dynamic(
  () => import("@/sections/Contact").then((m) => m.ContactSection),
  { ssr: false }
);

// Dynamically import command palette to reduce initial bundle
const CommandPalette = dynamic(
  () => import("@/components/ui/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false }
);

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(!prefersReducedMotion);
  const [showContent, setShowContent] = useState(!!prefersReducedMotion);

  useEffect(() => {
    // Prevent scroll during loading
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <>
      <CustomCursor />
      <CommandPalette />

      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <div
        className={`transition-opacity duration-1000 ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
      >
        <SmoothScroll>
          <ParticleBackground />
          <Navbar />
          <ScrollProgress />
          <main id="main-content">
            <HeroSection />

            {/* Section divider + ambient glow */}
            <div className="relative">
              <div className="section-divider" />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse, rgba(0, 212, 255, 0.04), transparent 70%)",
                  filter: "blur(60px)",
                }}
              />
            </div>

            <AboutSection />

            {/* Section divider + ambient glow */}
            <div className="relative">
              <div className="section-divider" />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse, rgba(123, 97, 255, 0.04), transparent 70%)",
                  filter: "blur(60px)",
                }}
              />
            </div>

            <TechStackSection />

            {/* Section divider + ambient glow */}
            <div className="relative">
              <div className="section-divider" />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse, rgba(0, 255, 136, 0.03), transparent 70%)",
                  filter: "blur(60px)",
                }}
              />
            </div>

            <ProjectsSection />

            {/* Section divider + ambient glow */}
            <div className="relative">
              <div className="section-divider" />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse, rgba(0, 212, 255, 0.03), rgba(123, 97, 255, 0.02), transparent 70%)",
                  filter: "blur(60px)",
                }}
              />
            </div>

            <ExperienceSection />

            {/* Section divider + ambient glow */}
            <div className="relative">
              <div className="section-divider" />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse, rgba(255, 215, 0, 0.03), transparent 70%)",
                  filter: "blur(60px)",
                }}
              />
            </div>

            <AchievementsSection />

            {/* Section divider + ambient glow */}
            <div className="relative">
              <div className="section-divider" />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none -z-10"
                style={{
                  background: "radial-gradient(ellipse, rgba(0, 212, 255, 0.04), rgba(0, 255, 136, 0.02), transparent 70%)",
                  filter: "blur(60px)",
                }}
              />
            </div>

            <ContactSection />
          </main>
          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}
