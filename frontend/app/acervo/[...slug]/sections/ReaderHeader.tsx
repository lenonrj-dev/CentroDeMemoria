import Link from "next/link";
import { Calendar, FileText, MapPin, Tags as TagsIcon } from "lucide-react";
import type { AcervoItem } from "../../api";
import { Chip } from "../components/Chip";
import { MetaRow } from "../components/MetaRow";

export function ReaderHeader({
  item,
  collectionLabel,
  typeLabel,
}: {
  item: AcervoItem;
  collectionLabel: string;
  typeLabel: string;
}) {
  return (
    <>
      <nav aria-label="breadcrumb" className="mb-6 text-sm text-white/60">
        <ol className="flex items-center gap-2">
          <li>
            <Link href="/acervo" className="hover:text-white">
              Acervo
            </Link>
          </li>
          <li className="text-white/40">/</li>
          <li>
            <Link href={`/acervo/${item.collection}`} className="hover:text-white">
              {collectionLabel}
            </Link>
          </li>
          <li className="text-white/40">/</li>
          <li className="text-white">{item.title}</li>
        </ol>
      </nav>

      <header className="mb-6 sm:mb-8">
        <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
          <FileText className="h-4 w-4" /> {typeLabel}
        </div>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">{item.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <MetaRow icon={Calendar}>{item.date}</MetaRow>
          <MetaRow icon={MapPin}>{item.location}</MetaRow>
          <MetaRow icon={TagsIcon}>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </MetaRow>
        </div>
      </header>
    </>
  );
}
