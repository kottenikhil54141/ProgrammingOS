"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/components/theme-provider";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Sparkles,
  Play,
  CheckCircle,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { TabId } from "../sidebar/Sidebar";

interface TopbarProps {
  onMenuClick: () => void;
  setActiveTab: (tab: TabId) => void;
  onNotificationsClick: () => void;
  unreadCount: number;
}

export default function Topbar({
  onMenuClick,
  setActiveTab,
  onNotificationsClick,
  unreadCount,
}: TopbarProps) {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Raycast-style command menu options
  const commands = [
    { label: "Practice DSA Questions", action: () => setActiveTab("practice"), desc: "Solve challenges", icon: CheckCircle },
    { label: "Account Settings", action: () => setActiveTab("settings"), desc: "Manage profile configurations", icon: ChevronDown },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="relative flex min-h-[96px] py-3 w-full items-center justify-between border-b border-border-subtle bg-surface/40 backdrop-blur-md px-6 select-none z-40 text-text transition-colors duration-300">
      {/* Left: Mobile menu toggle + Page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="flex lg:hidden p-2 rounded-xl border border-border-subtle bg-input-bg text-muted hover:text-text"
          aria-label="Open navigation drawer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden md:flex flex-col gap-1.5">
          {/* Appearance Theme Selector Pill */}
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-black tracking-widest text-muted/60 uppercase">Appearance Theme</span>
            <div className="flex items-center gap-1 rounded-xl border border-border-subtle bg-input-bg/40 p-0.5 w-64">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all duration-200 outline-none",
                  theme === "light"
                    ? "bg-white dark:bg-white/10 text-[#FF6B4A] dark:text-[#A78BFF] shadow-sm"
                    : "text-muted hover:text-text"
                )}
              >
                <Sun className="h-3 w-3" />
                Light
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all duration-200 outline-none",
                  theme === "dark"
                    ? "bg-white dark:bg-white/10 text-[#FF6B4A] dark:text-[#A78BFF] shadow-sm"
                    : "text-muted hover:text-text"
                )}
              >
                <Moon className="h-3 w-3" />
                Dark
              </button>
              <button
                onClick={() => setTheme("system")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all duration-200 outline-none",
                  theme === "system"
                    ? "bg-white dark:bg-white/10 text-[#FF6B4A] dark:text-[#A78BFF] shadow-sm"
                    : "text-muted hover:text-text"
                )}
              >
                <Monitor className="h-3 w-3" />
                System
              </button>
            </div>
          </div>

          {/* Raycast-style search launcher */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 rounded-xl border border-border-subtle bg-input-bg hover:bg-border-subtle/50 pl-4 pr-3 py-1.5 text-xs text-muted transition-colors w-64 text-left outline-none"
          >
            <Search className="h-3.5 w-3.5 text-muted/60" />
            <span className="flex-1 text-[10px]">Search workspace...</span>
            <kbd className="inline-flex h-4.5 items-center gap-0.5 rounded border border-border-medium bg-input-bg px-1 font-mono text-[8px] font-bold text-muted">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right: Actions, XP indicators, Profiles */}
      <div className="flex items-center gap-2 sm:gap-3.5">
        {/* Level & XP badges */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Lvl {user?.level || 1}
          </div>
          <div className="flex items-center gap-1 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/20 px-3 py-1 text-xs font-semibold text-[#A78BFF]">
            {user?.xp || 0} XP
          </div>
        </div>

        {/* Mobile-only compact theme toggle */}
        <div className="flex md:hidden items-center gap-0.5 rounded-xl border border-border-subtle bg-input-bg/40 p-0.5">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200 outline-none",
              theme === "light" ? "bg-white dark:bg-white/10 text-[#FF6B4A]" : "text-muted hover:text-text"
            )}
            aria-label="Light mode"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200 outline-none",
              theme === "dark" ? "bg-white dark:bg-white/10 text-[#A78BFF]" : "text-muted hover:text-text"
            )}
            aria-label="Dark mode"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme("system")}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-200 outline-none",
              theme === "system" ? "bg-white dark:bg-white/10 text-[#A78BFF]" : "text-muted hover:text-text"
            )}
            aria-label="System mode"
          >
            <Monitor className="h-3 w-3" />
          </button>
        </div>

        {/* Notifications Icon with unread badge */}
        <button
          onClick={onNotificationsClick}
          className="relative p-2.5 rounded-2xl border border-border-subtle bg-input-bg hover:bg-border-subtle/50 text-muted hover:text-text transition-colors outline-none"
          aria-label="Show notifications panel"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-[#FF6B4A]" />
          )}
        </button>

        {/* Quick Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-2 rounded-2xl border border-border-subtle bg-input-bg hover:bg-border-subtle/50 pl-3.5 pr-2.5 py-2 text-sm font-semibold transition-colors outline-none text-text"
          >
            <span>Actions</span>
            <ChevronDown className={cn("h-4 w-4 text-muted/60 transition-transform duration-200", showQuickActions && "rotate-180")} />
          </button>

          <AnimatePresence>
            {showQuickActions && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setShowQuickActions(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-border-subtle bg-surface/90 backdrop-blur-2xl p-2 shadow-2xl z-40"
                >
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setShowQuickActions(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-border-subtle/30 text-text/80 hover:text-text transition-colors"
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-[#7C5CFF]" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("learn");
                      setShowQuickActions(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold hover:bg-border-subtle/30 text-text/80 hover:text-text transition-colors"
                  >
                    <Play className="h-3.5 w-3.5 text-emerald-400" />
                    Resume Next Lesson
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Global Raycast search modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border-medium bg-surface/95 backdrop-blur-3xl shadow-2xl"
            >
              {/* Input */}
              <div className="flex items-center border-b border-border-subtle px-4 py-3.5">
                <Search className="h-5 w-5 text-muted/40 mr-3" />
                <input
                  type="text"
                  placeholder="Type a command or search view..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-text placeholder-muted/40 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="rounded-lg border border-border-subtle bg-input-bg px-2 py-1 text-[10px] text-muted hover:text-text"
                >
                  ESC
                </button>
              </div>

              {/* Commands List */}
              <div className="max-h-[300px] overflow-y-auto p-2">
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd) => {
                    const CmdIcon = cmd.icon;
                    return (
                      <button
                        key={cmd.label}
                        onClick={() => {
                          cmd.action();
                          setSearchOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-border-subtle/30 group transition-colors"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-input-bg text-muted group-hover:bg-[#7C5CFF]/25 group-hover:text-[#A78BFF] transition-colors">
                          <CmdIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text">{cmd.label}</p>
                          <p className="text-[10px] text-muted mt-0.5">{cmd.desc}</p>
                        </div>
                        <span className="text-[10px] text-muted/40 group-hover:text-muted/80 font-mono">↵ Go</span>
                      </button>
                    );
                  })
                ) : (
                  <p className="text-center py-8 text-xs text-muted">No commands match your search.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
