"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AUTH_ERROR_MESSAGES, type AuthError } from "@/types/auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import SocialLogin from "@/components/auth/SocialLogin";

interface InputFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
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
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-400 mt-1"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoginPage() {
  const id = useId();
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue your engineering journey"
    >
      {/* Google & GitHub login options */}
      <SocialLogin />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InputField
          id={`${id}-email`}
          label="Email address"
          type="email"
          value={email}
          onChange={(v) => {
            setEmail(v);
            setFieldErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="you@example.com"
          icon={<Mail className="h-4 w-4" />}
          error={fieldErrors.email}
          autoComplete="email"
        />

        <PasswordInput
          id={`${id}-password`}
          label="Password"
          value={password}
          onChange={(v) => {
            setPassword(v);
            setFieldErrors((p) => ({ ...p, password: undefined }));
          }}
          placeholder="••••••••"
          error={fieldErrors.password}
        />

        {/* Forgot password link */}
        <div className="flex justify-end">
          <Link
            href={ROUTES.FORGOT_PASSWORD || "/forgot-password"}
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
              <p className="text-sm text-red-400">
                {AUTH_ERROR_MESSAGES[error as AuthError] || error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
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
          {/* Shimmer effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </button>
      </form>

      {/* Redirect option */}
      <p className="mt-6 text-center text-sm text-white/40">
        No account yet?{" "}
        <Link
          href={ROUTES.SIGNUP}
          className="font-semibold text-[#7C5CFF] hover:text-[#A78BFF] transition-colors"
        >
          Create one free
        </Link>
      </p>
    </AuthCard>
  );
}
