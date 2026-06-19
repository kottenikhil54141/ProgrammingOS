import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text overflow-x-hidden transition-colors duration-300">
      {children}
    </div>
  );
}
