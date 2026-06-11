"use client";

import { useEffect, useReducer, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

/* ─── Language Configurations ─────────────────────────────────────── */
type Language = "python" | "javascript";

interface CodeToken {
  text: string;
  color: string;
}

interface LanguageConfig {
  label: string;
  filename: string;
  badge: string;
  badgeColor: string;
  lines: CodeToken[][];
  outputLines: string[];
}

const LANGUAGES: Record<Language, LanguageConfig> = {
  python: {
    label: "Python",
    filename: "main.py",
    badge: "🐍",
    badgeColor: "text-[#22C55E]",
    lines: [
      [{ text: "# ProgrammingOS — Become an Engineer", color: "#6B7280" }],
      [],
      [
        { text: "def ", color: "#7C5CFF" },
        { text: "greet", color: "#22C55E" },
        { text: "(name: ", color: "#F8FAFC" },
        { text: "str", color: "#FF6B4A" },
        { text: ") -> ", color: "#F8FAFC" },
        { text: "str", color: "#FF6B4A" },
        { text: ":", color: "#F8FAFC" },
      ],
      [
        { text: "    ", color: "" },
        { text: "return ", color: "#7C5CFF" },
        { text: 'f"Hello, {name}! 🚀"', color: "#FF9966" },
      ],
      [],
      [
        { text: "students", color: "#F8FAFC" },
        { text: " = ", color: "#7C5CFF" },
        { text: '["Nik", "Nikhil!"]', color: "#FF9966" },
      ],
      [
        { text: "for ", color: "#7C5CFF" },
        { text: "s ", color: "#F8FAFC" },
        { text: "in ", color: "#7C5CFF" },
        { text: "students", color: "#F8FAFC" },
        { text: ":", color: "#F8FAFC" },
      ],
      [
        { text: "    ", color: "" },
        { text: "print", color: "#22C55E" },
        { text: "(", color: "#F8FAFC" },
        { text: "greet", color: "#22C55E" },
        { text: "(s))", color: "#F8FAFC" },
      ],
    ],
    outputLines: [
      "Hello, Nik! 🚀",
      "Hello, Nikhil!",
      "",
      "✓ Execution successful  [0.012s]",
    ],
  },
  javascript: {
    label: "JavaScript",
    filename: "index.js",
    badge: "⚡",
    badgeColor: "text-yellow-400",
    lines: [
      [{ text: "// ProgrammingOS — Modern JS", color: "#6B7280" }],
      [],
      [
        { text: "const ", color: "#7C5CFF" },
        { text: "greet", color: "#22C55E" },
        { text: " = (", color: "#F8FAFC" },
        { text: "name", color: "#FF6B4A" },
        { text: ") => {", color: "#F8FAFC" },
      ],
      [
        { text: "  ", color: "" },
        { text: "return ", color: "#7C5CFF" },
        { text: "`Hello, ${", color: "#FF9966" },
        { text: "name", color: "#FF6B4A" },
        { text: "}! 🚀`", color: "#FF9966" },
        { text: ";", color: "#F8FAFC" },
      ],
      [{ text: "};", color: "#F8FAFC" }],
      [],
      [
        { text: "const ", color: "#7C5CFF" },
        { text: "students", color: "#F8FAFC" },
        { text: " = ", color: "#7C5CFF" },
        { text: '["Nik", "Nikhil"]', color: "#FF9966" },
        { text: ";", color: "#F8FAFC" },
      ],
      [
        { text: "students.", color: "#F8FAFC" },
        { text: "forEach", color: "#22C55E" },
        { text: "(", color: "#F8FAFC" },
        { text: "s", color: "#FF6B4A" },
        { text: " => ", color: "#7C5CFF" },
        { text: "console.", color: "#F8FAFC" },
        { text: "log", color: "#22C55E" },
        { text: "(greet(s)));", color: "#F8FAFC" },
      ],
    ],
    outputLines: [
      "Hello, Nik! 🚀",
      "Hello, Nikhil! 🚀",
      "",
      "✓ Execution successful  [0.008s]",
    ],
  },
};

/* ─── State Machine ───────────────────────────────────────────────── */
type Phase = "typing" | "running" | "output" | "success" | "resetting";

interface TerminalState {
  phase: Phase;
  visibleLines: number;
  visibleOutput: number;
  charIndex: number;
  language: Language;
}

type TerminalAction =
  | { type: "NEXT_LINE" }
  | { type: "START_RUNNING" }
  | { type: "NEXT_OUTPUT" }
  | { type: "FINISH" }
  | { type: "RESET" }
  | { type: "SET_LANGUAGE"; language: Language };

function terminalReducer(
  state: TerminalState,
  action: TerminalAction
): TerminalState {
  switch (action.type) {
    case "NEXT_LINE":
      return { ...state, visibleLines: state.visibleLines + 1 };
    case "START_RUNNING":
      return { ...state, phase: "running" };
    case "NEXT_OUTPUT":
      return {
        ...state,
        phase: "output",
        visibleOutput: state.visibleOutput + 1,
      };
    case "FINISH":
      return { ...state, phase: "success" };
    case "RESET":
      return {
        ...state,
        phase: "typing",
        visibleLines: 0,
        visibleOutput: 0,
        charIndex: 0,
      };
    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.language,
        phase: "typing",
        visibleLines: 0,
        visibleOutput: 0,
        charIndex: 0,
      };
    default:
      return state;
  }
}

/* ─── RunningDots ─────────────────────────────────────────────────── */
function RunningDots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#FF6B4A]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

