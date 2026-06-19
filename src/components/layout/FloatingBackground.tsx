"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function FloatingBackground() {
  const [mounted, setMounted] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  // Springs for mouse positioning (smoother than raw style binding)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 45, stiffness: 120, mass: 1.2 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);

    // Skip tracking mouse moves on mobile/touch screens to avoid redraw jank
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (!supportsHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      // Calculate normalized mouse positions (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;

      // Map to pixel movements (max offset 40px for subtlety)
      mouseX.set(x * 40);
      mouseY.set(y * 40);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div
      ref={bgRef}
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-bg transition-colors duration-300"
      aria-hidden="true"
    >
      {/* Mesh Gradient / Floating Blobs */}
      <motion.div
        style={{ x: springX, y: springY, willChange: "transform" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Blob 1: Orange-Red Ambient Glow */}
        <div
          className="absolute -top-[10%] left-[10%] h-[500px] w-[500px] rounded-full opacity-[0.06] dark:opacity-[0.15] mix-blend-multiply dark:mix-blend-screen blur-[120px]"
          style={{
            background: "radial-gradient(circle, #FF6B4A 0%, rgba(255,107,74,0) 70%)",
            animation: "floatSlow1 28s ease-in-out infinite",
            willChange: "transform",
          }}
        />

        {/* Blob 2: Violet Accent Glow */}
        <div
          className="absolute right-[10%] top-[20%] h-[600px] w-[600px] rounded-full opacity-[0.08] dark:opacity-[0.18] mix-blend-multiply dark:mix-blend-screen blur-[140px]"
          style={{
            background: "radial-gradient(circle, #7C5CFF 0%, rgba(124,92,255,0) 70%)",
            animation: "floatSlow2 35s ease-in-out infinite",
            willChange: "transform",
          }}
        />

        {/* Blob 3: Soft Teal/Blue Secondary Glow */}
        <div
          className="absolute bottom-[10%] left-[25%] h-[550px] w-[550px] rounded-full opacity-[0.05] dark:opacity-[0.12] mix-blend-multiply dark:mix-blend-screen blur-[130px]"
          style={{
            background: "radial-gradient(circle, #14B8A6 0%, rgba(20,184,166,0) 70%)",
            animation: "floatSlow3 42s ease-in-out infinite",
            willChange: "transform",
          }}
        />

        {/* Blob 4: Deep Violet Center Glow */}
        <div
          className="absolute -bottom-[10%] right-[20%] h-[500px] w-[500px] rounded-full opacity-[0.06] dark:opacity-[0.15] mix-blend-multiply dark:mix-blend-screen blur-[120px]"
          style={{
            background: "radial-gradient(circle, #7C5CFF 0%, rgba(124,92,255,0) 70%)",
            animation: "floatSlow1 30s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-texture opacity-[0.25]" />

      {/* Premium Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* floatSlow1/2/3 keyframes are defined in globals.css */}
    </div>
  );
}
