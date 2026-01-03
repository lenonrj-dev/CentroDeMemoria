"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { History, ChevronLeft, ChevronRight } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const DECADES = [
  { label: "1940s", text: "Expansão industrial e novas demandas de segurança." },
  { label: "1950s", text: "Urbanização acelerada e imprensa operária." },
  { label: "1960s", text: "Organização e comissões de fábrica." },
  { label: "1970s", text: "Greves históricas e recomposição sindical." },
  { label: "1980s", text: "Constituição cidadã e participação social." },
];

const CARD_W = 360;
const GAP = 16;

export default function TimelineCurated() {
  const [idx, setIdx] = useState(0);
  const [perView, setPerView] = useState(1);
  const viewportRef = useRef(null);

  const recalc = () => {
    const w = viewportRef.current?.clientWidth || CARD_W;
    const pv = Math.max(1, Math.floor((w + GAP) / (CARD_W + GAP)));
    setPerView(pv);
    setIdx((i) => Math.max(0, Math.min(i, Math.max(0, DECADES.length - pv))));
  };

  useEffect(() => {
    recalc();
    const onR = () => recalc();
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);

  const maxIndex = Math.max(0, DECADES.length - perView);
  const offset = idx * (CARD_W + GAP);

  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
          <History className="h-4 w-4" />
          Linha do tempo
        </div>

        <div className="relative">
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
              {DECADES.map((d) => (
                <article key={d.label} className="w-[360px] shrink-0 rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                  <div className="text-sm font-medium text-white/80">{d.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{d.text}</p>
                  <div className="mt-3 text-xs text-white/60">Ver itens desta década →</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
