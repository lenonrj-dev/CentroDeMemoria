"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Newspaper, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export type JournalsContent = {
  eyebrow: string;
  title: string;
  description: string;
  cta: { label: string; href: string };
  filters: { value: string; label: string }[];
  items: {
    title: string;
    date: string;
    decade: string;
    description: string;
    href: string;
    cover: string;
    tags?: string[];
  }[];
  ui?: {
    allLabel?: string;
    readLabel?: string;
    prevLabel?: string;
    nextLabel?: string;
    carouselAriaLabel?: string;
    coverAltTemplate?: string;
  };
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
const stagger = { show: { transition: { staggerChildren: 0.06 } } };

// dimensões do card usadas para o trilho (condizem com Tailwind: w-[15rem] e gap-4)
const CARD_W = 240; // 15rem
const GAP = 16; // 1rem (gap-4)

type Props = { content: JournalsContent };

export default function FourthSection({ content }: Props) {
  const allValue = content.filters.find((f) => f.value === "all")?.value ?? content.filters[0]?.value ?? "all";
  const [filter, setFilter] = useState(allValue);
  const [index, setIndex] = useState(0); // índice do primeiro card visível
  const [perView, setPerView] = useState(1); // quantos cabem na viewport
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const prevLabel = content.ui?.prevLabel ?? "Anterior";
  const nextLabel = content.ui?.nextLabel ?? "Próximo";
  const readLabel = content.ui?.readLabel ?? "Ler jornal";
  const coverAltTemplate = content.ui?.coverAltTemplate ?? "{title} - capa";
  const carouselLabel = content.ui?.carouselAriaLabel ?? "Carrossel de jornais de época";

  const filtered = useMemo(
    () => (filter === allValue ? content.items : content.items.filter((i) => i.decade === filter)),
    [allValue, content.items, filter]
  );

  // Recalcula quantos cabem por vez e ajusta o índice
  useEffect(() => {
    const calc = () => {
      const el = viewportRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const pv = Math.max(1, Math.floor((w + GAP) / (CARD_W + GAP))); // aproximação boa
      setPerView(pv);
      setIndex((i) => clamp(i, 0, Math.max(0, filtered.length - pv)));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [filtered.length]);

  // ao trocar filtro, volta ao início e recalcula bounds
  useEffect(() => {
    setIndex(0);
  }, [filter]);

  const maxIndex = Math.max(0, filtered.length - perView);
  const stepPx = CARD_W + GAP;
  const offset = index * stepPx;

  const go = (dir: number) => {
    setIndex((i) => clamp(i + dir, 0, maxIndex));
  };

  const coverAlt = (title: string) => coverAltTemplate.replace("{title}", title);

  return (
    <section className="relative w-full py-14 sm:py-20 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col items-start justify-between gap-6 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
              <Newspaper className="h-4 w-4" />
              {content.eyebrow}
            </div>
            <h3 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
              {content.title}
            </h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              {content.description}
            </p>
          </div>

          {/* CTA geral */}
          <Link
            href={content.cta.href}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            {content.cta.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Filtros por década */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-5 flex flex-wrap items-center gap-2"
        >
          {content.filters.map((f) => (
            <motion.button
              key={f.value}
              variants={fadeUp}
              onClick={() => setFilter(f.value)}
              className={[
                "rounded-lg border px-3 py-1.5 text-sm transition",
                filter === f.value
                  ? "border-white/20 bg-white/15 text-white"
                  : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              {f.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Carrossel sem scrollbar (overflow hidden + trilho com translateX) */}
        <div className="relative">
          {/* sombras laterais para foco */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black to-transparent" />

          {/* botões (sempre visíveis) */}
          <div className="absolute -left-2 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={() => go(-1)}
              aria-label={prevLabel}
              className="rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute -right-2 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={() => go(1)}
              aria-label={nextLabel}
              className="rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* viewport sem scrollbar */}
          <div
            ref={viewportRef}
            role="region"
            aria-label={carouselLabel}
            className="overflow-hidden pb-2"
          >
            {/* trilho */}
            <div
              style={{
                display: "flex",
                gap: `${GAP}px`,
                transform: `translateX(-${offset}px)`,
                transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform",
              }}
            >
              {filtered.map((it, idx) => (
                <motion.article
                  key={`${it.title}-${idx}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3 }}
                  className="group relative h-[20rem] w-[15rem] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60"
                >
                  {/* capa */}
                  <div className="relative h-full w-full">
                    <Image
                      src={it.cover || "/hero.png"}
                      alt={coverAlt(it.title)}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      sizes="240px"
                      priority={false}
                    />
                  </div>

                  {/* gradiente/overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* conteúdo da capa */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 text-white">
                    <div className="text-[11px] uppercase tracking-widest text-white/70">
                      {it.date}
                    </div>
                    <h4 className="text-base font-semibold leading-tight">{it.title}</h4>
                    <p className="mt-1 line-clamp-2 text-[13px] text-white/80">{it.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/70">
                      <span className="rounded-lg border border-white/20 bg-white/10 px-2 py-0.5">
                        {it.decade}
                      </span>
                      {(it.tags || []).slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-white/20 bg-white/10 px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                      <Link
                        href={it.href}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                      >
                        {readLabel} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}
