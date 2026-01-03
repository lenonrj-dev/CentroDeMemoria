import type { AcervoItem } from "../../api";

export function decadeOf(dateStr: string) {
  const y = Number((dateStr || "").slice(0, 4));
  if (!y || Number.isNaN(y)) return "";
  const d = Math.floor(y / 10) * 10;
  return `${d}s`;
}

export function getAllTags(items: AcervoItem[]) {
  const s = new Set<string>();
  items.forEach((it) => it.tags?.forEach?.((t) => s.add(t)));
  return Array.from(s).sort();
}

export function getAllDecades(items: AcervoItem[]) {
  const s = new Set<string>();
  items.forEach((it) => s.add(decadeOf(it.date)));
  return ["Todas", ...Array.from(s).filter((d) => d).sort()];
}

export function filterItems(
  items: AcervoItem[],
  picked: string[],
  decade: string,
  query: string
) {
  let arr = items.slice();
  if (picked.length) arr = arr.filter((i) => picked.every((t) => i.tags.includes(t)));
  if (decade !== "Todas") arr = arr.filter((i) => decadeOf(i.date) === decade);
  if (query) {
    arr = arr.filter((i) => `${i.title} ${i.summary} ${i.tags.join(" ")}`.toLowerCase().includes(query));
  }
  return arr;
}
