import { NextResponse } from "next/server";
import path from "path";
import { access, readFile } from "fs/promises";

const FILES: Record<string, { path: string; contentType: string; filename: string }> = {
  "catalogo-documentos": {
    path: "datasets/catalogo-documentos.csv",
    contentType: "text/csv; charset=utf-8",
    filename: "catalogo-documentos.csv",
  },
  pedidos: {
    path: "datasets/pedidos.csv",
    contentType: "text/csv; charset=utf-8",
    filename: "pedidos.csv",
  },
  vocabulario: {
    path: "datasets/vocabulario.json",
    contentType: "application/json; charset=utf-8",
    filename: "vocabulario.json",
  },
  "memoria-operaria": {
    path: "pdfs/memoria-operaria.pdf",
    contentType: "application/pdf",
    filename: "memoria-operaria.pdf",
  },
  "inventario-acervo": {
    path: "pdfs/inventario-acervo.pdf",
    contentType: "application/pdf",
    filename: "inventario-acervo.pdf",
  },
  "inventario-fotografico": {
    path: "pdfs/inventario-fotografico.pdf",
    contentType: "application/pdf",
    filename: "inventario-fotografico.pdf",
  },
  "guia-digitalizacao": {
    path: "pdfs/guia-digitalizacao.pdf",
    contentType: "application/pdf",
    filename: "guia-digitalizacao.pdf",
  },
  "comissoes-fabrica": {
    path: "pdfs/comissoes-fabrica.pdf",
    contentType: "application/pdf",
    filename: "comissoes-fabrica.pdf",
  },
};

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params;
  const entry = FILES[id];

  if (!entry) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  try {
    const root = process.cwd();
    const candidates = [path.join(root, "public"), path.join(root, "frontend", "public")];
    let filePath = "";
    for (const base of candidates) {
      const candidate = path.join(base, entry.path);
      try {
        await access(candidate);
        filePath = candidate;
        break;
      } catch {
        // try next path
      }
    }
    if (!filePath) {
      return NextResponse.json({ error: "not_found" }, { status: 404 });
    }
    const data = await readFile(filePath);
    const res = new NextResponse(data, { status: 200 });
    res.headers.set("Content-Type", entry.contentType);
    res.headers.set("Content-Disposition", `inline; filename="${entry.filename}"`);
    res.headers.set("X-Content-Type-Options", "nosniff");
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
}
