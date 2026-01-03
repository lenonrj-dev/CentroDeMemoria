import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDb } from "../config/db";
import { DocumentModel } from "../models/document";
import { JournalModel } from "../models/journal";
import { PhotoArchiveModel } from "../models/photo-archive";
import { ReferenceModel } from "../models/reference";
import { TestimonialModel } from "../models/testimonial";

dotenv.config();

type ModuleKey = "documentos" | "depoimentos" | "referencias" | "jornais" | "acervo-fotografico";

type SourceType = "backend-db" | "frontend-fallback";

type InventoryItem = {
  module: ModuleKey;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  tags: string[];
  status?: "draft" | "published" | "archived";
  routes: string[];
  source: {
    type: SourceType;
    file?: string;
    notes?: string;
  };
  raw?: unknown;
};

function repoRoot() {
  return path.resolve(__dirname, "../../..");
}

function toPosix(p: string) {
  return p.replaceAll("\\", "/");
}

function safeWrite(filePath: string, data: string) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, data, "utf8");
}

function routesFor(pathname: string) {
  const base = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return [base, `/{locale}${base}`];
}

function extractFallbackPhotos(): Array<{
  slug: string;
  title: string;
  year: number;
  location: string;
  tags: string[];
  src: string;
}> {
  const file = path.join(repoRoot(), "frontend/app/acervo/fotos/PhotosGalleryClient.tsx");
  const code = fs.readFileSync(file, "utf8");
  const match = code.match(/const\s+FALLBACK_PHOTOS[^=]*=\s*(\[[\s\S]*?\]);/m);
  if (!match) return [];

  const sandbox: { result?: unknown } = {};
  vm.createContext(sandbox);
  vm.runInContext(`result = ${match[1]}`, sandbox);
  const result = sandbox.result;
  if (!Array.isArray(result)) return [];
  return result as any;
}

function readFrontendFallback() {
  const root = repoRoot();

  const { ACERVO_ITEMS } = require(path.join(root, "frontend/app/acervo/api.ts")) as {
    ACERVO_ITEMS: Array<{
      id: string;
      collection: string;
      slug: string;
      title: string;
      date: string;
      location: string;
      cover: string;
      tags: string[];
      summary: string;
      body: string[];
      files: Array<{ label: string; url: string }>;
    }>;
  };

  const { cities } = require(path.join(root, "frontend/app/acervo/cityData.ts")) as {
    cities: Array<{
      slug: string;
      name: string;
      sections: Array<{
        key: string;
        title: string;
        description: string;
        href: string;
        thumb: string;
        items: Array<{ title: string; summary: string; date: string; href: string; thumb: string }>;
      }>;
    }>;
  };

  const { journalsContent } = require(path.join(root, "frontend/app/api/content/journals/data.ts")) as {
    journalsContent: {
      editions: Array<{
        slug: string;
        title: string;
        date: string;
        decade: string;
        summary: string;
        cover: string;
        full: string;
      }>;
    };
  };

  const { productionContent } = require(path.join(root, "frontend/app/api/content/production/data.ts")) as {
    productionContent: {
      items: Array<{
        id: string;
        title: string;
        authors: string[];
        year: number;
        type: string;
        decade: string;
        tags: string[];
        abstract: string;
        cover: string;
        href: string;
        pdf?: string;
      }>;
    };
  };

  const fallbackPhotos = extractFallbackPhotos();

  return { ACERVO_ITEMS, cities, journalsContent, productionContent, fallbackPhotos };
}

function moduleForAcervoCollection(collection: string): ModuleKey | null {
  if (collection === "documentos" || collection === "cartazes") return "documentos";
  if (collection === "entrevistas") return "depoimentos";
  if (collection === "boletins") return "jornais";
  if (collection === "fotos") return "acervo-fotografico";
  return null;
}

