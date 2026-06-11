"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import PasswordInput from "@/components/auth/PasswordInput";
import { ROUTES } from "@/constants/routes";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function validate(): boolean {
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!token) {
      setError("Reset token is missing.");
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Reset link is invalid or expired.");
      } else {
        setSuccess("Password reset successfully! Redirecting you to login...");
        setTimeout(() => {
          router.push(ROUTES.LOGIN);
        }, 3000);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <p className="text-sm text-white/70">
          Invalid password reset request. Make sure you used the correct link.
        </p>
        <div className="pt-2">
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!success ? (
        <motion.form
          key="reset-form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <PasswordInput
            id="password"
            label="New Password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setError(null);
            }}
            placeholder="••••••••"
            showStrengthMeter
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(v) => {
              setConfirmPassword(v);
              setError(null);
            }}
            placeholder="••••••••"
          />

          {error && (
            <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
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
                Resetting...
              </span>
            ) : (
              <>
                Confirm New Password
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </motion.form>
      ) : (
        <motion.div
          key="reset-success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <p className="text-sm text-white/75">{success}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Create New Password"
      subtitle="Enter a strong password to secure your account"
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="h-6 w-6 rounded-full border-2 border-white/10 border-t-white"
            />
          </div>
        }
      >
        <ResetPasswordForm />
      </Suspense>
    </AuthCard>
  );
}
