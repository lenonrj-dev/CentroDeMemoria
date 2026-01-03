import { SiteRouteModel } from "../models/site-route";

const DEFAULT_ROUTES = [
  {
    routePath: "/acervo",
    label: "Acervo (visao geral)",
    routeType: "ACERVO",
    contentTypes: ["documentos", "jornais", "acervo-fotografico", "depoimentos", "referencias"],
    query: {},
    enabled: true,
  },
  {
    routePath: "/acervo/documentos",
    label: "Documentos",
    routeType: "DOCUMENTS",
    contentTypes: ["documentos"],
    query: {},
    enabled: true,
  },
  {
    routePath: "/acervo/cartazes",
    label: "Cartazes e panfletos",
    routeType: "DOCUMENTS",
    contentTypes: ["documentos"],
    query: { tag: "Cartazes" },
    enabled: true,
  },
  {
    routePath: "/acervo/fotos",
    label: "Acervo fotografico",
    routeType: "PHOTOS",
    contentTypes: ["acervo-fotografico"],
    query: {},
    enabled: true,
  },
  {
    routePath: "/acervo/entrevistas",
    label: "Depoimentos e entrevistas",
    routeType: "TESTIMONIALS",
    contentTypes: ["depoimentos"],
    query: {},
    enabled: true,
  },
  {
    routePath: "/jornais-de-epoca",
    label: "Jornais de epoca",
    routeType: "JOURNALS",
    contentTypes: ["jornais"],
    query: {},
    enabled: true,
  },
  {
    routePath: "/producao-bibliografica",
    label: "Producao bibliografica",
    routeType: "BIBLIO",
    contentTypes: ["referencias"],
    query: {},
    enabled: true,
  },
  {
    routePath: "/acervo-pessoal",
    label: "Lista de acervos pessoais",
    routeType: "PERSON_ARCHIVE_LIST",
    contentTypes: ["acervos-pessoais"],
    query: {},
    enabled: true,
  },
  {
    routePath: "/acervo-pessoal/rubem-machado",
    label: "Acervo pessoal - Rubem Machado",
    routeType: "PERSON_ARCHIVE",
    contentTypes: ["documentos", "jornais", "acervo-fotografico", "depoimentos", "referencias"],
    query: { personSlug: "rubem-machado" },
    enabled: true,
  },
  {
    routePath: "/acervo-pessoal/dom-waldyr",
    label: "Acervo pessoal - Dom Waldyr",
    routeType: "PERSON_ARCHIVE",
    contentTypes: ["documentos", "jornais", "acervo-fotografico", "depoimentos", "referencias"],
    query: { personSlug: "dom-waldyr", fundKey: "dom-waldyr", tag: "Dom Waldyr" },
    enabled: true,
  },
  {
    routePath: "/acervo/fundos/dom-waldyr",
    label: "Fundo Dom Waldyr",
    routeType: "FUND",
    contentTypes: ["documentos", "jornais", "acervo-fotografico", "depoimentos", "referencias"],
    query: { fundKey: "dom-waldyr", tag: "Dom Waldyr" },
    enabled: true,
  },
  {
    routePath: "/politica-nacional",
    label: "Politica nacional",
    routeType: "POLITICS",
    contentTypes: ["documentos", "referencias"],
    query: {},
    enabled: false,
  },
];

export async function ensureSiteRoutesSeeded() {
  const count = await SiteRouteModel.countDocuments();
  if (count > 0) return;
  await SiteRouteModel.insertMany(DEFAULT_ROUTES);
}
