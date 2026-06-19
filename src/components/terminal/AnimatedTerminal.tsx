"use client";

import { useEffect, useReducer, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

/* ─── Language Configurations ─────────────────────────────────────── */
type Language = "python" | "javascript" | "c" | "cpp" | "java";

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
    badge: "",
    badgeColor: "text-[#22C55E]",
    lines: [
      [{ text: "# NIK's AI — Become an Engineer", color: "#6B7280" }],
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
        { text: 'f"Hello, {name}! "', color: "#FF9966" },
      ],
      [],
      [
        { text: "students", color: "#F8FAFC" },
        { text: " = ", color: "#7C5CFF" },
        { text: '["Nik", "Nikhil"]', color: "#FF9966" },
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
      "Hello, Nik! ",
      "Hello, Nikhil",
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
      [{ text: "// NIK's AI — Modern JS", color: "#6B7280" }],
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
        { text: "}! `", color: "#FF9966" },
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
      "Hello, Nik! ",
      "Hello, Nikhil!",
      "",
      "✓ Execution successful  [0.008s]",
    ],
  },
  c: {
    label: "C",
    filename: "main.c",
    badge: "C",
    badgeColor: "text-blue-400",
    lines: [
      [{ text: "/* NIK's AI — Classic C */", color: "#6B7280" }],
      [],
      [
        { text: "#include ", color: "#7C5CFF" },
        { text: "<stdio.h>", color: "#FF9966" },
      ],
      [],
      [
        { text: "int ", color: "#7C5CFF" },
        { text: "main", color: "#22C55E" },
        { text: "() {", color: "#F8FAFC" },
      ],
      [
        { text: "    printf", color: "#22C55E" },
        { text: "(", color: "#F8FAFC" },
        { text: '"Hello, NIK\'s AI!\\n"', color: "#FF9966" },
        { text: ");", color: "#F8FAFC" },
      ],
      [
        { text: "    return ", color: "#7C5CFF" },
        { text: "0;", color: "#FF6B4A" },
      ],
      [{ text: "}", color: "#F8FAFC" }],
    ],
    outputLines: [
      "Hello, NIK's AI!",
      "",
      "✓ Execution successful  [0.005s]",
    ],
  },
  cpp: {
    label: "C++",
    filename: "main.cpp",
    badge: "C++",
    badgeColor: "text-blue-500",
    lines: [
      [{ text: "// NIK's AI — Modern C++", color: "#6B7280" }],
      [],
      [
        { text: "#include ", color: "#7C5CFF" },
        { text: "<iostream>", color: "#FF9966" },
      ],
      [],
      [
        { text: "int ", color: "#7C5CFF" },
        { text: "main", color: "#22C55E" },
        { text: "() {", color: "#F8FAFC" },
      ],
      [
        { text: "    std::cout << ", color: "#F8FAFC" },
        { text: '"Hello, World!"', color: "#FF9966" },
        { text: " << std::endl;", color: "#F8FAFC" },
      ],
      [
        { text: "    return ", color: "#7C5CFF" },
        { text: "0;", color: "#FF6B4A" },
      ],
      [{ text: "}", color: "#F8FAFC" }],
    ],
    outputLines: [
      "Hello, World!",
      "",
      "✓ Execution successful  [0.007s]",
    ],
  },
  java: {
    label: "Java",
    filename: "Main.java",
    badge: "☕",
    badgeColor: "text-red-400",
    lines: [
      [{ text: "// NIK's AI — Enterprise Java", color: "#6B7280" }],
      [],
      [
        { text: "public class ", color: "#7C5CFF" },
        { text: "Main ", color: "#22C55E" },
        { text: "{", color: "#F8FAFC" },
      ],
      [
        { text: "    public static void ", color: "#7C5CFF" },
        { text: "main", color: "#22C55E" },
        { text: "(String[] args) {", color: "#F8FAFC" },
      ],
      [
        { text: "        System.out.println", color: "#22C55E" },
        { text: "(", color: "#F8FAFC" },
        { text: '"Hello, World!"', color: "#FF9966" },
        { text: ");", color: "#F8FAFC" },
      ],
      [
        { text: "    }", color: "#F8FAFC" },
      ],
      [{ text: "}", color: "#F8FAFC" }],
    ],
    outputLines: [
      "Hello, World!",
      "",
      "✓ Execution successful  [0.035s]",
    ],
  },
};

/* ─── Helpers ─────────────────────────────────────────────────────── */

/** Flatten all tokens of a line into a single array of {char, color} */
interface CharToken {
  char: string;
  color: string;
}

function flattenLine(tokens: CodeToken[]): CharToken[] {
  return tokens.flatMap((t) =>
    t.text.split("").map((char) => ({ char, color: t.color || "#F8FAFC" }))
  );
}

/** Typing speed in ms per character */
const CHAR_DELAY = 20; // fast but readable
const BLANK_LINE_DELAY = 150;
const POST_LINE_PAUSE = 80; // brief pause at end of each line
const PRE_RUN_PAUSE = 500;
const OUTPUT_LINE_DELAY = 290;
const SUCCESS_HOLD = 3500;

/* ─── State Machine ───────────────────────────────────────────────── */
type Phase = "typing" | "running" | "output" | "success" | "resetting";

interface TerminalState {
  phase: Phase;
  /** Current line index being typed */
  currentLine: number;
  /** How many chars of the current line have been revealed */
  currentChar: number;
  /** Lines fully typed (array of char arrays) */
  completedLines: CharToken[][];
  /** How many output lines shown */
  visibleOutput: number;
  language: Language;
}

