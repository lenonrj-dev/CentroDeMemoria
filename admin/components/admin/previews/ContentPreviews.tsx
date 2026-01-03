"use client";

import { useEffect, useState } from "react";
import type { AdminModule } from "../../../lib/public-site";
import { getPublicRoutes } from "../../../lib/public-site";
import type {
  DocumentContent,
  JournalContent,
  PersonalArchiveRecord,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "../../../lib/backend-types";
import { youtubeEmbedUrl, youtubeThumbUrl } from "../../../lib/youtube";
import { formatDate, statusLabel, statusTone } from "../module-list/utils";

export type AnyContent =
  | DocumentContent
  | JournalContent
  | PhotoArchiveContent
  | ReferenceContent
  | TestimonialContent
  | PersonalArchiveRecord;

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">{children}</span>;
}

export function CardPreview({
  module,
  item,
  size,
}: {
  module: AdminModule;
  item: AnyContent;
  size: "sm" | "lg";
}) {
  const routes = getPublicRoutes(module, {
    slug: item.slug,
    tags: item.tags || [],
    relatedFundKey: item.relatedFundKey,
    relatedPersonSlug: item.relatedPersonSlug,
  });
  const personal = module === "acervos-pessoais" ? (item as PersonalArchiveRecord) : null;
  const hero = personal && typeof personal.content === "object" ? (personal.content as any)?.hero : null;
  const cover =
    module === "depoimentos"
      ? (() => {
          const t = item as TestimonialContent;
          return t.coverImageUrl || t.imageUrl || (t.youtubeId ? youtubeThumbUrl(t.youtubeId) : "");
        })()
      : module === "acervos-pessoais"
        ? hero?.cover || hero?.portrait || item.coverImageUrl
        : item.coverImageUrl;
  const displayTitle = item.title || hero?.name || "(sem titulo)";
  const displayDescription = item.description || hero?.summary || "";
  return (
    <div className={size === "sm" ? "max-w-sm" : "max-w-xl"}>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className={size === "sm" ? "h-36" : "h-48"}>
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt={item.title || "cover"} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-black/40 text-xs text-white/50">Sem imagem de capa</div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="line-clamp-1 text-sm font-semibold text-white/90">{displayTitle}</div>
            <span
              className={
                "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] " +
                (statusTone(item.status) === "emerald"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                  : statusTone(item.status) === "amber"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-100"
                    : "border-white/10 bg-white/5 text-white/70")
              }
            >
              {statusLabel(item.status)}
            </span>
          </div>
          <div className="mt-2 line-clamp-2 text-sm text-white/70">{displayDescription || "-"}</div>
          {(item.tags || []).length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {(item.tags || []).slice(0, 8).map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>
          ) : null}
          <div className="mt-4">
            <div className="text-[11px] text-white/55">Aparece em:</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {routes.length ? routes.slice(0, 3).map((r) => <Pill key={r.path}>{r.path}</Pill>) : <span className="text-xs text-white/40">—</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-white/55">
        Card usa: <span className="text-white/70">coverImageUrl, title, description, tags</span>.
      </div>
    </div>
  );
}

export function ReadingPreview({ module, item }: { module: AdminModule; item: AnyContent }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [zoom, setZoom] = useState(100);
  const [journalPageIndex, setJournalPageIndex] = useState(0);
  const [youtubeLoaded, setYoutubeLoaded] = useState(false);

  useEffect(() => {
    setYoutubeLoaded(false);
  }, [item]);

  const wrapperClass = device === "mobile" ? "mx-auto w-[360px] max-w-full" : "w-full";
  const personal = module === "acervos-pessoais" ? (item as PersonalArchiveRecord) : null;
  const personalContent = personal && typeof personal.content === "object" ? (personal.content as any) : null;
  const hero = personalContent?.hero || null;

  const header = (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-white/60">Prévia da leitura</div>
          <h3 className="mt-1 text-lg font-semibold text-white">{item.title || "(sem título)"}</h3>
          <p className="mt-2 text-sm text-white/70">{item.description || "—"}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/60">
            {item.publishedAt ? <Pill>Publicado: {formatDate(item.publishedAt)}</Pill> : <Pill>Status: {statusLabel(item.status)}</Pill>}
            {item.tags?.slice(0, 6).map((t) => <Pill key={t}>{t}</Pill>)}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="inline-flex overflow-hidden rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={"px-3 py-1.5 text-xs " + (device === "desktop" ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5")}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={"px-3 py-1.5 text-xs " + (device === "mobile" ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5")}
            >
              Mobile
            </button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
            <div className="text-[11px] text-white/60">Zoom: {zoom}%</div>
            <input
              type="range"
              min={60}
              max={160}
              step={10}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="mt-2 w-44 max-w-full accent-white/80"
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (module === "acervos-pessoais") {
    const cover = hero?.cover || item.coverImageUrl || "";
    const portrait = hero?.portrait || "";
    const gallery = Array.isArray(personalContent?.gallery) ? personalContent.gallery : [];
    const timeline = Array.isArray(personalContent?.timeline) ? personalContent.timeline : [];
    const documents = Array.isArray(personalContent?.documents) ? personalContent.documents : [];
    const interviews = Array.isArray(personalContent?.interviews) ? personalContent.interviews : [];
    const quote = personalContent?.quote;

    return (
      <div className={wrapperClass}>
        {header}
        <div className="mt-4 grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="grid gap-4 sm:grid-cols-[140px,1fr]">
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                {portrait || cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={portrait || cover} alt={hero?.name || item.title || "capa"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/50">Sem imagem</div>
                )}
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-white/90">{hero?.name || item.title || "(sem titulo)"}</div>
                <div className="text-sm text-white/70">{hero?.summary || item.description || "-"}</div>
                {Array.isArray(hero?.roles) && hero.roles.length ? (
                  <div className="flex flex-wrap gap-2 text-[11px] text-white/60">
                    {hero.roles.slice(0, 4).map((role: string) => (
                      <Pill key={role}>{role}</Pill>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {gallery.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Galeria</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.slice(0, 6).map((g: any, idx: number) => (
                  <div key={`${g.src}-${idx}`} className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={g.src} alt={g.alt || ""} className="h-32 w-full object-cover" />
                    {g.alt ? <div className="px-3 py-2 text-xs text-white/70">{g.alt}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {timeline.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Linha do tempo</div>
              <ul className="mt-3 grid gap-2">
                {timeline.slice(0, 6).map((entry: any, idx: number) => (
                  <li key={`${entry.year}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80">
                    <span className="text-white/60">{entry.year}</span> - {entry.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {documents.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Documentos</div>
              <ul className="mt-3 grid gap-2">
                {documents.slice(0, 6).map((doc: any, idx: number) => (
                  <li key={`${doc.href}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80">
                    <div className="font-medium text-white/90">{doc.title}</div>
                    <div className="text-xs text-white/60">{doc.meta || doc.href}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {interviews.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Entrevistas</div>
              <ul className="mt-3 grid gap-2">
                {interviews.slice(0, 6).map((intv: any, idx: number) => (
                  <li key={`${intv.href}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80">
                    <div className="font-medium text-white/90">{intv.title}</div>
                    <div className="text-xs text-white/60">{intv.meta || intv.href}</div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {quote?.text ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Depoimento</div>
              <div className="mt-2 text-sm text-white/80">"{quote.text}"</div>
              {(quote.author || quote.note) && (
                <div className="mt-2 text-xs text-white/60">
                  {[quote.author, quote.note].filter(Boolean).join(" - ")}
                </div>
              )}
            </div>
          ) : null}

          {!gallery.length && !timeline.length && !documents.length && !interviews.length && !quote?.text ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Sem conteudo editorial cadastrado. Atualize o campo content no admin.
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (module === "documentos") {
    const doc = item as DocumentContent;
    const hasFile = !!doc.fileUrl;
    const images = Array.isArray(doc.images) ? doc.images : [];
    return (
      <div className={wrapperClass}>
        {header}
        <div className="mt-4 grid gap-4">
          {hasFile ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">PDF</div>
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <iframe title="PDF" src={doc.fileUrl as string} className="h-[520px] w-full" />
              </div>
              <a href={doc.fileUrl as string} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-white/70 underline underline-offset-2">
                Abrir em nova aba
              </a>
            </div>
          ) : null}

          {images.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Páginas em imagem</div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {images.slice(0, 6).map((url) => (
                  <div key={url} className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="w-full object-contain"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                    />
                  </div>
                ))}
              </div>
              {images.length > 6 ? <div className="mt-2 text-xs text-white/50">+{images.length - 6} imagens</div> : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  if (module === "jornais") {
    const j = item as JournalContent;
    const pages = Array.isArray(j.pages) ? j.pages : [];
    const selected = pages[journalPageIndex] || pages[0];
    return (
      <div className={wrapperClass}>
        {header}
        <div className="mt-4 grid gap-4">
          {pages.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white/90">Leitor de páginas</div>
                <div className="text-xs text-white/60">
                  Página {selected?.pageNumber ?? journalPageIndex + 1} de {pages.length}
                </div>
              </div>
              <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_220px]">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  {selected?.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selected.imageUrl}
                      alt=""
                      className="w-full object-contain"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                    />
                  ) : (
                    <div className="p-6 text-sm text-white/60">Sem página</div>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="text-xs text-white/60">Miniaturas</div>
                  <div className="grid max-h-[420px] gap-2 overflow-y-auto pr-1">
                    {pages.slice(0, 24).map((p, idx) => (
                      <button
                        key={`${p.pageNumber}-${p.imageUrl}`}
                        type="button"
                        onClick={() => setJournalPageIndex(idx)}
                        className={
                          "overflow-hidden rounded-xl border text-left " +
                          (idx === journalPageIndex ? "border-white/30 bg-white/10" : "border-white/10 bg-black/30 hover:bg-white/5")
                        }
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.thumbUrl || p.imageUrl} alt="" className="h-24 w-full object-cover" />
                        <div className="px-2 py-1 text-[11px] text-white/70">Página {p.pageNumber}</div>
                      </button>
                    ))}
                    {pages.length > 24 ? <div className="text-xs text-white/45">+{pages.length - 24} páginas</div> : null}
                  </div>
                </div>
              </div>
              {j.pdfUrl ? (
                <a href={j.pdfUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-white/70 underline underline-offset-2">
                  Abrir PDF (alternativa)
                </a>
              ) : null}
            </div>
          ) : j.pdfUrl ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">PDF</div>
              <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <iframe title="PDF" src={j.pdfUrl} className="h-[520px] w-full" />
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">Sem pages[] e sem pdfUrl.</div>
          )}
        </div>
      </div>
    );
  }

  if (module === "acervo-fotografico") {
    const p = item as PhotoArchiveContent;
    const photos = Array.isArray(p.photos) ? p.photos : [];
    return (
      <div className={wrapperClass}>
        {header}
        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white/90">Galeria</div>
          {photos.length ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photos.slice(0, 12).map((ph) => (
                <div key={ph.imageUrl} className="overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ph.imageUrl} alt={ph.caption || ""} className="h-40 w-full object-cover" />
                  <div className="px-3 py-2">
                    {ph.caption ? <div className="line-clamp-2 text-xs text-white/80">{ph.caption}</div> : null}
                    <div className="mt-1 text-[11px] text-white/55">{[ph.date, ph.location].filter(Boolean).join(" • ")}</div>
                  </div>
                </div>
              ))}
              {photos.length > 12 ? <div className="text-xs text-white/45">+{photos.length - 12} fotos</div> : null}
            </div>
          ) : (
            <div className="mt-2 text-sm text-white/60">Sem fotos.</div>
          )}
        </div>
      </div>
    );
  }

  if (module === "depoimentos") {
    const t = item as TestimonialContent;
    const mediaType = t.mediaType || (t.youtubeId ? "youtube" : t.imageUrl || t.coverImageUrl ? "image" : "text");
    const imageUrl = t.imageUrl || t.coverImageUrl || "";
    const attachments = Array.isArray(t.attachments) ? t.attachments : [];
    return (
      <div className={wrapperClass}>
        {header}
        <div className="mt-4 grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-white/90">Depoimento</div>
            <div className="mt-2 text-xs text-white/60">{t.authorName ? `${t.authorName}${t.authorRole ? ` — ${t.authorRole}` : ""}` : "Autor não informado"}</div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              {mediaType === "youtube" && t.youtubeId ? (
                <div className="relative aspect-video w-full">
                  {!youtubeLoaded && <div className="absolute inset-0 animate-pulse bg-white/5" />}
                  <iframe
                    title={t.title ? `Video: ${t.title}` : "Video do YouTube"}
                    src={youtubeEmbedUrl(t.youtubeId)}
                    className="h-full w-full"
                    loading="lazy"
                    onLoad={() => setYoutubeLoaded(true)}
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                </div>
              ) : mediaType === "image" && imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={t.title || "imagem"} className="h-56 w-full object-cover" />
              ) : (
                <div className="p-4 text-xs text-white/60">Sem midia vinculada.</div>
              )}
            </div>
            <div className="mt-3 whitespace-pre-wrap text-sm text-white/75">{t.testimonialText || "—"}</div>
          </div>
          {attachments.length ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <div className="text-sm font-semibold text-white/90">Anexos</div>
              <ul className="mt-3 grid gap-2">
                {attachments.map((a, idx) => (
                  <li key={`${a.url}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80">
                    <a href={a.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                      {a.label || a.url}
                    </a>
                    <span className="ml-2 text-xs text-white/50">({a.type})</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  // referências
  const r = item as ReferenceContent;
  const attachments = Array.isArray(r.attachments) ? r.attachments : [];
  return (
    <div className={wrapperClass}>
      {header}
      <div className="mt-4 grid gap-4">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-sm font-semibold text-white/90">Citação</div>
          <div className="mt-3 text-sm text-white/80">{r.citation || "—"}</div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-white/60">
            {Array.isArray(r.authors) && r.authors.length ? <Pill>{r.authors.join(", ")}</Pill> : null}
            {r.year ? <Pill>{r.year}</Pill> : null}
            {r.isbn ? <Pill>ISBN {r.isbn}</Pill> : null}
          </div>
          {r.externalUrl ? (
            <a href={r.externalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs text-white/70 underline underline-offset-2">
              Abrir link externo
            </a>
          ) : null}
        </div>
        {attachments.length ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="text-sm font-semibold text-white/90">Anexos</div>
            <ul className="mt-3 grid gap-2">
              {attachments.map((a, idx) => (
                <li key={`${a.url}-${idx}`} className="rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80">
                  <a href={a.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                    {a.label || a.url}
                  </a>
                  <span className="ml-2 text-xs text-white/50">({a.type})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
