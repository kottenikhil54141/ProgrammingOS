import { useState, useMemo } from "react";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

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
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-emerald-500",
  ][strength - 1] || "bg-white/10";

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="block text-sm font-medium text-white/70">
          {label}
        </label>
        {showStrengthMeter && value && (
          <span className="text-xs font-semibold text-white/40">
            Strength:{" "}
            <span
              className={cn("text-xs font-bold", {
                "text-red-400": strength <= 1,
                "text-orange-400": strength === 2,
                "text-yellow-400": strength === 3,
                "text-emerald-400": strength === 4,
              })}
            >
              {strengthLabel}
            </span>
          </span>
        )}
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
          <Lock className="h-4 w-4" />
        </div>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-2xl border bg-white/[0.04] pl-11 pr-12 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
            "focus:bg-white/[0.07] focus:ring-2",
            error
              ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
              : "border-white/[0.08] focus:border-[#7C5CFF]/60 focus:ring-[#7C5CFF]/20"
          )}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden flex gap-1 mt-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={cn("h-full flex-1 rounded-full transition-all duration-300", 
                step <= strength ? strengthColor : "bg-white/5"
              )}
            />
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
