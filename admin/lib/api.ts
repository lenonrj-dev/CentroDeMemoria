const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/+$/, "");
const API_BASE_PATH = (process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend").replace(/\/+$/, "");

export const API_BASE_URL = `${BACKEND_ORIGIN}${API_BASE_PATH}`;

export function joinUrl(base: string, path: string) {
  const cleanBase = (base || "").replace(/\/+$/, "");
  let normalized = path.startsWith("/") ? path : `/${path}`;
  normalized = normalized.replace(/^\/api\/backend(\/|$)/, "/");
  normalized = normalized.replace(/^\/api(\/|$)/, "/");
  normalized = normalized.replace(/\/{2,}/g, "/");

  if (!cleanBase) return normalized;
  return `${cleanBase}${normalized}`;
}
