"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { HandHeart, Upload, FileCheck2, Box, Mail } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function Contribute() {
  const steps = [
    { icon: Upload, title: "Envie a proposta", desc: "Descreva materiais (tipos, datas, estado, autoria)." },
    { icon: FileCheck2, title: "Avaliação", desc: "Equipe curatorial avalia pertinência e condições." },
    { icon: Box, title: "Entrega/Coleta", desc: "Agendamento e termo de doação/cessão." },
    { icon: HandHeart, title: "Preservação", desc: "Digitalização, catalogação e crédito ao doador." },
  ];

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
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Contribua com o acervo</h2>
          <p className="mt-1 text-sm text-white/70">Doações e cessões de materiais são bem-vindas e fundamentais.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <article key={i} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
              <div className="inline-flex items-center gap-2 text-white/80">
                <s.icon className="h-5 w-5" />
                <span className="font-medium">{s.title}</span>
              </div>
              <p className="mt-2 text-sm text-white/70">{s.desc}</p>
            </article>
          ))}
        </div>

        <div className="mt-4">
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            <Mail className="h-4 w-4" />
            Falar com a equipe
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
