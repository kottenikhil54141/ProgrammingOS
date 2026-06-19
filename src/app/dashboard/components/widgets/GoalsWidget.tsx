"use client";

import { useState, useEffect } from "react";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import { PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgress } from "@/services/javascriptProgress";

interface GoalItem {
  label: string;
  current: number;
  target: number;
  unit: string;
}

interface GoalsWidgetProps {
  pythonProgress: PythonProgress | null;
  jsProgress: JavaScriptProgress | null;
}

export default function GoalsWidget({ pythonProgress, jsProgress }: GoalsWidgetProps) {
  const [solvedDsaCount, setSolvedDsaCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(localStorage.getItem("programmingos_interview_questions") || "[]");
      setSolvedDsaCount(saved.length);
    }
  }, [pythonProgress, jsProgress]);

  const completedPython = pythonProgress?.completedTopics.length || 0;
  const completedJS = jsProgress?.completedTopics.length || 0;
  const totalCompletedLessons = completedPython + completedJS;

  const goals: GoalItem[] = [
    { label: "Today's Target", current: solvedDsaCount, target: 5, unit: "Problems solved" },
    { label: "Weekly Goal", current: totalCompletedLessons, target: 20, unit: "Lessons finished" },
    { label: "Monthly Goal", current: totalCompletedLessons * 2, target: 60, unit: "Quiz completions" },
  ];

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl shadow-card flex flex-col justify-between h-full min-h-[260px]">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-text tracking-tight">Milestone Goals</h2>
        </div>

        <div className="space-y-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.current / g.target) * 100));
            return (
              <div key={g.label} className="space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-semibold text-text/80 font-sans">{g.label}</span>
                  <span className="text-[10px] text-muted font-mono">
                    {g.current} / {g.target} {g.unit} ({pct}%)
                  </span>
                </div>

                {/* Progress Slider Display */}
                <div className="h-2 w-full rounded-full bg-surface overflow-hidden border border-border-subtle">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#7C5CFF]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
