"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, ShieldAlert, Code2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function MentorChat() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hello! I am your AI Coding Mentor. Paste your script or ask any syntax/algorithm questions to begin." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(textToSend: string) {
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setInput("");
    setTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setTyping(false);
      let reply = "I've analyzed your question. ";
      
      const query = textToSend.toLowerCase();
      if (query.includes("debug") || query.includes("error")) {
        reply += "Common runtime errors usually originate from index boundaries or type casting discrepancies. Verify that your variables contain valid initialization states before iteration loops.";
      } else if (query.includes("recursion")) {
        reply += "Recursion is a programming technique where a function calls itself. Essential components are: 1) The Base Case (to terminate loop) and 2) The Recursive Step (moving toward the base case).";
      } else {
        reply += "That is a great optimization path. Try focusing on memory locality and big-O efficiency patterns when structuring this layout.";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 1500);
  }

  return (
    <div className="flex flex-col h-[65vh] rounded-3xl border border-border-subtle bg-surface/30 backdrop-blur-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C5CFF]/15 text-[#A78BFF] border border-[#7C5CFF]/20 shadow-inner">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-text leading-none">AI Mentor Chat</h2>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={cn(
              "flex flex-col max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed",
              m.sender === "user"
                ? "ml-auto bg-[#FF6B4A]/10 text-text border border-[#FF6B4A]/20"
                : "bg-surface/20 text-text/80 border border-border-subtle"
            )}
          >
            <span className="text-[9px] font-mono font-bold uppercase text-muted mb-1">
              {m.sender === "user" ? "You" : "AI Mentor"}
            </span>
            <p>{m.text}</p>
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-1 text-muted text-xs py-2">
            <motion.span
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="font-bold"
            >
              Mentor is analyzing...
            </motion.span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Quick helper prompts */}
      <div className="px-6 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => handleSend("Explain recursion basics in programming")}
          className="rounded-lg border border-border-subtle bg-surface/20 hover:bg-border-subtle/50 px-2.5 py-1.5 text-[10px] text-muted whitespace-nowrap outline-none cursor-pointer"
        >
          Explain Recursion
        </button>
        <button
          onClick={() => handleSend("Debug my syntax array loop error")}
          className="rounded-lg border border-border-subtle bg-surface/20 hover:bg-border-subtle/50 px-2.5 py-1.5 text-[10px] text-muted whitespace-nowrap outline-none cursor-pointer"
        >
          Debug Loop Error
        </button>
      </div>

      {/* Inputs */}
      <div className="border-t border-border-subtle px-6 py-4 flex gap-3 bg-surface/10">
        <input
          type="text"
          placeholder="Ask a coding question or paste your code snippet..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          className="flex-1 rounded-xl border border-border-subtle bg-surface/20 px-4 py-3 text-xs text-text placeholder-muted/40 outline-none focus:border-[#7C5CFF]/60 transition-colors"
        />
        <button
          onClick={() => handleSend(input)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-[#FF6B4A] to-[#7C5CFF] text-slate-950 shadow-md hover:scale-105 transition-all outline-none border-0 cursor-pointer"
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}
