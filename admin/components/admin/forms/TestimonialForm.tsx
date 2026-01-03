"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { Attachment, ContentStatus, TestimonialContent } from "../../../lib/backend-types";
import type { NormalizedApiError } from "../../../lib/api-errors";
import { getPublicRoutes } from "../../../lib/public-site";
import { getSlugStatus, slugify } from "../../../lib/slugify";
import { extractYoutubeId, youtubeEmbedUrl, youtubeThumbUrl } from "../../../lib/youtube";
import { useAdminAuth } from "../AdminAuthProvider";
import { Modal } from "../Modal";
import { setFlashToast } from "../ToastProvider";
import { useApiErrorHandler } from "../useApiErrorHandler";
import { confirmUnsavedChanges, useUnsavedChanges } from "../useUnsavedChanges";
import { ContentPreviewPanel } from "./ContentPreviewPanel";
import { FormErrorSummary } from "./FormErrorSummary";
import { joinCsv, moveItem, splitCsv } from "./common";
import { useSlugAvailability } from "./useSlugAvailability";

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
  relatedPersonSlug: "",
  relatedFundKey: "",
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

const ROUTE_TAG_PRESETS = [
  { tag: "Volta Redonda", label: "Volta Redonda" },
  { tag: "Barra Mansa", label: "Barra Mansa" },
  { tag: "Dom Waldyr", label: "Fundo Dom Waldyr" },
] as const;

const PREVIEW_SIZE_KEY = "sintracon_admin_cover_preview_size_form";

