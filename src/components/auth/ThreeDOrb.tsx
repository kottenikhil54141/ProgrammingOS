"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   ThreeDOrb — A holographic 3D crystalline orb built with pure SVG + CSS.
   No Three.js. Uses layered ellipses, gradient shading, and CSS @keyframes
   to simulate a volumetric, rotating 3D sphere with orbiting ring + blobs.
───────────────────────────────────────────────────────────────────────── */
export default function ThreeDOrb({ size = 160 }: { size?: number }) {
  const orbRef = useRef<SVGSVGElement>(null);

  return (
    <div
      className="relative select-none flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Outer diffuse glow halo */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,255,0.18) 0%, rgba(255,107,74,0.08) 55%, transparent 75%)",
          filter: "blur(18px)",
          animation: "orbHaloPulse 4s ease-in-out infinite",
        }}
      />

      {/* Orbiting ring (tilted plane in CSS 3D) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          animation: "orbRingRotate 18s linear infinite",
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          viewBox="0 0 160 160"
          width={size}
          height={size}
          style={{ transform: "rotateX(72deg)", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0" />
              <stop offset="30%" stopColor="#7C5CFF" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FF6B4A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse
            cx="80"
            cy="80"
            rx="68"
            ry="68"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="2.5"
            strokeDasharray="80 140"
          />
        </svg>
      </div>

      {/* Second orbiting ring (opposite direction) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          animation: "orbRingRotate 28s linear infinite reverse",
          transformStyle: "preserve-3d",
        }}
      >
        <svg
          viewBox="0 0 160 160"
          width={size}
          height={size}
          style={{ transform: "rotateX(72deg) rotateZ(60deg)", overflow: "visible" }}
        >
          <defs>
            <linearGradient id="ringGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0" />
              <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse
            cx="80"
            cy="80"
            rx="60"
            ry="60"
            fill="none"
            stroke="url(#ringGrad2)"
            strokeWidth="1.5"
            strokeDasharray="50 130"
          />
        </svg>
      </div>

      {/* Main SVG orb */}
      <svg
        ref={orbRef}
        viewBox="0 0 160 160"
        width={size}
        height={size}
        className="relative z-10"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Main sphere gradient — simulates 3D shading */}
          <radialGradient id="sphereBase" cx="35%" cy="30%" r="65%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#C4B5FD" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#7C5CFF" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#4C1D95" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#1e0a3e" stopOpacity="0.95" />
          </radialGradient>

          {/* Specular highlight top-left */}
          <radialGradient id="specularHi" cx="30%" cy="25%" r="40%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="60%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>

          {/* Secondary specular — bottom right */}
          <radialGradient id="specularLo" cx="75%" cy="78%" r="35%">
            <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
          </radialGradient>

          {/* Rim light — edge glow */}
          <radialGradient id="rimLight" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="transparent" stopOpacity="0" />
            <stop offset="85%" stopColor="#7C5CFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0.6" />
          </radialGradient>

          {/* Inner lava blob 1 */}
          <radialGradient id="lava1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF6B4A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
          </radialGradient>

          {/* Inner lava blob 2 */}
          <radialGradient id="lava2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
          </radialGradient>

          {/* Clip to circle */}
          <clipPath id="circleClip">
            <circle cx="80" cy="80" r="62" />
          </clipPath>

          {/* Holographic scan lines filter */}
          <filter id="scanlines" x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0 0.15"
              numOctaves="1"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="grayNoise"
            />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" result="blend" />
            <feComposite in="blend" in2="SourceGraphic" operator="in" />
          </filter>

          {/* Outer glow filter */}
          <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.49  0 0 0 0 0.36  0 0 0 0 1  0 0 0 0.7 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow beneath orb */}
        <ellipse
          cx="80"
          cy="152"
          rx="40"
          ry="6"
          fill="rgba(0,0,0,0.3)"
          filter="url(#outerGlow)"
          style={{ animation: "orbShadow 4s ease-in-out infinite" }}
        />

        {/* Base sphere */}
        <circle
          cx="80"
          cy="80"
          r="62"
          fill="url(#sphereBase)"
          filter="url(#outerGlow)"
        />

        {/* Lava blobs inside (clipped to sphere) */}
        <g clipPath="url(#circleClip)">
          {/* Blob 1 */}
          <ellipse
            cx="80"
            cy="80"
            rx="34"
            ry="28"
            fill="url(#lava1)"
            style={{ animation: "lavaBlob1 8s ease-in-out infinite", transformOrigin: "80px 80px" }}
          />
          {/* Blob 2 */}
          <ellipse
            cx="80"
            cy="80"
            rx="28"
            ry="22"
            fill="url(#lava2)"
            style={{ animation: "lavaBlob2 12s ease-in-out infinite", transformOrigin: "80px 80px" }}
          />
        </g>

        {/* Rim light overlay */}
        <circle cx="80" cy="80" r="62" fill="url(#rimLight)" />

        {/* Specular highlights */}
        <circle cx="80" cy="80" r="62" fill="url(#specularHi)" />
        <circle cx="80" cy="80" r="62" fill="url(#specularLo)" />

        {/* Holographic grid lines (clipped) */}
        <g clipPath="url(#circleClip)" opacity="0.12">
          {[20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140].map((y) => (
            <line
              key={`h${y}`}
              x1="18"
              y1={y}
              x2="142"
              y2={y}
              stroke="#a78bfa"
              strokeWidth="0.5"
            />
          ))}
          {[20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="18"
              x2={x}
              y2="142"
              stroke="#a78bfa"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Center Zap icon */}
        <g style={{ animation: "orbCenterPulse 3s ease-in-out infinite", transformOrigin: "80px 80px" }}>
          <circle cx="80" cy="80" r="18" fill="rgba(124,92,255,0.15)" />
          <circle
            cx="80"
            cy="80"
            r="18"
            fill="none"
            stroke="rgba(124,92,255,0.5)"
            strokeWidth="1"
          />
          {/* Zap bolt */}
          <path
            d="M83 68 L76 82 L81 82 L78 93 L86 78 L81 78 Z"
            fill="white"
            opacity="0.95"
          />
        </g>

        {/* Orbiting dots */}
        <g style={{ animation: "orbDots 6s linear infinite", transformOrigin: "80px 80px" }}>
          <circle cx="80" cy="14" r="3" fill="#7C5CFF" opacity="0.9" />
          <circle cx="80" cy="14" r="5" fill="none" stroke="#7C5CFF" strokeWidth="0.5" opacity="0.4" />
        </g>
        <g style={{ animation: "orbDots 6s linear infinite reverse", transformOrigin: "80px 80px", animationDelay: "3s" }}>
          <circle cx="80" cy="14" r="2.5" fill="#FF6B4A" opacity="0.85" />
        </g>
        <g style={{ animation: "orbDots 10s linear infinite", transformOrigin: "80px 80px", animationDelay: "1.5s" }}>
          <circle cx="80" cy="20" r="2" fill="#06B6D4" opacity="0.8" />
        </g>
      </svg>

      {/* CSS keyframes injected via style tag */}
      <style>{`
        @keyframes orbHaloPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes orbRingRotate {
          from { transform: rotateZ(0deg); }
          to { transform: rotateZ(360deg); }
        }
        @keyframes orbShadow {
          0%, 100% { rx: 40; opacity: 0.3; transform: scaleX(1); }
          50% { rx: 36; opacity: 0.2; transform: scaleX(0.92); }
        }
        @keyframes lavaBlob1 {
          0% { transform: translate(-18px, -10px) rotate(0deg) scaleX(1); }
          25% { transform: translate(12px, -18px) rotate(45deg) scaleX(0.85); }
          50% { transform: translate(16px, 12px) rotate(90deg) scaleX(1.1); }
          75% { transform: translate(-10px, 14px) rotate(135deg) scaleX(0.9); }
          100% { transform: translate(-18px, -10px) rotate(180deg) scaleX(1); }
        }
        @keyframes lavaBlob2 {
          0% { transform: translate(14px, 10px) rotate(0deg); }
          33% { transform: translate(-16px, -8px) rotate(-60deg); }
          66% { transform: translate(6px, -14px) rotate(-120deg); }
          100% { transform: translate(14px, 10px) rotate(-180deg); }
        }
        @keyframes orbCenterPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.85; }
        }
        @keyframes orbDots {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
