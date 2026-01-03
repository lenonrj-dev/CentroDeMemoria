"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { Attachment, ContentStatus, ReferenceContent } from "../../../lib/backend-types";
import type { NormalizedApiError } from "../../../lib/api-errors";
import { getPublicRoutes } from "../../../lib/public-site";
import { getSlugStatus, slugify } from "../../../lib/slugify";
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

const empty: Partial<ReferenceContent> = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  status: "draft",
  tags: [],
  relatedPersonSlug: "",
  relatedFundKey: "",
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

const ROUTE_TAG_PRESETS = [
  { tag: "Volta Redonda", label: "Volta Redonda" },
  { tag: "Barra Mansa", label: "Barra Mansa" },
  { tag: "Dom Waldyr", label: "Fundo Dom Waldyr" },
] as const;

const PREVIEW_SIZE_KEY = "sintracon_admin_cover_preview_size_form";

export default function ReferenceForm({ id }: Props) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();

  const [data, setData] = useState<Partial<ReferenceContent>>(empty);
  const [initialSnapshot, setInitialSnapshot] = useState<string>("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

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

  function snapshot(d: Partial<ReferenceContent>) {
    return {
      title: d.title ?? "",
      slug: d.slug ?? "",
      description: d.description ?? "",
      coverImageUrl: d.coverImageUrl ?? "",
      status: (d.status as ContentStatus) ?? "draft",
      tags: d.tags ?? [],
      relatedPersonSlug: d.relatedPersonSlug ?? "",
      relatedFundKey: d.relatedFundKey ?? "",
      featured: !!d.featured,
      sortOrder: Number(d.sortOrder ?? 0),
      citation: d.citation ?? "",
      authors: d.authors ?? [],
      year: Number(d.year ?? 0),
      publisher: d.publisher ?? "",
      isbn: d.isbn ?? "",
      externalUrl: d.externalUrl ?? "",
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
        const res = await apiGet<ReferenceContent>(`/api/admin/referencias/${id}`, token || undefined);
        if (cancelled) return;
        setData(res.data);
        setInitialSnapshot(JSON.stringify(snapshot(res.data)));
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

  const attachments = data.attachments ?? [];
  const tags = data.tags ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);
  const authorsCsv = useMemo(() => joinCsv(data.authors), [data.authors]);

  const publicRoutes = useMemo(() => {
    if (!data.slug) return [];
    return getPublicRoutes("referencias", { slug: data.slug, tags });
  }, [data.slug, tags]);

  const slugStatus = useMemo(() => getSlugStatus(data.slug ?? ""), [data.slug]);
  const slugCheck = useSlugAvailability("referencias", slugStatus.slug, id);
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

  const setField = <K extends keyof ReferenceContent>(key: K, value: ReferenceContent[K]) => {
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
        relatedPersonSlug: data.relatedPersonSlug || undefined,
        relatedFundKey: data.relatedFundKey || undefined,
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

      setFlashToast({
        type: "success",
        title: status === "published" ? "Publicado" : "Salvo",
        message: status === "published" ? "Referência publicada com sucesso." : "Rascunho salvo com sucesso.",
      });
      router.replace("/admin/referencias");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const previewItem: ReferenceContent = useMemo(
    () => ({
      _id: id || "new",
      title: data.title || "",
      slug: data.slug || "",
      description: data.description || "",
      coverImageUrl: data.coverImageUrl || "",
      status: (data.status as ContentStatus) || "draft",
      tags: data.tags ?? [],
      relatedPersonSlug: data.relatedPersonSlug ?? "",
      relatedFundKey: data.relatedFundKey ?? "",
      featured: !!data.featured,
      sortOrder: Number(data.sortOrder ?? 0),
      publishedAt: (data.status as ContentStatus) === "published" ? new Date().toISOString() : null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      citation: data.citation || "",
      authors: data.authors ?? [],
      year: Number(data.year || new Date().getFullYear()),
      publisher: data.publisher || undefined,
      isbn: data.isbn || undefined,
      externalUrl: data.externalUrl || undefined,
      attachments: (data.attachments ?? []) as any,
    }),
    [data, id]
  );

  if (loading) return <div className="text-sm text-white/70">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">{id ? "Editar referência" : "Nova referência"}</h1>
          <p className="mt-1 text-sm text-white/70">Citação pronta + metadados + anexos opcionais (links).</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (dirty && !confirmUnsavedChanges()) return;
            router.push("/admin/referencias");
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
              placeholder="Ex.: Livro sobre o movimento operário"
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
                placeholder="livro-movimento-operario"
              />
              <div className="mt-1 text-xs text-white/50">Gerado pelo titulo. Util para linkagem e consistencia.</div>
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
              Ano (year)
              <input
                value={String(data.year ?? "")}
                onChange={(e) => setField("year", Number(e.target.value) as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                inputMode="numeric"
                required
              />
              <div className="mt-1 text-xs text-white/50">Obrigatório. Usado em ordenação e filtros.</div>
            </label>
          </div>

          <label className="block text-sm text-white/70">
            Descrição
            <textarea
              value={data.description ?? ""}
              onChange={(e) => setField("description", e.target.value as any)}
              className="mt-1 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Resumo exibido no card e no início da leitura. Explique o tema e a relevância."
              required
            />
            <div className="mt-1 text-xs text-white/50">Resumo do card (truncado) e abertura. Ideal: 120–180 caracteres.</div>
          </label>

          <label className="block text-sm text-white/70">
            Imagem de capa (URL)
            <input
              value={data.coverImageUrl ?? ""}
              onChange={(e) => setField("coverImageUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://res.cloudinary.com/.../cover.jpg"
              required
            />
            <div className="mt-1 text-xs text-white/50">Imagem de pré-visualização do card. Recom.: 16:9.</div>
          </label>

          <label className="block text-sm text-white/70">
            Citação (citation)
            <textarea
              value={data.citation ?? ""}
              onChange={(e) => setField("citation", e.target.value as any)}
              className="mt-1 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Ex.: SOBRENOME, Nome. Título. Editora, ano."
              required
            />
            <div className="mt-1 text-xs text-white/50">Texto principal exibido na leitura (ABNT/APA). Obrigatório.</div>
          </label>

          <label className="block text-sm text-white/70">
            Autores (CSV)
            <input
              value={authorsCsv}
              onChange={(e) => setField("authors", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Autor 1, Autor 2"
            />
            <div className="mt-1 text-xs text-white/50">Ajuda na indexação e filtros (opcional).</div>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Editora (opcional)
              <input
                value={data.publisher ?? ""}
                onChange={(e) => setField("publisher", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex.: Editora X"
              />
            </label>
            <label className="block text-sm text-white/70">
              ISBN (opcional)
              <input
                value={data.isbn ?? ""}
                onChange={(e) => setField("isbn", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="978..."
              />
            </label>
          </div>

          <label className="block text-sm text-white/70">
            Link externo (externalUrl) — opcional
            <input
              value={data.externalUrl ?? ""}
              onChange={(e) => setField("externalUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://..."
            />
            <div className="mt-1 text-xs text-white/50">Link para página externa (quando existir).</div>
          </label>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/90">Anexos (attachments)</div>
                <div className="mt-1 text-xs text-white/60">Links extras (imagem/PDF/link). Opcional.</div>
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
                        placeholder="Ex.: PDF completo / imagem de capa"
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
            <div className="mt-1 text-xs text-white/50">Ajuda na filtragem e nas listas por cidade/fundo.</div>
          </label>
          <label className="block text-sm text-white/70">
            Pessoa relacionada (slug)
            <input
              value={data.relatedPersonSlug ?? ""}
              onChange={(e) => setField("relatedPersonSlug", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="dom-waldyr"
            />
            <div className="mt-1 text-xs text-white/50">Vincula esta referencia a um acervo pessoal.</div>
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
                  <input type="checkbox" checked={tags.includes(p.tag)} onChange={(e) => togglePresetTag(p.tag, e.target.checked)} className="h-4 w-4 accent-white" />
                  {p.label}
                </label>
              ))}
            </div>
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
              {data.externalUrl ? (
                <a href={data.externalUrl} target="_blank" rel="noreferrer" className="text-xs text-white/70 underline underline-offset-2">
                  Abrir link externo
                </a>
              ) : null}
            </div>
          </div>

          <ContentPreviewPanel module="referencias" item={previewItem} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur sm:rounded-3xl sm:border sm:bg-black/40">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              if (dirty && !confirmUnsavedChanges()) return;
              router.push("/admin/referencias");
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
        <ContentPreviewPanel module="referencias" item={previewItem} />
      </Modal>
    </div>
  );
}

