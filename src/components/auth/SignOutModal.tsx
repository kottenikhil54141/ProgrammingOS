"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function SignOutModal({ isOpen, onClose, onConfirm }: SignOutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border-medium bg-surface/95 backdrop-blur-3xl p-6 shadow-2xl z-10 text-text"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-border-subtle bg-input-bg hover:bg-border-subtle/50 text-muted hover:text-text transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon & Heading */}
            <div className="flex flex-col items-center text-center mt-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 mb-4">
                <LogOut className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black tracking-tight">Confirm Sign Out</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed max-w-xs">
                Are you sure you want to end your active session and sign out of NIK&apos;s AI? Your study progress is safely saved.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-border-subtle bg-input-bg px-4 py-3 text-xs font-bold text-muted hover:text-text hover:bg-border-subtle/50 transition-all outline-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all outline-none"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
