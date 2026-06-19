"use client";

import { useState, useMemo } from "react";
import { FileText, Award, Download, Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export default function ResumeBuilderWidget() {
  const [name, setName] = useState("Alex Chen");
  const [role, setRole] = useState("Junior Software Engineer");
  const [skills, setSkills] = useState("Python, JavaScript, React, SQL, Git");
  const [experience, setExperience] = useState(
    "Built cloud server scrapers using FastAPI. Integrated secure OAuth flows."
  );

  const [downloading, setDownloading] = useState(false);

  // Compute live ATS score based on keyword metrics
  const atsScore = useMemo(() => {
    let score = 30;
    if (name.length > 5) score += 10;
    if (role.length > 5) score += 10;

    // Check for target tech keywords
    const keywords = ["python", "javascript", "react", "docker", "fastapi", "git", "sql", "aws"];
    const text = (skills + " " + experience).toLowerCase();
    keywords.forEach((kw) => {
      if (text.includes(kw)) {
        score += 6;
      }
    });

    return Math.min(score, 100);
  }, [name, role, skills, experience]);

  function triggerDownload() {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("ATS Optimized Resume PDF generated successfully! (Sandbox simulation download complete)");
    }, 1200);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text tracking-tight">ATS Resume Optimizer</h1>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Optimize your resume layout and calculate keyword density score for engineering job application systems.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4 rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-[#7C5CFF]" />
            <h2 className="text-sm font-bold text-text tracking-tight">Resume Builder</h2>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold font-mono uppercase text-muted">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text placeholder-muted/40 outline-none focus:border-[#7C5CFF]/60 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold font-mono uppercase text-muted">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text placeholder-muted/40 outline-none focus:border-[#7C5CFF]/60 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold font-mono uppercase text-muted">Key Skills (comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text placeholder-muted/40 outline-none focus:border-[#7C5CFF]/60 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold font-mono uppercase text-muted">Work Experience Summary</label>
            <textarea
              rows={4}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text placeholder-muted/40 outline-none focus:border-[#7C5CFF]/60 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Live Preview & ATS score */}
        <div className="flex flex-col gap-6">
          {/* Live ATS score radial ring */}
          <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl flex items-center justify-between">
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-text">ATS System Compatibility Score</h3>
              <p className="text-[10px] text-muted leading-relaxed max-w-[180px]">
                Higher compatibility score ensures your application passes standard HR parser steps.
              </p>
            </div>

            <div className="relative flex items-center justify-center shrink-0 h-16 w-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="stroke-border-subtle/30"
                  strokeWidth="2.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <motion.path
                  initial={{ strokeDasharray: "0, 100" }}
                  animate={{ strokeDasharray: `${atsScore}, 100` }}
                  transition={{ duration: 0.8 }}
                  className="stroke-[#7C5CFF]"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-mono font-bold text-text">{atsScore}%</span>
            </div>
          </div>

          {/* Visual template preview page */}
          <div className="flex-1 rounded-3xl border border-border-subtle bg-surface/20 p-6 text-left relative overflow-hidden min-h-[200px] flex flex-col justify-between">
            {/* Top glass glow */}
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-10 bg-gradient-to-br from-[#FF6B4A] to-[#7C5CFF] filter blur-xl" />

            <div className="space-y-4">
              <div className="border-b border-border-subtle pb-3">
                <p className="text-sm font-bold text-text">{name || "Your Name"}</p>
                <p className="text-[10px] text-[#7C5CFF] font-mono mt-0.5">{role || "Target Engineering Role"}</p>
              </div>

              <div>
                <p className="text-[9px] font-bold font-mono text-muted uppercase tracking-wider">Expertise & Tech</p>
                <p className="text-[10px] text-text/80 mt-1 leading-relaxed">{skills || "None added yet."}</p>
              </div>

              <div>
                <p className="text-[9px] font-bold font-mono text-muted uppercase tracking-wider">Professional History</p>
                <p className="text-[10px] text-text/65 mt-1 leading-relaxed italic">{experience || "None added yet."}</p>
              </div>
            </div>

            <button
              onClick={triggerDownload}
              disabled={downloading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-surface/20 border border-border-subtle hover:bg-surface/30 p-3 text-xs font-semibold text-text transition-all outline-none cursor-pointer"
            >
              {downloading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-muted" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 text-[#7C5CFF]" />
                  <span>Download Resume PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
