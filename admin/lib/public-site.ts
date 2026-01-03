import type { BaseContent } from "./backend-types";

export type AdminModule = "documentos" | "depoimentos" | "referencias" | "jornais" | "acervo-fotografico" | "acervos-pessoais";

export type PublicRoute = {
  label: string;
  path: string;
  url: string;
};

export const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
export const PUBLIC_SITE_LOCALE = process.env.NEXT_PUBLIC_PUBLIC_SITE_LOCALE || "pt-BR";

export function withPublicLocale(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${PUBLIC_SITE_LOCALE}${p}`;
}

export function publicUrl(path: string) {
  return `${PUBLIC_SITE_URL}${withPublicLocale(path)}`;
}

function uniqByPath(routes: PublicRoute[]) {
  const seen = new Set<string>();
  return routes.filter((r) => {
    if (seen.has(r.path)) return false;
    seen.add(r.path);
    return true;
  });
}

function hasTag(item: Pick<BaseContent, "tags">, tag: string) {
  return (item.tags || []).some((t) => t === tag);
}

export function getPublicRoutes(
  module: AdminModule,
  item: Pick<BaseContent, "slug" | "tags" | "relatedFundKey" | "relatedPersonSlug">
): PublicRoute[] {
  const routes: PublicRoute[] = [];

  const cityTags: Array<{ tag: string; slug: string; label: string }> = [
    { tag: "Volta Redonda", slug: "volta-redonda", label: "Volta Redonda" },
    { tag: "Barra Mansa", slug: "barra-mansa", label: "Barra Mansa" },
  ];

  const hasDomWaldyr =
    hasTag(item, "Dom Waldyr") || item.relatedFundKey === "dom-waldyr" || item.relatedPersonSlug === "dom-waldyr";
  const personSlug = item.relatedPersonSlug || "";

  if (personSlug) {
    routes.push({
      label: "Acervo pessoal",
      path: `/acervo-pessoal/${personSlug}`,
      url: publicUrl(`/acervo-pessoal/${personSlug}`),
    });
  }

  if (module === "acervos-pessoais") {
    routes.push({ label: "Item", path: `/acervo-pessoal/${item.slug}`, url: publicUrl(`/acervo-pessoal/${item.slug}`) });
    routes.push({ label: "Lista", path: "/acervo-pessoal", url: publicUrl("/acervo-pessoal") });
    return uniqByPath(routes);
  }

  if (module === "documentos") {
    const isCartaz = hasTag(item, "Cartazes");
    const collection = isCartaz ? "cartazes" : "documentos";
    routes.push({ label: "Item", path: `/acervo/${collection}/${item.slug}`, url: publicUrl(`/acervo/${collection}/${item.slug}`) });
    routes.push({ label: "Lista", path: "/acervo/documentos", url: publicUrl("/acervo/documentos") });
    if (isCartaz) routes.push({ label: "Lista", path: "/acervo/cartazes", url: publicUrl("/acervo/cartazes") });
    cityTags.forEach((c) => {
      if (hasTag(item, c.tag)) {
        routes.push({ label: `Lista (${c.label})`, path: `/acervo/${c.slug}/documentos`, url: publicUrl(`/acervo/${c.slug}/documentos`) });
      }
    });
    if (hasDomWaldyr) routes.push({ label: "Fundo", path: "/acervo/fundos/dom-waldyr", url: publicUrl("/acervo/fundos/dom-waldyr") });
    return uniqByPath(routes);
  }

  if (module === "acervo-fotografico") {
    routes.push({ label: "Item", path: `/acervo/fotos/${item.slug}`, url: publicUrl(`/acervo/fotos/${item.slug}`) });
    routes.push({ label: "Lista", path: "/acervo/fotos", url: publicUrl("/acervo/fotos") });
    cityTags.forEach((c) => {
      if (hasTag(item, c.tag)) {
        routes.push({
          label: `Lista (${c.label})`,
          path: `/acervo/${c.slug}/acervo-fotografico`,
          url: publicUrl(`/acervo/${c.slug}/acervo-fotografico`),
        });
      }
    });
    if (hasDomWaldyr) routes.push({ label: "Fundo", path: "/acervo/fundos/dom-waldyr", url: publicUrl("/acervo/fundos/dom-waldyr") });
    return uniqByPath(routes);
  }

  if (module === "depoimentos") {
    routes.push({ label: "Item", path: `/acervo/entrevistas/${item.slug}`, url: publicUrl(`/acervo/entrevistas/${item.slug}`) });
    routes.push({ label: "Lista", path: "/acervo/entrevistas", url: publicUrl("/acervo/entrevistas") });
    cityTags.forEach((c) => {
      if (hasTag(item, c.tag)) {
        routes.push({
          label: `Lista (${c.label})`,
          path: `/acervo/${c.slug}/depoimentos`,
          url: publicUrl(`/acervo/${c.slug}/depoimentos`),
        });
      }
    });
    if (hasDomWaldyr) routes.push({ label: "Fundo", path: "/acervo/fundos/dom-waldyr", url: publicUrl("/acervo/fundos/dom-waldyr") });
    return uniqByPath(routes);
  }

  if (module === "jornais") {
    routes.push({ label: "Leitura", path: `/jornais-de-epoca/${item.slug}`, url: publicUrl(`/jornais-de-epoca/${item.slug}`) });
    routes.push({ label: "Leitura (Acervo)", path: `/acervo/boletins/${item.slug}`, url: publicUrl(`/acervo/boletins/${item.slug}`) });
    routes.push({ label: "Lista", path: "/jornais-de-epoca", url: publicUrl("/jornais-de-epoca") });
    routes.push({ label: "Lista (Acervo)", path: "/acervo/boletins", url: publicUrl("/acervo/boletins") });
    cityTags.forEach((c) => {
      if (hasTag(item, c.tag)) {
        routes.push({
          label: `Lista (${c.label})`,
          path: `/acervo/${c.slug}/jornais-de-epoca`,
          url: publicUrl(`/acervo/${c.slug}/jornais-de-epoca`),
        });
      }
    });
    if (hasDomWaldyr) routes.push({ label: "Fundo", path: "/acervo/fundos/dom-waldyr", url: publicUrl("/acervo/fundos/dom-waldyr") });
    return uniqByPath(routes);
  }

  // referências
  routes.push({ label: "Lista", path: "/producao-bibliografica", url: publicUrl("/producao-bibliografica") });
  cityTags.forEach((c) => {
    if (hasTag(item, c.tag)) {
      routes.push({
        label: `Lista (${c.label})`,
        path: `/acervo/${c.slug}/referencia-bibliografica`,
        url: publicUrl(`/acervo/${c.slug}/referencia-bibliografica`),
      });
    }
  });
  if (hasDomWaldyr) routes.push({ label: "Fundo", path: "/acervo/fundos/dom-waldyr", url: publicUrl("/acervo/fundos/dom-waldyr") });
  return uniqByPath(routes);
}
