const VIEWER_MAP: Record<string, string> = {
  "/datasets/catalogo-documentos.csv": "catalogo-documentos",
  "/datasets/pedidos.csv": "pedidos",
  "/datasets/vocabulario.json": "vocabulario",
  "/pdfs/memoria-operaria.pdf": "memoria-operaria",
  "/pdfs/inventario-acervo.pdf": "inventario-acervo",
  "/pdfs/inventario-fotografico.pdf": "inventario-fotografico",
  "/pdfs/guia-digitalizacao.pdf": "guia-digitalizacao",
  "/pdfs/comissoes-fabrica.pdf": "comissoes-fabrica",
};

const LOCALE_PREFIX = /^\/(pt-BR|pt-PT|es|en)\//;

export function toViewerUrl(url: string): string {
  if (!url || url === "#") return "";
  const normalized = url.replace(LOCALE_PREFIX, "/");
  const clean = normalized.split("#")[0].split("?")[0];
  const mapped = VIEWER_MAP[clean];
  return mapped ? `/api/viewer/${mapped}` : url;
}

export function isFileUrl(url: string): boolean {
  if (!url) return false;
  return /\.(pdf|csv|json|docx?|xlsx?|pptx?|zip|rar|txt|mp3|mp4|mov|png|jpe?g|webp|gif)(\?|#|$)/i.test(url);
}

export function isPdfUrl(url: string): boolean {
  if (!url) return false;
  return /\.pdf(\?|#|$)/i.test(url);
}
