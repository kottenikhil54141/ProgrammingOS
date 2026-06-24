"use client";

import { useState, useId, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  AtSign,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  Briefcase,
  Globe,
  TrendingUp,
  Gamepad2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AUTH_ERROR_MESSAGES, type AuthError, type SignupStep1, type SignupStep2, type SignupStep3 } from "@/types/auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import SocialLogin from "@/components/auth/SocialLogin";
import FloatingField from "@/components/auth/FloatingField";
import ThreeDOrb from "@/components/auth/ThreeDOrb";

/* ─── Interactive AI Core Visual ────────────────────────────────── */
function AICoreVisual() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center mb-6 select-none">
      {/* Outer spinning ring (Clockwise) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#7C5CFF] opacity-60">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="12 10 32 8"
          />
        </svg>
      </motion.div>

      {/* Middle spinning ring (Counter-clockwise) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
        className="absolute w-[82%] h-[82%]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#FF6B4A] opacity-70">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="6 6 18 6"
          />
        </svg>
      </motion.div>

      {/* Inner glowing core with orbital nodes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        className="absolute w-[64%] h-[64%] flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400 opacity-80 animate-pulse">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 15"
          />
          <circle cx="50" cy="12" r="3.5" fill="currentColor" />
          <circle cx="50" cy="88" r="3.5" fill="currentColor" />
        </svg>
      </motion.div>

      {/* Center stationary core pulse */}
      <div className="absolute w-[44%] h-[44%] rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#FF6B4A] p-[1.5px] shadow-[0_0_25px_rgba(124,92,255,0.45)] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[#080b16] backdrop-blur-md" />
        <Zap className="relative z-10 h-5 w-5 text-white animate-pulse" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[18%] left-[18%] w-1 h-1 rounded-full bg-[#7C5CFF] opacity-60 animate-ping" />
        <span className="absolute bottom-[28%] right-[12%] w-1.5 h-1.5 rounded-full bg-[#FF6B4A] opacity-50 animate-bounce" style={{ animationDuration: "3.2s" }} />
      </div>
    </div>
  );
}

