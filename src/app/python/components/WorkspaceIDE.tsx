"use client";

import { useState, useEffect, useRef } from "react";
import {
  FileCode,
  FileText,
  Play,
  Bug,
  Plus,
  Trash2,
  Terminal as TermIcon,
  AlertCircle,
  Activity,
  Layers,
  ChevronRight,
  Sparkles,
  Info,
  FolderOpen,
  History,
  HelpCircle,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import {
  defaultKeymap,
  indentWithTab,
  history,
  historyKeymap
} from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import {
  HighlightStyle,
  syntaxHighlighting,
  bracketMatching,
  codeFolding,
  foldGutter,
  foldKeymap,
  indentOnInput
} from "@codemirror/language";
import { search, searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { tags as t } from "@lezer/highlight";
import { PyodideRunner, TraceFrame } from "@/utils/pyodideRunner";
import { JSVisualizer, EventLoopFrame } from "@/utils/jsVisualizer";

// Professional One Dark Pro inspired Syntax Highlighting
const editorSyntaxHighlighting = HighlightStyle.define([
  { tag: t.keyword, color: "#C586C0", fontWeight: "600" }, // keywords (const, let, def, return)
  { tag: t.string, color: "#98C379" }, // strings
  { tag: t.number, color: "#D19A66" }, // numbers
  { tag: t.bool, color: "#D19A66", fontWeight: "600" }, // booleans
  { tag: t.null, color: "#D19A66" }, // null/None
  { tag: t.comment, color: "#676F7D", fontStyle: "italic" }, // comments
  { tag: t.function(t.variableName), color: "#61AFEF" }, // function names
  { tag: t.definition(t.variableName), color: "#E5C07B" }, // declared variable names
  { tag: t.variableName, color: "#E6EDF3" }, // variable uses
  { tag: t.propertyName, color: "#ABB2BF" }, // properties
  { tag: t.operator, color: "#56B6C2" }, // operators
  { tag: t.punctuation, color: "#ABB2BF" }, // brackets, punctuation
  { tag: t.className, color: "#E5C07B" }, // class names
  { tag: t.typeName, color: "#E5C07B" }, // types
  { tag: t.meta, color: "#7C5CFF" }, // metadata / tags
]);

const editorBaseTheme = EditorView.theme({
  "&": {
    color: "#E6EDF3",
    backgroundColor: "#0D111A",
    height: "100%",
  },
  ".cm-content": {
    caretColor: "#FF6B4A",
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    lineHeight: "1.7",
    fontVariantLigatures: "normal",
    fontFeatureSettings: "'liga' on, 'calt' on",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textRendering: "optimizeLegibility",
  },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "2px solid #FF6B4A !important"
  },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
    backgroundColor: "rgba(255, 107, 74, 0.25) !important",
  },
  ".cm-gutters": {
    backgroundColor: "#0D111A",
    color: "#5C6370",
    borderRight: "1px solid #1E293B",
    opacity: 0.85,
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
  },
  ".cm-activeLineGutter": {
    color: "#FF6B4A",
    backgroundColor: "rgba(255, 107, 74, 0.08)",
    fontWeight: "bold"
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(255, 255, 255, 0.02)"
  },
  ".cm-matchingBracket": {
    backgroundColor: "rgba(124, 92, 255, 0.3)",
    borderBottom: "2px solid #7C5CFF",
  },
  ".cm-nonmatchingBracket": {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
    borderBottom: "2px solid #EF4444",
  },
  // Folding markers styling
  ".cm-foldPlaceholder": {
    backgroundColor: "rgba(124, 92, 255, 0.15)",
    border: "1px solid rgba(124, 92, 255, 0.25)",
    color: "#7C5CFF",
    borderRadius: "4px",
    padding: "0 4px",
    margin: "0 2px",
    fontSize: "10px",
  },
  ".cm-foldGutter span": {
    padding: "0 4px",
    cursor: "pointer",
    color: "#5C6370",
    transition: "color 0.15s ease",
  },
  ".cm-foldGutter span:hover": {
    color: "#FF6B4A",
  }
});

interface WorkspaceIDEProps {
  topicId: string;
  templateCode: string;
  examples?: { title: string; description: string; code: string }[];
  onXpGain: (xp: number, coins: number) => void;
  allowLanguageChange?: boolean;
  defaultLanguage?: "python" | "javascript";
}

