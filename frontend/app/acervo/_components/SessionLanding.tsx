"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Book, MapPin } from "lucide-react";
import { ReactNode } from "react";
import { CityData, CitySection } from "../cityData";
import { Breadcrumb } from "./ui";
import { useTranslations } from "next-intl";

type Props = {
  city: CityData;
  section: CitySection;
  breadcrumb?: { label: string; href?: string }[];
  children?: ReactNode;
};

export default function SessionLanding({ city, section, breadcrumb, children }: Props) {
  const t = useTranslations("acervo.sessionLanding");

  return (
    <section className="relative w-full py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        {/* Hero da sessão */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.3fr]">
          <div className="relative h-60 w-full overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={city.image}
              alt={city.name}
              fill
              className="object-cover"
              sizes="(min-width:1024px) 42vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-3 py-1 text-xs text-white/70">
                <MapPin className="h-3.5 w-3.5" />
                {city.name}
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{section.title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/75">{section.description}</p>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Book className="h-4 w-4" />
              {t("aboutSection")}
            </div>
            <p className="text-sm text-white/75">
              {t("intro", { section: section.title.toLowerCase(), city: city.name })}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/acervo/${city.slug}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("backCity", { city: city.name })}
              </Link>
              <Link
                href="/acervo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-3 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                {t("overview")}
              </Link>
            </div>
          </div>
        </div>

        {children}

        {/* CTA */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">{t("cta.title", { city: city.name })}</p>
            <p className="text-xs text-white/70">{t("cta.subtitle", { city: city.name })}</p>
          </div>
          <Link
            href={`/acervo/${city.slug}`}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            {t("cta.action")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
