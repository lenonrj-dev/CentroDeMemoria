"use client";

import { motion } from "framer-motion";
import { MapPin, Clock3, Accessibility } from "lucide-react";
import type { ContactAddressesContent } from "../../../lib/content-types";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type ContactAddressesProps = {
  content: ContactAddressesContent;
};

export default function ContactAddresses({ content }: ContactAddressesProps) {
  return (
    <section id="enderecos" className="relative w-full py-8 sm:py-12 lg:py-14">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-xl font-semibold text-white sm:text-2xl">{content.heading}</h2>
        <p className="mt-2 text-sm text-white/70">{content.description}</p>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {content.locations.map((location) => (
            <Card
              key={location.title}
              title={location.title}
              address={location.address}
              hours={location.hours}
              a11y={location.a11y}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

type CardProps = {
  title: string;
  address: string;
  hours: string;
  a11y: string;
};

function Card({ title, address, hours, a11y }: CardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <h3 className="text-base font-semibold text-white/90">{title}</h3>
      <div className="mt-2 space-y-1 text-sm text-white/70">
        <p className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {address}
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {hours}
        </p>
        <p className="flex items-center gap-2">
          <Accessibility className="h-4 w-4" />
          {a11y}
        </p>
      </div>
    </div>
  );
}
