import Image from "next/image";
import type { SiteContent } from "@/lib/content-types";
import { Pill } from "../components/Pill";

export function HeroSection({ hero }: { hero: SiteContent["about"]["hero"] }) {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[min(70svh,560px)] min-h-[360px]">
        <Image
          src={hero.image}
          alt="Fotografia hist??rica de trabalhadores - acervo digitalizado"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <div className="max-w-3xl rounded-2xl border border-white/10 bg-black/50 p-5 backdrop-blur">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/60">{hero.eyebrow}</p>
              <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{hero.title}</h1>
              <p className="mt-2 text-white/80">{hero.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {hero.pills.map((pill) => (
                  <Pill key={pill}>{pill}</Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
