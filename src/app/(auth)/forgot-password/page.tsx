"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowRight, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);

  function validate(): boolean {
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSuccess("Check your inbox! We've sent you a password reset link.");
        if (data.resetToken) {
          setSimulatedToken(data.resetToken);
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-md animate-fade-in">
      <div className="flex justify-start px-1">
        <Link
          href={ROUTES.HOME}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted hover:text-text transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <AuthCard
        title="Reset Password"
        subtitle="Enter your email to receive a temporary reset link"
      >
        <AnimatePresence mode="wait">
          {!success ? (
            <motion.form
              key="forgot-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
              noValidate
            >
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-text/80">
                  Email address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted/60">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="you@example.com"
                    className={cn(
                      "w-full rounded-2xl border bg-white/[0.03] dark:bg-white/[0.04] pl-11 pr-4 py-3.5 text-sm text-text placeholder-muted/50 outline-none transition-all duration-200",
                      "focus:bg-[#0F172A]/[0.04] dark:focus:bg-white/[0.07] focus:ring-2",
                      error
                        ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                        : "border-border-subtle focus:border-[#7C5CFF]/60 focus:ring-[#7C5CFF]/20"
                    )}
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 mt-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {error}
                </p>
              )}

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
                    Sending...
                  </span>
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Login
                </Link>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="forgot-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <p className="text-sm text-text">{success}</p>

              {simulatedToken && (
                <div className="rounded-2xl border border-border-subtle bg-[#0F172A]/[0.02] dark:bg-white/[0.02] p-4 text-left">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted block mb-1">
                    Sandbox Simulation Mode
                  </span>
                  <p className="text-xs text-muted leading-relaxed mb-3">
                    Click the direct link below to simulate receiving the password reset email:
                  </p>
                  <Link
                    href={`${ROUTES.RESET_PASSWORD}?token=${simulatedToken}`}
                    className="block text-center rounded-xl bg-[#0F172A]/[0.03] dark:bg-white/5 border border-border-subtle px-3 py-2 text-xs font-semibold text-[#7C5CFF] hover:bg-[#0F172A]/[0.06] dark:hover:bg-white/10 transition-colors"
                  >
                    Simulate Password Reset Link
                  </Link>
                </div>
              )}

              <div className="pt-4">
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Login
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthCard>
    </div>
  );
}
