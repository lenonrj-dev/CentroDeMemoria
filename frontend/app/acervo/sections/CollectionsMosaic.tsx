"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Images, Newspaper, FileText, Mic2 } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const CATS = [
  {
    icon: FileText,
    title: "Documentos",
    desc: "Atas, relatórios, cartas e registros institucionais.",
    href: "/acervo/documentos",
    accent: "from-amber-500/20 via-transparent to-transparent",
  },
  {
    icon: Images,
    title: "Fotográfico",
    desc: "Álbuns, séries fotográficas e metadados essenciais.",
    href: "/acervo/fotos",
    accent: "from-emerald-500/20 via-transparent to-transparent",
  },
  {
    icon: Mic2,
    title: "Depoimentos",
    desc: "História oral, entrevistas e transcrições completas.",
    href: "/acervo/entrevistas",
    accent: "from-sky-500/20 via-transparent to-transparent",
  },
  {
    icon: Newspaper,
    title: "Jornais de época",
    desc: "Boletins, edições e periódicos históricos.",
    href: "/jornais-de-epoca",
    accent: "from-rose-500/20 via-transparent to-transparent",
  },
];

export default function CollectionsMosaic() {
  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Áreas do acervo</h2>
          <p className="mt-2 text-sm text-white/70">
            Navegue pelas principais áreas do acervo e encontre recortes por tema.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.22 }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${c.accent}`} />
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                    <c.icon className="h-5 w-5 text-white/80" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold text-white/90">{c.title}</h3>
                    <p className="text-sm text-white/60">{c.desc}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15"
                  >
                    Ver mais
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
