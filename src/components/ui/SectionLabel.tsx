"use client";

import { cn } from "@/utils/cn";

interface SectionLabelProps {
  children: React.ReactNode;
  color?: "primary" | "secondary" | "success";
  className?: string;
}

export default function SectionLabel({
  children,
  color = "primary",
  className,
}: SectionLabelProps) {
  const dotColors = {
    primary: "bg-[#FF6B4A]",
    secondary: "bg-[#7C5CFF]",
    success: "bg-[#22C55E]",
  };

  const borderColors = {
    primary: "border-[#FF6B4A]/25",
    secondary: "border-[#7C5CFF]/25",
    success: "border-[#22C55E]/25",
  };

  const textColors = {
    primary: "text-[#FF6B4A]",
    secondary: "text-[#7C5CFF]",
    success: "text-[#22C55E]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium tracking-wide backdrop-blur-sm",
        "bg-white/[0.03]",
        borderColors[color],
        textColors[color],
        className
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full animate-pulse",
          dotColors[color]
        )}
      />
      {children}
    </div>
  );
}
