import routes from "../generated/backend-routes.json";

type RouteEntry = { method: string; path: string };

const routeSet = new Set(
  (routes as RouteEntry[]).map((route) => `${route.method.toUpperCase()} ${route.path}`)
);
const pathSet = new Set((routes as RouteEntry[]).map((route) => route.path));

function normalizePath(pathValue: string) {
  const raw = pathValue.startsWith("/") ? pathValue : `/${pathValue}`;
  const normalizedPath = raw.split("?")[0];
  let normalized = normalizedPath;
  if (normalized.startsWith("/api/backend")) return normalized.replace(/\/{2,}/g, "/");
  if (normalized.startsWith("/api/")) {
    normalized = `/api/backend${normalized.slice(4)}`;
  } else if (normalized.startsWith("/admin/")) {
    normalized = `/api/backend${normalized}`;
  } else if (normalized.startsWith("/devops/")) {
    normalized = `/api/backend${normalized}`;
  } else {
    normalized = `/api/backend${normalized}`;
  }
  return normalized.replace(/\/{2,}/g, "/");
}

export function resolveBackendPath(method: string, pathValue: string) {
  const normalized = normalizePath(pathValue);
  const key = `${method.toUpperCase()} ${normalized}`;
  if (routeSet.has(key) || pathSet.has(normalized)) return normalized;

  const fallback = normalized.replace(/devops-/, "devops/");
  if (routeSet.has(`${method.toUpperCase()} ${fallback}`) || pathSet.has(fallback)) return fallback;

  const plural = normalized.endsWith("log") ? `${normalized}s` : normalized;
  if (routeSet.has(`${method.toUpperCase()} ${plural}`) || pathSet.has(plural)) return plural;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(`[devops] rota nao encontrada: ${method} ${normalized}`);
  }

  return normalized;
}
