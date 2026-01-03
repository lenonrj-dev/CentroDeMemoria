"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const ITEMS = [
  { title: "Jornais de Época", desc: "Edições históricas digitalizadas com contexto.", href: "/jornais-de-epoca", cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
  { title: "Acervo Fotográfico", desc: "Vida nas fábricas, marchas e cotidianos.", href: "/acervo/fotos", cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
  { title: "Cartazes & Panfletos", desc: "Expressões visuais das lutas e campanhas.", href: "/acervo/cartazes", cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
  { title: "Atas & Documentos", desc: "Deliberações e registros institucionais.", href: "/acervo/documentos", cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
  { title: "História Oral", desc: "Entrevistas com lideranças e trabalhadores.", href: "/acervo/entrevistas", cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
];

const CARD_W = 320; // px
const GAP = 16;

export default function FeaturedCarousel() {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);
  const viewportRef = useRef(null);

  const recalc = () => {
    const el = viewportRef.current;
    const w = el?.clientWidth || 320;
    const pv = Math.max(1, Math.floor((w + GAP) / (CARD_W + GAP)));
    setPerView(pv);
    setIndex((i) => Math.max(0, Math.min(i, Math.max(0, ITEMS.length - pv))));
  };

  useEffect(() => {
    recalc();
    const onR = () => recalc();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  const maxIndex = Math.max(0, ITEMS.length - perView);
  const offset = index * (CARD_W + GAP);

  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-14">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
          <Star className="h-4 w-4" />
          Coleções em destaque
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-black to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black to-transparent" />

          <div className="absolute -left-2 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
          <div className="absolute -right-2 top-1/2 z-10 -translate-y-1/2">
            <button
              onClick={() => setIndex((i) => Math.min(maxIndex, i + 1))}
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
              {ITEMS.map((it, idx) => (
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
                  <div className="absolute inset-x-0 bottom:0 bottom-0 p-4">
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
      </motion.div>
    </section>
  );
}
