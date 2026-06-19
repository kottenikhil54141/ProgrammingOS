import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md"
    >
      <div
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10 glass-surface"
      >
        {/* Top glow */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full opacity-35"
          style={{
            background: "radial-gradient(circle, rgba(124, 92, 255, 0.8) 0%, transparent 70%)",
            filter: "blur(24px)",
          }}
        />

        {/* Header */}
        <div className="mb-8 text-center relative z-10">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h1>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
