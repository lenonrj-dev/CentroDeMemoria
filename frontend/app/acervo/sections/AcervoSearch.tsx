"use client";

import { useEffect, useMemo, useRef, useState, memo, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Filter, Tags, Calendar, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

// mock rápido
const ITEMS = [
  { title: "Boletim Operário — 1952/03", type: "Jornal", date: "1952-03-10", tags: ["Greves","Boletins"], href: "/acervo/boletins/1952-03" },
  { title: "Fotografia: Pátio da Fábrica — 1948", type: "Foto", date: "1948-06-01", tags: ["Fotografia","Cotidiano"], href: "/acervo/fotos/fabrica-1948" },
  { title: "Ata de Assembleia — 1961/09", type: "Documento", date: "1961-09-18", tags: ["Atas","Assembleia"], href: "/acervo/documentos/ata-1961-09" },
  { title: "Entrevista com M. Santos — 1983", type: "Entrevista", date: "1983-11-02", tags: ["Oral","Lideranças"], href: "/acervo/entrevistas/m-santos-1983" },
  { title: "Cartaz de Mobilização — 1979", type: "Cartaz", date: "1979-04-20", tags: ["Cartazes","Mobilização"], href: "/acervo/cartazes/1979-mob" },
  { title: "Boletim Operário — 1953/07", type: "Jornal", date: "1953-07-05", tags: ["Greves","Boletins"], href: "/acervo/boletins/1953-07" },
];

const TYPES = ["Todos","Jornal","Foto","Documento","Entrevista","Cartaz"];
const TAGS = ["Boletins","Greves","Fotografia","Cotidiano","Atas","Assembleia","Oral","Lideranças","Mobilização","Cartazes"];
type Item = (typeof ITEMS)[number];
type ResultItemProps = { item: Item; measureRef?: ((el: HTMLElement | null) => void) | RefObject<HTMLElement | null> };

const ResultItem = memo(function ResultItem({ item, measureRef }: ResultItemProps) {
  return (
    <motion.article
      ref={measureRef}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22 }}
      className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
    >
      <div className="mb-1 inline-flex items-center gap-2 text-[11px] text-white/60">
        <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5">{item.type}</span>
        <Calendar className="h-3.5 w-3.5" />
        <span>{item.date}</span>
      </div>
      <h4 className="text-base font-semibold text-white/90">{item.title}</h4>
      <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-white/60">
        {item.tags.map((t) => <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5">{t}</span>)}
      </div>
      <div className="mt-3">
        <Link href={item.href} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15">
          Ver item <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
});

export default function AcervoSearch() {
  const [q, setQ] = useState("");
  const [deb, setDeb] = useState("");
  const [type, setType] = useState("Todos");
  const [picked, setPicked] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  const firstRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [cardH, setCardH] = useState(0);
  const GAP = 12;
  const MAX_H = 520;

  // ===== scroll lock enquanto o mouse/touch está NO container =====
  const [lockPageScroll, setLockPageScroll] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (!lockPageScroll) return;

    const prevent = (e) => {
      // bloqueia rolagem global
      e.preventDefault();
    };
    const preventKeys = (e) => {
      const keys = ["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "];
      if (keys.includes(e.key)) e.preventDefault();
    };

    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });

    return () => {
      window.removeEventListener("wheel", prevent);
      window.removeEventListener("touchmove", prevent);
      window.removeEventListener("keydown", preventKeys);
    };
  }, [lockPageScroll]);

  const handleMouseEnter = () => {
    setLockPageScroll(true);
    viewportRef.current?.focus();
  };
  const handleMouseLeave = () => setLockPageScroll(false);

  const handleTouchStart = (e) => {
    setLockPageScroll(true);
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    const y = e.touches[0].clientY;
    const dy = touchStartY.current - y;
    if (Math.abs(dy) > 6) {
      e.preventDefault();
      step(dy > 0 ? 1 : -1);
      touchStartY.current = y;
    }
  };
  const handleTouchEnd = () => setLockPageScroll(false);

  // ===== debounce da busca =====
  useEffect(() => {
    const t = setTimeout(() => setDeb(q.trim().toLowerCase()), 220);
    return () => clearTimeout(t);
  }, [q]);

  // ===== filtragem =====
  const filtered = useMemo(() => {
    let arr = ITEMS.slice();
    if (type !== "Todos") arr = arr.filter((i) => i.type === type);
    if (picked.length) arr = arr.filter((i) => picked.every((t) => i.tags.includes(t)));
    if (deb) arr = arr.filter((i) => (i.title + " " + i.tags.join(" ")).toLowerCase().includes(deb));
    return arr;
  }, [deb, type, picked]);

  // ===== cálculo de layout =====
  const recalc = () => {
    const v = viewportRef.current;
    const c = firstRef.current;
    const vh = v?.clientHeight ?? MAX_H;
    let ch = c?.offsetHeight;
    if (!ch) ch = cardH || 150;
    const pv = Math.max(1, Math.floor((vh + GAP) / (ch + GAP)));
    setCardH(ch);
    setPerView(pv);
    setIndex((i) => Math.max(0, Math.min(i, Math.max(0, filtered.length - pv))));
  };

  useEffect(() => {
    recalc();
    const onR = () => recalc();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  useEffect(() => {
    setIndex(0);
    const t = setTimeout(recalc, 0);
    return () => clearTimeout(t);
  }, [deb, type, picked, filtered.length]);

  const maxIndex = Math.max(0, filtered.length - perView);
  const offset = index * (cardH + GAP);
  const step = (d) => setIndex((i) => Math.max(0, Math.min(i + d, maxIndex)));

  // ===== rolagem e teclado no viewport =====
  const onWheel = (e) => {
    const dy = e.deltaY;
    if (Math.abs(dy) < 6) return;
    e.preventDefault();
    step(dy > 0 ? 1 : -1);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault(); step(1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault(); step(-1);
    } else if (e.key === "Home") {
      e.preventDefault(); setIndex(0);
    } else if (e.key === "End") {
      e.preventDefault(); setIndex(maxIndex);
    } else if (e.key === " ") {
      e.preventDefault(); step(1);
    }
  };

  const toggleTag = (t) =>
    setPicked((list) => (list.includes(t) ? list.filter((x) => x !== t) : [...list, t]));

  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        {/* barra de busca + filtros */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <label htmlFor="acervo-search" className="sr-only">Buscar</label>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                <Search className="h-4 w-4 text-white/60" />
                <input
                  id="acervo-search"
                  placeholder="Buscar por título ou tag…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/60" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4 text-white/60" />
                <div className="flex flex-wrap gap-2">
                  {["Boletins","Fotografia","Atas","Cartazes"].map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTag(t)}
                      aria-pressed={picked.includes(t)}
                      className={
                        "rounded-lg border px-2.5 py-1.5 text-xs transition " +
                        (picked.includes(t)
                          ? "border-white/20 bg-white/15 text-white"
                          : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* resultados (lista vertical sem scrollbar) */}
          <div className="relative mt-4">
            <div className="pointer-events-none absolute -top-8 right-0 z-10 flex gap-2">
              <button
                onClick={() => step(-1)}
                aria-label="Anterior"
                className="pointer-events-auto rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Próximo"
                className="pointer-events-auto rounded-xl border border-white/20 bg-black/70 p-2 text-white hover:bg-black/90"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={viewportRef}
              tabIndex={0}
              onWheel={onWheel}
              onKeyDown={onKeyDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              role="region"
              aria-label="Resultados do acervo (navegação por setas/rolagem)"
              className="overflow-hidden outline-none"
              style={{ maxHeight: "520px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: `${GAP}px`,
                  transform: `translateY(-${offset}px)`,
                  transition: "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
                  willChange: "transform",
                }}
              >
                <AnimatePresence initial={false} mode="popLayout">
                  {filtered.map((it, idx) => (
                    <ResultItem key={it.href} item={it} measureRef={idx === 0 ? firstRef : null} />
                  ))}

                  {filtered.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/60"
                    >
                      Nenhum resultado para sua busca. Ajuste filtros ou termos.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {index < maxIndex && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent" />
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
