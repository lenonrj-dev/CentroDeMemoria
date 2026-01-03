"use client";

import { useEffect, useMemo, useRef, useState, memo, useCallback, type ReactNode, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Flag,
  Gavel,
  Calendar,
  Filter,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  BookOpen,
} from "lucide-react";

export type PoliticsContent = {
  eyebrow: string;
  title: string;
  description: string;
  featured: { title: string; description: string; href: string; cover: string; date: string };
  axes: { key: string; label: string }[];
  events: { title: string; date: string; summary: string; href: string; axis: string[] }[];
  notes: string[];
  methodologyLink: { label: string; href: string };
  searchPlaceholder: string;
  ui?: {
    readAnalysisLabel?: string;
    editorialLabel?: string;
    axesLabel?: string;
    notesLabel?: string;
    quickSearchLabel?: string;
    footerNote?: string;
    prevLabel?: string;
    nextLabel?: string;
  };
};

/* ====== motion variants ====== */
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

/* ====== subcomponents ====== */
type EventItem = PoliticsContent["events"][number];
type AxisChipProps = { active: boolean; onClick: () => void; children: ReactNode };
type TimelineCardProps = {
  item: EventItem;
  measureRef?: RefObject<HTMLDivElement | null> | ((el: HTMLDivElement | null) => void);
  axisLabels: Record<string, string>;
};

const AxisChip = memo(function AxisChip({ active, onClick, children }: AxisChipProps) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-lg border px-2.5 py-1.5 text-xs transition",
        active ? "border-white/20 bg-white/15 text-white" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
      ].join(" ")}
      aria-pressed={active}
    >
      {children}
    </button>
  );
});

const TimelineCard = memo(function TimelineCard({ item, measureRef, axisLabels }: TimelineCardProps) {
  return (
    <motion.article
      ref={measureRef as any}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-white/60">{item.date}</div>
          <h4 className="text-base font-semibold text-white">{item.title}</h4>
          <p className="mt-1 text-sm text-white/70">{item.summary}</p>

          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-white/70">
            {item.axis.map((ax) => (
              <span key={ax} className="rounded-lg border border-white/10 bg-white/5 px-2 py-0.5">
                {axisLabels[ax] ?? ax}
              </span>
            ))}
          </div>
        </div>
        <Link
          href={item.href}
          className="ml-auto inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2 py-1 text-xs text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
        >
          Ler <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </motion.article>
  );
});

/* ====== utils ====== */
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

/* ====== componente principal ====== */
type Props = { content: PoliticsContent };

