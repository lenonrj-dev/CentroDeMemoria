"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const DEFAULT_WHERE =
  "Exibido nas listas do admin e nas páginas públicas relacionadas a este item quando publicado.";
const DEFAULT_EXAMPLE = "Ex.: Carta do sindicato (1980).";

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();

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

const buildHelp = (label: string, placeholder?: string | null) => {
  const example = placeholder && placeholder.trim() ? placeholder.trim() : DEFAULT_EXAMPLE;
  return {
    purpose: `Preencha o campo ${label} para identificar o item.`,
    where: DEFAULT_WHERE,
    example,
  };
};

export function AdminHelpLayer() {
  const pathname = usePathname();

  useEffect(() => {
    let counter = 0;
    const labels = Array.from(document.querySelectorAll("label"));
    labels.forEach((label) => {
      if (label.dataset.adminHelpApplied) return;
      let raw = "";
      label.childNodes.forEach((node) => {
        if (raw) return;
        if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
          raw = node.textContent;
        }
      });
      if (!raw) raw = label.textContent || "";
      const labelText = normalizeText(raw);
      if (!labelText) return;
      const input = label.querySelector("input, textarea, select") as HTMLElement | null;
      const placeholder = input?.getAttribute("placeholder");
      const helpText = buildHelp(labelText, placeholder);
      const tooltip = document.createElement("div");
      const id = `admin-help-${counter++}`;
      tooltip.setAttribute("role", "tooltip");
      tooltip.setAttribute("id", id);
      tooltip.className =
        "pointer-events-none absolute left-0 top-[calc(100%+6px)] z-30 w-64 max-w-[90vw] rounded-2xl border border-slate-700/70 bg-slate-950/95 p-3 text-[11px] leading-relaxed text-slate-200 shadow-xl opacity-0 -translate-y-1 transition space-y-2 " +
        "group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0";
      const sections: Array<{ title: string; body: string }> = [
        { title: "Para que serve", body: helpText.purpose },
        { title: "Onde aparece", body: helpText.where },
        { title: "Exemplo", body: helpText.example },
      ];
      sections.forEach((section) => {
        const block = document.createElement("div");
        block.className = "space-y-2";
        const title = document.createElement("div");
        title.className = "text-[10px] uppercase tracking-[0.2em] text-slate-400";
        title.textContent = section.title;
        const paragraphs = splitParagraphs(section.body);
        block.appendChild(title);
        paragraphs.forEach((paragraph) => {
          const body = document.createElement("p");
          body.className = "text-slate-100 leading-relaxed";
          body.textContent = paragraph;
          block.appendChild(body);
        });
        tooltip.appendChild(block);
      });
      label.classList.add("group", "relative");
      label.appendChild(tooltip);
      if (input) {
        const existing = input.getAttribute("aria-describedby");
        input.setAttribute("aria-describedby", existing ? `${existing} ${id}` : id);
      }
      label.dataset.adminHelpApplied = "true";
    });
  }, [pathname]);

  return null;
}