export default function TestimonialForm({ id }: Props) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();

  const [data, setData] = useState<Partial<TestimonialContent>>(empty);
  const [initialSnapshot, setInitialSnapshot] = useState<string>("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [youtubeUrlInput, setYoutubeUrlInput] = useState("");
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [youtubeLoaded, setYoutubeLoaded] = useState(false);

  const [coverPreviewSize, setCoverPreviewSize] = useState<{ w: number; h: number }>({ w: 520, h: 160 });
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const coverPreviewW = clamp(coverPreviewSize.w, 240, 820);
  const coverPreviewH = clamp(coverPreviewSize.h, 120, 520);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREVIEW_SIZE_KEY);
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
      localStorage.setItem(PREVIEW_SIZE_KEY, JSON.stringify({ w: coverPreviewW, h: coverPreviewH }));
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

  function snapshot(d: Partial<TestimonialContent>) {
    return {
      title: d.title ?? "",
      slug: d.slug ?? "",
      description: d.description ?? "",
      coverImageUrl: d.coverImageUrl ?? "",
      imageUrl: d.imageUrl ?? "",
      mediaType: resolveMediaType(d),
      youtubeId: d.youtubeId ?? "",
      status: (d.status as ContentStatus) ?? "draft",
      tags: d.tags ?? [],
      relatedPersonSlug: d.relatedPersonSlug ?? "",
      relatedFundKey: d.relatedFundKey ?? "",
      featured: !!d.featured,
      sortOrder: Number(d.sortOrder ?? 0),
      authorName: d.authorName ?? "",
      authorRole: d.authorRole ?? "",
      testimonialText: d.testimonialText ?? "",
      date: d.date ?? "",
      location: d.location ?? "",
      attachments: (d.attachments ?? []).map((a) => ({ type: a.type, url: a.url, label: a.label ?? "" })),
    };
  }

  const currentSnapshot = useMemo(() => JSON.stringify(snapshot(data)), [data]);
  const dirty = useMemo(() => {
    const base = initialSnapshot || JSON.stringify(snapshot(empty));
    return currentSnapshot !== base;
  }, [currentSnapshot, initialSnapshot]);

  useUnsavedChanges(dirty && !saving);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<TestimonialContent>(`/api/admin/depoimentos/${id}`, token || undefined);
        if (cancelled) return;
        const next = { ...res.data };
        next.mediaType = resolveMediaType(next);
        if (!next.imageUrl && next.coverImageUrl) {
          next.imageUrl = next.coverImageUrl;
        }
        setData(next);
        setYoutubeUrlInput(next.youtubeId ? `https://www.youtube.com/watch?v=${next.youtubeId}` : "");
        setInitialSnapshot(JSON.stringify(snapshot(next)));
      } catch (err) {
        if (!cancelled) setError(handleApiError(err));
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
  const tags = data.tags ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);

  const publicRoutes = useMemo(() => {
    if (!data.slug) return [];
    return getPublicRoutes("depoimentos", { slug: data.slug, tags });
  }, [data.slug, tags]);

  const slugStatus = useMemo(() => getSlugStatus(data.slug ?? ""), [data.slug]);
  const slugCheck = useSlugAvailability("depoimentos", slugStatus.slug, id);
  const slugError =
    slugStatus.empty
      ? "Informe um slug valido para continuar."
      : slugStatus.tooShort
        ? "Slug muito curto. Use pelo menos 3 caracteres."
        : slugCheck.status === "taken"
          ? "Slug ja existe. Use outro."
          : slugCheck.status === "error"
            ? "Nao foi possivel validar o slug."
            : null;
  const slugBlocker = slugError || (slugCheck.status === "checking" ? "Aguarde a validacao do slug." : null);

  const setField = <K extends keyof TestimonialContent>(key: K, value: TestimonialContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePresetTag = (tag: string, checked: boolean) => {
    const next = checked ? Array.from(new Set([...tags, tag])) : tags.filter((t) => t !== tag);
    setField("tags", next as any);
  };

  const updateAttachment = (idx: number, next: Partial<Attachment>) => {
    setField(
      "attachments",
      attachments.map((a, i) => (i === idx ? ({ ...a, ...next } as Attachment) : a)) as any
    );
  };

  const addAttachment = () => setField("attachments", [...attachments, { ...attachmentEmpty }] as any);
  const removeAttachment = (idx: number) => setField("attachments", attachments.filter((_, i) => i !== idx) as any);
  const duplicateAttachment = (idx: number) => {
    const a = attachments[idx];
    if (!a) return;
    const next = attachments.slice();
    next.splice(idx + 1, 0, { ...a });
    setField("attachments", next as any);
  };

  const save = async (status: ContentStatus) => {
    if (slugBlocker) {
      setError({ message: slugBlocker });
      return;
    }
    const youtubeId = (data.youtubeId || "").trim();
    if (mediaType === "youtube" && (!youtubeId || youtubeError)) {
      setError({ message: youtubeError || "Informe um link valido do YouTube." });
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
        relatedPersonSlug: data.relatedPersonSlug || undefined,
        relatedFundKey: data.relatedFundKey || undefined,
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

      setFlashToast({
        type: "success",
        title: status === "published" ? "Publicado" : "Salvo",
        message: status === "published" ? "Depoimento publicado com sucesso." : "Rascunho salvo com sucesso.",
      });
      router.replace("/admin/depoimentos");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const previewItem: TestimonialContent = useMemo(() => {
    const youtubeId = (data.youtubeId || "").trim();
    const coverFromVideo = youtubeId ? youtubeThumbUrl(youtubeId) : "";
    const coverImageUrl =
      mediaType === "youtube" ? coverFromVideo : data.coverImageUrl || data.imageUrl || "";
    const imageUrl = data.imageUrl || (mediaType === "image" ? data.coverImageUrl : "");
    return {
      _id: id || "new",
      title: data.title || "",
      slug: data.slug || "",
      description: data.description || "",
      coverImageUrl,
      status: (data.status as ContentStatus) || "draft",
      tags: data.tags ?? [],
      relatedPersonSlug: data.relatedPersonSlug ?? "",
      relatedFundKey: data.relatedFundKey ?? "",
      featured: !!data.featured,
      sortOrder: Number(data.sortOrder ?? 0),
      publishedAt: (data.status as ContentStatus) === "published" ? new Date().toISOString() : null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      authorName: data.authorName || "",
      authorRole: data.authorRole || undefined,
      testimonialText: data.testimonialText || "",
      attachments: (data.attachments ?? []) as any,
      date: data.date || undefined,
      location: data.location || undefined,
      mediaType,
      youtubeId: youtubeId || undefined,
      imageUrl: imageUrl || undefined,
    };
  }, [data, id, mediaType]);

  if (loading) return <div className="text-sm text-white/70">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">{id ? "Editar depoimento" : "Novo depoimento"}</h1>
          <p className="mt-1 text-sm text-white/70">Texto + midia opcional (YouTube ou imagem). O card usa a midia quando houver.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (dirty && !confirmUnsavedChanges()) return;
            router.push("/admin/depoimentos");
          }}
          className="text-sm text-white/70 hover:text-white"
        >
          Voltar
        </button>
      </div>

      <FormErrorSummary error={error} />

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-8">
          <label className="block text-sm text-white/70">
            Título
            <input
              value={data.title ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setField("title", v as any);
                if (!slugTouched) setField("slug", slugify(v) as any);
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Ex.: Depoimento sobre a greve de 1984"
              required
            />
            <div className="mt-1 text-xs text-white/50">Nome exibido no card e no topo da leitura. Recom.: até 80 caracteres.</div>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Slug (URL)
              <input
                value={data.slug ?? ""}
                onChange={(e) => {
                  setSlugTouched(true);
                  setField("slug", slugify(e.target.value) as any);
                }}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="depoimento-greve-1984"
              />
              <div className="mt-1 text-xs text-white/50">Gerado pelo titulo. Usado nas rotas publicas do depoimento.</div>
              <div className="mt-2 space-y-1 text-xs text-white/60">
                <div>
                  Slug final: <span className="font-mono text-white/80">{slugStatus.slug || "-"}</span>
                </div>
                {publicRoutes[0]?.path ? (
                  <div>
                    URL: <span className="font-mono text-white/80">{publicRoutes[0].path}</span>
                  </div>
                ) : null}
              </div>
              {slugError ? (
                <div className="mt-2 text-xs text-red-200">{slugError}</div>
              ) : slugCheck.status === "checking" ? (
                <div className="mt-2 text-xs text-white/60">Validando slug...</div>
              ) : slugCheck.status === "available" ? (
                <div className="mt-2 text-xs text-emerald-200">Slug disponivel.</div>
              ) : null}
            </label>

            <label className="block text-sm text-white/70">
              Autor (authorName)
              <input
                value={data.authorName ?? ""}
                onChange={(e) => setField("authorName", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex.: Maria da Silva"
                required
              />
              <div className="mt-1 text-xs text-white/50">Nome exibido junto ao texto do depoimento.</div>
            </label>
          </div>

          <label className="block text-sm text-white/70">
            Cargo / papel (opcional)
            <input
              value={data.authorRole ?? ""}
              onChange={(e) => setField("authorRole", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Ex.: Metalúrgica, liderança sindical, jornalista"
            />
            <div className="mt-1 text-xs text-white/50">Complemento institucional para contextualizar o autor.</div>
          </label>

          <label className="block text-sm text-white/70">
            Descrição
            <textarea
              value={data.description ?? ""}
              onChange={(e) => setField("description", e.target.value as any)}
              className="mt-1 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Resumo exibido no card e no começo da leitura. Ex.: tema, período, contexto."
              required
            />
            <div className="mt-1 text-xs text-white/50">Resumo do card (truncado) e abertura da página. Ideal: 120–180 caracteres.</div>
          </label>

          <label className="block text-sm text-white/70">
            Tipo de midia
            <select
              value={mediaType}
              onChange={(e) => {
                setField("mediaType", e.target.value as any);
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value="youtube">Video do YouTube</option>
              <option value="image">Imagem</option>
              <option value="text">Somente texto</option>
            </select>
            <div className="mt-1 text-xs text-white/50">Define como o depoimento aparece no site.</div>
          </label>

          {mediaType === "youtube" ? (
            <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
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
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="https://www.youtube.com/watch?v=ID"
                />
                <div className="mt-1 text-xs text-white/50">Aceita links do YouTube, youtu.be ou embed.</div>
              </label>
              {youtubeError ? <div className="mt-2 text-xs text-red-200">{youtubeError}</div> : null}
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
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
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="https://res.cloudinary.com/.../cover.jpg"
              />
              <div className="mt-1 text-xs text-white/50">Preview do card. Recom.: 16:9 (Cloudinary).</div>
            </label>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
              Sem midia. O depoimento sera exibido apenas com texto.
            </div>
          )}

          <label className="block text-sm text-white/70">
            Texto do depoimento (testimonialText)
            <textarea
              value={data.testimonialText ?? ""}
              onChange={(e) => setField("testimonialText", e.target.value as any)}
              className="mt-1 min-h-[180px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Texto completo do depoimento. Evite quebra excessiva; use parágrafos quando necessário."
              required
            />
            <div className="mt-1 text-xs text-white/50">Conteúdo principal exibido na leitura. Pode conter quebras de linha.</div>
          </label>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/90">Anexos (attachments)</div>
                <div className="mt-1 text-xs text-white/60">Links extras (imagem/PDF/link). Opcional. Aparece como anexos na leitura.</div>
              </div>
              <button
                type="button"
                onClick={addAttachment}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
              >
                Adicionar anexo
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {attachments.length ? null : <div className="text-sm text-white/60">Sem anexos.</div>}
              {attachments.map((a, idx) => (
                <div key={`${idx}`} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                    <label className="block text-xs text-white/60">
                      Tipo
                      <select
                        value={a.type}
                        onChange={(e) => updateAttachment(idx, { type: e.target.value as any })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      >
                        <option value="link">link</option>
                        <option value="pdf">pdf</option>
                        <option value="image">image</option>
                      </select>
                    </label>
                    <label className="block text-xs text-white/60">
                      URL
                      <input
                        value={a.url ?? ""}
                        onChange={(e) => updateAttachment(idx, { url: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="https://..."
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-xs text-white/60">
                      Label (opcional)
                      <input
                        value={a.label ?? ""}
                        onChange={(e) => updateAttachment(idx, { label: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="Ex.: Foto do entrevistado / PDF da transcrição"
                      />
                    </label>
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                      <div className="text-[11px] text-white/60">Preview</div>
                      {a.type === "image" && a.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.url} alt="" className="mt-2 h-24 w-full rounded-2xl object-cover" />
                      ) : a.url ? (
                        <a href={a.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs text-white/70 underline underline-offset-2">
                          Abrir link
                        </a>
                      ) : (
                        <div className="mt-2 text-xs text-white/50">Sem URL</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => setField("attachments", moveItem(attachments, idx, idx - 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === attachments.length - 1}
                      onClick={() => setField("attachments", moveItem(attachments, idx, idx + 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateAttachment(idx)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                    >
                      Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAttachment(idx)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-50 hover:bg-red-500/15"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <label className="block text-sm text-white/70">
            Tags (CSV)
            <input
              value={tagsCsv}
              onChange={(e) => setField("tags", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="sindicato, greve, anos-80"
            />
            <div className="mt-1 text-xs text-white/50">Ajuda na filtragem e nas rotas por cidade/fundo.</div>
          </label>
          <label className="block text-sm text-white/70">
            Pessoa relacionada (slug)
            <input
              value={data.relatedPersonSlug ?? ""}
              onChange={(e) => setField("relatedPersonSlug", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="dom-waldyr"
            />
            <div className="mt-1 text-xs text-white/50">Vincula este depoimento a um acervo pessoal.</div>
          </label>

          <label className="block text-sm text-white/70">
            Fundo relacionado (chave)
            <input
              value={data.relatedFundKey ?? ""}
              onChange={(e) => setField("relatedFundKey", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="dom-waldyr"
            />
            <div className="mt-1 text-xs text-white/50">Use a chave do fundo (ex.: dom-waldyr).</div>
          </label>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-semibold text-white/90">Rota no site</div>
            {publicRoutes.length ? (
              <div className="mt-2 space-y-1 text-xs text-white/70">
                {publicRoutes.slice(0, 6).map((r) => (
                  <a key={r.path} href={r.url} target="_blank" rel="noreferrer" className="block underline underline-offset-2">
                    {r.path}
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-xs text-white/60">Defina título/slug para ver as rotas.</div>
            )}

            <div className="mt-3 grid gap-2">
              {ROUTE_TAG_PRESETS.map((p) => (
                <label key={p.tag} className="flex items-center gap-2 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={tags.includes(p.tag)}
                    onChange={(e) => togglePresetTag(p.tag, e.target.checked)}
                    className="h-4 w-4 accent-white"
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

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
            <input type="checkbox" checked={!!data.featured} onChange={(e) => setField("featured", e.target.checked as any)} className="h-4 w-4 accent-white" />
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
            <div className="text-sm font-semibold text-white/90">Preview do cover</div>
            <div className="mt-1 text-xs text-white/60">Ajuste só a visualização no admin (não altera a imagem original).</div>
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
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">Sem cover</div>
              )}
            </div>
          </div>

          <ContentPreviewPanel module="depoimentos" item={previewItem} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur sm:rounded-3xl sm:border sm:bg-black/40">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              if (dirty && !confirmUnsavedChanges()) return;
              router.push("/admin/depoimentos");
            }}
            className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5 text-center"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => setPreviewOpen(true)}
            className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/85 hover:bg-white/5 disabled:opacity-60"
          >
            Pré-visualizar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save("draft")}
            className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/85 hover:bg-white/5 disabled:opacity-60"
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

      <Modal open={previewOpen} title="Pré-visualização" onClose={() => setPreviewOpen(false)} size="xl">
        <ContentPreviewPanel module="depoimentos" item={previewItem} />
      </Modal>
    </div>
  );
}

