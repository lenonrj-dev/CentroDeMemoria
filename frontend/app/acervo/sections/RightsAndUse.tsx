"use client";

import { motion } from "framer-motion";
import { Shield, Scale, BadgeCheck } from "lucide-react";
import Link from "next/link";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function RightsAndUse() {
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
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Direitos, uso e créditos</h2>
          <p className="mt-1 text-sm text-white/70">Como citar e solicitar autorização de uso.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card
            icon={Shield}
            title="Termos de uso"
            text="Consulte políticas de acesso, privacidade e eventual restrição de itens."
            href="/acesso-a-informacao/politica"
          />
          <Card
            icon={Scale}
            title="Direitos autorais"
            text="Itens podem ter restrições legais. Verifique a licença e peça autorização quando necessário."
            href="/acesso-a-informacao/politica"
          />
          <Card
            icon={BadgeCheck}
            title="Como creditar"
            text="Ex.: “Banco de Memória Sintracon — Coleção X, Série Y, Item Z”."
            href="/acesso-a-informacao/politica"
          />
        </div>
      </motion.div>
    </section>
  );
}

function Card({ icon: Icon, title, text, href }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="inline-flex items-center gap-2 text-white/80">
        <Icon className="h-5 w-5" />
        <span className="font-medium">{title}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{text}</p>
      <Link href={href} className="mt-3 inline-block text-sm text-white/80 underline-offset-2 hover:underline">Ver diretrizes</Link>
    </article>
  );
}
