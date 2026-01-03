"use client";

import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import type { ContactMapContent } from "../../../lib/content-types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type ContactMapProps = {
  content: ContactMapContent;
};

export default function ContactMap({ content }: ContactMapProps) {
  return (
    <section className="relative w-full py-8 sm:py-12 lg:py-14">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white sm:text-2xl">{content.heading}</h2>
          <MapPinned className="h-5 w-5 text-white/70" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <iframe
            title={content.iframeTitle}
            src={content.iframeSrc}
            className="h-[360px] w-full"
            loading="lazy"
          />
        </div>
        <p className="mt-2 text-xs text-white/60">{content.note}</p>
      </motion.div>
    </section>
  );
}
