"use client";

import { useEffect, useRef } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   AmbientCanvasBackground — Volumetric 3D particle system with:
   - Z-depth illusion (size variance)
   - Crawling connection lines (animated dash offset)
   - Floating code glyphs
   - Starfield base layer
   - Cursor halo / repulsion
───────────────────────────────────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  z: number; // 0 = far, 1 = near — drives radius & speed
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkle: number;
}

interface CodeGlyph {
  x: number;
  y: number;
  text: string;
  alpha: number;
  vx: number;
  vy: number;
  fontSize: number;
}

const CODE_GLYPHS = [
  "{ }",
  "=>",
  "0x",
  "&&",
  "||",
  "fn()",
  "[]",
  "async",
  "?.x",
  "!==",
  "px",
  "rem",
  "AI",
  "</>",
  "//",
  "```",
  "null",
  "true",
];

export default function AmbientCanvasBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 200 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let stars: Star[] = [];
    let glyphs: CodeGlyph[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initAll();
    };

    const initAll = () => {
      initStars();
      initParticles();
      initGlyphs();
    };

    /* ── Stars (tiny background layer) ── */
    const initStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 0.8 + 0.2,
          alpha: Math.random() * 0.4 + 0.1,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };

    /* ── Volumetric Particles ── */
    const initParticles = () => {
      particles = [];
      const isDark = document.documentElement.classList.contains("dark");
      const colors = isDark
        ? [
            "rgba(124, 92, 255, 1)",
            "rgba(255, 107, 74, 1)",
            "rgba(6, 182, 212, 1)",
            "rgba(167, 139, 250, 1)",
          ]
        : [
            "rgba(124, 92, 255, 1)",
            "rgba(255, 107, 74, 1)",
            "rgba(59, 130, 246, 1)",
          ];

      for (let i = 0; i < 80; i++) {
        const z = Math.random(); // 0=far, 1=near
        const radius = 0.8 + z * 2.5; // near particles are bigger
        const speed = 0.1 + z * 0.35; // near particles move faster
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.15 + z * 0.45,
        });
      }
    };

    /* ── Code Glyphs ── */
    const initGlyphs = () => {
      glyphs = [];
      for (let i = 0; i < 14; i++) {
        const fontSize = Math.random() * 8 + 8;
        glyphs.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          text: CODE_GLYPHS[Math.floor(Math.random() * CODE_GLYPHS.length)],
          alpha: Math.random() * 0.12 + 0.05,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.15,
          fontSize,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    resizeCanvas();

    /* ── Main animation loop ── */
    const animate = () => {
      timeRef.current += 0.012;
      const t = timeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isDark = document.documentElement.classList.contains("dark");
      const mouse = mouseRef.current;

      /* ── Draw stars ── */
      for (const star of stars) {
        star.twinkle += 0.015;
        const alpha = star.alpha * (0.7 + 0.3 * Math.sin(star.twinkle));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * (isDark ? 1 : 0.3)})`;
        ctx.fill();
      }

      /* ── Draw code glyphs ── */
      ctx.save();
      for (const glyph of glyphs) {
        glyph.x += glyph.vx;
        glyph.y += glyph.vy;
        if (glyph.x < -40) glyph.x = canvas.width + 20;
        if (glyph.x > canvas.width + 40) glyph.x = -20;
        if (glyph.y < -20) glyph.y = canvas.height + 10;
        if (glyph.y > canvas.height + 20) glyph.y = -10;

        const glyphAlpha = isDark ? glyph.alpha : glyph.alpha * 0.5;
        ctx.font = `600 ${glyph.fontSize}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillStyle = `rgba(167, 139, 250, ${glyphAlpha})`;
        ctx.fillText(glyph.text, glyph.x, glyph.y);
      }
      ctx.restore();

      /* ── Update + draw particles ── */
      const maxConnectDistance = 130;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Move
        p1.x += p1.vx;
        p1.y += p1.vy;

        // Wrap edges
        if (p1.x < 0) p1.x = canvas.width;
        if (p1.x > canvas.width) p1.x = 0;
        if (p1.y < 0) p1.y = canvas.height;
        if (p1.y > canvas.height) p1.y = 0;

        // Mouse interaction — gentle repulsion/attraction by Z depth
        if (mouse.x > -1000) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const dir = p1.z > 0.5 ? 1 : -1; // near particles attract, far repel
            p1.x += (dx / dist) * force * 0.6 * dir;
            p1.y += (dy / dist) * force * 0.6 * dir;
          }
        }

        // Draw particle with Z-based alpha & size
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        const col = p1.color.replace("1)", `${p1.alpha})`);
        ctx.fillStyle = col;
        ctx.fill();

        // Connection lines with animated dash offset (crawling ants)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDistance) {
            // Only connect particles at similar Z depths
            if (Math.abs(p1.z - p2.z) > 0.5) continue;

            const alpha = (1 - dist / maxConnectDistance) * 0.18 * (p1.z + p2.z) / 2;
            ctx.save();
            ctx.setLineDash([4, 6]);
            ctx.lineDashOffset = -t * 8; // animated crawl
            const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            grad.addColorStop(0, p1.color.replace("1)", `${alpha})`));
            grad.addColorStop(1, p2.color.replace("1)", `${alpha})`));
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.8 + p1.z * 0.4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      /* ── Cursor halo glow ── */
      if (mouse.x > -1000) {
        const r = mouse.radius;
        const glowGrad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, r
        );
        glowGrad.addColorStop(0, `rgba(124, 92, 255, ${isDark ? 0.07 : 0.04})`);
        glowGrad.addColorStop(0.5, `rgba(255, 107, 74, ${isDark ? 0.03 : 0.015})`);
        glowGrad.addColorStop(1, "rgba(124, 92, 255, 0)");
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, r, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-20 h-full w-full block"
    />
  );
}
