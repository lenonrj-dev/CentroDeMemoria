"use client";

import { motion } from "framer-motion";
import { BookOpenCheck } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function CuratorialNotes() {
  const notes = [
    "Contextualização histórica e técnica para cada coleção.",
    "Metadados padronizados, controle de vocabulário e datas aproximadas quando indicado (~).",
    "Preservação digital com checagens periódicas e redundância.",
    "Revisão contínua a partir de novas informações e contribuições.",
    "Crédito a fotógrafos(as), autores(as) e detentores de direitos sempre que identificados.",
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
        <div className="inline-flex items-center gap-2 text-white/80">
          <BookOpenCheck className="h-5 w-5" />
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Notas curatoriais</h2>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/70">
          {notes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </motion.div>
    </section>
  );
}
