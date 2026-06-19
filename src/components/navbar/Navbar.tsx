"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  X,
  ChevronDown,
  Moon,
  SunMedium,
  Monitor,
  Command,
  Zap,
  BookOpen,
  Code2,
  FolderKanban,
  GraduationCap,
  Terminal,
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import { useTheme } from "@/components/theme-provider";

/* ─── Nav Items ────────────────────────────────────────────────────── */
const navItems = [
  { label: "Learn",     href: ROUTES.SIGNUP, icon: BookOpen },
  { label: "Practice",  href: ROUTES.SIGNUP, icon: Code2 },
  { label: "Projects",  href: "/#projects",  icon: FolderKanban },
  { label: "Exam",      href: ROUTES.SIGNUP, icon: GraduationCap },
  { label: "Developer", href: ROUTES.SIGNUP, icon: Terminal },
];

/* ─── Search Palette ───────────────────────────────────────────────── */
const PALETTE_ITEMS = [
  { label: "Python Basics",      tag: "Course",   icon: "🐍" },
  { label: "JavaScript ES2025",  tag: "Course",   icon: "⚡" },
  { label: "Interview Problems", tag: "Practice", icon: "💼" },
  { label: "Exam Mode",          tag: "Exam",     icon: "📝" },
  { label: "AI Code Debugger",   tag: "AI",       icon: "🤖" },
  { label: "System Design",      tag: "Dev",      icon: "🏗️" },
];

function SearchPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filtered = PALETTE_ITEMS.filter(
    (i) =>
      query === "" ||
      i.label.toLowerCase().includes(query.toLowerCase()) ||
      i.tag.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg mx-4 overflow-hidden rounded-3xl border border-border-medium bg-surface/95 shadow-2xl backdrop-blur-2xl"
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border-subtle">
          <Search className="h-5 w-5 text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, topics, projects..."
            className="flex-1 bg-transparent text-text placeholder-muted/50 outline-none text-sm"
          />
          <kbd className="text-xs text-muted border border-border-subtle rounded-lg px-2 py-1 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-[340px] overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted">No results found</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.label}
                onClick={onClose}
                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-surface/50 transition-colors text-left"
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text/90 truncate">{item.label}</div>
                </div>
                <span className="text-xs text-muted border border-border-subtle rounded-full px-2 py-0.5 shrink-0">
                  {item.tag}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="px-5 py-3 border-t border-border-subtle flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Command className="h-3 w-3" /> K to open
          </span>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Theme Toggle ─────────────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const label = mounted ? theme : "system";
  const ActiveIcon = !mounted
    ? Monitor
    : resolvedTheme === "dark"
    ? Moon
    : SunMedium;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-2xl border border-border-subtle bg-surface/50 px-3 py-2 text-sm text-text/90 backdrop-blur-xl transition-all duration-300 hover:bg-surface hover:border-border-medium"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-surface/80 border border-border-subtle">
          <ActiveIcon className="h-4 w-4" />
        </span>
        <span className="hidden capitalize sm:inline">{label}</span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 top-[calc(100%+10px)] z-50 w-44 overflow-hidden rounded-2xl border border-border-subtle bg-surface/95 shadow-2xl backdrop-blur-2xl"
          >
            {[
              { value: "light",  label: "Light",  icon: SunMedium },
              { value: "dark",   label: "Dark",   icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => { setTheme(item.value as "light" | "dark" | "system"); setOpen(false); }}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-surface/80",
                    theme === item.value ? "text-[#FF6B4A] font-semibold" : "text-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {theme === item.value && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FF6B4A]" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Mobile Theme Toggle ─────────────────────────────────────────── */
function MobileThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="w-full space-y-2">
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted block text-center">
        Appearance Theme
      </span>
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-border-subtle bg-surface/30 p-1">
        {[
          { value: "light", label: "Light", icon: SunMedium },
          { value: "dark", label: "Dark", icon: Moon },
          { value: "system", label: "System", icon: Monitor },
        ].map((item) => {
          const Icon = item.icon;
          const active = theme === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTheme(item.value as "light" | "dark" | "system")}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-300",
                active
                  ? "bg-[#FF6B4A]/10 text-[#FF6B4A] border border-[#FF6B4A]/20 shadow-sm"
                  : "text-muted hover:text-text hover:bg-surface/50 border border-transparent"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Logo ─────────────────────────────────────────────────────────── */
function Logo() {
  return (
    <Link href={ROUTES.HOME} prefetch={true} className="flex items-center gap-3 group">
      <div className="relative grid h-11 w-11 place-items-center rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300" />
        <Zap className="relative z-10 h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-bold tracking-tight text-text group-hover:text-text/90 transition-colors">
          NIK's <span className="bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] bg-clip-text text-transparent">AI</span>
        </div>
        <div className="text-[11px] text-muted font-mono tracking-wider">
          Python · JavaScript
        </div>
      </div>
    </Link>
  );
}

/* ─── Navbar ───────────────────────────────────────────────────────── */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 20);
  });

  // CMD+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <AnimatePresence>
        {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      <motion.header
        className={cn(
          "sticky top-0 z-40 transition-all duration-500",
          scrolled
            ? "border-b border-border-subtle bg-bg/85 backdrop-blur-2xl"
            : "border-b border-transparent bg-transparent"
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto flex h-16 sm:h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-muted transition-all duration-200 hover:bg-surface hover:text-text"
                >
                  <Icon className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2.5 lg:flex">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 items-center gap-2.5 rounded-xl border border-border-subtle bg-surface/40 px-3 text-sm text-muted transition-all hover:bg-surface hover:text-text hover:border-border-medium"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:block">Search...</span>
              <kbd className="hidden xl:flex items-center gap-0.5 text-xs border border-border-subtle rounded-lg px-1.5 py-0.5 font-mono text-muted">
                <Command className="h-2.5 w-2.5" />K
              </kbd>
            </button>

            <ThemeToggle />

            <Link
              href={ROUTES.LOGIN}
              prefetch={true}
              className="rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm font-semibold text-text transition-all hover:bg-surface/80 hover:border-border-medium"
            >
              Login
            </Link>

            <Link href={ROUTES.SIGNUP} prefetch={true}>
              <PrimaryButton className="h-10 px-5 text-sm rounded-xl shimmer">
                Sign Up Free
              </PrimaryButton>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-border-subtle bg-surface text-text backdrop-blur-xl transition-all hover:bg-surface/80 lg:hidden"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }}>
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }}>
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-border-subtle bg-bg/95 backdrop-blur-2xl lg:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6">
                {/* Search */}
                <button
                  onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                  className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-sm text-muted"
                >
                  <Search className="h-4 w-4" />
                  <span>Search courses, topics...</span>
                </button>

                {/* Nav links */}
                <div className="grid gap-1.5">
                  {navItems.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface/40 px-4 py-3.5 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-text"
                        >
                          <Icon className="h-4 w-4 text-muted" />
                          {item.label}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA buttons */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    href={ROUTES.LOGIN}
                    prefetch={true}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-border-subtle bg-surface px-4 py-3.5 text-center text-sm font-semibold text-text"
                  >
                    Login
                  </Link>
                  <Link
                    href={ROUTES.SIGNUP}
                    prefetch={true}
                    onClick={() => setMobileOpen(false)}
                    className="block"
                  >
                    <PrimaryButton className="w-full py-3.5 rounded-2xl">
                      Sign Up Free
                    </PrimaryButton>
                  </Link>
                </div>

                <div className="pt-2">
                  <MobileThemeToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}