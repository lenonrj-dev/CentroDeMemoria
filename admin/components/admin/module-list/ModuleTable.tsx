"use client";

import Link from "next/link";
import type { ModuleKey, RowActionHandler, ListItem } from "./types";
import { getPublicRoutes } from "../../../lib/public-site";
import { formatDate, getItemId, statusLabel, statusTone } from "./utils";

export function ModuleTable({
  module,
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onAction,
}: {
  module: ModuleKey;
  items: ListItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string, checked: boolean) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onAction: RowActionHandler;
}) {
  const allChecked = items.length > 0 && items.every((it) => selectedIds.has(getItemId(it)));
  const someChecked = items.some((it) => selectedIds.has(getItemId(it))) && !allChecked;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-[940px] w-full text-left text-sm">
          <thead className="bg-black/30 text-xs text-white/60">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="h-4 w-4 accent-white"
                  aria-label="Selecionar todos"
                />
              </th>
              <th className="px-4 py-3">Prévia</th>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Aparece em</th>
              <th className="px-4 py-3">Última edição</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
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
              const tagText = (it.tags || []).slice(0, 2).join(", ");
              return (
                <tr key={id} className="hover:bg-white/[0.04]">
                  <td className="px-4 py-3 align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(id)}
                      onChange={(e) => onToggleSelect(id, e.target.checked)}
                      className="mt-1 h-4 w-4 accent-white"
                      aria-label={`Selecionar ${it.title}`}
                    />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="h-12 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      {it.coverImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.coverImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="min-w-0">
                      <div className="line-clamp-1 font-medium text-white/90">{it.title || "(sem título)"}</div>
                      <div className="mt-1 line-clamp-1 text-xs text-white/50">{tagText || it.slug || ""}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs " +
                        (tone === "emerald"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                          : tone === "amber"
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
                            : "border-white/10 bg-white/5 text-white/70")
                      }
                    >
                      {statusLabel(it.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-top">
                    {routes.length ? (
                      <div className="flex flex-wrap gap-1">
                        {routes.slice(0, 2).map((r) => (
                          <a
                            key={r.path}
                            href={r.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/75 hover:bg-white/15"
                          >
                            {r.path}
                          </a>
                        ))}
                        {routes.length > 2 ? <span className="text-[11px] text-white/45">+{routes.length - 2}</span> : null}
                      </div>
                    ) : (
                      <span className="text-xs text-white/40">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs text-white/60">{formatDate(it.updatedAt || it.createdAt || null) || "—"}</div>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <div className="inline-flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onAction("preview", it)}
                        className="rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
                      >
                        Preview
                      </button>
                      <Link
                        href={`/admin/${module}/${id}`}
                        className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
                      >
                        Editar
                      </Link>
                      {it.status !== "published" ? (
                        <button
                          type="button"
                          onClick={() => onAction("publish", it)}
                          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-50 hover:bg-emerald-500/15"
                        >
                          Publicar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onAction("archive", it)}
                          className="rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
                        >
                          Arquivar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onAction("delete", it)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-50 hover:bg-red-500/15"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
