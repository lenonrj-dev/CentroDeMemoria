"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  memo,
  type ReactNode,
  type Ref,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Filter, FileText, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";

export type AccessContent = {
  eyebrow: string;
  title: string;
  description: string;
  filters: { key: string; label: string }[];
  items: { title: string; description: string; href: string; tags: string[] }[];
  ui?: {
    searchPlaceholder?: string;
    filtersLabel?: string;
    resultsTemplate?: string;
    allFiltersLabel?: string;
    prevLabel?: string;
    nextLabel?: string;
    readMoreLabel?: string;
    howItWorksTitle?: string;
    howItWorksSteps?: string[];
    ctaLabel?: string;
    rightsTitle?: string;
    rightsItems?: string[];
    rightsLinkLabel?: string;
  };
};

/* ========= framer variants ========= */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

/* ========= subcomponentes ========= */
type Item = AccessContent["items"][number];
type ChipProps = { active: boolean; onClick: () => void; children: ReactNode };
type ResultItemProps = {
  item: Item;
  measureRef?: Ref<HTMLDivElement>;
  readMoreLabel: string;
};

const Chip = memo(function Chip({ active, onClick, children }: ChipProps) {
  const classes =
    "rounded-lg border px-2.5 py-1.5 text-xs transition " +
    (active
      ? "border-white/20 bg-white/15 text-white"
      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10");

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
});

const ResultItem = memo(function ResultItem({ item, measureRef, readMoreLabel }: ResultItemProps) {
  return (
    <motion.article
      ref={measureRef}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 sm:flex">
          <FileText className="h-5 w-5 text-white/80" />
        </div>
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-white/90">{item.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-white/70">{item.description}</p>
          <div className="mt-3">
            <Link
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {readMoreLabel} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

/* ========= util ========= */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

/* ========= componente principal ========= */
type Props = { content: AccessContent };

export default function SixthSection({ content }: Props) {
  const [filterKey, setFilterKey] = useState(content.filters[0]?.key ?? "todas");
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");

  // lista virtualizada sem scrollbar
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const firstCardRef = useRef<HTMLDivElement | null>(null);

  const [cardH, setCardH] = useState(0);
  const [perView, setPerView] = useState(1);
  const [index, setIndex] = useState(0); // primeiro item visível

  const GAP = 12; // equivale a space-y-3 (0.75rem)
  const MAX_H = 560; // limite de altura da lista
  const ui = content.ui ?? {};
  const searchPlaceholder = ui.searchPlaceholder ?? "Buscar por título, tema ou descrição…";
  const filtersLabel = ui.filtersLabel ?? "Filtros";
  const resultsTemplate = ui.resultsTemplate ?? "{count} resultado(s) – {filter}";
  const allFiltersLabel = ui.allFiltersLabel ?? "todos os tipos";
  const prevLabel = ui.prevLabel ?? "Anterior";
  const nextLabel = ui.nextLabel ?? "Próximo";
  const readMoreLabel = ui.readMoreLabel ?? "Saiba mais";
  const howItWorksTitle = ui.howItWorksTitle ?? "Como funciona";
  const howItWorksSteps = ui.howItWorksSteps ?? [
    "1. Localize o tema pela busca ou filtros.",
    "2. Acesse a página do conteúdo desejado.",
    "3. Verifique permissões e termos de uso quando aplicável.",
    "4. Precisa de algo específico? Envie um pedido de acesso.",
  ];
  const ctaLabel = ui.ctaLabel ?? "Enviar pedido de acesso";
  const rightsTitle = ui.rightsTitle ?? "Direitos do requerente";
  const rightsItems = ui.rightsItems ?? [
    "Orientação sobre onde e como acessar informações.",
    "Ser informado sobre a disponibilidade do conteúdo solicitado.",
    "Justificativa em caso de restrição de acesso.",
  ];
  const rightsLinkLabel = ui.rightsLinkLabel ?? "Ver política de transparência";
  const allFilterKey = content.filters[0]?.key ?? "todas";

// debounced query
  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(query.trim().toLowerCase());
    }, 200);

    return () => clearTimeout(t);
  }, [query]);

  // mede altura do primeiro card para calcular quantos cabem
  useEffect(() => {
    if (!firstCardRef.current) return;
    setCardH(firstCardRef.current.clientHeight);
  }, [content.items]);

  // aplica filtros e busca (declarado ANTES do effect que usa filtered)
  const filtered = useMemo(() => {
    const active = filterKey;
    let arr = content.items.slice();

    if (active && active !== allFilterKey) {
      arr = arr.filter((it) => it.tags.includes(active));
    }

    if (debounced) {
      const q = debounced;
      arr = arr.filter((it) =>
        (it.title + " " + it.description + " " + it.tags.join(" "))
          .toLowerCase()
          .includes(q),
      );
    }

    return arr;
  }, [content.items, debounced, filterKey]);

  // recalcula quantos cards cabem na viewport e ajusta índice
  useEffect(() => {
    const recalc = () => {
      if (!viewportRef.current || !cardH) return;

      const pv = Math.max(1, Math.floor((MAX_H + GAP) / (cardH + GAP)));
      setPerView(pv);
      setIndex((i) => clamp(i, 0, Math.max(0, filtered.length - pv)));
    };

    recalc();
    window.addEventListener("resize", recalc);

    return () => window.removeEventListener("resize", recalc);
  }, [cardH, filtered.length]);

  const maxIndex = Math.max(0, filtered.length - perView);
  const activeFilterLabel = content.filters.find((f) => f.key === filterKey)?.label ?? filterKey;
  const filterLabel = filterKey === allFilterKey ? allFiltersLabel : activeFilterLabel;
  const resultsText = resultsTemplate
    .replace("{count}", String(filtered.length))
    .replace("{filter}", filterLabel);

  const next = () => setIndex((i) => clamp(i + 1, 0, maxIndex));
  const prev = () => setIndex((i) => clamp(i - 1, 0, maxIndex));

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
              <Filter className="h-4 w-4" />
              {content.eyebrow}
            </div>
            <h3 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              {content.title}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {content.description}
            </p>

            {/* Busca + filtros */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                <Search className="h-4 w-4 text-white/60" />
                <input
                  placeholder={searchPlaceholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-white/50">
                  <Filter className="h-3.5 w-3.5" />
                  {filtersLabel}
                </span>
                {content.filters.map((f) => (
                  <Chip
                    key={f.key}
                    active={filterKey === f.key}
                    onClick={() => {
                      setFilterKey(f.key);
                      setIndex(0);
                    }}
                  >
                    {f.label}
                  </Chip>
                ))}
              </div>
            </div>
          </div>

          {/* Lateral: notas + CTA */}
          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
              <h3 className="text-lg font-semibold text-white">{howItWorksTitle}</h3>
              <ol className="mt-2 space-y-2 text-sm text-white/70">
                {howItWorksSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <Link
                href="/contato"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                {ctaLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <h4 className="text-sm font-semibold text-white">{rightsTitle}</h4>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-white/70">
                {rightsItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="mt-2 text-right">
                <Link
                  href="/transparencia/politica"
                  className="text-xs text-white/60 underline-offset-2 hover:underline"
                >
                  {rightsLinkLabel}
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* RESULTADOS (cards) */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="space-y-3"
        >
          <div
            ref={viewportRef}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3"
            style={{ maxHeight: `${MAX_H}px` }}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="text-sm text-white/70">{resultsText}</div>
              <div className="inline-flex gap-2">
                <button
                  onClick={prev}
                  aria-label={prevLabel}
                  className="rounded-md border border-white/10 bg-white/5 p-1 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  onClick={next}
                  aria-label={nextLabel}
                  className="rounded-md border border-white/10 bg-white/5 p-1 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              className="relative mt-3 space-y-3"
              style={{
                transform: `translateY(-${index * (cardH + GAP)}px)`,
                transition: "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <AnimatePresence initial={false}>
                {filtered.map((item, idx) => (
                  <ResultItem
                    key={`${item.title}-${idx}`}
                    item={item}
                    measureRef={idx === 0 ? firstCardRef : undefined}
                    readMoreLabel={readMoreLabel}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* fade quando há mais conteúdo abaixo */}
            {index < maxIndex && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
