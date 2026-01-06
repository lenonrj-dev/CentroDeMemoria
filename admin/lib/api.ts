export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend").replace(/\/+$/, "");

export function joinUrl(base: string, path: string) {
  const cleanBase = (base || "").replace(/\/+$/, "");
  let normalized = path.startsWith("/") ? path : `/${path}`;
  normalized = normalized.replace(/^\/api\/backend(\/|$)/, "/");
  normalized = normalized.replace(/^\/api(\/|$)/, "/");
  normalized = normalized.replace(/\/{2,}/g, "/");

  if (!cleanBase) return normalized;
  return `${cleanBase}${normalized}`;
}