/* ─── Simulated Live Console Shell ──────────────────────────────── */
function LiveTerminalConsole() {
  const [logs, setLogs] = useState<string[]>([
    "[sys] Initializing compiler kernel v2.8...",
    "[sys] Handshaking secure proxy..."
  ]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = [
      "[net] Securing connections (AES-256-GCM)...",
      "[sys] Python & JS runtimes initialized.",
      "[db] Workspace persistence node synchronized.",
      "[ok] Secure sandbox session established.",
      "[sys] Cognitive mentor nodes online.",
      "[ok] Handshake ready. Awaiting user sign-in..."
    ];

    const interval = setInterval(() => {
      setLogs((prev) => {
        const appendedCount = prev.length - 2;
        if (appendedCount >= 0 && appendedCount < list.length) {
          const nextLog = list[appendedCount];
          if (nextLog) {
            return [...prev, nextLog];
          }
        }
        return [
          "[sys] Initializing compiler kernel v2.8...",
          "[sys] Handshaking secure proxy..."
        ];
      });
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-[290px] bg-black/75 backdrop-blur-md border border-white/[0.08] rounded-xl p-3 font-mono text-[9px] text-[#A78BFF] text-left shadow-2xl mt-8 overflow-hidden h-[90px] flex flex-col justify-between select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-1.5 mb-1.5 text-[8px] text-white/40 tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F56]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#FFBD2E]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#27C93F]" />
        </div>
        <span className="flex items-center gap-1 text-[7.5px] font-bold text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ACTIVE
        </span>
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar space-y-1">
        {logs.map((log, index) => {
          if (!log) return null;
          const isOk = log.startsWith("[ok]");
          const isNet = log.startsWith("[net]");
          return (
            <div key={index} className="leading-tight">
              <span className="text-white/20 mr-1.5">&gt;</span>
              <span className={cn(
                isOk ? "text-emerald-400" : isNet ? "text-cyan-400" : "text-white/70"
              )}>
                {log}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step Indicator with SVG connecting lines and glows ─────────── */
const STEP_LABELS = ["Credentials", "Profile", "Track", "Goal"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: active ? 1.1 : 1 }}
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300",
                  done
                    ? "bg-[#22C55E] text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : active
                    ? "bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] text-white shadow-[0_0_15px_rgba(124,92,255,0.45)]"
                    : "bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/[0.08]"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "text-[8px] font-black uppercase tracking-wider transition-colors",
                  active ? "bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] bg-clip-text text-transparent" : done ? "text-[#22C55E]" : "text-slate-500 dark:text-slate-400"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 sm:w-10 mx-1 mb-4 rounded-full transition-all duration-500",
                  done ? "bg-[#22C55E]" : "bg-slate-200 dark:bg-white/[0.08]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}


/* ─── Password Strength ──────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Symbol", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;

  if (!password) return null;

  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#22C55E"];

  return (
    <div className="space-y-1 pt-1 pl-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= strength ? "" : "bg-slate-200 dark:bg-white/[0.08]"
            )}
            style={{
              backgroundColor: i <= strength ? colors[strength] : undefined,
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-0.5">
        {checks.map((c) => (
          <span
            key={c.label}
            className={cn(
              "text-[8px] font-bold tracking-tight transition-colors",
              c.pass ? "text-[#22C55E]" : "text-slate-500 dark:text-slate-400"
            )}
          >
            {c.pass ? "✓" : "○"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Custom Icons for Tracks ─────────────────────────────────────── */
function PythonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 mx-auto" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#pyGrad)" />
      <text x="17" y="18" fontStyle="normal" fontWeight="900" fontSize="8.5" fontFamily="var(--font-sans), sans-serif" textAnchor="end" fill="#0b0e1a">PY</text>
      <defs>
        <linearGradient id="pyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function JavaScriptIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 mx-auto" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#jsGrad)" />
      <text x="17" y="18" fontStyle="normal" fontWeight="900" fontSize="8.5" fontFamily="var(--font-sans), sans-serif" textAnchor="end" fill="#0b0e1a">JS</text>
      <defs>
        <linearGradient id="jsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function BothIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-8 h-8 mx-auto" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="url(#bothGrad)" />
      <text x="17" y="18" fontStyle="normal" fontWeight="900" fontSize="8.5" fontFamily="var(--font-sans), sans-serif" textAnchor="end" fill="#ffffff">ALL</text>
      <defs>
        <linearGradient id="bothGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C5CFF" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Track Card ─────────────────────────────────────────────────── */
interface TrackCardProps {
  value: string;
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  accentColor: string;
}

function TrackCard({ value, selected, onSelect, icon, title, accentColor }: TrackCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-2xl border p-4 text-center transition-all duration-300 outline-none group/track overflow-hidden",
        selected
          ? "border-opacity-100 bg-opacity-10 shadow-lg"
          : "border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.04]"
      )}
      style={{
        borderColor: selected ? accentColor : undefined,
        background: selected ? `${accentColor}15` : undefined,
      }}
    >
      {selected && (
        <span
          className="absolute -top-10 -right-10 w-20 h-20 rounded-full blur-xl opacity-40 animate-pulse"
          style={{ backgroundColor: accentColor }}
        />
      )}
      <div className="mb-1.5 transition-transform duration-300 group-hover/track:scale-110">{icon}</div>
      <div className="text-xs font-black text-text">{title}</div>
    </button>
  );
}

const GOALS = [
  { value: "job", icon: <Briefcase className="h-4.5 w-4.5" />, label: "Get a job" },
  { value: "freelance", icon: <Globe className="h-4.5 w-4.5" />, label: "Freelance" },
  { value: "upskill", icon: <TrendingUp className="h-4.5 w-4.5" />, label: "Upskill" },
  { value: "hobby", icon: <Gamepad2 className="h-4.5 w-4.5" />, label: "For fun" },
] as const;

interface AuthSliderProps {
  initialMode?: "login" | "signup";
}

export default function AuthSlider({ initialMode = "login" }: AuthSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, isLoading } = useAuth();

  // Mobile check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Mode state: 'login' or 'signup'
  const [mode, setModeState] = useState<"login" | "signup">(initialMode);
  
  // Spotlight Glow effect & 3D Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // Calculate rotation (-6 to 6 degrees max)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6; // left is negative, right is positive
    const rotateX = -((y - centerY) / centerY) * 6; // top is positive, bottom is negative
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Sync mode with URL search params if present
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "signup" || tabParam === "login") {
      setModeState(tabParam);
    }
  }, [searchParams]);

  const setMode = (newMode: "login" | "signup") => {
    setModeState(newMode);
    router.push(newMode === "signup" ? ROUTES.SIGNUP : ROUTES.LOGIN, { scroll: false });
  };

  // Login form states
  const loginId = useId();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<AuthError | null>(null);
  const [loginFieldErrors, setLoginFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Signup form states
  const [signupStep, setSignupStep] = useState(0);
  const [signupDir, setSignupDir] = useState(1);
  const [signupError, setSignupError] = useState<AuthError | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  const [step1, setStep1] = useState<SignupStep1>({ email: "", password: "", confirmPassword: "" });
  const [step2, setStep2] = useState<SignupStep2>({ name: "", username: "" });
  const [step3, setStep3] = useState<SignupStep3>({ track: "python", goal: "job" });

  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);

  function validateLogin(): boolean {
    const errs: typeof loginFieldErrors = {};
    if (!loginEmail.includes("@")) errs.email = "Enter a valid email address.";
    if (loginPassword.length < 8) errs.password = "Password must be at least 8 characters.";
    setLoginFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    if (!validateLogin()) return;

    const { error: authError } = await login({ email: loginEmail, password: loginPassword });
    if (authError) {
      setLoginError(authError);
    } else {
      router.push(ROUTES.DASHBOARD);
    }
  }

  async function handleSignupSubmit() {
    setSignupError(null);
    const { error: authError, verificationToken: token } = await signup({ ...step1, ...step2, ...step3 });
    if (authError) {
      setSignupError(authError);
    } else if (token) {
      setVerificationToken(token);
    } else {
      router.push(ROUTES.LOGIN);
    }
  }

  // Next / Back handlers for signup steps
  const [signupStepErrors, setSignupStepErrors] = useState<any>({});
  
  function validateStep0() {
    const e: any = {};
    if (!step1.email.includes("@")) e.email = "Enter a valid email.";
    if (step1.password.length < 8) e.password = "Password must be 8+ chars.";
    if (step1.password !== step1.confirmPassword) e.confirmPassword = "Passwords do not match.";
    if (!acceptedTerms) e.terms = "You must accept the terms.";
    setSignupStepErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep1() {
    const e: any = {};
    if (!step2.name.trim()) e.name = "Enter your display name.";
    if (step2.username.length < 3) e.username = "Username must be 3+ chars.";
    setSignupStepErrors(e);
    return Object.keys(e).length === 0;
  }

  function goSignupNext() {
    if (signupStep === 0 && !validateStep0()) return;
    if (signupStep === 1 && !validateStep1()) return;
    setSignupDir(1);
    setSignupStep((s) => s + 1);
  }

  function goSignupBack() {
    setSignupDir(-1);
    setSignupStep((s) => s - 1);
  }

  // Staggered layout variants for form fields
  const formContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
  } as const;

  const formItemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  } as const;

  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center justify-center px-4 py-8 relative min-h-screen">
        {/* Background atmospheric glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#7C5CFF]/5 dark:bg-[#7C5CFF]/10 blur-[80px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] rounded-full bg-[#FF6B4A]/5 dark:bg-[#FF6B4A]/8 blur-[80px] animate-pulse" />
        </div>

        <div className="flex flex-col gap-3 z-10 w-full max-w-md">
          {/* Back button */}
          <div className="flex justify-start px-1">
            <Link
              href={ROUTES.HOME}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#7C5CFF] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>

          <div className="w-full relative overflow-hidden rounded-3xl glass-surface p-6 sm:p-8 flex flex-col gap-6 shadow-elevated">
            {/* Terminal Console – shown above the form on mobile */}
            <div className="w-full flex justify-center">
              <LiveTerminalConsole />
            </div>

            {/* Header with orbital visual */}
            <div className="flex flex-col items-center text-center">
              <div className="scale-75 -my-2 flex justify-center w-full">
                <ThreeDOrb size={120} />
              </div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
                {mode === "signup" ? "Create Account" : "Welcome back"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {mode === "signup" ? "Join the elite developer community" : "Sign in to continue your journey"}
              </p>
            </div>

            {/* Verification / Form Toggle */}
            <AnimatePresence mode="wait">
              {verificationToken ? (
                /* Mobile Verification view */
                <motion.div
                  key="verification-mobile"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Check your email!</h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      We&apos;ve sent a verification link to <span className="font-semibold text-text">{step1.email}</span>. Click the link to activate your account.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-4 text-left">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Sandbox Simulation Mode
                    </span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                      Click the direct link below to simulate email verification:
                    </p>
                    <Link
                      href={`${ROUTES.VERIFY_EMAIL}?token=${verificationToken}`}
                      className="block text-center rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] p-0.5"
                    >
                      <div className="rounded-[10px] bg-white dark:bg-[#0B1020]/90 hover:bg-transparent px-3 py-1.5 text-[10px] font-bold text-[#7C5CFF] hover:text-white transition-colors">
                        Simulate Email Verification Link
                      </div>
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      setVerificationToken(null);
                      setMode("login");
                    }}
                    className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#7C5CFF] transition-colors"
                  >
                    Back to Sign In
                  </button>
                </motion.div>
              ) : mode === "signup" ? (
                /* Mobile Signup Form */
                <motion.div
                  key="signup-mobile"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <StepIndicator current={signupStep} />
                  
                  <div className="min-h-[220px]">
                    {signupStep === 0 && (
                      <div className="space-y-3">
                        <SocialLogin />
                        
                        <FloatingField
                          id="signup-email-mob"
                          label="Email Address"
                          type="email"
                          value={step1.email}
                          onChange={(v) => setStep1({ ...step1, email: v })}
                          placeholder="you@example.com"
                          icon={<Mail className="h-4 w-4" />}
                          error={signupStepErrors.email}
                        />
                        
                        <div className="space-y-1">
                          <FloatingField
                            id="signup-pw-mob"
                            label="Password"
                            type={showSignupPw ? "text" : "password"}
                            value={step1.password}
                            onChange={(v) => setStep1({ ...step1, password: v })}
                            placeholder="••••••••"
                            icon={<Lock className="h-4 w-4" />}
                            error={signupStepErrors.password}
                            rightElement={
                              <button
                                type="button"
                                onClick={() => setShowSignupPw(!showSignupPw)}
                                className="text-slate-400 dark:text-white/30 hover:text-[#7C5CFF] p-1"
                              >
                                {showSignupPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            }
                          />
                          <PasswordStrength password={step1.password} />
                        </div>
                        
                        <FloatingField
                          id="signup-confirm-mob"
                          label="Confirm Password"
                          type={showConfirmPw ? "text" : "password"}
                          value={step1.confirmPassword}
                          onChange={(v) => setStep1({ ...step1, confirmPassword: v })}
                          placeholder="••••••••"
                          icon={<Lock className="h-4 w-4" />}
                          error={signupStepErrors.confirmPassword}
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPw(!showConfirmPw)}
                              className="text-slate-400 dark:text-white/30 hover:text-[#7C5CFF] p-1"
                            >
                              {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          }
                        />
                        
                        <div className="pt-1">
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={acceptedTerms}
                              onChange={(e) => setAcceptedTerms(e.target.checked)}
                              className="mt-0.5 h-3.5 w-3.5 rounded border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02]"
                            />
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                              I agree to the <span className="text-[#7C5CFF] font-bold">Terms of Service</span> and <span className="text-[#7C5CFF] font-bold">Privacy Policy</span>.
                            </span>
                          </label>
                          {signupStepErrors.terms && (
                            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {signupStepErrors.terms}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {signupStep === 1 && (
                      <div className="space-y-4">
                        <FloatingField
                          id="signup-name-mob"
                          label="Display Name"
                          value={step2.name}
                          onChange={(v) => setStep2({ ...step2, name: v })}
                          placeholder="Alex Chen"
                          icon={<User className="h-4 w-4" />}
                          error={signupStepErrors.name}
                        />
                        <FloatingField
                          id="signup-username-mob"
                          label="Username"
                          value={step2.username}
                          onChange={(v) => setStep2({ ...step2, username: v.toLowerCase().replace(/\s/g, "_") })}
                          placeholder="alexchen"
                          icon={<AtSign className="h-4 w-4" />}
                          error={signupStepErrors.username}
                          hint="Your public handle will be @username"
                        />
                      </div>
                    )}

                    {signupStep === 2 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Choose track</span>
                        <div className="grid grid-cols-3 gap-2">
                          <TrackCard
                            value="python"
                            selected={step3.track === "python"}
                            onSelect={() => setStep3({ ...step3, track: "python" })}
                            icon={<PythonIcon />}
                            title="Python"
                            accentColor="#22C55E"
                          />
                          <TrackCard
                            value="javascript"
                            selected={step3.track === "javascript"}
                            onSelect={() => setStep3({ ...step3, track: "javascript" })}
                            icon={<JavaScriptIcon />}
                            title="JS"
                            accentColor="#F59E0B"
                          />
                          <TrackCard
                            value="both"
                            selected={step3.track === "both"}
                            onSelect={() => setStep3({ ...step3, track: "both" })}
                            icon={<BothIcon />}
                            title="Both"
                            accentColor="#7C5CFF"
                          />
                        </div>
                      </div>
                    )}

                    {signupStep === 3 && (
                      <div className="space-y-4">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Primary Goal</span>
                        <div className="grid grid-cols-2 gap-2">
                          {GOALS.map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => setStep3({ ...step3, goal: g.value })}
                              className={cn(
                                "flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-all duration-300",
                                step3.goal === g.value
                                  ? "border-[#7C5CFF] bg-[#7C5CFF]/10 text-[#7C5CFF]"
                                  : "border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]"
                              )}
                            >
                              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5">
                                {g.icon}
                              </div>
                              <span className="text-[11px] font-bold">{g.label}</span>
                            </button>
                          ))}
                        </div>
                        {signupError && (
                          <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-[11px] font-bold text-red-400">
                            {AUTH_ERROR_MESSAGES[signupError] || signupError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={signupStep > 0 ? goSignupBack : () => setMode("login")}
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={signupStep === 3 ? handleSignupSubmit : goSignupNext}
                      disabled={isLoading}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] py-3.5 text-xs font-black text-white"
                    >
                      {isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : signupStep === 3 ? (
                        "Create Account"
                      ) : (
                        "Continue"
                      )}
                      {signupStep < 3 && <ArrowRight className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      Already have an account?{" "}
                      <button onClick={() => setMode("login")} className="text-[#7C5CFF] font-black hover:underline">
                        Sign In
                      </button>
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Mobile Login Form */
                <motion.div
                  key="login-mobile"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <SocialLogin />
                  
                  <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                    <FloatingField
                      id="login-email-mob"
                      label="Email Address"
                      type="email"
                      value={loginEmail}
                      onChange={(v) => {
                         setLoginEmail(v);
                         setLoginFieldErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="you@example.com"
                      icon={<Mail className="h-4 w-4" />}
                      error={loginFieldErrors.email}
                    />

                    <FloatingField
                      id="login-pw-mob"
                      label="Password"
                      type={showLoginPw ? "text" : "password"}
                      value={loginPassword}
                      onChange={(v) => {
                        setLoginPassword(v);
                        setLoginFieldErrors((p) => ({ ...p, password: undefined }));
                      }}
                      placeholder="••••••••"
                      icon={<Lock className="h-4 w-4" />}
                      error={loginFieldErrors.password}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowLoginPw(!showLoginPw)}
                          className="text-slate-400 dark:text-white/30 hover:text-[#7C5CFF] p-1"
                        >
                          {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />

                    <div className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" />
                        <span className="text-slate-500 font-bold">Secure Session</span>
                      </div>
                      <Link href={ROUTES.FORGOT_PASSWORD} className="font-bold text-slate-500">
                        Forgot password?
                      </Link>
                    </div>

                    {loginError && (
                      <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3 text-[11px] font-bold text-red-400">
                        {AUTH_ERROR_MESSAGES[loginError] || loginError}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Link
                        href={ROUTES.HOME}
                        className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] px-4 py-3.5 text-xs font-bold text-slate-700"
                      >
                        <ArrowLeft className="h-4 w-4" /> Home
                      </Link>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] py-3.5 text-xs font-black text-white"
                      >
                        {isLoading ? (
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                          <>
                            Sign In <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500">
                      No account yet?{" "}
                      <button onClick={() => setMode("signup")} className="text-[#7C5CFF] font-black hover:underline">
                        Create one
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-12 relative min-h-screen">
      {/* Background atmospheric glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#7C5CFF]/5 dark:bg-[#7C5CFF]/10 blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-[#FF6B4A]/5 dark:bg-[#FF6B4A]/8 blur-[120px] animate-pulse" style={{ animationDuration: "16s" }} />
      </div>

      <AnimatePresence mode="wait">
        {verificationToken ? (
          /* Verification view */
          <motion.div
            key="verification-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md bg-white/70 dark:bg-[#0B1020]/80 backdrop-blur-2xl border border-slate-200/80 dark:border-white/[0.08] rounded-3xl p-8 text-center space-y-6 shadow-elevated z-10"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Check your email!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                We&apos;ve sent a verification link to <span className="text-slate-900 dark:text-white font-semibold">{step1.email}</span>. Click the link to activate your account.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] p-4 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 h-10 w-10 bg-[#7C5CFF]/10 rounded-full blur-md" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Sandbox Simulation Mode
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                Click the direct link below to simulate email verification:
              </p>
              <Link
                href={`${ROUTES.VERIFY_EMAIL}?token=${verificationToken}`}
                className="block text-center rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] p-0.5"
              >
                <div className="rounded-[10px] bg-white dark:bg-[#0B1020]/90 hover:bg-transparent px-3 py-2 text-[10px] font-bold text-[#7C5CFF] hover:text-white transition-colors">
                  Simulate Email Verification Link
                </div>
              </Link>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setVerificationToken(null);
                  setMode("login");
                }}
                className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#7C5CFF] transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </motion.div>
        ) : (
          /* Spotlight card */
          <div className="flex flex-col gap-3 z-10 w-[860px] max-w-full">
            <div className="flex justify-start px-1">
              <Link
                href={ROUTES.HOME}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#7C5CFF] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>

            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group/card w-full min-h-[580px] relative overflow-hidden rounded-3xl glass-surface flex flex-col md:flex-row transition-all duration-500 ease-out"
            >
              {/* Spotlight Border Glow */}
              {isHovered && (
                <div
                  className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300 z-0"
                  style={{
                    background: `radial-gradient(220px circle at ${coords.x}px ${coords.y}px, rgba(124, 92, 255, 0.15), transparent 80%)`,
                  }}
                />
              )}

              {/* Inner top center light */}
              <div
                className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-36 w-60 rounded-full opacity-20"
                style={{
                  background: "radial-gradient(circle, rgba(124, 92, 255, 0.7) 0%, transparent 70%)",
                  filter: "blur(28px)",
                }}
              />

              {/* Forms sliding wrapper */}
              <div className="w-full md:w-full overflow-hidden relative z-10 flex-1 flex flex-col justify-center">
                <div
                  className={cn(
                    "flex transition-all duration-700 ease-in-out h-full items-stretch",
                    "w-[200%] md:w-full md:transition-none md:translate-x-0",
                    mode === "signup" ? "translate-x-0" : "-translate-x-1/2"
                  )}
                >
                  {/* 1. SIGNUP FORM CONTAINER */}
                  <div
                    className={cn(
                      "w-1/2 md:w-1/2 p-8 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out z-10",
                      mode === "login" ? "md:opacity-0 md:pointer-events-none" : "opacity-100"
                    )}
                  >
                    <motion.div
                      variants={formContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4 max-w-sm mx-auto w-full"
                    >
                      <motion.div variants={formItemVariants} className="text-center md:text-left mb-1">
                        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Join the elite developer community</p>
                      </motion.div>

                      <motion.div variants={formItemVariants}>
                        <StepIndicator current={signupStep} />
                </motion.div>

                <div className="min-h-[230px]">
                  {signupStep === 0 && (
                    <motion.div
                      variants={formContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-3"
                    >
                      <motion.div variants={formItemVariants}>
                        <SocialLogin />
                      </motion.div>
                      
                      <motion.div variants={formItemVariants}>
                        <FloatingField
                          id="signup-email"
                          label="Email Address"
                          type="email"
                          value={step1.email}
                          onChange={(v) => setStep1({ ...step1, email: v })}
                          placeholder="you@example.com"
                          icon={<Mail className="h-4 w-4" />}
                          error={signupStepErrors.email}
                        />
                      </motion.div>

                      <motion.div variants={formItemVariants} className="space-y-1">
                        <FloatingField
                          id="signup-password"
                          label="Password"
                          type={showSignupPw ? "text" : "password"}
                          value={step1.password}
                          onChange={(v) => setStep1({ ...step1, password: v })}
                          placeholder="••••••••"
                          icon={<Lock className="h-4 w-4" />}
                          error={signupStepErrors.password}
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowSignupPw(!showSignupPw)}
                              className="text-slate-400 dark:text-white/30 hover:text-[#7C5CFF] dark:hover:text-[#7C5CFF] transition-colors p-1"
                              aria-label="Toggle password visibility"
                            >
                              {showSignupPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          }
                        />
                        <PasswordStrength password={step1.password} />
                      </motion.div>

                      <motion.div variants={formItemVariants}>
                        <FloatingField
                          id="signup-confirm"
                          label="Confirm Password"
                          type={showConfirmPw ? "text" : "password"}
                          value={step1.confirmPassword}
                          onChange={(v) => setStep1({ ...step1, confirmPassword: v })}
                          placeholder="••••••••"
                          icon={<Lock className="h-4 w-4" />}
                          error={signupStepErrors.confirmPassword}
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowConfirmPw(!showConfirmPw)}
                              className="text-slate-400 dark:text-white/30 hover:text-[#7C5CFF] dark:hover:text-[#7C5CFF] transition-colors p-1"
                              aria-label="Toggle password visibility"
                            >
                              {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          }
                        />
                      </motion.div>

                      <motion.div variants={formItemVariants} className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={acceptedTerms}
                            onChange={(e) => setAcceptedTerms(e.target.checked)}
                            className="mt-0.5 h-3.5 w-3.5 rounded border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-white/[0.02] text-[#7C5CFF] focus:ring-[#7C5CFF]/30 outline-none"
                          />
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                            I agree to the{" "}
                            <span className="text-[#7C5CFF] hover:underline font-bold">Terms of Service</span> and{" "}
                            <span className="text-[#7C5CFF] hover:underline font-bold">Privacy Policy</span>.
                          </span>
                        </label>
                        {signupStepErrors.terms && (
                          <p className="text-[10px] text-red-500 dark:text-red-400 mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {signupStepErrors.terms}
                          </p>
                        )}
                      </motion.div>
                    </motion.div>
                  )}

                  {signupStep === 1 && (
                    <motion.div
                      variants={formContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      <motion.div variants={formItemVariants}>
                        <FloatingField
                          id="signup-name"
                          label="Display Name"
                          value={step2.name}
                          onChange={(v) => setStep2({ ...step2, name: v })}
                          placeholder="Alex Chen"
                          icon={<User className="h-4 w-4" />}
                          error={signupStepErrors.name}
                        />
                      </motion.div>

                      <motion.div variants={formItemVariants}>
                        <FloatingField
                          id="signup-username"
                          label="Username"
                          value={step2.username}
                          onChange={(v) => setStep2({ ...step2, username: v.toLowerCase().replace(/\s/g, "_") })}
                          placeholder="alexchen"
                          icon={<AtSign className="h-4 w-4" />}
                          error={signupStepErrors.username}
                          hint="Your public handle will be @username"
                        />
                      </motion.div>
                    </motion.div>
                  )}

                  {signupStep === 2 && (
                    <motion.div
                      variants={formContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      <motion.div variants={formItemVariants} className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Choose learning track</span>
                        <div className="grid grid-cols-3 gap-2">
                          <TrackCard
                            value="python"
                            selected={step3.track === "python"}
                            onSelect={() => setStep3({ ...step3, track: "python" })}
                            icon={<PythonIcon />}
                            title="Python"
                            accentColor="#22C55E"
                          />
                          <TrackCard
                            value="javascript"
                            selected={step3.track === "javascript"}
                            onSelect={() => setStep3({ ...step3, track: "javascript" })}
                            icon={<JavaScriptIcon />}
                            title="JS"
                            accentColor="#F59E0B"
                          />
                          <TrackCard
                            value="both"
                            selected={step3.track === "both"}
                            onSelect={() => setStep3({ ...step3, track: "both" })}
                            icon={<BothIcon />}
                            title="Both"
                            accentColor="#7C5CFF"
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  {signupStep === 3 && (
                    <motion.div
                      variants={formContainerVariants}
                      initial="hidden"
                      animate="show"
                      className="space-y-4"
                    >
                      <motion.div variants={formItemVariants} className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Primary Goal</span>
                        <div className="grid grid-cols-2 gap-2">
                          {GOALS.map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => setStep3({ ...step3, goal: g.value })}
                              className={cn(
                                "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 outline-none hover:bg-slate-100/50 dark:hover:bg-white/[0.04] group/goal",
                                step3.goal === g.value
                                  ? "border-[#7C5CFF] bg-[#7C5CFF]/10 shadow-[0_0_15px_rgba(124,92,255,0.1)] text-[#7C5CFF]"
                                  : "border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02]"
                              )}
                            >
                              <div
                                className={cn(
                                  "p-2 rounded-xl transition-all duration-300",
                                  step3.goal === g.value
                                    ? "bg-white dark:bg-white/10 text-[#7C5CFF]"
                                    : "bg-slate-100 dark:bg-white/5 text-slate-400 group-hover/goal:text-slate-600 dark:group-hover/goal:text-white"
                                )}
                              >
                                {g.icon}
                              </div>
                              <span className={cn(
                                "text-xs font-bold transition-colors",
                                step3.goal === g.value ? "text-[#7C5CFF] dark:text-white" : "text-slate-900 dark:text-slate-300"
                              )}>
                                {g.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      </motion.div>

                      {signupError && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3"
                        >
                          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                          <p className="text-[11px] font-bold text-red-400">
                            {AUTH_ERROR_MESSAGES[signupError] || signupError}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Signup controls */}
                <motion.div variants={formItemVariants} className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={signupStep > 0 ? goSignupBack : () => setMode("login")}
                    className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all outline-none cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <motion.button
                    type="button"
                    onClick={signupStep === 3 ? handleSignupSubmit : goSignupNext}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-[#7C5CFF]/15 hover:shadow-[#7C5CFF]/25 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none outline-none cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : signupStep === 3 ? (
                      "Create Account"
                    ) : (
                      "Continue"
                    )}
                    {signupStep < 3 && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
                  </motion.button>
                </motion.div>

                {/* Mobile tab toggle */}
                <motion.div variants={formItemVariants} className="md:hidden text-center pt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Already have an account?{" "}
                    <button onClick={() => setMode("login")} className="text-[#7C5CFF] font-black hover:underline outline-none cursor-pointer">
                      Sign In
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* 2. LOGIN FORM CONTAINER (Right half on desktop) */}
            <div
              className={cn(
                "w-1/2 md:w-1/2 p-8 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out z-10",
                mode === "signup" ? "md:opacity-0 md:pointer-events-none" : "opacity-100"
              )}
            >
              <motion.div
                variants={formContainerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4 max-w-sm mx-auto w-full"
              >
                <motion.div variants={formItemVariants} className="text-center md:text-left mb-1">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sign in to continue your journey</p>
                </motion.div>

                <motion.div variants={formItemVariants}>
                  <SocialLogin />
                </motion.div>

                <form onSubmit={handleLoginSubmit} className="space-y-4" noValidate>
                  <motion.div variants={formItemVariants}>
                    <FloatingField
                      id="login-email"
                      label="Email Address"
                      type="email"
                      value={loginEmail}
                      onChange={(v) => {
                         setLoginEmail(v);
                         setLoginFieldErrors((p) => ({ ...p, email: undefined }));
                      }}
                      placeholder="you@example.com"
                      icon={<Mail className="h-4 w-4" />}
                      error={loginFieldErrors.email}
                    />
                  </motion.div>

                  <motion.div variants={formItemVariants}>
                    <FloatingField
                      id="login-password"
                      label="Password"
                      type={showLoginPw ? "text" : "password"}
                      value={loginPassword}
                      onChange={(v) => {
                        setLoginPassword(v);
                        setLoginFieldErrors((p) => ({ ...p, password: undefined }));
                      }}
                      placeholder="••••••••"
                      icon={<Lock className="h-4 w-4" />}
                      error={loginFieldErrors.password}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowLoginPw(!showLoginPw)}
                          className="text-slate-400 dark:text-white/30 hover:text-[#7C5CFF] dark:hover:text-[#7C5CFF] transition-colors p-1"
                          aria-label="Toggle password visibility"
                        >
                          {showLoginPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                  </motion.div>

                  <motion.div variants={formItemVariants} className="flex justify-between items-center pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]" />
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">Secure Session</span>
                    </div>
                    <Link
                      href={ROUTES.FORGOT_PASSWORD}
                      className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-[#7C5CFF] transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                      <p className="text-[11px] font-bold text-red-400">
                        {AUTH_ERROR_MESSAGES[loginError] || loginError}
                      </p>
                    </motion.div>
                  )}

                  <div className="flex gap-2.5 pt-2">
                    <Link
                      href={ROUTES.HOME}
                      className="flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-white/[0.02] px-4 py-3.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.04] transition-all outline-none cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" /> Home
                    </Link>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-[#7C5CFF]/15 hover:shadow-[#7C5CFF]/25 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none outline-none cursor-pointer"
                    >
                      {isLoading ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>

                {/* Mobile tab toggle */}
                <motion.div variants={formItemVariants} className="md:hidden text-center pt-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No account yet?{" "}
                    <button onClick={() => setMode("signup")} className="text-[#7C5CFF] font-black hover:underline outline-none cursor-pointer">
                      Create one
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

            {/* 3. DESKTOP SLIDING OVERLAY CONTAINER */}
            <div
              className={cn(
                "hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20",
                mode === "signup" ? "translate-x-full" : "translate-x-0"
              )}
            >
              {/* Sliding Background Shimmer / Sweep Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#090D1C] via-[#0D122B] to-[#060A18] overflow-hidden">
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
                {/* Fluid glowing blobs inside overlay */}
                <span className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#7C5CFF]/30 blur-[56px] animate-pulse" style={{ animationDuration: "6s" }} />
                <span className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-[#FF6B4A]/25 blur-[56px] animate-pulse" style={{ animationDuration: "8s" }} />
                <span className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-[#3B82F6]/25 blur-[48px] animate-pulse" style={{ animationDuration: "7s" }} />
              </div>

              {/* Inverse sliding contents wrapper */}
              <div
                className="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: mode === "signup" ? "translateX(-50%)" : "translateX(0)",
                }}
              >
                {/* Left side content (active when overlay is on the left -> Login Mode is active) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-10 text-center text-white relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06)_0%,transparent_50%)]" />
                  
                  <div className="relative z-10 flex flex-col items-center w-full">
                    {/* Glowing AI Core Visual */}
                    <AICoreVisual />
                    
                    <h2 className="text-2xl font-black mb-2 tracking-tight">Welcome Back!</h2>
                    <p className="text-[11px] mb-6 max-w-[250px] opacity-75 leading-relaxed font-medium">
                      Access your sandbox and continue your path to master coding.
                    </p>
                    
                    <motion.button
                      type="button"
                      onClick={() => setMode("signup")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-white/20 bg-white/5 hover:bg-white hover:text-[#0b0e26] rounded-2xl px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 outline-none hover:shadow-xl hover:shadow-black/20 cursor-pointer"
                    >
                      Sign Up
                    </motion.button>

                    <LiveTerminalConsole />
                  </div>
                </div>

                {/* Right side content (active when overlay is on the right -> Signup Mode is active) */}
                <div className="w-1/2 h-full flex flex-col items-center justify-center p-10 text-center text-white relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.06)_0%,transparent_50%)]" />

                  <div className="relative z-10 flex flex-col items-center w-full">
                    {/* Glowing AI Core Visual */}
                    <AICoreVisual />

                    <h2 className="text-2xl font-black mb-2 tracking-tight">Start Coding Elite!</h2>
                    <p className="text-[11px] mb-6 max-w-[250px] opacity-75 leading-relaxed font-medium">
                      Establish your profile and launch your high-performance workspace.
                    </p>

                    <motion.button
                      type="button"
                      onClick={() => setMode("login")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border border-white/20 bg-white/5 hover:bg-white hover:text-[#0b0e26] rounded-2xl px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 outline-none hover:shadow-xl hover:shadow-black/20 cursor-pointer"
                    >
                      Sign In
                    </motion.button>

                    <LiveTerminalConsole />
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