async function readBackendDb(): Promise<Record<ModuleKey, InventoryItem[]>> {
  await connectDb();

  const [documentos, depoimentos, referencias, jornais, fotos] = await Promise.all([
    DocumentModel.find({}).lean(),
    TestimonialModel.find({}).lean(),
    ReferenceModel.find({}).lean(),
    JournalModel.find({}).lean(),
    PhotoArchiveModel.find({}).lean(),
  ]);

  const byModule: Record<ModuleKey, InventoryItem[]> = {
    documentos: documentos.map((d: any) => ({
      module: "documentos",
      title: d.title,
      slug: d.slug,
      description: d.description,
      coverImageUrl: d.coverImageUrl,
      tags: d.tags ?? [],
      status: d.status,
      routes: routesFor(`/acervo/documentos/${d.slug}`),
      source: { type: "backend-db" },
      raw: d,
    })),
    depoimentos: depoimentos.map((t: any) => ({
      module: "depoimentos",
      title: t.title,
      slug: t.slug,
      description: t.description,
      coverImageUrl: t.coverImageUrl,
      tags: t.tags ?? [],
      status: t.status,
      routes: routesFor(`/acervo/entrevistas/${t.slug}`),
      source: { type: "backend-db" },
      raw: t,
    })),
    referencias: referencias.map((r: any) => ({
      module: "referencias",
      title: r.title,
      slug: r.slug,
      description: r.description,
      coverImageUrl: r.coverImageUrl,
      tags: r.tags ?? [],
      status: r.status,
      routes: routesFor(`/producao-bibliografica`),
      source: { type: "backend-db" },
      raw: r,
    })),
    jornais: jornais.map((j: any) => ({
      module: "jornais",
      title: j.title,
      slug: j.slug,
      description: j.description,
      coverImageUrl: j.coverImageUrl,
      tags: j.tags ?? [],
      status: j.status,
      routes: routesFor(`/jornais-de-epoca/${j.slug}`),
      source: { type: "backend-db" },
      raw: j,
    })),
    "acervo-fotografico": fotos.map((a: any) => ({
      module: "acervo-fotografico",
      title: a.title,
      slug: a.slug,
      description: a.description,
      coverImageUrl: a.coverImageUrl,
      tags: a.tags ?? [],
      status: a.status,
      routes: routesFor(`/acervo/fotos/${a.slug}`),
      source: { type: "backend-db" },
      raw: a,
    })),
  };

  await mongoose.disconnect();
  return byModule;
}

