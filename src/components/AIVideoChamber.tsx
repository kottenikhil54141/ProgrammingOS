"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, Volume2, Video, Sparkles, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CurriculumTopic {
  id: string;
  title: string;
  phase: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: string;
  objectives: string[];
  theory: string;
  templateCode: string;
}

interface AIVideoChamberProps {
  topic: CurriculumTopic;
  defaultLanguage?: "python" | "javascript";
}

interface LectureSlide {
  slideTitle: string;
  bulletPoints: string[];
  narrativeText: string;
  codeSnippet?: string;
}

export default function AIVideoChamber({ topic, defaultLanguage = "python" }: AIVideoChamberProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [subtitleProgress, setSubtitleProgress] = useState(0);
  const [subtitles, setSubtitles] = useState("");
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate slides dynamically based on topic properties
  const generateSlides = (t: CurriculumTopic): LectureSlide[] => {
    const title = t.title;
    const objectives = t.objectives || ["Understand core declarations"];
    const code = t.templateCode || "";

    return [
      {
        slideTitle: `Module 1: Conceptual Foundations of ${title}`,
        bulletPoints: [
          `Architectural Goal: Maximizing execution clarity and scope isolation.`,
          ...objectives.map((obj, idx) => `Milestone ${idx + 1}: ${obj}`),
          `Performance Impact: Bound by standard runtime evaluation models.`
        ],
        narrativeText: `Greetings, developer. Welcome to this AI-guided briefing on ${title}. In this module, we will dissect the syntax, runtime mechanics, and optimization patterns of this topic. Our specific targets include: ${objectives.join(", and ")}. Let's begin by observing the basic architecture.`,
      },
      {
        slideTitle: `Module 2: Practical Syntax & API Anatomy`,
        bulletPoints: [
          `Declaration Pattern: Clear expressions and block scopes.`,
          `Memory Reference: Objects allocated dynamically in heap space.`,
          `Edge Cases: Safety boundaries and type checks at runtime.`
        ],
        narrativeText: `Let's transition to code anatomy. When invoking these APIs, the engine binds reference labels in the current scope. Understanding this mapping is crucial to avoiding variable leakage and thread race conditions. Inspect the implementation template shown in the code segment.`,
        codeSnippet: code,
      },
      {
        slideTitle: `Module 3: Core Optimization & Debugging`,
        bulletPoints: [
          `Production Patterns: Structuring clean, decoupled modules.`,
          `Memory Hygiene: Avoiding retention leaks in persistent loops.`,
          `Best Practices: Strict compliance with language design guidelines.`
        ],
        narrativeText: `Finally, let's explore optimization rules. In enterprise environments, write clean methods and minimize global scope references. Always include robust error boundaries to handle unexpected connection failures or system exceptions. Excellent. Let's move to the playground to execute this code.`,
      }
    ];
  };

  const slides = generateSlides(topic);
  const currentSlide = slides[currentSlideIndex];

  // Reset slide and states when topic changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setIsPlaying(false);
    setSubtitleProgress(0);
    setSubtitles("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  }, [topic]);

  // Subtitle writing animation and slide auto-advance
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (!isPlaying) return;

    const fullText = currentSlide.narrativeText;
    let charIndex = Math.floor((subtitleProgress / 100) * fullText.length);

    const intervalMs = Math.max(20, 60 / playbackSpeed);

    timerRef.current = setInterval(() => {
      charIndex += 2; // Write 2 characters at a time for smooth pacing
      if (charIndex >= fullText.length) {
        setSubtitles(fullText);
        setSubtitleProgress(100);
        setIsPlaying(false);
        clearInterval(timerRef.current!);

        // Auto advance to next slide after a short delay
        setTimeout(() => {
          if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex((prev) => prev + 1);
            setSubtitleProgress(0);
            setSubtitles("");
            setIsPlaying(true);
          }
        }, 1500);
      } else {
        setSubtitles(fullText.slice(0, charIndex));
        setSubtitleProgress(Math.floor((charIndex / fullText.length) * 100));
      }
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentSlideIndex, playbackSpeed, topic]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setSubtitleProgress(0);
      setSubtitles("");
      setIsPlaying(false);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setSubtitleProgress(0);
      setSubtitles("");
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#070A13] text-white rounded-2xl overflow-hidden border border-[#7C5CFF]/20 shadow-2xl relative">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,255,0.08),transparent_50%)] pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0E1324]/80 border-b border-border-subtle/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? "bg-emerald-400" : "bg-amber-400"} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-[#7C5CFF]" />
            Interactive AI Briefing Room
          </span>
        </div>
        <div className="text-[10px] font-mono text-muted">
          Slide {currentSlideIndex + 1} / {slides.length}
        </div>
      </div>

      {/* Main Chamber Body */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden relative">
        {/* Left Column: AI visualizer and narration transcript */}
        <div className="md:col-span-5 flex flex-col justify-between p-5 border-r border-[#7C5CFF]/10 bg-[#0A0D18]/90">
          
          {/* AI Talking Avatar Visualization */}
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div
                animate={isPlaying ? { scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] } : { scale: 1, opacity: 0.15 }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute h-24 w-24 rounded-full bg-[#7C5CFF]/25 border border-[#7C5CFF]/40"
              />
              {/* Middle pulsing ring */}
              <motion.div
                animate={isPlaying ? { scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] } : { scale: 1, opacity: 0.3 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="absolute h-18 w-18 rounded-full bg-[#7C5CFF]/30 border border-[#7C5CFF]/60"
              />
              {/* Inner Core */}
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#FF6B4A] flex items-center justify-center shadow-lg shadow-[#7C5CFF]/20">
                <Volume2 className={`h-5 w-5 text-white ${isPlaying ? "animate-pulse" : ""}`} />
              </div>
            </div>

            <span className="text-[10px] font-mono font-bold tracking-wider text-text/60 mt-4 uppercase">
              AI Instructor: Active
            </span>

            {/* Audio Waveform visualization */}
            <div className="flex items-center gap-1 mt-3 h-5">
              {[...Array(9)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={
                    isPlaying
                      ? { height: [4, [8, 18, 12, 6][i % 4], 4] }
                      : { height: 4 }
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + (i * 0.08),
                    ease: "easeInOut",
                  }}
                  className="w-0.75 bg-gradient-to-t from-[#7C5CFF] to-[#A78BFF] rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Narration script transcript */}
          <div className="flex-1 bg-black/40 rounded-xl border border-border-subtle/50 p-4 overflow-y-auto max-h-[140px] md:max-h-[180px] my-2">
            <h4 className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
              <Terminal className="h-3 w-3 text-text/40" />
              Live Subtitles
            </h4>
            <p className="text-xs font-sans text-text/80 leading-relaxed min-h-[50px] select-text">
              {subtitles || <span className="text-muted italic">Click play to begin the lecture...</span>}
            </p>
          </div>
        </div>

        {/* Right Column: Virtual Slide Presentation Board */}
        <div className="md:col-span-7 flex flex-col p-5 bg-[#070A13]/95 justify-between relative overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex-1 flex flex-col justify-start"
            >
              {/* Slide Title */}
              <h2 className="text-sm font-black tracking-tight text-white mb-4 border-b border-border-subtle/40 pb-2">
                {currentSlide.slideTitle}
              </h2>

              {/* Slide Bullet Points */}
              <ul className="space-y-3 pl-1 mb-4">
                {currentSlide.bulletPoints.map((point, idx) => (
                  <motion.li
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx}
                    className="flex items-start gap-2 text-[11px] text-text/85 leading-relaxed"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF] shrink-0 mt-1.5" />
                    <span className="flex-1">{point}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Render optional code block */}
              {currentSlide.codeSnippet && (
                <div className="rounded-xl border border-border-subtle bg-black/40 overflow-hidden shadow-inner mt-auto">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#0D111A] border-b border-border-subtle/40 text-[8px] font-mono text-muted">
                    <span>LECTURE SPECIMEN ({defaultLanguage.toUpperCase()})</span>
                  </div>
                  <div className="p-3 overflow-x-auto max-h-[140px]">
                    <pre className="font-mono text-[10px] text-text/90 leading-relaxed whitespace-pre">
                      {currentSlide.codeSnippet}
                    </pre>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Control Action Bar */}
      <div className="px-4 py-3 bg-[#0E1324]/80 border-t border-border-subtle/50 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md z-10">
        {/* Navigation buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className="p-1.5 rounded-lg bg-surface/30 hover:bg-surface/60 border border-border-subtle disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            title="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className="p-1.5 rounded-lg bg-surface/30 hover:bg-surface/60 border border-border-subtle disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            title="Next Slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Playback Progress & Control */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={handlePlayToggle}
            className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#7C5CFF] to-[#FF6B4A] flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5 text-white" />
            ) : (
              <Play className="h-3.5 w-3.5 text-white translate-x-0.5" />
            )}
          </button>
          {/* Progress Bar */}
          <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-border-subtle/40">
            <div
              style={{ width: `${subtitleProgress}%` }}
              className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#FF6B4A] transition-all duration-300"
            />
          </div>
        </div>

        {/* Speed settings */}
        <div className="flex items-center gap-1.5">
          {[1, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2 py-1 rounded text-[9px] font-mono font-bold border transition-all cursor-pointer ${
                playbackSpeed === speed
                  ? "bg-[#7C5CFF] border-[#7C5CFF] text-white"
                  : "bg-surface/20 border-border-subtle text-muted hover:bg-surface/50"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
