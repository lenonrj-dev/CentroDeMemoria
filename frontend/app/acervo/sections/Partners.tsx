"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

const PARTNERS = [
  { name: "Arquivo Municipal", logo: "/file.svg" },
  { name: "Universidade X", logo: "/next.svg" },
  { name: "Fundação Y", logo: "/vercel.svg" },
  { name: "Instituto Z", logo: "/globe.svg" },
];

export default function Partners() {
  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">Parcerias & apoios</h2>
        <p className="mt-1 text-sm text-white/70">Instituições que colaboram para manter e ampliar este acervo.</p>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PARTNERS.map((p) => (
            <div key={p.name} className="flex items-center justify-center rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
              <Image
                src={p.logo}
                alt={`Logo ${p.name}`}
                width={100}
                height={40}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
