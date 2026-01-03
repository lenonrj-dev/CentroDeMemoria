"use client";

import { isValidElement } from "react";
import type { ReactNode } from "react";
import { Copy } from "lucide-react";

type KVRowOptions = {
  copyable?: boolean;
  monospace?: boolean;
  title?: string;
};

type KVRow = Array<any>;

type KVTableProps = {
  rows?: KVRow[];
  compact?: boolean;
  className?: string;
  onCopy?: (key: string, value: string) => void;
};

export default function KVTable({ rows = [], compact = false, className = "", onCopy }: KVTableProps) {
  const formatVal = (value: ReactNode) => {
    if (value == null) return "-";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "object" && !isValidElement(value)) {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return value;
  };

  const handleCopy = async (key: string, rawVal: ReactNode) => {
    const text = typeof rawVal === "string" ? rawVal : String(formatVal(rawVal));
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      onCopy?.(key, text);
      alert("Valor copiado!");
    } catch {
      alert("Nao foi possivel copiar.");
    }
  };

  if (!rows?.length) {
    return <div className="text-sm text-gray-400">Sem dados.</div>;
  }

  return (
    <div className={`grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2 ${className}`}>
      {rows.map((row, idx) => {
        const [k, v, opts = {}] = row;
        const { copyable = false, monospace = false, title } = opts || {};
        const valueToRender = isValidElement(v) ? v : formatVal(v);
        const displayTitle = title ?? (typeof valueToRender === "string" ? valueToRender : undefined);

        return (
          <div
            key={`${k}-${idx}`}
            className={`flex items-center justify-between gap-4 border-b border-white/10 ${compact ? "py-0.5" : "py-1"}`}
          >
            <span className="text-gray-400">{k}</span>

            <span
              className={`truncate text-right text-gray-100 ${monospace ? "font-mono" : ""}`}
              title={displayTitle}
            >
              {valueToRender}
            </span>

            {copyable && !isValidElement(v) && (
              <button
                onClick={() => handleCopy(k, v)}
                className="ml-1 shrink-0 rounded p-1 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label={`Copiar valor de ${k}`}
                title="Copiar valor"
              >
                <Copy className="h-4 w-4 text-gray-300" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
