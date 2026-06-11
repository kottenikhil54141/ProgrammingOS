"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedTerminal from "@/components/terminal/AnimatedTerminal";
import GradientText from "@/components/ui/GradientText";
import { ArrowRight, Play, GitBranch, Star } from "lucide-react";

/* ─── Floating Orbs ────────────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124,92,255,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 0.92, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-48 -right-32 h-[700px] w-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,107,74,0.13) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <motion.div
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[300px] w-[300px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,153,102,0.10) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div className="absolute inset-0 grid-texture opacity-40" />
    </div>
  );
}

/* ─── Typewriter Headline ───────────────────────────────────────────── */
// The full text split into two display lines.
// "Engineer." is the gradient word — rendered separately after plain text.
const LINE1_PLAIN = "Become an ";
const LINE1_GRADIENT = "Engineer.";
const LINE2 = "Not just another learner.";

const FULL_TEXT = LINE1_PLAIN + LINE1_GRADIENT + "\n" + LINE2;
const LINE2_EXTRA_PAUSE = 180; // extra pause before line 2 starts

type TWPhase = "typing" | "hold" | "deleting" | "pause";

const TYPE_SPEED   = 45;   // ms per char forward
const DELETE_SPEED = 22;   // ms per char backward (faster feels natural)
const HOLD_MS      = 2000; // pause at full text before deleting
const PAUSE_MS     = 600;  // pause after fully deleted before restarting

function TypewriterHeadline({ start }: { start: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  const [phase, setPhase] = useState<TWPhase>("typing");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!start) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (phase === "typing") {
      if (displayed < FULL_TEXT.length) {
        const isNewline = FULL_TEXT[displayed] === "\n";
        timerRef.current = setTimeout(
          () => setDisplayed((d) => d + 1),
          isNewline ? LINE2_EXTRA_PAUSE : TYPE_SPEED
        );
      } else {
        timerRef.current = setTimeout(() => setPhase("hold"), HOLD_MS);
      }
    }

    if (phase === "hold") {
      timerRef.current = setTimeout(() => setPhase("deleting"), 0);
    }

    if (phase === "deleting") {
      if (displayed > 0) {
        timerRef.current = setTimeout(
          () => setDisplayed((d) => d - 1),
          DELETE_SPEED
        );
      } else {
        timerRef.current = setTimeout(() => setPhase("pause"), PAUSE_MS);
      }
    }

    if (phase === "pause") {
      timerRef.current = setTimeout(() => setPhase("typing"), 0);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [start, phase, displayed]);

  // Split at newline boundary
  const fullRevealed = FULL_TEXT.slice(0, displayed);
  const newlineIdx   = fullRevealed.indexOf("\n");

  const line1Revealed   = newlineIdx === -1 ? fullRevealed : fullRevealed.slice(0, newlineIdx);
  const line2Revealed   = newlineIdx === -1 ? "" : fullRevealed.slice(newlineIdx + 1);
  const gradientVisible = Math.max(0, Math.min(line1Revealed.length - LINE1_PLAIN.length, LINE1_GRADIENT.length));
  const plainVisible    = Math.min(line1Revealed.length, LINE1_PLAIN.length);
  const cursorOnLine1   = newlineIdx === -1;

  // Cursor color shifts during delete phase
  const cursorColor = phase === "deleting" ? "text-white/30" : "text-[#FF6B4A]";

  return (
    <h1 className="text-hero font-black leading-[1.04] tracking-[-0.03em]">
      {/* Line 1 */}
      <div className="block">
        <span className="text-white">{LINE1_PLAIN.slice(0, plainVisible)}</span>

        {gradientVisible > 0 && (
          <span className="bg-gradient-to-r from-[#FF6B4A] via-[#FF9966] to-[#7C5CFF] bg-clip-text text-transparent">
            {LINE1_GRADIENT.slice(0, gradientVisible)}
          </span>
        )}

        {cursorOnLine1 && (
          <span className={`cursor-blink ml-0.5 ${cursorColor}`}>|</span>
        )}
      </div>

      {/* Line 2 */}
      {line2Revealed.length > 0 && (
        <div className="block mt-1">
          <span className="text-white/25">{line2Revealed}</span>
          {!cursorOnLine1 && (
            <span className={`cursor-blink ml-0.5 ${cursorColor}`}>|</span>
          )}
        </div>
      )}
    </h1>
  );
}

