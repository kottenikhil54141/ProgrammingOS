"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";

const PARTNER_COMPANIES = [
  {
    name: "Google",
    logo: (
      <svg className="h-6 opacity-45 group-hover:opacity-100 transition-opacity duration-300 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.665 0-8.472-3.807-8.472-8.471S7.575 1.571 12.24 1.571c2.24 0 4.22 1.05 5.5 2.743l3.243-3.243C18.665.84 15.657 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.887 0 11.76-4.79 11.76-11.897 0-.74-.067-1.464-.19-2.3H12.24z"/>
      </svg>
    ),
  },
  {
    name: "Meta",
    logo: (
      <svg className="h-6 opacity-45 group-hover:opacity-100 transition-opacity duration-300 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 2.457c-1.396 0-2.684.58-3.662 1.636l-.916.994-.917-.994c-.978-1.056-2.266-1.636-3.662-1.636-2.84 0-5.15 2.308-5.15 5.148 0 2.158 1.47 4.965 4.368 8.344 1.66 1.936 3.518 3.513 4.542 4.368a1.233 1.233 0 001.638 0c1.024-.855 2.882-2.432 4.542-4.368 2.898-3.379 4.368-6.186 4.368-8.344 0-2.84-2.31-5.148-5.15-5.148zM12 18.232C10.22 16.71 6.84 13.565 6.84 10.36c0-1.846 1.498-3.344 3.345-3.344.975 0 1.884.425 2.502 1.17l.953 1.05.953-1.05c.618-.745 1.527-1.17 2.502-1.17 1.847 0 3.345 1.498 3.345 3.344 0 3.205-3.38 6.35-5.16 7.872z"/>
      </svg>
    ),
  },
  {
    name: "Microsoft",
    logo: (
      <svg className="h-6 opacity-45 group-hover:opacity-100 transition-opacity duration-300 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 0h11.232v11.232H0V0zm12.768 0H24v11.232H12.768V0zM0 12.768h11.232V24H0V12.768zm12.768 0H24V24H12.768V12.768z"/>
      </svg>
    ),
  },
  {
    name: "Amazon",
    logo: (
      <svg className="h-6 opacity-45 group-hover:opacity-100 transition-opacity duration-300 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.42 12.74c-.45-.4-.76-.94-.76-1.57v-.04c0-1.22 1.05-1.92 2.76-2.12l1.9-.23c0-.68-.13-1.28-.52-1.63-.44-.39-1.11-.47-1.74-.47-.96 0-1.92.29-2.58.73-.24.16-.48.1-.63-.12l-.95-1.39c-.14-.2-.11-.47.12-.66C14.07 4.54 15.91 4 17.89 4c1.55 0 2.87.35 3.73 1.05.9.72 1.34 1.89 1.34 3.51v5.18c0 1.25.43 1.76.79 2.15.18.2.14.5-.09.64l-2.09 1.26c-.23.14-.52.09-.67-.14a3.87 3.87 0 01-.48-.95 4.96 4.96 0 01-3.64 1.35c-1.76 0-3.96-.94-3.96-3.3 0-1.25.75-2.06 1.89-2.5zm4.4-1.31v-.64l-1.42.17c-.77.09-1.25.33-1.25.86 0 .5.47.88 1.15.88.75.01 1.52-.42 1.52-1.27zm-5.74 8.79C9.57 22.84 5.21 24 1 24c-.41 0-.63-.38-.28-.68 3.56-3.07 8.93-4.57 13.93-3.64.44.08.58.62.17.86a2.82 2.82 0 01-.74.38zm7.57-2.6c-.34.33-.87.19-.87-.28v-1.64c0-.4.36-.71.74-.63a25.26 25.26 0 003.56.33c.38.01.55.44.25.68l-2.73 2.14a2.9 2.9 0 01-.95.4z"/>
      </svg>
    ),
  },
  {
    name: "Netflix",
    logo: (
      <svg className="h-6 opacity-45 group-hover:opacity-100 transition-opacity duration-300 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.188 0H1.938v24h3.25V7.477L18.812 24h3.25V0h-3.25v16.523z"/>
      </svg>
    ),
  },
  {
    name: "Vercel",
    logo: (
      <svg className="h-5 opacity-45 group-hover:opacity-100 transition-opacity duration-300 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 22.525H0L12 1.475l12 21.05z"/>
      </svg>
    ),
  },
];

export default function TrustedBySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-12 relative overflow-hidden border-t border-b border-border-subtle bg-surface/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:justify-between">
          {/* Label / Context */}
          <div className="shrink-0 text-center lg:text-left">
            <span className="text-xs font-mono uppercase tracking-widest text-muted">
              Our Alumni Work At
            </span>
            <h3 className="text-sm font-semibold text-text/60 mt-1">
              Top engineering teams globally
            </h3>
          </div>

          {/* Logos grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-3 gap-4 sm:grid-cols-6 sm:gap-6 lg:gap-10 items-center justify-items-center w-full max-w-3xl"
          >
            {PARTNER_COMPANIES.map((company) => (
              <motion.div
                key={company.name}
                variants={itemVariants}
                className="group relative flex items-center justify-center p-3 sm:p-4 rounded-xl border border-border-subtle bg-surface/40 hover:border-border-medium hover:bg-surface/80 transition-all duration-300 shadow-sm w-full max-w-[100px] sm:max-w-[120px] aspect-[2/1]"
                title={company.name}
              >
                <div className="text-text/60 flex items-center justify-center">
                  {company.logo}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
