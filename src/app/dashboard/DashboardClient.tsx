"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ROUTES } from "@/constants/routes";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Terminal, Code2, Cpu, Sparkles, Clock, Trophy, Play, CheckCircle } from "lucide-react";
import Sidebar, { TabId } from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import NotificationsMenu, { SystemNotification } from "./components/notifications/NotificationsMenu";

import { PythonProgressService, PythonProgress } from "@/services/pythonProgress";
import { JavaScriptProgressService, JavaScriptProgress } from "@/services/javascriptProgress";
import { PYTHON_CURRICULUM } from "@/services/pythonCurriculum";
import { JAVASCRIPT_CURRICULUM } from "@/services/javascriptCurriculum";
import WorkspaceIDE from "@/app/python/components/WorkspaceIDE";
import { PyodideRunner } from "@/utils/pyodideRunner";

// Widgets & Views
import WelcomeWidget from "./components/widgets/WelcomeWidget";
import LearningProgress from "./components/widgets/LearningProgress";
import DailyMissions from "./components/widgets/DailyMissions";
import StreakWidget from "./components/widgets/StreakWidget";
import AchievementsWidget from "./components/widgets/AchievementsWidget";
import SkillAnalytics from "./components/analytics/SkillAnalytics";
import ContinueLearning from "./components/widgets/ContinueLearning";
import NotesBookmarks from "./components/widgets/NotesBookmarks";
import GoalsWidget from "./components/widgets/GoalsWidget";

import InterviewTracker from "./components/widgets/InterviewTracker";
import SettingsWidget from "./components/settings/SettingsWidget";

