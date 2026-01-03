"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../../lib/backend-client";
import type { NormalizedApiError } from "../../../lib/api-errors";
import { getPublicRoutes } from "../../../lib/public-site";
import type { AdminModule } from "../../../lib/public-site";
import { getModuleMap } from "../../../lib/site-map";
import { Modal } from "../Modal";
import { CardPreview, Pill, ReadingPreview, type AnyContent } from "../previews/ContentPreviews";
import { FormErrorSummary } from "../forms/FormErrorSummary";
import { useApiErrorHandler } from "../useApiErrorHandler";
import type { ModuleKey } from "./types";

type Tab = "card" | "reading" | "placement";

export function ContentPreviewModal({
  open,
  module,
  itemId,
  token,
  onClose,
}: {
  open: boolean;
  module: ModuleKey;
  itemId: string | null;
  token: string | null;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("card");
  const [cardSize, setCardSize] = useState<"sm" | "lg">("sm");
  const [item, setItem] = useState<AnyContent | null>(null);
  const [routes, setRoutes] = useState<ReturnType<typeof getPublicRoutes>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);
  const map = useMemo(() => getModuleMap(module), [module]);
  const handleApiError = useApiErrorHandler();

  useEffect(() => {
    if (!open) return;
    setTab("card");
  }, [open]);

  useEffect(() => {
    if (!open || !itemId || !token) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiGet<AnyContent>(`/api/admin/${module}/${itemId}`, token || undefined);
        if (cancelled) return;
        setItem(res.data);
        setRoutes(
          res.data.slug
            ? getPublicRoutes(module, {
                slug: res.data.slug,
                tags: res.data.tags || [],
                relatedFundKey: res.data.relatedFundKey,
                relatedPersonSlug: res.data.relatedPersonSlug,
              })
            : []
        );
      } catch (err) {
        if (!cancelled) setError(handleApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [itemId, module, open, token]);

  return (
    <Modal open={open} title={item?.title ? `Preview: ${item.title}` : "Preview"} onClose={onClose} size="xl">
      {error ? (
        <FormErrorSummary error={error} />
      ) : loading || !item ? (
        <div className="text-sm text-white/70">{loading ? "Carregando..." : "Sem dados"}</div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <div className="space-y-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Ações</div>
              <div className="mt-3 grid gap-2">
                <Link
                  href={`/admin/${module}/${itemId}`}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
                >
                  Abrir editor
                </Link>
                {item.status === "published" && routes[0] ? (
                  <a
                    href={routes[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white/85 hover:bg-white/5"
                  >
                    Abrir no site
                  </a>
                ) : (
                  <span className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white/45">(publique para abrir no site)</span>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">Tabs</div>
              <div className="mt-3 grid gap-2">
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
                    className={
                      "rounded-xl border px-3 py-2 text-sm text-white " +
                      (tab === t.id ? "border-white/20 bg-white/10" : "border-white/10 bg-transparent text-white/75 hover:bg-white/5")
                    }
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {tab === "card" ? (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/60">Tamanho do card</div>
                <div className="mt-3 inline-flex overflow-hidden rounded-xl border border-white/10">
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
            ) : null}
          </div>

          <div className="min-w-0">
            {tab === "card" ? <CardPreview module={module} item={item} size={cardSize} /> : null}
            {tab === "reading" ? <ReadingPreview module={module} item={item} /> : null}
            {tab === "placement" ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold text-white/90">Aparece em</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {routes.length ? (
                      routes.map((r) => (
                        <a
                          key={r.path}
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                        >
                          {r.path}
                        </a>
                      ))
                    ) : (
                      <span className="text-sm text-white/60">Defina slug e tags para calcular rotas.</span>
                    )}
                  </div>
                </div>

                {map ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm font-semibold text-white/90">Como aparece no site (por módulo)</div>
                    <ul className="mt-4 space-y-2">
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
        </div>
      )}
    </Modal>
  );
}
