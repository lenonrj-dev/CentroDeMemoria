import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import type { DocumentCardProps } from "../types";

export function DocumentCard({ title, summary, date, location, tags, href }: DocumentCardProps) {
  const body = (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-white/20">
      <div className="flex items-center gap-2 text-[11px] text-white/60">
        <Calendar className="h-3.5 w-3.5" />
        <span>{date}</span>
        {location && (
          <>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </span>
          </>
        )}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="line-clamp-2 text-sm text-white/70">{summary}</p>
      {tags && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-[11px] text-white/70">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return href ? <Link href={href}>{body}</Link> : body;
}
