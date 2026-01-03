"use client";

import { useMemo, useState } from "react";
import type { AdminModule } from "../../../lib/public-site";
import { getPublicRoutes } from "../../../lib/public-site";
import { getModuleMap } from "../../../lib/site-map";
import { CardPreview, Pill, ReadingPreview, type AnyContent } from "../previews/ContentPreviews";

type Tab = "card" | "reading" | "placement";

export function ContentPreviewPanel({
  module,
  item,
}: {
  module: AdminModule;
  item: AnyContent;
}) {
  const [tab, setTab] = useState<Tab>("card");
  const [cardSize, setCardSize] = useState<"sm" | "lg">("sm");
  const routes = useMemo(
    () =>
      item.slug
        ? getPublicRoutes(module, {
            slug: item.slug,
            tags: item.tags || [],
            relatedFundKey: item.relatedFundKey,
            relatedPersonSlug: item.relatedPersonSlug,
          })
        : [],
    [item.slug, item.tags, item.relatedFundKey, item.relatedPersonSlug, module]
  );
  const map = useMemo(() => getModuleMap(module), [module]);

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/90">Preview</div>
          <div className="mt-1 text-xs text-white/60">Simulação fiel do card e da leitura no site.</div>
        </div>
        <div className="inline-flex overflow-hidden rounded-xl border border-white/10">
          {(
            [
              { id: "card", label: "Card" },
              { id: "reading", label: "Leitura" },
              { id: "placement", label: "Onde aparece" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={"px-3 py-2 text-xs " + (tab === t.id ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5")}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "card" ? (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="text-xs text-white/60">Tamanho do card</div>
            <div className="inline-flex overflow-hidden rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setCardSize("sm")}
                className={"px-3 py-1.5 text-xs " + (cardSize === "sm" ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5")}
              >
                Pequeno
              </button>
              <button
                type="button"
                onClick={() => setCardSize("lg")}
                className={"px-3 py-1.5 text-xs " + (cardSize === "lg" ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5")}
              >
                Grande
              </button>
            </div>
          </div>
          <CardPreview module={module} item={item} size={cardSize} />
        </div>
      ) : null}

      {tab === "reading" ? (
        <div className="mt-4">
          <ReadingPreview module={module} item={item} />
        </div>
      ) : null}

      {tab === "placement" ? (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-white/90">Aparece em</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {routes.length ? routes.map((r) => <Pill key={r.path}>{r.path}</Pill>) : <span className="text-sm text-white/60">Defina tags/slug para calcular.</span>}
            </div>
          </div>
          {map ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Como aparece no site (por módulo)</div>
              <ul className="mt-3 space-y-2">
                {map.placements.map((p) => (
                  <li key={p.path} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-white/90">{p.label}</div>
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-white/70 underline underline-offset-2">
                        Abrir página
                      </a>
                    </div>
                    <div className="mt-1 text-xs text-white/55">{p.displayType}</div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-[11px] text-white/55">Campos do card</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.cardFields.map((f) => (
                            <Pill key={f}>{f}</Pill>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-white/55">Campos da leitura</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {p.readingFields.map((f) => (
                            <Pill key={f}>{f}</Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
