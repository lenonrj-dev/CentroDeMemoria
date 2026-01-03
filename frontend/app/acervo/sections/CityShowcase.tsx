import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Info, Book, Newspaper, ImageIcon } from "lucide-react";
import type { AcervoContent } from "../../../lib/content-types";

type CitySection = {
  title: string;
  description: string;
  href: string;
  thumb: string;
};

type CityCard = {
  name: string;
  description: string;
  coverage: string;
  focus: string[];
  image: string;
  sections: CitySection[];
};

type Badge = { label: string; icon: "newspaper" | "photo" | "documents" };

const BADGE_ICONS: Record<Badge["icon"], typeof Newspaper | typeof ImageIcon | typeof Book> = {
  newspaper: Newspaper,
  photo: ImageIcon,
  documents: Book,
};

type CityShowcaseProps = {
  content: AcervoContent["cityShowcase"];
};

function CityMeta({ city }: { city: CityCard }) {
  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
        <MapPin className="h-4 w-4" />
        {city.name}
      </div>
      <p className="text-sm text-white/75">{city.description}</p>
      <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/70">
        <Info className="h-3.5 w-3.5" />
        {city.coverage}
      </div>
      <div className="flex flex-wrap gap-2">
        {city.focus.map((tag) => (
          <span key={tag} className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] text-white/75">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionCard({ section }: { section: CitySection }) {
  return (
    <Link
      href={section.href}
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
      <span className="inline-flex items-center gap-1 text-xs text-white/70 group-hover:text-white">
        Abrir <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

export default function CityShowcase({ content }: CityShowcaseProps) {
  return (
    <section className="relative w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/50">
            <Book className="h-4 w-4" />
            {content.eyebrow}
          </div>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{content.title}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70 sm:text-base">{content.description}</p>
        </div>

        <div className="space-y-6">
          {content.cities.map((city) => (
            <article
              key={city.name}
              className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/70 shadow-[0_18px_50px_-40px_rgba(0,0,0,0.8)]"
            >
              <div className="grid gap-0 lg:grid-cols-[1.1fr_1.4fr]">
                <div className="relative h-60 w-full overflow-hidden lg:h-full">
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover"
                    sizes="(min-width:1024px) 40vw, 100vw"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="flex flex-col gap-4 p-5 sm:p-6 lg:p-7">
                  <CityMeta city={city} />
                  <div className="grid gap-3 md:grid-cols-2">
                    {city.sections.map((section) => (
                      <SectionCard key={section.href} section={section} />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-white/60">
                    {content.badges.map((badge) => {
                      const Icon = BADGE_ICONS[badge.icon];
                      return (
                        <span key={badge.label} className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1">
                          <Icon className="h-3.5 w-3.5" /> {badge.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
