"use client";

import { useAuth } from "@/lib/auth-context";
import { ArrowRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { TabId } from "../sidebar/Sidebar";

interface WelcomeWidgetProps {
  setActiveTab: (tab: TabId) => void;
  streak: number;
}

export default function WelcomeWidget({ setActiveTab, streak }: WelcomeWidgetProps) {
  const { user } = useAuth();
  
  // Calculate level progress percentage
  const xpNeededForNextLevel = 1000;
  const currentXP = user?.xp || 0;
  const progressPercentage = Math.min(((currentXP % xpNeededForNextLevel) / xpNeededForNextLevel) * 100, 100);

  // Dynamic motivational quotes based on track
  const quotes = {
    python: "Mastering Python is step one to data intelligence.",
    javascript: "The web is yours. Continue building interactive experiences.",
    both: "Becoming a full-stack master requires constant dedication. Code daily!",
    null: "Choose your path and start coding today!"
  };
  
  const motivation = user?.track ? quotes[user.track] : quotes.null;

  return (
    <div
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-border-subtle bg-surface/90 backdrop-blur-2xl"
      style={{
        boxShadow: "inset 0 1px 0 var(--color-border-subtle)",
      }}
    >
      {/* Liquid background glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, rgba(124,92,255,0.8) 0%, transparent 70%)", filter: "blur(40px)" }}
      />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-40 w-40 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(255,107,74,0.6) 0%, transparent 70%)", filter: "blur(32px)" }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2.5 max-w-lg">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FF6B4A]">
            <Flame className="h-4 w-4 text-[#FF6B4A] fill-[#FF6B4A]/20" />
            <span>{streak} Day Streak Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight leading-none">
            Welcome back, {user?.name || "Developer"}!
          </h1>
          <p className="text-sm text-muted font-mono leading-relaxed">
            {motivation}
          </p>
        </div>

        {/* Level / Progress */}
        <div className="flex flex-col gap-3 shrink-0 min-w-[200px]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted font-mono">Level Progression</span>
            <span className="text-text font-bold font-mono">Lvl {user?.level || 1}</span>
          </div>

          <div className="relative h-2 w-full rounded-full bg-border-subtle overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF]"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted font-mono">
            <span>{currentXP % xpNeededForNextLevel} XP</span>
            <span>{xpNeededForNextLevel} XP to Level {Number(user?.level || 1) + 1}</span>
          </div>

          <button
            onClick={() => setActiveTab("learn")}
            className="group mt-2.5 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-4 py-3 text-xs font-semibold text-white transition-all duration-300 hover:scale-[1.02] shadow-[0_4px_20px_rgba(124,92,255,0.25)]"
          >
            <span>Continue Learning</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
