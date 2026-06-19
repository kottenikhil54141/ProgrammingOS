"use client";

import { Sparkles, Code2, ShieldAlert, BookOpen, MessageSquareCode } from "lucide-react";
import { motion } from "framer-motion";
import { TabId } from "../sidebar/Sidebar";

export default function MentorWidget({ setActiveTab }: { setActiveTab: (tab: TabId) => void }) {
  const options = [
    { label: "Debug Code", desc: "Find runtime and syntax bugs", icon: ShieldAlert, color: "#EF4444" },
    { label: "Explain Logic", desc: "Line-by-line description", icon: Code2, color: "#7C5CFF" },
    { label: "Generate Quiz", desc: "Mock checkups on current path", icon: BookOpen, color: "#F59E0B" },
  ];

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-[#7C5CFF]" />
        <h2 className="text-sm font-bold text-text tracking-tight">AI Mentor Actions</h2>
      </div>

      <div className="space-y-2.5">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.label}
              onClick={() => setActiveTab("mentor")}
              className="flex w-full items-center gap-3 rounded-2xl border border-border-subtle bg-surface/20 hover:border-border-subtle/50 p-3 text-left transition-all outline-none cursor-pointer"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-border-subtle/30"
                style={{ color: opt.color }}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text leading-none">{opt.label}</p>
                <p className="text-[10px] text-muted mt-0.5 truncate">{opt.desc}</p>
              </div>
            </button>
          );
        })}

        <button
          onClick={() => setActiveTab("mentor")}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 hover:bg-[#7C5CFF]/20 p-2.5 text-xs font-semibold text-[#A78BFF] transition-all outline-none cursor-pointer"
        >
          <MessageSquareCode className="h-4 w-4" />
          <span>Open Mentor Chat</span>
        </button>
      </div>
    </div>
  );
}
