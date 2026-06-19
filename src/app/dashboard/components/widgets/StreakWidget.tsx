"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { Flame, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function StreakWidget({
  streak,
  setStreak,
}: {
  streak: number;
  setStreak: (s: number) => void;
}) {
  const { user, updateUser } = useAuth();
  const [longestStreak, setLongestStreak] = useState(0);
  const [hasMissedDay, setHasMissedDay] = useState(false);
  const [activeDates, setActiveDates] = useState<string[]>([]);
  const [yesterdayStr, setYesterdayStr] = useState("");

  const [calendarDays, setCalendarDays] = useState<{ label: string; completed: boolean; missed: boolean; isToday: boolean }[]>([]);

  // Load longest streak & active dates on mount/streak change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const dates = JSON.parse(localStorage.getItem("programmingos_active_dates") || "[]");
      setActiveDates(dates);

      const ls = parseInt(localStorage.getItem("programmingos_longest_streak") || "0", 10);
      if (streak > ls) {
        localStorage.setItem("programmingos_longest_streak", streak.toString());
        setLongestStreak(streak);
      } else {
        setLongestStreak(ls);
      }
    }
  }, [streak]);

  // Compute calendar days dynamically (Mon - Sun)
  useEffect(() => {
    const today = new Date();
    const diff = today.getDay() === 0 ? -6 : 1 - today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    const labels = ["M", "T", "W", "T", "F", "S", "S"];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toDateString();
    setYesterdayStr(yStr);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toDateString();
      const isToday = dStr === today.toDateString();
      const isFuture = d > today;
      const completed = activeDates.includes(dStr);
      // It is missed if not completed, it is in the past, yesterday was missed and they had a streak
      const missed = !completed && !isToday && !isFuture && dStr === yStr && streak > 0;

      return {
        label: labels[i],
        completed,
        missed,
        isToday,
      };
    });

    setCalendarDays(days);

    const missedYesterday = !activeDates.includes(yStr) && streak > 0;
    setHasMissedDay(missedYesterday);
  }, [activeDates, streak]);

  function recoverStreak() {
    if (!user) return;
    const cost = 50;
    const currentXP = user.xp || 0;

    // Deduct cost and update streak
    updateUser({ xp: Math.max(0, currentXP - cost) });
    setStreak(streak + 1);
    setHasMissedDay(false);

    // Save yesterday's date as completed
    if (typeof window !== "undefined") {
      const datesStr = localStorage.getItem("programmingos_active_dates") || "[]";
      let dates = JSON.parse(datesStr) as string[];
      if (!dates.includes(yesterdayStr)) {
        dates.push(yesterdayStr);
        localStorage.setItem("programmingos_active_dates", JSON.stringify(dates));
        setActiveDates(dates);
      }
    }
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between h-full">
      <div>
        {/* Top section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-500 fill-amber-500/20" />
            <h2 className="text-sm font-bold text-text tracking-tight">Active Streak</h2>
          </div>
          <div className="text-[10px] text-muted font-mono">
            Longest: <span className="text-text font-bold">{longestStreak} days</span>
          </div>
        </div>

        {/* Flame display */}
        <div className="flex items-center gap-5 mb-5 bg-surface/40 border border-border-subtle rounded-2xl p-4">
          <div className="relative">
            {/* Flame animation circle */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-[#FF6B4A]/20 text-amber-500 border border-amber-500/30"
            >
              <Flame className="h-6 w-6 fill-amber-500" />
            </motion.div>
            {hasMissedDay && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-[#FF6B4A] text-[8px] font-bold text-slate-950">
                !
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-lg font-black text-text leading-none">{streak} Days</p>
            <p className="text-[10px] text-muted mt-1 leading-relaxed">
              {hasMissedDay
                ? "You missed yesterday! Recover it before today ends."
                : streak === 0
                ? "Code today to start your streak!"
                : "Keep coding today to secure your streak."}
            </p>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex items-center justify-between gap-1 mb-4">
          {calendarDays.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={cn(
                  "h-8 w-8 rounded-xl flex items-center justify-center text-xs font-mono transition-all duration-300",
                  day.completed
                    ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                    : day.missed
                    ? "bg-red-500/10 border border-red-500/30 text-red-500"
                    : day.isToday
                    ? "bg-surface border border-border-medium text-text font-bold"
                    : "bg-surface border border-border-subtle text-muted/30"
                )}
              >
                {day.completed ? "✓" : day.missed ? "!" : day.label}
              </div>
              <span className="text-[9px] text-muted">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Option */}
      {hasMissedDay && (
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={recoverStreak}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface border border-border-subtle hover:bg-border-subtle/50 p-2.5 text-xs font-semibold text-amber-500 transition-all outline-none mt-2"
        >
          <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
          <span>Recover Streak (Costs 50 XP)</span>
        </motion.button>
      )}
    </div>
  );
}
