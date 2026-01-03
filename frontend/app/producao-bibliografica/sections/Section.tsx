"use client";

import { useEffect, useMemo, useState, memo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Filter,
  Tag,
  ChevronDown,
  LayoutGrid,
  List,
  ArrowRight,
  Quote,
} from "lucide-react";
import type { BibliographyContent, BibliographyItem } from "../../../lib/content-types";
import StudyModal from "@/components/viewer/StudyModal";

/* ===== motion ===== */
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

type Item = BibliographyItem;
type SectionBibliografiaProps = { content: BibliographyContent };
type ChipProps = { active: boolean; onClick: () => void; children: ReactNode };
type CardProps = { item: Item; onView: (item: Item) => void };

function abnt(item) {
  // Simplificada: SOBRENOME, Nome; SOBRENOME, Nome. Título. Ano.
  const nomes = item.authors.map((n) => {
    const [first, ...rest] = n.split(" ");
    const last = rest.pop() || first;
    const given = [first, ...rest].join(" ");
    return `${last.toUpperCase()}, ${given}`;
  });
  return `${nomes.join("; ")}. ${item.title}. ${item.year}.`;
}

/* ===== subcomponentes ===== */
const Chip = memo(function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        "rounded-lg border px-2.5 py-1.5 text-xs transition " +
        (active ? "border-white/20 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
      }
    >
      {children}
    </button>
  );
});

const GridCard = memo(function GridCard({ item, onView }: CardProps) {
  const hasPdf = Boolean(item.pdf && item.pdf !== "#");
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.25 }}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60"
    >
      {/* capa */}
      <div className="relative overflow-hidden rounded-b-none">
        <div className="relative aspect-[4/3]">
          <Image
            src={item.cover || "/hero.png"}
            alt={item.title}
            fill
            sizes="(min-width:1024px) 25vw,(min-width:640px) 50vw,100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        </div>
      </div>

      {/* conteúdo */}
      <div className="p-4 pb-16">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
          <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5">{item.type}</span>
          <span>{item.year}</span>
          <span>•</span>
          <span>{item.decade}</span>
        </div>
        <h3 className="text-base font-semibold text-white/90">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/70">
          {item.abstract}
        </p>
        <p className="mt-1 text-xs text-white/60">
          {item.authors.join("; ")}
        </p>
      </div>

      {/* ações */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {hasPdf ? (
          <button
            type="button"
            onClick={() => onView(item)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Visualizar
          </button>
        ) : null}
        <Link
          href={item.href}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Detalhes <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={() => navigator.clipboard?.writeText(abnt(item))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          title="Copiar citação (ABNT)"
        >
          <Quote className="h-4 w-4" />
          Citar
        </button>
      </div>
    </motion.article>
  );
});

const ListRow = memo(function ListRow({ item, onView }: CardProps) {
  const hasPdf = Boolean(item.pdf && item.pdf !== "#");
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.2 }}
      className="group relative grid grid-cols-[88px,1fr,auto] items-start gap-3 rounded-2xl border border-white/10 bg-zinc-950/60 p-3 sm:gap-4 sm:p-4"
    >
      <div className="relative h-[66px] w-[88px] overflow-hidden rounded-lg">
        <Image
          src={item.cover || "/hero.png"}
          alt={item.title}
          fill
          className="object-cover"
          sizes="88px"
        />
      </div>
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-white/60">
          <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5">{item.type}</span>
          <span>{item.year}</span>
          <span>•</span>
          <span>{item.decade}</span>
        </div>
        <h3 className="text-base font-semibold text-white/90">{item.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/70">{item.abstract}</p>
        <p className="mt-1 text-xs text-white/60">{item.authors.join("; ")}</p>
      </div>
      <div className="flex w-full flex-col items-end gap-2 sm:w-auto sm:flex-row">
        {hasPdf ? (
          <button
            type="button"
            onClick={() => onView(item)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            Visualizar
          </button>
        ) : null}
        <Link
          href={item.href}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Detalhes <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={() => navigator.clipboard?.writeText(abnt(item))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          title="Copiar citação (ABNT)"
        >
          <Quote className="h-4 w-4" />
          Citar
        </button>
      </div>
    </motion.article>
  );
});

