"use client";

import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";

export type FieldHelp = {
  what: string;
  where: string;
  example: string;
};

type Props = {
  help: FieldHelp;
  label: string;
  align?: "start" | "end";
};

const normalizeHelpText = (value: string) =>
  value
    .replace(/\r\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/(^|\s)\/n(\s|$)/g, "$1\n$2");

const splitParagraphs = (value: string) =>
  normalizeHelpText(value)
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

export function FieldHelpTooltip({ help, label, align = "start" }: Props) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const openTip = () => setOpen(true);
  const closeTip = () => setOpen(false);

  return (
    <div ref={ref} className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={`Ajuda para ${label}`}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={openTip}
        onMouseLeave={closeTip}
        onFocus={openTip}
        onBlur={closeTip}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/60 text-[11px] text-slate-300 hover:border-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50"
      >
        ?
      </button>
      <div
        id={id}
        role="tooltip"
        className={clsx(
          "pointer-events-none absolute z-20 w-64 rounded-2xl border border-slate-700/60 bg-slate-950/95 p-3 text-xs text-slate-200 shadow-xl transition",
          open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1",
          align === "end" ? "right-0 mt-2" : "left-0 mt-2"
        )}
      >
        <div className="space-y-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Para que serve</div>
            <div className="space-y-2 text-slate-100">
              {splitParagraphs(help.what).map((paragraph, index) => (
                <p key={`what-${index}`} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Onde aparece</div>
            <div className="space-y-2 text-slate-100">
              {splitParagraphs(help.where).map((paragraph, index) => (
                <p key={`where-${index}`} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Exemplo</div>
            <div className="space-y-2 text-slate-100">
              {splitParagraphs(help.example).map((paragraph, index) => (
                <p key={`example-${index}`} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
