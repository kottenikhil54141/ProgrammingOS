"use client";

import { useState } from "react";
import { 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Terminal, 
  Check, 
  Copy,
  ShieldCheck,
  Star,
  Flame,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Custom SVG Brand Icons
const Github = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface PortfolioClientProps {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
    xp: number;
    level: number;
    streak: number;
    track: "python" | "javascript" | "both" | null;
    portfolio?: any;
  };
}

export default function PortfolioClient({ user }: PortfolioClientProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Set up defaults or user-customized portfolio info
  const portfolioData = user.portfolio || {};

  const personal = {
    name: user.name,
    title: portfolioData.title || (user.track === "python" ? "Python Core Developer" : user.track === "javascript" ? "JavaScript Engineer" : "Full-Stack Software Engineer"),
    location: portfolioData.location || "Remote / Bengaluru, India",
    email: portfolioData.email || user.email,
    phone: portfolioData.phone || "+91 98765 43210",
    github: portfolioData.github || `github.com/${user.username}`,
    linkedin: portfolioData.linkedin || `linkedin.com/in/${user.username}`,
    summary: portfolioData.summary || `${user.name} is an active software developer tracking specialized compiler systems and full-stack architecture modules at NIK's AI.`
  };

  const skills = {
    languages: portfolioData.skills?.languages || (user.track === "python" ? ["Python", "SQL", "HTML/CSS"] : user.track === "javascript" ? ["JavaScript", "TypeScript", "HTML/CSS"] : ["Python", "JavaScript", "TypeScript", "SQL", "HTML/CSS"]),
    frameworks: portfolioData.skills?.frameworks || (user.track === "python" ? ["FastAPI", "Django", "asyncio"] : ["React", "Next.js", "Express.js"]),
    tools: portfolioData.skills?.tools || ["Git", "Docker", "Linux", "VS Code"]
  };

  const experiences = portfolioData.experiences || [
    {
      company: "NIK's AI Academy",
      role: "Software Developer Scholar",
      period: "2026 - Present",
      description: `Practicing advanced dynamic coding curricula. Built sandbox engines and compiled ${user.track || "core stack"} modules successfully.`
    }
  ];

  const projects = portfolioData.projects || [
    {
      name: `${user.track === "javascript" ? "Custom Virtual DOM" : "FastAPI Sandbox Executor"}`,
      tech: user.track === "javascript" ? "Next.js, TypeScript, Canvas API" : "FastAPI, Docker, Pyodide",
      description: "Engineered inside ProgrammingOS sandbox. Built code testing suites and automated assertion test runners.",
      url: `https://github.com/${user.username}/project`,
      stars: "45"
    }
  ];

  const education = portfolioData.education || [
    {
      school: "Developer Self-Taught track",
      degree: "Computer Science Specialization",
      dates: "2024 - 2026"
    }
  ];

  // Dynamic Verified Badges based on progress & stats
  const certificates = [];
  if (user.xp >= 100 || user.level >= 1) {
    certificates.push({
      title: "Core Automation Apprentice",
      issuer: "NIK's AI Academy",
      date: "2026",
      hash: `CERT-APP-${user.id.substring(4, 9).toUpperCase()}`
    });
  }
  if (user.xp >= 500 || user.level >= 3) {
    certificates.push({
      title: "Python Core Automation Master",
      issuer: "NIK's AI Academy",
      date: "2026",
      hash: `CERT-PY-${user.id.substring(4, 9).toUpperCase()}`
    });
  }
  if (user.xp >= 1000 || user.level >= 5) {
    certificates.push({
      title: "Advanced Async JavaScript Engine",
      issuer: "NIK's AI Academy",
      date: "2026",
      hash: `CERT-JS-${user.id.substring(4, 9).toUpperCase()}`
    });
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 selection:bg-[#7C5CFF]/30 selection:text-[#A78BFF] relative overflow-hidden font-sans pb-16">
      {/* Decorative gradient glow backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#7C5CFF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-[#2563EB]/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Floating Header Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0A0D14]/75 border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-[#7C5CFF] flex items-center justify-center font-bold text-white shadow-md shadow-[#7C5CFF]/30 group-hover:scale-105 transition-all">
              N
            </div>
            <span className="font-black text-sm tracking-tight text-white group-hover:text-[#A78BFF] transition-colors">
              NIK's AI
            </span>
          </Link>
          
          <Link 
            href="/dashboard" 
            className="text-xs font-semibold text-[#A78BFF] hover:text-white bg-[#7C5CFF]/10 border border-[#7C5CFF]/20 px-4 py-2 rounded-xl transition-all"
          >
            Return to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-12 grid lg:grid-cols-12 gap-8 relative z-10">
        
        {/* LEFT PANEL: Profile, Live Stats, Contact, Badges */}
        <section className="lg:col-span-4 space-y-6">
          {/* Main profile card */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl relative overflow-hidden">
            {/* Interactive indicator */}
            <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>

            {/* Avatar / Profile Initials */}
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#7C5CFF] to-[#2563EB] flex items-center justify-center font-black text-2xl text-white shadow-lg shadow-[#7C5CFF]/20">
                {personal.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
              <h1 className="text-xl font-extrabold text-white mt-4 tracking-tight">{personal.name}</h1>
              <p className="text-xs text-[#A78BFF] font-semibold mt-1 uppercase tracking-wider">{personal.title}</p>
              
              <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-2 font-mono bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                <MapPin className="h-3 w-3 text-red-400 shrink-0" />
                <span>{personal.location}</span>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 space-y-3">
              {[
                { icon: Mail, value: personal.email, label: "Email", color: "text-blue-400" },
                { icon: Phone, value: personal.phone, label: "Phone", color: "text-emerald-400" },
                { icon: Github, value: personal.github, label: "GitHub", color: "text-purple-400" },
                { icon: Linkedin, value: personal.linkedin, label: "LinkedIn", color: "text-sky-400" }
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <div 
                    key={c.label} 
                    onClick={() => copyToClipboard(c.value, c.label)}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-[#7C5CFF]/40 hover:bg-slate-900/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`p-1.5 rounded-lg bg-slate-800/50 ${c.color} shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 truncate">{c.value}</span>
                    </div>
                    <div className="text-slate-500 hover:text-white shrink-0">
                      {copiedText === c.label ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 group-hover:text-slate-350 transition-colors" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Copy Notification Toast */}
            <AnimatePresence>
              {copiedText && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 text-center font-semibold font-mono"
                >
                  ✓ Copied {copiedText} value to clipboard!
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gamification Stats Card */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Live Sandbox Metrics</h3>
            <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-2.5">
                <span className="text-[10px] text-slate-400 block mb-1">Level</span>
                <span className="text-base font-black text-amber-400 flex items-center justify-center gap-0.5">
                  <Zap className="h-3.5 w-3.5 fill-amber-400/20" />
                  {user.level}
                </span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-2.5">
                <span className="text-[10px] text-slate-400 block mb-1">Total XP</span>
                <span className="text-base font-black text-[#7C5CFF]">{user.xp}</span>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-2.5">
                <span className="text-[10px] text-slate-400 block mb-1">Streak</span>
                <span className="text-base font-black text-orange-400 flex items-center justify-center gap-0.5">
                  <Flame className="h-3.5 w-3.5 fill-orange-400/20" />
                  {user.streak}
                </span>
              </div>
            </div>
          </div>

          {/* Academic Certifications */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Verified Badges</h3>
            </div>

            <div className="space-y-3">
              {certificates.length > 0 ? (
                certificates.map((cert) => (
                  <div 
                    key={cert.hash}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 relative overflow-hidden hover:border-amber-500/30 transition-all group"
                  >
                    <ShieldCheck className="absolute -right-3 -bottom-3 h-14 w-14 text-white/[0.01] group-hover:text-amber-500/[0.02] transition-colors" />
                    <p className="text-xs font-bold text-white group-hover:text-[#A78BFF] transition-colors leading-snug">{cert.title}</p>
                    <p className="text-[9px] text-slate-400 mt-1 font-mono">{cert.issuer} • {cert.date}</p>
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[8px] font-mono text-[#7C5CFF]">
                      <span>{cert.hash}</span>
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 border border-dashed border-slate-800 rounded-2xl text-[10px] text-slate-500 font-mono">
                  No verified certificates yet. Keep coding to unlock!
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT PANEL: Tech Capabilities, Experience, Projects */}
        <section className="lg:col-span-8 space-y-6">
          {/* Summary Section */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Professional Bio</h3>
            <p className="text-xs text-slate-350 leading-relaxed font-sans">{personal.summary}</p>
          </div>

          {/* Tech stack categorizations */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Skills & Core Technologies</h3>
            
            <div className="space-y-3">
              {[
                { category: "Languages", list: skills.languages, color: "from-[#7C5CFF]/20 to-[#7C5CFF]/5 border-[#7C5CFF]/35" },
                { category: "Frameworks & Libraries", list: skills.frameworks, color: "from-[#2563EB]/20 to-[#2563EB]/5 border-[#2563EB]/35" },
                { category: "Tools & Infrastructure", list: skills.tools, color: "from-[#059669]/20 to-[#059669]/5 border-[#059669]/35" }
              ].map((s) => (
                <div key={s.category} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 font-mono">{s.category}</span>
                  <div className="flex flex-wrap gap-2">
                    {s.list.map((item: string) => (
                      <span 
                        key={item}
                        className={`px-3 py-1 rounded-xl bg-gradient-to-r ${s.color} border text-[10px] font-semibold text-white shadow-sm`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects showcase */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Software Projects</h3>
              <span className="text-[10px] text-[#A78BFF] font-mono font-semibold">Active Repository Builds</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {projects.length > 0 ? (
                projects.map((proj: any) => (
                  <div 
                    key={proj.name}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between hover:border-[#7C5CFF]/45 transition-colors hover:bg-slate-900/80 group"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-1.5">
                          <Terminal className="h-4 w-4 text-[#7C5CFF]" />
                          <h4 className="text-xs font-bold text-white group-hover:text-[#A78BFF] transition-colors">{proj.name}</h4>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] text-amber-400 font-mono">
                          <Star className="h-3 w-3 fill-amber-400" />
                          <span>{proj.stars || "15"}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed min-h-[50px]">{proj.description}</p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800/40 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-500 truncate max-w-[150px]">{proj.tech}</span>
                      {proj.url && (
                        <a 
                          href={proj.url} 
                          target="_blank" 
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[9px] text-[#7C5CFF] hover:underline"
                        >
                          <span>Code</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-8 border border-dashed border-slate-800 rounded-3xl text-xs text-slate-500 font-mono">
                  No highlighted software projects yet. Add them in the Resume Builder!
                </div>
              )}
            </div>
          </div>

          {/* Work experience timeline */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Professional Timeline</h3>
            
            <div className="space-y-4">
              {experiences.length > 0 ? (
                experiences.map((exp: any, idx: number) => (
                  <div key={exp.company + idx} className="flex gap-4 relative">
                    {/* Timeline vertical bar */}
                    {idx !== experiences.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-800" />
                    )}
                    
                    <div className="w-8 h-8 rounded-full bg-[#7C5CFF]/15 border border-[#7C5CFF]/20 flex items-center justify-center shrink-0">
                      <Briefcase className="h-3.5 w-3.5 text-[#A78BFF]" />
                    </div>

                    <div className="space-y-1 pb-2">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h4 className="text-xs font-extrabold text-white">{exp.role}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">at {exp.company}</span>
                      </div>
                      <span className="text-[9px] text-[#7C5CFF] font-semibold font-mono block">{exp.period || exp.dates}</span>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-3xl text-xs text-slate-500 font-mono">
                  No professional experiences added yet.
                </div>
              )}
            </div>
          </div>

          {/* Education list */}
          <div className="rounded-3xl border border-slate-800/80 bg-[#111622]/60 p-6 backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Academic Timeline</h3>
            
            <div className="space-y-4">
              {education.length > 0 ? (
                education.map((ed: any, idx: number) => (
                  <div key={ed.school + idx} className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                      <GraduationCap className="h-4 w-4 text-blue-400" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <h4 className="text-xs font-extrabold text-white">{ed.degree}</h4>
                        <span className="text-[10px] text-slate-500 font-mono">at {ed.school}</span>
                      </div>
                      <span className="text-[9px] text-blue-400 font-semibold font-mono block">{ed.dates}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-3xl text-xs text-slate-500 font-mono">
                  No education history added yet.
                </div>
              )}
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
