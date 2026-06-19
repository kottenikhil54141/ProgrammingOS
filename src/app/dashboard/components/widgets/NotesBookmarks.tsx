"use client";

import { useState, useEffect } from "react";
import { Pin, Plus, Bookmark, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  pinned: boolean;
}

export default function NotesBookmarks() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("programmingos_pinned_notes");
      if (saved) {
        setNotes(JSON.parse(saved));
      }
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem("programmingos_pinned_notes", JSON.stringify(updated));
  };

  function addNote() {
    if (!newTitle.trim()) return;
    const item: Note = {
      id: Math.random().toString(),
      title: newTitle,
      pinned: false,
    };
    saveNotes([item, ...notes]);
    setNewTitle("");
  }

  function togglePin(id: string) {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    saveNotes(updated);
  }

  return (
    <div className="rounded-3xl border border-border-subtle bg-surface/90 p-6 backdrop-blur-2xl shadow-card flex flex-col justify-between h-full min-h-[260px]">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[#FF6B4A]" />
          <h2 className="text-sm font-bold text-text tracking-tight">Notes & Pinned Concepts</h2>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="New note title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
            className="flex-1 rounded-xl border border-border-subtle bg-surface/40 px-3 py-2 text-xs text-text placeholder-muted/40 outline-none focus:border-[#7C5CFF]/60 transition-all font-sans"
          />
          <button
            onClick={addNote}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] text-white shadow-md hover:scale-105 transition-transform outline-none"
            aria-label="Add note"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="space-y-2.5 max-h-[140px] overflow-y-auto no-scrollbar">
          <AnimatePresence initial={false}>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between rounded-xl border border-border-subtle bg-surface/30 hover:bg-surface/50 p-2.5 transition-all"
              >
                <span className="text-xs text-text/80 truncate pr-2 font-sans">{note.title}</span>
                <button
                  onClick={() => togglePin(note.id)}
                  className="p-1 rounded hover:bg-surface/80 transition-colors outline-none"
                  aria-label={note.pinned ? "Unpin note" : "Pin note"}
                >
                  <Pin
                    className={`h-3 w-3 ${note.pinned ? "text-[#7C5CFF] fill-[#7C5CFF]/20" : "text-muted/30"}`}
                  />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {notes.length === 0 && (
            <p className="text-[10px] text-muted text-center py-4">No pinned notes yet. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
}
