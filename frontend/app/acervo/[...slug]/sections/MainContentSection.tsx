"use client";

import { useState } from "react";
import type { AcervoItem } from "../../api";
import StudyModal from "@/components/viewer/StudyModal";

export function MainContentSection({ item }: { item: AcervoItem }) {
  const [viewer, setViewer] = useState<{ label: string; url: string } | null>(null);

  return (
    <article className="lg:col-span-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white sm:text-xl">Resumo</h2>
        <p className="mt-2 leading-relaxed text-white/80">{item.summary}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-white sm:text-xl">Leitura</h2>
        <div className="prose prose-invert mt-2 max-w-none text-white/80">
          {item.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {item.files?.length > 0 && (
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white sm:text-xl">Materiais para consulta</h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {item.files.map((f, i) => (
              <li key={i}>
                {f.url && f.url !== "#" ? (
                  <button
                    type="button"
                    onClick={() => setViewer({ label: f.label, url: f.url })}
                    className="inline-flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    <span className="truncate">{f.label}</span>
                    <span className="text-xs text-white/60">Visualizar</span>
                  </button>
                ) : (
                  <div className="inline-flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/60">
                    <span className="truncate">{f.label}</span>
                    <span className="text-xs">Indisponivel</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <StudyModal
        open={Boolean(viewer)}
        onClose={() => setViewer(null)}
        title={viewer?.label || "Documento"}
        src={viewer?.url || ""}
      />
    </article>
  );
}
