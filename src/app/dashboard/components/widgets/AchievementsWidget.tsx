"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Medal, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgress } from "@/services/javascriptProgress";

interface Badge {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  xpReward: number;
  icon: React.ComponentType<any>;
}

interface AchievementsWidgetProps {
  pythonProgress: PythonProgress | null;
  jsProgress: JavaScriptProgress | null;
}

export default function AchievementsWidget({ pythonProgress, jsProgress }: AchievementsWidgetProps) {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [longestStreak, setLongestStreak] = useState(0);
  const [compilerRuns, setCompilerRuns] = useState(0);

  // Load metrics from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLongestStreak(parseInt(localStorage.getItem("programmingos_longest_streak") || "0", 10));
      setCompilerRuns(parseInt(localStorage.getItem("programmingos_compiler_runs") || "0", 10));
    }
  }, [pythonProgress, jsProgress]);

  // Dynamic unlocked status
  const unlockedFirstScript = (pythonProgress?.completedTopics.length || 0) + (jsProgress?.completedTopics.length || 0) > 0;
  const unlockedStreakMaster = longestStreak >= 7;
  const unlockedArrayExplorer = pythonProgress?.completedTopics.includes("py_lists") || false;
  const unlockedAICompanion = compilerRuns >= 5;

  const badges: Badge[] = [
    { id: "1", title: "First Script", desc: "Complete your first lesson", unlocked: unlockedFirstScript, xpReward: 100, icon: Trophy },
    { id: "2", title: "Streak Master", desc: "Maintain a 7-day coding streak", unlocked: unlockedStreakMaster, xpReward: 250, icon: Medal },
    { id: "3", title: "Array Explorer", desc: "Complete the Python Lists topic", unlocked: unlockedArrayExplorer, xpReward: 150, icon: Award },
    { id: "4", title: "AI Companion", desc: "Run your code in sandbox 5 times", unlocked: unlockedAICompanion, xpReward: 50, icon: Star },
  ];

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl shadow-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Medal className="h-5 w-5 text-[#FF6B4A]" />
          <h2 className="text-sm font-bold text-text tracking-tight">Achievements</h2>
        </div>

        <div className="grid grid-cols-4 gap-3 relative">
          {badges.map((badge) => {
            const BadgeIcon = badge.icon;
            const isUnlocked = badge.unlocked;

            return (
              <div
                key={badge.id}
                className="relative flex justify-center"
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
              >
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl border transition-all cursor-help relative",
                    isUnlocked
                      ? "bg-[#7C5CFF]/10 border-[#7C5CFF]/30 text-[#A78BFF] shadow-[0_0_12px_rgba(124,92,255,0.15)]"
                      : "bg-surface/30 border-border-subtle text-muted/30"
                  )}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-surface/40 backdrop-blur-[0.5px] rounded-xl">
                      <span className="text-[10px]">🔒</span>
                    </div>
                  )}
                  <BadgeIcon className="h-5 w-5" />
                </motion.div>

                {/* Custom tooltip */}
                <AnimatePresence>
                  {hoveredBadge === badge.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute bottom-14 left-1/2 -translate-x-1/2 z-50 w-48 rounded-xl border border-border-subtle bg-surface/95 backdrop-blur-md p-3 shadow-xl text-center"
                    >
                      <p className="text-xs font-bold text-text">{badge.title}</p>
                      <p className="text-[10px] text-muted mt-1 leading-relaxed">{badge.desc}</p>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-500">
                        +{badge.xpReward} XP Reward
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
