"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { ArrowUpRight, Star, GitBranch, Eye } from "lucide-react";
import { cn } from "@/utils/cn";

/* ─── Data ──────────────────────────────────────────────────────────── */
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  language: "Python" | "JavaScript" | "Both";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  stars: number;
  views: string;
  gradient: string;
  accentColor: string;
  emoji: string;
  preview: {
    filename: string;
    lines: Array<{ text: string; color: string }>;
  };
}

const PROJECTS: Project[] = [
  {
    id: "weather",
    title: "Weather Dashboard",
    description: "A live weather app using OpenWeather API with charts, 7-day forecast, and location detection.",
    tags: ["API Integration", "Charts", "Geolocation"],
    language: "JavaScript",
    difficulty: "Beginner",
    stars: 1240,
    views: "18K",
    gradient: "from-[#38BDF8]/15 via-transparent to-transparent",
    accentColor: "#38BDF8",
    emoji: "🌤️",
    preview: {
      filename: "weather.js",
      lines: [
        { text: "const fetchWeather = async (city) => {", color: "#F8FAFC" },
        { text: "  const res = await fetch(`${API}?q=${city}`);", color: "#94A3B8" },
        { text: "  const data = await res.json();", color: "#94A3B8" },
        { text: "  renderDashboard(data);", color: "#22C55E" },
        { text: "};", color: "#F8FAFC" },
      ],
    },
  },
  {
    id: "scraper",
    title: "Web Scraper CLI",
    description: "Production-grade Python scraper with async requests, data cleaning, and CSV/JSON export.",
    tags: ["BeautifulSoup", "asyncio", "Data Export"],
    language: "Python",
    difficulty: "Intermediate",
    stars: 2100,
    views: "32K",
    gradient: "from-[#22C55E]/15 via-transparent to-transparent",
    accentColor: "#22C55E",
    emoji: "🕷️",
    preview: {
      filename: "scraper.py",
      lines: [
        { text: "async def scrape(url: str) -> dict:", color: "#7C5CFF" },
        { text: "    async with aiohttp.ClientSession() as s:", color: "#94A3B8" },
        { text: "        html = await s.get(url)", color: "#FF9966" },
        { text: "        return parse(await html.text())", color: "#22C55E" },
      ],
    },
  },
  {
    id: "rest-api",
    title: "FastAPI REST Backend",
    description: "Auth-ready REST API with JWT, PostgreSQL, migrations, and auto-generated OpenAPI docs.",
    tags: ["FastAPI", "PostgreSQL", "JWT Auth"],
    language: "Python",
    difficulty: "Advanced",
    stars: 3800,
    views: "55K",
    gradient: "from-[#7C5CFF]/15 via-transparent to-transparent",
    accentColor: "#7C5CFF",
    emoji: "⚡",
    preview: {
      filename: "main.py",
      lines: [
        { text: "@app.post('/auth/login')", color: "#FF6B4A" },
        { text: "async def login(user: UserLogin):", color: "#7C5CFF" },
        { text: "    token = create_jwt(user.id)", color: "#94A3B8" },
        { text: "    return {'token': token}", color: "#22C55E" },
      ],
    },
  },
  {
    id: "dashboard",
    title: "Analytics Dashboard",
    description: "Real-time React dashboard with WebSocket data streams, D3 charts, and dark mode.",
    tags: ["React", "WebSockets", "D3.js"],
    language: "JavaScript",
    difficulty: "Advanced",
    stars: 2900,
    views: "41K",
    gradient: "from-[#F59E0B]/15 via-transparent to-transparent",
    accentColor: "#F59E0B",
    emoji: "📊",
    preview: {
      filename: "Dashboard.tsx",
      lines: [
        { text: "const { data } = useWebSocket('/ws/metrics');", color: "#38BDF8" },
        { text: "const chart = useD3((svg) => {", color: "#F8FAFC" },
        { text: "  svg.select('.line').datum(data)", color: "#94A3B8" },
        { text: "      .attr('d', lineGenerator);", color: "#22C55E" },
      ],
    },
  },
  {
    id: "chat",
    title: "AI Chat Interface",
    description: "GPT-powered chat UI with streaming responses, conversation history, and markdown rendering.",
    tags: ["OpenAI API", "Streaming", "Next.js"],
    language: "Both",
    difficulty: "Intermediate",
    stars: 4200,
    views: "67K",
    gradient: "from-[#EC4899]/15 via-transparent to-transparent",
    accentColor: "#EC4899",
    emoji: "🤖",
    preview: {
      filename: "chat.ts",
      lines: [
        { text: "const stream = await openai.chat.completions.create({", color: "#F8FAFC" },
        { text: "  model: 'gpt-4o', stream: true,", color: "#94A3B8" },
        { text: "  messages: history,", color: "#FF9966" },
        { text: "});", color: "#F8FAFC" },
      ],
    },
  },
  {
    id: "devops",
    title: "CI/CD Pipeline",
    description: "Automate testing, Docker builds, and deploy to AWS EC2 via GitHub Actions workflows.",
    tags: ["Docker", "GitHub Actions", "AWS"],
    language: "Both",
    difficulty: "Advanced",
    stars: 1800,
    views: "28K",
    gradient: "from-[#14B8A6]/15 via-transparent to-transparent",
    accentColor: "#14B8A6",
    emoji: "🚀",
    preview: {
      filename: "deploy.yml",
      lines: [
        { text: "jobs:", color: "#7C5CFF" },
        { text: "  deploy:", color: "#F8FAFC" },
        { text: "    runs-on: ubuntu-latest", color: "#94A3B8" },
        { text: "    steps: [build, test, push]", color: "#22C55E" },
      ],
    },
  },
];