export default function WorkspaceIDE({
  topicId,
  templateCode,
  examples,
  onXpGain,
  allowLanguageChange = false,
  defaultLanguage = "python"
}: WorkspaceIDEProps) {
  // 1. Files & State Management
  const [files, setFiles] = useState<Record<string, string>>(() => {
    if (topicId === "playground") {
      const res: Record<string, string> = {
        "main.py": `# Write your Python code here\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("NIK's AI"))\n`,
        "main.js": `// Write your JavaScript code here\nfunction greet(name) {\n    return "Hello, " + name + "!";\n}\n\nconsole.log(greet("NIK's AI"));\n`
      };
      return res;
    }
    // Default workspace files
    if (defaultLanguage === "javascript") {
      const res: Record<string, string> = {
        "main.js": templateCode || `// Write your JavaScript code here\n`,
        "utils.js": `// Utility functions\nexports.greet = function(name) {\n    return "Hello, " + name + "!";\n};\n`
      };
      return res;
    }
    const res: Record<string, string> = {
      "main.py": templateCode,
      "utils.py": `def greet(name):\n    return f"Hello, {name}! Welcome to the multi-file workspace."\n`,
    };
    return res;
  });

  const [activeFile, setActiveFile] = useState<string>(() => {
    if (defaultLanguage === "javascript") return "main.js";
    return "main.py";
  });
  const [openTabs, setOpenTabs] = useState<string[]>(() => {
    if (topicId === "playground") return ["main.py", "main.js"];
    if (defaultLanguage === "javascript") return ["main.js", "utils.js"];
    return ["main.py", "utils.py"];
  });
  const [newFileName, setNewFileName] = useState("");
  const [isCreatingFile, setIsCreatingFile] = useState(false);

  // Auto-detect language from active file extension
  const getFileLanguage = (filename: string): "python" | "javascript" => {
    if (filename.endsWith(".js") || filename.endsWith(".ts")) return "javascript";
    return "python";
  };
  const activeLanguage = getFileLanguage(activeFile);

  const handleLoadExample = (code: string) => {
    setFiles((prev) => ({
      ...prev,
      [activeFile]: code
    }));
    if (viewRef.current) {
      viewRef.current.dispatch({
        changes: { from: 0, to: viewRef.current.state.doc.length, insert: code }
      });
    }
  };

  // 2. Output and Visualizer panels
  const [activeTab, setActiveTab] = useState<"terminal" | "problems" | "debugger">("terminal");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Memory debugger variables (Python)
  const [traceFrames, setTraceFrames] = useState<TraceFrame[]>([]);
  const [traceIndex, setTraceIndex] = useState(-1);
  const [isPlayingTrace, setIsPlayingTrace] = useState(false);

  // Event loop variables (JavaScript)
  const [eventLoopFrames, setEventLoopFrames] = useState<EventLoopFrame[]>([]);
  const [loopIndex, setLoopIndex] = useState(-1);
  const [isPlayingLoop, setIsPlayingLoop] = useState(false);

  // CodeMirror refs
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  // Auto-save when files modify
  useEffect(() => {
    localStorage.setItem(`workspace_${topicId}`, JSON.stringify(files));
  }, [files, topicId]);

  // Warm up Pyodide on WorkspaceIDE mount
  useEffect(() => {
    PyodideRunner.warmup();
  }, []);

  // Sync templates on topic change
  useEffect(() => {
    const saved = localStorage.getItem(`workspace_${topicId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFiles(parsed);
        const keys = Object.keys(parsed);
        if (keys.length > 0) {
          const defaultEntry = keys.includes("main.js") && defaultLanguage === "javascript" ? "main.js" : (keys.includes("main.py") ? "main.py" : keys[0]);
          setActiveFile(defaultEntry);
          setOpenTabs(keys.slice(0, 3));
        }
      } catch (e) {}
    } else {
      let initial: Record<string, string> = {};
      let active = "main.py";
      let tabs = ["main.py", "utils.py"];
      
      if (topicId === "playground") {
        initial = {
          "main.py": `# Write your Python code here\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("NIK's AI"))\n`,
          "main.js": `// Write your JavaScript code here\nfunction greet(name) {\n    return "Hello, " + name + "!";\n}\n\nconsole.log(greet("NIK's AI"));\n`
        };
        active = defaultLanguage === "javascript" ? "main.js" : "main.py";
        tabs = ["main.py", "main.js"];
      } else if (defaultLanguage === "javascript") {
        initial = {
          "main.js": templateCode || `// Write JavaScript code here\n`,
          "utils.js": `// Utility functions\nexports.greet = function(name) {\n    return "Hello, " + name + "!";\n};\n`
        };
        active = "main.js";
        tabs = ["main.js", "utils.js"];
      } else {
        initial = {
          "main.py": templateCode,
          "utils.py": `def greet(name):\n    return f"Hello, {name}! Welcome to the multi-file workspace."\n`,
        };
        active = "main.py";
        tabs = ["main.py", "utils.py"];
      }
      setFiles(initial);
      setActiveFile(active);
      setOpenTabs(tabs);
    }
    setTerminalLogs([]);
    setTraceFrames([]);
    setTraceIndex(-1);
    setEventLoopFrames([]);
    setLoopIndex(-1);
  }, [topicId, templateCode, defaultLanguage]);

  // Handle active editor selection updates
  useEffect(() => {
    if (!editorRef.current) return;

    // Destroy existing CodeMirror instance
    if (viewRef.current) {
      viewRef.current.destroy();
    }

    const state = EditorState.create({
      doc: files[activeFile] || "",
      extensions: [
        lineNumbers(),
        foldGutter(),
        bracketMatching(),
        closeBrackets(),
        indentOnInput(),
        highlightSelectionMatches(),
        activeLanguage === "python" ? python() : javascript(),
        autocompletion(),
        editorBaseTheme,
        syntaxHighlighting(editorSyntaxHighlighting),
        search({ top: true }),
        keymap.of([
          ...defaultKeymap,
          ...historyKeymap,
          ...closeBracketsKeymap,
          ...foldKeymap,
          ...searchKeymap,
          indentWithTab
        ]),
        history(),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newContent = update.state.doc.toString();
            setFiles((prev) => ({
              ...prev,
              [activeFile]: newContent
            }));
          }
        })
      ]
    });

    const view = new EditorView({
      state,
      parent: editorRef.current
    });

    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [activeFile, activeLanguage]);

  // 3. Execution action handlers
  const handleRunCode = async () => {
    setIsRunning(true);
    if (activeLanguage === "python") {
      setTerminalLogs(["[System: Launching Pyodide WASM Runtime...]", "[System: Mount Workspace Virtual Directory...]"]);

      const res = await PyodideRunner.runCodeWithFiles(files, activeFile, (stdoutMsg) => {
        setTerminalLogs((prev) => [...prev, stdoutMsg]);
      });

      // Update workspace files in state with anything created/modified during python execution
      if (res.files) {
        setFiles((prev) => ({
          ...prev,
          ...res.files
        }));
      }

      if (res.error) {
        setTerminalLogs((prev) => [...prev, `\nTraceback (most recent call last):\n${res.error}`]);
        setActiveTab("problems");
      } else {
        setTerminalLogs((prev) => [...prev, "\n[Process finished successfully]"]);
        onXpGain(15, 5);
      }
    } else {
      setTerminalLogs(["[System: Running script inside Browser V8 Sandbox...]"]);
      const res = JSVisualizer.runCode(files[activeFile] || "", files);

      if (res.error) {
        setTerminalLogs((prev) => [...prev, `\nTypeError / SyntaxError:\n${res.error}`]);
        setActiveTab("problems");
      } else {
        if (res.output) {
          setTerminalLogs((prev) => [...prev, res.output]);
        }
        setTerminalLogs((prev) => [...prev, "\n[Process finished successfully]"]);
        onXpGain(15, 5);
      }
    }
    setIsRunning(false);
  };

  const handleGenerateTrace = async () => {
    setIsRunning(true);
    setTerminalLogs((prev) => [...prev, "\n[System: Allocating memory registers & trace vectors...]"]);
    const res = await PyodideRunner.traceCode(files[activeFile] || "");

    if (res.error) {
      setTerminalLogs((prev) => [...prev, `\nTracing Error: ${res.error}`]);
      setTraceFrames([]);
      setTraceIndex(-1);
    } else if (res.frames.length > 0) {
      setTraceFrames(res.frames);
      setTraceIndex(0);
      setActiveTab("debugger");
      setTerminalLogs((prev) => [...prev, `\n[Traced ${res.frames.length} execution frames successfully]`]);
    } else {
      setTerminalLogs((prev) => [...prev, `\nNo traceable operations found. Add variables or loops.`]);
    }
    setIsRunning(false);
  };

  // Autoplay Trace Timeline (Python Memory Debugger)
  useEffect(() => {
    let interval: any = null;
    if (isPlayingTrace) {
      interval = setInterval(() => {
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
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingTrace, traceFrames]);

  // JavaScript Event Loop simulation
  const handleGenerateLoopTrace = () => {
    setTerminalLogs((prev) => [...prev, "\n[System: Compiling Event Loop trace sequences...]"]);
    const frames = JSVisualizer.generateEventLoopTrace(files[activeFile] || "");

    if (frames.length > 0) {
      setEventLoopFrames(frames);
      setLoopIndex(0);
      setActiveTab("debugger");
      setTerminalLogs((prev) => [...prev, `\n[Compiled ${frames.length} loop event cycles successfully]`]);
    } else {
      setTerminalLogs((prev) => [...prev, "\nNo traceable event loop operations (setTimeout, Promises) detected."]);
    }
  };

  // Autoplay Event Loop simulation
  useEffect(() => {
    let interval: any = null;
    if (isPlayingLoop) {
      interval = setInterval(() => {
        setLoopIndex((prev) => {
          if (prev < eventLoopFrames.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingLoop(false);
            return prev;
          }
        });
      }, 1800);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlayingLoop, eventLoopFrames]);

  // 4. Workspace CRUD
  const handleCreateFile = () => {
    if (!newFileName.trim()) return;
    const name = newFileName.trim();
    if (files[name] !== undefined) {
      alert("A file with this name already exists.");
      return;
    }
    const isPy = name.endsWith(".py");
    setFiles((prev) => ({
      ...prev,
      [name]: isPy ? "# Python script\n" : "// JavaScript module\n"
    }));
    setActiveFile(name);
    if (!openTabs.includes(name)) {
      setOpenTabs((prev) => [...prev, name]);
    }
    setNewFileName("");
    setIsCreatingFile(false);
  };

  const handleDeleteFile = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isPy = name.endsWith(".py");
    const primaryFile = isPy ? "main.py" : "main.js";
    if (name === "main.py" || name === "main.js") {
      alert(`Cannot delete primary entrypoint file ${name}.`);
      return;
    }
    const filteredFiles = { ...files };
    delete filteredFiles[name];
    setFiles(filteredFiles);

    const filteredTabs = openTabs.filter((t) => t !== name);
    setOpenTabs(filteredTabs);

    if (activeFile === name) {
      setActiveFile(filteredFiles[primaryFile] !== undefined ? primaryFile : Object.keys(filteredFiles)[0]);
    }
  };

  const handleOpenTab = (name: string) => {
    setActiveFile(name);
    if (!openTabs.includes(name)) {
      setOpenTabs((prev) => [...prev, name]);
    }
  };

  const handleCloseTab = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = openTabs.filter((t) => t !== name);
    setOpenTabs(filtered);
    if (activeFile === name && filtered.length > 0) {
      setActiveFile(filtered[filtered.length - 1]);
    }
  };

  const activeFrame = traceFrames[traceIndex];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col lg:flex-row h-[580px] w-full border border-slate-800 rounded-3xl bg-[#090C15] overflow-hidden shadow-2xl">
        {/* File Explorer (Left sidebar of IDE) */}
        <div className="hidden lg:flex w-56 border-r border-slate-800 bg-[#0B0F19] flex-col shrink-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5 text-[#7C5CFF]" />
              WORKSPACE EXPLORER
            </span>
            <button
              onClick={() => setIsCreatingFile(!isCreatingFile)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Create File"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {isCreatingFile && (
            <div className="p-3 border-b border-slate-800 bg-slate-900/50 space-y-2">
              <input
                type="text"
                placeholder={activeLanguage === "python" ? "module.py" : "module.js"}
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full rounded-lg border border-slate-850 bg-slate-950 px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF6B4A]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsCreatingFile(false)}
                  className="px-2 py-1 rounded text-[10px] border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateFile}
                  className="px-2.5 py-1 rounded text-[10px] bg-[#FF6B4A] text-white font-semibold"
                >
                  Create
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-none">
            {Object.keys(files).map((name) => {
              const isPy = name.endsWith(".py");
              const isJs = name.endsWith(".js") || name.endsWith(".ts");
              const isCurrent = activeFile === name;
              return (
                <div
                  key={name}
                  onClick={() => handleOpenTab(name)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all border border-transparent ${
                    isCurrent
                      ? "bg-slate-800/50 border-slate-700 text-[#FF6B4A] font-semibold"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isPy ? (
                      <FileCode className={`h-4 w-4 shrink-0 ${isCurrent ? "text-[#FF6B4A]" : "text-[#7C5CFF]"}`} />
                    ) : isJs ? (
                      <FileCode className={`h-4 w-4 shrink-0 ${isCurrent ? "text-[#FF6B4A]" : "text-amber-500"}`} />
                    ) : (
                      <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                    <span className="truncate">{name}</span>
                  </div>
                  {name !== "main.py" && name !== "main.js" && (
                    <button
                      onClick={(e) => handleDeleteFile(name, e)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary code editing area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor Tabs bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#090C15] shrink-0 h-12 overflow-hidden select-none">
            {/* Tabs Scrollable Area */}
            <div className="flex-1 flex items-center overflow-x-auto scrollbar-none h-full px-2 gap-1">
              {openTabs.map((tab) => {
                const isCurrent = activeFile === tab;
                return (
                  <div
                    key={tab}
                    onClick={() => setActiveFile(tab)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-mono cursor-pointer transition-all h-full shrink-0 ${
                      isCurrent
                        ? "border-[#FF6B4A] text-white bg-[#0D111A]"
                        : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                    }`}
                  >
                    <span>{tab}</span>
                    {tab !== "main.py" && tab !== "main.js" && (
                      <span
                        onClick={(e) => handleCloseTab(tab, e)}
                        className="p-0.5 rounded hover:bg-slate-850 text-[9px] text-slate-500 hover:text-rose-500 transition-colors"
                      >
                        ✕
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Inline Create File form */}
              {isCreatingFile ? (
                <div className="flex items-center gap-1 px-2 shrink-0">
                  <input
                    type="text"
                    placeholder="module.js"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="w-24 rounded border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] text-white focus:outline-none focus:border-[#FF6B4A]"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFile();
                      if (e.key === "Escape") setIsCreatingFile(false);
                    }}
                  />
                  <button
                    onClick={handleCreateFile}
                    className="p-1 rounded bg-[#FF6B4A] text-white hover:opacity-90 transition-opacity"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setIsCreatingFile(false)}
                    className="p-1 rounded bg-slate-850 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreatingFile(true)}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900/50 hover:bg-slate-800/80 text-slate-400 hover:text-white transition-all shrink-0 ml-1"
                  title="Add New File"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sticky Actions bar */}
            <div className="flex items-center gap-2 p-1.5 shrink-0 border-l border-slate-800 bg-[#070914] h-full px-3">
              {allowLanguageChange && (
                <select
                  value={activeLanguage}
                  onChange={(e) => {
                    const lang = e.target.value as "python" | "javascript";
                    const targetFile = lang === "python" ? "main.py" : "main.js";
                    setActiveFile(targetFile);
                    if (!openTabs.includes(targetFile)) {
                      setOpenTabs((prev) => [...prev, targetFile]);
                    }
                  }}
                  className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-1 text-[10px] font-mono text-slate-300 outline-none focus:border-[#FF6B4A]/60 transition-colors"
                >
                  <option value="python">python3 (v3.11)</option>
                  <option value="javascript">javascript (V8)</option>
                </select>
              )}
              {activeLanguage === "python" ? (
                <button
                  onClick={handleGenerateTrace}
                  disabled={isRunning}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-[10px] font-mono hover:bg-slate-800 flex items-center gap-1.5 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm hover:border-[#7C5CFF]/30 disabled:opacity-50"
                >
                  <Bug className="h-3.5 w-3.5 text-[#7C5CFF]" />
                  <span className="hidden sm:inline">Trace Memory</span>
                  <span className="sm:hidden">Trace</span>
                </button>
              ) : (
                <button
                  onClick={handleGenerateLoopTrace}
                  disabled={isRunning}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/60 text-[10px] font-mono hover:bg-slate-800 flex items-center gap-1.5 text-slate-400 hover:text-white transition-all cursor-pointer shadow-sm hover:border-[#7C5CFF]/30 disabled:opacity-50"
                >
                  <Activity className="h-3.5 w-3.5 text-[#7C5CFF]" />
                  <span className="hidden sm:inline">Simulate Event Loop</span>
                  <span className="sm:hidden">Simulate</span>
                </button>
              )}
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] text-[10px] font-mono text-white hover:scale-[1.02] active:scale-95 flex items-center gap-1.5 transition-all font-semibold cursor-pointer shadow-md disabled:opacity-60"
              >
                {isRunning ? (
                  <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                ) : (
                  <Play className="h-3.5 w-3.5 shrink-0" />
                )}
                <span>{isRunning ? "Executing..." : "Run Code"}</span>
              </button>
            </div>
          </div>

          {/* Code Editor body container */}
          <div className="flex-1 min-h-[220px] border-b border-slate-800 bg-[#0D111A] overflow-hidden relative">
            <div ref={editorRef} className="absolute inset-0 overflow-auto" />
          </div>

          {/* Terminal/Console & Trace panels drawer */}
          <div className="h-[200px] flex flex-col bg-[#05070F] shrink-0">
            <div className="flex border-b border-slate-800 bg-[#070914] px-4 shrink-0 select-none">
              {[
                { id: "terminal", label: "Console Terminal", icon: TermIcon },
                { id: "problems", label: "Problems Output", icon: AlertCircle },
                { id: "debugger", label: activeLanguage === "python" ? "Memory Debugger" : "Event Loop Simulator", icon: Activity }
              ].map((p) => {
                const Icon = p.icon;
                const isSelected = activeTab === p.id;
                const frameCount = p.id === "debugger" 
                  ? (activeLanguage === "python" ? traceFrames.length : eventLoopFrames.length) 
                  : 0;

                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveTab(p.id as any)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-mono font-bold uppercase tracking-wider border-b-2 transition-all outline-none ${
                      isSelected
                        ? "border-[#7C5CFF] text-[#9A82FF] bg-[#05070F]"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {p.label}
                    {p.id === "debugger" && frameCount > 0 && (
                      <span className="ml-1 rounded-full bg-[#7C5CFF]/15 px-1.5 py-0.5 text-[8px] font-mono text-[#7C5CFF]">
                        {frameCount} Frames
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-[#E6EDF3] bg-[#05070F]">
              {activeTab === "terminal" && (
                <div className="space-y-1.5">
                  {terminalLogs.map((log, i) => (
                    <div key={i} className="whitespace-pre-wrap text-[#CBD5E1]">
                      {log}
                    </div>
                  ))}
                  {terminalLogs.length === 0 && (
                    <div className="text-slate-500 italic">Terminal ready. Click Run Code to execute your program.</div>
                  )}
                </div>
              )}

              {activeTab === "problems" && (
                <div className="space-y-2 border-none">
                  {terminalLogs.some(log => log.includes("Traceback") || log.includes("Error") || log.includes("SyntaxError")) ? (
                    <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-xs uppercase">Runtime Error Found</h4>
                        <p className="mt-1 text-rose-300/80 leading-relaxed">
                          {terminalLogs.find(log => log.includes("Error") || log.includes("Exception") || log.includes("Traceback")) || "Syntax error detected in compilation stack."}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-emerald-500 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping animate-duration-1000" />
                      No problems or warnings detected. Your code successfully parsed.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "debugger" && (
                <div className="h-full flex flex-col">
                  {activeLanguage === "python" ? (
                    traceFrames.length > 0 ? (
                      <div className="flex-1 flex flex-col gap-3 min-h-0">
                        {/* Controls */}
                        <div className="flex items-center justify-between bg-surface/50 p-2 rounded-2xl border border-border-subtle shrink-0">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setTraceIndex(prev => Math.max(0, prev - 1))}
                              disabled={traceIndex <= 0}
                              className="px-2 py-1 rounded bg-surface border border-border-subtle disabled:opacity-40 hover:bg-surface/80 text-[10px]"
                            >
                              ◀ Step Back
                            </button>
                            <span className="text-[10px] font-mono">
                              Frame <span className="font-bold text-[#FF6B4A]">{traceIndex + 1}</span> of {traceFrames.length} (Line {activeFrame?.line})
                            </span>
                            <button
                              onClick={() => setTraceIndex(prev => Math.min(traceFrames.length - 1, prev + 1))}
                              disabled={traceIndex >= traceFrames.length - 1}
                              className="px-2 py-1 rounded bg-surface border border-border-subtle disabled:opacity-40 hover:bg-surface/80 text-[10px]"
                            >
                              Step Forward ▶
                            </button>
                          </div>

                          <button
                            onClick={() => setIsPlayingTrace(!isPlayingTrace)}
                            className={`px-3 py-1 rounded text-[10px] font-semibold transition-all ${
                              isPlayingTrace ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                            }`}
                          >
                            {isPlayingTrace ? "⏸ Pause Autoplay" : "▶ Autoplay Timeline"}
                          </button>
                        </div>

                        {/* Stack & Heap Visualization grids */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0 overflow-y-auto">
                          {/* Local Registers (Stack frame) */}
                          <div className="border border-border-subtle rounded-2xl p-4 bg-surface/30 flex flex-col h-44 md:h-full">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B4A] flex items-center gap-1 border-b border-border-subtle pb-1.5 mb-3">
                              <Layers className="h-3.5 w-3.5" />
                              Stack Memory (Pointers)
                            </h4>
                            <div className="space-y-2.5 flex-1 overflow-y-auto">
                              {activeFrame && Object.keys(activeFrame.locals).length > 0 ? (
                                Object.entries(activeFrame.locals).map(([key, val]) => (
                                  <div key={key} className="flex items-center gap-3 bg-surface/50 border border-border-subtle/50 p-2.5 rounded-xl shadow-sm">
                                    <div className="bg-[#FF6B4A]/10 border border-[#FF6B4A]/20 px-2 py-1 rounded-lg text-xs font-mono font-bold text-[#FF6B4A]">
                                      {key}
                                    </div>
                                    <div className="text-[10px] text-muted font-mono flex-1 text-center border-b border-dashed border-border-subtle pb-1">
                                      points to →
                                    </div>
                                    <div className="text-[10px] font-mono bg-[#7C5CFF]/10 text-[#7C5CFF] px-2 py-0.5 rounded border border-[#7C5CFF]/20">
                                      0x{val.id.toString(16).toUpperCase()}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-[10px] text-muted/50 italic py-2">No active local variable labels.</div>
                              )}
                            </div>
                          </div>

                          {/* Objects heap (Memory address lookup) */}
                          <div className="border border-border-subtle rounded-2xl p-4 bg-surface/30 flex flex-col h-44 md:h-full">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#7C5CFF] flex items-center gap-1 border-b border-border-subtle pb-1.5 mb-3">
                              <Layers className="h-3.5 w-3.5" />
                              Heap Memory (Objects)
                            </h4>
                            <div className="space-y-2.5 flex-1 overflow-y-auto">
                              {activeFrame && Object.keys(activeFrame.locals).length > 0 ? (
                                // Use unique heap addresses to avoid duplicating objects
                                Array.from(new Map(Object.entries(activeFrame.locals).map(([_, v]) => [v.id, v])).values()).map((val) => (
                                  <div key={val.id} className="bg-surface/50 border border-border-subtle/50 p-2.5 rounded-xl flex items-center justify-between shadow-sm">
                                    <div className="text-[10px] font-mono bg-[#7C5CFF]/10 text-[#7C5CFF] px-2 py-0.5 rounded border border-[#7C5CFF]/20 font-bold">
                                      0x{val.id.toString(16).toUpperCase()}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-mono font-bold bg-[#FF6B4A]/10 text-[#FF6B4A] px-1.5 py-0.5 rounded border border-[#FF6B4A]/25 uppercase">
                                        {val.type}
                                      </span>
                                      <span className="font-mono text-xs font-black text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
                                        {val.value}
                                      </span>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-[10px] text-muted/50 italic py-2">No active heap structures allocated.</div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted/50 italic text-center py-8">
                        Debugger inactive. Click <span className="font-bold text-[#7C5CFF]">Trace Memory</span> in editor to compile scope frame history.
                      </div>
                    )
                  ) : (
                    // JavaScript Event Loop Simulator
                    eventLoopFrames.length > 0 ? (
                      <div className="flex-1 flex flex-col gap-3 min-h-0">
                        {/* Event Loop Controls */}
                        <div className="flex items-center justify-between bg-surface/50 p-2 rounded-2xl border border-border-subtle shrink-0">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setLoopIndex(prev => Math.max(0, prev - 1))}
                              disabled={loopIndex <= 0}
                              className="px-2 py-1 rounded bg-surface border border-border-subtle disabled:opacity-40 hover:bg-surface/80 text-[10px]"
                            >
                              ◀ Step Back
                            </button>
                            <span className="text-[10px] font-mono">
                              Step <span className="font-bold text-[#FF6B4A]">{loopIndex + 1}</span> of {eventLoopFrames.length}
                            </span>
                            <button
                              onClick={() => setLoopIndex(prev => Math.min(eventLoopFrames.length - 1, prev + 1))}
                              disabled={loopIndex >= eventLoopFrames.length - 1}
                              className="px-2 py-1 rounded bg-surface border border-border-subtle disabled:opacity-40 hover:bg-surface/80 text-[10px]"
                            >
                              Step Forward ▶
                            </button>
                          </div>

                          <button
                            onClick={() => setIsPlayingLoop(!isPlayingLoop)}
                            className={`px-3 py-1 rounded text-[10px] font-semibold transition-all ${
                              isPlayingLoop ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" : "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                            }`}
                          >
                            {isPlayingLoop ? "⏸ Pause Autoplay" : "▶ Autoplay Timeline"}
                          </button>
                        </div>

                        {/* Explanation Note */}
                        <div className="rounded-xl bg-surface/50 border border-border-subtle p-3 text-xs text-text/80 leading-relaxed font-mono flex items-start gap-2 shrink-0">
                          <Info className="h-4 w-4 text-[#7C5CFF] shrink-0 mt-0.5" />
                          <span>{eventLoopFrames[loopIndex]?.description}</span>
                        </div>

                        {/* Event loop queue grids */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 min-h-0 overflow-y-auto">
                          {/* Call Stack */}
                          <div className="border border-border-subtle rounded-2xl p-4 bg-surface/30 flex flex-col h-44 md:h-full">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B4A] border-b border-border-subtle pb-1.5 mb-2.5">
                              Call Stack (LIFO)
                            </h5>
                            <div className="flex-1 flex flex-col-reverse gap-1.5 justify-end overflow-y-auto">
                              {eventLoopFrames[loopIndex]?.callStack && eventLoopFrames[loopIndex].callStack.length > 0 ? (
                                eventLoopFrames[loopIndex].callStack.map((fn, idx) => (
                                  <div
                                    key={idx}
                                    className="rounded-lg bg-[#FF6B4A]/10 border border-[#FF6B4A]/30 px-3 py-1.5 text-[10px] font-mono font-bold text-[#FF6B4A] truncate"
                                  >
                                    {fn}
                                  </div>
                                ))
                              ) : (
                                <span className="text-[10px] text-muted/30 italic">Empty</span>
                              )}
                            </div>
                          </div>

                          {/* Web APIs */}
                          <div className="border border-border-subtle rounded-2xl p-4 bg-surface/30 flex flex-col h-44 md:h-full">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border-subtle pb-1.5 mb-2.5">
                              Web APIs (Background)
                            </h5>
                            <div className="flex-1 space-y-1.5 overflow-y-auto">
                              {eventLoopFrames[loopIndex]?.webAPIs && eventLoopFrames[loopIndex].webAPIs.length > 0 ? (
                                eventLoopFrames[loopIndex].webAPIs.map((timer, idx) => (
                                  <div
                                    key={idx}
                                    className="rounded-lg bg-surface border border-border-subtle px-3 py-1.5 text-[10px] font-mono text-muted flex items-center justify-between"
                                  >
                                    <span>{timer}</span>
                                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping animate-duration-1000" />
                                  </div>
                                ))
                              ) : (
                                <span className="text-[10px] text-muted/30 italic">Empty</span>
                              )}
                            </div>
                          </div>

                          {/* Microtasks */}
                          <div className="border border-border-subtle rounded-2xl p-4 bg-surface/30 flex flex-col h-44 md:h-full">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#7C5CFF] border-b border-border-subtle pb-1.5 mb-2.5">
                              Microtasks (Promises)
                            </h5>
                            <div className="flex-1 space-y-1.5 overflow-y-auto">
                              {eventLoopFrames[loopIndex]?.microtasks && eventLoopFrames[loopIndex].microtasks.length > 0 ? (
                                eventLoopFrames[loopIndex].microtasks.map((task, idx) => (
                                  <div
                                    key={idx}
                                    className="rounded-lg bg-[#7C5CFF]/10 border border-[#7C5CFF]/30 px-3 py-1.5 text-[10px] font-mono font-bold text-[#7C5CFF]"
                                  >
                                    {task}
                                  </div>
                                ))
                              ) : (
                                <span className="text-[10px] text-muted/30 italic">Empty</span>
                              )}
                            </div>
                          </div>

                          {/* Macrotasks */}
                          <div className="border border-border-subtle rounded-2xl p-4 bg-surface/30 flex flex-col h-44 md:h-full">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-muted border-b border-border-subtle pb-1.5 mb-2.5">
                              Macrotasks (Timers)
                            </h5>
                            <div className="flex-1 space-y-1.5 overflow-y-auto">
                              {eventLoopFrames[loopIndex]?.macrotasks && eventLoopFrames[loopIndex].macrotasks.length > 0 ? (
                                eventLoopFrames[loopIndex].macrotasks.map((task, idx) => (
                                  <div
                                    key={idx}
                                    className="rounded-lg bg-surface border border-border-subtle px-3 py-1.5 text-[10px] font-mono text-muted"
                                  >
                                    {task}
                                  </div>
                                ))
                              ) : (
                                <span className="text-[10px] text-muted/30 italic">Empty</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-muted/50 italic text-center py-8">
                        Simulator inactive. Click <span className="font-bold text-[#7C5CFF]">Simulate Event Loop</span> in editor to compile scope frame history.
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Examples section under the IDE */}
      {examples && examples.length > 0 && (
        <div className="p-5 border border-border-subtle rounded-3xl bg-surface/20 shadow-sm space-y-4">
          <h4 className="text-xs font-mono font-bold text-text flex items-center gap-1.5 uppercase tracking-wider select-none">
            <BookOpen className="h-4 w-4 text-[#FF6B4A]" />
            Practice Exercises & Examples
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((ex, index) => (
              <div
                key={index}
                onClick={() => handleLoadExample(ex.code)}
                className="p-4 rounded-2xl border border-border-subtle bg-surface/40 hover:bg-[#FF6B4A]/5 hover:border-[#FF6B4A]/30 cursor-pointer transition-all flex flex-col justify-between"
              >
                <div>
                  <h5 className="text-xs font-bold text-text">{ex.title}</h5>
                  <p className="text-[10px] text-muted mt-1 leading-relaxed">{ex.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#FF6B4A]">Click to load into editor</span>
                  <div className="text-[10px] font-semibold text-[#7C5CFF] hover:underline flex items-center gap-1">
                    Load Code →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
