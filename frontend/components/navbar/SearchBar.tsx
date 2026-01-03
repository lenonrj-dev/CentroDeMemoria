"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Images,
  Loader2,
  Mic2,
  Newspaper,
  Search as SearchIcon,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { apiGet } from "../../lib/backend-client";
import type {
  DocumentContent,
  JournalContent,
  PhotoArchiveContent,
  ReferenceContent,
  TestimonialContent,
} from "../../lib/backend-types";
import { searchItems } from "../../app/acervo/api";
import { journalsContent } from "../../app/api/content/journals/data";
import { productionContent } from "../../app/api/content/production/data";
import { personalArchives } from "../../lib/personal-archives";

type CategoryKey =
  | "documentos"
  | "fotos"
  | "jornais"
  | "entrevistas"
  | "referencias"
  | "pessoais";

type SearchResult = {
  id: string;
  title: string;
  meta?: string;
  description?: string;
  href: string;
  category: CategoryKey;
};

type SearchGroup = {
  key: CategoryKey;
  label: string;
  icon: LucideIcon;
  listHref?: string;
  items: SearchResult[];
};

type FlatAction = {
  id: string;
  href: string;
  label: string;
  type: "item" | "all";
};

const CATEGORY_META: Record<CategoryKey, { label: string; icon: LucideIcon; listHref?: string }> = {
  documentos: { label: "Documentos", icon: FileText, listHref: "/acervo/documentos" },
  fotos: { label: "Fotos", icon: Images, listHref: "/acervo/fotos" },
  jornais: { label: "Jornais de época", icon: Newspaper, listHref: "/jornais-de-epoca" },
  entrevistas: { label: "Depoimentos", icon: Mic2, listHref: "/acervo/entrevistas" },
  referencias: { label: "Bibliografia", icon: BookOpen, listHref: "/producao-bibliografica" },
  pessoais: { label: "Acervos pessoais", icon: UserRound, listHref: "/acervo-pessoal" },
};

const CATEGORY_ORDER: CategoryKey[] = [
  "documentos",
  "fotos",
  "jornais",
  "entrevistas",
  "referencias",
  "pessoais",
];

const isoDate = (value?: string | null) =>
  typeof value === "string" && value.length >= 10 ? value.slice(0, 10) : "";

const yearFrom = (value?: string | null) => {
  const year = Number((value || "").slice(0, 4));
  return Number.isFinite(year) && year > 0 ? String(year) : "";
};

function listHrefWithQuery(href: string, term: string) {
  if (!term || href.startsWith("http")) return href;
  const joiner = href.includes("?") ? "&" : "?";
  return `${href}${joiner}q=${encodeURIComponent(term)}`;
}

type SearchBarProps = {
  placeholder?: string;
  compact?: boolean;
  className?: string;
};

