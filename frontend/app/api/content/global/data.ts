import type { GlobalContent } from "../../../../lib/content-types";

export const globalContent: GlobalContent = {
  navbar: {
    items: [
      {
        type: "dropdown",
        label: "acervo",
        items: [
          { label: "acervoOverview", href: "/acervo" },
          { label: "jornais", href: "/jornais-de-epoca" },
          {
            label: "acervoVoltaRedonda",
            href: "/acervo/volta-redonda",
            children: [
              { label: "acervoVrDocuments", href: "/acervo/volta-redonda/documentos" },
              { label: "acervoVrDepoimentos", href: "/acervo/volta-redonda/depoimentos" },
              { label: "acervoVrBibliografia", href: "/acervo/volta-redonda/referencia-bibliografica" },
              { label: "acervoVrJornais", href: "/acervo/volta-redonda/jornais-de-epoca" },
              { label: "acervoVrFotos", href: "/acervo/volta-redonda/acervo-fotografico" },
            ],
          },
          {
            label: "acervoBarraMansa",
            href: "/acervo/barra-mansa",
            children: [
              { label: "acervoBmDocuments", href: "/acervo/barra-mansa/documentos" },
              { label: "acervoBmDepoimentos", href: "/acervo/barra-mansa/depoimentos" },
              { label: "acervoBmBibliografia", href: "/acervo/barra-mansa/referencia-bibliografica" },
              { label: "acervoBmJornais", href: "/acervo/barra-mansa/jornais-de-epoca" },
              { label: "acervoBmFotos", href: "/acervo/barra-mansa/acervo-fotografico" },
            ],
          },
          {
            label: "acervoFundos",
            href: "/acervo/fundos",
            children: [
              { label: "acervoFundosConstrucao", href: "/acervo/fundos/const-civil" },
              { label: "acervoFundosMetalurgico", href: "/acervo/fundos/metalurgico" },
              { label: "acervoFundosMovimentos", href: "/acervo/fundos/mov-operario" },
              { label: "acervoFundosDomWaldyr", href: "/acervo/fundos/dom-waldyr" },
            ],
          },
        ],
      },
      { type: "link", label: "acesso", href: "/acesso-a-informacao" },
      { type: "link", label: "equipe", href: "/equipe-tecnica" },
      { type: "link", label: "sobre", href: "/sobre" },
      { type: "link", label: "contato", href: "/contato" },
    ],
    socials: [
      { platform: "instagram", href: "https://instagram.com" },
      { platform: "facebook", href: "https://facebook.com" },
      { platform: "youtube", href: "https://youtube.com" },
    ],
  },
  footer: {
    copyright: `© ${new Date().getFullYear()} CMODRM. Todos os direitos reservados.`,
    links: [
      { label: "privacy", href: "/transparencia/privacidade" },
      { label: "terms", href: "/transparencia/politica" },
      { label: "contact", href: "/contato" },
    ],
  },
};
