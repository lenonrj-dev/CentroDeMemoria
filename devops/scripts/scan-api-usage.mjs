import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(process.cwd());
const generatedDir = path.join(rootDir, ".generated");
const outputFile = path.join(generatedDir, "api-usage.json");

const ignoreDirs = new Set(["node_modules", ".next", ".git", ".generated", "generated"]);
const exts = new Set([".ts", ".tsx", ".js", ".jsx"]);

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (ignoreDirs.has(entry.name)) continue;
      walk(path.join(dir, entry.name), files);
    } else if (exts.has(path.extname(entry.name))) {
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

function extractUsage(content) {
  const results = [];
  const apiRegex = /\bapi(Get|Post|Patch|Delete)\s*(?:<[^>]*>)?\s*\(\s*(['"`])([^'"`]+)\2/g;
  let match;
  while ((match = apiRegex.exec(content))) {
    const method = match[1].toUpperCase();
    const value = match[3];
    if (!value.includes("${")) results.push({ method, path: value });
  }

  const fetchRegex = /\bfetch\s*\(\s*(['"`])([^'"`]+)\1/g;
  while ((match = fetchRegex.exec(content))) {
    const value = match[2];
    if (!value.includes("${")) results.push({ method: "GET", path: value });
  }
  return results;
}

const usage = [];
const files = walk(rootDir);
for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  const found = extractUsage(content);
  found.forEach((item) => usage.push(item));
}

const unique = new Map();
for (const entry of usage) {
  unique.set(`${entry.method} ${entry.path}`, entry);
}

const sorted = Array.from(unique.values()).sort((a, b) => {
  if (a.path === b.path) return a.method.localeCompare(b.method);
  return a.path.localeCompare(b.path);
});

fs.mkdirSync(generatedDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(sorted, null, 2), "utf8");

// eslint-disable-next-line no-console
console.log(`[scan] api usage ${sorted.length}`);
