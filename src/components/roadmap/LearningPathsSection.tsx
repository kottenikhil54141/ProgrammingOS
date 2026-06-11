"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { CheckCircle2, Lock, Circle, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface PathNode {
  id: string;
  title: string;
  type: "lesson" | "project" | "quiz" | "milestone";
  status: "complete" | "active" | "locked";
  xp: number;
  duration: string;
}

interface LearningPath {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  glowColor: string;
  borderColor: string;
  totalXP: number;
  weeks: number;
  nodes: PathNode[];
}

/* ─── Data ──────────────────────────────────────────────────────────── */
const PATHS: LearningPath[] = [
  {
    id: "python",
    label: "Python Track",
    title: "Python Engineer",
    description:
      "From variables to deploying Django APIs. Covering data structures, OOP, async, testing, and real-world projects.",
    icon: "🐍",
    color: "from-[#22C55E] to-[#16A34A]",
    glowColor: "rgba(34,197,94,0.15)",
    borderColor: "rgba(34,197,94,0.3)",
    totalXP: 12500,
    weeks: 16,
    nodes: [
      { id: "py-1", title: "Python Foundations", type: "lesson", status: "complete", xp: 500, duration: "3h" },
      { id: "py-2", title: "Data Structures", type: "lesson", status: "complete", xp: 700, duration: "4h" },
      { id: "py-3", title: "Build a CLI Tool", type: "project", status: "active", xp: 1200, duration: "6h" },
      { id: "py-4", title: "OOP Deep Dive", type: "lesson", status: "locked", xp: 800, duration: "5h" },
      { id: "py-5", title: "Foundations Quiz", type: "quiz", status: "locked", xp: 300, duration: "30m" },
      { id: "py-6", title: "APIs with FastAPI", type: "lesson", status: "locked", xp: 1000, duration: "6h" },
      { id: "py-7", title: "Build REST API", type: "project", status: "locked", xp: 2000, duration: "10h" },
      { id: "py-8", title: "Python Engineer 🎓", type: "milestone", status: "locked", xp: 5000, duration: "—" },
    ],
  },
  {
    id: "javascript",
    label: "JavaScript Track",
    title: "JavaScript Engineer",
    description:
      "ES2025, async/await, React, Node.js, and full-stack deployment. Build products, not just scripts.",
    icon: "⚡",
    color: "from-[#F59E0B] to-[#D97706]",
    glowColor: "rgba(245,158,11,0.15)",
    borderColor: "rgba(245,158,11,0.3)",
    totalXP: 14000,
    weeks: 20,
    nodes: [
      { id: "js-1", title: "JS Fundamentals", type: "lesson", status: "complete", xp: 500, duration: "3h" },
      { id: "js-2", title: "Async & Promises", type: "lesson", status: "active", xp: 700, duration: "4h" },
      { id: "js-3", title: "Build a Weather App", type: "project", status: "locked", xp: 1200, duration: "6h" },
      { id: "js-4", title: "React Essentials", type: "lesson", status: "locked", xp: 1000, duration: "8h" },
      { id: "js-5", title: "JS Quiz", type: "quiz", status: "locked", xp: 300, duration: "30m" },
      { id: "js-6", title: "Node.js & Express", type: "lesson", status: "locked", xp: 900, duration: "6h" },
      { id: "js-7", title: "Full-Stack Project", type: "project", status: "locked", xp: 2500, duration: "15h" },
      { id: "js-8", title: "JS Engineer 🎓", type: "milestone", status: "locked", xp: 7000, duration: "—" },
    ],
  },
];

/* ─── Node Icon ─────────────────────────────────────────────────────── */
const TYPE_ICONS: Record<PathNode["type"], string> = {
  lesson: "📚",
  project: "🏗️",
  quiz: "📝",
  milestone: "🎓",
};

function NodeIcon({ node, accentColor }: { node: PathNode; accentColor: string }) {
  if (node.status === "complete")
    return <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: accentColor }} />;
  if (node.status === "locked")
    return <Lock className="h-3.5 w-3.5 shrink-0 text-white/20" />;
  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="h-3.5 w-3.5 shrink-0 rounded-full border-2"
      style={{ borderColor: accentColor, backgroundColor: `${accentColor}30` }}
    />
  );
}

