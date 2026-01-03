"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { BaseContent } from "../../../lib/backend-types";
import { apiGet } from "../../../lib/backend-client";
import type { AdminModule } from "../../../lib/public-site";
import type { NormalizedApiError } from "../../../lib/api-errors";
import { getPublicRoutes, publicUrl } from "../../../lib/public-site";
import { MODULE_SITE_MAP, getModuleMap } from "../../../lib/site-map";
import { useAdminAuth } from "../../../components/admin/AdminAuthProvider";
import { useAdminOverview } from "../../../components/admin/AdminOverviewProvider";
import { FormErrorSummary } from "../../../components/admin/forms/FormErrorSummary";
import { useApiErrorHandler } from "../../../components/admin/useApiErrorHandler";

const MODULES: Array<{
  module: AdminModule;
  label: string;
  adminListHref: string;
  adminNewHref: string;
  publicListPath: string;
}> = [
  { module: "documentos", label: "Documentos", adminListHref: "/admin/documentos", adminNewHref: "/admin/documentos/new", publicListPath: "/acervo/documentos" },
  { module: "depoimentos", label: "Depoimentos", adminListHref: "/admin/depoimentos", adminNewHref: "/admin/depoimentos/new", publicListPath: "/acervo/entrevistas" },
  { module: "referencias", label: "Referência bibliográfica", adminListHref: "/admin/referencias", adminNewHref: "/admin/referencias/new", publicListPath: "/producao-bibliografica" },
  { module: "jornais", label: "Jornais de época", adminListHref: "/admin/jornais", adminNewHref: "/admin/jornais/new", publicListPath: "/jornais-de-epoca" },
  { module: "acervo-fotografico", label: "Acervo fotográfico", adminListHref: "/admin/acervo-fotografico", adminNewHref: "/admin/acervo-fotografico/new", publicListPath: "/acervo/fotos" },
  { module: "acervos-pessoais", label: "Acervos pessoais", adminListHref: "/admin/acervos-pessoais", adminNewHref: "/admin/acervos-pessoais/new", publicListPath: "/acervo-pessoal" },
];

function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(d);
}

function MetricCard({
  module,
  label,
  total,
  published,
  drafts,
  archived,
  lastUpdated,
  lastPublished,
  adminListHref,
  adminNewHref,
  publicListPath,
}: {
  module: AdminModule;
  label: string;
  total: number;
  published: number;
  drafts: number;
  archived: number;
  lastUpdated?: { id: string; title: string; updatedAt?: string };
  lastPublished?: { slug: string; publishedAt?: string | null };
  adminListHref: string;
  adminNewHref: string;
  publicListPath: string;
}) {
  const hasExample = !!lastPublished?.slug;
  const exampleUrl = hasExample ? getPublicRoutes(module, { slug: lastPublished!.slug, tags: [] })[0]?.url : null;
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white">{label}</div>
          <div className="mt-1 text-xs text-white/60">
            Total <span className="text-white/85">{total}</span> • Publicados <span className="text-white/85">{published}</span> • Rascunhos{" "}
            <span className="text-white/85">{drafts}</span> • Arquivados <span className="text-white/85">{archived}</span>
          </div>
        </div>
        <a
          href={publicUrl(publicListPath)}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
        >
          Ver no site
        </a>
      </div>

      {lastUpdated ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-3">
          <div className="text-[11px] text-white/55">Última atualização</div>
          <div className="mt-1 line-clamp-1 text-sm font-medium text-white/90">{lastUpdated.title}</div>
          <div className="mt-1 text-xs text-white/55">{formatDate(lastUpdated.updatedAt) || ""}</div>
          <Link
            href={`${adminListHref}/${lastUpdated.id}`}
            className="mt-3 inline-flex rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
          >
            Abrir item
          </Link>
        </div>
      ) : (
        <div className="mt-4 text-sm text-white/60">Nenhum item ainda.</div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={adminNewHref} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15">
          Novo
        </Link>
        <Link href={adminListHref} className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/85 hover:bg-white/5">
          Ver lista
        </Link>
        {hasExample ? (
          <a
            href={exampleUrl || publicUrl(publicListPath)}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/85 hover:bg-white/5"
          >
            Abrir exemplo
          </a>
        ) : (
          <span className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/45">(publique para ter exemplo)</span>
        )}
      </div>
    </div>
  );
}

