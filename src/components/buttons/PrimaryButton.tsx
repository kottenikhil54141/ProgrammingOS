"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface PrimaryButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function PrimaryButton({
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-orange-500/30 active:translate-y-0 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}