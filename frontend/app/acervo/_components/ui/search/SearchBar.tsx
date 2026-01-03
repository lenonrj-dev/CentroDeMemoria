import { Search } from "lucide-react";

export function SearchBar({
  placeholder,
  ariaLabel,
}: {
  placeholder?: string;
  ariaLabel?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
      <Search className="h-4 w-4 text-white/60" />
      <input
        aria-label={ariaLabel || "Buscar"}
        placeholder={placeholder || "Buscar..."}
        className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
      />
    </div>
  );
}
