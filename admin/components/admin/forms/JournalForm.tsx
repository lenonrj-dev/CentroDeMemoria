"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { ContentStatus, JournalContent, JournalPage } from "../../../lib/backend-types";
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

const emptyPage: JournalPage = { pageNumber: 1, imageUrl: "", thumbUrl: "" };

const empty: Partial<JournalContent> = {
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
  issueDate: new Date().toISOString().slice(0, 10),
  edition: "",
  city: "",
  pdfUrl: "",
  pages: [],
  pagesCount: undefined,
};

const ROUTE_TAG_PRESETS = [
  { tag: "Volta Redonda", label: "Volta Redonda" },
  { tag: "Barra Mansa", label: "Barra Mansa" },
  { tag: "Dom Waldyr", label: "Fundo Dom Waldyr" },
] as const;

const PREVIEW_SIZE_KEY = "sintracon_admin_cover_preview_size_form";

export default function JournalForm({ id }: Props) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();

  const [data, setData] = useState<Partial<JournalContent>>(empty);
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

  function snapshot(d: Partial<JournalContent>) {
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
      issueDate: d.issueDate ?? "",
      edition: d.edition ?? "",
      city: d.city ?? "",
      pdfUrl: d.pdfUrl ?? "",
      pagesCount: d.pagesCount ?? null,
      pages: (d.pages ?? []).map((p) => ({
        pageNumber: Number((p as any).pageNumber ?? 0),
        imageUrl: (p as any).imageUrl ?? "",
        thumbUrl: (p as any).thumbUrl ?? "",
      })),
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
        const res = await apiGet<JournalContent>(`/api/admin/jornais/${id}`, token || undefined);
        const raw = res.data;
        if (cancelled) return;
        const next: JournalContent = {
          ...raw,
          issueDate: raw.issueDate?.slice(0, 10) ?? "",
        };
        setData(next);
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

  const pages = data.pages ?? [];
  const tags = data.tags ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);

  const publicRoutes = useMemo(() => {
    if (!data.slug) return [];
    return getPublicRoutes("jornais", { slug: data.slug, tags });
  }, [data.slug, tags]);

  const slugStatus = useMemo(() => getSlugStatus(data.slug ?? ""), [data.slug]);
  const slugCheck = useSlugAvailability("jornais", slugStatus.slug, id);
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

  const setField = <K extends keyof JournalContent>(key: K, value: JournalContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const togglePresetTag = (tag: string, checked: boolean) => {
    const next = checked ? Array.from(new Set([...tags, tag])) : tags.filter((t) => t !== tag);
    setField("tags", next as any);
  };

  const addPage = () => {
    const nextNumber = pages.length ? Math.max(...pages.map((p) => Number(p.pageNumber || 0))) + 1 : 1;
    setField("pages", [...pages, { ...emptyPage, pageNumber: nextNumber }] as any);
  };

  const updatePage = (idx: number, next: Partial<JournalPage>) => {
    setField(
      "pages",
      pages.map((p, i) => (i === idx ? ({ ...p, ...next } as JournalPage) : p)) as any
    );
  };

  const duplicatePage = (idx: number) => {
    const p = pages[idx];
    if (!p) return;
    const next = pages.slice();
    next.splice(idx + 1, 0, { ...p });
    setField("pages", next as any);
  };

  const removePage = (idx: number) => setField("pages", pages.filter((_, i) => i !== idx) as any);

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
        issueDate: data.issueDate,
        edition: data.edition || undefined,
        city: data.city || undefined,
        pdfUrl: data.pdfUrl || undefined,
        pages: (data.pages ?? [])
          .filter((p) => p.imageUrl)
          .map((p) => ({
            pageNumber: Number(p.pageNumber),
            imageUrl: p.imageUrl,
            thumbUrl: p.thumbUrl || undefined,
          })),
        pagesCount: data.pagesCount ? Number(data.pagesCount) : undefined,
      };

      if (id) {
        await apiPatch<JournalContent>(`/api/admin/jornais/${id}`, payload, token || undefined);
      } else {
        await apiPost<JournalContent>("/api/admin/jornais", payload, token || undefined);
      }

      setFlashToast({
        type: "success",
        title: status === "published" ? "Publicado" : "Salvo",
        message: status === "published" ? "Jornal publicado com sucesso." : "Rascunho salvo com sucesso.",
      });
      router.replace("/admin/jornais");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const previewItem: JournalContent = useMemo(
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
      issueDate: data.issueDate || new Date().toISOString().slice(0, 10),
      edition: data.edition || undefined,
      city: data.city || undefined,
      pdfUrl: data.pdfUrl || undefined,
      pages: (data.pages ?? []) as any,
      pagesCount: data.pagesCount,
    }),
    [data, id]
  );

  if (loading) return <div className="text-sm text-white/70">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">{id ? "Editar jornal" : "Novo jornal"}</h1>
          <p className="mt-1 text-sm text-white/70">Páginas (imagens) e/ou PDF via link. O card usa a imagem de capa.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (dirty && !confirmUnsavedChanges()) return;
            router.push("/admin/jornais");
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
              placeholder="Ex.: Boletim do Sindicato (1984-05)"
              required
            />
            <div className="mt-1 text-xs text-white/50">Nome exibido no card e no topo do leitor. Recom.: até 80 caracteres.</div>
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
                placeholder="boletim-sindicato-1984-05"
              />
              <div className="mt-1 text-xs text-white/50">Gerado pelo titulo. Usado nas rotas de leitura.</div>
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
              Data da edição (issueDate)
              <input
                value={data.issueDate ?? ""}
                onChange={(e) => setField("issueDate", e.target.value as any)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
              <div className="mt-1 text-xs text-white/50">Usada em ordenação e no cabeçalho do leitor.</div>
            </label>
          </div>

          <label className="block text-sm text-white/70">
            Descrição
            <textarea
              value={data.description ?? ""}
              onChange={(e) => setField("description", e.target.value as any)}
              className="mt-1 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Resumo exibido no card e no início da leitura. Contextualize tema e período."
              required
            />
            <div className="mt-1 text-xs text-white/50">Resumo do card (truncado) e abertura do leitor. Ideal: 120–180 caracteres.</div>
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
            <div className="mt-1 text-xs text-white/50">Preview do card. Recom.: 16:9. Use link do Cloudinary.</div>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Edição (opcional)
              <input
                value={data.edition ?? ""}
                onChange={(e) => setField("edition", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex.: Edição especial"
              />
              <div className="mt-1 text-xs text-white/50">Pode aparecer como metadado no leitor.</div>
            </label>

            <label className="block text-sm text-white/70">
              Cidade (opcional)
              <input
                value={data.city ?? ""}
                onChange={(e) => setField("city", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Ex.: Volta Redonda"
              />
              <div className="mt-1 text-xs text-white/50">Ajuda em filtros e contexto editorial.</div>
            </label>
          </div>

          <label className="block text-sm text-white/70">
            PDF (pdfUrl) — opcional
            <input
              value={data.pdfUrl ?? ""}
              onChange={(e) => setField("pdfUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://res.cloudinary.com/.../edicao.pdf"
            />
            <div className="mt-1 text-xs text-white/50">Alternativa para download/visualização. Se vazio, use pages[].</div>
          </label>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white/90">Pages (imagens)</div>
                <div className="mt-1 text-xs text-white/60">Imagens para leitor em alta qualidade. Use thumbUrl para listagens se existir.</div>
              </div>
              <button
                type="button"
                onClick={addPage}
                className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15"
              >
                Adicionar página
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {pages.length ? null : <div className="text-sm text-white/60">Sem pages. Você pode usar apenas PDF.</div>}
              {pages.map((p, idx) => (
                <div key={`${idx}`} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="grid gap-3 sm:grid-cols-[120px_1fr_1fr]">
                    <label className="block text-xs text-white/60">
                      Nº
                      <input
                        value={String(p.pageNumber ?? idx + 1)}
                        onChange={(e) => updatePage(idx, { pageNumber: Number(e.target.value) })}
                        inputMode="numeric"
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      imageUrl
                      <input
                        value={p.imageUrl ?? ""}
                        onChange={(e) => updatePage(idx, { imageUrl: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="https://.../page-01.jpg"
                      />
                    </label>
                    <label className="block text-xs text-white/60">
                      thumbUrl (opcional)
                      <input
                        value={p.thumbUrl ?? ""}
                        onChange={(e) => updatePage(idx, { thumbUrl: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                        placeholder="https://.../thumb-01.jpg"
                      />
                    </label>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-3">
                      <div className="text-[11px] text-white/60">Preview</div>
                      {p.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt={`página ${p.pageNumber}`} className="mt-2 h-44 w-full rounded-2xl object-cover" />
                      ) : (
                        <div className="mt-2 text-xs text-white/50">Sem imageUrl</div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-end justify-end gap-2">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => setField("pages", moveItem(pages, idx, idx - 1) as any)}
                        className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        disabled={idx === pages.length - 1}
                        onClick={() => setField("pages", moveItem(pages, idx, idx + 1) as any)}
                        className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => duplicatePage(idx)}
                        className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
                      >
                        Duplicar
                      </button>
                      <button
                        type="button"
                        onClick={() => removePage(idx)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-50 hover:bg-red-500/15"
                      >
                        Remover
                      </button>
                    </div>
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
              placeholder="jornalismo operário, anos-80"
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
            <div className="mt-1 text-xs text-white/50">Vincula este jornal a um acervo pessoal.</div>
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

          <label className="block text-sm text-white/70">
            pagesCount (opcional)
            <input
              value={data.pagesCount ? String(data.pagesCount) : ""}
              onChange={(e) => setField("pagesCount", (e.target.value ? Number(e.target.value) : undefined) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              inputMode="numeric"
              placeholder="12"
            />
            <div className="mt-1 text-xs text-white/50">Opcional. Pode ser derivado de pages[].</div>
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
              {data.pdfUrl ? (
                <a href={data.pdfUrl} target="_blank" rel="noreferrer" className="text-xs text-white/70 underline underline-offset-2">
                  Abrir PDF
                </a>
              ) : null}
            </div>
          </div>

          <ContentPreviewPanel module="jornais" item={previewItem} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur sm:rounded-3xl sm:border sm:bg-black/40">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              if (dirty && !confirmUnsavedChanges()) return;
              router.push("/admin/jornais");
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
        <ContentPreviewPanel module="jornais" item={previewItem} />
      </Modal>
    </div>
  );
}

