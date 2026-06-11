import type { ReactNode } from "react";
import Link from "next/link";
import { Zap } from "lucide-react";
import { ROUTES } from "@/constants/routes";

/* ─── Ambient particles (CSS-only, no JS) ────────────────────────── */
function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Primary violet blob */}
      <div
        className="absolute -top-1/4 -left-1/4 h-[80vh] w-[80vh] rounded-full opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(124,92,255,0.6) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "floatBlob1 22s ease-in-out infinite",
        }}
      />
      {/* Orange accent blob */}
      <div
        className="absolute -bottom-1/4 -right-1/4 h-[70vh] w-[70vh] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,74,0.6) 0%, transparent 70%)",
          filter: "blur(80px)",
          animation: "floatBlob2 28s ease-in-out infinite",
        }}
      />
      {/* Grid texture */}
      <div className="absolute inset-0 grid-texture opacity-30" />
    </div>
  );
}

/* ─── Logo ──────────────────────────────────────────────────────────── */
function AuthLogo() {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-3 group">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
        <Zap className="relative z-10 h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <span className="text-[15px] font-bold tracking-tight text-white group-hover:text-white/90 transition-colors">
        CodeVerseAI
      </span>
    </Link>
  );
}

/* ─── Layout ────────────────────────────────────────────────────────── */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col">
      <AmbientBackground />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
        <AuthLogo />
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span>Secure connection</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-5 text-center text-xs text-white/20">
        © {new Date().getFullYear()} CodeVerseAI · All rights reserved
      </footer>
    </div>
  );
}