function buildInventory() {
  const root = repoRoot();
  const { ACERVO_ITEMS, cities, journalsContent, productionContent, fallbackPhotos } = readFrontendFallback();

  const items: Record<ModuleKey, InventoryItem[]> = {
    documentos: [],
    depoimentos: [],
    referencias: [],
    jornais: [],
    "acervo-fotografico": [],
  };

  // app/acervo/api.ts
  for (const it of ACERVO_ITEMS) {
    const module = moduleForAcervoCollection(it.collection);
    if (!module) continue;

    const baseRoute = `/acervo/${it.collection}/${it.slug}`;
    items[module].push({
      module,
      title: it.title,
      slug: it.slug,
      description: it.summary,
      coverImageUrl: it.cover,
      tags: it.tags ?? [],
      routes: routesFor(baseRoute),
      source: {
        type: "frontend-fallback",
        file: toPosix(path.relative(root, path.join(root, "frontend/app/acervo/api.ts"))),
        notes: "Mock local usado quando o backend falha (ou em páginas de detalhe via fallback).",
      },
      raw: it,
    });
  }

  // app/acervo/cityData.ts (cards/itens de seções por cidade)
  for (const city of cities) {
    for (const section of city.sections) {
      const module =
        section.key === "documentos"
          ? "documentos"
          : section.key === "depoimentos"
            ? "depoimentos"
            : section.key === "referencia-bibliografica"
              ? "referencias"
              : section.key === "jornais-de-epoca"
                ? "jornais"
                : section.key === "acervo-fotografico"
                  ? "acervo-fotografico"
                  : null;

      if (!module) continue;

      for (const entry of section.items ?? []) {
        items[module].push({
          module,
          title: entry.title,
          slug: `${city.slug}-${section.key}-${entry.date}`,
          description: entry.summary,
          coverImageUrl: entry.thumb,
          tags: [city.name, section.title],
          routes: routesFor(section.href),
          source: {
            type: "frontend-fallback",
            file: toPosix(path.relative(root, path.join(root, "frontend/app/acervo/cityData.ts"))),
            notes: "Cards de exemplo por cidade; não são páginas de item individual.",
          },
          raw: { city: city.slug, section: section.key, item: entry },
        });
      }
    }
  }

  // app/api/content/journals/data.ts
  for (const ed of journalsContent.editions ?? []) {
    items.jornais.push({
      module: "jornais",
      title: ed.title,
      slug: ed.slug,
      description: ed.summary,
      coverImageUrl: ed.cover,
      tags: [ed.decade],
      routes: routesFor(`/jornais-de-epoca/${ed.slug}`),
      source: {
        type: "frontend-fallback",
        file: toPosix(path.relative(root, path.join(root, "frontend/app/api/content/journals/data.ts"))),
        notes: "Lista local (fallback) usada na landing de jornais quando o backend falha; o leitor usa o backend.",
      },
      raw: ed,
    });
  }

  // app/api/content/production/data.ts
  for (const ref of productionContent.items ?? []) {
    items.referencias.push({
      module: "referencias",
      title: ref.title,
      slug: ref.href?.split("/").filter(Boolean).pop() || ref.id,
      description: ref.abstract,
      coverImageUrl: ref.cover,
      tags: ref.tags ?? [],
      routes: routesFor(`/producao-bibliografica`),
      source: {
        type: "frontend-fallback",
        file: toPosix(path.relative(root, path.join(root, "frontend/app/api/content/production/data.ts"))),
        notes: `Href de detalhe declarado: ${ref.href}`,
      },
      raw: ref,
    });
  }

  // app/acervo/fotos/PhotosGalleryClient.tsx
  for (const p of fallbackPhotos) {
    items["acervo-fotografico"].push({
      module: "acervo-fotografico",
      title: p.title,
      slug: p.slug,
      description: `${p.location}${p.year ? ` (${p.year})` : ""}`,
      coverImageUrl: p.src,
      tags: p.tags ?? [],
      routes: routesFor(`/acervo/fotos/${p.slug}`),
      source: {
        type: "frontend-fallback",
        file: toPosix(path.relative(root, path.join(root, "frontend/app/acervo/fotos/PhotosGalleryClient.tsx"))),
        notes: "Fallback usado quando a API /api/acervo-fotografico retorna vazio.",
      },
      raw: p,
    });
  }

  return items;
}

