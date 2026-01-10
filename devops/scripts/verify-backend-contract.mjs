import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd());
const routesFile = path.join(rootDir, "generated", "backend-routes.json");
const usageFile = path.join(rootDir, ".generated", "api-usage.json");

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Arquivo nao encontrado: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizePath(pathValue) {
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

function resolvePath(method, pathValue, routeSet, pathSet) {
  const normalized = normalizePath(pathValue);
  const key = `${method} ${normalized}`;
  if (routeSet.has(key) || pathSet.has(normalized)) return normalized;

  const fallback = normalized.replace(/devops-/, "devops/");
  if (routeSet.has(`${method} ${fallback}`) || pathSet.has(fallback)) return fallback;

  const plural = normalized.endsWith("log") ? `${normalized}s` : normalized;
  if (routeSet.has(`${method} ${plural}`) || pathSet.has(plural)) return plural;

  return normalized;
}

async function checkPreflight(baseUrl, pathValue) {
  const origin = "https://devops-cmodrm.vercel.app";
  const res = await fetch(`${baseUrl}${pathValue}`, {
    method: "OPTIONS",
    headers: {
      Origin: origin,
      "Access-Control-Request-Method": "GET",
      "Access-Control-Request-Headers": "authorization,content-type,x-requested-with",
    },
  });
  if (res.status === 404) {
    throw new Error(`Preflight 404 ${pathValue}`);
  }
  const allowOrigin = res.headers.get("access-control-allow-origin");
  if (allowOrigin !== origin) {
    throw new Error(`CORS allow-origin mismatch ${pathValue}: ${allowOrigin}`);
  }
}

async function main() {
  const routes = loadJson(routesFile);
  const usage = loadJson(usageFile);

  const routeSet = new Set(routes.map((r) => `${r.method} ${r.path}`));
  const pathSet = new Set(routes.map((r) => r.path));

  const missing = [];
  const resolved = [];
  for (const item of usage) {
    const method = (item.method || "GET").toUpperCase();
    const pathValue = item.path || "";
    const resolvedPath = resolvePath(method, pathValue, routeSet, pathSet);
    const exists = routeSet.has(`${method} ${resolvedPath}`) || pathSet.has(resolvedPath);
    resolved.push({ method, path: resolvedPath });
    if (!exists) {
      missing.push({ method, path: resolvedPath, source: pathValue });
    }
  }

  if (missing.length) {
    const sample = missing.slice(0, 6).map((item) => `${item.method} ${item.path}`);
    throw new Error(`Rotas nao encontradas: ${sample.join(", ")}`);
  }

  const baseUrl = process.env.BACKEND_BASE_URL;
  if (baseUrl) {
    await checkPreflight(baseUrl, "/api/backend/admin/overview");
    await checkPreflight(baseUrl, "/api/backend/admin/documentos?page=1&limit=1");
  }

  // eslint-disable-next-line no-console
  console.log("[verify] backend contract ok");
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[verify] backend contract failed", error);
  process.exit(1);
});
