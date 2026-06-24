import type { ReactNode } from "react";
import Link from "next/link";
import { Zap, Shield } from "lucide-react";
import { ROUTES } from "@/constants/routes";

import AmbientCanvasBackground from "@/components/auth/AmbientCanvasBackground";

/* ─── Ambient interactive particles & mesh gradients ──────────────── */
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030612]/30 dark:bg-[#030612]/80">
      <AmbientCanvasBackground />
      {/* Mesh blob 1: Violet */}
      <div
        className="absolute -top-1/4 -left-1/4 h-[90vh] w-[90vh] rounded-full opacity-20 dark:opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(124,92,255,0.5) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "floatBlob1 25s ease-in-out infinite",
        }}
      />
      {/* Mesh blob 2: Orange/Coral */}
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[80vh] w-[80vh] rounded-full opacity-15 dark:opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255,107,74,0.45) 0%, transparent 70%)",
          filter: "blur(100px)",
          animation: "floatBlob2 30s ease-in-out infinite",
        }}
      />
      {/* Mesh blob 3: Cyan center glow */}
      <div
        className="absolute top-1/3 left-1/3 h-[50vh] w-[50vh] rounded-full opacity-10 dark:opacity-15"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
          filter: "blur(90px)",
          animation: "floatSlow1 28s ease-in-out infinite",
        }}
      />

      {/* Grid texture */}
      <div className="absolute inset-0 grid-texture opacity-[0.15] dark:opacity-[0.25]" />
    </div>
  );
}

/* ─── Logo ──────────────────────────────────────────────────────────── */
function AuthLogo() {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
      <div className="relative grid h-10 w-10 place-items-center rounded-2xl overflow-hidden shadow-lg border border-border-subtle bg-input-bg/10 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
        <Zap className="relative z-10 h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-base font-black tracking-tight text-text">
        NIK&apos;s <span className="bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] bg-clip-text text-transparent">AI</span>
      </span>
    </Link>
  );
}

/* ─── Layout ────────────────────────────────────────────────────────── */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text transition-colors duration-300 flex flex-col relative">
      <AmbientBackground />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full z-10">
        <AuthLogo />
        <div className="flex items-center gap-2 rounded-full bg-input-bg/40 border border-border-subtle px-3 py-1.5 text-xs font-bold text-muted/80 shadow-sm hover:border-[#7C5CFF]/30 transition-colors">
          <Shield className="h-3.5 w-3.5 text-[#22C55E]" />
          <span>Secure Connection</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_#22C55E] animate-ping" />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-8 z-10 [perspective:1400px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-muted/30 z-10 font-medium">
        © 2026 NIK&apos;s AI · All rights reserved
      </footer>
    </div>
  );
}
