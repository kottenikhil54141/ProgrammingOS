"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import {
  Zap,
  Brain,
  Trophy,
  Code2,
  GitBranch,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";

/* ─── Data ──────────────────────────────────────────────────────────── */
interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
  color: string;
  glowColor: string;
  borderColor: string;
  details: string[];
}

const FEATURES: Feature[] = [
  {
    icon: Code2,
    title: "Live Code Execution",
    description:
      "Write Python or JavaScript directly in the browser. Real interpreter, real output, zero setup.",
    tag: "Core",
    color: "from-[#FF6B4A] to-[#FF9966]",
    glowColor: "rgba(255,107,74,0.2)",
    borderColor: "rgba(255,107,74,0.25)",
    details: [
      "Python 3.12 runtime",
      "JavaScript ES2025",
      "Error highlighting",
      "Auto-save",
    ],
  },
  {
    icon: Brain,
    title: "AI-Powered Tutor",
    description:
      "An AI that explains your bugs, suggests fixes, and adapts explanations to your current skill level.",
    tag: "AI",
    color: "from-[#7C5CFF] to-[#A78BFF]",
    glowColor: "rgba(124,92,255,0.2)",
    borderColor: "rgba(124,92,255,0.25)",
    details: [
      "Context-aware hints",
      "Socratic questioning",
      "Code review mode",
      "Natural language Q&A",
    ],
  },
  {
    icon: Trophy,
    title: "XP & Streak System",
    description:
      "Earn XP for every challenge completed. Maintain streaks. Unlock levels. Stay motivated.",
    tag: "Gamification",
    color: "from-[#F59E0B] to-[#FCD34D]",
    glowColor: "rgba(245,158,11,0.2)",
    borderColor: "rgba(245,158,11,0.25)",
    details: [
      "Daily streak tracking",
      "XP & level system",
      "Leaderboards",
      "Achievement badges",
    ],
  },
  {
    icon: Zap,
    title: "Project-Based Learning",
    description:
      "Skip isolated tutorials. Build real apps — a web scraper, a REST API, a data dashboard.",
    tag: "Projects",
    color: "from-[#22C55E] to-[#4ADE80]",
    glowColor: "rgba(34,197,94,0.2)",
    borderColor: "rgba(34,197,94,0.25)",
    details: [
      "Guided project tracks",
      "Version controlled",
      "Portfolio-ready",
      "Industry relevant",
    ],
  },
  {
    icon: BarChart3,
    title: "Visual Execution",
    description:
      "Watch your code execute step-by-step. See variables mutate, loops iterate, functions call.",
    tag: "Visual",
    color: "from-[#38BDF8] to-[#818CF8]",
    glowColor: "rgba(56,189,248,0.2)",
    borderColor: "rgba(56,189,248,0.25)",
    details: [
      "Call stack visualizer",
      "Variable inspector",
      "Memory view",
      "Step debugger",
    ],
  },
  {
    icon: GitBranch,
    title: "Structured Roadmaps",
    description:
      "Curated learning paths from zero to deployment-ready. No guessing what to learn next.",
    tag: "Roadmap",
    color: "from-[#EC4899] to-[#F472B6]",
    glowColor: "rgba(236,72,153,0.2)",
    borderColor: "rgba(236,72,153,0.25)",
    details: [
      "Beginner → Advanced",
      "Topic dependencies",
      "Progress tracking",
      "Certificate on completion",
    ],
  },
];

/* ─── Feature Card ──────────────────────────────────────────────────── */
function FeatureCard({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: index * 0.09,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative overflow-hidden rounded-3xl p-px cursor-default"
      style={{
        background: hovered
          ? `linear-gradient(135deg, ${feature.borderColor}, rgba(255,255,255,0.05) 60%)`
          : `linear-gradient(135deg, rgba(255,255,255,0.05), transparent)`,
        transition: "background 0.4s ease",
      }}
    >
      <div
        className="relative h-full rounded-3xl p-7 transition-all duration-500"
        style={{
          background: hovered
            ? `linear-gradient(145deg, ${feature.glowColor} 0%, rgba(5,8,22,0.92) 60%)`
            : "rgba(11,16,32,0.6)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Ambient glow blob */}
        <motion.div
          animate={{ opacity: hovered ? 0.7 : 0, scale: hovered ? 1 : 0.8 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full"
          style={{
            background: `radial-gradient(circle, ${feature.glowColor} 0%, transparent 70%)`,
            filter: "blur(24px)",
          }}
        />

        {/* Tag */}
        <div className="mb-5 flex items-center justify-between">
          <div
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${feature.glowColor}, rgba(0,0,0,0.2))`,
              border: `1px solid ${feature.borderColor}`,
            }}
          >
            <Icon
              className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
              style={{
                color: `hsl(from ${feature.glowColor} h s l)`,
                filter: `drop-shadow(0 0 6px ${feature.glowColor})`,
              }}
            />
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold font-mono tracking-wide"
            style={{
              background: `${feature.glowColor}`,
              border: `1px solid ${feature.borderColor}`,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {feature.tag}
          </span>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
        <p className="text-sm text-white/55 leading-relaxed mb-5">{feature.description}</p>

        {/* Detail pills */}
        <div className="flex flex-wrap gap-1.5">
          {feature.details.map((d) => (
            <span
              key={d}
              className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-xs text-white/45"
            >
              {d}
            </span>
          ))}
        </div>

        {/* Bottom gradient line */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
          className="absolute bottom-0 left-0 h-px w-full origin-left"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.borderColor}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="section-pad relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[800px] opacity-20"
        style={{
          background: "radial-gradient(ellipse, rgba(124,92,255,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-16 text-center"
        >
          <SectionLabel>Platform Features</SectionLabel>
          <h2 className="text-display mt-4 text-white">
            Everything you need to{" "}
            <span className="gradient-text-secondary">go from zero to hired</span>
          </h2>
          <p className="mt-4 text-subtitle text-white/50 max-w-2xl mx-auto">
            NIK's AI is not a video course. It&apos;s an interactive operating
            system for learning to code — live execution, AI tutoring, projects,
            and progress tracking all in one.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
