"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import { ROUTES } from "@/constants/routes";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Verification token is missing. Please make sure to use a valid link.");
      return;
    }

    async function verify() {
      setStatus("verifying");
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();

        if (!res.ok) {
          setStatus("error");
          setErrorMsg(data.error || "Verification failed. Token may be invalid or expired.");
        } else {
          setStatus("success");
        }
      } catch {
        setStatus("error");
        setErrorMsg("Network error. Please try again later.");
      }
    }

    verify();
  }, [token]);

  return (
    <AnimatePresence mode="wait">
      {status === "verifying" && (
        <motion.div
          key="verifying"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-6 space-y-4"
        >
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 text-[#7C5CFF] animate-spin" />
          </div>
          <p className="text-sm text-white/75">Verifying your email address...</p>
        </motion.div>
      )}

      {status === "success" && (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4 space-y-5"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Email verified!</p>
            <p className="text-xs text-white/55">
              Your account is now fully activated. You can sign in and start learning.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-6 py-3.5 font-semibold text-white shadow-[0_8px_32px_rgba(255,107,74,0.25)] hover:-translate-y-0.5 transition-transform"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      )}

      {status === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-4 space-y-5"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">Verification failed</p>
            <p className="text-xs text-white/55 px-2">{errorMsg}</p>
          </div>
          <div className="pt-2">
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Verify Email"
      subtitle="Verifying your credentials to complete registration"
    >
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-6 w-6 text-[#7C5CFF] animate-spin" />
          </div>
        }
      >
        <VerifyEmailForm />
      </Suspense>
    </AuthCard>
  );
}
