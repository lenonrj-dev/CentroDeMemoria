"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { ContentStatus, DocumentContent } from "../../../lib/backend-types";
import { useAdminAuth } from "../AdminAuthProvider";
import { slugify } from "../../../lib/slugify";
import { joinCsv, splitCsv } from "./common";
import StudyModal from "../../viewer/StudyModal";

type Props = { id?: string };

const empty: Partial<DocumentContent> = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  status: "draft",
  tags: [],
  documentType: "pdf",
  fileUrl: "",
  images: [],
  source: "",
  collection: "",
  year: undefined,
  authors: [],
  featured: false,
  sortOrder: 0,
};

export default function DocumentForm({ id }: Props) {
  const { token } = useAdminAuth();
  const [data, setData] = useState<Partial<DocumentContent>>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverPreviewSize, setCoverPreviewSize] = useState<{ w: number; h: number }>({ w: 520, h: 160 });
  const [filePreview, setFilePreview] = useState<string | null>(null);

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
        const res = await apiGet<DocumentContent>(`/api/admin/documentos/${id}`, token || undefined);
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

  const images = data.images ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);
  const authorsCsv = useMemo(() => joinCsv(data.authors), [data.authors]);

  const setField = <K extends keyof DocumentContent>(key: K, value: DocumentContent[K]) => {
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
        documentType: data.documentType,
        fileUrl: data.fileUrl || null,
        images: data.images ?? [],
        source: data.source || undefined,
        collection: data.collection || undefined,
        year: data.year ? Number(data.year) : undefined,
        authors: data.authors ?? [],
      };

      if (id) {
        await apiPatch<DocumentContent>(`/api/admin/documentos/${id}`, payload, token || undefined);
      } else {
        await apiPost<DocumentContent>("/api/admin/documentos", payload, token || undefined);
      }
      window.location.href = "/admin/documentos";
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
          <h1 className="text-xl font-semibold text-white">{id ? "Editar documento" : "Novo documento"}</h1>
          <p className="mt-1 text-sm text-white/70">Links de mídia (Cloudinary). Sem upload binário.</p>
        </div>
        <Link href="/admin/documentos" className="text-sm text-white/70 hover:text-white">
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
              rows={4}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

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

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Tipo
              <select
                value={data.documentType ?? "pdf"}
                onChange={(e) => setField("documentType", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="pdf">PDF</option>
                <option value="image">Imagem</option>
                <option value="mixed">Misto</option>
              </select>
            </label>
            <label className="block text-sm text-white/70">
              fileUrl (opcional)
              <input
                value={(data.fileUrl as string) ?? ""}
                onChange={(e) => setField("fileUrl", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="https://.../arquivo.pdf"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">Imagens (opcional)</div>
              <button
                type="button"
                onClick={() => setField("images", [...images, ""] as any)}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              >
                Adicionar
              </button>
            </div>
            <div className="mt-3 space-y-2">
              {images.map((url, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={url}
                    onChange={(e) => {
                      const next = images.slice();
                      next[idx] = e.target.value;
                      setField("images", next as any);
                    }}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    placeholder="https://.../image.jpg"
                  />
                  <button
                    type="button"
                    onClick={() => setField("images", images.filter((_, i) => i !== idx) as any)}
                    className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-4">
          <label className="block text-sm text-white/70">
            Tags (separadas por vírgula)
            <input
              value={tagsCsv}
              onChange={(e) => setField("tags", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Volta Redonda, Dom Waldyr, Greves"
            />
          </label>

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
            Coleção (opcional)
            <input
              value={data.collection ?? ""}
              onChange={(e) => setField("collection", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="ex.: Barra Mansa"
            />
          </label>

          <label className="block text-sm text-white/70">
            Fonte (opcional)
            <input
              value={data.source ?? ""}
              onChange={(e) => setField("source", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="ex.: Arquivo do sindicato"
            />
          </label>

          <label className="block text-sm text-white/70">
            Ano (opcional)
            <input
              value={data.year ? String(data.year) : ""}
              onChange={(e) => setField("year", (e.target.value ? Number(e.target.value) : undefined) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              inputMode="numeric"
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
            sortOrder (opcional)
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
              {data.fileUrl ? (
                <button
                  type="button"
                  onClick={() => setFilePreview(data.fileUrl || null)}
                  className="text-xs text-white/70 underline underline-offset-2"
                >
                  Visualizar arquivo
                </button>
              ) : null}
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
      <StudyModal
        open={Boolean(filePreview)}
        onClose={() => setFilePreview(null)}
        title={data.title || "Arquivo"}
        src={filePreview || ""}
      />
    </div>
  );
}
