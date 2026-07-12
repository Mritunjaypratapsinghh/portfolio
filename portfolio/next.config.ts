import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap", "three", "@react-three/fiber"],
  },
};

export default nextConfig;
