"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const TRAIL_LENGTH = 3;
const TRAIL_OPACITIES = [0.4, 0.25, 0.1];

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true); // default true to prevent flash
  const isVisibleRef = useRef(false);
  const position = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    // Add cursor-active class to body
    document.body.classList.add("cursor-active");
    return () => {
      document.body.classList.remove("cursor-active");
    };
  }, [isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      // Update CSS variables for gradient effects
      document.documentElement.style.setProperty(
        "--cursor-x",
        `${e.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--cursor-y",
        `${e.clientY}px`
      );
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      setIsVisible(false);
    };
    const handleMouseEnter = () => {
      isVisibleRef.current = true;
      setIsVisible(true);
    };

    // Detect hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a, button, [data-cursor-hover], input, textarea, select"
        )
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);

    // Animation loop with smooth lerp
    let animationFrame: number;
    const animate = () => {
      position.current.x +=
        (targetPosition.current.x - position.current.x) * 0.15;
      position.current.y +=
        (targetPosition.current.y - position.current.y) * 0.15;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${targetPosition.current.x}px, ${targetPosition.current.y}px)`;
      }

      // Update trail positions — shift each one toward the previous
      for (let i = TRAIL_LENGTH - 1; i >= 0; i--) {
        const leader =
          i === 0 ? position.current : trailPositions.current[i - 1];
        const lerpFactor = 0.12 - i * 0.025; // decreasing responsiveness
        trailPositions.current[i].x +=
          (leader.x - trailPositions.current[i].x) * lerpFactor;
        trailPositions.current[i].y +=
          (leader.y - trailPositions.current[i].y) * lerpFactor;

        const trailEl = trailRefs.current[i];
        if (trailEl) {
          trailEl.style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`;
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animationFrame);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Trail dots — follow with increasing delay */}
      {Array.from({ length: TRAIL_LENGTH }).map((_, i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className={`fixed top-0 left-0 pointer-events-none z-[9996] transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ willChange: "transform" }}
        >
          <div
            className="w-[4px] h-[4px] rounded-full bg-primary -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: TRAIL_OPACITIES[i] }}
          />
        </div>
      ))}

      {/* Outer ring — follows with delay + mix-blend-mode */}
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9998] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform", mixBlendMode: "difference" }}
      >
        <motion.div
          className="rounded-full border"
          animate={{
            width: isHovering ? 56 : isClicking ? 24 : 36,
            height: isHovering ? 56 : isClicking ? 24 : 36,
            borderColor: isHovering
              ? "rgba(0, 212, 255, 0.6)"
              : "rgba(0, 212, 255, 0.3)",
            backgroundColor: isClicking
              ? "rgba(0, 212, 255, 0.1)"
              : "rgba(0, 0, 0, 0)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={{
            transform: "translate(-50%, -50%)",
            boxShadow: isHovering
              ? "0 0 20px rgba(0, 212, 255, 0.3)"
              : "none",
          }}
        />
      </div>

      {/* Inner dot — follows instantly */}
      <div
        ref={cursorDotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="rounded-full bg-primary"
          animate={{
            width: isHovering ? 6 : 4,
            height: isHovering ? 6 : 4,
            opacity: isClicking ? 0 : 1,
          }}
          transition={{ duration: 0.15 }}
          style={{
            transform: "translate(-50%, -50%)",
            boxShadow: "0 0 6px rgba(0, 212, 255, 0.8)",
          }}
        />
      </div>
    </>
  );
}