export default function SeventhSection({ content }: Props) {
  const [axis, setAxis] = useState(content.axes[0]?.key || "todos");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);
  const listRef = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const ui = content.ui ?? {};
  const readAnalysisLabel = ui.readAnalysisLabel ?? "Ver análise";
  const editorialLabel = ui.editorialLabel ?? "Seleção editorial";
  const axesLabel = ui.axesLabel ?? "Eixos";
  const notesLabel = ui.notesLabel ?? "Notas";
  const quickSearchLabel = ui.quickSearchLabel ?? "Busca rápida";
  const footerNote =
    ui.footerNote ??
    "Esta é uma prévia editorial da área de Política Nacional. Consulte as páginas dedicadas para leituras completas e referências.";
  const prevLabel = ui.prevLabel ?? "Anterior";
  const nextLabel = ui.nextLabel ?? "Próximo";
  const axisLabelMap = useMemo(
    () => Object.fromEntries(content.axes.map((a) => [a.key, a.label])),
    [content.axes]
  );
  const CARD_H = 168; // aproximação para calcular quantos cabem
  const GAP = 12;

  const filtered = useMemo(() => {
    let arr = content.events.slice();
    if (axis !== "todos") arr = arr.filter((e) => e.axis.includes(axis));
    if (debounced) {
      arr = arr.filter((e) => (e.title + e.summary + e.axis.join(" ")).toLowerCase().includes(debounced));
    }
    return arr;
  }, [axis, content.events, debounced]);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim().toLowerCase()), 200);
    return () => clearTimeout(t);
  }, [q]);

  // calcula quantos cabem no viewport disponível
  useEffect(() => {
    const calc = () => {
      if (!listRef.current) return;
      const h = listRef.current.clientHeight || 0;
      const pv = Math.max(1, Math.floor((h + GAP) / (CARD_H + GAP)));
      setPerView(pv);
      setIndex((i) => clamp(i, 0, Math.max(0, filtered.length - pv)));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [filtered.length]);

  const maxIndex = Math.max(0, filtered.length - perView);

  const next = useCallback(() => setIndex((i) => clamp(i + 1, 0, maxIndex)), [maxIndex]);
  const prev = useCallback(() => setIndex((i) => clamp(i - 1, 0, maxIndex)), [maxIndex]);

  const offset = index * (CARD_H + GAP);

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
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <Flag className="h-4 w-4" />
            {content.eyebrow}
          </div>
          <h3 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            {content.title}
          </h3>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Destaque principal (esquerda) */}
          <div className="lg:col-span-9">
            <motion.div
              variants={fadeUp}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5"
            >
              <div className="grid grid-cols-1 gap-0 md:grid-cols-[260px,1fr]">
                <div className="relative h-52 md:h-full">
                  <Image
                    src={content.featured.cover}
                    alt={content.featured.title}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 260px, 100vw"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent md:bg-gradient-to-r md:from-black" />
                </div>
                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/60">
                    <Gavel className="h-4 w-4" />
                    {content.featured.date}
                  </div>
                  <h4 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
                    {content.featured.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/75 sm:text-base">
                    {content.featured.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <Link
                    href={content.featured.href}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                  >
                    {readAnalysisLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              </div>
            </motion.div>

            {/* Lista vertical de eventos */}
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="lg:col-span-9">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/60">
                    <Calendar className="h-4 w-4" />
                    {editorialLabel}
                  </div>
                  <div className="inline-flex gap-2">
                    <button
                      onClick={prev}
                      aria-label={prevLabel}
                      className="rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={next}
                      aria-label={nextLabel}
                      className="rounded-md border border-white/10 bg-white/5 p-2 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  ref={listRef}
                  className="relative mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3"
                  style={{ height: "520px" }}
                >
                  <div
                    className="space-y-3"
                    style={{
                      transform: `translateY(-${offset}px)`,
                      transition: "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <AnimatePresence initial={false}>
                      {filtered.map((ev, idx) => (
                        <TimelineCard
                          key={`${ev.title}-${idx}`}
                          item={ev}
                          measureRef={idx === 0 ? firstRef : undefined}
                          axisLabels={axisLabelMap}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                  {index < maxIndex && (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
                  )}
                </div>
              </div>

              {/* Eixos / Filtros (direita) */}
              <motion.aside
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45 }}
                className="lg:col-span-3"
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <h5 className="text-lg font-semibold text-white">{axesLabel}</h5>
                    <BookOpen className="h-5 w-5 text-white/70" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {content.axes.map((a) => (
                      <AxisChip
                        key={a.key}
                        active={axis === a.key}
                        onClick={() => {
                          setAxis(a.key);
                          setIndex(0);
                        }}
                      >
                        {a.label}
                      </AxisChip>
                    ))}
                  </div>

                  <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                    <h6 className="text-sm font-semibold text-white">{notesLabel}</h6>
                    <ul className="mt-2 space-y-1.5 text-sm text-white/70">
                      {content.notes.map((n) => (
                        <li key={n}>• {n}</li>
                      ))}
                    </ul>

                    <div className="mt-4 text-right">
                      <Link
                        href={content.methodologyLink.href}
                        className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white"
                      >
                        {content.methodologyLink.label} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Busca rápida opcional */}
                <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <label htmlFor="pn-busca" className="text-xs font-medium text-white/70">
                    {quickSearchLabel}
                  </label>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                    <Filter className="h-4 w-4 text-white/60" />
                    <input
                      id="pn-busca"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder={content.searchPlaceholder}
                      className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                    />
                  </div>
                </div>
              </motion.aside>
            </div>
          </div>
        </div>

        {/* Rodapé curto */}
        <p className="mt-8 text-center text-xs text-white/50">{footerNote}</p>
      </motion.div>
    </section>
  );
}
