import Image from "next/image";
import type { SiteContent } from "@/lib/content-types";
import { Section } from "../components/Section";

export function CitySection({ id, name, cover, stats = [], paragraphs, gallery = [] }: SiteContent["about"]["cities"][number]) {
  return (
    <Section id={id} title={name} subtitle="Recortes territoriais">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <figure className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 lg:col-span-7">
          <Image
            src={cover}
            alt={`Imagem da cidade de ${name}`}
            fill
            sizes="(min-width:1024px) 60vw, 100vw"
            className="object-cover"
          />
        </figure>
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div className="prose prose-invert max-w-none text-white/80">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
          {stats.length > 0 && (
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {stats.map((s, i) => (
                <li key={i} className="rounded-xl border border-white/10 bg-black/40 p-3 text-center">
                  <div className="text-lg font-semibold text-white">{s.value}</div>
                  <div className="text-xs text-white/60">{s.label}</div>
                </li>
              ))}
            </ul>
          )}
          {gallery.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {gallery.slice(0, 4).map((img, idx) => (
                <figure key={`${img.src}-${idx}`} className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
                  <div className="relative aspect-[4/3] w-full">
                    <Image src={img.src} alt={img.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                  <figcaption className="px-3 py-2 text-xs text-white/60">{img.alt}</figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
