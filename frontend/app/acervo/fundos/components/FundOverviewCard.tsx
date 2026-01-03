import Image from "next/image";
import Link from "next/link";
import type { Fund } from "../types";

export function FundOverviewCard({ fund }: { fund: Fund }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="relative h-44 w-full">
        <Image
          src={fund.image}
          alt={fund.name}
          fill
          sizes="320px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-3 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-white/80">
          Fundos - {fund.name}
        </div>
      </div>
      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold text-white">{fund.name}</h3>
        <p className="text-sm text-white/70">{fund.summary}</p>
        <div className="flex flex-wrap gap-2 text-[11px] text-white/65">
          {fund.highlights.map((h) => (
            <span key={h} className="rounded-lg border border-white/10 bg-black/30 px-2 py-1">
              {h}
            </span>
          ))}
        </div>
        <Link
          href={`/acervo/fundos/${fund.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/90"
        >
          Acessar fundo ƒÅ'
        </Link>
      </div>
    </div>
  );
}
