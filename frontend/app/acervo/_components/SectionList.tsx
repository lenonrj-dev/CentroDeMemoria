"use client";

import Image from "next/image";
import { Calendar } from "lucide-react";
import { memo } from "react";
import { SectionItem } from "../cityData";

type Props = {
  items: SectionItem[];
};

function List({ items }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-2" role="list">
      {items.map((item, idx) => (
        <div
          key={`${item.title}-${idx}`}
          className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
          role="listitem"
        >
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <Image src={item.thumb} alt={item.title} fill className="object-contain p-2" sizes="64px" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-white/60">
              <Calendar className="h-3.5 w-3.5" />
              <span>{item.date}</span>
            </div>
            <p className="text-sm font-semibold text-white/90">{item.title}</p>
            <p className="text-xs text-white/70">{item.summary}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default memo(List);
