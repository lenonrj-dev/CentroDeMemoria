"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Images, Newspaper, FileText, Mic2, ArrowRight } from "lucide-react";
import Link from "next/link";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const TABS = [
  { key: "fotos", label: "Fotografias", icon: Images, desc: "Coleções fotográficas com metadados e crédito." , href: "/acervo/fotos"},
  { key: "jornais", label: "Jornais", icon: Newspaper, desc: "Edições digitalizadas com leitura confortável.", href: "/jornais-de-epoca"},
  { key: "docs", label: "Documentos", icon: FileText, desc: "Atas, ofícios e relatórios organizados por série.", href: "/acervo/documentos"},
  { key: "oral", label: "História Oral", icon: Mic2, desc: "Entrevistas em áudio/vídeo com indexação por temas.", href: "/acervo/entrevistas"},
];

export default function MediaHubs() {
  const [tab, setTab] = useState("fotos");

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
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Centrais de mídia</h2>
          <p className="mt-1 text-sm text-white/70">Acesse hubs por tipo de material.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              className={
                "rounded-lg border px-3 py-1.5 text-sm transition " +
                (tab === t.key ? "border-white/20 bg-white/15 text-white"
                                : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10")
              }
            >
              <span className="inline-flex items-center gap-2">
                <t.icon className="h-4 w-4" />
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
          {TABS.map((t) =>
            t.key === tab ? (
              <div key={t.key}>
                <div className="inline-flex items-center gap-2 text-white/80">
                  <t.icon className="h-5 w-5" />
                  <span className="font-medium">{t.label}</span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">{t.desc}</p>
                <Link href={t.href} className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15">
                  Acessar hub <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : null
          )}
        </div>
      </motion.div>
    </section>
  );
}