/* ─── Component ───────────────────────────────────────────────────── */
export default function AnimatedTerminal() {
  const [state, dispatch] = useReducer(terminalReducer, {
    phase: "typing",
    visibleLines: 0,
    visibleOutput: 0,
    charIndex: 0,
    language: "python",
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const config = LANGUAGES[state.language];

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    clearTimer();

    const { phase, visibleLines, visibleOutput } = state;
    const totalLines = config.lines.length;
    const totalOutput = config.outputLines.length;

    if (phase === "typing") {
      if (visibleLines < totalLines) {
        // Longer delay for non-empty lines (simulate typing), shorter for blank
        const delay = config.lines[visibleLines].length === 0 ? 100 : 380;
        timerRef.current = setTimeout(() => dispatch({ type: "NEXT_LINE" }), delay);
      } else {
        // All lines typed → trigger running
        timerRef.current = setTimeout(
          () => dispatch({ type: "START_RUNNING" }),
          700
        );
      }
    }

    if (phase === "running") {
      timerRef.current = setTimeout(
        () => dispatch({ type: "NEXT_OUTPUT" }),
        900
      );
    }

    if (phase === "output") {
      if (visibleOutput < totalOutput) {
        timerRef.current = setTimeout(
          () => dispatch({ type: "NEXT_OUTPUT" }),
          320
        );
      } else {
        timerRef.current = setTimeout(() => dispatch({ type: "FINISH" }), 300);
      }
    }

    if (phase === "success") {
      timerRef.current = setTimeout(() => dispatch({ type: "RESET" }), 3200);
    }

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.visibleLines, state.visibleOutput, state.language]);

  const isTyping = state.phase === "typing" && state.visibleLines < config.lines.length;

  return (
    <div className="liquid-glass rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
      {/* ── Chrome Bar ── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07] bg-white/[0.02]">
        {/* Traffic lights */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#FF5F57] shadow-[0_0_6px_rgba(255,95,87,0.5)]" />
          <div className="h-3 w-3 rounded-full bg-[#FEBC2E] shadow-[0_0_6px_rgba(254,188,46,0.5)]" />
          <div className="h-3 w-3 rounded-full bg-[#28C840] shadow-[0_0_6px_rgba(40,200,64,0.5)]" />
        </div>

        {/* File tab */}
        <div className="flex items-center gap-2 rounded-lg bg-white/[0.06] border border-white/[0.08] px-3 py-1.5">
          <span className={cn("text-sm", config.badgeColor)}>{config.badge}</span>
          <span className="font-mono text-xs text-white/70">{config.filename}</span>
        </div>

        {/* Language switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-black/30 p-1">
          {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => dispatch({ type: "SET_LANGUAGE", language: lang })}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium transition-all duration-200",
                state.language === lang
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/40 hover:text-white/70"
              )}
            >
              {LANGUAGES[lang].label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Code Editor Panel ── */}
      <div className="p-5 min-h-[240px] bg-[#060d1a]">
        {/* Line numbers + code */}
        <div className="font-mono text-sm leading-7 space-y-0">
          {config.lines.slice(0, state.visibleLines).map((tokens, lineIdx) => (
            <motion.div
              key={`${state.language}-line-${lineIdx}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="flex gap-4"
            >
              <span className="w-5 shrink-0 text-right text-[#3a4a5a] select-none text-xs leading-7">
                {lineIdx + 1}
              </span>
              <span>
                {tokens.map((token, ti) =>
                  token.text ? (
                    <span key={ti} style={{ color: token.color || "#F8FAFC" }}>
                      {token.text}
                    </span>
                  ) : (
                    <span key={ti}>&nbsp;</span>
                  )
                )}
              </span>
            </motion.div>
          ))}

          {/* Blinking cursor */}
          {isTyping && (
            <div className="flex gap-4">
              <span className="w-5 shrink-0 text-right text-[#3a4a5a] select-none text-xs leading-7">
                {state.visibleLines + 1}
              </span>
              <span className="cursor-blink text-[#FF6B4A] font-bold">▋</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Output Terminal Panel ── */}
      <div className="border-t border-white/[0.06] bg-[#040810]">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.15em] text-white/30 font-medium">
              Terminal
            </span>
            {(state.phase === "running" || state.phase === "output") && (
              <span className="flex items-center gap-1 text-xs text-[#FF6B4A]">
                Running <RunningDots />
              </span>
            )}
            {state.phase === "success" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs text-[#22C55E] font-medium"
              >
                ● Process exited with code 0
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors duration-500",
                state.phase === "success"
                  ? "bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.8)]"
                  : state.phase === "running" || state.phase === "output"
                    ? "bg-[#FF6B4A] shadow-[0_0_6px_rgba(255,107,74,0.8)] animate-pulse"
                    : "bg-white/20"
              )}
            />
          </div>
        </div>

        {/* Output lines */}
        <div className="px-5 py-4 font-mono text-sm min-h-[130px] leading-7">
          <AnimatePresence mode="wait">
            {state.phase === "typing" && state.visibleLines === 0 && (
              <motion.span
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/20 text-xs"
              >
                Waiting for code...
              </motion.span>
            )}
          </AnimatePresence>

          {state.phase !== "typing" &&
            config.outputLines.slice(0, state.visibleOutput).map((line, i) => (
              <motion.div
                key={`output-${i}-${state.language}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "leading-7",
                  line.startsWith("✓")
                    ? "text-[#22C55E] font-semibold"
                    : line === ""
                      ? "opacity-0 select-none"
                      : "text-[#a8d8a8]"
                )}
              >
                {line === "" ? "\u00A0" : line}
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}