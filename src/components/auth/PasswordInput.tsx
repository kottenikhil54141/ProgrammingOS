import { useState, useMemo } from "react";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  showStrengthMeter?: boolean;
}

export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  error,
  showStrengthMeter = false,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPopulated = value.length > 0;
  const isLifted = isFocused || isPopulated;

  const strength = useMemo(() => {
    if (!value) return 0;
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    return score;
  }, [value]);

  const strengthLabel = ["Too weak", "Weak", "Medium", "Strong"][strength - 1] || "";
  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#22C55E"];

  return (
    <div className="space-y-1 relative">
      <div className={cn(
        "relative rounded-2xl border transition-all duration-300 bg-slate-50/45 dark:bg-white/[0.02] border-slate-200/80 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.15]",
        isFocused 
          ? "border-[#7C5CFF] dark:border-[#7C5CFF] shadow-[0_0_20px_rgba(124,92,255,0.1)] ring-1 ring-[#7C5CFF]/20 bg-white dark:bg-white/[0.04]" 
          : "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]",
        error ? "border-red-500/60 dark:border-red-500/50 focus-within:border-red-500" : ""
      )}>
        {/* Left icon wrapper */}
        <div className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
          isFocused ? "text-[#7C5CFF]" : "text-slate-400 dark:text-white/30"
        )}>
          <Lock className="h-4 w-4" />
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
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ""}
          className="w-full bg-transparent pl-10 pr-10 pt-5 pb-2 text-xs text-slate-900 dark:text-white outline-none"
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 hover:text-[#7C5CFF] dark:hover:text-[#7C5CFF] transition-colors p-1"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div className="space-y-1 pt-1.5 pl-1">
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-full flex-1 rounded-full transition-all duration-300",
                  step <= strength ? "" : "bg-slate-200 dark:bg-white/[0.08]"
                )}
                style={{
                  backgroundColor: step <= strength ? colors[strength] : undefined,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Strength Indicator
            </span>
            <span
              className={cn("text-[9px] font-black uppercase tracking-wider", {
                "text-red-500": strength <= 1,
                "text-orange-500": strength === 2,
                "text-[#7C5CFF]": strength === 3,
                "text-emerald-500": strength === 4,
              })}
            >
              {strengthLabel}
            </span>
          </div>
        </div>
      )}

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400 pl-1 mt-1"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
