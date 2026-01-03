"use client";

import { useCallback, useEffect, useMemo, useRef, useState, memo, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  UserRound,
  Quote,
  BookOpen,
  Newspaper,
  Images,
  FileText,
  Mic2,
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  Shield,
  Mail,
  Calendar,
  Tag,
} from "lucide-react";
import StudyModal from "@/components/viewer/StudyModal";

/* ============== motion helpers ============== */
const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

/* ============== MOCK DATA (trocar por real) ============== */
const STATS = [
  { icon: Newspaper, label: "Jornais & Boletins", value: 240 },
  { icon: Images, label: "Fotografias", value: 680 },
  { icon: FileText, label: "Docs & Atas", value: 190 },
  { icon: Mic2, label: "História Oral", value: 22 },
  { icon: BookOpen, label: "Bibliografia", value: 36 },
];

const FEATURED = [
  { title: "Boletim Operário — Edição Especial", desc: "Cobertura de greves e negociações históricas.", href: "/jornais-de-epoca/boletim-especial", cover: "/hero.png" },
  { title: "Álbum Fotográfico: Linha de Montagem", desc: "Imagens de cotidiano fabril (1948–1954).", href: "/acervo/fotos/linha-montagem", cover: "/file.svg" },
  { title: "Entrevista: Memórias de 1979", desc: "Relatos sobre organização e mobilização.", href: "/acervo/entrevistas/memorias-1979", cover: "/globe.svg" },
  { title: "Ata da Assembleia — 1961/09", desc: "Pautas, deliberações e encaminhamentos.", href: "/acervo/documentos/ata-1961-09", cover: "/next.svg" },
];

const TIMELINE = [
  { date: "1947", title: "Início de atuação", text: "Primeiros registros em boletins comunitários." },
  { date: "1953", title: "Organização de base", text: "Integração a comissões e ações locais." },
  { date: "1961", title: "Assembleia histórica", text: "Documentos e fotos da grande assembleia." },
  { date: "1979", title: "Greves no ABC", text: "Entrevistas e acervo fotográfico ampliado." },
  { date: "1988", title: "Constituição Cidadã", text: "Materiais sobre direitos e garantias sociais." },
];

const ITEMS = [
  {
    id: "p1",
    title: "Memória Operária e Espaço Urbano",
    authors: ["Rubem Machado", "Ana Bezerra"],
    year: 2021,
    type: "Artigo",
    decade: "2020s",
    tags: ["Memória", "Cidade", "Trabalho"],
    abstract: "Análise das relações entre memória operária e processos de urbanização.",
    cover: "/hero.png",
    href: "/producao-bibliografica/memoria-operaria",
    pdf: "/pdfs/memoria-operaria.pdf",
  },
  {
    id: "p2",
    title: "Inventário do Acervo Fotográfico 1940–1970",
    authors: ["Marina Lopes"],
    year: 2020,
    type: "Relatório",
    decade: "2020s",
    tags: ["Fotografia", "Catalogação", "Acervo"],
    abstract: "Metodologia e resultados do inventário fotográfico.",
    cover: "/file.svg",
    href: "/producao-bibliografica/inventario-fotografico",
    pdf: "/pdfs/inventario-fotografico.pdf",
  },
  {
    id: "p3",
    title: "Entrevista com lideranças — 1979",
    authors: ["Equipe História Oral"],
    year: 2019,
    type: "Entrevista",
    decade: "2010s",
    tags: ["Oral", "Greves", "Lideranças"],
    abstract: "Relatos de organização e mobilização setorial.",
    cover: "/globe.svg",
    href: "/acervo/entrevistas/1979-liderancas",
    pdf: "#",
  },
  {
    id: "p4",
    title: "Guia de Digitalização e Restauração",
    authors: ["Marina Lopes", "Lívia Rocha"],
    year: 2019,
    type: "Livro",
    decade: "2010s",
    tags: ["Digitalização", "Restauração", "Metadados"],
    abstract: "Boas práticas e fluxos de preservação digital.",
    cover: "/next.svg",
    href: "/producao-bibliografica/guia-digitalizacao",
    pdf: "/pdfs/guia-digitalizacao.pdf",
  },
  {
    id: "p5",
    title: "Ata de Assembleia — 1961/09",
    authors: ["Secretaria"],
    year: 1961,
    type: "Documento",
    decade: "1960s",
    tags: ["Atas", "Assembleia"],
    abstract: "Deliberações e encaminhamentos registrados.",
    cover: "/vercel.svg",
    href: "/acervo/documentos/ata-1961-09",
    pdf: "#",
  },
];