function IssueList({
  title,
  items,
}: {
  title: string;
  items: Array<{ module: AdminModule; id: string; title: string; slug: string; updatedAt?: string }>;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="text-sm font-semibold text-white">{title}</div>
      {items.length ? (
        <ul className="mt-4 grid gap-2">
          {items.slice(0, 8).map((it) => (
            <li key={`${it.module}-${it.id}`} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-3 py-2">
              <div className="min-w-0">
                <div className="line-clamp-1 text-sm font-medium text-white/90">{it.title}</div>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5">{it.module}</span>
                  {it.slug ? <span className="truncate">{it.slug}</span> : null}
                  {it.updatedAt ? <span className="text-white/45">• {formatDate(it.updatedAt)}</span> : null}
                </div>
              </div>
              <Link
                href={`/admin/${it.module}/${it.id}`}
                className="shrink-0 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                Corrigir agora
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 text-sm text-white/60">Nenhum problema encontrado.</div>
      )}
    </div>
  );
}

export default function AdminHome() {
  const { token } = useAdminAuth();
  const { data, loading, error, refresh } = useAdminOverview();
  const handleApiError = useApiErrorHandler();

  const byModule = useMemo(() => {
    const map = new Map<AdminModule, any>();
    data?.counts?.forEach((c) => map.set(c.module as AdminModule, c));
    return map;
  }, [data]);

  const [locModule, setLocModule] = useState<AdminModule>("documentos");
  const [locItems, setLocItems] = useState<BaseContent[]>([]);
  const [locLoading, setLocLoading] = useState(false);
  const [locItemId, setLocItemId] = useState<string>("");
  const [locError, setLocError] = useState<NormalizedApiError | null>(null);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLocLoading(true);
      setLocError(null);
      try {
        const res = await apiGet<BaseContent[]>(`/api/admin/${locModule}?page=1&limit=60&sort=updated_desc`, token || undefined);
        if (cancelled) return;
        setLocItems(res.data || []);
        setLocItemId((prev) => prev || res.data?.[0]?._id || "");
      } catch (err) {
        if (!cancelled) setLocError(handleApiError(err));
      } finally {
        if (!cancelled) setLocLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locModule, token]);

  useEffect(() => {
    const first = locItems?.[0]?._id;
    if (first && !locItems.some((x) => x._id === locItemId)) setLocItemId(first);
  }, [locItemId, locItems]);

  const selected = useMemo(() => locItems.find((x) => x._id === locItemId) || null, [locItemId, locItems]);
  const selectedRoutes = useMemo(() => {
    if (!selected?.slug) return [];
    return getPublicRoutes(locModule, {
      slug: selected.slug,
      tags: selected.tags || [],
      relatedFundKey: (selected as any).relatedFundKey,
      relatedPersonSlug: (selected as any).relatedPersonSlug,
    });
  }, [locModule, selected]);
  const mapForModule = useMemo(() => getModuleMap(locModule), [locModule]);

  const quality = data?.quality;
  const qualityItems = useMemo(() => {
    if (!quality) return null;
    const flatten = (bucket: any[]) =>
      bucket.flatMap((b) => (b.items || []).map((it: any) => ({ module: b.module as AdminModule, ...it })));
    return {
      missingCover: flatten(quality.missingCover as any),
      shortDescriptions: flatten(quality.shortDescriptions as any),
      documentsWithoutFileOrImages: (quality.documentsWithoutFileOrImages.items || []).map((it: any) => ({ module: "documentos" as AdminModule, ...it })),
      journalsWithoutPagesOrPdf: (quality.journalsWithoutPagesOrPdf.items || []).map((it: any) => ({ module: "jornais" as AdminModule, ...it })),
      photoArchivesWithFewPhotos: (quality.photoArchivesWithFewPhotos.items || []).map((it: any) => ({ module: "acervo-fotografico" as AdminModule, ...it })),
      referencesMissingYearOrCitation: (quality.referencesMissingYearOrCitation.items || []).map((it: any) => ({ module: "referencias" as AdminModule, ...it })),
      testimonialsMissingAuthorOrShortText: (quality.testimonialsMissingAuthorOrShortText.items || []).map((it: any) => ({ module: "depoimentos" as AdminModule, ...it })),
    };
  }, [quality]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-white">Mapa do Site</h1>
          <p className="mt-1 text-sm text-white/70">Gestão editorial, rotas públicas e visão do banco em tempo real.</p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/85 hover:bg-white/5"
        >
          Atualizar
        </button>
      </div>

      {error ? <FormErrorSummary error={error} /> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {MODULES.map((m) => {
          const c = byModule.get(m.module);
          return (
            <MetricCard
              key={m.module}
              module={m.module}
              label={m.label}
              total={c?.total ?? 0}
              published={c?.published ?? 0}
              drafts={c?.drafts ?? 0}
              archived={c?.archived ?? 0}
              lastUpdated={c?.lastUpdated ? { id: c.lastUpdated.id, title: c.lastUpdated.title, updatedAt: c.lastUpdated.updatedAt } : undefined}
              lastPublished={c?.lastPublished ? { slug: c.lastPublished.slug, publishedAt: c.lastPublished.publishedAt } : undefined}
              adminListHref={m.adminListHref}
              adminNewHref={m.adminNewHref}
              publicListPath={m.publicListPath}
            />
          );
        })}
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-base font-semibold text-white">Localização no site</h2>
        <p className="mt-1 text-sm text-white/70">Onde cada módulo aparece e quais campos são usados no card e na leitura.</p>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="text-xs text-white/60">
              <tr>
                <th className="px-4 py-3">Módulo</th>
                <th className="px-4 py-3">Rota pública</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Campos do card</th>
                <th className="px-4 py-3">Campos da leitura</th>
                <th className="px-4 py-3">Exemplo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {MODULE_SITE_MAP.map((m) =>
                m.placements.map((p) => {
                  const lastSlug = byModule.get(m.module)?.lastPublished?.slug as string | undefined;
                  const example = lastSlug ? getPublicRoutes(m.module, { slug: lastSlug, tags: [] })[0]?.url : null;
                  return (
                    <tr key={`${m.module}-${p.path}`} className="text-white/80">
                      <td className="px-4 py-3 text-sm font-medium text-white/90">{m.label}</td>
                      <td className="px-4 py-3">
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-white/70 underline underline-offset-2">
                          {p.path}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-xs text-white/60">{p.displayType}</td>
                      <td className="px-4 py-3 text-xs text-white/60">{p.cardFields.join(", ")}</td>
                      <td className="px-4 py-3 text-xs text-white/60">{p.readingFields.join(", ")}</td>
                      <td className="px-4 py-3">
                        {example ? (
                          <a href={example} target="_blank" rel="noreferrer" className="text-xs text-white/70 underline underline-offset-2">
                            Abrir
                          </a>
                        ) : (
                          <span className="text-xs text-white/40">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-semibold text-white/90">Onde este item aparece</div>
            <div className="mt-3">
              <FormErrorSummary error={locError} />
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <label className="text-xs text-white/60">
                Módulo
                <select
                  value={locModule}
                  onChange={(e) => setLocModule(e.target.value as AdminModule)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {MODULES.map((m) => (
                    <option key={m.module} value={m.module}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs text-white/60">
                Item
                <select
                  value={locItemId}
                  onChange={(e) => setLocItemId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {locLoading ? <option value="">Carregando...</option> : null}
                  {(locItems || []).map((it) => (
                    <option key={it._id} value={it._id}>
                      {it.title || it.slug || it._id}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {selected ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-white/60">Aparece em:</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedRoutes.length ? (
                      selectedRoutes.map((r) => (
                        <a key={r.path} href={r.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15">
                          {r.path}
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-white/60">Defina tags/slug para calcular as rotas.</span>
                    )}
                  </div>
                </div>

                {mapForModule ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/60">Como aparece (por módulo):</div>
                    <ul className="mt-2 space-y-1 text-sm text-white/80">
                      {mapForModule.placements.map((p) => (
                        <li key={p.path} className="flex items-start justify-between gap-3">
                          <span className="text-white/75">{p.label}</span>
                          <span className="text-xs text-white/55">{p.displayType}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/${locModule}/${selected._id}`} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
                    Editar item
                  </Link>
                  {selected.status === "published" && selectedRoutes[0] ? (
                    <a href={selectedRoutes[0].url} target="_blank" rel="noreferrer" className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white/85 hover:bg-white/5">
                      Abrir no site
                    </a>
                  ) : (
                    <span className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white/45">(publique para abrir no site)</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="mt-4 text-sm text-white/60">Selecione um item para ver onde ele aparece.</div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-semibold text-white/90">Próximos passos</div>
            <div className="mt-2 text-sm text-white/70">Atalhos para manter o site “cheio” e consistente.</div>
            <div className="mt-4 grid gap-2">
              {MODULES.map((m) => (
                <Link key={m.module} href={m.adminNewHref} className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15">
                  Criar novo: {m.label}
                </Link>
              ))}
            </div>
            {data?.suggestions?.length ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-white/60">Sugestões (checklist)</div>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/75">
                  {data.suggestions.slice(0, 8).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-base font-semibold text-white">Qualidade do conteúdo</h2>
        <p className="mt-1 text-sm text-white/70">Alertas acionáveis para o banco ficar pronto para o site público.</p>

        {!data && loading ? <div className="mt-4 text-sm text-white/70">Carregando...</div> : null}

        {qualityItems ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <IssueList title="Itens sem imagem de capa (coverImageUrl)" items={qualityItems.missingCover as any} />
            <IssueList title="Descrição curta (menos de 80 caracteres)" items={qualityItems.shortDescriptions as any} />
            <IssueList title="Documentos sem fileUrl e sem images[]" items={qualityItems.documentsWithoutFileOrImages as any} />
            <IssueList title="Jornais sem pages[] e sem pdfUrl" items={qualityItems.journalsWithoutPagesOrPdf as any} />
            <IssueList title="Álbuns com menos de 3 fotos" items={qualityItems.photoArchivesWithFewPhotos as any} />
            <IssueList title="Referências sem year ou citation" items={qualityItems.referencesMissingYearOrCitation as any} />
            <IssueList title="Depoimentos sem authorName ou texto curto" items={qualityItems.testimonialsMissingAuthorOrShortText as any} />
          </div>
        ) : (
          <div className="mt-4 text-sm text-white/60">Backend ainda não retorna itens por alerta (quality).</div>
        )}
      </div>
    </div>
  );
}
