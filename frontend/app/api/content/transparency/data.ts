import type { TransparencyContent } from "../../../../lib/content-types";

export const transparencyContent: TransparencyContent = {
  hero: {
    eyebrow: "Transparência",
    title: "Hub de transparência institucional",
    description: "Relatórios, políticas e planos públicos reunidos em um único local para que qualquer cidadão acompanhe os compromissos, indicadores e entregas do Banco de Memória.",
  },
  portalLinks: [
    {
      title: "Relatório de Transparência 2024",
      description: "Indicadores, entregas e metas do último ciclo de prestação de contas.",
      href: "/transparencia/relatorio-2024",
      actionLabel: "Abrir",
    },
    {
      title: "Plano de Dados Abertos",
      description: "Datasets priorizados, formatos e calendários de publicação alinhados às boas práticas de dados governamentais.",
      href: "/transparencia/plano-dados",
      actionLabel: "Abrir",
    },
    {
      title: "Política de Privacidade",
      description: "Bases legais, direitos dos titulares e canais para exercer seus direitos em conformidade com a LGPD.",
      href: "/transparencia/privacidade",
      actionLabel: "Abrir",
    },
    {
      title: "Política de Transparência",
      description: "Diretrizes de publicação, níveis de detalhamento e prazos de resposta às solicitações públicas.",
      href: "/transparencia/politica",
      actionLabel: "Abrir",
    },
  ],
  footerNote: "Para solicitações formais, consulte também o portal de Acesso à Informação.",
};
