"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, GraduationCap, Play, FileQuestion } from "lucide-react";
import { cn } from "@/utils/cn";

interface Question {
  id: string;
  category: "DSA" | "System Design" | "Behavioral";
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export default function InterviewTracker() {
  const questions: Question[] = [
    { id: "q1", category: "DSA", title: "Two Sum (Array Hashing)", difficulty: "Easy" },
    { id: "q2", category: "DSA", title: "Reverse Linked List", difficulty: "Easy" },
    { id: "q3", category: "DSA", title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
    { id: "q4", category: "DSA", title: "Container With Most Water", difficulty: "Medium" },
    { id: "q5", category: "System Design", title: "Design a Rate Limiter (Token Bucket)", difficulty: "Medium" },
    { id: "q6", category: "System Design", title: "Design a Distributed Key-Value Store", difficulty: "Hard" },
    { id: "q7", category: "Behavioral", title: "Describe a project conflict & how you resolved it", difficulty: "Medium" },
  ];

  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState<"All" | "DSA" | "System Design" | "Behavioral">("All");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("programmingos_interview_questions");
      if (saved) {
        setCompletedIds(JSON.parse(saved));
      }
    }
  }, []);

  function toggleComplete(id: string) {
    let updated: string[];
    if (completedIds.includes(id)) {
      updated = completedIds.filter((x) => x !== id);
    } else {
      updated = [...completedIds, id];
    }
    setCompletedIds(updated);
    localStorage.setItem("programmingos_interview_questions", JSON.stringify(updated));
  }

  const filtered = questions.filter((q) => filter === "All" || q.category === filter);
  const completedCount = questions.filter((q) => completedIds.includes(q.id)).length;
  const progressPct = questions.length > 0 ? Math.round((completedCount / questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight font-sans">Interview Prep Tracker</h1>
          <p className="text-xs text-muted mt-1 leading-relaxed font-sans">
            Crack top tier companies with organized DSA routines, system architecture prep, and behavioral checkups.
          </p>
        </div>

        {/* Global Progress */}
        <div className="flex items-center gap-4 bg-surface/50 border border-border-subtle rounded-2xl p-4 shrink-0">
          <div className="h-10 w-10 rounded-full border-2 border-border-subtle flex items-center justify-center font-mono text-xs font-bold text-[#7C5CFF]">
            {progressPct}%
          </div>
          <div>
            <p className="text-xs font-bold text-text leading-none font-sans">Completion Progress</p>
            <p className="text-[10px] text-muted mt-1 font-mono">
              {completedCount} of {questions.length} topics mastered
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Filter Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-border-subtle pb-3">
        {(["All", "DSA", "System Design", "Behavioral"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-semibold transition-all outline-none font-sans",
              filter === cat
                ? "bg-[#7C5CFF]/15 text-[#A78BFF] border border-[#7C5CFF]/20"
                : "text-muted hover:text-text hover:bg-surface/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Questions Checklist Column */}
        <div className="md:col-span-2 space-y-3">
          {filtered.map((q) => {
            const isCompleted = completedIds.includes(q.id);
            return (
              <div
                key={q.id}
                onClick={() => toggleComplete(q.id)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all duration-200 select-none",
                  isCompleted
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-border-subtle bg-surface/30 hover:border-border-medium"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted/30 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text truncate font-sans">{q.title}</p>
                    <span className="text-[9px] font-mono text-muted mt-0.5 block">
                      {q.category}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    "text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border",
                    q.difficulty === "Easy"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : q.difficulty === "Medium"
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  )}
                >
                  {q.difficulty}
                </span>
              </div>
            );
          })}
        </div>

        {/* Action Widgets Sidebar */}
        <div className="space-y-6">
          {/* Quick Mock interview */}
          <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl shadow-card">
            <GraduationCap className="h-6 w-6 text-[#7C5CFF] mb-4" />
            <h3 className="text-xs font-bold text-text leading-none font-sans">Simulate Mock Interview</h3>
            <p className="text-[10px] text-muted mt-1 leading-relaxed font-sans">
              Launch an interactive session with the AI Mentor based on React/Node runtime questions.
            </p>
            <button className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] p-2.5 text-xs font-semibold text-white shadow-md hover:scale-[1.01] transition-transform outline-none font-sans">
              <span>Start Session</span>
              <Play className="h-3 w-3 fill-current transition-transform group-hover:scale-110" />
            </button>
          </div>

          {/* Quick behavioral tip */}
          <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl shadow-card">
            <FileQuestion className="h-6 w-6 text-amber-400 mb-4" />
            <h3 className="text-xs font-bold text-text leading-none font-sans">STAR Methodology</h3>
            <p className="text-[10px] text-muted mt-1 leading-relaxed font-sans">
              Use Situation, Task, Action, Result to structure complex engineering challenge responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