export default function SearchBar({
  placeholder = "Buscar no acervo.",
  compact = false,
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const locale = useLocale();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<SearchGroup[]>([]);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const prefixHref = (href: string) => {
    if (!href.startsWith("/") || href.startsWith("//")) return href;
    const parts = href.split("/");
    const first = parts[1];
    if (["pt-BR", "pt-PT", "es", "en"].includes(first)) return href;
    return `/${locale}${href}`;
  };

  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 240);
    return () => clearTimeout(t);
  }, [q]);

  const actions = useMemo<FlatAction[]>(() => {
    const flat: FlatAction[] = [];
    groups.forEach((group) => {
      group.items.forEach((item) =>
        flat.push({ id: item.id, href: item.href, label: item.title, type: "item" })
      );
      if (group.listHref) {
        flat.push({
          id: `${group.key}-all`,
          href: listHrefWithQuery(group.listHref, debounced),
          label: `Ver todos ${group.label}`,
          type: "all",
        });
      }
    });
    return flat;
  }, [groups, debounced]);

  useEffect(() => {
    if (!debounced) {
      setGroups([]);
      setLoading(false);
      setActive(-1);
      return;
    }

    let cancelled = false;
    const term = debounced.toLowerCase();

    const fallbackFromAcervo = searchItems(term);
    const fallbackDocs = fallbackFromAcervo.filter((it) =>
      ["documentos", "cartazes"].includes(it.collection)
    );
    const fallbackEntrevistas = fallbackFromAcervo.filter((it) => it.collection === "entrevistas");
    const fallbackFotos = fallbackFromAcervo.filter((it) => it.collection === "fotos");
    const fallbackJornais = journalsContent.editions.filter((it) =>
      `${it.title} ${it.summary} ${it.decade}`.toLowerCase().includes(term)
    );
    const fallbackRefs = productionContent.items.filter((it) =>
      `${it.title} ${it.abstract} ${it.tags.join(" ")}`.toLowerCase().includes(term)
    );
    const fallbackPessoais = personalArchives.filter((it) =>
      `${it.name} ${it.summary} ${(it.tags || []).join(" ")}`.toLowerCase().includes(term)
    );

    (async () => {
      setLoading(true);
      try {
        const [docsRes, fotosRes, jornaisRes, depsRes, refsRes] = await Promise.all([
          apiGet<DocumentContent[]>(`/api/documentos?page=1&limit=6&q=${encodeURIComponent(term)}`).catch(() => null),
          apiGet<PhotoArchiveContent[]>(`/api/acervo-fotografico?page=1&limit=6&q=${encodeURIComponent(term)}`).catch(() => null),
          apiGet<JournalContent[]>(`/api/jornais?page=1&limit=6&q=${encodeURIComponent(term)}`).catch(() => null),
          apiGet<TestimonialContent[]>(`/api/depoimentos?page=1&limit=6&q=${encodeURIComponent(term)}`).catch(() => null),
          apiGet<ReferenceContent[]>(`/api/referencias?page=1&limit=6&q=${encodeURIComponent(term)}`).catch(() => null),
        ]);

        const docsRemote = docsRes?.data ?? [];
        const fotosRemote = fotosRes?.data ?? [];
        const jornaisRemote = jornaisRes?.data ?? [];
        const depsRemote = depsRes?.data ?? [];
        const refsRemote = refsRes?.data ?? [];

        const docItems =
          docsRemote.length > 0
            ? docsRemote.map((d) => {
                const date = d.year ? String(d.year) : isoDate(d.publishedAt || d.createdAt || d.updatedAt);
                return {
                  id: `doc-${d.slug}`,
                  title: d.title,
                  meta: date ? `Documento - ${date}` : "Documento",
                  description: d.description,
                  href: `/acervo/documentos/${d.slug}`,
                  category: "documentos" as const,
                };
              })
            : fallbackDocs.map((d) => ({
                id: `doc-${d.slug}`,
                title: d.title,
                meta: d.date ? `Documento - ${d.date}` : "Documento",
                description: d.summary,
                href: `/acervo/documentos/${d.slug}`,
                category: "documentos" as const,
              }));

        const fotoItems =
          fotosRemote.length > 0
            ? fotosRemote.map((a) => {
                const date =
                  isoDate(a.photos?.[0]?.date) ||
                  isoDate(a.publishedAt || a.createdAt || a.updatedAt) ||
                  yearFrom(a.photos?.[0]?.date);
                return {
                  id: `foto-${a.slug}`,
                  title: a.title,
                  meta: date ? `Foto - ${date}` : "Foto",
                  description: a.description,
                  href: `/acervo/fotos/${a.slug}`,
                  category: "fotos" as const,
                };
              })
            : fallbackFotos.map((a) => ({
                id: `foto-${a.slug}`,
                title: a.title,
                meta: a.date ? `Foto - ${a.date}` : "Foto",
                description: a.summary,
                href: `/acervo/fotos/${a.slug}`,
                category: "fotos" as const,
              }));

        const jornalItems =
          jornaisRemote.length > 0
            ? jornaisRemote.map((j) => {
                const date = isoDate(j.issueDate || j.publishedAt || j.createdAt || j.updatedAt);
                return {
                  id: `jor-${j.slug}`,
                  title: j.title,
                  meta: date ? `Jornal - ${date}` : "Jornal",
                  description: j.description,
                  href: `/jornais-de-epoca/${j.slug}`,
                  category: "jornais" as const,
                };
              })
            : fallbackJornais.map((j) => ({
                id: `jor-${j.slug}`,
                title: j.title,
                meta: j.date ? `Jornal - ${j.date}` : "Jornal",
                description: j.summary,
                href: `/jornais-de-epoca/${j.slug}`,
                category: "jornais" as const,
              }));

        const depoItems =
          depsRemote.length > 0
            ? depsRemote.map((t) => {
                const date = isoDate(t.date || t.publishedAt || t.createdAt || t.updatedAt);
                return {
                  id: `dep-${t.slug}`,
                  title: t.title,
                  meta: date ? `Depoimento - ${date}` : "Depoimento",
                  description: t.description || t.testimonialText,
                  href: `/acervo/entrevistas/${t.slug}`,
                  category: "entrevistas" as const,
                };
              })
            : fallbackEntrevistas.map((t) => ({
                id: `dep-${t.slug}`,
                title: t.title,
                meta: t.date ? `Depoimento - ${t.date}` : "Depoimento",
                description: t.summary,
                href: `/acervo/entrevistas/${t.slug}`,
                category: "entrevistas" as const,
              }));

        const refItems =
          refsRemote.length > 0
            ? refsRemote.map((r) => {
                const date = r.year ? String(r.year) : "";
                const href = "/producao-bibliografica";
                return {
                  id: `ref-${r.slug || r._id}`,
                  title: r.title,
                  meta: date ? `Bibliografia - ${date}` : "Bibliografia",
                  description: r.description,
                  href,
                  category: "referencias" as const,
                };
              })
            : fallbackRefs.map((r) => ({
                id: `ref-${r.id}`,
                title: r.title,
                meta: r.year ? `Bibliografia - ${r.year}` : "Bibliografia",
                description: r.abstract,
                href: r.href || "/producao-bibliografica",
                category: "referencias" as const,
              }));

        const pessoalItems = fallbackPessoais.map((p) => ({
          id: `pes-${p.slug}`,
          title: p.name,
          meta: p.role ? `Acervo pessoal - ${p.role}` : "Acervo pessoal",
          description: p.summary,
          href: `/acervo-pessoal/${p.slug}`,
          category: "pessoais" as const,
        }));

        const mapped: SearchGroup[] = CATEGORY_ORDER.map((key) => ({
          key,
          label: CATEGORY_META[key].label,
          icon: CATEGORY_META[key].icon,
          listHref: CATEGORY_META[key].listHref,
          items: [],
        }));

        const pushIf = (key: CategoryKey, items: SearchResult[]) => {
          const group = mapped.find((g) => g.key === key);
          if (!group || items.length === 0) return;
          group.items = items.slice(0, 6);
        };

        pushIf("documentos", docItems);
        pushIf("fotos", fotoItems);
        pushIf("jornais", jornalItems);
        pushIf("entrevistas", depoItems);
        pushIf("referencias", refItems);
        pushIf("pessoais", pessoalItems);

        const filteredGroups = mapped.filter((g) => g.items.length > 0);
        if (!cancelled) {
          setGroups(filteredGroups);
          setActive(filteredGroups.length ? 0 : -1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (e.target instanceof Node && !boxRef.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (active < 0 || !panelRef.current) return;
    const el = panelRef.current.querySelector(`[data-index="${active}"]`) as HTMLElement | null;
    if (el?.scrollIntoView) el.scrollIntoView({ block: "nearest" });
  }, [active]);

  const goTo = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    router.push(prefixHref(href));
  };

  const goAction = (idx: number) => {
    const action = actions[idx];
    if (!action) return;
    goTo(action.href);
    setOpen(false);
    setQ("");
    setActive(-1);
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(actions.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) return goAction(active);
      if (actions.length > 0) return goAction(0);
      goTo(listHrefWithQuery("/acervo", debounced));
      setOpen(false);
      setActive(-1);
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const renderGroups = () => {
    if (loading && groups.length === 0) {
      return (
        <div className="flex items-center gap-2 px-4 py-4 text-sm text-white/70">
          <Loader2 className="h-4 w-4 animate-spin" /> Buscando resultados.
        </div>
      );
    }

    if (groups.length === 0) {
      return <div className="p-4 text-sm text-white/70">Nenhum resultado. Tente outros termos.</div>;
    }

    let actionIndex = 0;
    return groups.map((group) => {
      const baseIndex = actionIndex;
      const allIndex = group.listHref ? baseIndex + group.items.length : null;
      actionIndex = baseIndex + group.items.length + (group.listHref ? 1 : 0);
      const Icon = group.icon;
      return (
        <div key={group.key} className="border-b border-white/10 last:border-b-0">
          <div className="flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
            <span className="inline-flex items-center gap-2">
              <Icon className="h-3.5 w-3.5 text-white/60" />
              {group.label}
            </span>
            {group.listHref ? (
              <button
                type="button"
                data-index={allIndex ?? undefined}
                onMouseEnter={() => {
                  if (typeof allIndex === "number") setActive(allIndex);
                }}
                onClick={() => goTo(listHrefWithQuery(group.listHref!, debounced))}
                className={`rounded-md border border-white/10 px-2 py-1 text-[10px] text-white/70 hover:bg-white/10 ${
                  active === allIndex ? "bg-white/10 text-white" : "bg-white/5"
                }`}
              >
                Ver todos
              </button>
            ) : null}
          </div>
          <ul className="divide-y divide-white/10">
            {group.items.map((item, idx) => {
              const currentIndex = baseIndex + idx;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    data-index={currentIndex}
                    onClick={() => goAction(currentIndex)}
                    onMouseEnter={() => setActive(currentIndex)}
                    className={`flex w-full items-start gap-3 px-3 py-2 text-left ${
                      active === currentIndex ? "bg-white/10" : "hover:bg-white/5"
                    }`}
                    role="option"
                    aria-selected={active === currentIndex}
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                      <Icon className="h-4 w-4 text-white/80" />
                    </span>
                    <div className="min-w-0">
                      <div className="line-clamp-1 text-sm font-medium text-white">{item.title}</div>
                      {item.description ? (
                        <div className="line-clamp-2 text-xs text-white/60">{item.description}</div>
                      ) : null}
                      {item.meta ? <div className="text-[11px] text-white/50">{item.meta}</div> : null}
                    </div>
                    <ArrowRight className="ml-auto mt-1.5 h-4 w-4 text-white/40" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      );
    });
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <div
        className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 ${
          compact ? "px-2.5 py-1.5" : "px-3 py-2"
        }`}
      >
        <SearchIcon className="h-4 w-4 text-white/60" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none ${
            compact ? "min-w-0" : "md:w-72 lg:w-[22rem]"
          }`}
          role="combobox"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="global-search-panel"
        />
      </div>

      {open && (
        <div
          id="global-search-panel"
          ref={panelRef}
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-[min(92vw,38rem)] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 shadow-2xl backdrop-blur"
        >
          <div className="max-h-[22rem] overflow-auto">{renderGroups()}</div>
          <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-black/30 px-3 py-2">
            <span className="text-[11px] text-white/50">
              {loading ? "Buscando." : "Enter abre o primeiro resultado - Esc fecha"}
            </span>
            <button
              type="button"
              onClick={() => {
                goTo(listHrefWithQuery("/acervo", debounced));
                setOpen(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/15"
            >
              Ver tudo no acervo <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