/* ─── Social Proof Strip ───────────────────────────────────────────── */
const AVATARS = [
  { initials: "NK", bg: "from-violet-500 to-purple-600" },
  { initials: "AR", bg: "from-orange-500 to-rose-500" },
  { initials: "PK", bg: "from-sky-500 to-blue-600" },
  { initials: "SR", bg: "from-emerald-500 to-green-600" },
  { initials: "+", bg: "from-slate-600 to-slate-700" },
];

function SocialProof() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {AVATARS.map((a, i) => (
          <div
            key={i}
            className={`h-8 w-8 rounded-full bg-gradient-to-br ${a.bg} ring-2 ring-[#050816] flex items-center justify-center text-[10px] font-bold text-white`}
          >
            {a.initials}
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-xs text-white/50 mt-0.5">
          Trusted by <span className="text-white/80 font-semibold">25,000+</span> developers
        </p>
      </div>
    </div>
  );
}

/* ─── Tech Badges ──────────────────────────────────────────────────── */
const TECH_BADGES = [
  { label: "Python",      emoji: "🐍", color: "border-green-500/25 text-green-300" },
  { label: "JavaScript",  emoji: "⚡", color: "border-yellow-500/25 text-yellow-300" },
  { label: "AI-Powered",  emoji: "🤖", color: "border-violet-500/25 text-violet-300" },
  { label: "Projects",    emoji: "🏗️", color: "border-blue-500/25 text-blue-300" },
];

/* ─── Hero Section ─────────────────────────────────────────────────── */
export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.8 } },
  };

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-32 lg:pt-28"
    >
      <FloatingOrbs />

      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* ── LEFT: Content ── */}
        <div>
          {/* Label pill — fades in immediately */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FF6B4A]/25 bg-[#FF6B4A]/[0.06] px-4 py-2 text-sm text-[#FF6B4A]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#FF6B4A] opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF6B4A]" />
              </span>
              <span className="font-medium">Now in Beta — Join 25K+ Engineers</span>
            </div>
          </motion.div>

          {/* Typewriter headline */}
          <TypewriterHeadline start={isInView} />

          {/* Everything below staggered after typing finishes (~1.6s) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Description */}
            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-lg text-[17px] leading-[1.8] text-white/55"
            >
              Learn{" "}
              <GradientText variant="primary" className="font-semibold">
                Python
              </GradientText>{" "}
              and{" "}
              <GradientText variant="secondary" className="font-semibold">
                JavaScript
              </GradientText>{" "}
              through immersive coding, visual execution, real-world projects, and
              AI-powered guidance — not boring tutorials.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <button className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-7 py-4 font-semibold text-white shadow-[0_8px_32px_rgba(255,107,74,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,107,74,0.45)] active:translate-y-0 active:scale-[0.98]">
                <Play className="h-4 w-4 fill-white" />
                Start Learning Free
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              <button className="inline-flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 font-semibold text-white/80 transition-all duration-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0">
                <GitBranch className="h-4 w-4" />
                Explore Projects
              </button>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeUp} className="mt-10">
              <SocialProof />
            </motion.div>

            {/* Tech Badges */}
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
              {TECH_BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm bg-white/[0.02] ${badge.color}`}
                >
                  {badge.emoji} {badge.label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* ── RIGHT: Terminal ── */}
        <motion.div
          initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
          animate={isInView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[40px] bg-gradient-to-br from-[#7C5CFF]/20 to-[#FF6B4A]/20 blur-2xl opacity-60 -z-10" />
          <AnimatedTerminal />

          {/* Floating stat pills */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -bottom-5 -left-5 glass rounded-2xl px-4 py-3 hidden sm:block"
          >
            <div className="text-[11px] text-white/40 font-mono uppercase tracking-widest">Streak</div>
            <div className="text-lg font-bold text-white mt-0.5">🔥 21 Days</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="absolute -top-5 -right-5 glass rounded-2xl px-4 py-3 hidden sm:block"
          >
            <div className="text-[11px] text-white/40 font-mono uppercase tracking-widest">XP Earned</div>
            <div className="text-lg font-bold text-[#FF6B4A] mt-0.5">+2,450 XP</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}