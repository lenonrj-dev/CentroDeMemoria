import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd());
const routesDir = path.join(rootDir, "src", "routes");
const generatedDir = path.join(rootDir, ".generated");
const outputFile = path.join(generatedDir, "routes.json");

const basePaths = ["/api", "/api/backend"];

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function parseRoutes(filePath) {
  const content = readFileSafe(filePath);
  const routes = [];
  const regex = /\b\w+\.(get|post|patch|put|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi;
  let match;
  while ((match = regex.exec(content))) {
    routes.push({ method: match[1].toUpperCase(), path: match[2] });
  }
  return routes;
}

const publicRoutes = parseRoutes(path.join(routesDir, "public.ts"));
const adminRoutes = parseRoutes(path.join(routesDir, "admin.ts"));
const devopsRoutes = parseRoutes(path.join(routesDir, "devops.ts"));

const routes = [];
const pushRoute = (method, pathValue) => {
  routes.push({ method, path: pathValue.replace(/\/{2,}/g, "/") });
};

for (const base of basePaths) {
  pushRoute("GET", base);
  pushRoute("GET", `${base}/health`);
  pushRoute("GET", `${base}/admin/auth/ping`);

  for (const route of publicRoutes) {
    pushRoute(route.method, `${base}${route.path}`);
  }
  for (const route of adminRoutes) {
    pushRoute(route.method, `${base}/admin${route.path}`);
  }
  for (const route of devopsRoutes) {
    pushRoute(route.method, `${base}/devops${route.path}`);
  }
}

const unique = new Map();
for (const route of routes) {
  unique.set(`${route.method} ${route.path}`, route);
}

const sorted = Array.from(unique.values()).sort((a, b) => {
  if (a.path === b.path) return a.method.localeCompare(b.method);
  return a.path.localeCompare(b.path);
});

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(sorted, null, 2), "utf8");

const devopsGenerated = path.join(rootDir, "..", "devops", "generated");
const devopsOut = path.join(devopsGenerated, "backend-routes.json");
try {
  fs.mkdirSync(devopsGenerated, { recursive: true });
  fs.writeFileSync(devopsOut, JSON.stringify(sorted, null, 2), "utf8");
} catch {
  // ignore if devops folder is missing
}

// eslint-disable-next-line no-console
console.log(`[routes] generated ${sorted.length} routes`);
