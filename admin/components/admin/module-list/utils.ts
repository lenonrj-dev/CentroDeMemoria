import type { ListItem, ListMeta, ListQuery, SortKey } from "./types";

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function buildQueryString(q: ListQuery) {
  const params = new URLSearchParams();
  params.set("page", String(q.page));
  params.set("limit", String(q.limit));
  if (q.q.trim()) params.set("q", q.q.trim());
  if (q.status) params.set("status", q.status);
  if (q.tag.trim()) params.set("tag", q.tag.trim());
  if (q.personSlug?.trim()) params.set("personSlug", q.personSlug.trim());
  if (q.fundKey?.trim()) params.set("fundKey", q.fundKey.trim());
  if (q.featured) params.set("featured", q.featured);
  if (q.sort) params.set("sort", q.sort);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(d);
}

export function statusLabel(status: string) {
  if (status === "published") return "Publicado";
  if (status === "archived") return "Arquivado";
  return "Rascunho";
}

export function statusTone(status: string) {
  if (status === "published") return "emerald";
  if (status === "archived") return "zinc";
  return "amber";
}

export function getItemId(item: ListItem) {
  return String((item as any)._id || "");
}

export function safeMeta(meta?: Partial<ListMeta> | null): ListMeta {
  return {
    page: meta?.page ?? 1,
    limit: meta?.limit ?? 20,
    total: meta?.total ?? 0,
    totalPages: meta?.totalPages ?? 1,
    hasNext: meta?.hasNext ?? false,
    hasPrev: meta?.hasPrev ?? false,
  };
}

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: "updated_desc", label: "Mais recentes (edição)" },
  { value: "updated_asc", label: "Mais antigos (edição)" },
  { value: "created_desc", label: "Mais recentes (criação)" },
  { value: "created_asc", label: "Mais antigos (criação)" },
  { value: "published_desc", label: "Publicação (desc)" },
  { value: "published_asc", label: "Publicação (asc)" },
  { value: "title_asc", label: "Título (A–Z)" },
  { value: "title_desc", label: "Título (Z–A)" },
  { value: "featured_desc", label: "Destaque primeiro" },
  { value: "featured_asc", label: "Destaque por último" },
  { value: "sortOrder_asc", label: "sortOrder (asc)" },
  { value: "sortOrder_desc", label: "sortOrder (desc)" },
];
