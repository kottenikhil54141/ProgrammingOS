"use client";

import { useState, useEffect } from "react";
import { BarChart, TrendingUp, Activity } from "lucide-react";
import { PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgress } from "@/services/javascriptProgress";
import { PYTHON_CURRICULUM } from "@/services/pythonCurriculum";
import { JAVASCRIPT_CURRICULUM } from "@/services/javascriptCurriculum";
import { useAuth } from "@/lib/auth-context";

interface SkillAnalyticsProps {
  pythonProgress: PythonProgress | null;
  jsProgress: JavaScriptProgress | null;
}

export default function SkillAnalytics({ pythonProgress, jsProgress }: SkillAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");
  const { user } = useAuth();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [keystrokes, setKeystrokes] = useState(0);
  const [memoryLoad, setMemoryLoad] = useState(4.85);
  const [wavePhase, setWavePhase] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let inactivityTimeout: NodeJS.Timeout;

    const triggerActivity = () => {
      setIsMonitoring(true);
      clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(() => {
        setIsMonitoring(false);
      }, 12000);
    };

    const handleKeydown = () => {
      setKeystrokes((k) => k + 1);
      triggerActivity();
    };

    const handleMousemove = () => {
      triggerActivity();
    };

    const handleCodeExecuted = () => {
      triggerActivity();
      setMemoryLoad((m) => {
        const next = m + (Math.random() - 0.5) * 0.5;
        return Math.max(3.5, Math.min(8.0, next));
      });
    };

    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("mousemove", handleMousemove);
    window.addEventListener("code-executed", handleCodeExecuted);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("mousemove", handleMousemove);
      window.removeEventListener("code-executed", handleCodeExecuted);
      clearTimeout(inactivityTimeout);
    };
  }, []);

  useEffect(() => {
    if (!isMonitoring) return;
    let animId: number;
    const tick = () => {
      setWavePhase((p) => (p + 0.12) % (Math.PI * 2));
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isMonitoring]);

  // Dynamic Skill matrix calculations
  const totalPython = PYTHON_CURRICULUM.length;
  const completedPython = pythonProgress?.completedTopics.length || 0;

  const totalJS = JAVASCRIPT_CURRICULUM.length;
  const completedJS = jsProgress?.completedTopics.length || 0;

  // OOP Design
  const totalPythonOop = PYTHON_CURRICULUM.filter(t => t.type === "oop").length;
  const completedPythonOop = PYTHON_CURRICULUM.filter(t => t.type === "oop" && pythonProgress?.completedTopics.includes(t.id)).length;
  const totalJsOop = JAVASCRIPT_CURRICULUM.filter(t => t.type === "oop").length;
  const completedJsOop = JAVASCRIPT_CURRICULUM.filter(t => t.type === "oop" && jsProgress?.completedTopics.includes(t.id)).length;
  const totalOop = totalPythonOop + totalJsOop || 1;
  const completedOop = completedPythonOop + completedJsOop;

  // Algorithms
  const totalPythonAlgo = PYTHON_CURRICULUM.filter(t => t.type === "structures" || t.type === "logic").length;
  const completedPythonAlgo = PYTHON_CURRICULUM.filter(t => (t.type === "structures" || t.type === "logic") && pythonProgress?.completedTopics.includes(t.id)).length;
  const totalJsAlgo = JAVASCRIPT_CURRICULUM.filter(t => t.type === "logic").length;
  const completedJsAlgo = JAVASCRIPT_CURRICULUM.filter(t => t.type === "logic" && jsProgress?.completedTopics.includes(t.id)).length;
  const totalAlgo = totalPythonAlgo + totalJsAlgo || 1;
  const completedAlgo = completedPythonAlgo + completedJsAlgo;

  // System Design
  const totalPythonSys = PYTHON_CURRICULUM.filter(t => t.type === "advanced" || t.id === "py_files" || t.id === "py_exceptions").length;
  const completedPythonSys = PYTHON_CURRICULUM.filter(t => (t.type === "advanced" || t.id === "py_files" || t.id === "py_exceptions") && pythonProgress?.completedTopics.includes(t.id)).length;
  const totalJsSys = JAVASCRIPT_CURRICULUM.filter(t => t.type === "async" || t.type === "browser").length;
  const completedJsSys = JAVASCRIPT_CURRICULUM.filter(t => (t.type === "async" || t.type === "browser") && jsProgress?.completedTopics.includes(t.id)).length;
  const totalSys = totalPythonSys + totalJsSys || 1;
  const completedSys = completedPythonSys + completedJsSys;

  // Automation
  const totalPythonAuto = PYTHON_CURRICULUM.filter(t => t.type === "basics").length;
  const completedPythonAuto = PYTHON_CURRICULUM.filter(t => t.type === "basics" && pythonProgress?.completedTopics.includes(t.id)).length;
  const totalJsAuto = JAVASCRIPT_CURRICULUM.filter(t => t.type === "basics").length;
  const completedJsAuto = JAVASCRIPT_CURRICULUM.filter(t => t.type === "basics" && jsProgress?.completedTopics.includes(t.id)).length;
  const totalAuto = totalPythonAuto + totalJsAuto || 1;
  const completedAuto = completedPythonAuto + completedJsAuto;

  // Radar categories with baseline vs real progress data
  const categories = [
    {
      name: "Python",
      realVal: totalPython > 0 ? Math.round((completedPython / totalPython) * 100) : 0,
      baselineVal: 30,
      angle: 0
    },
    {
      name: "JS Scripting",
      realVal: totalJS > 0 ? Math.round((completedJS / totalJS) * 100) : 0,
      baselineVal: 30,
      angle: 60
    },
    {
      name: "OOP Design",
      realVal: Math.round((completedOop / totalOop) * 100),
      baselineVal: 30,
      angle: 120
    },
    {
      name: "Algorithms",
      realVal: Math.round((completedAlgo / totalAlgo) * 100),
      baselineVal: 30,
      angle: 180
    },
    {
      name: "System Design",
      realVal: Math.round((completedSys / totalSys) * 100),
      baselineVal: 30,
      angle: 240
    },
    {
      name: "Automation",
      realVal: Math.round((completedAuto / totalAuto) * 100),
      baselineVal: 30,
      angle: 300
    },
  ];

  // Radar chart helper
  const centerX = 100;
  const centerY = 100;
  const maxVal = 100;
  const baseRadius = 70;

  function getCoords(angleDeg: number, val: number) {
    const angleRad = (angleDeg - 90) * (Math.PI / 180);
    const radius = (val / maxVal) * baseRadius;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    return `${x},${y}`;
  }

  // Draw background concentric hexagons
  const concentricHex = [20, 40, 60, 80, 100].map((level) => {
    return categories
      .map((cat) => getCoords(cat.angle, level))
      .join(" ");
  });

  // User's actual profile coordinates polygon points (Baseline hex when idle, Live user progress when active/used)
  const points = categories.map((cat) => {
    const val = isMonitoring ? cat.realVal : cat.baselineVal;
    return getCoords(cat.angle, Math.max(4, val));
  }).join(" ");

  // Study hours tracker state
  const [weeklyHours, setWeeklyHours] = useState<{ label: string; hours: number }[]>([]);
  const [monthlyHours, setMonthlyHours] = useState<{ label: string; hours: number }[]>([]);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [dailyAvg, setDailyAvg] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const today = new Date();
    const currentDayIdx = today.getDay();
    const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    const timeDataStr = localStorage.getItem("programmingos_study_time") || "{}";
    const timeData = JSON.parse(timeDataStr) as Record<string, number>;

    const daysLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    let totalSecs = 0;
    let daysWithTime = 0;

    // Weekly Hours
    const hoursData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toDateString();
      const seconds = timeData[dateStr] || 0;
      const hours = parseFloat((seconds / 3600).toFixed(2));
      totalSecs += seconds;
      if (seconds > 0) daysWithTime++;
      return {
        label: daysLabels[i],
        hours,
      };
    });

    // Monthly Hours
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const mHours = Array.from({ length: 4 }, (_, weekIdx) => {
      let weekSeconds = 0;
      for (let day = 1; day <= 31; day++) {
        const d = new Date(currentYear, currentMonth, day);
        if (d.getMonth() !== currentMonth) break;
        const dayWeekIdx = Math.min(3, Math.floor((day - 1) / 7));
        if (dayWeekIdx === weekIdx) {
          const dateStr = d.toDateString();
          weekSeconds += timeData[dateStr] || 0;
        }
      }
      const hours = parseFloat((weekSeconds / 3600).toFixed(2));
      return {
        label: `Week ${weekIdx + 1}`,
        hours,
      };
    });

    setWeeklyHours(hoursData);
    setMonthlyHours(mHours);
    const totalHours = parseFloat((totalSecs / 3600).toFixed(1));
    setWeeklyTotal(totalHours);
    setDailyAvg(parseFloat((totalHours / (daysWithTime || 1)).toFixed(1)));
  }, [pythonProgress, jsProgress]);

  const activeHoursData = activeTab === "weekly" ? weeklyHours : monthlyHours;
  const maxHours = Math.max(...activeHoursData.map((item) => item.hours), 0.1);

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl grid md:grid-cols-2 gap-8 h-full">
      {/* Radar Skills */}
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {isMonitoring ? (
                <Activity className="h-5 w-5 text-emerald-500 animate-pulse" />
              ) : (
                <TrendingUp className="h-5 w-5 text-[#7C5CFF]" />
              )}
              <h2 className="text-sm font-bold text-text tracking-tight">
                {isMonitoring ? "Active User Metrics" : "Skill Matrix"}
              </h2>
            </div>
            
            <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors duration-300 ${
              isMonitoring 
                ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" 
                : "text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 border-border-subtle"
            }`}>
              {isMonitoring ? "LIVE USER DATA" : "TARGET SCHEMA"}
            </span>
          </div>

          <div className="flex justify-center items-center py-2 relative">
            <svg className="w-48 h-48" viewBox="0 0 200 200">
              {/* Concentric rings */}
              {concentricHex.map((hexPoints, idx) => (
                <polygon
                  key={idx}
                  points={hexPoints}
                  className="fill-none stroke-border-subtle/40 stroke-[0.5]"
                />
              ))}

              {/* Grid spokes */}
              {categories.map((cat, idx) => {
                const outerEnd = getCoords(cat.angle, 100).split(",");
                return (
                  <line
                    key={idx}
                    x1={centerX}
                    y1={centerY}
                    x2={outerEnd[0]}
                    y2={outerEnd[1]}
                    className="stroke-border-subtle/40 stroke-[0.5]"
                  />
                );
              })}

              {/* Polygon profile area */}
              <polygon
                points={points}
                className="fill-[#7C5CFF]/15 stroke-[#7C5CFF] stroke-[1.5] shadow-lg transition-all duration-500"
              />

              {/* Center core indicator */}
              <polygon
                points="106,100 103,105.2 97,105.2 94,100 97,94.8 103,94.8"
                className="fill-[#7C5CFF] stroke-white dark:stroke-[#0B1020] stroke-[1]"
              />
              <circle cx="100" cy="100" r="1.5" className="fill-white" />

              {/* Label texts */}
              {categories.map((cat, idx) => {
                const posStr = getCoords(cat.angle, 120).split(",");
                const xVal = parseFloat(posStr[0]);
                const yVal = parseFloat(posStr[1]);

                return (
                  <text
                    key={idx}
                    x={xVal}
                    y={yVal}
                    textAnchor="middle"
                    fill="currentColor"
                    className="text-text/70 font-mono text-[8px] font-bold"
                  >
                    {cat.name}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Prediction / Live Status summary */}
        <div className="mt-4 rounded-xl bg-surface/40 border border-border-subtle p-3 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className={`text-[9px] font-bold font-mono uppercase tracking-wider block ${isMonitoring ? "text-emerald-500" : "text-[#7C5CFF]"}`}>
              {isMonitoring ? "Active Monitor Trace" : "AI Learning Projection"}
            </span>
            {isMonitoring && (
              <span className="text-[7px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            )}
          </div>
          
          {isMonitoring ? (
            <div className="mt-1 space-y-2">
              <p className="text-[10px] text-muted leading-relaxed">
                Workspace action detected. Rendering live stats for <span className="font-bold text-text">{user?.name || "Developer"}</span>:
              </p>
              
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono mt-1.5">
                <div className="bg-slate-100/50 dark:bg-white/[0.02] border border-border-subtle/50 rounded-lg p-1.5 flex flex-col">
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Keystrokes</span>
                  <span className="text-text font-black">{keystrokes} Typed</span>
                </div>
                <div className="bg-slate-100/50 dark:bg-white/[0.02] border border-border-subtle/50 rounded-lg p-1.5 flex flex-col">
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sandbox RAM</span>
                  <span className="text-text font-black">{memoryLoad.toFixed(2)} MB</span>
                </div>
              </div>

              {/* Minimal oscilloscope wave */}
              <div className="h-6 w-full relative flex items-center justify-center bg-slate-100/30 dark:bg-white/[0.01] rounded-lg border border-border-subtle/30 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 200 30" preserveAspectRatio="none">
                  <path
                    d={Array.from({ length: 40 }, (_, i) => {
                      const x = (i / 39) * 200;
                      const y = 15 + Math.sin(x * 0.12 + wavePhase) * 6;
                      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                    }).join(" ")}
                    className="fill-none stroke-[#7C5CFF] stroke-[1] drop-shadow-[0_0_4px_rgba(124,92,255,0.4)]"
                  />
                </svg>
              </div>
            </div>
          ) : (
            <p className="text-[10px] text-muted mt-1 leading-relaxed">
              {completedPython + completedJS === 0
                ? "Start code execution to compute certificate progression forecasts."
                : `At current velocity, you are projected to reach next level in ${(10 - Math.min(9, completedPython + completedJS)) * 3} days at standard pacing.`}
            </p>
          )}
        </div>
      </div>

      {/* Bar graph weekly progress */}
      <div className="flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-text tracking-tight">Learning Hours</h2>
            </div>

            <div className="flex rounded-lg bg-surface/50 p-0.5 border border-border-subtle text-[9px]">
              <button
                onClick={() => setActiveTab("weekly")}
                className={`rounded px-2 py-1 ${activeTab === "weekly" ? "bg-surface text-text shadow-sm" : "text-muted"}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setActiveTab("monthly")}
                className={`rounded px-2 py-1 ${activeTab === "monthly" ? "bg-surface text-text shadow-sm" : "text-muted"}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <div className="flex items-end justify-between h-40 pt-4 px-1 gap-2">
            {activeHoursData.map((item) => {
              const pct = Math.round((item.hours / maxHours) * 100);
              return (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  {/* Bar height */}
                  <div className="relative group w-full flex justify-center items-end h-full">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500/10 to-emerald-400/30 group-hover:to-emerald-400/50 transition-all duration-500"
                      style={{ height: `${pct}%` }}
                    />
                    {/* Tooltip */}
                    <div className="pointer-events-none absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity rounded bg-slate-900 border border-white/10 px-1.5 py-0.5 text-[8px] font-mono text-white">
                      {item.hours}h
                    </div>
                  </div>
                  <span className="text-[10px] text-muted font-mono">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[10px] text-muted mt-4 text-center">
          {activeTab === "weekly" ? (
            <>
              Weekly Study Total: <span className="text-text font-bold">{weeklyTotal} hours</span> • Daily Avg: <span className="text-text font-bold">{dailyAvg} hours</span>
            </>
          ) : (
            <>
              Monthly Study Total: <span className="text-text font-bold">{(weeklyTotal * 4).toFixed(1)} hours</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
