"use client";

import Link from "next/link";
import type { ModuleKey, RowActionHandler, ListItem } from "./types";
import { getPublicRoutes } from "../../../lib/public-site";
import { formatDate, getItemId, statusLabel, statusTone } from "./utils";

export function ModuleCards({
  module,
  items,
  selectedIds,
  onToggleSelect,
  onAction,
}: {
  module: ModuleKey;
  items: ListItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string, checked: boolean) => void;
  onAction: RowActionHandler;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((it) => {
        const id = getItemId(it);
        const routes = it.slug
          ? getPublicRoutes(module, {
              slug: it.slug,
              tags: (it.tags as any) || [],
              relatedFundKey: (it as any).relatedFundKey,
              relatedPersonSlug: (it as any).relatedPersonSlug,
            })
          : [];
        const tone = statusTone(it.status);
        return (
          <div key={id} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <div className="relative">
              <div className="h-36 w-full bg-black/40">
                {it.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={it.coverImageUrl} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="absolute left-3 top-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.has(id)}
                  onChange={(e) => onToggleSelect(id, e.target.checked)}
                  className="h-4 w-4 accent-white"
                  aria-label={`Selecionar ${it.title}`}
                />
                <span
                  className={
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] " +
                    (tone === "emerald"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                      : tone === "amber"
                        ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
                        : "border-white/10 bg-white/5 text-white/70")
                  }
                >
                  {statusLabel(it.status)}
                </span>
                {it.featured ? (
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                    Destaque
                  </span>
                ) : null}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="line-clamp-1 text-sm font-semibold text-white/90">{it.title || "(sem título)"}</div>
                  <div className="mt-1 text-xs text-white/55">{formatDate(it.updatedAt || it.createdAt || null) || "—"}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onAction("preview", it)}
                  className="shrink-0 rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
                >
                  Preview
                </button>
              </div>

              <div className="mt-3 line-clamp-2 text-sm text-white/70">{it.description || "—"}</div>

              {(it.tags || []).length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {(it.tags || []).slice(0, 6).map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-3">
                <div className="text-[11px] text-white/55">Aparece em:</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {routes.length ? (
                    routes.slice(0, 2).map((r) => (
                      <a
                        key={r.path}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/75 hover:bg-white/15"
                      >
                        {r.path}
                      </a>
                    ))
                  ) : (
                    <span className="text-xs text-white/40">—</span>
                  )}
                  {routes.length > 2 ? <span className="text-xs text-white/45">+{routes.length - 2}</span> : null}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/admin/${module}/${id}`}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
                >
                  Editar
                </Link>
                {it.status !== "published" ? (
                  <button
                    type="button"
                    onClick={() => onAction("publish", it)}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-50 hover:bg-emerald-500/15"
                  >
                    Publicar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onAction("archive", it)}
                    className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                  >
                    Arquivar
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onAction("delete", it)}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-50 hover:bg-red-500/15"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
