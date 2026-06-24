"use client";

import { useState, useEffect, useRef } from "react";
import { Activity, TrendingUp, Zap } from "lucide-react";
import { PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgress } from "@/services/javascriptProgress";
import { PYTHON_CURRICULUM } from "@/services/pythonCurriculum";
import { JAVASCRIPT_CURRICULUM } from "@/services/javascriptCurriculum";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";

interface SkillRadarWidgetProps {
  pythonProgress: PythonProgress | null;
  jsProgress: JavaScriptProgress | null;
}

export default function SkillRadarWidget({ pythonProgress, jsProgress }: SkillRadarWidgetProps) {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [mouseInteractions, setMouseInteractions] = useState(0);
  const [keyInteractions, setKeyInteractions] = useState(0);
  const inactivityRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(Date.now());

  // Track user activity to show live mode
  useEffect(() => {
    if (typeof window === "undefined") return;

    const activate = () => {
      setIsActive(true);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      inactivityRef.current = setTimeout(() => setIsActive(false), 8000);
    };

    const handleMouseMove = () => {
      setMouseInteractions((m) => m + 1);
      activate();
    };
    const handleKeyDown = () => {
      setKeyInteractions((k) => k + 1);
      activate();
    };
    const handleCodeExec = () => {
      activate();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("code-executed", handleCodeExec);

    // Session timer
    const timer = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("code-executed", handleCodeExec);
      clearInterval(timer);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
    };
  }, []);

  // Pulse animation loop
  useEffect(() => {
    if (!isActive) return;
    let id: number;
    const tick = () => {
      setPulse((p) => (p + 0.08) % (Math.PI * 2));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [isActive]);

  // ── Skill calculations ────────────────────────────────────────────────
  const totalPython = PYTHON_CURRICULUM.length;
  const completedPython = pythonProgress?.completedTopics.length || 0;

  const totalJS = JAVASCRIPT_CURRICULUM.length;
  const completedJS = jsProgress?.completedTopics.length || 0;

  // OOP
  const completedOop =
    PYTHON_CURRICULUM.filter((t) => t.type === "oop" && pythonProgress?.completedTopics.includes(t.id)).length +
    JAVASCRIPT_CURRICULUM.filter((t) => t.type === "oop" && jsProgress?.completedTopics.includes(t.id)).length;
  const totalOop =
    PYTHON_CURRICULUM.filter((t) => t.type === "oop").length +
    JAVASCRIPT_CURRICULUM.filter((t) => t.type === "oop").length || 1;

  // Algorithms
  const completedAlgo =
    PYTHON_CURRICULUM.filter((t) => (t.type === "structures" || t.type === "logic") && pythonProgress?.completedTopics.includes(t.id)).length +
    JAVASCRIPT_CURRICULUM.filter((t) => t.type === "logic" && jsProgress?.completedTopics.includes(t.id)).length;
  const totalAlgo =
    PYTHON_CURRICULUM.filter((t) => t.type === "structures" || t.type === "logic").length +
    JAVASCRIPT_CURRICULUM.filter((t) => t.type === "logic").length || 1;

  // Async / System
  const completedAsync =
    PYTHON_CURRICULUM.filter((t) => (t.type === "advanced" || t.id === "py_files") && pythonProgress?.completedTopics.includes(t.id)).length +
    JAVASCRIPT_CURRICULUM.filter((t) => (t.type === "async" || t.type === "browser") && jsProgress?.completedTopics.includes(t.id)).length;
  const totalAsync =
    PYTHON_CURRICULUM.filter((t) => t.type === "advanced" || t.id === "py_files").length +
    JAVASCRIPT_CURRICULUM.filter((t) => t.type === "async" || t.type === "browser").length || 1;

  // Fundamentals
  const completedFund =
    PYTHON_CURRICULUM.filter((t) => t.type === "basics" && pythonProgress?.completedTopics.includes(t.id)).length +
    JAVASCRIPT_CURRICULUM.filter((t) => t.type === "basics" && jsProgress?.completedTopics.includes(t.id)).length;
  const totalFund =
    PYTHON_CURRICULUM.filter((t) => t.type === "basics").length +
    JAVASCRIPT_CURRICULUM.filter((t) => t.type === "basics").length || 1;

  // Session boost – small live boost based on session interaction
  const interactionBoost = Math.min(15, Math.floor((mouseInteractions + keyInteractions * 3) / 50));

  const categories = [
    { name: "Python", val: totalPython > 0 ? Math.round((completedPython / totalPython) * 100) : 0, color: "#22C55E", angle: 0 },
    { name: "JS", val: totalJS > 0 ? Math.round((completedJS / totalJS) * 100) : 0, color: "#F59E0B", angle: 60 },
    { name: "OOP", val: Math.round((completedOop / totalOop) * 100), color: "#7C5CFF", angle: 120 },
    { name: "Algo", val: Math.round((completedAlgo / totalAlgo) * 100), color: "#06B6D4", angle: 180 },
    { name: "Async", val: Math.round((completedAsync / totalAsync) * 100), color: "#FF6B4A", angle: 240 },
    { name: "Basics", val: Math.round((completedFund / totalFund) * 100), color: "#A78BFF", angle: 300 },
  ];

  // ── SVG Helpers ───────────────────────────────────────────────────────
  const cx = 110;
  const cy = 110;
  const maxR = 80;

  function polar(angleDeg: number, val: number) {
    const r = (Math.max(4, val) / 100) * maxR;
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function toPoint(angleDeg: number, val: number) {
    const { x, y } = polar(angleDeg, val);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }

  // Live polygon – animated boost when active
  const livePoints = categories.map((c) => {
    const liveVal = isActive ? Math.min(100, c.val + interactionBoost + Math.sin(pulse + c.angle) * 3) : c.val;
    return toPoint(c.angle, liveVal);
  }).join(" ");

  // Baseline polygon (30% fallback for empty)
  const basePoints = categories.map((c) => toPoint(c.angle, Math.max(8, c.val))).join(" ");

  // Concentric ring levels
  const rings = [20, 40, 60, 80, 100];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 backdrop-blur-2xl p-5 flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {isActive ? (
              <Activity className="h-5 w-5 text-emerald-400" />
            ) : (
              <TrendingUp className="h-5 w-5 text-[#7C5CFF]" />
            )}
          </motion.div>
          <h2 className="text-sm font-bold text-text tracking-tight">Skill Radar</h2>
        </div>

        <div className="flex items-center gap-2">
          {isActive && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE
            </motion.span>
          )}
          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors duration-300 ${
            isActive
              ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
              : "text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 border-border-subtle"
          }`}>
            {isActive ? "TRACKING" : "IDLE"}
          </span>
        </div>
      </div>

      {/* Radar SVG */}
      <div className="flex justify-center items-center">
        <svg className="w-full max-w-[220px] h-auto" viewBox="0 0 220 220">
          <defs>
            <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0.08" />
            </radialGradient>
            <filter id="radarGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric rings */}
          {rings.map((level) => (
            <polygon
              key={level}
              points={categories.map((c) => toPoint(c.angle, level)).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border-subtle/30"
            />
          ))}

          {/* Spokes */}
          {categories.map((c) => {
            const end = polar(c.angle, 100);
            return (
              <line
                key={c.angle}
                x1={cx}
                y1={cy}
                x2={end.x.toFixed(2)}
                y2={end.y.toFixed(2)}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border-subtle/30"
              />
            );
          })}

          {/* Baseline (static) fill */}
          <polygon
            points={basePoints}
            fill="url(#radarFill)"
            stroke="#7C5CFF"
            strokeWidth="1"
            opacity="0.5"
          />

          {/* Live animated fill (visible when active) */}
          {isActive && (
            <motion.polygon
              points={livePoints}
              fill="url(#radarFill)"
              stroke="#22C55E"
              strokeWidth="1.5"
              opacity="0.85"
              filter="url(#radarGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.4 }}
            />
          )}

          {/* Dot at each vertex */}
          {categories.map((c) => {
            const liveVal = isActive ? Math.min(100, c.val + interactionBoost + Math.sin(pulse + c.angle) * 3) : c.val;
            const pt = polar(c.angle, liveVal);
            return (
              <circle
                key={c.name + "-dot"}
                cx={pt.x.toFixed(2)}
                cy={pt.y.toFixed(2)}
                r="3"
                fill={isActive ? "#22C55E" : c.color}
                stroke="var(--color-surface)"
                strokeWidth="1.5"
                style={{ filter: isActive ? `drop-shadow(0 0 4px ${c.color})` : undefined }}
              />
            );
          })}

          {/* Center hexagon */}
          <polygon
            points="116,110 113,115.2 107,115.2 104,110 107,104.8 113,104.8"
            fill={isActive ? "#22C55E" : "#7C5CFF"}
            stroke="white"
            strokeWidth="0.8"
            opacity="0.9"
          />
          <circle cx={cx} cy={cy} r="2" fill="white" opacity="0.9" />

          {/* Category labels */}
          {categories.map((c) => {
            const lp = polar(c.angle, 118);
            return (
              <text
                key={c.name + "-label"}
                x={lp.x.toFixed(2)}
                y={lp.y.toFixed(2)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={c.color}
                fontSize="8"
                fontWeight="700"
                fontFamily="monospace"
              >
                {c.name}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {categories.slice(0, 3).map((c) => (
          <div key={c.name} className="flex flex-col items-center gap-0.5 rounded-xl border border-border-subtle/50 bg-surface/50 p-2">
            <span className="text-[8px] font-mono font-bold uppercase" style={{ color: c.color }}>{c.name}</span>
            <span className="text-sm font-black text-text">{c.val}%</span>
          </div>
        ))}
      </div>

      {/* Live status panel */}
      <div className={`rounded-xl border p-3 transition-all duration-500 ${
        isActive
          ? "border-emerald-500/20 bg-emerald-500/5"
          : "border-border-subtle bg-surface/40"
      }`}>
        {isActive ? (
          <div className="space-y-2">
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-500">
              Live Activity Monitor
            </p>
            <div className="grid grid-cols-3 gap-2 text-[8px] font-mono">
              <div className="flex flex-col gap-0.5">
                <span className="text-muted uppercase tracking-wide">Session</span>
                <span className="text-text font-black">{formatTime(sessionTime)}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted uppercase tracking-wide">Keystrokes</span>
                <span className="text-text font-black">{keyInteractions}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted uppercase tracking-wide">Boost</span>
                <span className="text-emerald-400 font-black">+{interactionBoost}%</span>
              </div>
            </div>
            {/* Mini oscilloscope */}
            <div className="h-5 w-full rounded-lg bg-black/20 overflow-hidden border border-emerald-500/10">
              <svg className="w-full h-full" viewBox="0 0 200 20" preserveAspectRatio="none">
                <path
                  d={Array.from({ length: 50 }, (_, i) => {
                    const x = (i / 49) * 200;
                    const y = 10 + Math.sin(x * 0.1 + pulse) * 5 + Math.sin(x * 0.23 + pulse * 1.5) * 2.5;
                    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  }).join(" ")}
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="1"
                  style={{ filter: "drop-shadow(0 0 3px rgba(34,197,94,0.5))" }}
                />
              </svg>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#7C5CFF]">
              AI Skill Projection
            </p>
            <p className="text-[10px] text-muted leading-relaxed">
              {completedPython + completedJS === 0
                ? "Start a lesson to see your live skill radar update in real-time."
                : `Interact with the workspace to activate live tracking for ${user?.name || "Developer"}.`}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Zap className="h-3 w-3 text-[#FF6B4A]" />
              <span className="text-[9px] font-mono text-muted">
                Session: <span className="text-text font-bold">{formatTime(sessionTime)}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
