"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { Attachment, ContentStatus, ReferenceContent } from "../../../lib/backend-types";
import { useAdminAuth } from "../AdminAuthProvider";
import { slugify } from "../../../lib/slugify";
import { joinCsv, moveItem, splitCsv } from "./common";

type Props = { id?: string };

const empty: Partial<ReferenceContent> = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  status: "draft",
  tags: [],
  featured: false,
  sortOrder: 0,
  citation: "",
  authors: [],
  year: new Date().getFullYear(),
  publisher: "",
  isbn: "",
  externalUrl: "",
  attachments: [],
};

const attachmentEmpty: Attachment = { type: "link", url: "", label: "" };

export default function ReferenceForm({ id }: Props) {
  const { token } = useAdminAuth();
  const [data, setData] = useState<Partial<ReferenceContent>>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverPreviewSize, setCoverPreviewSize] = useState<{ w: number; h: number }>({ w: 520, h: 160 });

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const coverPreviewW = clamp(coverPreviewSize.w, 240, 820);
  const coverPreviewH = clamp(coverPreviewSize.h, 120, 520);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cmodrm_admin_cover_preview_size_form");
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
      localStorage.setItem("cmodrm_admin_cover_preview_size_form", JSON.stringify({ w: coverPreviewW, h: coverPreviewH }));
    } catch {
      // ignore
    }
  }, [coverPreviewH, coverPreviewW]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<ReferenceContent>(`/api/admin/referencias/${id}`, token || undefined);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Falha ao carregar");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const attachments = data.attachments ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);
  const authorsCsv = useMemo(() => joinCsv(data.authors), [data.authors]);

  const setField = <K extends keyof ReferenceContent>(key: K, value: ReferenceContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (status: ContentStatus) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        status,
        tags: data.tags ?? [],
        featured: !!data.featured,
        sortOrder: Number(data.sortOrder ?? 0),
        citation: data.citation,
        authors: data.authors ?? [],
        year: Number(data.year),
        publisher: data.publisher || undefined,
        isbn: data.isbn || undefined,
        externalUrl: data.externalUrl || undefined,
        attachments: (data.attachments ?? []).filter((a) => a.url),
      };

      if (id) {
        await apiPatch<ReferenceContent>(`/api/admin/referencias/${id}`, payload, token || undefined);
      } else {
        await apiPost<ReferenceContent>("/api/admin/referencias", payload, token || undefined);
      }
      window.location.href = "/admin/referencias";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-white/70">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{id ? "Editar referência" : "Nova referência"}</h1>
          <p className="mt-1 text-sm text-white/70">Citação + autores + anexos por link.</p>
        </div>
        <Link href="/admin/referencias" className="text-sm text-white/70 hover:text-white">
          Voltar
        </Link>
      </div>

      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          <label className="block text-sm text-white/70">
            Título
            <input
              value={data.title ?? ""}
              onChange={(e) => {
                const title = e.target.value;
                setField("title", title as any);
                if (!slugTouched) setField("slug", slugify(title) as any);
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

          <label className="block text-sm text-white/70">
            Slug
            <input
              value={data.slug ?? ""}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", e.target.value as any);
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </label>

          <label className="block text-sm text-white/70">
            Descrição
            <textarea
              value={data.description ?? ""}
              onChange={(e) => setField("description", e.target.value as any)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

          <label className="block text-sm text-white/70">
            Citação (texto pronto)
            <textarea
              value={data.citation ?? ""}
              onChange={(e) => setField("citation", e.target.value as any)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Autores (csv)
              <input
                value={authorsCsv}
                onChange={(e) => setField("authors", splitCsv(e.target.value) as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Nome 1, Nome 2"
              />
            </label>
            <label className="block text-sm text-white/70">
              Ano
              <input
                value={String(data.year ?? "")}
                onChange={(e) => setField("year", Number(e.target.value) as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                inputMode="numeric"
                required
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Editora (opcional)
              <input
                value={data.publisher ?? ""}
                onChange={(e) => setField("publisher", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </label>
            <label className="block text-sm text-white/70">
              ISBN (opcional)
              <input
                value={data.isbn ?? ""}
                onChange={(e) => setField("isbn", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </label>
          </div>

          <label className="block text-sm text-white/70">
            externalUrl (opcional)
            <input
              value={data.externalUrl ?? ""}
              onChange={(e) => setField("externalUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://..."
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">Anexos (opcional)</div>
              <button
                type="button"
                onClick={() => setField("attachments", [...attachments, { ...attachmentEmpty }] as any)}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              >
                Adicionar
              </button>
            </div>
            <div className="mt-3 space-y-3">
              {attachments.map((a, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                    <select
                      value={a.type}
                      onChange={(e) => {
                        const next = attachments.slice();
                        next[idx] = { ...a, type: e.target.value as any };
                        setField("attachments", next as any);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    >
                      <option value="link">Link</option>
                      <option value="pdf">PDF</option>
                      <option value="image">Imagem</option>
                    </select>
                    <input
                      value={a.url}
                      onChange={(e) => {
                        const next = attachments.slice();
                        next[idx] = { ...a, url: e.target.value };
                        setField("attachments", next as any);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="https://..."
                    />
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
                    <input
                      value={a.label ?? ""}
                      onChange={(e) => {
                        const next = attachments.slice();
                        next[idx] = { ...a, label: e.target.value };
                        setField("attachments", next as any);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="Rótulo (opcional)"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => setField("attachments", moveItem(attachments, idx, idx - 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5 disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === attachments.length - 1}
                      onClick={() => setField("attachments", moveItem(attachments, idx, idx + 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5 disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setField("attachments", attachments.filter((_, i) => i !== idx) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-4">
          <label className="block text-sm text-white/70">
            coverImageUrl
            <input
              value={data.coverImageUrl ?? ""}
              onChange={(e) => setField("coverImageUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://res.cloudinary.com/.../image.jpg"
              required
            />
          </label>

          <label className="block text-sm text-white/70">
            Tags (csv)
            <input
              value={tagsCsv}
              onChange={(e) => setField("tags", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Dom Waldyr, Ditadura"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={!!data.featured}
              onChange={(e) => setField("featured", e.target.checked as any)}
              className="h-4 w-4 accent-white"
            />
            Destaque
          </label>

          <label className="block text-sm text-white/70">
            sortOrder
            <input
              value={String(data.sortOrder ?? 0)}
              onChange={(e) => setField("sortOrder", Number(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              inputMode="numeric"
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-semibold text-white/90">Preview</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-white/60">
                Largura: {coverPreviewW}px
                <input
                  type="range"
                  min={240}
                  max={820}
                  step={20}
                  value={coverPreviewW}
                  onChange={(e) => setCoverPreviewSize((s) => ({ ...s, w: Number(e.target.value) }))}
                  className="mt-2 w-full accent-white/80"
                />
              </label>
              <label className="text-xs text-white/60">
                Altura: {coverPreviewH}px
                <input
                  type="range"
                  min={120}
                  max={520}
                  step={20}
                  value={coverPreviewH}
                  onChange={(e) => setCoverPreviewSize((s) => ({ ...s, h: Number(e.target.value) }))}
                  className="mt-2 w-full accent-white/80"
                />
              </label>
            </div>
            <div className="mt-3 space-y-2">
              {data.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.coverImageUrl}
                  alt={data.title || "cover"}
                  className="mx-auto w-full rounded-2xl border border-white/10 bg-black/40 object-cover"
                  style={{ maxWidth: coverPreviewW, height: coverPreviewH }}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">Sem cover</div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5 disabled:opacity-60"
            >
              Salvar rascunho
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-60"
            >
              Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
