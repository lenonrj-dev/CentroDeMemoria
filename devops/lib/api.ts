export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "").replace(/\/+$/, "");

export function joinUrl(base: string, path: string) {
  const cleanBase = (base || "").replace(/\/+$/, "");
  let normalized = path.startsWith("/") ? path : `/${path}`;

  if (normalized.startsWith("/api/backend")) {
    return `${cleanBase}${normalized}`;
  }

  if (normalized.startsWith("/api/")) {
    normalized = `/api/backend${normalized.slice(4)}`;
  } else if (normalized.startsWith("/admin/")) {
    normalized = `/api/backend${normalized}`;
  } else if (normalized.startsWith("/api/backend/") === false) {
    normalized = `/api/backend${normalized}`;
  }

  normalized = normalized.replace(/\/{2,}/g, "/");
  return `${cleanBase}${normalized}`;
}