/* ===== componente principal ===== */
export default function SectionBibliografia({ content }: SectionBibliografiaProps) {
  const { hero, filters, items, searchPlaceholder, footnote } = content;
  const [q, setQ] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [decade, setDecade] = useState("Todas");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState<"recentes" | "antigos" | "az">("recentes");
  const [limit, setLimit] = useState(9);
  const [viewer, setViewer] = useState<{ title: string; src: string } | null>(null);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // filtros
  const filtered = useMemo(() => {
    let arr = items.slice();

    // busca
    if (qDebounced) {
      arr = arr.filter((it) =>
        (it.title + " " + it.abstract + " " + it.authors.join(" "))
          .toLowerCase()
          .includes(qDebounced)
      );
    }

    // tipo
    if (selectedTypes.length) {
      arr = arr.filter((it) => selectedTypes.includes(it.type));
    }

    // década
    if (decade !== "Todas") {
      arr = arr.filter((it) => it.decade === decade);
    }

    // tags
    if (selectedTags.length) {
      arr = arr.filter((it) =>
        selectedTags.every((t) => it.tags.includes(t))
      );
    }

    // ordenação
    if (sort === "recentes") arr.sort((a, b) => b.year - a.year);
    if (sort === "antigos") arr.sort((a, b) => a.year - b.year);
    if (sort === "az") arr.sort((a, b) => a.title.localeCompare(b.title));

    return arr;
  }, [items, qDebounced, selectedTypes, decade, selectedTags, sort]);

  const shown = filtered.slice(0, limit);
  const hasMore = filtered.length > shown.length;

  const toggle = (list, setList, val) =>
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  const clearAll = () => {
    setQ(""); setQDebounced("");
    setSelectedTypes([]); setDecade("Todas"); setSelectedTags([]); setSort("recentes");
    setLimit(9);
  };

  const openViewer = (item: Item) => {
    if (!item.pdf || item.pdf === "#") return;
    setViewer({ title: item.title, src: item.pdf });
  };

  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
                <BookOpen className="h-4 w-4" />
                {hero.eyebrow}
              </div>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
                {hero.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {hero.description}
              </p>
            </div>

            <Link
              href={hero.cta.href}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {hero.cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
        </div>

        {/* Barra de busca e controles */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
              {/* busca */}
              <div className="md:col-span-5">
              <label htmlFor="bib-search" className="sr-only">Buscar</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                <Search className="h-4 w-4 text-white/60" />
                <input
                  id="bib-search"
                  placeholder={searchPlaceholder}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* tipo */}
          <div className="md:col-span-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs text-white/50">
                <Filter className="h-3.5 w-3.5" />
                Tipos
              </span>
                <div className="flex flex-wrap gap-2">
                  {filters.types.map((t) => (
                    <Chip
                      key={t}
                      active={selectedTypes.includes(t)}
                      onClick={() => toggle(selectedTypes, setSelectedTypes, t)}
                    >
                      {t}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>

            {/* década + ordenação */}
            <div className="md:col-span-4">
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <select
                  value={decade}
                  onChange={(e) => setDecade(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option>Todas</option>
                  {filters.decades.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "recentes" | "antigos" | "az")}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="recentes">Mais recentes</option>
                  <option value="antigos">Mais antigos</option>
                  <option value="az">A–Z</option>
                </select>
                <div className="inline-flex overflow-hidden rounded-lg border border-white/10">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Visualizar em grade"
                    className={`px-2.5 py-2 ${view === "grid" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                  ><LayoutGrid className="h-4 w-4" /></button>
                  <button
                    onClick={() => setView("list")}
                    aria-label="Visualizar em lista"
                    className={`px-2.5 py-2 ${view === "list" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
                  ><List className="h-4 w-4" /></button>
                </div>
                <button
                  onClick={clearAll}
                  className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* tags/assuntos */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-white/50">
              <Tag className="h-3.5 w-3.5" />
              Assuntos
            </span>
            <div className="flex flex-wrap gap-2">
              {filters.tags.slice(0, 10).map((t) => (
                <Chip
                  key={t}
                  active={selectedTags.includes(t)}
                  onClick={() => toggle(selectedTags, setSelectedTags, t)}
                >
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* contagem */}
        <div className="mt-4 flex items-center justify-between text-sm text-white/60">
          <span>{filtered.length} resultado(s)</span>
          <span>Exibindo {shown.length} {shown.length === 1 ? "item" : "itens"}</span>
        </div>

        {/* resultados */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className={view === "grid"
            ? "mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "mt-4 space-y-3"}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {shown.map((it) =>
              view === "grid" ? (
                <GridCard key={it.id} item={it} onView={openViewer} />
              ) : (
                <ListRow key={it.id} item={it} onView={openViewer} />
              )
            )}
          </AnimatePresence>
        </motion.div>

        {/* carregar mais */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setLimit((n) => n + 9)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Carregar mais
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* nota/rodapé curto */}
        <p className="mt-8 text-center text-xs text-white/50">{footnote}</p>
      </motion.div>
      <StudyModal
        open={Boolean(viewer)}
        onClose={() => setViewer(null)}
        title={viewer?.title || "Documento"}
        src={viewer?.src || ""}
      />
    </section>
  );
}
