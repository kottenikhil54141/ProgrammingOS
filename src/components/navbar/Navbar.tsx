"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X, ChevronDown, Moon, SunMedium, Monitor } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/constants/routes";
import PrimaryButton from "@/components/buttons/PrimaryButton";

const navItems = [
  { label: "Learn", href: "#" },
  { label: "Practice", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Exam", href: "#" },
  { label: "Developer", href: "#" },
];

type ThemeValue = "light" | "dark" | "system";

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme: ThemeValue = (mounted ? theme : "system") as ThemeValue;
  const activeTheme = currentTheme === "system" ? systemTheme : currentTheme;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 backdrop-blur-xl transition-all duration-300 hover:bg-white/10"
      >
        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10">
          {activeTheme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : activeTheme === "light" ? (
            <SunMedium className="h-4 w-4" />
          ) : (
            <Monitor className="h-4 w-4" />
          )}
        </span>
        <span className="hidden sm:inline capitalize">{currentTheme}</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-[calc(100%+12px)] z-50 w-40 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/90 shadow-2xl backdrop-blur-2xl"
          >
            {[
              { value: "light", label: "Light", icon: SunMedium },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  onClick={() => {
                    setTheme(item.value);
                    setOpen(false);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-white/85 transition-colors hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1020]/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={ROUTES.HOME} className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 text-sm font-bold text-white shadow-lg shadow-orange-500/20">
            P
          </div>
          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight text-white">
              ProgrammingOS
            </div>
            <div className="text-xs text-white/50">Python + JavaScript</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/85 backdrop-blur-xl transition-all hover:bg-white/10"
          >
            <Search className="h-4 w-4" />
          </button>

          <ThemeToggle />

          <Link
            href={ROUTES.LOGIN}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition-all hover:bg-white/10"
          >
            Login
          </Link>

          <PrimaryButton className="px-5 py-2.5">
            Signup
          </PrimaryButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/90 backdrop-blur-xl transition-all hover:bg-white/10 lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-[#0b1020]/95 px-4 py-4 backdrop-blur-2xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="grid h-11 flex-1 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/85"
                >
                  <Search className="h-4 w-4" />
                </button>
                <ThemeToggle />
              </div>

              <div className="grid gap-2 pt-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition-colors hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href={ROUTES.LOGIN}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-semibold text-white/90"
                >
                  Login
                </Link>
                <PrimaryButton className="py-3" onClick={() => setMobileOpen(false)}>
                  Signup
                </PrimaryButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}