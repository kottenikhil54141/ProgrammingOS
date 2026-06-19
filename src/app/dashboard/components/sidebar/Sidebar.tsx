"use client";

import { useAuth } from "@/lib/auth-context";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import {
  Home,
  BookOpen,
  Code2,
  Terminal,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import SignOutModal from "@/components/auth/SignOutModal";
import { useState } from "react";

export type TabId =
  | "home"
  | "learn"
  | "practice"
  | "projects"
  | "mentor"
  | "playground"
  | "interview"
  | "resume"
  | "portfolio"
  | "settings";

interface SidebarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  className?: string;
  isMobileDrawer?: boolean;
  onClose?: () => void;
}

const MENU_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "learn", label: "Learn", icon: BookOpen },
  { id: "practice", label: "Practice", icon: Code2 },
  { id: "playground", label: "Playground", icon: Terminal },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  className,
  isMobileDrawer = false,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "relative flex flex-col h-full lg:h-screen overflow-hidden border-r border-border-subtle bg-surface/85 backdrop-blur-2xl text-text select-none transition-all duration-300",
          collapsed ? "px-3" : "px-4",
          className
        )}
      >
        {/* Brand logo area */}
        <div className="flex h-20 items-center justify-between px-2.5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] shadow-[0_0_15px_rgba(124,92,255,0.4)] text-white font-extrabold text-lg">
              N
            </div>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-base font-black tracking-tight"
              >
                NIK&apos;s <span className="bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] bg-clip-text text-transparent">AI</span>
              </motion.span>
            )}
          </Link>

          {/* Collapse toggle / Close button */}
          {isMobileDrawer ? (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border-subtle bg-input-bg hover:bg-border-subtle/50 text-muted hover:text-text transition-colors outline-none"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg border border-border-subtle bg-input-bg hover:bg-border-subtle/50 text-muted hover:text-text transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 space-y-1.5 py-4 overflow-y-auto scrollbar-none">
          {MENU_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabId)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl py-3 px-3.5 text-sm font-semibold transition-all duration-300 outline-none select-none",
                  isActive
                    ? "bg-gradient-to-r from-[#FF6B4A]/10 to-[#7C5CFF]/10 text-text shadow-[inset_0_1px_0_var(--color-border-subtle)] border border-[#7C5CFF]/20"
                    : "text-muted border border-transparent hover:text-text hover:bg-border-subtle/30"
                )}
              >
                {/* Active ambient glow bar */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-5 rounded-r bg-gradient-to-b from-[#FF6B4A] to-[#7C5CFF] shadow-[0_0_8px_#7C5CFF]"
                  />
                )}

                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-[#7C5CFF]" : "text-muted group-hover:text-text"
                  )}
                />

                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Tooltip on collapsed state */}
                {collapsed && (
                  <div className="pointer-events-none absolute left-16 z-50 rounded-lg bg-surface border border-border-medium px-2 py-1 text-xs opacity-0 shadow-xl transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-2 text-text">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile / Logout Area */}
        <div className="border-t border-border-subtle py-4 flex flex-col gap-2.5">
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-2xl bg-input-bg border border-border-subtle">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#7C5CFF]/20 text-xs font-bold text-[#7C5CFF] border border-[#7C5CFF]/30">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text truncate">{user?.name}</p>
                <p className="text-[10px] text-muted font-mono truncate">Lvl {user?.level || 1} • {user?.xp || 0} XP</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowSignOutConfirm(true)}
            className={cn(
              "group flex w-full items-center gap-3 rounded-xl py-3 px-3.5 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all outline-none",
              collapsed && "justify-center"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0 text-red-400 group-hover:scale-105" />
            {!collapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      <SignOutModal
        isOpen={showSignOutConfirm}
        onClose={() => setShowSignOutConfirm(false)}
        onConfirm={logout}
      />
    </>
  );
}
