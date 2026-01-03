"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { ContentStatus, PersonalArchiveRecord } from "../../../lib/backend-types";
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
import { joinCsv, splitCsv } from "./common";
import { useSlugAvailability } from "./useSlugAvailability";

type Props = { id?: string };

const CONTENT_TEMPLATE = {
  hero: {
    label: "Acervo Pessoal",
    name: "",
    roles: [],
    summary: "",
    biography: "",
    cover: "",
    portrait: "",
    stats: [],
    primaryCta: { label: "Explorar acervo", href: "/acervo" },
    secondaryCta: { label: "Acesso a Informacao", href: "/acesso-a-informacao" },
  },
};

const empty: Partial<PersonalArchiveRecord> = {
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
  content: CONTENT_TEMPLATE,
};

export default function PersonalArchiveForm({ id }: Props) {
  const router = useRouter();
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();

  const [data, setData] = useState<Partial<PersonalArchiveRecord>>(empty);
  const [contentRaw, setContentRaw] = useState<string>(JSON.stringify(CONTENT_TEMPLATE, null, 2));
  const [initialSnapshot, setInitialSnapshot] = useState<string>("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<PersonalArchiveRecord>(`/api/admin/acervos-pessoais/${id}`, token || undefined);
        if (!cancelled) {
          setData(res.data);
          setContentRaw(JSON.stringify(res.data.content || CONTENT_TEMPLATE, null, 2));
          setInitialSnapshot(JSON.stringify(snapshot(res.data, res.data.content || CONTENT_TEMPLATE)));
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

  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);
  const publicRoutes = useMemo(() => {
    if (!data.slug) return [];
    return getPublicRoutes("acervos-pessoais", {
      slug: data.slug,
      tags: data.tags || [],
      relatedFundKey: data.relatedFundKey,
      relatedPersonSlug: data.relatedPersonSlug,
    });
  }, [data.slug, data.tags, data.relatedFundKey, data.relatedPersonSlug]);

  const slugStatus = useMemo(() => getSlugStatus(data.slug ?? ""), [data.slug]);
  const slugCheck = useSlugAvailability("acervos-pessoais", slugStatus.slug, id);
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

  const setField = <K extends keyof PersonalArchiveRecord>(key: K, value: PersonalArchiveRecord[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  function parseContent(raw: string) {
    if (!raw.trim()) return null;
    return JSON.parse(raw);
  }

  function snapshot(d: Partial<PersonalArchiveRecord>, content: unknown) {
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
      content: content ?? CONTENT_TEMPLATE,
    };
  }

  const parsedContent = useMemo(() => {
    try {
      return parseContent(contentRaw) || CONTENT_TEMPLATE;
    } catch {
      return null;
    }
  }, [contentRaw]);

  const currentSnapshot = useMemo(
    () => JSON.stringify(snapshot(data, parsedContent || CONTENT_TEMPLATE)),
    [data, parsedContent]
  );
  const dirty = useMemo(() => {
    const base = initialSnapshot || JSON.stringify(snapshot(empty, CONTENT_TEMPLATE));
    return currentSnapshot !== base;
  }, [currentSnapshot, initialSnapshot]);

  useUnsavedChanges(dirty && !saving);

  const save = async (status: ContentStatus) => {
    if (slugBlocker) {
      setError({ message: slugBlocker });
      return;
    }
    let contentValue: any;
    try {
      contentValue = parseContent(contentRaw) || CONTENT_TEMPLATE;
    } catch {
      setError({ message: "JSON invalido no campo content. Revise antes de salvar." });
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
        content: contentValue,
      };

      if (id) {
        await apiPatch<PersonalArchiveRecord>(`/api/admin/acervos-pessoais/${id}`, payload, token || undefined);
      } else {
        await apiPost<PersonalArchiveRecord>("/api/admin/acervos-pessoais", payload, token || undefined);
      }

      setFlashToast({
        type: "success",
        title: status === "published" ? "Publicado" : "Salvo",
        message: status === "published" ? "Acervo pessoal publicado." : "Rascunho salvo.",
      });
      router.replace("/admin/acervos-pessoais");
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const previewItem: PersonalArchiveRecord = useMemo(
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
      content: (parsedContent || CONTENT_TEMPLATE) as any,
    }),
    [data, id, parsedContent]
  );

  if (loading) return <div className="text-sm text-white/70">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-white">{id ? "Editar acervo pessoal" : "Novo acervo pessoal"}</h1>
          <p className="mt-1 text-sm text-white/70">Pagina editorial completa (hero, galeria, timeline, documentos).</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (dirty && !confirmUnsavedChanges()) return;
            router.push("/admin/acervos-pessoais");
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
            Titulo
            <input
              value={data.title ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setField("title", v as any);
                if (!slugTouched) setField("slug", slugify(v) as any);
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Ex.: Acervo Dom Waldyr"
              required
            />
            <div className="mt-1 text-xs text-white/50">Nome exibido nos cards e no topo da pagina.</div>
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
                placeholder="dom-waldyr"
              />
              <div className="mt-1 text-xs text-white/50">Usado na rota /acervo-pessoal/[slug].</div>
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
              Status
              <select
                value={(data.status ?? "draft") as any}
                onChange={(e) => setField("status", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              >
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="archived">Arquivado</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-white/70">
            Descricao
            <textarea
              value={data.description ?? ""}
              onChange={(e) => setField("description", e.target.value as any)}
              className="mt-1 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Resumo exibido nos cards e na pagina."
              required
            />
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
          </label>

          <label className="block text-sm text-white/70">
            Conteudo (JSON)
            <textarea
              value={contentRaw}
              onChange={(e) => setContentRaw(e.target.value)}
              className="mt-1 min-h-[320px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder='{"hero": {"name": "Dom Waldyr", "summary": "..."}}'
            />
            <div className="mt-1 text-xs text-white/50">Cole o JSON completo com hero, galeria, timeline, etc.</div>
            {!parsedContent ? <div className="mt-2 text-xs text-red-200">JSON invalido.</div> : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setContentRaw(JSON.stringify(CONTENT_TEMPLATE, null, 2))}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              >
                Restaurar modelo
              </button>
            </div>
          </label>
        </div>

        <div className="space-y-4 lg:col-span-4">
          <label className="block text-sm text-white/70">
            Tags (CSV)
            <input
              value={tagsCsv}
              onChange={(e) => setField("tags", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="dom-waldyr, memoria, pastoral"
            />
          </label>

          <label className="block text-sm text-white/70">
            Pessoa relacionada (slug)
            <input
              value={data.relatedPersonSlug ?? ""}
              onChange={(e) => setField("relatedPersonSlug", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="dom-waldyr"
            />
            <div className="mt-1 text-xs text-white/50">Usado para relacionar conteudo do acervo.</div>
          </label>

          <label className="block text-sm text-white/70">
            Fundo relacionado (chave)
            <input
              value={data.relatedFundKey ?? ""}
              onChange={(e) => setField("relatedFundKey", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="dom-waldyr"
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
            <div className="text-sm font-semibold text-white/90">Rota no site</div>
            {publicRoutes.length ? (
              <div className="mt-2 space-y-1 text-xs text-white/70">
                {publicRoutes.slice(0, 2).map((r) => (
                  <a key={r.path} href={r.url} target="_blank" rel="noreferrer" className="block underline underline-offset-2">
                    {r.path}
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-2 text-xs text-white/60">Defina titulo/slug para ver as rotas.</div>
            )}
          </div>

          <ContentPreviewPanel module="acervos-pessoais" item={previewItem} />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur sm:rounded-3xl sm:border sm:bg-black/40">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              if (dirty && !confirmUnsavedChanges()) return;
              router.push("/admin/acervos-pessoais");
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
            Pre-visualizar
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

      <Modal open={previewOpen} title="Pre-visualizacao" onClose={() => setPreviewOpen(false)} size="xl">
        <ContentPreviewPanel module="acervos-pessoais" item={previewItem} />
      </Modal>
    </div>
  );
}
