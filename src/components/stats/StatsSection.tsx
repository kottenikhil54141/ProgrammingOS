"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import SectionLabel from "@/components/ui/SectionLabel";

/* ─── Data ──────────────────────────────────────────────────────────── */
const STATS = [
  {
    value: 25000,
    suffix: "+",
    label: "Active Engineers",
    description: "Learning Python & JavaScript daily",
    icon: "👩‍💻",
    gradient: "from-[#FF6B4A]/20 to-[#FF9966]/5",
    glow: "rgba(255,107,74,0.15)",
    border: "rgba(255,107,74,0.2)",
  },
  {
    value: 500,
    suffix: "+",
    label: "Coding Challenges",
    description: "From beginner to senior level",
    icon: "🧩",
    gradient: "from-[#7C5CFF]/20 to-[#A78BFF]/5",
    glow: "rgba(124,92,255,0.15)",
    border: "rgba(124,92,255,0.2)",
  },
  {
    value: 98,
    suffix: "%",
    label: "Completion Rate",
    description: "Students who finish their path",
    icon: "🎯",
    gradient: "from-[#22C55E]/20 to-[#4ADE80]/5",
    glow: "rgba(34,197,94,0.15)",
    border: "rgba(34,197,94,0.2)",
  },
  {
    value: 4.9,
    suffix: "/5",
    label: "Platform Rating",
    description: "Rated by verified learners",
    icon: "⭐",
    gradient: "from-[#F59E0B]/20 to-[#FCD34D]/5",
    glow: "rgba(245,158,11,0.15)",
    border: "rgba(245,158,11,0.2)",
    decimals: 1,
  },
];

const TECH_LOGOS = [
  { name: "Python", emoji: "🐍", color: "#22C55E" },
  { name: "JavaScript", emoji: "⚡", color: "#F59E0B" },
  { name: "TypeScript", emoji: "📘", color: "#3B82F6" },
  { name: "React", emoji: "⚛️", color: "#38BDF8" },
  { name: "Node.js", emoji: "🟢", color: "#22C55E" },
  { name: "Django", emoji: "🎸", color: "#65A30D" },
  { name: "FastAPI", emoji: "⚡", color: "#14B8A6" },
  { name: "PostgreSQL", emoji: "🐘", color: "#60A5FA" },
  { name: "Docker", emoji: "🐳", color: "#38BDF8" },
  { name: "Git", emoji: "🌿", color: "#F97316" },
  { name: "Linux", emoji: "🐧", color: "#94A3B8" },
  { name: "AWS", emoji: "☁️", color: "#F59E0B" },
];

/* ─── Stat Card ─────────────────────────────────────────────────────── */
function StatCard({
  stat,
  index,
}: {
  stat: (typeof STATS)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] as const }}
      className="group relative overflow-hidden rounded-3xl p-px"
      style={{ background: `linear-gradient(135deg, ${stat.border}, transparent 60%)` }}
    >
      {/* Inner card */}
      <div
        className="relative h-full rounded-3xl p-7 backdrop-blur-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${stat.glow} 0%, rgba(5,8,22,0.8) 100%)`,
        }}
      >
        {/* Radial ambient */}
        <div
          className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full opacity-40 transition-opacity duration-500 group-hover:opacity-70"
          style={{
            background: `radial-gradient(circle, ${stat.glow} 0%, transparent 70%)`,
            filter: "blur(20px)",
          }}
        />

        {/* Icon */}
        <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
          style={{ background: `linear-gradient(135deg, ${stat.gradient.replace("from-", "").replace("to-", "")})`, border: `1px solid ${stat.border}` }}>
          {stat.icon}
        </div>

        {/* Number */}
        <div className="text-4xl font-black tracking-tight text-white tabular-nums">
          <CountUp
            end={stat.value}
            duration={2200}
            suffix={stat.suffix}
            decimals={stat.decimals ?? 0}
          />
        </div>

        {/* Label */}
        <div className="mt-1.5 text-base font-semibold text-white/90">{stat.label}</div>
        <div className="mt-1 text-sm text-white/45 leading-relaxed">{stat.description}</div>

        {/* Bottom shimmer line */}
        <div
          className="absolute bottom-0 left-0 h-px w-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(90deg, transparent, ${stat.border}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Marquee Strip ─────────────────────────────────────────────────── */
function TechMarquee() {
  const logos = [...TECH_LOGOS, ...TECH_LOGOS]; // duplicate for seamless loop

  return (
    <div className="relative overflow-hidden py-4">
      {/* Fade masks */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#050816] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#050816] to-transparent" />

      <div className="flex marquee-track-left">
        {logos.map((logo, i) => (
          <div
            key={i}
            className="mx-3 flex shrink-0 items-center gap-2.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-5 py-3 backdrop-blur-sm transition-all duration-300 hover:border-white/15 hover:bg-white/[0.06]"
          >
            <span className="text-lg">{logo.emoji}</span>
            <span className="text-sm font-medium text-white/60">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="section-pad relative overflow-hidden">
      {/* Subtle mid-page glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-16 text-center"
        >
          <SectionLabel>Trusted Globally</SectionLabel>
          <h2 className="text-display mt-4 text-white">
            Numbers that{" "}
            <span className="gradient-text-primary">speak louder</span>
          </h2>
          <p className="mt-4 text-subtitle text-white/50 max-w-xl mx-auto">
            Join a community of engineers who chose substance over shortcuts.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Tech marquee */}
        <div className="mt-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="mb-6 text-center text-xs font-mono uppercase tracking-widest text-white/25"
          >
            Technologies you'll master
          </motion.p>
          <TechMarquee />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
    </section>
  );
}
