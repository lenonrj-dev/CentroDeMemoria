"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { memo } from "react";
import { CitySection } from "../cityData";
import { useTranslations } from "next-intl";

type Props = {
  sections: CitySection[];
  compactLinks?: boolean;
};

function Grid({ sections, compactLinks = false }: Props) {
  const t = useTranslations("acervo.sectionGrid");

  return (
    <div className="grid gap-3 md:grid-cols-2" role="list">
      {sections.map((section) => (
        <Link
          key={section.href}
          href={section.href}
          role="listitem"
          className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-black/40">
              <Image src={section.thumb} alt={section.title} fill className="object-contain p-2" sizes="48px" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">{section.title}</p>
              <p className="text-xs text-white/65">{section.description}</p>
            </div>
          </div>
          {!compactLinks && (
            <span className="inline-flex items-center gap-1 text-xs text-white/70 group-hover:text-white">
              {t("open")} <ArrowRight className="h-3.5 w-3.5" />
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

export default memo(Grid);
