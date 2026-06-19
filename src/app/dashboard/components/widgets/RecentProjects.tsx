"use client";

import { useState } from "react";
import { FolderGit2, Play, ExternalLink } from "lucide-react";
import { cn } from "@/utils/cn";
import { TabId } from "../sidebar/Sidebar";

interface Project {
  id: string;
  name: string;
  status: "active" | "completed";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tech: string[];
  progress: number;
}

export default function RecentProjects({ setActiveTab }: { setActiveTab: (tab: TabId) => void }) {
  const [projects] = useState<Project[]>([
    {
      id: "p1",
      name: "FastAPI Code Evaluator",
      status: "active",
      difficulty: "Intermediate",
      tech: ["Python", "FastAPI", "Docker"],
      progress: 45,
    },
    {
      id: "p2",
      name: "Custom Virtual DOM",
      status: "completed",
      difficulty: "Advanced",
      tech: ["TypeScript", "HTML5", "Vite"],
      progress: 100,
    },
  ]);

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-[#7C5CFF]" />
          <h2 className="text-sm font-bold text-text tracking-tight">Recent Projects</h2>
        </div>
        <button
          onClick={() => setActiveTab("projects")}
          className="text-xs text-[#7C5CFF] hover:underline bg-transparent border-0 cursor-pointer"
        >
          View all
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((project) => {
          const isActive = project.status === "active";
          return (
            <div
              key={project.id}
              className="flex flex-col justify-between rounded-2xl border border-border-subtle bg-surface/20 hover:border-border-subtle/50 p-4 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border",
                      project.difficulty === "Advanced"
                        ? "bg-red-500/10 border-red-500/20 text-red-400"
                        : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    )}
                  >
                    {project.difficulty}
                  </span>
                  <span className="text-[10px] text-muted font-mono">{project.progress}%</span>
                </div>

                <h3 className="text-xs font-bold text-text mt-3 truncate">{project.name}</h3>

                <div className="flex flex-wrap gap-1 mt-2.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-border-subtle/30 px-1.5 py-0.5 text-[9px] font-mono text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between">
                {isActive ? (
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="flex items-center gap-1.5 text-[10px] font-bold text-[#7C5CFF] hover:text-[#A78BFF] transition-colors outline-none bg-transparent border-0 cursor-pointer"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    Resume Code
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-[#22C55E] flex items-center gap-1">
                    ✓ Completed
                  </span>
                )}

                <button className="text-muted hover:text-text transition-colors bg-transparent border-0 cursor-pointer" aria-label="Open project repository">
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
