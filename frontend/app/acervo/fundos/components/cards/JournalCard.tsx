import Image from "next/image";
import Link from "next/link";
import type { BaseItem } from "../../types";

export function JournalCard({ item, href }: { item: BaseItem; href: string }) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 shadow transition hover:border-white/40 hover:shadow-lg hover:shadow-black/40 sm:grid-cols-[160px,1fr] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/70 focus-visible:ring-offset-black"
    >
      <div className="relative h-40 w-full sm:h-full">
        <Image
          src={
            item.image ||
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg"
          }
          alt={item.title}
          fill
          sizes="(min-width:1024px) 160px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 rounded-lg border border-white/15 bg-black/50 px-2 py-1 text-[11px] text-white/80">
          Jornal de epoca
        </div>
      </div>
      <div className="space-y-1 p-4">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60">
          <span>{item.date}</span>
          {item.location && (
            <>
              <span>ƒ?½</span>
              <span>{item.location}</span>
            </>
          )}
        </div>
        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
        <p className="line-clamp-2 text-xs text-white/70">{item.summary}</p>
        {item.tags?.length ? (
          <div className="flex flex-wrap gap-1 text-[11px] text-white/65">
            {item.tags.map((t) => (
              <span key={t} className="rounded-full border border-amber-300/40 bg-amber-300/5 px-2 py-0.5 text-amber-100">
                {t}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
