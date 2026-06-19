"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  PYTHON_CURRICULUM,
  CurriculumTopic,
  QuizQuestion,
  InterviewQuestion,
} from "@/services/pythonCurriculum";
import { PythonProgressService, PythonProgress } from "@/services/pythonProgress";
import { PyodideRunner, TraceFrame } from "@/utils/pyodideRunner";
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
  Key,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import WorkspaceIDE from "./components/WorkspaceIDE";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import AIVideoChamber from "@/components/AIVideoChamber";

import { getAIMentorResponse, initializeAIMentor, isRealAIAvailable, getAIMentorStatus } from "@/utils/aiMentor";

const PHASE_STYLES: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  "Phase 1: Foundations": { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-500", glow: "shadow-orange-500/5" },
  "Phase 2: Control Flow": { bg: "bg-indigo-500/10", border: "border-indigo-500/30", text: "text-indigo-500", glow: "shadow-indigo-500/5" },
  "Phase 3: Data Structures": { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-500", glow: "shadow-emerald-500/5" },
  "Phase 4: Functions": { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-500", glow: "shadow-purple-500/5" },
  "Phase 5: Modules & Files": { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-500", glow: "shadow-pink-500/5" },
  "Phase 6: OOP Structures": { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-500", glow: "shadow-amber-500/5" },
  "Phase 7: Advanced Python": { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-500", glow: "shadow-cyan-500/5" },
  "Phase 8: Standard Library": { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-500", glow: "shadow-rose-500/5" },
  "Phase 9: Real-World Projects": { bg: "bg-teal-500/10", border: "border-teal-500/30", text: "text-teal-500", glow: "shadow-teal-500/5" },
};

export default function PythonEngineClient() {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  // Load progress
  const [progress, setProgress] = useState<PythonProgress | null>(null);

  // Curriculum & Active State
  const [selectedTopic, setSelectedTopic] = useState<CurriculumTopic>(PYTHON_CURRICULUM[0]);
  const [activeTab, setActiveTab] = useState<"learn" | "playground" | "chaos" | "quiz" | "interview">("learn");
  const [curriculumMobileOpen, setCurriculumMobileOpen] = useState(false);
  const [copiedExampleIndex, setCopiedExampleIndex] = useState<number | null>(null);
  const [videoMode, setVideoMode] = useState<"youtube" | "ai">("youtube");

  // Sidebar visibility states
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [mentorPanelOpen, setMentorPanelOpen] = useState(false);

  // Collapsible phases state
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Auto-expand current phase on mount or selectedTopic change
  useEffect(() => {
    if (selectedTopic) {
      setExpandedPhases((prev) => ({
        ...prev,
        [selectedTopic.phase]: true
      }));
    }
  }, [selectedTopic]);

  // Playground States
  const [editorCode, setEditorCode] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPyodideLoading, setIsPyodideLoading] = useState(true);

  // Trace Visualizer States
  const [traceFrames, setTraceFrames] = useState<TraceFrame[]>([]);
  const [traceIndex, setTraceIndex] = useState(-1);
  const [isPlayingTrace, setIsPlayingTrace] = useState(false);
  const traceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Chaos Debug States
  const [chaosCode, setChaosCode] = useState("");
  const [chaosOutput, setChaosOutput] = useState("");
  const [chaosSuccess, setChaosSuccess] = useState(false);
  const [chaosValidating, setChaosValidating] = useState(false);
  const [chaosExerciseIndex, setChaosExerciseIndex] = useState(0);

  // Derived: current active chaos exercise from the pool
  const activeChaosExercise =
    selectedTopic.chaosExercises?.[chaosExerciseIndex] ??
    selectedTopic.chaosExercise;

  // Shuffle to a new (different) random chaos exercise
  const handleShuffleChaos = () => {
    const pool = selectedTopic.chaosExercises ?? [selectedTopic.chaosExercise];
    if (pool.length <= 1) return;
    let newIdx: number;
    do {
      newIdx = Math.floor(Math.random() * pool.length);
    } while (newIdx === chaosExerciseIndex && pool.length > 1);
    setChaosExerciseIndex(newIdx);
    setChaosCode(pool[newIdx].brokenCode);
    setChaosOutput("");
    setChaosSuccess(false);
  };

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
      text: "I am focused on your current Python topic. Ask for a line-by-line explanation, a Chaos Mode fix, or a runnable practice example.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // AI API Configuration States
  const [showAPIConfig, setShowAPIConfig] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiProvider, setApiProvider] = useState<"openai" | "custom">("openai");
  const [customEndpoint, setCustomEndpoint] = useState("");
  const [customModel, setCustomModel] = useState("gpt-4o-mini");
  const [aiStatus, setAiStatus] = useState(getAIMentorStatus());
  const [autonomousAIStatus, setAutonomousAIStatus] = useState<{
    configured: boolean;
    model?: string;
  }>({ configured: false });

  // Load initial progress and setup Pyodide
  useEffect(() => {
    const loaded = PythonProgressService.getProgress();
    setProgress(loaded);

    // Sync auth context with local storage progress state
    if (user) {
      updateUser({ xp: loaded.xp, level: loaded.level, streak: loaded.streak });
    }

    // Load playground code for first topic
    setEditorCode(PythonProgressService.getTopicCode(selectedTopic.id, selectedTopic.templateCode));
    // Pick a random exercise from the pool on initial load
    const pool = selectedTopic.chaosExercises ?? [selectedTopic.chaosExercise];
    const randomIdx = Math.floor(Math.random() * pool.length);
    setChaosExerciseIndex(randomIdx);
    setChaosCode(pool[randomIdx].brokenCode);

    // Pre-load Pyodide runner background script
    import("@/utils/pyodideRunner")
      .then((mod) => mod.PyodideRunner.warmup())
      .then(() => setIsPyodideLoading(false))
      .catch((err) => {
        console.error("Pyodide script failed to load:", err);
        setIsPyodideLoading(false);
      });
  }, []);

  // Update playground & chaos state when topic changes
  useEffect(() => {
    if (progress) {
      setEditorCode(PythonProgressService.getTopicCode(selectedTopic.id, selectedTopic.templateCode));
    } else {
      setEditorCode(selectedTopic.templateCode);
    }
    // Pick a random chaos exercise from the pool on every topic change
    const pool = selectedTopic.chaosExercises ?? [selectedTopic.chaosExercise];
    const randomIdx = Math.floor(Math.random() * pool.length);
    setChaosExerciseIndex(randomIdx);
    setChaosCode(pool[randomIdx].brokenCode);
    setTerminalLogs([]);
    setTraceFrames([]);
    setTraceIndex(-1);
    setChaosSuccess(false);
    setChaosOutput("");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setInterviewAnswers({});
    setShowInterviewKeys({});
  }, [selectedTopic, progress]);

  // Sync state helper to write back progress
  const syncProgress = (updated: PythonProgress) => {
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
      coins: progress.coins + coinsGain
    };
    PythonProgressService.saveProgress(updated);
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
    PythonProgressService.saveProgress(updated);
    syncProgress(updated);
  };

  // Run python script in playground
  const handleRunCode = async () => {
    setIsRunning(true);
    setTerminalLogs(["[System: Compiling & Executing in WASM runtime...]"]);

    const res = await PyodideRunner.runCode(editorCode, (text) => {
      setTerminalLogs((prev) => [...prev, text]);
    });

    if (res.error) {
      setTerminalLogs((prev) => [...prev, `\nTraceback (most recent call last):\n${res.error}`]);
    } else {
      setTerminalLogs((prev) => [...prev, "\n[Process finished successfully]"]);
    }
    setIsRunning(false);

    // If successfully run, reward minor XP for practice (10 XP)
    if (!res.error && progress) {
      const updated = { ...progress, xp: progress.xp + 10 };
      PythonProgressService.saveProgress(updated);
      syncProgress(updated);
    }
  };

  // Compile execution frames for visual trace
  const handleGenerateTrace = async () => {
    setIsRunning(true);
    setTerminalLogs(["[System: Generating memory allocation traces...]"]);
    const res = await PyodideRunner.traceCode(editorCode);

    if (res.error) {
      setTerminalLogs((prev) => [...prev, `\nTracing Error: ${res.error}`]);
      setTraceFrames([]);
      setTraceIndex(-1);
    } else if (res.frames.length > 0) {
      setTraceFrames(res.frames);
      setTraceIndex(0);
      setTerminalLogs((prev) => [...prev, `\n[Traced ${res.frames.length} execution frames successfully]`]);
    } else {
      setTerminalLogs((prev) => [...prev, `\nNo traceable operations found. Add variables or calculations.`]);
    }
    setIsRunning(false);
  };

  // Stepping controls for Trace visualizer
  const stepForward = () => {
    if (traceIndex < traceFrames.length - 1) {
      setTraceIndex((prev) => prev + 1);
    }
  };

  const stepBackward = () => {
    if (traceIndex > 0) {
      setTraceIndex((prev) => prev - 1);
    }
  };

  // Autoplay trace timeline
  useEffect(() => {
    if (isPlayingTrace) {
      traceTimerRef.current = setInterval(() => {
        setTraceIndex((prev) => {
          if (prev < traceFrames.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingTrace(false);
            return prev;
          }
        });
      }, 1500);
    } else {
      if (traceTimerRef.current) clearInterval(traceTimerRef.current);
    }
    return () => {
      if (traceTimerRef.current) clearInterval(traceTimerRef.current);
    };
  }, [isPlayingTrace, traceFrames]);

  // Save changes to playground code
  const handleCodeChange = (val: string) => {
    setEditorCode(val);
    PythonProgressService.saveTopicCode(selectedTopic.id, val);
  };

  // Validate chaos bugfix
  const handleValidateChaos = async () => {
    setChaosValidating(true);
    setChaosOutput("[System: Running validation test cases...]");

    // Combine user's code with the curriculum's test runner assertions
    const combinedScript = `${chaosCode}\n\n# Validation runner\n${activeChaosExercise.validationScript}`;

    const res = await PyodideRunner.runCode(combinedScript);

    if (res.error) {
      setChaosOutput(`Traceback Error:\n${res.error}`);
      setChaosSuccess(false);
    } else {
      setChaosOutput(res.output);
      if (res.output.includes("SUCCESS")) {
        setChaosSuccess(true);
        // Reward user
        if (progress && !progress.completedTopics.includes(selectedTopic.id)) {
          const updated = PythonProgressService.completeTopic(selectedTopic.id, 150, 40);
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
    activeQuizzes.forEach((q, idx) => {
      const ans = quizAnswers[q.id];
      if (ans && ans.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
        score++;
      }
    });

    setQuizScore(score);
    setQuizSubmitted(true);

    // Reward XP on quiz pass (passed at least 50%)
    const passThreshold = activeQuizzes.length / 2;
    if (score >= passThreshold) {
      const updated = { ...progress, xp: progress.xp + 50, coins: progress.coins + 15 };
      PythonProgressService.saveProgress(updated);
      syncProgress(updated);
    }
  };

  // Trigger claim of achievements/badges
  const handleClaimMissions = () => {
    if (!progress) return;
    const { progress: updated } = PythonProgressService.claimDailyMissions();
    syncProgress(updated);
  };

  // AI Mentor response - now with real AI support
  const handleSendMentorMessage = async () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Convert messages to the format expected by getAIMentorResponse
      const conversationHistory = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const aiText = await getAIMentorResponse("python", userText, selectedTopic, true, conversationHistory);
      setMessages((prev) => [...prev, { sender: "ai", text: aiText }]);
    } catch (error) {
      console.error("Error getting AI mentor response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "⚠️ Error communicating with AI Mentor. Please try again or check your API configuration.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Configure AI Mentor API
  const handleConfigureAI = () => {
    if (!apiKey.trim()) {
      alert("Please enter an API key");
      return;
    }

    try {
      initializeAIMentor(apiKey, apiProvider, customEndpoint || undefined, customModel);
      setAiStatus(getAIMentorStatus());
      setShowAPIConfig(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "✅ AI Mentor activated! I'm now powered by a real LLM. I can provide more intelligent and personalized help with your Python and JavaScript learning.",
        },
      ]);
      // Save API key to localStorage (you might want to encrypt this in production)
      localStorage.setItem("ai_mentor_api_key", apiKey);
      localStorage.setItem("ai_mentor_provider", apiProvider);
    } catch (error) {
      alert("Failed to configure AI Mentor: " + String(error));
    }
  };

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("ai_mentor_api_key");
    const savedProvider = localStorage.getItem("ai_mentor_provider") as "openai" | "custom" | null;
    if (savedApiKey) {
      setApiKey(savedApiKey);
      if (savedProvider) setApiProvider(savedProvider);
      initializeAIMentor(savedApiKey, savedProvider || "openai");
      setAiStatus(getAIMentorStatus());
    }
  }, []);

  useEffect(() => {
    let active = true;

    fetch("/api/ai/mentor")
      .then((res) => res.json())
      .then((status: { configured: boolean; model?: string }) => {
        if (active) {
          setAutonomousAIStatus(status);
        }
      })
      .catch(() => {
        if (active) {
          setAutonomousAIStatus({ configured: false });
        }
      });

    return () => {
      active = false;
    };
  }, []);
  const renderCourseOutline = (isMobile: boolean = false) => {
    const phases = Array.from(new Set(PYTHON_CURRICULUM.map((t) => t.phase)));
    
    return (
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-none">
        {phases.map((phaseName) => {
          const topics = PYTHON_CURRICULUM.filter((t) => t.phase === phaseName);
          const completedCount = topics.filter((t) => progress?.completedTopics.includes(t.id)).length;
          const totalCount = topics.length;
          const percent = Math.round((completedCount / totalCount) * 100);
          const isExpanded = expandedPhases[phaseName];
          const style = PHASE_STYLES[phaseName] || { bg: "bg-surface", border: "border-border-subtle", text: "text-muted", glow: "" };

          return (
            <section
              key={phaseName}
              className="overflow-hidden rounded-lg border border-border-subtle bg-surface shadow-sm transition-colors"
            >
              <button
                onClick={() => {
                  setExpandedPhases((prev) => ({
                    ...prev,
                    [phaseName]: !prev[phaseName],
                  }));
                }}
                className="w-full p-3 text-left transition-colors hover:bg-border-subtle/30"
              >
                <div className="flex w-full items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${style.text} bg-current`} />
                      <span className="truncate text-xs font-black tracking-tight text-text">
                      {phaseName}
                    </span>
                    </div>
                    <p className="mt-1 text-[10px] font-mono text-muted">
                      {percent}% complete · {totalCount} lessons
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-mono font-bold ${style.bg} ${style.border} ${style.text}`}>
                      {completedCount}/{totalCount}
                    </span>
                    <motion.div
                      animate={{ rotate: isExpanded ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-muted/60" />
                    </motion.div>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-1 overflow-hidden border-t border-border-subtle bg-surface/30 p-2"
                  >
                    {topics.map((topic, index) => {
                      const isCompleted = progress?.completedTopics.includes(topic.id);
                      const isSelected = selectedTopic.id === topic.id;
                      const idxStr = String(index + 1).padStart(2, "0");

                      return (
                        <div
                          key={topic.id}
                          onClick={() => {
                            setSelectedTopic(topic);
                            if (isMobile) {
                              setCurriculumMobileOpen(false);
                            }
                          }}
                          className={`group grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs transition-all ${
                            isSelected
                              ? "border-[#FF6B4A]/45 bg-[#FF6B4A]/10 text-text shadow-sm"
                              : "border-transparent text-muted hover:border-border-subtle hover:bg-surface/50 hover:text-text"
                          }`}
                        >
                          <span className="font-mono text-[9px] text-muted/60">
                              {idxStr}
                            </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold">{topic.title}</p>
                            <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-wide text-muted/70">
                              {topic.difficulty} · {topic.duration}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center">
                            {isCompleted ? (
                              <button
                                onClick={(e) => handleToggleTopicCompletion(topic.id, e)}
                                className="rounded p-0.5 hover:bg-emerald-500/10 focus:outline-none"
                                title="Mark as incomplete"
                              >
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 hover:scale-110 transition-transform" />
                              </button>
                            ) : (
                                <button
                                  onClick={(e) => handleToggleTopicCompletion(topic.id, e)}
                                  className="flex h-4 w-4 items-center justify-center rounded-full border border-muted/40 transition-colors hover:border-emerald-500 hover:bg-emerald-500/10 focus:outline-none"
                                  title="Mark as complete"
                                />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    );
  };

  const renderMentorPanel = () => (
    <motion.aside
      initial={{ x: 440, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 440, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-[420px] flex-col border-l border-border-subtle bg-surface/85 backdrop-blur-2xl shadow-[-24px_0_80px_rgba(15,23,42,0.18)]"
      aria-label="AI Mentor Panel"
    >
      <div className="border-b border-border-subtle bg-surface/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#7C5CFF]/25 bg-[#7C5CFF]/10">
                <MessageSquare className="h-4 w-4 text-[#7C5CFF]" />
              </span>
              <div>
                <h2 className="text-sm font-black tracking-tight text-text">
                  AI Mentor
                </h2>
                <p className="text-[10px] font-mono uppercase tracking-wide text-muted">
                  {autonomousAIStatus.configured ? "Autonomous LLM" : "Current topic only"}
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-border-subtle bg-surface/30 p-3">
              <p className="truncate text-xs font-bold text-text">{selectedTopic.title}</p>
              <p className="mt-1 text-[10px] text-muted">
                {autonomousAIStatus.configured
                  ? `Server LLM active${autonomousAIStatus.model ? `: ${autonomousAIStatus.model}` : ""}.`
                  : "Answers stay scoped to this lesson with runnable code, debugging steps, and practice tasks."}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={() => setShowAPIConfig(!showAPIConfig)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface text-muted transition-colors hover:text-text"
              title="Configure AI API"
            >
              <Key className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMentorPanelOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface text-muted transition-colors hover:text-text"
              aria-label="Close AI Mentor"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {(autonomousAIStatus.configured || aiStatus.configured) && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {autonomousAIStatus.configured ? "Autonomous LLM Active" : "Browser LLM Active"}
          </div>
        )}
        {!autonomousAIStatus.configured && !aiStatus.configured && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-amber-500">
            Guided fallback
          </div>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-none">
        <AnimatePresence initial={false}>
          {showAPIConfig && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-lg border border-border-subtle bg-surface p-4 text-xs shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-text">Configure AI Mentor</h3>
                <button
                  onClick={() => setShowAPIConfig(false)}
                  className="rounded p-1 text-muted hover:bg-border-subtle/30 hover:text-text"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="block space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wide text-muted">Provider</span>
                  <select
                    value={apiProvider}
                    onChange={(e) => setApiProvider(e.target.value as "openai" | "custom")}
                    className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs text-text outline-none focus:border-[#7C5CFF]"
                  >
                    <option value="openai">OpenAI</option>
                    <option value="custom">Custom API Endpoint</option>
                  </select>
                </label>

                <label className="block space-y-1.5">
                  <span className="text-[9px] font-mono uppercase tracking-wide text-muted">API Key</span>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-... or your API key"
                    className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50 focus:border-[#7C5CFF]"
                  />
                </label>

                {apiProvider === "custom" && (
                  <>
                    <label className="block space-y-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-wide text-muted">API Endpoint</span>
                      <input
                        type="text"
                        value={customEndpoint}
                        onChange={(e) => setCustomEndpoint(e.target.value)}
                        placeholder="https://api.example.com/v1/chat/completions"
                        className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50 focus:border-[#7C5CFF]"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-[9px] font-mono uppercase tracking-wide text-muted">Model</span>
                      <input
                        type="text"
                        value={customModel}
                        onChange={(e) => setCustomModel(e.target.value)}
                        placeholder="gpt-3.5-turbo or your model name"
                        className="w-full rounded-lg border border-border-subtle bg-surface px-3 py-2 text-xs text-text outline-none placeholder:text-muted/50 focus:border-[#7C5CFF]"
                      />
                    </label>
                  </>
                )}

                <button
                  onClick={handleConfigureAI}
                  className="w-full rounded-lg bg-[#7C5CFF] px-4 py-2.5 text-[10px] font-black uppercase tracking-wide text-white transition-opacity hover:opacity-90"
                >
                  Save & Activate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-[92%] rounded-lg border p-3 text-xs leading-relaxed shadow-sm ${
              m.sender === "user"
                ? "ml-auto border-[#FF6B4A]/25 bg-[#FF6B4A]/10 text-text"
                : "border-border-subtle bg-surface/50 text-text/85"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">{m.text}</div>
          </div>
        ))}

        {isTyping && (
          <div className="max-w-[92%] rounded-lg border border-border-subtle bg-surface/50 p-3 text-xs italic text-muted">
            AI Mentor is preparing a code-focused answer...
          </div>
        )}
      </div>

      <div className="border-t border-border-subtle bg-surface/50 p-4">
        <div className="mb-3 grid grid-cols-3 gap-2">
          {[
            { label: "Explain", prompt: `Explain ${selectedTopic.title} with runnable Python code` },
            { label: "Fix Bug", prompt: `Solve the Chaos Mode bug for ${selectedTopic.title}` },
            { label: "Practice", prompt: `Give me one practice task for ${selectedTopic.title} with solution code` },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => setInputMessage(item.prompt)}
              className="rounded-lg border border-border-subtle bg-surface/30 px-2 py-2 text-[10px] font-bold text-muted transition-colors hover:border-[#7C5CFF]/40 hover:text-text"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMentorMessage()}
            placeholder={`Ask about ${selectedTopic.title}...`}
            className="min-w-0 flex-1 rounded-lg border border-border-subtle bg-surface/30 px-3 py-2.5 text-xs text-text outline-none placeholder:text-muted/50 focus:border-[#7C5CFF]"
          />
          <button
            onClick={handleSendMentorMessage}
            className="rounded-lg bg-[#FF6B4A] px-4 text-xs font-black text-white transition-transform active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </motion.aside>
  );

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
              className="fixed inset-y-0 left-0 z-50 flex w-[88vw] max-w-sm flex-col justify-between border-r border-border-subtle bg-surface/90 backdrop-blur-2xl shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="border-b border-border-subtle bg-surface/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                        Course Outline
                      </span>
                      <p className="mt-1 text-sm font-black text-text">Python Core Engine</p>
                    </div>
                  <button
                    onClick={() => setCurriculumMobileOpen(false)}
                    className="rounded-lg border border-border-subtle bg-surface/30 p-2 hover:bg-border-subtle/30"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                  </div>
                </div>
                {renderCourseOutline(true)}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 1. Header / Gamification stats */}
      <header className="flex flex-wrap items-center justify-between border-b border-border-subtle bg-surface/70 backdrop-blur-md px-6 py-3 shrink-0 gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-surface/80 hover:scale-[1.03] transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          {/* Mobile course outline trigger */}
          <button
            onClick={() => setCurriculumMobileOpen(true)}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-surface/80"
            aria-label="Open curriculum outline"
          >
            <BookOpen className="h-4 w-4 text-[#FF6B4A]" />
          </button>

          {/* Desktop left sidebar toggle */}
          <button
            onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
            className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-surface/80 hover:scale-[1.03] transition-all"
            title={leftSidebarCollapsed ? "Expand Course Outline" : "Collapse Course Outline"}
          >
            <BookOpen className={`h-4 w-4 transition-colors ${leftSidebarCollapsed ? "text-muted/60" : "text-[#FF6B4A]"}`} />
          </button>

          <div>
            <h1 className="text-base font-black tracking-tight flex items-center gap-2">
              <span>Python Core Engine</span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 uppercase">
                Sprint 5 Active
              </span>
            </h1>
            <p className="text-[10px] text-muted">Intelligent execution & visualization suite</p>
          </div>
        </div>

        {progress && (
          <div className="flex items-center gap-4 sm:gap-6">
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
            <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 px-3.5 py-1.5 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
              <Coins className="h-4 w-4 text-amber-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-amber-500">{progress.coins}</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-orange-500/10 px-3.5 py-1.5 border border-orange-500/20">
              <span className="text-xs">🔥</span>
              <span className="text-xs font-mono font-bold text-orange-500">{progress.streak} Days</span>
            </div>

            {/* Desktop right sidebar toggle */}
            <button
              onClick={() => setMentorPanelOpen(true)}
              className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl border border-border-subtle bg-surface hover:bg-surface/80 hover:scale-[1.03] transition-all"
              title="Open AI Mentor"
            >
              <MessageSquare className="h-4 w-4 text-[#7C5CFF]" />
            </button>
          </div>
        )}
      </header>

      {/* 2. Main Workspace layout */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-visible lg:overflow-hidden">
        {/* Left Column: Curriculum index */}
        <aside className={`hidden h-full shrink-0 flex-col border-r border-border-subtle bg-surface/30 transition-all duration-300 md:flex ${leftSidebarCollapsed ? "w-0 opacity-0 overflow-hidden border-r-0" : "w-80 opacity-100"}`}>
          <div className="border-b border-border-subtle bg-surface/50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">
                  Course Outline
                </span>
                <p className="mt-1 text-sm font-black text-text">68-topic roadmap</p>
              </div>
              {progress && (
                <span className="rounded-full border border-border-subtle bg-surface/30 px-2 py-1 text-[10px] font-mono font-bold text-muted">
                  {progress.completedTopics.length}/{PYTHON_CURRICULUM.length}
                </span>
              )}
            </div>
          </div>
          {renderCourseOutline(false)}
        </aside>

        {/* Center Panel: Interactive Workspaces */}
        <div className="flex-1 flex flex-col lg:h-full lg:overflow-hidden bg-bg relative">
          {/* View Tab Switcher */}
          <div className="flex items-center justify-between px-6 border-b border-border-subtle bg-surface/20 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-4 whitespace-nowrap">
              {(["learn", "playground", "chaos", "quiz", "interview"] as const).map((tab) => {
                const label = tab === "chaos" ? "Chaos Mode (Debug)" : tab.toUpperCase();
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-3.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors outline-none shrink-0 ${
                      isActive ? "text-[#FF6B4A]" : "text-muted hover:text-text"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B4A]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-[9px] font-mono text-muted shrink-0 ml-4 hidden sm:block">
              Difficulty: <span className="font-bold text-[#7C5CFF]">{selectedTopic.difficulty}</span>
            </div>
          </div>

          {/* Dynamic tabs render */}
          <div className="flex-1 overflow-visible lg:overflow-y-auto p-6 scrollbar-none">
            <AnimatePresence mode="wait">
              {activeTab === "learn" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start"
                >
                  {/* Left Column: Theory & Video */}
                  <div className="lg:col-span-5 rounded-3xl border border-border-subtle bg-surface/60 p-6 backdrop-blur-xl space-y-6 shadow-sm">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight text-text">
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

                    {selectedTopic.videoUrl && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-muted uppercase">
                            <span className="flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B4A] animate-pulse" />
                              Video Chamber
                            </span>
                          </div>
                          
                          {/* Toggle controls */}
                          <div className="flex bg-surface/40 p-0.5 rounded-lg border border-border-subtle">
                            <button
                              onClick={() => setVideoMode("youtube")}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                videoMode === "youtube"
                                  ? "bg-surface text-text shadow-sm"
                                  : "text-muted hover:text-text"
                              }`}
                            >
                              YouTube Tutorial
                            </button>
                            <button
                              onClick={() => setVideoMode("ai")}
                              className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                videoMode === "ai"
                                  ? "bg-gradient-to-r from-[#7C5CFF] to-[#FF6B4A] text-white shadow-sm"
                                  : "text-muted hover:text-text"
                              }`}
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              AI API Lecture
                            </button>
                          </div>
                        </div>

                        <div className="w-full aspect-video rounded-2xl overflow-hidden border border-border-subtle bg-black shadow-lg">
                          {videoMode === "youtube" ? (
                            <iframe
                              src={selectedTopic.videoUrl}
                              title={`${selectedTopic.title} Video Tutorial`}
                              className="w-full h-full border-0 animate-fade-in"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <AIVideoChamber topic={selectedTopic} defaultLanguage="python" />
                          )}
                        </div>
                      </div>
                    )}

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

                    {/* Navigation helper */}
                    <button
                      onClick={() => setActiveTab("playground")}
                      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-6 py-3 text-xs font-semibold text-white transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      Enter Full Playground
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Right Column: IDE Practice Workspace */}
                  <div className="lg:col-span-7 flex flex-col h-full min-w-0">
                    <WorkspaceIDE
                      topicId={selectedTopic.id}
                      templateCode={selectedTopic.templateCode}
                      examples={selectedTopic.examples}
                      onXpGain={handleXpGain}
                    />
                  </div>
                </motion.div>
              )}
              {activeTab === "playground" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex flex-col"
                >
                  <WorkspaceIDE
                    topicId={selectedTopic.id}
                    templateCode={selectedTopic.templateCode}
                    examples={selectedTopic.examples}
                    onXpGain={handleXpGain}
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Bug className="h-5 w-5 text-[#FF6B4A]" />
                        <h3 className="text-lg font-black tracking-tight">
                          Chaos Mode: {activeChaosExercise.title}
                        </h3>
                      </div>
                      {/* Shuffle + pool indicator */}
                      {(selectedTopic.chaosExercises?.length ?? 1) > 1 && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted">
                            {chaosExerciseIndex + 1} / {selectedTopic.chaosExercises?.length ?? 1}
                          </span>
                          <motion.button
                            onClick={handleShuffleChaos}
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-1.5 rounded-xl border border-[#FF6B4A]/30 bg-[#FF6B4A]/10 px-3 py-1.5 text-[10px] font-bold text-[#FF6B4A] hover:bg-[#FF6B4A]/20 transition-colors"
                            title="Get a new chaos challenge"
                          >
                            🎲 New Challenge
                          </motion.button>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-text/80 leading-relaxed">
                      {activeChaosExercise.description}
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Editor */}
                      <div className="rounded-2xl border border-border-subtle bg-surface flex flex-col overflow-hidden">
                        <div className="px-4 py-2 border-b border-border-subtle bg-surface/50 text-[10px] font-mono font-bold text-muted flex justify-between items-center">
                          <span>broken_script.py</span>
                          <button
                            onClick={() =>
                              setChaosCode(activeChaosExercise.brokenCode)
                            }
                            className="text-[9px] hover:text-text font-bold"
                          >
                            Reset Original
                          </button>
                        </div>
                        <textarea
                          value={chaosCode}
                          onChange={(e) => setChaosCode(e.target.value)}
                          className="h-64 bg-transparent p-4 font-mono text-sm outline-none resize-none text-text"
                        />
                      </div>

                      {/* Validator */}
                      <div className="rounded-2xl border border-border-subtle bg-slate-950 flex flex-col overflow-hidden text-white">
                        <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02] text-[10px] font-mono font-bold text-white/50">
                          Verification Output
                        </div>
                        <div className="flex-1 p-4 font-mono text-xs space-y-2 overflow-y-auto">
                          {chaosOutput ? (
                            <pre className="whitespace-pre-wrap">{chaosOutput}</pre>
                          ) : (
                            <span className="text-white/20 italic">
                              Run verification test cases to validate code logic.
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
                            Challenge Completed! +150 XP &amp; +40 Coins added
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-muted">
                            Correct variable assignments or format references to bypass.
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

                          {q.type === "predict" && (
                            <div className="pl-6">
                              <input
                                type="text"
                                disabled={quizSubmitted}
                                value={quizAnswers[q.id] || ""}
                                onChange={(e) =>
                                  setQuizAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                                }
                                placeholder="Type exact output prediction..."
                                className="w-full sm:w-80 rounded-xl border border-border-subtle bg-surface px-4 py-2 text-xs outline-none focus:border-[#7C5CFF] text-text"
                              />
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
                            Pass with at least 50% to earn extra Coins & XP.
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

      </div>

      <button
        onClick={() => setMentorPanelOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-[#7C5CFF]/30 bg-bg px-4 py-3 text-xs font-black text-text shadow-2xl transition-all hover:-translate-y-0.5 hover:border-[#7C5CFF]/60"
        aria-label="Open AI Mentor Panel"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7C5CFF] text-white">
          <MessageSquare className="h-4 w-4" />
        </span>
        AI Mentor
      </button>

      <AnimatePresence>
        {mentorPanelOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setMentorPanelOpen(false)}
              className="fixed inset-0 z-[60] bg-black"
            />
            {renderMentorPanel()}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