/* ─── Path Card ─────────────────────────────────────────────────────── */
function PathCard({ path, index }: { path: LearningPath; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const completedCount = path.nodes.filter((n) => n.status === "complete").length;
  const progress = (completedCount / path.nodes.length) * 100;

  // extract first color from gradient string e.g. "from-[#22C55E]"
  const accentMatch = path.color.match(/#[0-9A-Fa-f]{6}/);
  const accent = accentMatch ? accentMatch[0] : "#22C55E";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] as const }}
      className="relative overflow-hidden rounded-3xl p-px"
      style={{
        background: `linear-gradient(135deg, ${path.borderColor}, rgba(255,255,255,0.04) 60%)`,
      }}
    >
      <div
        className="relative h-full rounded-3xl overflow-hidden"
        style={{ background: "rgba(8,12,28,0.95)", backdropFilter: "blur(24px)" }}
      >
        {/* Header */}
        <div
          className="px-7 pt-7 pb-5"
          style={{
            background: `linear-gradient(180deg, ${path.glowColor} 0%, transparent 100%)`,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div
                className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono font-semibold uppercase tracking-widest"
                style={{ background: path.glowColor, border: `1px solid ${path.borderColor}`, color: accent }}
              >
                <span>{path.icon}</span>
                {path.label}
              </div>
              <h3 className="text-2xl font-black text-white">{path.title}</h3>
            </div>
            <div className="text-right shrink-0 ml-4">
              <div className="text-xs text-white/35 font-mono">{path.weeks}w track</div>
              <div className="text-sm font-bold mt-0.5" style={{ color: accent }}>
                {path.totalXP.toLocaleString()} XP
              </div>
            </div>
          </div>

          <p className="text-sm text-white/55 leading-relaxed">{path.description}</p>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between text-xs text-white/35 mb-2 font-mono">
              <span>{completedCount}/{path.nodes.length} completed</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={inView ? { width: `${progress}%` } : {}}
                transition={{ duration: 1.2, delay: index * 0.15 + 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${accent}, ${accent}aa)` }}
              />
            </div>
          </div>
        </div>

        {/* Nodes timeline */}
        <div className="px-7 pb-7">
          <div className="relative space-y-0">
            {/* Vertical line */}
            <div className="absolute left-[7px] top-3 bottom-3 w-px bg-white/[0.06]" />

            {path.nodes.map((node, ni) => (
              <div
                key={node.id}
                className={cn(
                  "relative flex items-center gap-4 py-2.5 pl-8 rounded-xl transition-all duration-200",
                  node.status === "active" && "bg-white/[0.03]",
                  node.status === "locked" && "opacity-50"
                )}
              >
                {/* Node dot */}
                <div className="absolute left-0 flex items-center justify-center w-4">
                  <NodeIcon node={node} accentColor={accent} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{TYPE_ICONS[node.type]}</span>
                    <span
                      className={cn(
                        "text-sm font-medium truncate",
                        node.status === "complete" ? "text-white/60 line-through" : "text-white/85",
                        node.status === "active" && "!text-white font-semibold"
                      )}
                    >
                      {node.title}
                    </span>
                    {node.status === "active" && (
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{ background: `${accent}25`, color: accent }}
                      >
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xs text-white/30 font-mono">{node.duration}</div>
                  <div className="text-xs font-semibold" style={{ color: `${accent}90` }}>
                    +{node.xp} XP
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
            style={{
              background: `linear-gradient(135deg, ${accent}30, ${accent}15)`,
              border: `1px solid ${path.borderColor}`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${accent}45, ${accent}25)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = `linear-gradient(135deg, ${accent}30, ${accent}15)`;
            }}
          >
            Continue Path
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export default function LearningPathsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="learn" ref={sectionRef} className="section-pad relative overflow-hidden">
      {/* BG orbs */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] opacity-10 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(34,197,94,0.4) 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div className="pointer-events-none absolute -right-40 bottom-1/3 h-[500px] w-[500px] opacity-10 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-16 text-center"
        >
          <SectionLabel>Learning Paths</SectionLabel>
          <h2 className="text-display mt-4 text-white">
            Your roadmap to{" "}
            <span className="gradient-text-primary">engineering mastery</span>
          </h2>
          <p className="mt-4 text-subtitle text-white/50 max-w-2xl mx-auto">
            No more wondering what to learn next. Follow battle-tested paths built by
            engineers who&apos;ve hired and been hired at top companies.
          </p>
        </motion.div>

        {/* Path Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {PATHS.map((path, i) => (
            <PathCard key={path.id} path={path} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
