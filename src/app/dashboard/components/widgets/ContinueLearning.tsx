"use client";

import { useState } from "react";
import { BookOpen, Bookmark, Play, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TabId } from "../sidebar/Sidebar";
import { PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgress } from "@/services/javascriptProgress";
import { PYTHON_CURRICULUM } from "@/services/pythonCurriculum";
import { JAVASCRIPT_CURRICULUM } from "@/services/javascriptCurriculum";

interface ContinueLearningProps {
  setActiveTab: (tab: TabId) => void;
  pythonProgress: PythonProgress | null;
  jsProgress: JavaScriptProgress | null;
}

export default function ContinueLearning({
  setActiveTab,
  pythonProgress,
  jsProgress,
}: ContinueLearningProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const router = useRouter();

  // Python Stats
  const totalPython = PYTHON_CURRICULUM.length;
  const completedPython = pythonProgress?.completedTopics.length || 0;
  const percentPython = totalPython > 0 ? Math.round((completedPython / totalPython) * 100) : 0;
  const nextPythonTopic = PYTHON_CURRICULUM.find(
    (topic) => !pythonProgress?.completedTopics.includes(topic.id)
  ) || PYTHON_CURRICULUM[0];

  // JS Stats
  const totalJS = JAVASCRIPT_CURRICULUM.length;
  const completedJS = jsProgress?.completedTopics.length || 0;
  const percentJS = totalJS > 0 ? Math.round((completedJS / totalJS) * 100) : 0;
  const nextJSTopic = JAVASCRIPT_CURRICULUM.find(
    (topic) => !jsProgress?.completedTopics.includes(topic.id)
  ) || JAVASCRIPT_CURRICULUM[0];

  // Default track preference: show whichever has more progress
  const [selectedTrack, setSelectedTrack] = useState<"python" | "javascript">(
    completedJS > completedPython ? "javascript" : "python"
  );

  const isPython = selectedTrack === "python";
  const activeTopic = isPython ? nextPythonTopic : nextJSTopic;
  const activePercent = isPython ? percentPython : percentJS;
  const activeTotal = isPython ? totalPython : totalJS;
  const activeCompleted = isPython ? completedPython : completedJS;
  const routePath = isPython ? "/python" : "/javascript";
  const trackName = isPython ? "Python Engine" : "JavaScript Engine";

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#FF6B4A]" />
            <h2 className="text-sm font-bold text-text tracking-tight">Active Lesson</h2>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => setSelectedTrack(isPython ? "javascript" : "python")}
              className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted hover:text-[#7C5CFF] transition-colors"
            >
              Switch Track ⇋
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-1.5 rounded-lg border border-border-subtle bg-surface hover:bg-surface/80 text-muted hover:text-text transition-colors"
              aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this lesson"}
            >
              <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? "text-amber-400 fill-amber-400" : ""}`} />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span
              className={`text-[9px] font-bold font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                isPython
                  ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                  : "text-amber-500 bg-amber-500/10 border-amber-500/20"
              }`}
            >
              {trackName}
            </span>
            <h3 className="text-sm font-bold text-text mt-3.5 leading-snug">
              {activeTopic ? activeTopic.title : "All Completed!"}
            </h3>
            <p className="text-[11px] text-muted mt-1.5 leading-relaxed min-h-[40px]">
              {activeTopic
                ? activeTopic.objectives[0] || "Master the concepts and complete the interactive sandbox validation."
                : "Congratulations! You have completed all lessons in this curriculum track."}
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted font-mono">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-muted/30" />
              <span>{activeTopic ? activeTopic.duration : "0m"} remaining</span>
            </div>
            <span>{activePercent}% completed</span>
          </div>

          {/* Progress track */}
          <div className="h-1.5 w-full rounded-full bg-border-subtle overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPython ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-amber-500 to-orange-400"
              }`}
              style={{ width: `${activePercent}%` }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => router.push(routePath)}
        className="group mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-surface border border-border-subtle hover:bg-surface/80 p-2.5 text-xs font-semibold text-text transition-all outline-none"
      >
        <Play className="h-3.5 w-3.5 text-[#7C5CFF] fill-[#7C5CFF]/15 group-hover:scale-110 transition-transform" />
        <span>Resume Lesson</span>
      </button>
    </div>
  );
}
