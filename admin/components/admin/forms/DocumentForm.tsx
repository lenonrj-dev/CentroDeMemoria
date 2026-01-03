"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { ContentStatus, DocumentContent } from "../../../lib/backend-types";
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

const empty: Partial<DocumentContent> = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  status: "draft",
  tags: [],
  relatedPersonSlug: "",
  relatedFundKey: "",
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

const ROUTE_TAG_PRESETS = [
  { tag: "Volta Redonda", label: "Volta Redonda" },
  { tag: "Barra Mansa", label: "Barra Mansa" },
  { tag: "Dom Waldyr", label: "Fundo Dom Waldyr" },
  { tag: "Cartazes", label: "Cartazes & panfletos" },
] as const;

const PREVIEW_SIZE_KEY = "sintracon_admin_cover_preview_size_form";

export default function DocumentForm({ id }: Props) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();

  const [data, setData] = useState<Partial<DocumentContent>>(empty);
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

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<DocumentContent>(`/api/admin/documentos/${id}`, token || undefined);
        if (!cancelled) {
          setData(res.data);
          setInitialSnapshot(JSON.stringify(snapshot(res.data)));
        }
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

  const images = data.images ?? [];
  const tags = data.tags ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);
  const authorsCsv = useMemo(() => joinCsv(data.authors), [data.authors]);

  const publicRoutes = useMemo(() => {
    if (!data.slug) return [];
    return getPublicRoutes("documentos", { slug: data.slug, tags });
  }, [data.slug, tags]);

  const slugStatus = useMemo(() => getSlugStatus(data.slug ?? ""), [data.slug]);
  const slugCheck = useSlugAvailability("documentos", slugStatus.slug, id);
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

  const setField = <K extends keyof DocumentContent>(key: K, value: DocumentContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  function snapshot(d: Partial<DocumentContent>) {
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
      documentType: (d.documentType as any) ?? "pdf",
      fileUrl: d.fileUrl ?? "",
      images: d.images ?? [],
      source: d.source ?? "",
      collection: d.collection ?? "",
      year: d.year ?? null,
      authors: d.authors ?? [],
    };
  }

  const currentSnapshot = useMemo(() => JSON.stringify(snapshot(data)), [data]);
  const dirty = useMemo(() => {
    const base = initialSnapshot || JSON.stringify(snapshot(empty));
    return currentSnapshot !== base;
  }, [currentSnapshot, initialSnapshot]);

  useUnsavedChanges(dirty && !saving);

  const togglePresetTag = (tag: string, checked: boolean) => {
    const next = checked ? Array.from(new Set([...tags, tag])) : tags.filter((t) => t !== tag);
    setField("tags", next as any);
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
        documentType: data.documentType,
        fileUrl: data.fileUrl || null,
        images: (data.images ?? []).filter(Boolean),
        source: data.source || undefined,
        collection: data.collection || undefined,
        year: data.year ? Number(data.year) : undefined,
        authors: (data.authors ?? []).filter(Boolean),
      };

      if (id) {
        await apiPatch<DocumentContent>(`/api/admin/documentos/${id}`, payload, token || undefined);
      } else {
        await apiPost<DocumentContent>("/api/admin/documentos", payload, token || undefined);
      }

      setFlashToast({
        type: "success",
        title: status === "published" ? "Publicado" : "Salvo",
        message: status === "published" ? "Documento publicado com sucesso." : "Rascunho salvo com sucesso.",
      });
      router.replace("/admin/documentos");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const previewItem: DocumentContent = useMemo(
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
      documentType: (data.documentType as any) || "pdf",
      fileUrl: data.fileUrl || undefined,
      images: data.images ?? [],
      source: data.source,
      collection: data.collection,
      year: data.year,
      authors: data.authors ?? [],
    }),
    [data, id]
  );

  if (loading) return <div className="text-sm text-white/70">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">{id ? "Editar documento" : "Novo documento"}</h1>
          <p className="mt-1 text-sm text-white/70">PDF e/ou imagens (links). A capa é o preview do card.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (dirty && !confirmUnsavedChanges()) return;
            router.push("/admin/documentos");
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
              placeholder="Ex.: Carta do sindicato (1980)"
              required
            />
            <div className="mt-1 text-xs text-white/50">Nome que aparece no card e no topo da leitura. Recom.: até 80 caracteres.</div>
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
                placeholder="carta-do-sindicato-1980"
              />
              <div className="mt-1 text-xs text-white/50">Gerado pelo titulo. Usado nas rotas publicas do item.</div>
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
              Tipo do documento
              <select
                value={(data.documentType ?? "pdf") as any}
                onChange={(e) => setField("documentType", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="pdf">PDF</option>
                <option value="image">Imagem</option>
                <option value="mixed">Misto</option>
              </select>
              <div className="mt-1 text-xs text-white/50">Controla como a leitura renderiza (PDF, imagens ou ambos).</div>
            </label>
          </div>

          <label className="block text-sm text-white/70">
            Descrição
            <textarea
              value={data.description ?? ""}
              onChange={(e) => setField("description", e.target.value as any)}
              className="mt-1 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Resumo exibido no card e no início da leitura. Contextualize data, local e relevância."
              required
            />
            <div className="mt-1 text-xs text-white/50">Resumo exibido no card (truncado) e no começo da leitura. Ideal: 120–180 caracteres.</div>
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
            <div className="mt-1 text-xs text-white/50">Imagem de pré-visualização do card. Recom.: proporção 16:9 (Cloudinary).</div>
          </label>

          <label className="block text-sm text-white/70">
            PDF principal (fileUrl)
            <input
              value={data.fileUrl ?? ""}
              onChange={(e) => setField("fileUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://res.cloudinary.com/.../arquivo.pdf"
            />
            <div className="mt-1 text-xs text-white/50">Link do PDF principal. Se vazio, use imagens (pages) abaixo.</div>
          </label>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/90">Imagens (pages)</div>
                <div className="mt-1 text-xs text-white/60">Páginas em imagem para leitura mais fluida. A ordem importa.</div>
              </div>
              <button
                type="button"
                onClick={() => setField("images", [...images, ""] as any)}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
              >
                Adicionar imagem
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {images.length ? null : <div className="text-sm text-white/60">Sem imagens.</div>}
              {images.map((url, idx) => (
                <div key={`${idx}`} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 sm:grid-cols-[1fr_auto]">
                  <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
                    <input
                      value={url}
                      onChange={(e) => {
                        const next = images.slice();
                        next[idx] = e.target.value;
                        setField("images", next as any);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="https://res.cloudinary.com/.../page-01.jpg"
                    />
                    <div className="h-16 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => setField("images", moveItem(images, idx, idx - 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => setField("images", moveItem(images, idx, idx + 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setField("images", moveItem([...images, url], images.length, idx + 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                    >
                      Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => setField("images", images.filter((_, i) => i !== idx) as any)}
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
            <div className="mt-1 text-xs text-white/50">Ajuda na filtragem e pesquisa. Use nomes de cidades e temas.</div>
          </label>

          <label className="block text-sm text-white/70">
            Pessoa relacionada (slug)
            <input
              value={data.relatedPersonSlug ?? ""}
              onChange={(e) => setField("relatedPersonSlug", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="dom-waldyr"
            />
            <div className="mt-1 text-xs text-white/50">Vincula este item a um acervo pessoal.</div>
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
                {publicRoutes.slice(0, 4).map((r) => (
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

          <label className="block text-sm text-white/70">
            Autores (CSV)
            <input
              value={authorsCsv}
              onChange={(e) => setField("authors", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Nome 1, Nome 2"
            />
            <div className="mt-1 text-xs text-white/50">Opcional. Ajuda na indexação e em filtros futuros.</div>
          </label>

          <label className="block text-sm text-white/70">
            Coleção (opcional)
            <input
              value={data.collection ?? ""}
              onChange={(e) => setField("collection", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="ex.: Barra Mansa"
            />
          </label>

          <label className="block text-sm text-white/70">
            Fonte (opcional)
            <input
              value={data.source ?? ""}
              onChange={(e) => setField("source", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
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
              placeholder="1980"
            />
          </label>

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
              {data.fileUrl ? (
                <a href={data.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-white/70 underline underline-offset-2">
                  Abrir arquivo
                </a>
              ) : null}
            </div>
          </div>

          <ContentPreviewPanel module="documentos" item={previewItem} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur sm:rounded-3xl sm:border sm:bg-black/40">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              if (dirty && !confirmUnsavedChanges()) return;
              router.push("/admin/documentos");
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
        <ContentPreviewPanel module="documentos" item={previewItem} />
      </Modal>
    </div>
  );
}
