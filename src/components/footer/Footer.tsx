"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowUpRight, Heart } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/lib/auth-context";

/* ─── Data ──────────────────────────────────────────────────────────── */
const FOOTER_LINKS = {
  Platform: [
    { label: "Python Track", href: "#learn" },
    { label: "JavaScript Track", href: "#learn" },
    { label: "Projects", href: "#projects" },
    { label: "Exam Mode", href: "#" },
    { label: "AI Tutor", href: "#features" },
    { label: "Visual Debugger", href: "#features" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#", badge: "Hiring" },
    { label: "Press Kit", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Community: [
    { label: "Discord", href: "#" },
    { label: "GitHub", href: "#" },
    { label: "Twitter / X", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Newsletter", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Refund Policy", href: "#" },
  ],
};

const SOCIAL_LINKS = [
  { label: "Twitter", href: "#", emoji: "𝕏" },
  { label: "GitHub", emoji: "⌥", href: "#" },
  { label: "Discord", emoji: "💬", href: "#" },
  { label: "YouTube", emoji: "▶", href: "#" },
];

const STATUS_ITEMS = [
  { label: "Platform", status: "operational" },
  { label: "Code Execution", status: "operational" },
  { label: "AI Tutor", status: "operational" },
];

/* ─── Logo ──────────────────────────────────────────────────────────── */
function FooterLogo() {
  return (
    <Link href={ROUTES.HOME} className="flex items-center gap-3 group w-fit">
      <div className="relative grid h-10 w-10 place-items-center rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        <Zap className="relative z-10 h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-white">
          NIK's <span className="bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] bg-clip-text text-transparent">AI</span>
        </div>
        <div className="text-[11px] text-white/35 font-mono tracking-wider">
          Python · JavaScript
        </div>
      </div>
    </Link>
  );
}

/* ─── Newsletter ────────────────────────────────────────────────────── */
function NewsletterForm() {
  return (
    <div className="mt-6">
      <p className="text-xs text-white/40 mb-3 font-mono uppercase tracking-widest">
        Weekly engineering insights
      </p>
      <form
        className="flex flex-col sm:flex-row gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          placeholder="you@example.com"
          className="flex-1 min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#7C5CFF]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#7C5CFF]/20"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] active:scale-100"
        >
          Join
        </button>
      </form>
      <p className="mt-2 text-xs text-white/25">No spam. Unsubscribe anytime.</p>
    </div>
  );
}

/* ─── Status ────────────────────────────────────────────────────────── */
function StatusBar() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      {STATUS_ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E] shadow-[0_0_4px_rgba(34,197,94,0.8)] animate-pulse" />
          <span className="text-xs text-white/35">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
export default function Footer() {
  const year = 2026;

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06]">
      {/* Ambient gradient top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(124,92,255,0.3) 0%, transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
          className="relative overflow-hidden rounded-3xl my-12 sm:my-16 p-6 sm:p-8 md:p-12 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,107,74,0.12) 0%, rgba(124,92,255,0.12) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* BG decoration */}
          <div className="pointer-events-none absolute inset-0 grid-texture opacity-20" />

          <div className="relative z-10">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#FF6B4A]/25 bg-[#FF6B4A]/[0.08] px-4 py-1.5 text-sm text-[#FF6B4A] font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
              Free Trial — No Credit Card
            </div>

            <h2 className="text-display mt-4 text-white max-w-2xl mx-auto text-2xl sm:text-4xl">
              Stop watching.{" "}
              <span className="gradient-text-primary">Start building.</span>
            </h2>

            <p className="mt-4 text-white/55 max-w-lg mx-auto text-base">
              Join 25,000+ engineers who chose depth over breadth. Your first line of code is one click away.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={ROUTES.SIGNUP ?? "#"}
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-8 py-4 font-semibold text-white shadow-[0_8px_32px_rgba(255,107,74,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,107,74,0.4)]"
              >
                Start Learning Free
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-8 py-4 font-semibold text-white/80 transition-all hover:bg-white/[0.1] hover:text-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Links grid */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 pb-10 sm:pb-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <FooterLogo />
            <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs">
              The engineering education platform built for depth. Not for vanity metrics.
            </p>
            <NewsletterForm />
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, { label: string; href: string; badge?: string }[]][]).map(
            ([section, links]) => (
              <div key={section}>
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/35 font-mono">
                  {section}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-white/50 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                        {link.badge && (
                          <span className="rounded-full bg-[#22C55E]/15 px-2 py-0.5 text-[10px] font-semibold text-[#22C55E]">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/[0.05] py-5 sm:py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-white/30">
              © {year} NIK's AI. All rights reserved.
            </p>
            <StatusBar />
          </div>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.03] text-sm text-white/45 transition-all duration-200 hover:bg-white/[0.09] hover:text-white hover:border-white/15"
              >
                {s.emoji}
              </Link>
            ))}
          </div>
        </div>

        {/* "Made with" strip */}
        <div className="pb-4 text-center">
          <p className="inline-flex items-center gap-1.5 text-xs text-white/20">
            Built with <Heart className="h-3 w-3 fill-[#FF6B4A] text-[#FF6B4A]" /> in India · Python · Next.js · TypeScript
          </p>
        </div>
      </div>
    </footer>
  );
}