/* ============== utils ============== */
const TYPES = ["Artigo", "Livro", "Relatório", "Documento", "Entrevista"];
const DECADES = ["2020s", "2010s", "2000s", "1990s", "1980s", "1970s", "1960s"];
const TAG_POOL = ["Memória", "Cidade", "Trabalho", "Fotografia", "Catalogação", "Acervo", "Oral", "Greves", "Lideranças", "Digitalização", "Restauração", "Metadados", "Atas", "Assembleia"];

type Item = (typeof ITEMS)[number];
type ChipProps = { active: boolean; onClick: () => void; children: ReactNode };
type CardProps = { item: Item; onView: (item: Item) => void };
type PersonArchiveProps = { person: { name: string; occupation: string; summary: string; portrait?: string } };

function abnt(item) {
  const nomes = item.authors.map((n) => {
    const parts = n.split(" ");
    const last = parts.pop();
    const given = parts.join(" ");
    return `${(last || "").toUpperCase()}, ${given}`;
  });
  return `${nomes.join("; ")}. ${item.title}. ${item.year}.`;
}

/* ============== subcomponents ============== */
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
      <div className="p-4 pb-16">
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

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {hasPdf ? (
          <button
            type="button"
            onClick={() => onView(item)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/15"
          >
            Visualizar
          </button>
        ) : null}
        <Link
          href={item.href}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1.5 text-xs text-white hover:bg-white/15"
        >
          Detalhes <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={() => navigator.clipboard?.writeText(abnt(item))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/90 hover:bg-white/10"
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
        <Image src={item.cover || "/hero.png"} alt={item.title} fill className="object-cover" sizes="88px" />
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
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
          >
            Visualizar
          </button>
        ) : null}
        <Link href={item.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15">
          Detalhes <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={() => navigator.clipboard?.writeText(abnt(item))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/90 hover:bg-white/10"
          title="Copiar citação (ABNT)"
        >
          <Quote className="h-4 w-4" />
          Citar
        </button>
      </div>
    </motion.article>
  );
});

