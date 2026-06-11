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

    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      // Calculate normalized mouse positions (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;

      // Map to pixel movements (max offset 60px)
      mouseX.set(x * 60);
      mouseY.set(y * 60);
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
      className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-[#050816]"
      aria-hidden="true"
    >
      {/* Mesh Gradient / Floating Blobs */}
      <motion.div
        style={{ x: springX, y: springY }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {/* Blob 1: Orange-Red Ambient Glow */}
        <div
          className="absolute -top-[10%] left-[10%] h-[500px] w-[500px] rounded-full opacity-[0.15] mix-blend-screen blur-[120px]"
          style={{
            background: "radial-gradient(circle, #FF6B4A 0%, rgba(255,107,74,0) 70%)",
            animation: "floatSlow1 28s ease-in-out infinite",
          }}
        />

        {/* Blob 2: Violet Accent Glow */}
        <div
          className="absolute right-[10%] top-[20%] h-[600px] w-[600px] rounded-full opacity-[0.18] mix-blend-screen blur-[140px]"
          style={{
            background: "radial-gradient(circle, #7C5CFF 0%, rgba(124,92,255,0) 70%)",
            animation: "floatSlow2 35s ease-in-out infinite",
          }}
        />

        {/* Blob 3: Soft Teal/Blue Secondary Glow */}
        <div
          className="absolute bottom-[10%] left-[25%] h-[550px] w-[550px] rounded-full opacity-[0.12] mix-blend-screen blur-[130px]"
          style={{
            background: "radial-gradient(circle, #14B8A6 0%, rgba(20,184,166,0) 70%)",
            animation: "floatSlow3 42s ease-in-out infinite",
          }}
        />

        {/* Blob 4: Deep Violet Center Glow */}
        <div
          className="absolute -bottom-[10%] right-[20%] h-[500px] w-[500px] rounded-full opacity-[0.15] mix-blend-screen blur-[120px]"
          style={{
            background: "radial-gradient(circle, #7C5CFF 0%, rgba(124,92,255,0) 70%)",
            animation: "floatSlow1 30s ease-in-out infinite alternate",
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

      {/* Local floating blob animations */}
      <style jsx global>{`
        @keyframes floatSlow1 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(40px, 60px) scale(1.1); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translate(0px, 0px) scale(1.05); }
          50% { transform: translate(-50px, -40px) scale(0.95); }
        }
        @keyframes floatSlow3 {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -50px) scale(1.08); }
        }
      `}</style>
    </div>
  );
}
