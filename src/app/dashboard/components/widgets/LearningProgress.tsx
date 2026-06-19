"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap } from "lucide-react";

interface TrackProgress {
  name: string;
  completed: number;
  total: number;
  color: string;
}

export default function LearningProgress() {
  const tracks: TrackProgress[] = [
    { name: "Python Core Engine", completed: 8, total: 24, color: "#22C55E" },
    { name: "JavaScript Advanced Scripting", completed: 12, total: 30, color: "#F59E0B" },
  ];

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl">
      <div className="flex items-center gap-2 mb-5">
        <GraduationCap className="h-5 w-5 text-[#7C5CFF]" />
        <h2 className="text-sm font-bold text-text tracking-tight">Learning Progress</h2>
      </div>

      <div className="space-y-6">
        {tracks.map((track) => {
          const percent = Math.round((track.completed / track.total) * 100);
          return (
            <div key={track.name} className="space-y-2.5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xs font-semibold text-text/80">{track.name}</h3>
                  <p className="text-[10px] text-muted mt-0.5">
                    {track.completed} / {track.total} Lessons Completed
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-muted">{percent}%</span>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full rounded-full bg-border-subtle/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: track.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
