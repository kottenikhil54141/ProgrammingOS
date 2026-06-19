"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/utils/cn";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={scrollToTop}
          type="button"
          aria-label="Scroll to top"
          className={cn(
            "fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-surface/75 shadow-elevated backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 text-text hover:text-[#FF6B4A] hover:border-[#FF6B4A]/40"
          )}
        >
          <ArrowUp className="h-5 w-5 animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
