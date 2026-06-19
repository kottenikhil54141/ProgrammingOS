"use client";

import { useState } from "react";
import { Copy, Check, Terminal, Code2 } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

interface Block {
  type: "h3" | "h4" | "code" | "ul" | "p";
  content: string | string[];
  language?: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Parse markdown content into structural blocks
  const parseMarkdown = (text: string): Block[] => {
    const lines = text.split("\n");
    const blocks: Block[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.trim().startsWith("```")) {
        const lang = line.trim().slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }
        blocks.push({
          type: "code",
          content: codeLines.join("\n"),
          language: lang || "code",
        });
        i++;
        continue;
      }

      // Headers
      if (line.startsWith("### ")) {
        blocks.push({
          type: "h3",
          content: line.slice(4).trim(),
        });
        i++;
        continue;
      }

      if (line.startsWith("#### ")) {
        blocks.push({
          type: "h4",
          content: line.slice(5).trim(),
        });
        i++;
        continue;
      }

      // Unordered lists
      if (line.trim().startsWith("- ")) {
        const listItems: string[] = [];
        while (i < lines.length && lines[i].trim().startsWith("- ")) {
          listItems.push(lines[i].trim().slice(2).trim());
          i++;
        }
        blocks.push({
          type: "ul",
          content: listItems,
        });
        continue;
      }

      // Paragraphs (skip empty lines, join consecutive non-empty lines)
      if (line.trim() === "") {
        i++;
        continue;
      }

      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !lines[i].trim().startsWith("```") &&
        !lines[i].startsWith("### ") &&
        !lines[i].startsWith("#### ") &&
        !lines[i].trim().startsWith("- ")
      ) {
        paraLines.push(lines[i].trim());
        i++;
      }
      blocks.push({
        type: "p",
        content: paraLines.join(" "),
      });
    }

    return blocks;
  };

  const renderInlineText = (text: string) => {
    // Splits by **bold** and `inline code`
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-bold text-text">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={index}
            className="font-mono text-xs font-semibold bg-[#7C5CFF]/10 text-[#A78BFF] border border-[#7C5CFF]/20 px-1.5 py-0.5 rounded"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const blocks = parseMarkdown(content);

  return (
    <div className="space-y-5 font-sans leading-relaxed text-text/85">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h3":
            return (
              <h3
                key={idx}
                className="text-base font-black text-text tracking-tight mt-6 mb-3 flex items-center gap-2 border-b border-border-subtle pb-2 first:mt-0"
              >
                {renderInlineText(block.content as string)}
              </h3>
            );
          case "h4":
            return (
              <h4
                key={idx}
                className="text-xs font-bold uppercase tracking-wider text-[#A78BFF] mt-4 mb-2"
              >
                {renderInlineText(block.content as string)}
              </h4>
            );
          case "ul":
            return (
              <ul key={idx} className="space-y-2.5 my-3 pl-1">
                {(block.content as string[]).map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-xs text-text/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFF] shrink-0 mt-1.5" />
                    <span className="flex-1">{renderInlineText(item)}</span>
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <CodeBlock
                key={idx}
                code={block.content as string}
                language={block.language}
              />
            );
          case "p":
          default:
            return (
              <p key={idx} className="text-xs leading-relaxed text-text/75">
                {renderInlineText(block.content as string)}
              </p>
            );
        }
      })}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-2xl border border-border-subtle bg-surface/50 overflow-hidden shadow-inner my-4">
      {/* Code Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-surface/30 border-b border-border-subtle/50">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[#7C5CFF]" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
            {language || "code"}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-lg bg-surface/20 hover:bg-surface/50 border border-border-subtle px-2 py-1 text-[10px] text-muted transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto">
        <pre className="font-mono text-xs text-text/90 leading-relaxed whitespace-pre select-text">
          {code}
        </pre>
      </div>
    </div>
  );
}
