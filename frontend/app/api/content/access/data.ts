import type { AccessContent } from "../../../../lib/content-types";

export const accessContent: AccessContent = {
  hero: {
    label: "Acesso à Informação",
    title: "Transparência ativa e busca em um só lugar",
    description:
      "Consulte documentos, políticas e registros do banco de memória. Filtre por tema e avance para páginas com o conteúdo completo.",
    searchPlaceholder: "Buscar por título, tema ou descrição",
    filterLabel: "Filtros",
    filters: ["Todos", "Atas", "Relatórios", "Contratos", "Despesas", "Convênios", "Boletins", "Imagens"],
  },
  resources: {
    cards: [
      {
        icon: "clipboard",
        tag: "Atas",
        title: "Atas de Assembleia (1950-1980)",
        description: "Deliberações, presenças e pautas debatidas em encontros gerais e extraordinários.",
        href: "/acervo/documentos",
      },
      {
        icon: "file",
        tag: "Relatórios",
        title: "Relatórios de gestão",
        description: "Síntese anual de ações, indicadores e prestação de contas das frentes do sindicato.",
        href: "/acervo/documentos",
      },
      {
        icon: "coins",
        tag: "Contratos",
        title: "Contratos e parcerias",
        description: "Instrumentos firmados com fornecedores e instituições, com objetos e vigências.",
        href: "/acesso-a-informacao/contratos",
      },
      {
        icon: "landmark",
        tag: "Despesas",
        title: "Despesas e custos operacionais",
        description: "Notas, empenhos e categorias de gasto com critérios de classificação.",
        href: "/acesso-a-informacao/despesas",
      },
      {
        icon: "landmark",
        tag: "Convênios",
        title: "Convênios institucionais",
        description: "Termos, metas e prestações de contas em convênios e cooperações.",
        href: "/acesso-a-informacao/convenios",
      },
      {
        icon: "newspaper",
        tag: "Boletins",
        title: "Boletins informativos",
        description: "Comunicados e chamadas oficiais publicados ao longo dos anos.",
        href: "/acervo/boletins",
      },
      {
        icon: "image",
        tag: "Imagens",
        title: "Acervo fotográfico",
        description: "Álbuns temáticos, eventos e registros históricos (metadados e direitos).",
        href: "/acervo/fotos",
      },
    ],
  },
  operations: {
    howItWorksTitle: "Como funciona",
    howItWorksSteps: [
      { title: "Localize", detail: "Encontre o tema desejado pela busca ou pelos filtros." },
      { title: "Acesse", detail: "Abra a página com o conteúdo completo e os termos de uso." },
      { title: "Verifique", detail: "Confirme permissões, licenças e condições de reutilização." },
      { title: "Solicite", detail: "Envie um pedido caso precise de algo específico." },
    ],
    cta: { label: "Enviar pedido de acesso", href: "/contato" },
  },
  rights: {
    title: "Direitos do requerente",
    items: [
      "Orientação sobre onde e como acessar as informações.",
      "Ser informado sobre a disponibilidade do conteúdo solicitado.",
      "Justificativa em caso de restrição de acesso.",
    ],
    policyLink: { label: "Ver política de transparência", href: "/transparencia/politica" },
  },
  transparency: {
    heading: "Transparência ativa - relatórios",
    reports: [
      {
        title: "Relatório de Transparência 2024",
        description: "Indicadores de atendimento, prazos e bases publicadas.",
        cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821815/Untitled_design_6_nsj01b.png",
        href: "/transparencia/relatorio-2024",
      },
      {
        title: "Plano de Dados Abertos",
        description: "Datasets priorizados, formatos e responsáveis pelas atualizações.",
        cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821815/Untitled_design_6_nsj01b.png",
        href: "/transparencia/plano-dados",
      },
      {
        title: "Política de Privacidade",
        description: "Tratamento de dados pessoais e bases legais aplicáveis.",
        cover: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821815/Untitled_design_6_nsj01b.png",
        href: "/transparencia/privacidade",
      },
    ],
  },
  datasets: {
    heading: "Datasets públicos",
    label: "Atualização periódica",
    items: [
      { title: "Catálogo de Documentos (CSV)", type: "CSV", href: "/datasets/catalogo-documentos.csv" },
      { title: "Vocabulário Controlado (JSON)", type: "JSON", href: "/datasets/vocabulario.json" },
      { title: "Séries de Pedidos de Acesso (CSV)", type: "CSV", href: "/datasets/pedidos.csv" },
    ],
  },
  quickSteps: [
    { icon: "search", title: "Localize", text: "Use busca e filtros para chegar ao conteúdo." },
    { icon: "check", title: "Verifique", text: "Leia os termos de uso e permissões disponíveis." },
    { icon: "shield", title: "Solicite", text: "Envie um pedido com justificativa quando necessário." },
  ],
  faq: {
    heading: "Perguntas frequentes",
    items: [
      {
        q: "Quais informações podem estar restritas?",
        a: "Itens com dados pessoais sensíveis, segredos industriais ou direitos autorais não licenciados podem ter acesso condicionado.",
      },
      {
        q: "Em quanto tempo recebo retorno do pedido?",
        a: "Você recebe protocolo imediato e atualização de status; os prazos variam conforme a complexidade do acesso.",
      },
      {
        q: "Posso reutilizar os dados?",
        a: "Respeite a licença indicada em cada item. Datasets podem ser reutilizados com crédito ao Banco de Memória.",
      },
    ],
  },
  contact: {
    title: "Fale com a equipe",
    description: "Dúvidas sobre prazos, formatos e disponibilização? Estamos à disposição.",
    ctaLabel: "Solicitar acesso",
    ctaHref: "/contato",
  },
  initialLimit: 4,
};
