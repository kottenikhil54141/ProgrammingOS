"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  FileText, 
  Award, 
  Download, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Hammer, 
  Check, 
  PlusCircle, 
  RefreshCw,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useAuth } from "@/lib/auth-context";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  dates: string;
  description: string;
}

interface ProjectItem {
  id: string;
  name: string;
  tech: string;
  description: string;
  url: string;
}

interface EducationItem {
  id: string;
  school: string;
  degree: string;
  dates: string;
}

type TemplateType = "sleek" | "creative" | "executive";
type AccentColor = "indigo" | "blue" | "emerald" | "amber" | "slate";

const ACCENT_COLORS: Record<AccentColor, { hex: string; bg: string; border: string; text: string }> = {
  indigo: { hex: "#7C5CFF", bg: "bg-[#7C5CFF]/10", border: "border-[#7C5CFF]/20", text: "text-[#7C5CFF]" },
  blue: { hex: "#2563EB", bg: "bg-[#2563EB]/10", border: "border-[#2563EB]/20", text: "text-[#2563EB]" },
  emerald: { hex: "#059669", bg: "bg-[#059669]/10", border: "border-[#059669]/20", text: "text-[#059669]" },
  amber: { hex: "#D97706", bg: "bg-[#D97706]/10", border: "border-[#D97706]/20", text: "text-[#D97706]" },
  slate: { hex: "#475569", bg: "bg-[#475569]/10", border: "border-[#475569]/20", text: "text-[#475569]" },
};

const TARGET_KEYWORDS = [
  { word: "fastapi", label: "FastAPI", desc: "Builds high-performance backends" },
  { word: "react", label: "React", desc: "Interactivity and UI components" },
  { word: "docker", label: "Docker", desc: "Containerization and local environments" },
  { word: "postgresql", label: "PostgreSQL / SQL", desc: "Relational database modeling" },
  { word: "git", label: "Git / CI-CD", desc: "Version control and delivery pipelines" },
  { word: "asyncio", label: "Asynchronous IO", desc: "Concurrent tasks and WebSockets" },
  { word: "rest api", label: "REST APIs", desc: "Endpoint design and HTTP contracts" },
  { word: "typescript", label: "TypeScript", desc: "Static type checks and codebase safety" },
];

