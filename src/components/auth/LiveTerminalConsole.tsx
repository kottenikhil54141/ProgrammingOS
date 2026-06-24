"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

export default function LiveTerminalConsole() {
  const [logs, setLogs] = useState<string[]>([
    "[sys] Initializing compiler kernel v2.8...",
    "[sys] Handshaking secure proxy..."
  ]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = [
      "[net] Securing connections (AES-256-GCM)...",
      "[sys] Python & JS runtimes initialized.",
      "[db] Workspace persistence node synchronized.",
      "[ok] Secure sandbox session established.",
      "[sys] Cognitive mentor nodes online.",
      "[ok] Handshake ready. Awaiting user sign-in..."
    ];

    const interval = setInterval(() => {
      setLogs((prev) => {
        const appendedCount = prev.length - 2;
        if (appendedCount >= 0 && appendedCount < list.length) {
          const nextLog = list[appendedCount];
          if (nextLog) return [...prev, nextLog];
        }
        return [
          "[sys] Initializing compiler kernel v2.8...",
          "[sys] Handshaking secure proxy..."
        ];
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-[320px] bg-black/75 backdrop-blur-md border border-white/[0.08] rounded-xl p-3 font-mono text-[9px] text-[#A78BFF] text-left shadow-2xl overflow-hidden h-[90px] flex flex-col justify-between select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5 text-[8px] text-white/40 tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F56]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#27C93F]" />
        </div>
        <span className="flex items-center gap-1 text-[7.5px] font-bold text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ACTIVE
        </span>
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar space-y-1">
        {logs.map((log, index) => {
          if (!log) return null;
          const isOk = log.startsWith("[ok]");
          const isNet = log.startsWith("[net]");
          return (
            <div key={index} className="leading-tight">
              <span className="text-white/20 mr-1.5">&gt;</span>
              <span className={cn(
                isOk ? "text-emerald-400" : isNet ? "text-cyan-400" : "text-white/70"
              )}>
                {log}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
