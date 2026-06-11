"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AUTH_ERROR_MESSAGES, type AuthError } from "@/types/auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

/* ─── Google Icon ────────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ─── Input Field ────────────────────────────────────────────────── */
interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  autoComplete?: string;
}

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
  rightElement,
  error,
  autoComplete,
}: InputFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-white/70">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "w-full rounded-2xl border bg-white/[0.04] pl-11 pr-4 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
            "focus:bg-white/[0.07] focus:ring-2",
            error
              ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
              : "border-white/[0.08] focus:border-[#7C5CFF]/60 focus:ring-[#7C5CFF]/20"
          )}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
export default function LoginPage() {
  const id = useId();
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!email.includes("@")) errs.email = "Enter a valid email address.";
    if (password.length < 8) errs.password = "Password must be at least 8 characters.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    const { error: authError } = await login({ email, password });
    if (authError) {
      setError(authError);
    } else {
      router.push(ROUTES.DASHBOARD);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
        style={{
          background: "rgba(8, 12, 28, 0.85)",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Top glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(124,92,255,0.8) 0%, transparent 70%)", filter: "blur(24px)" }}
        />

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-white/45">
            Sign in to continue your engineering journey
          </p>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-white/85 transition-all duration-200 hover:bg-white/[0.09] hover:border-white/15 active:scale-[0.98]"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.07]" />
          <span className="text-xs text-white/25 font-mono">or</span>
          <div className="h-px flex-1 bg-white/[0.07]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField
            id={`${id}-email`}
            label="Email address"
            type="email"
            value={email}
            onChange={(v) => { setEmail(v); setFieldErrors((p) => ({ ...p, email: undefined })); }}
            placeholder="you@example.com"
            icon={<Mail className="h-4 w-4" />}
            error={fieldErrors.email}
            autoComplete="email"
          />

          <InputField
            id={`${id}-password`}
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(v) => { setPassword(v); setFieldErrors((p) => ({ ...p, password: undefined })); }}
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            error={fieldErrors.password}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-white/30 hover:text-white/60 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="#"
              className="text-xs text-white/35 hover:text-[#7C5CFF] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Global error */}
          <AnimatePresence initial={false}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{AUTH_ERROR_MESSAGES[error]}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative mt-2 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-6 py-3.5 font-semibold text-white shadow-[0_8px_32px_rgba(255,107,74,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,107,74,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
                Signing in...
              </span>
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
            {/* Shimmer */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>

        {/* Switch to signup */}
        <p className="mt-6 text-center text-sm text-white/40">
          No account yet?{" "}
          <Link
            href={ROUTES.SIGNUP}
            className="font-semibold text-[#7C5CFF] hover:text-[#A78BFF] transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
