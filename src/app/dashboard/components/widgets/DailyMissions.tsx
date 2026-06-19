"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Flame, Star, Trophy } from "lucide-react";
import { cn } from "@/utils/cn";
import { PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgress } from "@/services/javascriptProgress";

interface Mission {
  id: string;
  label: string;
  xpReward: number;
  completed: boolean;
  claimed: boolean;
}

interface DailyMissionsProps {
  pythonProgress: PythonProgress | null;
  jsProgress: JavaScriptProgress | null;
}

export default function DailyMissions({ pythonProgress, jsProgress }: DailyMissionsProps) {
  const { user, updateUser } = useAuth();
  const [claimedMissions, setClaimedMissions] = useState<string[]>([]);
  const [solvedDsaCount, setSolvedDsaCount] = useState(0);
  const [activeParticleId, setActiveParticleId] = useState<string | null>(null);

  // Load claimed missions and solved DSA count on mount/update
  useEffect(() => {
    if (typeof window !== "undefined") {
      const claimed = JSON.parse(localStorage.getItem("programmingos_claimed_missions") || "[]");
      setClaimedMissions(claimed);

      const saved = JSON.parse(localStorage.getItem("programmingos_interview_questions") || "[]");
      setSolvedDsaCount(saved.length);
    }
  }, [pythonProgress, jsProgress]);

  const dsaCompleted = solvedDsaCount >= 2;
  const generatorsCompleted = pythonProgress?.completedTopics.includes("py_generators") || false;
  const closuresCompleted = jsProgress?.completedTopics.includes("js_closures") || false;

  const missions: Mission[] = [
    { id: "1", label: "Solve 2 DSA Problems", xpReward: 100, completed: dsaCompleted, claimed: claimedMissions.includes("1") },
    { id: "2", label: "Complete 'Generators & yield'", xpReward: 50, completed: generatorsCompleted, claimed: claimedMissions.includes("2") },
    { id: "3", label: "Complete 'Lexical Closures'", xpReward: 75, completed: closuresCompleted, claimed: claimedMissions.includes("3") },
  ];

  function claimReward(id: string, xp: number) {
    if (!user) return;

    const newClaimed = [...claimedMissions, id];
    setClaimedMissions(newClaimed);
    localStorage.setItem("programmingos_claimed_missions", JSON.stringify(newClaimed));

    // Trigger particle animation
    setActiveParticleId(id);
    setTimeout(() => setActiveParticleId(null), 1000);

    // Update user's global XP
    const newXP = (user.xp || 0) + xp;
    const newLevel = Math.floor(newXP / 500) + 1;
    updateUser({ xp: newXP, level: newLevel });
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h2 className="text-sm font-bold text-text tracking-tight">Daily Missions</h2>
          </div>
          <span className="text-[10px] font-mono text-muted">Resets in 12h</span>
        </div>

        <div className="space-y-3">
          {missions.map((mission) => {
            const isCompleted = mission.completed;
            const isClaimed = mission.claimed;

            return (
              <div
                key={mission.id}
                className={cn(
                  "group relative flex items-center justify-between rounded-2xl border p-3.5 transition-all duration-300",
                  isCompleted
                    ? "border-[#22C55E]/30 bg-[#22C55E]/5"
                    : "border-border-subtle bg-surface/40 hover:bg-surface/75"
                )}
              >
                {/* Checkbox and label */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-lg border text-text transition-all",
                      isCompleted
                        ? "border-[#22C55E] bg-[#22C55E]"
                        : "border-border-subtle bg-surface"
                    )}
                  >
                    {isCompleted && <Check className="h-3.5 w-3.5 text-slate-950 stroke-[3.5]" />}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold select-none transition-colors",
                      isCompleted ? "text-muted line-through" : "text-text/90"
                    )}
                  >
                    {mission.label}
                  </span>
                </div>

                {/* Claim Reward Button */}
                <div>
                  {!isClaimed ? (
                    <button
                      onClick={() => isCompleted && claimReward(mission.id, mission.xpReward)}
                      disabled={!isCompleted}
                      className={cn(
                        "rounded-xl px-3 py-1.5 text-[10px] font-bold font-mono transition-all duration-300 outline-none",
                        isCompleted
                          ? "bg-gradient-to-r from-amber-400 to-[#FF6B4A] text-slate-950 shadow-[0_4px_12px_rgba(251,191,36,0.3)] hover:scale-105"
                          : "bg-border-subtle text-muted/40 cursor-not-allowed"
                      )}
                    >
                      +{mission.xpReward} XP
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold font-mono text-[#22C55E] px-2 py-1 bg-[#22C55E]/10 rounded-xl">
                      Claimed ✓
                    </span>
                  )}
                </div>

                {/* Float XP animation */}
                <AnimatePresence>
                  {activeParticleId === mission.id && (
                    <motion.div
                      initial={{ opacity: 1, y: 0, scale: 0.8 }}
                      animate={{ opacity: 0, y: -40, scale: 1.2 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-black text-amber-500 pointer-events-none drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                    >
                      +{mission.xpReward} XP!
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
