import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="mt-6 text-right">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar para {label}
      </Link>
    </div>
  );
}