export default function DashboardClient() {
  const { isAuthenticated, isLoading, user, updateUser } = useAuth();
  const router = useRouter();

  // Tab & UI Layout states
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synchronized metrics
  const [streak, setStreak] = useState(0);

  // Sync user streak on load/update
  useEffect(() => {
    if (user) {
      setStreak(user.streak || 0);
    }
  }, [user]);

  const handleSetStreak = (newStreak: number) => {
    setStreak(newStreak);
    if (user) {
      updateUser({ streak: newStreak });
    }
  };

  // Dynamic progress states
  const [pythonProgress, setPythonProgress] = useState<PythonProgress | null>(null);
  const [jsProgress, setJsProgress] = useState<JavaScriptProgress | null>(null);

  // Load progress on mount & register active date
  useEffect(() => {
    if (typeof window !== "undefined") {
      setPythonProgress(PythonProgressService.getProgress());
      setJsProgress(JavaScriptProgressService.getProgress());

      // Warm up Pyodide in background
      PyodideRunner.warmup();

      // Register active date
      const todayStr = new Date().toDateString();
      const datesStr = localStorage.getItem("programmingos_active_dates") || "[]";
      let dates = JSON.parse(datesStr) as string[];
      if (!dates.includes(todayStr)) {
        dates.push(todayStr);
        localStorage.setItem("programmingos_active_dates", JSON.stringify(dates));

        // Automatically increment streak if yesterday was active!
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        if (dates.includes(yesterdayStr)) {
          const newStreak = (user?.streak || 0) + 1;
          handleSetStreak(newStreak);
        } else if ((user?.streak || 0) === 0) {
          handleSetStreak(1); // First day active
        }
      }
    }
  }, [activeTab, user?.streak]);

  // Background study time tracker
  useEffect(() => {
    if (typeof window === "undefined") return;

    const interval = setInterval(() => {
      const todayStr = new Date().toDateString();
      const timeDataStr = localStorage.getItem("programmingos_study_time") || "{}";
      let timeData = JSON.parse(timeDataStr) as Record<string, number>;
      
      // Increment active study seconds by 10
      timeData[todayStr] = (timeData[todayStr] || 0) + 10;
      localStorage.setItem("programmingos_study_time", JSON.stringify(timeData));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handlePlaygroundXpGain = (xpGain: number, coinsGain: number) => {
    if (!user) return;
    const nextXp = (user.xp || 0) + xpGain;
    const nextLevel = Math.floor(nextXp / 500) + 1;
    updateUser({
      xp: nextXp,
      level: nextLevel > (user.level || 1) ? nextLevel : (user.level || 1)
    });
  };

  // Simulated notifications
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: "n1", title: "Achievement Unlocked!", body: "You earned the 'First Script' badge.", type: "achievement", read: false, time: "2m ago" },
    { id: "n2", title: "Daily Mission Complete", body: "Solve 2 problems checklist cleared.", type: "mission", read: false, time: "1h ago" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Redirect if unauthorized
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center transition-colors duration-300">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-border-subtle border-t-[#FF6B4A]"
        />
      </div>
    );
  }

  // Count unread alerts
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Dynamic progress calculations
  const totalPython = PYTHON_CURRICULUM.length;
  const completedPython = pythonProgress?.completedTopics.length || 0;
  const percentPython = totalPython > 0 ? Math.round((completedPython / totalPython) * 100) : 0;
  const remainingPython = totalPython - completedPython;
  const nextPythonTopic = PYTHON_CURRICULUM.find(
    (topic) => !pythonProgress?.completedTopics.includes(topic.id)
  ) || PYTHON_CURRICULUM[0];

  const totalJS = JAVASCRIPT_CURRICULUM.length;
  const completedJS = jsProgress?.completedTopics.length || 0;
  const percentJS = totalJS > 0 ? Math.round((completedJS / totalJS) * 100) : 0;
  const remainingJS = totalJS - completedJS;
  const nextJSTopic = JAVASCRIPT_CURRICULUM.find(
    (topic) => !jsProgress?.completedTopics.includes(topic.id)
  ) || JAVASCRIPT_CURRICULUM[0];

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleClearItem(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="flex min-h-[100dvh] lg:h-[100dvh] w-full lg:overflow-hidden bg-bg text-text transition-colors duration-300">
      {/* 1. Desktop Persistent Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(t) => {
          setActiveTab(t);
          setMobileMenuOpen(false);
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        className="hidden lg:flex"
      />

      {/* 2. Mobile Responsive Drawer Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border-subtle flex flex-col justify-between lg:hidden"
            >
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(t) => {
                  setActiveTab(t);
                  setMobileMenuOpen(false);
                }}
                collapsed={false}
                setCollapsed={() => {}}
                className="flex w-full"
                isMobileDrawer={true}
                onClose={() => setMobileMenuOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col lg:h-full lg:overflow-hidden">
        {/* Topbar */}
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          setActiveTab={setActiveTab}
          onNotificationsClick={() => setShowNotifications(!showNotifications)}
          unreadCount={unreadCount}
        />

        {/* Notifications Dropdown */}
        <AnimatePresence>
          {showNotifications && (
            <NotificationsMenu
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onMarkAllRead={handleMarkAllRead}
              onClearItem={handleClearItem}
            />
          )}
        </AnimatePresence>

        {/* Dynamic Inner views */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-none relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="max-w-6xl mx-auto space-y-4 sm:space-y-6 pb-12"
            >
              {/* Home widget grid */}
              {activeTab === "home" && (
                <div className="space-y-6">
                  <WelcomeWidget setActiveTab={setActiveTab} streak={streak} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col h-full">
                      <SkillAnalytics pythonProgress={pythonProgress} jsProgress={jsProgress} />
                    </div>
                    <div className="flex flex-col gap-6 h-full justify-between">
                      <StreakWidget streak={streak} setStreak={handleSetStreak} />
                      <DailyMissions pythonProgress={pythonProgress} jsProgress={jsProgress} />
                      <AchievementsWidget pythonProgress={pythonProgress} jsProgress={jsProgress} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ContinueLearning
                      setActiveTab={setActiveTab}
                      pythonProgress={pythonProgress}
                      jsProgress={jsProgress}
                    />
                    <NotesBookmarks />
                    <GoalsWidget pythonProgress={pythonProgress} jsProgress={jsProgress} />
                  </div>
                </div>
              )}

              {/* Learn View */}
              {activeTab === "learn" && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-black text-text tracking-tight flex items-center gap-2">
                        <BookOpen className="h-7 w-7 text-[#FF6B4A]" />
                        <span>Interactive Learning Hub</span>
                      </h1>
                      <p className="text-sm text-muted mt-1.5 max-w-xl leading-relaxed">
                        Choose your language track below. Each track is compiled dynamically into custom sandbox environments.
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-surface/40 border border-border-subtle rounded-2xl px-4 py-2 text-xs font-mono shrink-0">
                      <Clock className="h-4 w-4 text-[#7C5CFF]" />
                      <span>Estimated Time: 12 Weeks per Track</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Track 1: Python Core Engine */}
                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="group relative overflow-hidden rounded-3xl border border-border-subtle bg-surface/30 p-8 backdrop-blur-2xl transition-all duration-300 shadow-xl"
                    >
                      {/* Fluid gradient glow */}
                      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-10 blur-3xl bg-emerald-500 group-hover:opacity-20 transition-opacity" />
                      
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold font-mono text-emerald-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            TRACK 1 • CORE
                          </span>
                          <h3 className="text-xl font-extrabold text-text mt-3">Python Core Engine</h3>
                        </div>
                        <div className="flex flex-col items-end gap-1 font-mono">
                          <span className="text-sm font-black text-emerald-400">{percentPython}% Done</span>
                          <span className="text-[10px] text-muted">{completedPython}/{totalPython} Topics</span>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="mt-6 space-y-1.5">
                        <div className="h-2 w-full rounded-full bg-border-subtle/30 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                            style={{ width: `${percentPython}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-muted mt-5 leading-relaxed min-h-[48px]">
                        Master system scripting, custom generators, data models, memory allocations, and automated assertion test runners.
                      </p>

                      {/* Continuation Widget */}
                      <div className="mt-4 p-3 rounded-2xl bg-border-subtle/20 border border-border-subtle flex items-center justify-between">
                        <div className="flex flex-col truncate mr-2">
                          <span className="text-[9px] font-mono text-muted uppercase">Next Up</span>
                          <span className="text-xs font-bold text-text truncate max-w-[160px]">{nextPythonTopic?.title || "Completed!"}</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">{remainingPython} remaining</span>
                      </div>

                      {/* Grid Stats */}
                      <div className="grid grid-cols-3 gap-3 border-t border-border-subtle pt-5 mt-6 text-[10px] font-mono text-muted">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-text font-semibold">24</span>
                          <span>Lessons</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-text font-semibold">6</span>
                          <span>Labs</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-text font-semibold">800 XP</span>
                          <span>Rewards</span>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push("/python")}
                        className="w-full mt-6 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] p-3.5 text-xs font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(124,92,255,0.3)] flex items-center justify-center gap-2 border-0 cursor-pointer"
                      >
                        <Play className="h-4 w-4 fill-white" />
                        <span>{completedPython === 0 ? "Start Python Engine" : `Continue: ${nextPythonTopic?.title}`}</span>
                      </button>
                    </motion.div>

                    {/* Track 2: JavaScript Scripting */}
                    <motion.div
                      whileHover={{ y: -6, scale: 1.01 }}
                      className="group relative overflow-hidden rounded-3xl border border-border-subtle bg-surface/30 p-8 backdrop-blur-2xl transition-all duration-300 shadow-xl"
                    >
                      {/* Fluid gradient glow */}
                      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full opacity-10 blur-3xl bg-amber-500 group-hover:opacity-20 transition-opacity" />
                      
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold font-mono text-amber-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                            TRACK 2 • CORE
                          </span>
                          <h3 className="text-xl font-extrabold text-text mt-3">JavaScript Scripting</h3>
                        </div>
                        <div className="flex flex-col items-end gap-1 font-mono">
                          <span className="text-sm font-black text-amber-400">{percentJS}% Done</span>
                          <span className="text-[10px] text-muted">{completedJS}/{totalJS} Topics</span>
                        </div>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="mt-6 space-y-1.5">
                        <div className="h-2 w-full rounded-full bg-border-subtle/30 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                            style={{ width: `${percentJS}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-muted mt-5 leading-relaxed min-h-[48px]">
                        Dive into V8 architecture, asynchronous loops, callbacks, closures, and construct your own custom Virtual DOM libraries.
                      </p>

                      {/* Continuation Widget */}
                      <div className="mt-4 p-3 rounded-2xl bg-border-subtle/20 border border-border-subtle flex items-center justify-between">
                        <div className="flex flex-col truncate mr-2">
                          <span className="text-[9px] font-mono text-muted uppercase">Next Up</span>
                          <span className="text-xs font-bold text-text truncate max-w-[160px]">{nextJSTopic?.title || "Completed!"}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400 font-semibold shrink-0">{remainingJS} remaining</span>
                      </div>

                      {/* Grid Stats */}
                      <div className="grid grid-cols-3 gap-3 border-t border-border-subtle pt-5 mt-6 text-[10px] font-mono text-muted">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-text font-semibold">25</span>
                          <span>Lessons</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-text font-semibold">7</span>
                          <span>Labs</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-text font-semibold">950 XP</span>
                          <span>Rewards</span>
                        </div>
                      </div>

                      <button
                        onClick={() => router.push("/javascript")}
                        className="w-full mt-6 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] p-3.5 text-xs font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(124,92,255,0.3)] flex items-center justify-center gap-2 border-0 cursor-pointer"
                      >
                        <Play className="h-4 w-4 fill-white" />
                        <span>{completedJS === 0 ? "Start JavaScript Engine" : `Continue: ${nextJSTopic?.title}`}</span>
                      </button>
                    </motion.div>
                  </div>
                </div>
              )}

              {/* Practice View */}
              {activeTab === "practice" && <InterviewTracker />}

              {/* Playground View (premium custom IDE simulator) */}
              {activeTab === "playground" && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight">Sandbox Code Playground</h1>
                    <p className="text-xs text-white/45 mt-1">
                      Write and run Python/JS scripts directly inside the workspace sandbox container.
                    </p>
                  </div>
                  <WorkspaceIDE
                    topicId="playground"
                    templateCode={`# Write your Python code here\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("NIK's AI"))\n`}
                    onXpGain={handlePlaygroundXpGain}
                    allowLanguageChange={true}
                  />
                </div>
              )}

              {/* Settings View */}
              {activeTab === "settings" && <SettingsWidget />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
