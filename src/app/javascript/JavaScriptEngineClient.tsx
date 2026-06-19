"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  JAVASCRIPT_CURRICULUM,
  CurriculumTopic,
  QuizQuestion,
  InterviewQuestion,
} from "@/services/javascriptCurriculum";
import { JavaScriptProgressService, JavaScriptProgress } from "@/services/javascriptProgress";
import { JSVisualizer, EventLoopFrame } from "@/utils/jsVisualizer";
import WorkspaceIDE from "@/app/python/components/WorkspaceIDE";
import {
  Play,
  RotateCcw,
  Bug,
  HelpCircle,
  MessageSquare,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Bookmark,
  Award,
  ChevronLeft,
  Coins,
  Sparkles,
  Info,
  CheckCircle2,
  FileCode,
  FileText,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MarkdownRenderer from "@/components/MarkdownRenderer";

import { getAIMentorResponse } from "@/utils/aiMentor";

export default function JavaScriptEngineClient() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  // Load progress
  const [progress, setProgress] = useState<JavaScriptProgress | null>(null);

  // Curriculum & Active State
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic>(JAVASCRIPT_CURRICULUM[0]);
  const [activeTab, setActiveTab] = useState<"learn" | "playground" | "chaos" | "quiz" | "interview">("learn");
  const [curriculumMobileOpen, setCurriculumMobileOpen] = useState(false);
  const [copiedExampleIndex, setCopiedExampleIndex] = useState<number | null>(null);

  // Chaos Debug States
  const [chaosCode, setChaosCode] = useState("");
  const [chaosOutput, setChaosOutput] = useState("");
  const [chaosSuccess, setChaosSuccess] = useState(false);
  const [chaosValidating, setChaosValidating] = useState(false);

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Interview States
  const [interviewAnswers, setInterviewAnswers] = useState<Record<number, string>>({});
  const [showInterviewKeys, setShowInterviewKeys] = useState<Record<number, boolean>>({});

  // Active Random Quizzes and Interviews
  const [activeQuizzes, setActiveQuizzes] = useState<QuizQuestion[]>([]);
  const [activeInterviews, setActiveInterviews] = useState<InterviewQuestion[]>([]);

  useEffect(() => {
    if (selectedTopic) {
      function shuffleAndSelect<T>(arr: T[], count: number): T[] {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy.slice(0, count);
      }

      setActiveQuizzes(shuffleAndSelect(selectedTopic.quizzes || [], 10));
      setActiveInterviews(shuffleAndSelect(selectedTopic.interviews || [], 10));
    }
  }, [selectedTopic.id]);

  // AI Mentor Chat States
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "👋 Welcome to the JavaScript Engineering Operating System! Ask me about Variable Scope, closures, JS call stack queues, microtasks, or asynchronous Promise chains!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Load initial progress and setup
  useEffect(() => {
    const loaded = JavaScriptProgressService.getProgress();
    setProgress(loaded);

    // Sync auth context with local storage progress state
    if (user) {
      updateUser({ xp: loaded.xp, level: loaded.level, streak: loaded.streak });
    }

    setChaosCode(selectedTopic.chaosExercise.brokenCode);
  }, []);

  // Update playground & chaos state when topic changes
  useEffect(() => {
    setChaosCode(selectedTopic.chaosExercise.brokenCode);
    setChaosSuccess(false);
    setChaosOutput("");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setInterviewAnswers({});
    setShowInterviewKeys({});
  }, [selectedTopic, progress]);

  // Sync state helper to write back progress
  const syncProgress = (updated: JavaScriptProgress) => {
    setProgress(updated);
    if (user) {
      updateUser({ xp: updated.xp, level: updated.level, streak: updated.streak });
    }
  };

  const handleXpGain = (xpGain: number, coinsGain: number) => {
    if (!progress) return;
    const updated = {
      ...progress,
      xp: progress.xp + xpGain,
      coins: (progress.coins || 0) + coinsGain
    };
    JavaScriptProgressService.saveProgress(updated);
    syncProgress(updated);
  };

  const handleToggleTopicCompletion = (topicId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!progress) return;
    let nextCompleted = [...progress.completedTopics];
    const isCompleted = nextCompleted.includes(topicId);
    if (isCompleted) {
      nextCompleted = nextCompleted.filter((id) => id !== topicId);
    } else {
      nextCompleted.push(topicId);
    }
    const updated = { ...progress, completedTopics: nextCompleted };
    JavaScriptProgressService.saveProgress(updated);
    syncProgress(updated);
  };

  // Validate chaos bugfix
  const handleValidateChaos = () => {
    setChaosValidating(true);
    setChaosOutput("[System: Running validation assertions...]");

    // Combine user code with test assertions
    const combinedScript = `${chaosCode}\n\n// Validation\n${selectedTopic.chaosExercise.validationScript}`;

    const res = JSVisualizer.runCode(combinedScript);

    if (res.error) {
      setChaosOutput(`Compilation error: ${res.error}`);
      setChaosSuccess(false);
    } else {
      setChaosOutput(res.output);
      if (res.output.includes("SUCCESS")) {
        setChaosSuccess(true);
        // Reward user
        if (progress && !progress.completedTopics.includes(selectedTopic.id)) {
          const updated = JavaScriptProgressService.completeTopic(selectedTopic.id, 150, 40);
          syncProgress(updated);
        }
      } else {
        setChaosSuccess(false);
      }
    }
    setChaosValidating(false);
  };

  // Submit topic quiz answers
  const handleSubmitQuiz = () => {
    if (!progress) return;
    let score = 0;
    activeQuizzes.forEach((q) => {
      const ans = quizAnswers[q.id];
      if (ans && ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    const passThreshold = activeQuizzes.length / 2;
    if (score >= passThreshold) {
      const updated = { ...progress, xp: progress.xp + 50, coins: progress.coins + 15 };
      JavaScriptProgressService.saveProgress(updated);
      syncProgress(updated);
    }
  };

  // AI Mentor Chat
  const handleSendMentorMessage = async () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const aiText = await getAIMentorResponse("javascript", userText, selectedTopic as any);
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Error communicating with AI Mentor. Please try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] lg:h-[100dvh] w-full bg-bg text-text lg:overflow-hidden transition-colors duration-300">
      {/* Mobile Curriculum Drawer overlay */}
      <AnimatePresence>
        {curriculumMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCurriculumMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border-subtle flex flex-col justify-between md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                    JavaScript Outline
                  </span>
                  <button
                    onClick={() => setCurriculumMobileOpen(false)}
                    className="p-1 rounded-lg border border-border-subtle hover:bg-surface/80"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-4">
                  {Array.from(new Set(JAVASCRIPT_CURRICULUM.map((t) => t.phase))).map((phaseName) => (
                    <div key={phaseName} className="space-y-1">
                      <h4 className="text-[9px] font-mono font-bold uppercase text-muted/60 px-2.5">
                        {phaseName}
                      </h4>
                      {JAVASCRIPT_CURRICULUM.filter((t) => t.phase === phaseName).map((topic) => {
                        const isCompleted = progress?.completedTopics.includes(topic.id);
                        const isSelected = selectedTopic.id === topic.id;
                        return (
                          <div
                            key={topic.id}
                            onClick={() => {
                              setSelectedTopic(topic);
                              setCurriculumMobileOpen(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-left cursor-pointer transition-all ${
                              isSelected
                                ? "bg-surface border border-border-subtle font-semibold shadow-sm text-text"
                                : "text-muted hover:bg-surface/40 hover:text-text"
                            }`}
                          >
                            <span className="truncate">{topic.title}</span>
                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                              {isCompleted ? (
                                <button
                                  onClick={(e) => handleToggleTopicCompletion(topic.id, e)}
                                  className="focus:outline-none p-0.5 rounded hover:bg-emerald-500/10"
                                  title="Mark as incomplete"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500 hover:scale-110 transition-transform" />
                                </button>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-mono text-muted/40">
                                    {topic.duration}
                                  </span>
                                  <button
                                    onClick={(e) => handleToggleTopicCompletion(topic.id, e)}
                                    className="h-4 w-4 rounded-full border border-muted/40 hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors focus:outline-none flex items-center justify-center"
                                    title="Mark as complete"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 1. Header / Stats */}
      <header className="flex flex-wrap items-center justify-between border-b border-border-subtle bg-surface/70 backdrop-blur-md px-6 py-3 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-surface/80 hover:scale-[1.03] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setCurriculumMobileOpen(true)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-surface/80"
            aria-label="Open curriculum outline"
          >
            <BookOpen className="h-4 w-4 text-[#FF6B4A]" />
          </button>
          <div>
            <h1 className="text-base font-black tracking-tight flex items-center gap-2">
              <span>JavaScript Engine</span>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 border border-amber-500/20 uppercase">
                Sprint 6 Active
              </span>
            </h1>
            <p className="text-[10px] text-muted">V8 compilation, closure tracers & Event Loop simulation</p>
          </div>
        </div>

        {progress && (
          <div className="flex items-center gap-6">
            {/* Level & XP */}
            <div className="hidden sm:flex flex-col items-end gap-1">
              <span className="text-xs font-mono font-bold text-text/90">
                LEVEL {progress.level}
              </span>
              <div className="h-1.5 w-36 rounded-full bg-border-subtle overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] rounded-full transition-all duration-500"
                  style={{ width: `${(progress.xp % 500) / 5}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-muted">{progress.xp} XP total</span>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 px-3.5 py-1.5 border border-amber-500/20">
              <Coins className="h-4 w-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-500">{progress.coins}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-orange-500/10 px-3.5 py-1.5 border border-orange-500/20">
              <span className="text-xs">🔥</span>
              <span className="text-xs font-mono font-bold text-orange-500">{progress.streak} Days</span>
            </div>
          </div>
        )}
      </header>

      {/* 2. Main Workspace Layout */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-visible lg:overflow-hidden">
        {/* Left Sidebar Curriculum */}
        <aside className="w-64 border-r border-border-subtle bg-surface/30 shrink-0 flex flex-col h-full hidden md:flex">
          <div className="p-4 border-b border-border-subtle">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
              JavaScript Curriculum
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {Array.from(new Set(JAVASCRIPT_CURRICULUM.map((t) => t.phase))).map((phaseName) => (
              <div key={phaseName} className="space-y-1">
                <h4 className="text-[9px] font-mono font-bold uppercase text-muted/60 px-2.5">
                  {phaseName}
                </h4>
                {JAVASCRIPT_CURRICULUM.filter((t) => t.phase === phaseName).map((topic) => {
                  const isCompleted = progress?.completedTopics.includes(topic.id);
                  const isSelected = selectedTopic.id === topic.id;
                  return (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopic(topic)}
                      className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-surface border border-border-subtle font-semibold shadow-sm text-text"
                          : "text-muted hover:bg-surface/40 hover:text-text"
                      }`}
                    >
                      <span className="truncate">{topic.title}</span>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {isCompleted ? (
                          <button
                            onClick={(e) => handleToggleTopicCompletion(topic.id, e)}
                            className="focus:outline-none p-0.5 rounded hover:bg-emerald-500/10"
                            title="Mark as incomplete"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 hover:scale-110 transition-transform" />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-muted/40">
                              {topic.duration}
                            </span>
                            <button
                              onClick={(e) => handleToggleTopicCompletion(topic.id, e)}
                              className="h-4 w-4 rounded-full border border-muted/40 hover:border-emerald-500 hover:bg-emerald-500/10 transition-colors focus:outline-none flex items-center justify-center"
                              title="Mark as complete"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* Center Panels Workspace */}
        <div className="flex-1 flex flex-col lg:h-full lg:overflow-hidden bg-bg relative">
          {/* Tabs header */}
          <div className="flex items-center justify-between px-6 border-b border-border-subtle bg-surface/20 shrink-0">
            <div className="flex gap-4">
              {(["learn", "playground", "chaos", "quiz", "interview"] as const).map((tab) => {
                const label = tab === "chaos" ? "Chaos Mode (Debug)" : tab.toUpperCase();
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-3.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors outline-none ${
                      isActive ? "text-[#FF6B4A]" : "text-muted hover:text-text"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderlineJS"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B4A]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-[9px] font-mono text-muted">
              Environment: <span className="font-bold text-emerald-500">Browser V8</span>
            </div>
          </div>

          {/* Tab Content Panels */}
          <div className="flex-1 overflow-visible lg:overflow-y-auto p-6 scrollbar-none">
            <AnimatePresence mode="wait">
              {activeTab === "learn" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl"
                >
                  <div className="rounded-3xl border border-border-subtle bg-surface/60 p-7 backdrop-blur-xl space-y-6 shadow-sm">
                    <div>
                      <h2 className="text-3xl font-black tracking-tight text-text">
                        {selectedTopic.title}
                      </h2>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedTopic.objectives.map((obj) => (
                          <span
                            key={obj}
                            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-[10px] font-medium border border-border-subtle text-muted"
                          >
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            {obj}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border-subtle pt-6">
                      <MarkdownRenderer content={selectedTopic.theory} />
                    </div>

                    {/* Practical Examples section */}
                    {selectedTopic.examples && selectedTopic.examples.length > 0 && (
                      <div className="border-t border-border-subtle pt-6 mt-6">
                        <h3 className="text-base font-black text-text tracking-tight mb-4 flex items-center gap-2">
                          <FileCode className="h-4 w-4 text-[#7C5CFF]" />
                          Practical Examples
                        </h3>
                        <div className="grid gap-4">
                          {selectedTopic.examples.map((example, exIdx) => (
                            <div key={exIdx} className="rounded-2xl border border-border-subtle bg-surface/20 p-4 space-y-2">
                              <h4 className="text-xs font-bold text-text">{example.title}</h4>
                              <p className="text-[11px] text-muted leading-relaxed">{example.description}</p>
                              
                              <div className="rounded-xl border border-border-subtle/50 bg-[#0B0F19]/40 overflow-hidden mt-2">
                                <div className="flex items-center justify-between px-3 py-1.5 bg-[#0B0F19]/20 border-b border-border-subtle/30 text-[9px] font-mono text-muted">
                                  <span>EXAMPLE {exIdx + 1}</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(example.code);
                                      setCopiedExampleIndex(exIdx);
                                      setTimeout(() => setCopiedExampleIndex(null), 2000);
                                    }}
                                    className="flex items-center gap-1 rounded bg-surface/20 hover:bg-surface/50 px-1.5 py-0.5 text-[8px] font-semibold text-muted transition-all cursor-pointer"
                                  >
                                    {copiedExampleIndex === exIdx ? "Copied!" : "Copy"}
                                  </button>
                                </div>
                                <div className="p-3 overflow-x-auto">
                                  <pre className="font-mono text-xs text-text/90 leading-relaxed whitespace-pre select-text">{example.code}</pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setActiveTab("playground")}
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-6 py-3 text-xs font-semibold text-white transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      Enter Code Playground
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === "playground" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex flex-col gap-6"
                >
                  <WorkspaceIDE
                    topicId={selectedTopic.id}
                    templateCode={selectedTopic.templateCode}
                    examples={selectedTopic.examples}
                    onXpGain={handleXpGain}
                    defaultLanguage="javascript"
                  />
                </motion.div>
              )}

              {activeTab === "chaos" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-4xl"
                >
                  <div className="rounded-3xl border border-border-subtle bg-surface p-6 space-y-4">
                    <div className="flex items-center gap-2.5">
                      <Bug className="h-5 w-5 text-[#FF6B4A]" />
                      <h3 className="text-lg font-black tracking-tight">
                        Chaos Mode: {selectedTopic.chaosExercise.title}
                      </h3>
                    </div>
                    <p className="text-sm text-text/80 leading-relaxed">
                      {selectedTopic.chaosExercise.description}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Editor */}
                      <div className="rounded-2xl border border-border-subtle bg-surface flex flex-col overflow-hidden">
                        <div className="px-4 py-2 border-b border-border-subtle bg-surface/50 text-[10px] font-mono font-bold text-muted flex justify-between items-center">
                          <span>broken_app.js</span>
                          <button
                            onClick={() =>
                              setChaosCode(selectedTopic.chaosExercise.brokenCode)
                            }
                            className="text-[9px] hover:text-text font-bold"
                          >
                            Reset Code
                          </button>
                        </div>
                        <textarea
                          value={chaosCode}
                          onChange={(e) => setChaosCode(e.target.value)}
                          className="h-64 bg-transparent p-4 font-mono text-sm outline-none resize-none text-text"
                        />
                      </div>

                      {/* Assertions log */}
                      <div className="rounded-2xl border border-border-subtle bg-slate-950 flex flex-col overflow-hidden text-white">
                        <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02] text-[10px] font-mono font-bold text-white/50">
                          Verification Output
                        </div>
                        <div className="flex-1 p-4 font-mono text-xs space-y-2 overflow-y-auto">
                          {chaosOutput ? (
                            <pre className="whitespace-pre-wrap">{chaosOutput}</pre>
                          ) : (
                            <span className="text-white/20 italic">
                              Run validations to check scope values.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border-subtle pt-4">
                      <div>
                        {chaosSuccess ? (
                          <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4" />
                            Bug Resolved! +150 XP & +40 Coins awarded
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-muted">
                            Correct variable scopes or asynchronous flow return keys.
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleValidateChaos}
                        disabled={chaosValidating}
                        className="rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-6 py-3 text-xs font-bold text-white hover:opacity-90 shadow-md"
                      >
                        {chaosValidating ? "Running Assertions..." : "Run Assertions"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-3xl"
                >
                  <div className="rounded-3xl border border-border-subtle bg-surface p-6 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-[#7C5CFF]" />
                      <h3 className="text-lg font-black">
                        Adaptive Quiz Checkpoint
                      </h3>
                    </div>

                    <div className="space-y-6 divide-y divide-border-subtle">
                      {activeQuizzes.map((q, idx) => (
                        <div key={q.id} className="pt-6 first:pt-0 space-y-3">
                          <h4 className="text-sm font-bold text-text flex items-start gap-2">
                            <span className="font-mono text-muted text-xs">0{idx + 1}.</span>
                            <span>{q.question}</span>
                          </h4>

                          {q.type === "mcq" && q.options && (
                            <div className="grid sm:grid-cols-2 gap-3 pl-6">
                              {q.options.map((opt, oIdx) => {
                                const isSelected = quizAnswers[q.id] === String(oIdx);
                                return (
                                  <button
                                    key={opt}
                                    onClick={() =>
                                      !quizSubmitted &&
                                      setQuizAnswers((prev) => ({ ...prev, [q.id]: String(oIdx) }))
                                    }
                                    className={`rounded-xl px-4 py-2.5 text-xs text-left border transition-all ${
                                      isSelected
                                        ? "bg-[#7C5CFF]/10 border-[#7C5CFF] font-semibold text-[#7C5CFF]"
                                        : "bg-surface border-border-subtle hover:bg-surface/80"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {quizSubmitted && (
                            <div className="pl-6 text-xs text-muted/80 bg-surface/30 p-3.5 rounded-xl border border-border-subtle leading-relaxed">
                              <span className="font-bold text-text block mb-1">
                                {quizAnswers[q.id]?.trim().toLowerCase() ===
                                q.correctAnswer.trim().toLowerCase()
                                  ? "✅ Correct Answer!"
                                  : `❌ Incorrect. Correct answer: ${q.correctAnswer}`}
                              </span>
                              {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t border-border-subtle pt-6">
                      <div>
                        {quizSubmitted ? (
                          <span className="text-xs font-bold text-[#7C5CFF]">
                            Quiz Finished! Score: {quizScore}/{activeQuizzes.length}
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted font-mono">
                            Pass with at least 50% to claim Coins & XP.
                          </span>
                        )}
                      </div>
                      {!quizSubmitted ? (
                        <button
                          onClick={handleSubmitQuiz}
                          className="rounded-2xl bg-[#7C5CFF] px-6 py-3 text-xs font-bold text-white hover:opacity-90"
                        >
                          Submit Answers
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                            setQuizScore(0);
                          }}
                          className="rounded-2xl border border-border-subtle bg-surface px-6 py-3 text-xs font-bold text-muted hover:text-text"
                        >
                          Retry Checkpoint
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "interview" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 max-w-3xl"
                >
                  <div className="rounded-3xl border border-border-subtle bg-surface p-6 space-y-6 shadow-sm">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#FF6B4A]" />
                      <h3 className="text-lg font-black">
                        Interview Simulation Question Pack
                      </h3>
                    </div>

                    <div className="space-y-6 divide-y divide-border-subtle">
                      {activeInterviews.map((item, idx) => (
                        <div key={idx} className="pt-6 first:pt-0 space-y-3">
                          <h4 className="text-sm font-bold text-text flex gap-2">
                            <span className="font-mono text-muted text-xs">Q{idx + 1}.</span>
                            <span>{item.question}</span>
                          </h4>

                          <textarea
                            value={interviewAnswers[idx] || ""}
                            onChange={(e) =>
                              setInterviewAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                            }
                            placeholder="Draft your explanation for the interviewer..."
                            className="w-full h-24 rounded-xl border border-border-subtle bg-surface p-4 text-xs outline-none focus:border-[#FF6B4A] resize-none text-text"
                          />

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                setShowInterviewKeys((prev) => ({ ...prev, [idx]: !prev[idx] }))
                              }
                              className="text-[10px] font-mono text-[#FF6B4A] font-bold"
                            >
                              {showInterviewKeys[idx] ? "Hide Evaluation Key" : "Reveal Evaluation Key"}
                            </button>
                          </div>

                          {showInterviewKeys[idx] && (
                            <div className="rounded-xl border border-border-subtle bg-surface/40 p-4 text-xs space-y-2">
                              <p className="font-semibold text-text">Model Answer:</p>
                              <p className="text-muted/95 italic leading-relaxed">{item.answer}</p>
                              <div className="pt-2 border-t border-border-subtle">
                                <p className="font-semibold text-text mb-1">Key Rubric Points:</p>
                                <ul className="list-disc pl-4 space-y-1 text-muted/80">
                                  {item.rubric.map((r) => (
                                    <li key={r}>{r}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar AI Mentor Chat */}
        <aside className="w-80 border-l border-border-subtle bg-surface/30 shrink-0 flex flex-col h-full hidden lg:flex">
          <div className="p-4 border-b border-border-subtle flex items-center gap-2 bg-surface/50">
            <MessageSquare className="h-4 w-4 text-[#FF6B4A]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
              AI Mentor Panel
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[90%] ${
                  m.sender === "user"
                    ? "bg-[#FF6B4A]/10 text-text ml-auto border border-[#FF6B4A]/25"
                    : "bg-surface border border-border-subtle text-muted"
                }`}
              >
                {m.text.split("\n").map((line, lIdx) => (
                  <p key={lIdx} className="mb-1 last:mb-0">
                    {line}
                  </p>
                ))}
              </div>
            ))}
            {isTyping && (
              <div className="rounded-2xl p-3 bg-surface border border-border-subtle text-xs text-muted max-w-[90%] italic">
                AI Mentor is thinking...
              </div>
            )}
          </div>

          {/* Quick prompt links */}
          <div className="px-4 py-2 border-t border-border-subtle bg-surface/20 flex flex-wrap gap-1">
            <button
              onClick={() => setInputMessage(`Explain code for ${selectedTopic.title}`)}
              className="text-[9px] font-mono border border-border-subtle rounded-lg px-2 py-0.5 bg-surface hover:bg-surface/80"
            >
              Explain Topic
            </button>
            <button
              onClick={() => setInputMessage("Give me a hint for the closure bug")}
              className="text-[9px] font-mono border border-border-subtle rounded-lg px-2 py-0.5 bg-surface hover:bg-surface/80"
            >
              Get Hint
            </button>
            <button
              onClick={() => setInputMessage("Explain how Promise microtasks work")}
              className="text-[9px] font-mono border border-border-subtle rounded-lg px-2 py-0.5 bg-surface hover:bg-surface/80"
            >
              Explain Microtasks
            </button>
          </div>

          {/* Input Chat Field */}
          <div className="p-4 border-t border-border-subtle bg-surface/50 flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMentorMessage()}
              placeholder="Ask AI Mentor a question..."
              className="flex-1 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-xs outline-none focus:border-[#FF6B4A] text-text"
            />
            <button
              onClick={handleSendMentorMessage}
              className="rounded-xl bg-[#FF6B4A] px-3.5 text-xs font-bold text-white"
            >
              Send
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
