"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { Attachment, ContentStatus, TestimonialContent } from "../../../lib/backend-types";
import { useAdminAuth } from "../AdminAuthProvider";
import { slugify } from "../../../lib/slugify";
import { extractYoutubeId, youtubeEmbedUrl, youtubeThumbUrl } from "../../../lib/youtube";
import { joinCsv, moveItem, splitCsv } from "./common";

type Props = { id?: string };

const empty: Partial<TestimonialContent> = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  imageUrl: "",
  mediaType: "image",
  youtubeId: "",
  status: "draft",
  tags: [],
  featured: false,
  sortOrder: 0,
  authorName: "",
  authorRole: "",
  testimonialText: "",
  attachments: [],
  date: "",
  location: "",
};

const attachmentEmpty: Attachment = { type: "link", url: "", label: "" };

export default function TestimonialForm({ id }: Props) {
  const { token } = useAdminAuth();
  const [data, setData] = useState<Partial<TestimonialContent>>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverPreviewSize, setCoverPreviewSize] = useState<{ w: number; h: number }>({ w: 520, h: 160 });
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("");
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [youtubeLoaded, setYoutubeLoaded] = useState(false);

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

  const resolveMediaType = (d: Partial<TestimonialContent>) => {
    if (d.mediaType) return d.mediaType;
    if (d.youtubeId) return "youtube";
    if (d.imageUrl || d.coverImageUrl) return "image";
    return "text";
  };

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<TestimonialContent>(`/api/admin/depoimentos/${id}`, token || undefined);
        if (!cancelled) {
          const next = { ...res.data };
          next.mediaType = resolveMediaType(next);
          if (!next.imageUrl && next.coverImageUrl) next.imageUrl = next.coverImageUrl;
          setData(next);
          setYoutubeUrlInput(next.youtubeId ? `https://www.youtube.com/watch?v=${next.youtubeId}` : "");
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
  }, [id, token]);

  const mediaType = useMemo(() => resolveMediaType(data), [data]);
  const coverPreviewSrc = useMemo(() => {
    const youtubeId = (data.youtubeId || "").trim();
    if (mediaType === "youtube" && youtubeId) return youtubeThumbUrl(youtubeId);
    return data.coverImageUrl || data.imageUrl || "";
  }, [data.coverImageUrl, data.imageUrl, data.youtubeId, mediaType]);

  useEffect(() => {
    if (mediaType !== "youtube") setYoutubeError(null);
  }, [mediaType]);

  useEffect(() => {
    setYoutubeLoaded(false);
  }, [data.youtubeId]);

  const attachments = data.attachments ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);

  const setField = <K extends keyof TestimonialContent>(key: K, value: TestimonialContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (status: ContentStatus) => {
    const youtubeId = (data.youtubeId || "").trim();
    if (mediaType === "youtube" && (!youtubeId || youtubeError)) {
      setError(youtubeError || "Informe um link valido do YouTube.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const coverFromVideo = youtubeId ? youtubeThumbUrl(youtubeId) : undefined;
      const coverImageUrl =
        mediaType === "youtube" ? coverFromVideo : data.coverImageUrl || data.imageUrl || undefined;
      const imageUrl = data.imageUrl || (mediaType === "image" ? data.coverImageUrl : undefined);
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImageUrl,
        status,
        tags: data.tags ?? [],
        featured: !!data.featured,
        sortOrder: Number(data.sortOrder ?? 0),
        authorName: data.authorName,
        authorRole: data.authorRole || undefined,
        testimonialText: data.testimonialText,
        attachments: (data.attachments ?? []).filter((a) => a.url),
        date: data.date || undefined,
        location: data.location || undefined,
        mediaType,
        youtubeId: youtubeId || undefined,
        imageUrl: imageUrl || undefined,
      };

      if (id) {
        await apiPatch<TestimonialContent>(`/api/admin/depoimentos/${id}`, payload, token || undefined);
      } else {
        await apiPost<TestimonialContent>("/api/admin/depoimentos", payload, token || undefined);
      }
      window.location.href = "/admin/depoimentos";
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
          <h1 className="text-xl font-semibold text-white">{id ? "Editar depoimento" : "Novo depoimento"}</h1>
          <p className="mt-1 text-sm text-white/70">Texto + midia (YouTube ou imagem) e anexos opcionais.</p>
        </div>
        <Link href="/admin/depoimentos" className="text-sm text-white/70 hover:text-white">
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

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Nome do autor
              <input
                value={data.authorName ?? ""}
                onChange={(e) => setField("authorName", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
            </label>
            <label className="block text-sm text-white/70">
              Cargo (opcional)
              <input
                value={data.authorRole ?? ""}
                onChange={(e) => setField("authorRole", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              />
            </label>
          </div>

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
            Tipo de midia
            <select
              value={mediaType}
              onChange={(e) => setField("mediaType", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="youtube">Video do YouTube</option>
              <option value="image">Imagem</option>
              <option value="text">Somente texto</option>
            </select>
          </label>

          {mediaType === "youtube" ? (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <label className="block text-sm text-white/70">
                Link do YouTube (cole a URL)
                <input
                  value={youtubeUrlInput}
                  onChange={(e) => {
                    const next = e.target.value;
                    setYoutubeUrlInput(next);
                    const id = extractYoutubeId(next);
                    if (id) {
                      setYoutubeError(null);
                      setField("youtubeId", id as any);
                    } else {
                      setYoutubeError(next.trim() ? "Link do YouTube invalido." : null);
                      setField("youtubeId", "" as any);
                    }
                  }}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="https://www.youtube.com/watch?v=ID"
                />
                <div className="mt-1 text-xs text-white/50">Aceita links do YouTube, youtu.be ou embed.</div>
              </label>
              {youtubeError ? <div className="mt-2 text-xs text-red-200">{youtubeError}</div> : null}
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                {data.youtubeId ? (
                  <div className="relative aspect-video w-full">
                    {!youtubeLoaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
                    <iframe
                      title={data.title ? `Video: ${data.title}` : "Video do YouTube"}
                      src={youtubeEmbedUrl(data.youtubeId)}
                      className="h-full w-full"
                      loading="lazy"
                      onLoad={() => setYoutubeLoaded(true)}
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                    />
                  </div>
                ) : (
                  <div className="p-4 text-xs text-white/60">Informe um link valido para visualizar o embed.</div>
                )}
              </div>
            </div>
          ) : mediaType === "image" ? (
            <label className="block text-sm text-white/70">
              Imagem (URL)
              <input
                value={(data.imageUrl ?? data.coverImageUrl) ?? ""}
                onChange={(e) => {
                  const next = e.target.value;
                  setField("imageUrl", next as any);
                  setField("coverImageUrl", next as any);
                }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="https://res.cloudinary.com/.../image.jpg"
              />
            </label>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              Sem midia. O depoimento sera exibido apenas com texto.
            </div>
          )}

          <label className="block text-sm text-white/70">
            Texto do depoimento
            <textarea
              value={data.testimonialText ?? ""}
              onChange={(e) => setField("testimonialText", e.target.value as any)}
              rows={8}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
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
            Tags (csv)
            <input
              value={tagsCsv}
              onChange={(e) => setField("tags", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Volta Redonda, Dom Waldyr"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Data (opcional)
              <input
                value={data.date ?? ""}
                onChange={(e) => setField("date", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="1983-11-02"
              />
            </label>
            <label className="block text-sm text-white/70">
              Local (opcional)
              <input
                value={data.location ?? ""}
                onChange={(e) => setField("location", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Volta Redonda"
              />
            </label>
          </div>

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
              {coverPreviewSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreviewSrc}
                  alt={data.title || "cover"}
                  className="mx-auto w-full rounded-2xl border border-white/10 bg-black/40 object-cover"
                  style={{ maxWidth: coverPreviewW, height: coverPreviewH }}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">Sem midia</div>
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
