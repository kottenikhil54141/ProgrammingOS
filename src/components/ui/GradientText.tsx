"use client";

import { cn } from "@/utils/cn";

interface GradientTextProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "white";
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}

export default function GradientText({
  children,
  variant = "primary",
  className,
  as: Tag = "span",
}: GradientTextProps) {
  const gradients = {
    primary:
      "bg-gradient-to-r from-[#FF6B4A] via-[#FF9966] to-[#7C5CFF] bg-clip-text text-transparent",
    secondary:
      "bg-gradient-to-r from-[#7C5CFF] to-[#A78BFF] bg-clip-text text-transparent",
    white:
      "bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent",
  };

  return (
    <Tag className={cn(gradients[variant], className)}>
      {children}
    </Tag>
  );
}