function routeFileExists(routePath: string) {
  const root = repoRoot();
  const clean = routePath.replace(/^\//, "");
  const candidates = [
    path.join(root, "frontend/app", clean, "page.tsx"),
    path.join(root, "frontend/app", clean, "page.ts"),
    path.join(root, "frontend/app/[locale]", clean, "page.tsx"),
    path.join(root, "frontend/app/[locale]", clean, "page.ts"),
  ];
  return candidates.some((p) => fs.existsSync(p));
}

function buildMarkdownReport(
  db: Record<ModuleKey, InventoryItem[]>,
  fallback: Record<ModuleKey, InventoryItem[]>
) {
  const lines: string[] = [];
  lines.push(`# Inventário de Conteúdo (site x admin schema)`);
  lines.push("");
  lines.push(`Gerado em: ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`Observação: itens do MongoDB (backend) estão listados quando existirem; caso contrário, o site usa fallbacks locais do frontend.`);
  lines.push("");

  const modules: Array<{ key: ModuleKey; label: string; listRoutes: string[] }> = [
    { key: "documentos", label: "Documentos", listRoutes: routesFor("/acervo/documentos") },
    { key: "depoimentos", label: "Depoimentos", listRoutes: routesFor("/acervo/entrevistas") },
    { key: "referencias", label: "Referência bibliográfica", listRoutes: routesFor("/producao-bibliografica") },
    { key: "jornais", label: "Jornais de época", listRoutes: routesFor("/jornais-de-epoca") },
    { key: "acervo-fotografico", label: "Acervo fotográfico", listRoutes: routesFor("/acervo/fotos") },
  ];

  for (const m of modules) {
    const dbItems = db[m.key] ?? [];
    const fbItems = fallback[m.key] ?? [];

    lines.push(`## ${m.label}`);
    lines.push("");
    lines.push(`Rotas públicas (lista): ${m.listRoutes.join("  |  ")}`);
    lines.push("");
    lines.push(`- Backend (MongoDB): ${dbItems.length}`);
    lines.push(`- Fallback (frontend): ${fbItems.length}`);
    lines.push("");

    const all = [...dbItems.map((x) => ({ ...x, sourceLabel: "backend" })), ...fbItems.map((x) => ({ ...x, sourceLabel: "fallback" }))];
    if (!all.length) {
      lines.push(`(sem itens)`);
      lines.push("");
      continue;
    }

    lines.push(`| origem | título | slug | onde aparece | fonte | observações |`);
    lines.push(`|---|---|---|---|---|---|`);

    for (const item of all) {
      const where = item.routes[0] || "";
      const src = item.source.file ? `\`${item.source.file}\`` : item.source.type;
      const obsParts: string[] = [];
      if (item.source.notes) obsParts.push(item.source.notes);

      if (m.key === "referencias" && item.source.type === "frontend-fallback") {
        const href = String((item.raw as any)?.href || "");
        if (href && href.startsWith("/producao-bibliografica/") && !routeFileExists(href)) {
          obsParts.push(`Link de detalhe sem página: ${href}`);
        }
      }

      lines.push(
        `| ${item.sourceLabel} | ${escapeTable(item.title)} | ${escapeTable(item.slug)} | ${escapeTable(where)} | ${escapeTable(src)} | ${escapeTable(
          obsParts.join(" | ")
        )} |`
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

function escapeTable(value: string) {
  return String(value ?? "").replaceAll("\n", " ").replaceAll("|", "\\|");
}

async function main() {
  const fallback = buildInventory();

  let db: Record<ModuleKey, InventoryItem[]> = {
    documentos: [],
    depoimentos: [],
    referencias: [],
    jornais: [],
    "acervo-fotografico": [],
  };

  try {
    db = await readBackendDb();
  } catch (err) {
    try {
      await mongoose.disconnect();
    } catch {}
    console.warn("[inventory] Falha ao ler MongoDB; gerando apenas fallback do frontend.", err);
  }

  const root = repoRoot();
  const reportDir = path.join(root, "reports");
  const jsonPath = path.join(reportDir, "content-inventory.json");
  const mdPath = path.join(reportDir, "content-inventory.md");

  const payload = {
    generatedAt: new Date().toISOString(),
    backend: {
      counts: Object.fromEntries(
        (Object.keys(db) as ModuleKey[]).map((k) => [k, db[k]?.length ?? 0])
      ) as Record<ModuleKey, number>,
      items: db,
    },
    frontendFallback: {
      counts: Object.fromEntries(
        (Object.keys(fallback) as ModuleKey[]).map((k) => [k, fallback[k]?.length ?? 0])
      ) as Record<ModuleKey, number>,
      items: fallback,
    },
  };

  safeWrite(jsonPath, JSON.stringify(payload, null, 2));
  safeWrite(mdPath, buildMarkdownReport(db, fallback));

  console.log(`[inventory] OK: ${toPosix(path.relative(root, mdPath))} (e JSON em ${toPosix(path.relative(root, jsonPath))})`);
}

void main();

