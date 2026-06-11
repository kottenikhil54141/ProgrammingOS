"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/constants/routes";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050816] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-white/10 border-t-[#FF6B4A]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Temp dashboard shell — Sprint 4 will replace this */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-20"
        >
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] mb-6">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">
            Welcome, {user?.name}! 🎉
          </h1>
          <p className="text-white/50 mb-1">
            Track: <span className="text-white/80 capitalize font-semibold">{user?.track}</span>
          </p>
          <p className="text-white/40 text-sm mt-6">
            Dashboard is coming in Sprint 4.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
