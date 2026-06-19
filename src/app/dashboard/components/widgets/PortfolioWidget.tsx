"use client";

import { useState } from "react";
import { Globe, ArrowUpRight, Award, ShieldCheck, Copy, Check } from "lucide-react";

export default function PortfolioWidget() {
  const [copied, setCopied] = useState(false);
  const publicLink = "https://niksai.dev/@alexchen";

  const certificates = [
    { title: "Python Core Automation Master", issuer: "NIK's AI", date: "June 2026", hash: "CERT-PY-8823" },
    { title: "Advanced Async JavaScript Engine", issuer: "NIK's AI", date: "May 2026", hash: "CERT-JS-1290" },
  ];

  function copyLink() {
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text tracking-tight">Public Developer Portfolio</h1>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Manage your public developer webpage, showcase projects, and host verified certificates.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Public Link Share Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#7C5CFF]" />
              <h2 className="text-sm font-bold text-text tracking-tight">Portfolio Sharing</h2>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Your public link showcases your unlocked badges, streak records, finished projects, and verified certificates. Share this link on LinkedIn or Resume submissions.
            </p>

            <div className="flex gap-2">
              <div className="flex-1 rounded-xl border border-border-subtle bg-border-subtle/20 px-3.5 py-2.5 text-xs text-muted font-mono flex items-center overflow-x-auto select-all">
                {publicLink}
              </div>

              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 rounded-xl bg-[#7C5CFF]/15 border border-[#7C5CFF]/20 hover:bg-[#7C5CFF]/25 px-4 text-xs font-semibold text-[#A78BFF] transition-all outline-none cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Project Showcase settings */}
          <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl">
            <h3 className="text-xs font-bold text-text">Active Project Highlights</h3>
            <p className="text-[10px] text-muted mt-1 mb-4 leading-relaxed">
              Select which projects display on your public page. Completed projects are highlighted automatically.
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle bg-surface/20 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border-subtle bg-surface/10 text-[#7C5CFF] focus:ring-[#7C5CFF]/30"
                />
                <div>
                  <span className="text-xs font-semibold text-text/80">FastAPI Code Evaluator</span>
                  <span className="text-[9px] font-mono text-muted block">Intermediate • Python</span>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle bg-surface/20 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-border-subtle bg-surface/10 text-[#7C5CFF] focus:ring-[#7C5CFF]/30"
                />
                <div>
                  <span className="text-xs font-semibold text-text/80">Custom Virtual DOM</span>
                  <span className="text-[9px] font-mono text-[#22C55E] block">✓ Completed • TypeScript</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Certificates Sidebar */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="text-xs font-bold text-text">Verified Certificates</h3>
            </div>

            <div className="space-y-3">
              {certificates.map((cert) => (
                <div
                  key={cert.hash}
                  className="rounded-2xl border border-border-subtle bg-surface/20 p-4 relative overflow-hidden"
                >
                  {/* Subtle emblem background */}
                  <ShieldCheck className="absolute -right-3 -bottom-3 h-14 w-14 text-text/[0.02]" />

                  <p className="text-xs font-bold text-text leading-snug">{cert.title}</p>
                  <p className="text-[9px] text-muted mt-1 font-mono">{cert.issuer} • {cert.date}</p>

                  <div className="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[8px] font-mono text-[#7C5CFF]">
                    <span>HASH: {cert.hash}</span>
                    <button className="flex items-center gap-0.5 hover:underline bg-transparent border-0 cursor-pointer text-[#7C5CFF]">
                      Verify <ArrowUpRight className="h-2 w-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