const DIFFICULTY_COLORS = {
  Beginner: { bg: "rgba(34,197,94,0.15)", text: "#22C55E", border: "rgba(34,197,94,0.3)" },
  Intermediate: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B", border: "rgba(245,158,11,0.3)" },
  Advanced: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", border: "rgba(239,68,68,0.3)" },
};

const LANG_COLORS = {
  Python: { bg: "rgba(34,197,94,0.1)", text: "#22C55E" },
  JavaScript: { bg: "rgba(245,158,11,0.1)", text: "#F59E0B" },
  Both: { bg: "rgba(124,92,255,0.1)", text: "#A78BFF" },
};

/* ─── Project Card ──────────────────────────────────────────────────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [hovered, setHovered] = useState(false);

  const diff = DIFFICULTY_COLORS[project.difficulty];
  const lang = LANG_COLORS[project.language];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-border-subtle bg-surface transition-all duration-500 hover:border-border-medium hover:-translate-y-1 hover:shadow-2xl"
      style={{
        boxShadow: hovered ? `0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${project.accentColor}20` : undefined,
      }}
    >
      {/* Code preview panel */}
      <div className={cn("relative overflow-hidden bg-gradient-to-br", project.gradient, "p-5 border-b border-white/[0.05]")}>
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at top left, ${project.accentColor}15 0%, transparent 60%)`,
          }}
        />

        {/* Mini chrome bar */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="h-2 w-2 rounded-full bg-[#FF5F57]/70" />
          <div className="h-2 w-2 rounded-full bg-[#FEBC2E]/70" />
          <div className="h-2 w-2 rounded-full bg-[#28C840]/70" />
          <span className="ml-2 text-xs text-white/30 font-mono">{project.preview.filename}</span>
        </div>

        {/* Code lines */}
        <div className="font-mono text-xs leading-6 space-y-0.5">
          {project.preview.lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0.7, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              style={{ color: line.color }}
            >
              {line.text}
            </motion.div>
          ))}
        </div>

        {/* Emoji badge */}
        <div className="absolute top-4 right-4 text-2xl">{project.emoji}</div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}
          >
            {project.difficulty}
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-medium"
            style={{ background: lang.bg, color: lang.text }}
          >
            {project.language}
          </span>
        </div>

        <h3 className="text-base font-bold text-text mb-1.5">{project.title}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4 flex-1">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-xl border border-border-subtle bg-surface/50 px-2.5 py-1 text-xs text-muted">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              {project.stars.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {project.views}
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: `${project.accentColor}15`,
              color: project.accentColor,
              border: `1px solid ${project.accentColor}30`,
            }}
          >
            Build This <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [filter, setFilter] = useState<"All" | "Python" | "JavaScript" | "Both">("All");

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.language === filter || (filter === "Both" && p.language === "Both"));

  return (
    <section id="projects" ref={sectionRef} className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-12 text-center"
        >
          <SectionLabel>Real Projects</SectionLabel>
          <h2 className="text-display mt-4 text-text">
            Build things that{" "}
            <span className="gradient-text-primary">matter</span>
          </h2>
          <p className="mt-4 text-subtitle text-muted max-w-xl mx-auto">
            Every project is portfolio-ready, industry-relevant, and comes with a guided walkthrough and code review.
          </p>
        </motion.div>

        {/* Filter Tabs - scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-8 sm:mb-10 overflow-x-auto px-4"
        >
          <div className="inline-flex items-center gap-1 rounded-2xl border border-border-subtle bg-surface/50 p-1.5 shrink-0">
            {(["All", "Python", "JavaScript", "Both"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  filter === f
                    ? "bg-surface text-text shadow-sm"
                    : "text-muted hover:text-text"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted mb-4">
            50+ more projects across Python, JavaScript, SQL, DevOps, and AI.
          </p>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-border-subtle bg-surface/50 px-6 py-3 text-sm font-semibold text-text/80 transition-all hover:bg-surface hover:text-text hover:border-border-medium">
            <GitBranch className="h-4 w-4" />
            View All Projects
          </button>
        </motion.div>
      </div>
    </section>
  );
}
