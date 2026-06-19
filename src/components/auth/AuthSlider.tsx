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
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AUTH_ERROR_MESSAGES, type AuthError, type SignupStep1, type SignupStep2, type SignupStep3 } from "@/types/auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";
import SocialLogin from "@/components/auth/SocialLogin";

/* ─── Interactive AI Core Visual ────────────────────────────────── */
function AICoreVisual() {
  return (
    <div className="relative w-28 h-28 flex items-center justify-center mb-5 select-none">
      {/* Outer spinning ring (Clockwise) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#7C5CFF] opacity-60">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="10 12 30 10"
          />
        </svg>
      </motion.div>

      {/* Middle spinning ring (Counter-clockwise) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute w-[82%] h-[82%]"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#FF6B4A] opacity-70">
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="5 5 15 5"
          />
        </svg>
      </motion.div>

      {/* Inner glowing core with orbital nodes */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="absolute w-[64%] h-[64%] flex items-center justify-center"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400 opacity-80">
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="4 20"
          />
          <circle cx="50" cy="12" r="3" fill="currentColor" className="animate-pulse" />
          <circle cx="50" cy="88" r="3" fill="currentColor" className="animate-pulse" />
        </svg>
      </motion.div>

      {/* Center stationary core pulse */}
      <div className="absolute w-[44%] h-[44%] rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#FF6B4A] p-[2px] shadow-[0_0_20px_rgba(124,92,255,0.5)] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-sm" />
        <Zap className="relative z-10 h-4.5 w-4.5 text-white animate-pulse" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[20%] left-[20%] w-1 h-1 rounded-full bg-[#7C5CFF] opacity-60 animate-ping" />
        <span className="absolute bottom-[30%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#FF6B4A] opacity-50 animate-bounce" style={{ animationDuration: "3s" }} />
      </div>
    </div>
  );
}

/* ─── Simulated Live Console Shell ──────────────────────────────── */
function LiveTerminalConsole() {
  const [logs, setLogs] = useState<string[]>([
    "Initializing cognitive mentor engine v2.8...",
    "Establishing secure session layer..."
  ]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = [
      "Securing route tunnels via AES-256...",
      "Python & JavaScript interpreters: LOADED",
      "Parsing user dashboard state nodes...",
      "Syncing workspace databases...",
      "Connection state: SECURE and established",
      "Cognitive feedback nodes: ONLINE",
      "System fully operational. Awaiting client handshake..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < list.length) {
        setLogs((prev) => [...prev, list[i]]);
        i++;
      } else {
        setLogs([
          "Initializing cognitive mentor engine v2.8...",
          "Establishing secure session layer..."
        ]);
        i = 0;
      }
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full max-w-[270px] bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-2.5 font-mono text-[8.5px] text-[#39ff14]/85 text-left shadow-inner mt-6 overflow-hidden h-[76px] flex flex-col justify-between select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-1 text-[7.5px] text-white/50 tracking-wider">
        <span>CONSOLE SHELL</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[#39ff14] animate-ping" />
          LIVE
        </span>
      </div>
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="leading-tight">
            <span className="text-white/40 mr-1">$</span>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step Indicator with SVG connecting lines and glows ─────────── */
const STEP_LABELS = ["Credentials", "Profile", "Goal"];

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
                    ? "bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] text-white shadow-[0_0_15px_rgba(124,92,255,0.4)]"
                    : "bg-input-bg/40 text-muted border border-border-subtle"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </motion.div>
              <span
                className={cn(
                  "text-[8px] font-black uppercase tracking-wider transition-colors",
                  active ? "bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] bg-clip-text text-transparent" : done ? "text-[#22C55E]" : "text-muted/60"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-10 sm:w-14 mx-1 mb-4 rounded-full transition-all duration-500",
                  done ? "bg-[#22C55E]" : "bg-border-subtle"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Floating Label Input Field ────────────────────────────────── */
interface FloatingFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

function FloatingField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  rightElement,
  error,
  hint,
  autoComplete,
}: FloatingFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isPopulated = value.length > 0;
  const isLifted = isFocused || isPopulated;

  return (
    <div className="space-y-1 relative">
      <div className={cn(
        "relative rounded-2xl border border-border-subtle bg-input-bg/25 hover:bg-input-bg/40 focus-within:bg-input-bg/50 focus-within:border-[#7C5CFF] transition-all duration-300",
        isFocused ? "shadow-[0_0_20px_rgba(124,92,255,0.15)] ring-1 ring-[#7C5CFF]/20" : "shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
      )}>
        {/* Left icon wrapper */}
        <div className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
          isFocused ? "text-[#7C5CFF]" : "text-muted/50"
        )}>
          {icon}
        </div>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-10 font-bold transition-all duration-300 origin-left select-none",
            isLifted
              ? "top-1.5 text-[8px] uppercase tracking-wider text-[#7C5CFF]/80"
              : "top-1/2 -translate-y-1/2 text-xs text-muted/60"
          )}
        >
          {label}
        </label>

        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ""}
          autoComplete={autoComplete}
          className="w-full bg-transparent pl-10 pr-10 pt-5 pb-2 text-xs text-text outline-none"
        />

        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">{rightElement}</div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            className="flex items-center gap-1 text-[10px] text-red-500 dark:text-red-400 pl-1"
          >
            <AlertCircle className="h-3 w-3 shrink-0" />
            {error}
          </motion.p>
        )}
        {!error && hint && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[9px] text-muted pl-1 font-mono"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
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
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="space-y-1 pt-1 pl-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= strength ? "" : "bg-[#0F172A]/[0.08] dark:bg-white/[0.08]"
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
              c.pass ? "text-[#22C55E]" : "text-muted/50"
            )}
          >
            {c.pass ? "✓" : "○"} {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Track Card ─────────────────────────────────────────────────── */
interface TrackCardProps {
  value: string;
  selected: boolean;
  onSelect: () => void;
  emoji: string;
  title: string;
  accentColor: string;
}

function TrackCard({ value, selected, onSelect, emoji, title, accentColor }: TrackCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-2xl border p-4 text-center transition-all duration-300 outline-none group/track overflow-hidden",
        selected
          ? "border-opacity-100 bg-opacity-10 shadow-lg"
          : "border-border-subtle bg-input-bg/10 hover:bg-input-bg/30"
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
      <div className="text-2xl mb-1.5 transition-transform duration-300 group-hover/track:scale-110">{emoji}</div>
      <div className="text-xs font-black text-text">{title}</div>
    </button>
  );
}

const GOALS = [
  { value: "job", emoji: "💼", label: "Get a job" },
  { value: "freelance", emoji: "🌍", label: "Freelance" },
  { value: "upskill", emoji: "📈", label: "Upskill" },
  { value: "hobby", emoji: "🎮", label: "For fun" },
] as const;

interface AuthSliderProps {
  initialMode?: "login" | "signup";
}

export default function AuthSlider({ initialMode = "login" }: AuthSliderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, signup, isLoading } = useAuth();

  // Mode state: 'login' or 'signup'
  const [mode, setModeState] = useState<"login" | "signup">(initialMode);
  
  // Spotlight Glow effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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

  return (
    <div className="w-full flex justify-center items-center px-4 py-6">
      <AnimatePresence mode="wait">
        {verificationToken ? (
          /* Verification view */
          <motion.div
            key="verification-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md bg-surface/85 backdrop-blur-2xl border border-border-subtle rounded-3xl p-8 text-center space-y-6 shadow-elevated"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-text">Check your email!</h2>
              <p className="text-xs text-muted leading-relaxed max-w-sm mx-auto">
                We&apos;ve sent a verification link to <span className="text-text font-semibold">{step1.email}</span>. Click the link to activate your account.
              </p>
            </div>

            <div className="rounded-2xl border border-border-subtle bg-input-bg/20 p-4 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 h-10 w-10 bg-[#7C5CFF]/10 rounded-full blur-md" />
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted block mb-1">
                Sandbox Simulation Mode
              </span>
              <p className="text-[10px] text-muted leading-relaxed mb-3">
                Click the direct link below to simulate email verification:
              </p>
              <Link
                href={`${ROUTES.VERIFY_EMAIL}?token=${verificationToken}`}
                className="block text-center rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] p-0.5"
              >
                <div className="rounded-[10px] bg-surface/90 hover:bg-transparent px-3 py-2 text-[10px] font-bold text-[#7C5CFF] hover:text-white transition-colors">
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
                className="text-xs font-bold text-muted hover:text-text transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </motion.div>
        ) : (
          /* Spotlight card */
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group/card w-[860px] max-w-full min-h-[580px] relative overflow-hidden rounded-3xl border border-border-subtle bg-surface/85 backdrop-blur-2xl shadow-elevated flex flex-col md:flex-row transition-all duration-500 ease-out"
          >
            {/* Spotlight Border Glow */}
            {isHovered && (
              <div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-100 transition-opacity duration-300 z-0"
                style={{
                  background: `radial-gradient(180px circle at ${coords.x}px ${coords.y}px, rgba(124, 92, 255, 0.25), transparent 80%)`,
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

            {/* 1. SIGNUP FORM CONTAINER (Left half on desktop) */}
            <div
              className={cn(
                "w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out z-10",
                mode === "login" ? "opacity-0 pointer-events-none hidden md:flex" : "opacity-100"
              )}
            >
              <motion.div
                variants={formContainerVariants}
                initial="hidden"
                animate={mode === "signup" ? "show" : "hidden"}
                className="space-y-4 max-w-sm mx-auto w-full"
              >
                <motion.div variants={formItemVariants} className="text-center md:text-left mb-1">
                  <h1 className="text-2xl font-black text-text tracking-tight">Create Account</h1>
                  <p className="text-xs text-muted">Join the elite developer community</p>
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
                              className="text-muted/60 hover:text-text transition-colors p-1"
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
                              className="text-muted/60 hover:text-text transition-colors p-1"
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
                            className="mt-0.5 h-3.5 w-3.5 rounded border-border-subtle bg-white/5 text-[#7C5CFF] focus:ring-[#7C5CFF]/30 outline-none"
                          />
                          <span className="text-[10px] text-muted leading-tight">
                            I agree to the{" "}
                            <span className="text-[#7C5CFF] hover:underline font-bold">Terms of Service</span> and{" "}
                            <span className="text-[#7C5CFF] hover:underline font-bold">Privacy Policy</span>.
                          </span>
                        </label>
                        {signupStepErrors.terms && (
                          <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
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
                        <span className="text-xs font-bold text-text/80">Choose learning track</span>
                        <div className="grid grid-cols-3 gap-2">
                          <TrackCard
                            value="python"
                            selected={step3.track === "python"}
                            onSelect={() => setStep3({ ...step3, track: "python" })}
                            emoji="🐍"
                            title="Python"
                            accentColor="#22C55E"
                          />
                          <TrackCard
                            value="javascript"
                            selected={step3.track === "javascript"}
                            onSelect={() => setStep3({ ...step3, track: "javascript" })}
                            emoji="⚡"
                            title="JS"
                            accentColor="#F59E0B"
                          />
                          <TrackCard
                            value="both"
                            selected={step3.track === "both"}
                            onSelect={() => setStep3({ ...step3, track: "both" })}
                            emoji="🚀"
                            title="Both"
                            accentColor="#7C5CFF"
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={formItemVariants} className="space-y-2">
                        <span className="text-xs font-bold text-text/80">Primary Goal</span>
                        <div className="grid grid-cols-2 gap-2">
                          {GOALS.map((g) => (
                            <button
                              key={g.value}
                              type="button"
                              onClick={() => setStep3({ ...step3, goal: g.value })}
                              className={cn(
                                "flex items-center gap-2.5 rounded-2xl border p-3.5 text-left transition-all duration-300 outline-none hover:bg-input-bg/25",
                                step3.goal === g.value
                                  ? "border-[#7C5CFF] bg-[#7C5CFF]/10 shadow-[0_0_15px_rgba(124,92,255,0.15)]"
                                  : "border-border-subtle bg-input-bg/10"
                              )}
                            >
                              <span className="text-lg">{g.emoji}</span>
                              <span className="text-xs font-bold text-text">{g.label}</span>
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
                  {signupStep > 0 && (
                    <button
                      type="button"
                      onClick={goSignupBack}
                      className="flex items-center gap-1.5 rounded-2xl border border-border-subtle bg-input-bg/10 px-4 py-3 text-xs font-bold text-text/85 hover:bg-border-subtle/50 transition-all outline-none"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  )}
                  <motion.button
                    type="button"
                    onClick={signupStep === 2 ? handleSignupSubmit : goSignupNext}
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-[#7C5CFF]/15 hover:shadow-[#7C5CFF]/25 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none outline-none"
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : signupStep === 2 ? (
                      "Create Account"
                    ) : (
                      "Continue"
                    )}
                    {signupStep < 2 && <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />}
                  </motion.button>
                </motion.div>

                {/* Mobile tab toggle */}
                <motion.div variants={formItemVariants} className="md:hidden text-center pt-2">
                  <p className="text-xs text-muted">
                    Already have an account?{" "}
                    <button onClick={() => setMode("login")} className="text-[#7C5CFF] font-black hover:underline outline-none">
                      Sign In
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* 2. LOGIN FORM CONTAINER (Right half on desktop) */}
            <div
              className={cn(
                "w-full md:w-1/2 p-8 sm:p-10 flex flex-col justify-center transition-all duration-500 ease-in-out z-10",
                mode === "signup" ? "opacity-0 pointer-events-none hidden md:flex" : "opacity-100"
              )}
            >
              <motion.div
                variants={formContainerVariants}
                initial="hidden"
                animate={mode === "login" ? "show" : "hidden"}
                className="space-y-4 max-w-sm mx-auto w-full"
              >
                <motion.div variants={formItemVariants} className="text-center md:text-left mb-1">
                  <h1 className="text-2xl font-black text-text tracking-tight">Welcome back</h1>
                  <p className="text-xs text-muted">Sign in to continue your journey</p>
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
                          className="text-muted/60 hover:text-text transition-colors p-1"
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
                      <span className="text-[10px] text-muted font-bold">Secure Session</span>
                    </div>
                    <Link
                      href={ROUTES.FORGOT_PASSWORD}
                      className="text-[10px] font-bold text-muted hover:text-[#7C5CFF] transition-colors"
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

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full group relative flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-5 py-3.5 text-xs font-black text-white shadow-lg shadow-[#7C5CFF]/15 hover:shadow-[#7C5CFF]/25 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none outline-none"
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
                </form>

                {/* Mobile tab toggle */}
                <motion.div variants={formItemVariants} className="md:hidden text-center pt-2">
                  <p className="text-xs text-muted">
                    No account yet?{" "}
                    <button onClick={() => setMode("signup")} className="text-[#7C5CFF] font-black hover:underline outline-none">
                      Create one
                    </button>
                  </p>
                </motion.div>
              </motion.div>
            </div>

            {/* 3. DESKTOP SLIDING OVERLAY CONTAINER */}
            <div
              className={cn(
                "hidden md:block absolute top-0 left-0 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20",
                mode === "signup" ? "translate-x-full" : "translate-x-0"
              )}
            >
              {/* Sliding Background Shimmer / Sweep Effect */}
              <div className="absolute inset-0 bg-[#0A0D1A] overflow-hidden">
                {/* Fluid glowing blobs inside overlay */}
                <span className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-[#7C5CFF]/40 blur-[56px] animate-pulse" style={{ animationDuration: "6s" }} />
                <span className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-[#FF6B4A]/30 blur-[56px] animate-pulse" style={{ animationDuration: "8s" }} />
                <span className="absolute top-1/3 left-1/4 w-48 h-48 rounded-full bg-[#3B82F6]/35 blur-[48px] animate-pulse" style={{ animationDuration: "7s" }} />
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
                      className="border border-white/40 hover:border-white hover:bg-white hover:text-[#7C5CFF] rounded-2xl px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 outline-none hover:shadow-xl hover:shadow-black/20"
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
                      className="border border-white/40 hover:border-white hover:bg-white hover:text-[#7C5CFF] rounded-2xl px-8 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 outline-none hover:shadow-xl hover:shadow-black/20"
                    >
                      Sign In
                    </motion.button>

                    <LiveTerminalConsole />
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
