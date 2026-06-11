"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye, EyeOff, Mail, Lock, User, AtSign,
  ArrowRight, ArrowLeft, AlertCircle, CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { AUTH_ERROR_MESSAGES, type AuthError, type SignupStep1, type SignupStep2, type SignupStep3 } from "@/types/auth";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/utils/cn";

/* ─── Step indicator ─────────────────────────────────────────────── */
const STEP_LABELS = ["Credentials", "Profile", "Your Goal"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  done
                    ? "bg-[#22C55E] text-white shadow-[0_0_12px_rgba(34,197,94,0.4)]"
                    : active
                    ? "bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] text-white shadow-[0_0_12px_rgba(124,92,255,0.4)]"
                    : "bg-white/[0.06] text-white/30 border border-white/[0.08]"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-mono uppercase tracking-widest transition-colors",
                  active ? "text-white/80" : done ? "text-[#22C55E]" : "text-white/25"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  "h-px w-12 sm:w-20 mx-2 mb-5 transition-all duration-500",
                  done ? "bg-[#22C55E]/50" : "bg-white/[0.07]"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Input Field ────────────────────────────────────────────────── */
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: string;
  hint?: string;
  autoComplete?: string;
}

function Field({
  id, label, type = "text", value, onChange, placeholder,
  icon, rightElement, error, hint, autoComplete,
}: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-white/70">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "w-full rounded-2xl border bg-white/[0.04] pl-11 py-3.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200",
            rightElement ? "pr-12" : "pr-4",
            "focus:bg-white/[0.07] focus:ring-2",
            error
              ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
              : "border-white/[0.08] focus:border-[#7C5CFF]/60 focus:ring-[#7C5CFF]/20"
          )}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-1.5 text-xs text-red-400"
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
            className="text-xs text-white/25"
          >
            {hint}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Password strength ──────────────────────────────────────────── */
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Symbol", pass: /[^a-zA-Z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.pass).length;

  if (!password) return null;

  const colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#22C55E"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= strength ? colors[strength] : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className={cn(
              "text-[10px] transition-colors",
              c.pass ? "text-[#22C55E]" : "text-white/25"
            )}
          >
            {c.pass ? "✓" : "○"} {c.label}
          </span>
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[strength] }}>
        {labels[strength]}
      </p>
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
  description: string;
  accentColor: string;
}

function TrackCard({ value, selected, onSelect, emoji, title, description, accentColor }: TrackCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative w-full rounded-2xl border p-4 text-left transition-all duration-200",
        selected
          ? "border-opacity-100 bg-opacity-10"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]"
      )}
      style={{
        borderColor: selected ? accentColor : undefined,
        background: selected ? `${accentColor}12` : undefined,
        boxShadow: selected ? `0 0 0 1px ${accentColor}40, 0 8px 24px ${accentColor}15` : undefined,
      }}
    >
      {selected && (
        <span
          className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full text-[10px]"
          style={{ background: accentColor }}
        >
          ✓
        </span>
      )}
      <div className="text-2xl mb-2">{emoji}</div>
      <div className="text-sm font-bold text-white">{title}</div>
      <div className="text-xs text-white/45 mt-0.5 leading-relaxed">{description}</div>
    </button>
  );
}

/* ─── Goal Card ──────────────────────────────────────────────────── */
const GOALS = [
  { value: "job", emoji: "💼", label: "Get a job", description: "Land a software engineering role" },
  { value: "freelance", emoji: "🌍", label: "Freelance", description: "Build client projects & earn" },
  { value: "upskill", emoji: "📈", label: "Upskill", description: "Level up at my current job" },
  { value: "hobby", emoji: "🎮", label: "For fun", description: "Code as a creative outlet" },
] as const;