export default function ResumeBuilderWidget() {
  const { user, updateUser } = useAuth();
  const [activeFormTab, setActiveFormTab] = useState<"personal" | "experience" | "projects" | "education" | "skills">("personal");
  const [template, setTemplate] = useState<TemplateType>("sleek");
  const [accent, setAccent] = useState<AccentColor>("indigo");
  const [compiling, setCompiling] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  // Core Resume Datasets - Richly pre-filled with professional details matching all keywords (>90% ATS Score)
  const [personal, setPersonal] = useState({
    name: user?.name || "Alex Chen",
    title: "Full-Stack Software Engineer",
    location: user?.portfolio?.location || "Remote / Bengaluru, India",
    email: user?.email || "alex.chen@programmingos.in",
    phone: "+91 98765 43210", // Strictly prefilled with India country code
    github: "github.com/developer-chen",
    linkedin: "linkedin.com/in/alexchen-dev",
    summary: "Detail-oriented Software Engineer specializing in building TypeScript scalable web architectures, modern REST API design, and robust compiler sandboxes. Proficient in React frontend state management and FastAPI asynchronous data processing pipelines."
  });

  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: "exp-1",
      company: "ByteScale Solutions",
      role: "Backend Engineer Intern",
      dates: "2025 - Present",
      description: "Designed concurrent server-side worker loops using FastAPI and asyncio, boosting event streaming rates by 40%. Implemented secure REST API endpoint integrations and database configurations in PostgreSQL."
    },
    {
      id: "exp-2",
      company: "CodeCraft Academy",
      role: "Software Developer Contributor",
      dates: "2024 - 2025",
      description: "Contributed to open source repositories by writing TypeScript modules. Optimized React application routing bundles and state hooks, reducing initial client load durations by 25%."
    }
  ]);

  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "proj-1",
      name: "ProgrammingOS Workspace",
      tech: "Next.js, TypeScript, React, Pyodide WASM",
      description: "Engineered a local web browser sandbox IDE capable of compiling Python scripts on-the-fly, integrating Git structures and mapping live typing metrics.",
      url: "github.com/developer-chen/programmingos"
    },
    {
      id: "proj-2",
      name: "LogStream Engine",
      tech: "FastAPI, Docker, Redis, PostgreSQL",
      description: "Built a distributed containerized logs processor using Redis pub/sub queues and Docker containers, enabling real-time telemetry extraction.",
      url: "github.com/developer-chen/logstream"
    }
  ]);

  const [education, setEducation] = useState<EducationItem[]>([
    {
      id: "edu-1",
      school: "Indian Institute of Information Technology",
      degree: "B.Tech in Computer Science & Engineering",
      dates: "2022 - 2026"
    }
  ]);

  const [skills, setSkills] = useState({
    languages: "Python, JavaScript, TypeScript, SQL, HTML/CSS",
    frameworks: "React, Next.js, FastAPI, Express.js, asyncio, REST API",
    tools: "Git, Docker, PostgreSQL, Redis, Linux, AWS"
  });

  // Load saved portfolio if it exists on mount
  useEffect(() => {
    if (user?.portfolio) {
      const p = user.portfolio;
      if (p.title || p.summary) {
        setPersonal({
          name: user.name || "Alex Chen",
          title: p.title || "Full-Stack Software Engineer",
          location: p.location || "Remote / Bengaluru, India",
          email: user.email || "alex.chen@programmingos.in",
          phone: p.phone || "+91 98765 43210",
          github: p.github || "",
          linkedin: p.linkedin || "",
          summary: p.summary || ""
        });
      }
      if (p.experiences && p.experiences.length > 0) setExperiences(p.experiences);
      if (p.projects && p.projects.length > 0) setProjects(p.projects);
      if (p.education && p.education.length > 0) setEducation(p.education);
      if (p.skills) {
        setSkills({
          languages: Array.isArray(p.skills.languages) ? p.skills.languages.join(", ") : (p.skills.languages || ""),
          frameworks: Array.isArray(p.skills.frameworks) ? p.skills.frameworks.join(", ") : (p.skills.frameworks || ""),
          tools: Array.isArray(p.skills.tools) ? p.skills.tools.join(", ") : (p.skills.tools || "")
        });
      }
    }
  }, []);

  const savePortfolio = async () => {
    setSaving(true);
    setSaveStatus("idle");

    const languagesList = skills.languages.split(",").map(s => s.trim()).filter(Boolean);
    const frameworksList = skills.frameworks.split(",").map(s => s.trim()).filter(Boolean);
    const toolsList = skills.tools.split(",").map(s => s.trim()).filter(Boolean);

    const portfolioData = {
      title: personal.title,
      location: personal.location || "Remote",
      phone: personal.phone,
      github: personal.github,
      linkedin: personal.linkedin,
      summary: personal.summary,
      skills: {
        languages: languagesList,
        frameworks: frameworksList,
        tools: toolsList
      },
      experiences,
      projects,
      education
    };

    try {
      const res = await fetch("/api/user/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ portfolio: portfolioData })
      });

      if (!res.ok) throw new Error("Failed to save portfolio");
      const data = await res.json();
      if (data.success) {
        setSaveStatus("success");
        if (updateUser) {
          updateUser({ portfolio: portfolioData });
        }
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
      }
    } catch (err) {
      console.error("Save Portfolio error:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };


  // Strict Phone Validator: Enforces +91 Indian code only
  const handlePhoneChange = (val: string) => {
    let sanitized = val;
    // Prefix enforcement
    if (!sanitized.startsWith("+91")) {
      if (sanitized === "" || sanitized === "+" || sanitized === "9" || sanitized === "1") {
        sanitized = "+91 ";
      } else {
        sanitized = "+91 " + sanitized.replace(/^\+?9?1?/, "").trim();
      }
    }
    // Clean to numbers, spaces, and initial +
    sanitized = sanitized.slice(0, 16).replace(/[^\d+ ]/g, "");
    setPersonal(p => ({ ...p, phone: sanitized }));
  };

  // Calculate ATS Score & Keywords Match
  const parsedKeywords = useMemo(() => {
    const fullText = [
      personal.name,
      personal.title,
      personal.summary,
      ...experiences.map(e => e.company + " " + e.role + " " + e.description),
      ...projects.map(p => p.name + " " + p.tech + " " + p.description),
      ...education.map(ed => ed.school + " " + ed.degree),
      skills.languages,
      skills.frameworks,
      skills.tools
    ].join(" ").toLowerCase();

    return TARGET_KEYWORDS.map(kw => ({
      ...kw,
      matched: fullText.includes(kw.word)
    }));
  }, [personal, experiences, projects, education, skills]);

  const atsScore = useMemo(() => {
    let score = 30; // High baseline configuration

    // Scoring segments
    if (personal.name.length > 3) score += 10;
    if (personal.summary.length > 50) score += 10;
    if (experiences.length > 0) score += 15;
    if (projects.length > 0) score += 15;
    if (education.length > 0) score += 10;
    
    // Keyword density scoring
    const matchedCount = parsedKeywords.filter(k => k.matched).length;
    score += matchedCount * 2.5;

    return Math.min(100, Math.round(score));
  }, [personal, experiences, projects, education, parsedKeywords]);

  // Handlers to manage work, project and education entries
  const addExperience = () => {
    setExperiences([...experiences, {
      id: `exp-${Date.now()}`,
      company: "Company Name",
      role: "Software Engineer",
      dates: "2025 - Present",
      description: "Summarize your achievements and technical methodologies using target keywords."
    }]);
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: string) => {
    setExperiences(experiences.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter(item => item.id !== id));
  };

  const addProject = () => {
    setProjects([...projects, {
      id: `proj-${Date.now()}`,
      name: "New Project",
      tech: "React, FastAPI",
      description: "Describe the architecture and performance achievements.",
      url: "github.com/username/project"
    }]);
  };

  const updateProject = (id: string, field: keyof ProjectItem, val: string) => {
    setProjects(projects.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(item => item.id !== id));
  };

  const addEducation = () => {
    setEducation([...education, {
      id: `edu-${Date.now()}`,
      school: "University / College",
      degree: "B.Tech in Computer Science",
      dates: "2022 - 2026"
    }]);
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    setEducation(education.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  const deleteEducation = (id: string) => {
    setEducation(education.filter(item => item.id !== id));
  };

  const addSuggestedKeyword = (word: string) => {
    if (word === "fastapi" || word === "react" || word === "asyncio" || word === "rest api" || word === "typescript") {
      setSkills(s => ({ ...s, frameworks: s.frameworks ? `${s.frameworks}, ${word}` : word }));
    } else {
      setSkills(s => ({ ...s, tools: s.tools ? `${s.tools}, ${word}` : word }));
    }
  };

  // Compile PDF via dynamic browser print bridge
  const compilePDF = () => {
    setCompiling(true);
    setTimeout(() => {
      try {
        const frame = document.createElement("iframe");
        frame.style.position = "fixed";
        frame.style.bottom = "0";
        frame.style.right = "0";
        frame.style.width = "0";
        frame.style.height = "0";
        frame.style.border = "none";
        document.body.appendChild(frame);

        const accentColor = ACCENT_COLORS[accent].hex;
        const doc = frame.contentWindow?.document || frame.contentDocument;
        if (doc) {
          doc.open();
          doc.write(`
            <html>
              <head>
                <title>${personal.name} - Resume</title>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                  * { box-sizing: border-box; margin: 0; padding: 0; }
                  body {
                    font-family: 'Inter', sans-serif;
                    color: #1e293b;
                    background: #ffffff;
                    padding: 40px;
                    line-height: 1.5;
                    font-size: 10.5px;
                  }
                  .header {
                    border-bottom: 2px solid ${accentColor};
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                  }
                  .name { font-size: 20px; font-weight: 800; color: #0f172a; }
                  .title { font-size: 11px; font-weight: 600; color: ${accentColor}; text-transform: uppercase; margin-top: 2px; }
                  .contacts { display: flex; flex-wrap: wrap; gap: 12px; font-size: 9px; color: #64748b; margin-top: 6px; }
                  .summary { font-size: 10px; color: #475569; margin-bottom: 15px; line-height: 1.5; }
                  .section-title {
                    font-size: 10.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: #0f172a;
                    border-bottom: 1px solid #e2e8f0;
                    padding-bottom: 3px;
                    margin-top: 15px;
                    margin-bottom: 8px;
                    letter-spacing: 0.5px;
                  }
                  .experience-item, .project-item, .education-item { margin-bottom: 10px; }
                  .item-header { display: flex; justify-content: space-between; font-weight: 600; color: #0f172a; font-size: 10px; }
                  .item-dates { font-size: 9px; color: #64748b; }
                  .item-sub { font-style: italic; color: ${accentColor}; font-size: 9px; margin-bottom: 3px; }
                  .item-desc { font-size: 9px; color: #475569; line-height: 1.45; }
                  .skills-grid { display: flex; flex-direction: column; gap: 4px; }
                  .skills-row { display: grid; grid-template-columns: 100px 1fr; font-size: 9px; }
                  .skills-label { font-weight: 700; color: #64748b; }
                  .skills-vals { color: #334155; }
                  ${template === "executive" ? `
                    .executive-container { display: grid; grid-template-columns: 180px 1fr; gap: 20px; }
                    .executive-left { border-right: 1px solid #e2e8f0; padding-right: 12px; }
                  ` : ""}
                </style>
              </head>
              <body>
                ${template === "executive" ? `
                  <div class="header">
                    <div class="name">${personal.name}</div>
                    <div class="title">${personal.title}</div>
                    <div class="contacts">
                      <span>${personal.email}</span>
                      <span>${personal.phone}</span>
                      <span>${personal.github}</span>
                      <span>${personal.linkedin}</span>
                    </div>
                  </div>
                  <div class="executive-container">
                    <div class="executive-left">
                      <div class="summary">${personal.summary}</div>
                      <div class="section-title">Skills</div>
                      <div class="skills-grid">
                        <div class="skills-row">
                          <div class="skills-label">Languages</div>
                          <div class="skills-vals">${skills.languages}</div>
                        </div>
                        <div class="skills-row">
                          <div class="skills-label">Frameworks</div>
                          <div class="skills-vals">${skills.frameworks}</div>
                        </div>
                        <div class="skills-row">
                          <div class="skills-label">Tools</div>
                          <div class="skills-vals">${skills.tools}</div>
                        </div>
                      </div>
                      <div class="section-title">Education</div>
                      ${education.map(ed => `
                        <div class="education-item">
                          <div class="item-header" style="font-size: 9px;">${ed.school}</div>
                          <div class="item-sub" style="font-size: 8px;">${ed.degree}</div>
                          <div class="item-dates" style="font-size: 8px;">${ed.dates}</div>
                        </div>
                      `).join("")}
                    </div>
                    <div>
                      <div class="section-title" style="margin-top: 0;">Experience</div>
                      ${experiences.map(exp => `
                        <div class="experience-item">
                          <div class="item-header">
                            <span>${exp.company}</span>
                            <span class="item-dates">${exp.dates}</span>
                          </div>
                          <div class="item-sub">${exp.role}</div>
                          <div class="item-desc">${exp.description}</div>
                        </div>
                      `).join("")}
                      <div class="section-title">Projects</div>
                      ${projects.map(p => `
                        <div class="project-item">
                          <div class="item-header">
                            <span>${p.name}</span>
                            <span class="item-dates">${p.url}</span>
                          </div>
                          <div class="item-sub">${p.tech}</div>
                          <div class="item-desc">${p.description}</div>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                ` : `
                  <div class="header">
                    <div class="name">${personal.name}</div>
                    <div class="title">${personal.title}</div>
                    <div class="contacts">
                      <span>${personal.email}</span>
                      <span>${personal.phone}</span>
                      <span>${personal.github}</span>
                      <span>${personal.linkedin}</span>
                    </div>
                  </div>
                  <div class="summary">${personal.summary}</div>
                  <div class="section-title">Experience</div>
                  ${experiences.map(exp => `
                    <div class="experience-item">
                      <div class="item-header">
                        <span>${exp.company}</span>
                        <span class="item-dates">${exp.dates}</span>
                      </div>
                      <div class="item-sub">${exp.role}</div>
                      <div class="item-desc">${exp.description}</div>
                    </div>
                  `).join("")}
                  <div class="section-title">Projects</div>
                  ${projects.map(p => `
                    <div class="project-item">
                      <div class="item-header">
                        <span>${p.name}</span>
                        <span class="item-dates">${p.url}</span>
                      </div>
                      <div class="item-sub">${p.tech}</div>
                      <div class="item-desc">${p.description}</div>
                    </div>
                  `).join("")}
                  <div class="section-title">Skills</div>
                  <div class="skills-grid">
                    <div class="skills-row">
                      <div class="skills-label">Languages</div>
                      <div class="skills-vals">${skills.languages}</div>
                    </div>
                    <div class="skills-row">
                      <div class="skills-label">Frameworks</div>
                      <div class="skills-vals">${skills.frameworks}</div>
                    </div>
                    <div class="skills-row">
                      <div class="skills-label">Tools</div>
                      <div class="skills-vals">${skills.tools}</div>
                    </div>
                  </div>
                  <div class="section-title">Education</div>
                  ${education.map(ed => `
                    <div class="education-item">
                      <div class="item-header">
                        <span>${ed.school}</span>
                        <span class="item-dates">${ed.dates}</span>
                      </div>
                      <div class="item-sub">${ed.degree}</div>
                    </div>
                  `).join("")}
                `}
              </body>
            </html>
          `);
          doc.close();
        }

        setTimeout(() => {
          frame.contentWindow?.print();
          document.body.removeChild(frame);
          setCompiling(false);
        }, 1000);
      } catch (err) {
        console.error("PDF Print failed:", err);
        setCompiling(false);
      }
    }, 1200);
  };

  // Compile DOCX download (compatible Microsoft Word format)
  const compileDOCX = () => {
    const accentColor = ACCENT_COLORS[accent].hex;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>${personal.name} - Resume</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.5; color: #1e293b; padding: 30pt; }
          .header { border-bottom: 2pt solid ${accentColor}; padding-bottom: 10pt; margin-bottom: 15pt; }
          .name { font-size: 20pt; font-weight: 800; color: #0f172a; }
          .title { font-size: 11pt; font-weight: 700; color: ${accentColor}; text-transform: uppercase; margin-top: 2pt; }
          .contacts { font-size: 8.5pt; color: #64748b; margin-top: 6pt; }
          .section-title { font-size: 11pt; font-weight: 700; text-transform: uppercase; color: #0f172a; border-bottom: 1pt solid #e2e8f0; padding-bottom: 3pt; margin-top: 15pt; margin-bottom: 8pt; }
          .item-header { font-weight: 700; font-size: 10pt; color: #0f172a; }
          .item-sub { font-style: italic; color: ${accentColor}; font-size: 9pt; margin-bottom: 3pt; }
          .item-desc { font-size: 9pt; color: #475569; margin-bottom: 10pt; }
        </style>
      </head>
      <body>
    `;
    const footer = `</body></html>`;
    const body = `
      <div class="header">
        <div class="name">${personal.name}</div>
        <div class="title">${personal.title}</div>
        <div class="contacts">
          ${personal.email} &nbsp;|&nbsp; ${personal.phone} &nbsp;|&nbsp; ${personal.github} &nbsp;|&nbsp; ${personal.linkedin}
        </div>
      </div>
      <p style="font-size: 9.5pt; color: #475569; margin-bottom: 15pt;">${personal.summary}</p>
      
      <div class="section-title">Professional Experience</div>
      ${experiences.map(exp => `
        <table style="width: 100%;">
          <tr>
            <td class="item-header">${exp.company}</td>
            <td style="text-align: right; font-size: 8.5pt; color: #64748b;">${exp.dates}</td>
          </tr>
        </table>
        <div class="item-sub">${exp.role}</div>
        <div class="item-desc">${exp.description}</div>
      `).join("")}

      <div class="section-title">Key Projects</div>
      ${projects.map(p => `
        <table style="width: 100%;">
          <tr>
            <td class="item-header">${p.name}</td>
            <td style="text-align: right; font-size: 8.5pt; color: #64748b;">${p.url}</td>
          </tr>
        </table>
        <div class="item-sub">${p.tech}</div>
        <div class="item-desc">${p.description}</div>
      `).join("")}

      <div class="section-title">Core Skills</div>
      <p style="font-size: 9pt; margin-bottom: 4pt;"><strong>Languages:</strong> ${skills.languages}</p>
      <p style="font-size: 9pt; margin-bottom: 4pt;"><strong>Frameworks:</strong> ${skills.frameworks}</p>
      <p style="font-size: 9pt; margin-bottom: 10pt;"><strong>Tools & Infrastructure:</strong> ${skills.tools}</p>

      <div class="section-title">Education</div>
      ${education.map(ed => `
        <table style="width: 100%;">
          <tr>
            <td class="item-header">${ed.school}</td>
            <td style="text-align: right; font-size: 8.5pt; color: #64748b;">${ed.dates}</td>
          </tr>
        </table>
        <div class="item-desc" style="font-style: italic;">${ed.degree}</div>
      `).join("")}
    `;

    const blob = new Blob([header + body + footer], { type: "application/msword;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${personal.name.replace(/\s+/g, "_")}_Resume.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-4">
        <div>
          <h1 className="text-2xl font-black text-text tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#7C5CFF]" />
            ATS Resume Optimizer
          </h1>
          <p className="text-xs text-muted mt-1 leading-relaxed max-w-xl">
            Edit your engineering credentials, scan compliance keywords, and print layouts. Only Indian phone validation is permitted.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Template select */}
          <div className="flex bg-slate-100 dark:bg-white/5 rounded-xl border border-border-subtle p-1">
            {(["sleek", "creative", "executive"] as TemplateType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all outline-none cursor-pointer",
                  template === t 
                    ? "bg-[#7C5CFF] text-white shadow-md shadow-[#7C5CFF]/20" 
                    : "text-slate-500 dark:text-slate-400 hover:text-text"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Accent Color Circles */}
          <div className="flex items-center gap-1.5 px-2">
            {(Object.keys(ACCENT_COLORS) as AccentColor[]).map((c) => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className={cn(
                  "w-4 h-4 rounded-full border border-white/20 transition-all scale-95 hover:scale-110 cursor-pointer",
                  accent === c ? "ring-2 ring-offset-2 ring-offset-background ring-[#7C5CFF]" : ""
                )}
                style={{ backgroundColor: ACCENT_COLORS[c].hex }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Data Entry Fields */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl">
            {/* Section tabs */}
            <div className="flex gap-1 overflow-x-auto pb-2 border-b border-border-subtle/40 mb-4 scrollbar-none">
              {[
                { id: "personal", label: "Contact", icon: Briefcase },
                { id: "experience", label: "Work", icon: Award },
                { id: "projects", label: "Projects", icon: FolderGit2 },
                { id: "skills", label: "Skills", icon: Hammer },
                { id: "education", label: "Education", icon: GraduationCap }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFormTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider shrink-0 transition-colors cursor-pointer",
                      activeFormTab === tab.id
                        ? "bg-[#7C5CFF]/10 text-[#7C5CFF]"
                        : "text-muted hover:text-text hover:bg-slate-100 dark:hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: Personal */}
            {activeFormTab === "personal" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black font-mono uppercase text-muted">Full Name</label>
                  <input
                    type="text"
                    value={personal.name}
                    onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black font-mono uppercase text-muted">Target Title</label>
                    <input
                      type="text"
                      value={personal.title}
                      onChange={(e) => setPersonal({ ...personal, title: e.target.value })}
                      className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black font-mono uppercase text-muted">Location</label>
                    <input
                      type="text"
                      value={personal.location}
                      onChange={(e) => setPersonal({ ...personal, location: e.target.value })}
                      className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black font-mono uppercase text-muted">Email</label>
                    <input
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                      className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black font-mono uppercase text-muted">Phone (India Only)</label>
                    <input
                      type="text"
                      value={personal.phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="w-full rounded-xl border border-[#7C5CFF]/40 bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/80 transition-colors font-mono"
                      placeholder="+91 XXXXX XXXXX"
                    />
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono block mt-0.5">
                      Strictly +91 prefix country code formatting
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black font-mono uppercase text-muted">GitHub</label>
                    <input
                      type="text"
                      value={personal.github}
                      onChange={(e) => setPersonal({ ...personal, github: e.target.value })}
                      className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black font-mono uppercase text-muted">LinkedIn</label>
                    <input
                      type="text"
                      value={personal.linkedin}
                      onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                      className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black font-mono uppercase text-muted">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={personal.summary}
                    onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors resize-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: Experience */}
            {activeFormTab === "experience" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Experience List</span>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#7C5CFF] hover:bg-[#7C5CFF]/10 px-2.5 py-1.5 rounded-lg border border-[#7C5CFF]/20 transition-all outline-none cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add Work
                  </button>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-none">
                  <AnimatePresence initial={false}>
                    {experiences.map((exp, idx) => (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-surface/20 border border-border-subtle/60 relative space-y-3"
                      >
                        <button
                          onClick={() => deleteExperience(exp.id)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors outline-none cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[9px] font-mono text-muted uppercase">Position #{idx + 1}</span>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase text-muted">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase text-muted">Dates</label>
                            <input
                              type="text"
                              value={exp.dates}
                              onChange={(e) => updateExperience(exp.id, "dates", e.target.value)}
                              className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-muted">Role Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                            className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-muted">Achievements Summary</label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                            className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 resize-none leading-relaxed"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Projects */}
            {activeFormTab === "projects" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projects List</span>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#7C5CFF] hover:bg-[#7C5CFF]/10 px-2.5 py-1.5 rounded-lg border border-[#7C5CFF]/20 transition-all outline-none cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add Project
                  </button>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1 scrollbar-none">
                  <AnimatePresence initial={false}>
                    {projects.map((p, idx) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-surface/20 border border-border-subtle/60 relative space-y-3"
                      >
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors outline-none cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[9px] font-mono text-muted uppercase">Project #{idx + 1}</span>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase text-muted">Project Name</label>
                            <input
                              type="text"
                              value={p.name}
                              onChange={(e) => updateProject(p.id, "name", e.target.value)}
                              className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase text-muted">URL Link</label>
                            <input
                              type="text"
                              value={p.url}
                              onChange={(e) => updateProject(p.id, "url", e.target.value)}
                              className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-muted">Tech Stack (comma separated)</label>
                          <input
                            type="text"
                            value={p.tech}
                            onChange={(e) => updateProject(p.id, "tech", e.target.value)}
                            className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-muted">Project Description</label>
                          <textarea
                            rows={3}
                            value={p.description}
                            onChange={(e) => updateProject(p.id, "description", e.target.value)}
                            className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 resize-none leading-relaxed"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Skills */}
            {activeFormTab === "skills" && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black font-mono uppercase text-muted">Languages</label>
                  <input
                    type="text"
                    value={skills.languages}
                    onChange={(e) => setSkills({ ...skills, languages: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black font-mono uppercase text-muted">Frameworks & Libraries</label>
                  <input
                    type="text"
                    value={skills.frameworks}
                    onChange={(e) => setSkills({ ...skills, frameworks: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black font-mono uppercase text-muted">Tools & Infrastructure</label>
                  <input
                    type="text"
                    value={skills.tools}
                    onChange={(e) => setSkills({ ...skills, tools: e.target.value })}
                    className="w-full rounded-xl border border-border-subtle bg-surface/20 px-3.5 py-2.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: Education */}
            {activeFormTab === "education" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Education History</span>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#7C5CFF] hover:bg-[#7C5CFF]/10 px-2.5 py-1.5 rounded-lg border border-[#7C5CFF]/20 transition-all outline-none cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add School
                  </button>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {education.map((ed, idx) => (
                      <motion.div
                        key={ed.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-4 rounded-2xl bg-surface/20 border border-border-subtle/60 relative space-y-3"
                      >
                        <button
                          onClick={() => deleteEducation(ed.id)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-red-500 transition-colors outline-none cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-[9px] font-mono text-muted uppercase">Education #{idx + 1}</span>

                        <div className="space-y-1">
                          <label className="block text-[8px] font-bold uppercase text-muted">School / University</label>
                          <input
                            type="text"
                            value={ed.school}
                            onChange={(e) => updateEducation(ed.id, "school", e.target.value)}
                            className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase text-muted">Degree / Concentration</label>
                            <input
                              type="text"
                              value={ed.degree}
                              onChange={(e) => updateEducation(ed.id, "degree", e.target.value)}
                              className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[8px] font-bold uppercase text-muted">Dates / Year</label>
                            <input
                              type="text"
                              value={ed.dates}
                              onChange={(e) => updateEducation(ed.id, "dates", e.target.value)}
                              className="w-full rounded-lg border border-border-subtle bg-surface/10 px-2 py-1.5 text-xs text-text outline-none focus:border-[#7C5CFF]/60"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* ATS Compliance Scanner */}
          <div className="rounded-3xl border border-border-subtle bg-surface/30 p-6 backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-text">ATS Scanner Compliance</h3>
                <p className="text-[10px] text-muted">Targets &gt;90% compatibility metrics.</p>
              </div>

              {/* Progress Ring */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="2.5" />
                  <circle 
                    cx="18" 
                    cy="18" 
                    r="15.915" 
                    fill="none" 
                    className={cn(
                      "transition-all duration-500",
                      atsScore >= 90 ? "stroke-emerald-500" : "stroke-[#7C5CFF]"
                    )} 
                    strokeWidth="2.5" 
                    strokeDasharray={`${atsScore} 100`} 
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute text-[9px] font-mono font-black text-text">{atsScore}%</span>
              </div>
            </div>

            {/* Keyword tags checklist */}
            <div className="grid grid-cols-2 gap-2">
              {parsedKeywords.map((kw) => (
                <div 
                  key={kw.word}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-xl border text-[9px] font-mono transition-all",
                    kw.matched 
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                      : "bg-slate-100/50 dark:bg-white/[0.02] border-border-subtle text-muted hover:border-[#7C5CFF]/30"
                  )}
                >
                  <span className="font-bold">{kw.label}</span>
                  {kw.matched ? (
                    <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                  ) : (
                    <button
                      onClick={() => addSuggestedKeyword(kw.word)}
                      title={`Add ${kw.label} recommendation`}
                      className="text-[#7C5CFF] hover:text-[#7C5CFF]/80 p-0.5 outline-none cursor-pointer"
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Document sheet preview (Scrolls horizontally on mobile/tablet) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-3 rounded-2xl bg-surface/20 border border-border-subtle">
            <div className="flex items-center gap-3 pl-2">
              <span className="text-[10px] font-mono text-muted">A4 Layout Preview</span>
              {saveStatus === "success" && (
                <span className="text-[10px] text-emerald-400 font-semibold animate-pulse font-mono">
                  ✓ Saved & Published!
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-[10px] text-rose-400 font-semibold font-mono">
                  ✗ Save failed
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Save & Publish Portfolio */}
              <button
                onClick={savePortfolio}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-[10px] font-bold shadow-md shadow-emerald-600/10 transition-all outline-none cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-3.5 w-3.5 text-emerald-350" />
                    <span>Save & Publish</span>
                  </>
                )}
              </button>

              {/* Export Word (DOCX compatible) */}
              <button
                onClick={compileDOCX}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface/30 border border-border-subtle hover:bg-surface/50 text-[10px] font-bold text-text transition-all outline-none cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-blue-500" />
                <span>Export Word (.doc)</span>
              </button>

              {/* Compile PDF */}
              <button
                onClick={compilePDF}
                disabled={compiling}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#7C5CFF] hover:bg-[#6c4beb] text-white text-[10px] font-black shadow-md shadow-[#7C5CFF]/20 transition-all outline-none cursor-pointer disabled:opacity-50"
              >
                {compiling ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Styled Document Sheet Container: Scroll wrapper for perfect responsiveness */}
          <div className="w-full overflow-x-auto rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-xl bg-slate-900/10 backdrop-blur-md">
            <div className="min-w-[650px] lg:min-w-0 bg-white text-slate-800 p-10 min-h-[840px] relative overflow-hidden transition-all duration-300">
              {template === "creative" && (
                <div 
                  className="absolute left-0 top-0 right-0 h-2 transition-colors duration-300"
                  style={{ backgroundColor: ACCENT_COLORS[accent].hex }}
                />
              )}

              {template === "executive" ? (
                /* Executive 2-column layout */
                <div className="space-y-5">
                  <div 
                    className="pb-3 transition-all"
                    style={{ borderBottom: `2px solid ${ACCENT_COLORS[accent].hex}` }}
                  >
                    <h2 className="text-lg font-extrabold text-slate-900 leading-tight">{personal.name || "Your Name"}</h2>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: ACCENT_COLORS[accent].hex }}>
                      {personal.title || "Target Engineer Role"}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-mono text-slate-500 mt-2">
                      <span>{personal.email}</span>
                      <span>{personal.phone}</span>
                      <span>{personal.github}</span>
                      <span>{personal.linkedin}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-5 items-start">
                    <div className="col-span-4 space-y-4 border-r border-slate-100 pr-3">
                      <div>
                        <p className="text-[8.5px] text-slate-600 leading-relaxed">{personal.summary}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Skills</h4>
                        <div className="space-y-1.5 text-[8px] leading-relaxed">
                          <div>
                            <span className="font-bold block text-slate-500">Languages:</span>
                            <span className="text-slate-700">{skills.languages || "None"}</span>
                          </div>
                          <div>
                            <span className="font-bold block text-slate-500">Frameworks:</span>
                            <span className="text-slate-700">{skills.frameworks || "None"}</span>
                          </div>
                          <div>
                            <span className="font-bold block text-slate-500">Tools:</span>
                            <span className="text-slate-700">{skills.tools || "None"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Education</h4>
                        {education.map(ed => (
                          <div key={ed.id} className="space-y-0.5">
                            <p className="font-bold text-slate-800 text-[8px]">{ed.school}</p>
                            <p className="text-[7.5px] text-slate-500">{ed.degree}</p>
                            <p className="text-[7px] font-mono text-slate-400">{ed.dates}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-8 space-y-5">
                      <div className="space-y-2">
                        <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Experience</h4>
                        <div className="space-y-3">
                          {experiences.map(exp => (
                            <div key={exp.id} className="space-y-0.5">
                              <div className="flex justify-between items-baseline font-bold text-slate-800 text-[9px]">
                                <span>{exp.company}</span>
                                <span className="text-[7.5px] font-mono font-normal text-slate-500">{exp.dates}</span>
                              </div>
                              <div className="text-[8px] font-semibold italic" style={{ color: ACCENT_COLORS[accent].hex }}>
                                {exp.role}
                              </div>
                              <p className="text-[8px] text-slate-600 leading-relaxed">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Projects</h4>
                        <div className="space-y-3">
                          {projects.map(proj => (
                            <div key={proj.id} className="space-y-0.5">
                              <div className="flex justify-between items-baseline font-bold text-slate-800 text-[9px]">
                                <span>{proj.name}</span>
                                <span className="text-[7.5px] font-mono font-normal text-slate-500">{proj.url}</span>
                              </div>
                              <div className="text-[8px] font-semibold italic" style={{ color: ACCENT_COLORS[accent].hex }}>
                                {proj.tech}
                              </div>
                              <p className="text-[8px] text-slate-600 leading-relaxed">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Standard layout (Sleek or Creative) */
                <div className="space-y-4">
                  <div 
                    className="pb-3 transition-all"
                    style={{ borderBottom: `2px solid ${ACCENT_COLORS[accent].hex}` }}
                  >
                    <h2 className="text-lg font-extrabold text-slate-900 leading-tight">{personal.name || "Your Name"}</h2>
                    <h3 className="text-[10px] font-bold uppercase tracking-wider mt-0.5" style={{ color: ACCENT_COLORS[accent].hex }}>
                      {personal.title || "Target Engineer Role"}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[8px] font-mono text-slate-500 mt-2">
                      <span>{personal.email}</span>
                      <span>{personal.phone}</span>
                      <span>{personal.github}</span>
                      <span>{personal.linkedin}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[8.5px] text-slate-600 leading-relaxed">{personal.summary}</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Experience</h4>
                    <div className="space-y-3">
                      {experiences.map(exp => (
                        <div key={exp.id} className="space-y-0.5">
                          <div className="flex justify-between items-baseline font-bold text-slate-800 text-[9px]">
                            <span>{exp.company}</span>
                            <span className="text-[7.5px] font-mono font-normal text-slate-500">{exp.dates}</span>
                          </div>
                          <div className="text-[8px] font-semibold italic" style={{ color: ACCENT_COLORS[accent].hex }}>
                            {exp.role}
                          </div>
                          <p className="text-[8px] text-slate-600 leading-relaxed">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Projects</h4>
                    <div className="space-y-3">
                      {projects.map(proj => (
                        <div key={proj.id} className="space-y-0.5">
                          <div className="flex justify-between items-baseline font-bold text-slate-800 text-[9px]">
                            <span>{proj.name}</span>
                            <span className="text-[7.5px] font-mono font-normal text-slate-500">{proj.url}</span>
                          </div>
                          <div className="text-[8px] font-semibold italic" style={{ color: ACCENT_COLORS[accent].hex }}>
                            {proj.tech}
                          </div>
                          <p className="text-[8px] text-slate-600 leading-relaxed">{proj.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Skills</h4>
                    <div className="space-y-1 text-[8px] leading-relaxed">
                      <div>
                        <span className="font-bold text-slate-500 inline-block w-24">Languages:</span>
                        <span className="text-slate-700">{skills.languages || "None"}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 inline-block w-24">Frameworks:</span>
                        <span className="text-slate-700">{skills.frameworks || "None"}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 inline-block w-24">Tools:</span>
                        <span className="text-slate-700">{skills.tools || "None"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[8.5px] font-extrabold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-0.5">Education</h4>
                    <div className="space-y-2">
                      {education.map(ed => (
                        <div key={ed.id} className="space-y-0.5">
                          <div className="flex justify-between items-baseline font-bold text-slate-800 text-[8.5px]">
                            <span>{ed.school}</span>
                            <span className="text-[7.5px] font-mono font-normal text-slate-500">{ed.dates}</span>
                          </div>
                          <p className="text-[8px] text-slate-600">{ed.degree}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
