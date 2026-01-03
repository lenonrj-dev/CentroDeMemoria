"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDownNarrowWide,
  ArrowLeft,
  ArrowUpNarrowWide,
  Calendar,
  Info,
  Layers,
  Share2,
} from "lucide-react";
import StudyModal from "@/components/viewer/StudyModal";

type EditionPage = {
  index: number;
  image: string;
  caption?: string;
};

type Edition = {
  title: string;
  date: string;
  number?: string;
  summary?: string;
  pdf?: string;
  pages: EditionPage[];
};

const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function EditionReader({ edition }: { edition: Edition }) {
  const [reverse, setReverse] = useState(false);
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);
  const pages = useMemo(() => (reverse ? [...edition.pages].reverse() : edition.pages), [reverse, edition.pages]);

  const pageRefs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    // ao ativar "Ler do fim ao inicio", rola para o topo para evitar confusao visual
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [reverse]);

  const scrollToPage = (idx: number) => {
    const el = pageRefs.current[idx];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: edition.title, url });
      else await navigator.clipboard.writeText(url);
    } catch {
      // ignore
    }
  };

  return (
    <section className="relative w-full py-8 sm:py-10 lg:py-12">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Barra superior / breadcrumb */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/jornais-de-epoca"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Link>
            <div className="hidden text-sm text-white/60 sm:block">/ Jornais de Epoca</div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={share}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4" /> Compartilhar
            </button>
            {edition.pdf && edition.pdf !== "#" && (
              <button
                type="button"
                onClick={() => setViewerSrc(edition.pdf || "")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
              >
                Visualizar
              </button>
            )}
          </div>
        </div>

        {/* Cabecalho da edicao */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-zinc-950/60 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-semibold text-white sm:text-3xl">{edition.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {edition.date}
                </span>
                {edition.number && (
                  <span className="inline-flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    {edition.number}
                  </span>
                )}
              </div>
              {edition.summary && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{edition.summary}</p>}
            </div>

            {/* Controles de leitura */}
            <div className="flex items-center gap-2 self-start">
              <button
                onClick={() => setReverse(false)}
                aria-pressed={!reverse}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${
                  !reverse ? "border-white/20 bg-white/15 text-white" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                }`}
                title="Ordem normal (inicio -> fim)"
              >
                <ArrowDownNarrowWide className="h-4 w-4" />
                Normal
              </button>
              <button
                onClick={() => setReverse(true)}
                aria-pressed={reverse}
                className={`inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm ${
                  reverse ? "border-white/20 bg-white/15 text-white" : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                }`}
                title="Ordem invertida (fim -> inicio)"
              >
                <ArrowUpNarrowWide className="h-4 w-4" />
                Invertida
              </button>
            </div>
          </div>
        </div>

        {/* Indice rapido (ancoras) */}
        <div className="mb-5 overflow-x-auto">
          <div className="inline-flex gap-2">
            {pages.map((p, i) => (
              <button
                key={`btn-${p.index}-${i}`}
                onClick={() => scrollToPage(i)}
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/80 hover:bg-white/10"
                title={`Ir para pagina ${p.index}`}
              >
                P{p.index}
              </button>
            ))}
          </div>
        </div>

        {/* Leitura - rolagem vertical natural */}
        <div className="mx-auto max-w-3xl">
          {pages.map((p, i) => (
            <article
              key={`pg-${p.index}-${i}`}
              ref={(el) => {
                pageRefs.current[i] = el;
              }}
              className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black/40"
            >
              {/* capa da pagina */}
              <div className="relative w-full" style={{ aspectRatio: "3 / 4" }}>
                <Image
                  src={p.image}
                  alt={p.caption || `Pagina ${p.index}`}
                  fill
                  sizes="(min-width:768px) 768px, 100vw"
                  className="bg-black object-contain"
                  priority={i < 2}
                />
              </div>
              {/* legenda */}
              <div className="flex items-start gap-2 p-3 text-xs text-white/60">
                <Info className="mt-0.5 h-3.5 w-3.5" />
                <div>
                  <div className="font-medium text-white/80">Pagina {p.index}</div>
                  {p.caption && <div>{p.caption}</div>}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* rodape curto */}
        <p className="mt-6 text-center text-xs text-white/50">
          A leitura completa utiliza rolagem vertical padrao. Para questoes de direitos e reproducao, consulte Acesso a informacao.
        </p>
      </motion.div>
      <StudyModal
        open={Boolean(viewerSrc)}
        onClose={() => setViewerSrc(null)}
        title={`Documento: ${edition.title}`}
        src={viewerSrc || ""}
      />
    </section>
  );
}
