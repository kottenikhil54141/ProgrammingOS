"use client";

import { useState, useEffect } from "react";
import { BarChart, TrendingUp } from "lucide-react";
import { PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgress } from "@/services/javascriptProgress";
import { PYTHON_CURRICULUM } from "@/services/pythonCurriculum";
import { JAVASCRIPT_CURRICULUM } from "@/services/javascriptCurriculum";

interface SkillAnalyticsProps {
  pythonProgress: PythonProgress | null;
  jsProgress: JavaScriptProgress | null;
}

export default function SkillAnalytics({ pythonProgress, jsProgress }: SkillAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly">("weekly");

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

  // Radar categories
  const categories = [
    { name: "Python", val: totalPython > 0 ? Math.round((completedPython / totalPython) * 100) : 0, angle: 0 },
    { name: "JS Scripting", val: totalJS > 0 ? Math.round((completedJS / totalJS) * 100) : 0, angle: 60 },
    { name: "OOP Design", val: Math.round((completedOop / totalOop) * 100), angle: 120 },
    { name: "Algorithms", val: Math.round((completedAlgo / totalAlgo) * 100), angle: 180 },
    { name: "System Design", val: Math.round((completedSys / totalSys) * 100), angle: 240 },
    { name: "Automation", val: Math.round((completedAuto / totalAuto) * 100), angle: 300 },
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

  // User's actual profile coordinates polygon points
  // Avoid collapsing to single point by using a minimum val of 4 for plotting visibility if everything is 0
  const points = categories.map((cat) => getCoords(cat.angle, Math.max(4, cat.val))).join(" ");

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
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#7C5CFF]" />
            <h2 className="text-sm font-bold text-text tracking-tight">Skill Matrix</h2>
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

        {/* Prediction summary */}
        <div className="mt-4 rounded-xl bg-surface/40 border border-border-subtle p-3">
          <span className="text-[9px] font-bold font-mono text-[#7C5CFF] uppercase tracking-wider block">
            AI Learning Projection
          </span>
          <p className="text-[10px] text-muted mt-1 leading-relaxed">
            {completedPython + completedJS === 0
              ? "Start code execution to compute certificate progression forecasts."
              : `At current velocity, you are projected to reach next level in ${(10 - Math.min(9, completedPython + completedJS)) * 3} days at standard pacing.`}
          </p>
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
