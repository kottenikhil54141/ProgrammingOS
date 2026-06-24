"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

export default function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightElement,
  error,
  hint,
  autoComplete,
}: FloatingFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isPopulated = value.length > 0;
  const isLifted = isFocused || isPopulated;

  return (
    <div className="space-y-1 relative">
      <div
        className={cn(
          "relative rounded-2xl border transition-all duration-500 bg-slate-50/45 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15] overflow-hidden",
          isFocused 
            ? "border-[#7C5CFF] dark:border-[#7C5CFF] shadow-[0_0_25px_rgba(124,92,255,0.15)] ring-1 ring-[#7C5CFF]/25 bg-white dark:bg-white/[0.04]" 
            : "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
          error ? "border-red-500/60 dark:border-red-500/50 focus-within:border-red-500" : ""
        )}
        style={{
          transform: isFocused ? "translateZ(10px) scale(1.01)" : "translateZ(0px) scale(1)",
          transformStyle: "preserve-3d",
        }}
      >
        {isFocused && (
          <div
            className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-[#7C5CFF]/8 to-transparent"
            style={{
              animation: "sweepLine 1.8s ease-in-out infinite",
              backgroundSize: "200% 100%",
            }}
          />
        )}
        {/* Left icon wrapper */}
        <div className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10",
          isFocused ? "text-[#7C5CFF]" : "text-slate-400 dark:text-white/30"
        )}>
          {icon}
        </div>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-10 font-bold transition-all duration-300 origin-left select-none",
            isLifted
              ? "top-1.5 text-[8px] uppercase tracking-wider text-[#7C5CFF] dark:text-[#7C5CFF]/90"
              : "top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-white/40"
          )}
        >
          {label}
        </label>

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ""}
          autoComplete={autoComplete}
          className="w-full bg-transparent pl-10 pr-10 pt-5 pb-2 text-xs text-slate-900 dark:text-white outline-none"
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{rightElement}</div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400 pl-1"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </motion.p>
        )}
        {!error && hint && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] text-slate-400 dark:text-slate-500 pl-1 font-mono"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
      <style>{`
        @keyframes sweepLine {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
