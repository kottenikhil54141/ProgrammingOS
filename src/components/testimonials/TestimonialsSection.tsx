"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import { Star, Quote } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────────────── */
interface Testimonial {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  highlight: string;
  tag: string;
  accentColor: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Aarav Sharma",
    role: "Software Engineer",
    company: "Google",
    avatar: "AS",
    rating: 5,
    text: "ProgrammingOS is the only platform where I actually retained what I learned. The live code execution and visual debugger made complex concepts click instantly. 3 months in, I got my dream offer.",
    highlight: "got my dream offer",
    tag: "Placed at Google",
    accentColor: "#4285F4",
  },
  {
    name: "Priya Nair",
    role: "Backend Engineer",
    company: "Razorpay",
    avatar: "PN",
    rating: 5,
    text: "I'd tried 5 other platforms before this. None of them felt like actual engineering. ProgrammingOS forces you to build real things — my FastAPI project landed me a ₹32 LPA package.",
    highlight: "forces you to build real things",
    tag: "₹32 LPA Package",
    accentColor: "#22C55E",
  },
  {
    name: "Zara Ahmed",
    role: "Full-Stack Developer",
    company: "Remote (US client)",
    avatar: "ZA",
    rating: 5,
    text: "The AI tutor is insane. It doesn't just give you the answer — it asks questions that make you think. It's like pair programming with a very patient senior engineer.",
    highlight: "like pair programming with a senior engineer",
    tag: "$85/hr Freelancer",
    accentColor: "#7C5CFF",
  },
  {
    name: "Kiran Reddy",
    role: "Data Engineer",
    company: "PhonePe",
    avatar: "KR",
    rating: 5,
    text: "The Python track is criminally good. I went from knowing basic loops to deploying async pipelines. The XP system kept me coming back every single day for 4 months straight.",
    highlight: "4 months straight",
    tag: "Data Engineering",
    accentColor: "#FF6B4A",
  },
  {
    name: "Mei Lin",
    role: "Frontend Engineer",
    company: "Atlassian",
    avatar: "ML",
    rating: 5,
    text: "I'm based in Singapore and was skeptical of another bootcamp. This is nothing like that. The projects section alone is worth the subscription — real code, real patterns, real output.",
    highlight: "real code, real patterns",
    tag: "Placed in 3 months",
    accentColor: "#38BDF8",
  },
  {
    name: "Rohan Verma",
    role: "DevOps Engineer",
    company: "Razorpay",
    avatar: "RV",
    rating: 5,
    text: "What got me was the CI/CD project. It wasn't theory — I actually deployed a containerized app to AWS by the end. That project alone changed my resume.",
    highlight: "changed my resume",
    tag: "DevOps Track",
    accentColor: "#14B8A6",
  },
];

/* ─── Avatar ────────────────────────────────────────────────────────── */
const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-orange-500 to-rose-500",
  "from-sky-500 to-blue-700",
  "from-emerald-500 to-green-700",
  "from-pink-500 to-rose-600",
  "from-teal-500 to-cyan-600",
];

/* ─── Card ──────────────────────────────────────────────────────────── */
function TestimonialCard({
  testimonial,
  index,
  row,
}: {
  testimonial: Testimonial;
  index: number;
  row: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.65,
        delay: (index % 3) * 0.1 + row * 0.15,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080c1c] p-6 transition-all duration-500 hover:border-white/15 hover:-translate-y-1"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      {/* Quote icon */}
      <Quote
        className="absolute top-5 right-5 h-8 w-8 opacity-5 transition-opacity duration-300 group-hover:opacity-10"
        style={{ color: testimonial.accentColor }}
      />

      {/* Top: avatar + meta */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br ${AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]} flex items-center justify-center text-xs font-bold text-white`}
        >
          {testimonial.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">{testimonial.name}</div>
          <div className="text-xs text-white/45 truncate">
            {testimonial.role} · {testimonial.company}
          </div>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
          style={{
            background: `${testimonial.accentColor}18`,
            color: testimonial.accentColor,
            border: `1px solid ${testimonial.accentColor}30`,
          }}
        >
          {testimonial.tag}
        </span>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-white/60 leading-relaxed">
        {testimonial.text.split(testimonial.highlight).map((part, i) =>
          i === 0 ? (
            <span key={i}>{part}</span>
          ) : (
            <span key={i}>
              <span className="font-semibold text-white/90">{testimonial.highlight}</span>
              {part}
            </span>
          )
        )}
      </p>

      {/* Bottom glow line */}
      <div
        className="absolute bottom-0 left-0 h-px w-full opacity-0 transition-opacity duration-300 group-hover:opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${testimonial.accentColor}60, transparent)`,
        }}
      />
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: "-80px" });

  const row1 = TESTIMONIALS.slice(0, 3);
  const row2 = TESTIMONIALS.slice(3, 6);

  return (
    <section id="testimonials" ref={sectionRef} className="section-pad relative overflow-hidden">
      {/* BG */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] opacity-[0.06] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124,92,255,0.6) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mb-16 text-center"
        >
          <SectionLabel>Testimonials</SectionLabel>
          <h2 className="text-display mt-4 text-white">
            Real engineers.{" "}
            <span className="gradient-text-secondary">Real results.</span>
          </h2>
          <p className="mt-4 text-subtitle text-white/50 max-w-xl mx-auto">
            Not cherry-picked reviews. These are engineers who grinded the platform
            and landed real jobs.
          </p>
        </motion.div>

        {/* Grid rows */}
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {row1.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} row={0} />
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {row2.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} row={1} />
            ))}
          </div>
        </div>

        {/* Bottom aggregate rating */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-14 flex flex-col items-center gap-2"
        >
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm text-white/50">
            <span className="font-bold text-white">4.9/5</span> from{" "}
            <span className="font-semibold text-white/80">25,000+</span> verified learners
          </p>
        </motion.div>
      </div>
    </section>
  );
}
