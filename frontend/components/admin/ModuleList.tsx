"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPatch } from "../../lib/backend-client";
import { useAdminAuth } from "./AdminAuthProvider";
import type { BaseContent, ContentStatus, PaginatedMeta } from "../../lib/backend-types";

type Props = {
  module: "documentos" | "depoimentos" | "referencias" | "jornais" | "acervo-fotografico";
  title: string;
};

type ListResponse = { success: true; data: BaseContent[]; meta?: PaginatedMeta };

const STATUS_OPTIONS: Array<{ value: "" | ContentStatus; label: string }> = [
  { value: "", label: "Todos" },
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
];

export default function ModuleList({ module, title }: Props) {
  const { token } = useAdminAuth();
  const [items, setItems] = useState<BaseContent[]>([]);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"" | ContentStatus>("");
  const [tag, setTag] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<BaseContent | null>(null);
  const [coverPreviewSize, setCoverPreviewSize] = useState<{ w: number; h: number }>({ w: 56, h: 56 });

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const coverW = clamp(coverPreviewSize.w, 40, 220);
  const coverH = clamp(coverPreviewSize.h, 40, 220);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cmodrm_admin_cover_preview_size");
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (
        parsed &&
        typeof parsed === "object" &&
        "w" in parsed &&
        "h" in parsed &&
        typeof (parsed as any).w === "number" &&
        typeof (parsed as any).h === "number"
      ) {
        setCoverPreviewSize({ w: (parsed as any).w, h: (parsed as any).h });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cmodrm_admin_cover_preview_size", JSON.stringify({ w: coverW, h: coverH }));
    } catch {
      // ignore
    }
  }, [coverH, coverW]);

  const qs = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "12");
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (tag.trim()) params.set("tag", tag.trim());
    return params.toString();
  }, [page, q, status, tag]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiGet<BaseContent[]>(`/api/admin/${module}?${qs}`, token || undefined);
        if (!cancelled) {
          setItems(res.data);
          setMeta(res.meta ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Falha ao carregar");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [module, qs, token]);

  useEffect(() => {
    if (!preview) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreview(null);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev || "";
    };
  }, [preview]);

  const onDelete = async (id: string) => {
    if (!confirm("Excluir este item?")) return;
    await apiDelete<{ id: string }>(`/api/admin/${module}/${id}`, token || undefined);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  const onStatus = async (id: string, next: ContentStatus) => {
    const res = await apiPatch<BaseContent>(`/api/admin/${module}/${id}/status`, { status: next }, token || undefined);
    setItems((prev) => prev.map((i) => (i._id === id ? (res.data as any) : i)));
  };

  const canPrev = meta?.hasPrev ?? page > 1;
  const canNext = meta?.hasNext ?? false;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="mt-1 text-sm text-white/70">Gerencie itens: rascunhos, publicação e arquivos.</p>
        </div>
        <Link
          href={`/admin/${module}/new`}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
        >
          Novo
        </Link>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
        <label className="text-sm text-white/70">
          Busca
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Título ou descrição"
          />
        </label>
        <label className="text-sm text-white/70">
          Status
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as any);
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.label} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-white/70">
          Tag
          <input
            value={tag}
            onChange={(e) => {
              setPage(1);
              setTag(e.target.value);
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="ex.: Volta Redonda"
          />
        </label>
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => {
              setQ("");
              setStatus("");
              setTag("");
              setPage(1);
            }}
            className="w-full rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            Limpar
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white/90">Preview do cover</div>
            <div className="mt-0.5 text-xs text-white/60">Ajusta apenas o tamanho visual dos cards (não altera o arquivo).</div>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:grid-cols-2 sm:gap-4">
            <label className="text-xs text-white/60">
              Largura: {coverW}px
              <input
                type="range"
                min={40}
                max={220}
                step={8}
                value={coverW}
                onChange={(e) => setCoverPreviewSize((s) => ({ ...s, w: Number(e.target.value) }))}
                className="mt-2 w-full accent-white/80 sm:w-56"
              />
            </label>
            <label className="text-xs text-white/60">
              Altura: {coverH}px
              <input
                type="range"
                min={40}
                max={220}
                step={8}
                value={coverH}
                onChange={(e) => setCoverPreviewSize((s) => ({ ...s, h: Number(e.target.value) }))}
                className="mt-2 w-full accent-white/80 sm:w-56"
              />
            </label>
          </div>
        </div>
      </div>

      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Carregando...</div>
        )}
        {!loading && items.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Nenhum item.</div>
        )}

        {items.map((item) => (
          <div key={item._id} className="group rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
            <div className="flex items-start gap-3">
              <div
                className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/40"
                style={{ width: coverW, height: coverH }}
              >
                {item.coverImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.coverImageUrl} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[11px] text-white/50">Sem midia</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="line-clamp-1 text-sm font-semibold text-white/90">{item.title}</div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">{item.status}</span>
                  <span className="truncate">{item.slug}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 line-clamp-2 text-sm text-white/70">{item.description}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPreview(item)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
              >
                Preview
              </button>
              <Link
                href={`/admin/${module}/${item._id}`}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              >
                Editar
              </Link>
              <button
                type="button"
                onClick={() => onDelete(item._id)}
                className="rounded-lg border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
              >
                Excluir
              </button>
              {item.status !== "published" ? (
                <button
                  type="button"
                  onClick={() => onStatus(item._id, "published")}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200 hover:bg-emerald-500/15"
                >
                  Publicar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onStatus(item._id, "archived")}
                  className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs text-amber-200 hover:bg-amber-500/15"
                >
                  Arquivar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={!canPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Anterior
        </button>
        <div className="text-sm text-white/60">
          Página {meta?.page ?? page} de {meta?.totalPages ?? "…"}
        </div>
        <button
          type="button"
          disabled={!canNext}
          onClick={() => setPage((p) => p + 1)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPreview(null);
          }}
        >
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">{preview.title}</div>
                <div className="mt-1 text-xs text-white/60">{preview.slug}</div>
              </div>
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10"
              >
                Fechar
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              {preview.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.coverImageUrl} alt={preview.title} className="h-56 w-full rounded-2xl object-cover" />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-2xl border border-white/10 bg-black/40 text-xs text-white/60">
                  Sem midia
                </div>
              )}
              <p className="text-sm text-white/70">{preview.description}</p>
              {preview.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {preview.tags.map((t) => (
                    <span key={t} className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
