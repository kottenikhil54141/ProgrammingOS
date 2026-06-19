"use client";

import { Bell, Trophy, BookOpen, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

export interface SystemNotification {
  id: string;
  title: string;
  body: string;
  type: "achievement" | "lesson" | "system" | "mission";
  read: boolean;
  time: string;
}

interface NotificationsMenuProps {
  notifications: SystemNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onClearItem: (id: string) => void;
}

export default function NotificationsMenu({
  notifications,
  onClose,
  onMarkAllRead,
  onClearItem,
}: NotificationsMenuProps) {
  return (
    <>
      {/* Background click interceptor */}
      <div className="fixed inset-0 z-30" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute right-6 top-20 w-80 origin-top-right rounded-3xl border border-white/10 bg-[#0C1024]/95 backdrop-blur-3xl p-4 shadow-2xl z-40 text-white"
      >
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4.5 w-4.5 text-[#7C5CFF]" />
            <span className="text-xs font-bold">Notifications</span>
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-[10px] font-mono text-[#A78BFF] hover:underline"
          >
            Mark all read
          </button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2.5 pr-1 scrollbar-none">
          {notifications.length > 0 ? (
            notifications.map((n) => {
              const Icon =
                n.type === "achievement"
                  ? Trophy
                  : n.type === "lesson"
                  ? BookOpen
                  : n.type === "mission"
                  ? Sparkles
                  : AlertCircle;

              return (
                <div
                  key={n.id}
                  onClick={() => onClearItem(n.id)}
                  className={cn(
                    "relative flex gap-3 rounded-2xl p-3 text-left cursor-pointer transition-colors border",
                    n.read
                      ? "border-transparent bg-white/[0.01]"
                      : "border-[#7C5CFF]/15 bg-[#7C5CFF]/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  )}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/60">
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white leading-snug">{n.title}</p>
                    <p className="text-[9px] text-white/45 mt-0.5 leading-relaxed">{n.body}</p>
                    <span className="text-[8px] font-mono text-white/20 mt-1 block">{n.time}</span>
                  </div>

                  {!n.read && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B4A] shrink-0 self-center" />
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center py-8 text-xs text-white/20">All caught up! No notifications.</p>
          )}
        </div>
      </motion.div>
    </>
  );
}