/* ============== componente principal ============== */
export default function PersonArchive({ person }: PersonArchiveProps) {
  /* —— busca + filtros —— */
  const [q, setQ] = useState("");
  const [qDeb, setQDeb] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [decade, setDecade] = useState("Todas");
  const [selectedTags, setSelectedTags] = useState([]);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("recentes");
  const [limit, setLimit] = useState(9);
  const [viewer, setViewer] = useState<Item | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setQDeb(q.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [q]);

  const filtered = useMemo(() => {
    let arr = ITEMS.slice();

    if (qDeb) {
      arr = arr.filter((it) =>
        (it.title + " " + it.abstract + " " + it.authors.join(" ") + " " + it.tags.join(" "))
          .toLowerCase()
          .includes(qDeb)
      );
    }

    if (selectedTypes.length) {
      arr = arr.filter((it) => selectedTypes.includes(it.type));
    }

    if (decade !== "Todas") {
      arr = arr.filter((it) => it.decade === decade);
    }

    if (selectedTags.length) {
      arr = arr.filter((it) => selectedTags.every((t) => it.tags.includes(t)));
    }

    if (sort === "recentes") arr.sort((a, b) => b.year - a.year);
    if (sort === "antigos") arr.sort((a, b) => a.year - b.year);
    if (sort === "az") arr.sort((a, b) => a.title.localeCompare(b.title));

    return arr;
  }, [qDeb, selectedTypes, decade, selectedTags, sort]);

  const shown = filtered.slice(0, limit);
  const hasMore = filtered.length > shown.length;
  const toggle = (list, setList, val) =>
    setList(list.includes(val) ? list.filter((x) => x !== val) : [...list, val]);

  const clearAll = () => {
    setQ(""); setQDeb("");
    setSelectedTypes([]); setDecade("Todas"); setSelectedTags([]);
    setView("grid"); setSort("recentes"); setLimit(9);
  };

  const openViewer = (item: Item) => {
    if (!item.pdf || item.pdf === "#") return;
    setViewer(item);
  };

  /* —— carrossel “Destaques” —— */
  const CARD_W = 320, GAP = 16;
  const [idx, setIdx] = useState(0);
  const [perView, setPerView] = useState(1);
  const viewportRef = useRef(null);
  const recalc = () => {
    const w = viewportRef.current?.clientWidth || CARD_W;
    const pv = Math.max(1, Math.floor((w + GAP) / (CARD_W + GAP)));
    setPerView(pv);
    setIdx((i) => Math.max(0, Math.min(i, Math.max(0, FEATURED.length - pv))));
  };
  useEffect(() => {
    recalc();
    const onR = () => recalc();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const maxIndex = Math.max(0, FEATURED.length - perView);
  const offset = idx * (CARD_W + GAP);

  /* —— linha do tempo: lista vertical sem scrollbar —— */
  const timelineViewportRef = useRef(null);
  const firstCardRef = useRef(null);
  const [cardH, setCardH] = useState(0);
  const [perCol, setPerCol] = useState(1);
  const [row, setRow] = useState(0);
  const T_GAP = 12;
  const T_MAX = 480;

  const measure = useCallback(() => {
    const v = timelineViewportRef.current;
    const c = firstCardRef.current;
    const vh = v?.clientHeight ?? T_MAX;
    let ch = c?.offsetHeight;
    if (!ch) ch = cardH || 150;
    const pv = Math.max(1, Math.floor((vh + T_GAP) / (ch + T_GAP)));
    setCardH(ch);
    setPerCol(pv);
    setRow((r) => clamp(r, 0, Math.max(0, TIMELINE.length - pv)));
  }, [cardH]);
  useEffect(() => {
    measure();
    const onR = () => measure();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, [measure]);

  const tMax = Math.max(0, TIMELINE.length - perCol);
  const tOffset = row * (cardH + T_GAP);
  const tStep = (d) => setRow((r) => clamp(r + d, 0, tMax));
  const onWheelTimeline = (e) => {
    const dy = e.deltaY;
    if (Math.abs(dy) < 6) return;
    e.preventDefault();
    tStep(dy > 0 ? 1 : -1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ————————————————— Hero ————————————————— */}
      <section className="relative w-full py-14 sm:py-20 lg:py-24">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,360px]">
            {/* texto */}
            <div>
              <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
                <UserRound className="h-4 w-4" />
                Acervo Pessoal
              </div>
              <h1 className="text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
                {person.name}
              </h1>
              <p className="mt-1 text-sm text-white/70">{person.occupation}</p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
                {person.summary}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {STATS.map((s, i) => (
                  <div key={i} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-3">
                    <div className="inline-flex items-center gap-2 text-white/80">
                      <s.icon className="h-4 w-4" />
                      <span className="text-xs">{s.label}</span>
                    </div>
                    <div className="mt-1 text-lg font-semibold text-white">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* retrato */}
            <div className="relative mx-auto h-[360px] w-[360px] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={person.portrait || "/hero.png"}
                alt={`Retrato de ${person.name}`}
                fill
                className="object-cover"
                sizes="360px"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ————————————————— Filtros rápidos + Busca ————————————————— */}
      <section className="relative w-full py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
            {/* busca */}
            <div className="md:col-span-6">
              <label htmlFor="p-archive-search" className="sr-only">Buscar no acervo pessoal</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                <Search className="h-4 w-4 text-white/60" />
                <input
                  id="p-archive-search"
                  placeholder="Buscar por título, autor, tag…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>

            {/* tipos */}
            <div className="md:col-span-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-white/50">
                  <Filter className="h-3.5 w-3.5" />
                  Tipos
                </span>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
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

            {/* década + ordenar */}
            <div className="md:col-span-3">
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <select
                  value={decade}
                  onChange={(e) => setDecade(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option>Todas</option>
                  {DECADES.map((d) => <option key={d}>{d}</option>)}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  <option value="recentes">Mais recentes</option>
                  <option value="antigos">Mais antigos</option>
                  <option value="az">A–Z</option>
                </select>
                <button
                  onClick={clearAll}
                  className="rounded-lg border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* tags */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-white/50">
              <Tag className="h-3.5 w-3.5" />
              Assuntos
            </span>
            <div className="flex flex-wrap gap-2">
              {TAG_POOL.slice(0, 12).map((t) => (
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
      </section>

      {/* ————————————————— Destaques (carrossel sem scrollbar) ————————————————— */}
      <section className="relative w-full py-10 sm:py-12">
        <div className="mb-4 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
          <BookOpen className="h-4 w-4" />
          Destaques do acervo
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black to-transparent" />

          <div className="absolute -left-2 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={() => setIdx((i) => Math.max(0, i - 1))}
              className="rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute -right-2 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={() => setIdx((i) => Math.min(maxIndex, i + 1))}
              className="rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
              aria-label="Próximo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div ref={viewportRef} className="overflow-hidden">
            <div
              style={{
                display: "flex",
                gap: `${GAP}px`,
                transform: `translateX(-${offset}px)`,
                transition: "transform 420ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {FEATURED.map((it) => (
                <motion.article
                  key={it.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.25 }}
                  className="group relative h-[18rem] w-[320px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={it.cover}
                      alt={it.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      sizes="320px"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <h3 className="text-base font-semibold text-white">{it.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-white/80">{it.desc}</p>
                    <Link
                      href={it.href}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
                    >
                      Acessar <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ————————————————— Linha do tempo (lista sem scrollbar) ————————————————— */}
      <section className="relative w-full py-10 sm:py-12">
        <div className="mb-3 flex items-end justify-between">
          <div className="text-sm font-medium text-white/80">Linha do tempo</div>
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>{String(row + 1).padStart(2, "0")}</span>/<span>{String(TIMELINE.length).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -top-6 right-0 z-10 flex gap-2">
            <button
              onClick={() => tStep(-1)}
              aria-label="Anterior"
              className="pointer-events-auto rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => tStep(1)}
              aria-label="Próximo"
              className="pointer-events-auto rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={timelineViewportRef}
            onWheel={onWheelTimeline}
            role="region"
            aria-label="Linha do tempo do acervo pessoal"
            className="overflow-hidden"
            style={{ maxHeight: `${T_MAX}px` }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: `${T_GAP}px`,
                transform: `translateY(-${tOffset}px)`,
                transition: "transform 420ms cubic-bezier(0.22,1,0.36,1)",
                willChange: "transform",
              }}
            >
              <AnimatePresence initial={false} mode="popLayout">
                {TIMELINE.map((ev, i) => (
                  <motion.article
                    key={`${ev.date}-${i}`}
                    ref={i === 0 ? firstCardRef : null}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
                  >
                    <div className="mb-1 flex items-center gap-2 text-[11px] text-white/60">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{ev.date}</span>
                    </div>
                    <h4 className="text-base font-semibold text-white/90">{ev.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{ev.text}</p>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {row < tMax && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
          )}
        </div>
      </section>

      {/* ————————————————— Navegador de mídia (grade/lista) ————————————————— */}
      <section className="relative w-full py-10 sm:py-12">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-white/60">{filtered.length} resultado(s)</div>
          <div className="inline-flex overflow-hidden rounded-lg border border-white/10">
            <button
              onClick={() => setView("grid")}
              aria-label="Visualizar em grade"
              className={`px-2.5 py-2 ${view === "grid" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="Visualizar em lista"
              className={`px-2.5 py-2 ${view === "list" ? "bg-white/15 text-white" : "bg-white/5 text-white/70 hover:bg-white/10"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}
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

        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setLimit((n) => n + 9)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              Carregar mais
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* ————————————————— Direitos & Contato ————————————————— */}
      <section className="relative w-full py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5 lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-white/80">
              <Shield className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-white">Direitos e uso</h3>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-white/70">
              <li>Consulte licenças e termos de uso de cada item.</li>
              <li>Crédito sugerido: <em>“Banco de Memória — Acervo {person.name}”.</em></li>
              <li>Para publicações, solicite autorização quando necessário.</li>
            </ul>
            <div className="mt-3 text-right">
              <Link href="/acesso-a-informacao/politica" className="text-xs text-white/70 underline-offset-2 hover:underline">
                Ver política de transparência
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-5">
            <h3 className="text-lg font-semibold text-white">Fale com a equipe</h3>
            <p className="mt-1 text-sm text-white/70">
              Dúvidas, correções, contribuições e solicitações de uso.
            </p>
            <Link
              href="/contato"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              <Mail className="h-4 w-4" />
              Contato
            </Link>
          </div>
        </div>
      </section>
      <StudyModal
        open={Boolean(viewer)}
        onClose={() => setViewer(null)}
        title={viewer?.title || "Documento"}
        src={viewer?.pdf || ""}
      />
    </div>
  );
}

/* ============== helper ============== */
function clamp(n, min, max) {
  return Math.max(min, Math.min(n, max));
}