/* ─── Step 1 — Credentials ───────────────────────────────────────── */
function Step1({
  data,
  setData,
  onNext,
}: {
  data: SignupStep1;
  setData: (d: SignupStep1) => void;
  onNext: () => void;
}) {
  const id = useId();
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Partial<SignupStep1 & { confirmPassword: string }>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!data.email.includes("@")) e.email = "Enter a valid email.";
    if (data.password.length < 8) e.password = "Password must be at least 8 characters.";
    if (data.password !== data.confirmPassword) e.confirmPassword = "Passwords do not match.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="space-y-4">
      <Field
        id={`${id}-email`}
        label="Email address"
        type="email"
        value={data.email}
        onChange={(v) => { setData({ ...data, email: v }); setErrors((p) => ({ ...p, email: undefined })); }}
        placeholder="you@example.com"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email}
        autoComplete="email"
      />
      <div className="space-y-2">
        <Field
          id={`${id}-password`}
          label="Password"
          type={showPw ? "text" : "password"}
          value={data.password}
          onChange={(v) => { setData({ ...data, password: v }); setErrors((p) => ({ ...p, password: undefined })); }}
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          error={errors.password}
          autoComplete="new-password"
          rightElement={
            <button type="button" onClick={() => setShowPw((v) => !v)} className="text-white/30 hover:text-white/60 transition-colors" aria-label="Toggle password">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        <PasswordStrength password={data.password} />
      </div>
      <Field
        id={`${id}-confirm`}
        label="Confirm password"
        type={showConfirm ? "text" : "password"}
        value={data.confirmPassword}
        onChange={(v) => { setData({ ...data, confirmPassword: v }); setErrors((p) => ({ ...p, confirmPassword: undefined })); }}
        placeholder="••••••••"
        icon={<Lock className="h-4 w-4" />}
        error={errors.confirmPassword}
        autoComplete="new-password"
        rightElement={
          <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-white/30 hover:text-white/60 transition-colors" aria-label="Toggle confirm password">
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />
      <NavButtons onNext={() => { if (validate()) onNext(); }} />
    </div>
  );
}

/* ─── Step 2 — Profile ───────────────────────────────────────────── */
function Step2({
  data,
  setData,
  onNext,
  onBack,
}: {
  data: SignupStep2;
  setData: (d: SignupStep2) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const id = useId();
  const [errors, setErrors] = useState<Partial<SignupStep2>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!data.name.trim()) e.name = "Please enter your name.";
    if (data.username.length < 3) e.username = "Username must be at least 3 characters.";
    if (!/^[a-zA-Z0-9_]+$/.test(data.username)) e.username = "Only letters, numbers, underscores.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  return (
    <div className="space-y-4">
      <Field
        id={`${id}-name`}
        label="Full name"
        value={data.name}
        onChange={(v) => { setData({ ...data, name: v }); setErrors((p) => ({ ...p, name: undefined })); }}
        placeholder="Alex Chen"
        icon={<User className="h-4 w-4" />}
        error={errors.name}
        autoComplete="name"
      />
      <Field
        id={`${id}-username`}
        label="Username"
        value={data.username}
        onChange={(v) => { setData({ ...data, username: v.toLowerCase().replace(/\s/g, "_") }); setErrors((p) => ({ ...p, username: undefined })); }}
        placeholder="alexchen"
        icon={<AtSign className="h-4 w-4" />}
        error={errors.username}
        hint="Your public profile URL will be codeversai.dev/@alexchen"
        autoComplete="username"
      />
      <NavButtons onBack={onBack} onNext={() => { if (validate()) onNext(); }} />
    </div>
  );
}

