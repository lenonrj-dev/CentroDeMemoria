"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { ContentStatus, PhotoArchiveContent, PhotoEntry } from "../../../lib/backend-types";
import { useAdminAuth } from "../AdminAuthProvider";
import { slugify } from "../../../lib/slugify";
import { joinCsv, moveItem, splitCsv } from "./common";

type Props = { id?: string };

const emptyPhoto: PhotoEntry = { imageUrl: "", caption: "", date: "", location: "" };

const empty: Partial<PhotoArchiveContent> = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  status: "draft",
  tags: [],
  featured: false,
  sortOrder: 0,
  photos: [],
  photographer: "",
  collection: "",
};

export default function PhotoArchiveForm({ id }: Props) {
  const { token } = useAdminAuth();
  const [data, setData] = useState<Partial<PhotoArchiveContent>>(empty);
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
        const res = await apiGet<PhotoArchiveContent>(`/api/admin/acervo-fotografico/${id}`, token || undefined);
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

  const photos = data.photos ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);

  const setField = <K extends keyof PhotoArchiveContent>(key: K, value: PhotoArchiveContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updatePhoto = (idx: number, next: Partial<PhotoEntry>) => {
    setField(
      "photos",
      photos.map((p, i) => (i === idx ? ({ ...p, ...next } as PhotoEntry) : p)) as any
    );
  };

  const removePhoto = (idx: number) => {
    setField(
      "photos",
      photos.filter((_, i) => i !== idx) as any
    );
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
        photographer: data.photographer || undefined,
        collection: data.collection || undefined,
        photos: (data.photos ?? [])
          .filter((p) => p.imageUrl)
          .map((p) => ({
            imageUrl: p.imageUrl,
            caption: p.caption || undefined,
            date: p.date || undefined,
            location: p.location || undefined,
          })),
      };

      if (id) {
        await apiPatch<PhotoArchiveContent>(`/api/admin/acervo-fotografico/${id}`, payload, token || undefined);
      } else {
        await apiPost<PhotoArchiveContent>("/api/admin/acervo-fotografico", payload, token || undefined);
      }
      window.location.href = "/admin/acervo-fotografico";
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
          <h1 className="text-xl font-semibold text-white">{id ? "Editar álbum" : "Novo álbum"}</h1>
          <p className="mt-1 text-sm text-white/70">Fotos via links (Cloudinary). Reordene para definir a narrativa.</p>
        </div>
        <Link href="/admin/acervo-fotografico" className="text-sm text-white/70 hover:text-white">
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
            coverImageUrl
            <input
              value={data.coverImageUrl ?? ""}
              onChange={(e) => setField("coverImageUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://res.cloudinary.com/.../capa.jpg"
              required
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Fotógrafo (opcional)
              <input
                value={data.photographer ?? ""}
                onChange={(e) => setField("photographer", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Nome do fotógrafo"
              />
            </label>
            <label className="block text-sm text-white/70">
              Coleção (opcional)
              <input
                value={data.collection ?? ""}
                onChange={(e) => setField("collection", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="ex.: Volta Redonda"
              />
            </label>
          </div>

          <label className="block text-sm text-white/70">
            Tags (separadas por vírgula)
            <input
              value={tagsCsv}
              onChange={(e) => setField("tags", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Volta Redonda, Greves, 1980s"
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
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">Fotos (ordenadas)</div>
              <button
                type="button"
                onClick={() => setField("photos", [...photos, { ...emptyPhoto }] as any)}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              >
                Adicionar
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {photos.length === 0 && <div className="text-xs text-white/60">Adicione ao menos 1 foto.</div>}
              {photos.map((p, idx) => (
                <div key={idx} className="grid gap-3 rounded-2xl border border-white/10 bg-black/40 p-3 sm:grid-cols-12">
                  <div className="sm:col-span-4">
                    <label className="block text-xs text-white/60">
                      imageUrl
                      <input
                        value={p.imageUrl ?? ""}
                        onChange={(e) => updatePhoto(idx, { imageUrl: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="https://res.cloudinary.com/.../foto.jpg"
                      />
                    </label>
                    <div className="mt-2 h-28 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {p.imageUrl ? <img src={p.imageUrl} alt={p.caption || "foto"} className="h-full w-full object-cover" /> : null}
                    </div>
                  </div>

                  <div className="sm:col-span-8">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-xs text-white/60">
                        caption (opcional)
                        <input
                          value={p.caption ?? ""}
                          onChange={(e) => updatePhoto(idx, { caption: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                          placeholder="Legenda curta"
                        />
                      </label>
                      <label className="block text-xs text-white/60">
                        location (opcional)
                        <input
                          value={p.location ?? ""}
                          onChange={(e) => updatePhoto(idx, { location: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                          placeholder="Volta Redonda"
                        />
                      </label>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="block text-xs text-white/60">
                        date (opcional)
                        <input
                          value={p.date ?? ""}
                          onChange={(e) => updatePhoto(idx, { date: e.target.value })}
                          type="date"
                          className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                        />
                      </label>
                      <div className="flex items-end justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setField("photos", moveItem(photos, idx, idx - 1) as any)}
                          disabled={idx === 0}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white disabled:opacity-40"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => setField("photos", moveItem(photos, idx, idx + 1) as any)}
                          disabled={idx === photos.length - 1}
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white disabled:opacity-40"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

        <div className="space-y-3 lg:col-span-4">
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
              {photos[0]?.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photos[0].imageUrl} alt={photos[0].caption || "foto"} className="h-40 w-full rounded-2xl object-cover" />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
