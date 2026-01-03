"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import type { ReferenciaCardProps } from "../types";

export function ReferenciaCard({ title, authors, year, type, source, citation }: ReferenciaCardProps) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(citation).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/20">
      <div className="flex items-center gap-2 text-[11px] text-white/60">
        <span className="rounded-lg border border-white/10 bg-black/30 px-2 py-1">{type}</span>
        <span>{year}</span>
      </div>
      <h3 className="mt-2 text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/70">{authors}</p>
      <p className="mt-1 text-xs text-white/60">{source}</p>
      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
        >
          <Copy className="h-4 w-4" />
          {copied ? "Copiado" : "Copiar citação"}
        </button>
      </div>
    </article>
  );
}
