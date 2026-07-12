"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

// Suppress THREE.Clock deprecation warning from @react-three/fiber internals
// This is a known issue: https://github.com/pmndrs/react-three-fiber/issues/3546
if (typeof window !== "undefined") {
  const _origWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock: This module has been deprecated")) return;
    _origWarn.apply(console, args);
  };
}

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 400;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  // Use useRef for mutable velocity data instead of useMemo
  const velocitiesRef = useRef<Float32Array | null>(null);
  if (!velocitiesRef.current) {
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      vel[i] = (Math.random() - 0.5) * 0.02;
    }
    velocitiesRef.current = vel;
  }
  const velocities = velocitiesRef.current;

  // Dispose geometry and material on unmount to prevent WebGL memory leaks
  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        if (meshRef.current.material) {
          (meshRef.current.material as THREE.Material).dispose();
        }
      }
    };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geometry = meshRef.current.geometry;
    const posAttr = geometry.attributes.position;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around boundaries
      if (Math.abs(arr[i * 3]) > 20) velocities[i * 3] *= -1;
      if (Math.abs(arr[i * 3 + 1]) > 20) velocities[i * 3 + 1] *= -1;
      if (Math.abs(arr[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
    }
    posAttr.needsUpdate = true;

    // Subtle rotation
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 8;

  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.5 + 0.3,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const node = nodes[i];
      child.position.y =
        node.position[1] +
        Math.sin(state.clock.elapsedTime * node.speed + node.offset) * 0.5;
      child.position.x =
        node.position[0] +
        Math.cos(state.clock.elapsedTime * node.speed * 0.5 + node.offset) * 0.3;
    });
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position} scale={node.scale}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

function GradientFallback() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 70%)",
      }}
    />
  );
}

export function ParticleBackground() {
  const [supportsWebGL, setSupportsWebGL] = useState<boolean | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    // Mobile detection: small viewport or low-end CPU
    const mobile =
      window.innerWidth < 768 || navigator.hardwareConcurrency <= 4;
    setIsMobile(mobile);

    // WebGL detection
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupportsWebGL(!!gl);
    } catch {
      setSupportsWebGL(false);
    }
  }, []);

  // Don't render anything during SSR / before detection
  if (supportsWebGL === null) return null;

  // On mobile or no WebGL — show lightweight gradient only
  if (isMobile || !supportsWebGL) {
    return <GradientFallback />;
  }

  return (
    <ErrorBoundary fallback={<GradientFallback />}>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        aria-hidden="true"
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true }}
          performance={{ min: 0.5 }}
          style={{ background: "transparent" }}
        >
          <Particles />
          <FloatingNodes />
          <ambientLight intensity={0.1} />
        </Canvas>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
      </div>
    </ErrorBoundary>
  );
}
