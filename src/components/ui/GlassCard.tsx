"use client";

import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        `
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/10
        dark:bg-white/5
        backdrop-blur-2xl
        shadow-[0_8px_32px_rgba(0,0,0,0.15)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_16px_48px_rgba(0,0,0,0.25)]
        `,
        className
      )}
    >
      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-white/10
        via-transparent
        to-white/5
        pointer-events-none
        "
      />

      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  );
}