type TerminalAction =
  | { type: "TYPE_CHAR" }
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
  const config = LANGUAGES[state.language];

  switch (action.type) {
    case "TYPE_CHAR":
      return { ...state, currentChar: state.currentChar + 1 };

    case "NEXT_LINE": {
      const line = config.lines[state.currentLine];
      const chars = flattenLine(line);
      return {
        ...state,
        completedLines: [...state.completedLines, chars],
        currentLine: state.currentLine + 1,
        currentChar: 0,
      };
    }

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
        currentLine: 0,
        currentChar: 0,
        completedLines: [],
        visibleOutput: 0,
      };

    case "SET_LANGUAGE":
      return {
        ...state,
        language: action.language,
        phase: "typing",
        currentLine: 0,
        currentChar: 0,
        completedLines: [],
        visibleOutput: 0,
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
    currentLine: 0,
    currentChar: 0,
    completedLines: [],
    visibleOutput: 0,
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

    const { phase, currentLine, currentChar, visibleOutput } = state;
    const totalLines = config.lines.length;
    const totalOutput = config.outputLines.length;

    /* ── TYPING PHASE ── */
    if (phase === "typing") {
      if (currentLine >= totalLines) {
        // All lines done → pause then run
        timerRef.current = setTimeout(
          () => dispatch({ type: "START_RUNNING" }),
          PRE_RUN_PAUSE
        );
        return clearTimer;
      }

      const line = config.lines[currentLine];
      const isBlank = line.length === 0;

      if (isBlank) {
        // Blank line — commit immediately with a tiny delay
        timerRef.current = setTimeout(() => {
          dispatch({ type: "NEXT_LINE" });
        }, BLANK_LINE_DELAY);
        return clearTimer;
      }

      const totalChars = flattenLine(line).length;

      if (currentChar < totalChars) {
        // Type next character
        timerRef.current = setTimeout(
          () => dispatch({ type: "TYPE_CHAR" }),
          CHAR_DELAY
        );
      } else {
        // Line fully typed — brief pause before moving to next line
        timerRef.current = setTimeout(() => {
          dispatch({ type: "NEXT_LINE" });
        }, POST_LINE_PAUSE);
      }
    }

    /* ── RUNNING PHASE ── */
    if (phase === "running") {
      timerRef.current = setTimeout(
        () => dispatch({ type: "NEXT_OUTPUT" }),
        900
      );
    }

    /* ── OUTPUT PHASE ── */
    if (phase === "output") {
      if (visibleOutput < totalOutput) {
        timerRef.current = setTimeout(
          () => dispatch({ type: "NEXT_OUTPUT" }),
          OUTPUT_LINE_DELAY
        );
      } else {
        timerRef.current = setTimeout(
          () => dispatch({ type: "FINISH" }),
          300
        );
      }
    }

    /* ── SUCCESS PHASE ── */
    if (phase === "success") {
      timerRef.current = setTimeout(
        () => dispatch({ type: "RESET" }),
        SUCCESS_HOLD
      );
    }

    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.currentLine, state.currentChar, state.visibleOutput, state.language]);

  /* ── Derive current in-progress line chars ── */
  const config2 = LANGUAGES[state.language];
  const isTypingLine =
    state.phase === "typing" &&
    state.currentLine < config2.lines.length &&
    config2.lines[state.currentLine].length > 0;

  const inProgressChars: CharToken[] = isTypingLine
    ? flattenLine(config2.lines[state.currentLine]).slice(0, state.currentChar)
    : [];

  const showCursor =
    state.phase === "typing" && state.currentLine < config2.lines.length;

  return (
    <div className="liquid-glass rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
      {/* ── Chrome Bar ── */}
      <div className="flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 border-b border-white/[0.07] bg-white/[0.02] gap-2">
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

        {/* Language switcher — scrollable on mobile */}
        <div className="flex items-center gap-0.5 sm:gap-1 rounded-xl bg-black/30 p-1 overflow-x-auto max-w-[140px] sm:max-w-none no-scrollbar">
          {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => dispatch({ type: "SET_LANGUAGE", language: lang })}
              className={cn(
                "rounded-lg px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-medium transition-all duration-200 shrink-0",
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
      <div className="p-4 sm:p-5 min-h-[200px] sm:min-h-[240px] bg-[#060d1a]">
        <div className="font-mono text-xs sm:text-sm leading-6 sm:leading-7 space-y-0">
          {/* Fully typed lines */}
          {state.completedLines.map((chars, lineIdx) => (
            <motion.div
              key={`${state.language}-done-${lineIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.1 }}
              className="flex gap-4"
            >
              <span className="w-5 shrink-0 text-right text-[#3a4a5a] select-none text-xs leading-7">
                {lineIdx + 1}
              </span>
              <span>
                {chars.map((c, ci) => (
                  <span key={ci} style={{ color: c.color }}>
                    {c.char === " " ? "\u00A0" : c.char}
                  </span>
                ))}
              </span>
            </motion.div>
          ))}

          {/* Currently-typing line */}
          {isTypingLine && (
            <div className="flex gap-4">
              <span className="w-5 shrink-0 text-right text-[#3a4a5a] select-none text-xs leading-7">
                {state.currentLine + 1}
              </span>
              <span>
                {inProgressChars.map((c, ci) => (
                  <span key={ci} style={{ color: c.color }}>
                    {c.char === " " ? "\u00A0" : c.char}
                  </span>
                ))}
                {/* Blinking cursor */}
                <span className="cursor-blink text-[#FF6B4A] font-bold">▋</span>
              </span>
            </div>
          )}

          {/* Cursor on blank line (between typed lines) */}
          {showCursor && !isTypingLine && state.currentLine < config2.lines.length && (
            <div className="flex gap-4">
              <span className="w-5 shrink-0 text-right text-[#3a4a5a] select-none text-xs leading-7">
                {state.currentLine + 1}
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
            {state.phase === "typing" && state.currentLine === 0 && (
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