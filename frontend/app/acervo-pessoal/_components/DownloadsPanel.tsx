"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import StudyModal from "@/components/viewer/StudyModal";
import { isFileUrl } from "@/lib/viewer";

type DownloadItem = { label: string; href: string };

export default function DownloadsPanel({ items }: { items: DownloadItem[] }) {
  const [viewer, setViewer] = useState<DownloadItem | null>(null);

  const filtered = useMemo(
    () => items.filter((item) => item.href && item.href !== "#"),
    [items]
  );

  if (filtered.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
      <div className="mb-3 inline-flex items-center gap-2 text-lg font-semibold text-white">
        <FileText className="h-5 w-5" /> Materiais para consulta
      </div>
      <ul className="mt-2 space-y-2 text-sm">
        {filtered.map((item, idx) => {
          const file = isFileUrl(item.href);
          return (
            <li key={`${item.href}-${idx}`}>
              {file ? (
                <button
                  type="button"
                  onClick={() => setViewer(item)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white hover:bg-black/60"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white hover:bg-black/60"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <StudyModal
        open={Boolean(viewer)}
        onClose={() => setViewer(null)}
        title={viewer?.label || "Documento"}
        src={viewer?.href || ""}
      />
    </div>
  );
}
