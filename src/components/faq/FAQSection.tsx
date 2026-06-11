"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/utils/cn";

/* ─── Data ──────────────────────────────────────────────────────────── */
interface FAQ {
  q: string;
  a: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    category: "Getting Started",
    q: "Do I need any prior programming experience?",
    a: "Zero experience needed. The Python track starts from variables and control flow — we assume nothing. By week 3 you'll be writing functions and solving real problems. We do recommend you can use a computer comfortably.",
  },
  {
    category: "Getting Started",
    q: "How is NIK's AI different from YouTube or Udemy?",
    a: "Video courses give you the illusion of understanding. NIK's AI forces you to write code from the first minute. Every concept is gated behind actually doing it — not watching it. Our AI tutor catches your mistakes in real time, and projects build a portfolio you can show employers.",
  },
  {
    category: "Platform",
    q: "Can I use NIK's AI on mobile?",
    a: "The full platform — including the code editor, AI tutor, and project workspace — is available on tablet. Mobile is fully supported for reading, exercises, and challenge solving. For serious project work we recommend a laptop or desktop.",
  },
  {
    category: "Platform",
    q: "Which languages does NIK's AI support?",
    a: "Currently Python 3.12 and JavaScript ES2025 are fully supported with live in-browser execution. TypeScript, SQL, and Bash are available in read-only mode. C++, Java, and Go tracks are in active development and will launch Q3 2025.",
  },
  {
    category: "Pricing",
    q: "Is there a free plan?",
    a: "Yes. The free plan gives you access to the first module of each track, 30 coding challenges per month, and limited AI tutor queries. Pro unlocks unlimited access, all projects, live code execution, AI tutoring, and certificate generation.",
  },
  {
    category: "Pricing",
    q: "What does Pro cost and can I cancel anytime?",
    a: "Pro is ₹499/month or ₹3,999/year (save 33%). We offer a 7-day free trial on all Pro plans — no credit card required. You can cancel anytime from your dashboard with no hidden fees or lock-in.",
  },
  {
    category: "Career",
    q: "Will this help me get a job?",
    a: "Directly. The project tracks are designed to mirror what engineering teams actually do. Your projects live in a portfolio page linked from your profile. We partner with companies in our hiring network who actively recruit NIK's AI learners — filtering by track completion and XP.",
  },
  {
    category: "Career",
    q: "Do I get a certificate after completion?",
    a: "Yes — a verifiable digital certificate is generated upon completing a track milestone. Each certificate links to a public portfolio showing your actual project code and test results. Employers can verify it in one click.",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(FAQS.map((f) => f.category)))];

/* ─── FAQ Item ──────────────────────────────────────────────────────── */
function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        open
          ? "border-[#7C5CFF]/30 bg-[#7C5CFF]/[0.04]"
          : "border-white/[0.07] bg-[#080c1c] hover:border-white/[0.12]"
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start gap-4 p-5 text-left"
      >
        <div
          className={cn(
            "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
            open ? "bg-[#7C5CFF]/20 text-[#7C5CFF]" : "bg-white/[0.06] text-white/40"
          )}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span key="minus" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Minus className="h-3 w-3" />
              </motion.span>
            ) : (
              <motion.span key="plus" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Plus className="h-3 w-3" />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <span className={cn("text-sm font-semibold leading-relaxed transition-colors duration-200", open ? "text-white" : "text-white/80")}>
          {faq.q}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="px-5 pb-5 pl-[52px]">
              <p className="text-sm text-white/55 leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export default function FAQSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <section id="faq" ref={sectionRef} className="section-pad relative overflow-hidden">
      {/* Separator line top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-12 text-center"
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="text-display mt-4 text-white">
            Questions we get{" "}
            <span className="gradient-text-primary">all the time</span>
          </h2>
          <p className="mt-4 text-subtitle text-white/50">
            If something isn&apos;t answered here, ping us on Discord — we respond
            within 2 hours.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === cat
                  ? "bg-[#7C5CFF] text-white shadow-lg shadow-[#7C5CFF]/25"
                  : "border border-white/[0.07] bg-white/[0.02] text-white/50 hover:text-white/80 hover:border-white/15"
              )}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {filtered.map((faq, i) => (
              <FAQItem key={faq.q} faq={faq} index={i} />
            ))}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-14 text-center rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8"
        >
          <p className="text-sm text-white/40 mb-1">Still have questions?</p>
          <p className="text-base font-semibold text-white mb-4">
            Join our Discord — 12,000+ learners and mentors active daily.
          </p>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-[#5865F2] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#4752C4] hover:scale-105 active:scale-100">
            <span className="text-base">💬</span>
            Join Discord Community
          </button>
        </motion.div>
      </div>
    </section>
  );
}