/* ─── Step 3 — Track & Goal ──────────────────────────────────────── */
function Step3({
  data,
  setData,
  onBack,
  onSubmit,
  isLoading,
  error,
}: {
  data: SignupStep3;
  setData: (d: SignupStep3) => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: AuthError | null;
}) {
  return (
    <div className="space-y-6">
      {/* Track selection */}
      <div>
        <p className="text-sm font-medium text-white/70 mb-3">
          Which track do you want to start?
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <TrackCard
            value="python"
            selected={data.track === "python"}
            onSelect={() => setData({ ...data, track: "python" })}
            emoji="🐍"
            title="Python"
            description="Data, backend, automation"
            accentColor="#22C55E"
          />
          <TrackCard
            value="javascript"
            selected={data.track === "javascript"}
            onSelect={() => setData({ ...data, track: "javascript" })}
            emoji="⚡"
            title="JavaScript"
            description="Frontend, full-stack, Node"
            accentColor="#F59E0B"
          />
          <TrackCard
            value="both"
            selected={data.track === "both"}
            onSelect={() => setData({ ...data, track: "both" })}
            emoji="🚀"
            title="Both"
            description="Full-stack engineer path"
            accentColor="#7C5CFF"
          />
        </div>
      </div>

      {/* Goal selection */}
      <div>
        <p className="text-sm font-medium text-white/70 mb-3">What&apos;s your primary goal?</p>
        <div className="grid grid-cols-2 gap-2.5">
          {GOALS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => setData({ ...data, goal: g.value })}
              className={cn(
                "rounded-2xl border p-3.5 text-left transition-all duration-200",
                data.goal === g.value
                  ? "border-[#7C5CFF]/50 bg-[#7C5CFF]/10 shadow-[0_0_0_1px_rgba(124,92,255,0.3)]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]"
              )}
            >
              <div className="text-xl mb-1.5">{g.emoji}</div>
              <div className="text-sm font-semibold text-white">{g.label}</div>
              <div className="text-xs text-white/40 mt-0.5">{g.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      <AnimatePresence initial={false}>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2.5 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-4 py-3"
          >
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-red-400">{AUTH_ERROR_MESSAGES[error]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <NavButtons
        onBack={onBack}
        onNext={onSubmit}
        nextLabel="Create Account"
        isLoading={isLoading}
        disabled={!data.track || !data.goal}
      />
    </div>
  );
}

/* ─── Nav Buttons ────────────────────────────────────────────────── */
function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  isLoading = false,
  disabled = false,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-3.5 text-sm font-semibold text-white/70 transition-all hover:bg-white/[0.07] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={isLoading || disabled}
        className="group relative flex flex-1 items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] px-6 py-3.5 font-semibold text-white shadow-[0_8px_32px_rgba(255,107,74,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(255,107,74,0.3)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
              className="block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
            />
            Creating account...
          </span>
        ) : (
          <>
            {nextLabel}
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 32 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -32 }),
};

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState<AuthError | null>(null);

  const [step1, setStep1] = useState<SignupStep1>({ email: "", password: "", confirmPassword: "" });
  const [step2, setStep2] = useState<SignupStep2>({ name: "", username: "" });
  const [step3, setStep3] = useState<SignupStep3>({ track: "python", goal: "job" });

  function goNext() { setDir(1); setStep((s) => s + 1); }
  function goBack() { setDir(-1); setStep((s) => s - 1); }

  async function handleSubmit() {
    setError(null);
    const { error: authError } = await signup({ ...step1, ...step2, ...step3 });
    if (authError) {
      setError(authError);
    } else {
      router.push(ROUTES.DASHBOARD);
    }
  }

  const stepTitles = [
    { heading: "Create your account", sub: "Start your engineering journey" },
    { heading: "Set up your profile", sub: "How should we call you?" },
    { heading: "Personalize your path", sub: "We'll tailor your experience" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className="w-full max-w-lg"
    >
      <div
        className="relative overflow-hidden rounded-3xl p-8 sm:p-10"
        style={{
          background: "rgba(8, 12, 28, 0.85)",
          border: "1px solid rgba(255,255,255,0.09)",
          backdropFilter: "blur(32px)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Top glow */}
        <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-32 w-48 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(255,107,74,0.7) 0%, transparent 70%)", filter: "blur(24px)" }}
        />

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* Dynamic heading */}
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={`heading-${step}`}
            custom={dir}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
            className="mb-6 text-center"
          >
            <h1 className="text-2xl font-black text-white tracking-tight">
              {stepTitles[step].heading}
            </h1>
            <p className="mt-1.5 text-sm text-white/45">{stepTitles[step].sub}</p>
          </motion.div>
        </AnimatePresence>

        {/* Step content */}
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={`step-${step}`}
            custom={dir}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          >
            {step === 0 && <Step1 data={step1} setData={setStep1} onNext={goNext} />}
            {step === 1 && <Step2 data={step2} setData={setStep2} onNext={goNext} onBack={goBack} />}
            {step === 2 && (
              <Step3
                data={step3}
                setData={setStep3}
                onBack={goBack}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Switch to login */}
        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{" "}
          <Link
            href={ROUTES.LOGIN}
            className="font-semibold text-[#7C5CFF] hover:text-[#A78BFF] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
