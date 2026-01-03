import type { PoliticsContent } from "../../../../lib/content-types";

export const politicsContent: PoliticsContent = {
  eyebrow: "Política Nacional",
  title: "Diretrizes, instrumentos e histórico da atuação sindical",
  description:
    "Seleção editorial com marcos legais, reformas e eixos temáticos para leitura rápida. Acesse cada análise completa nas páginas dedicadas.",
  featured: {
    title: "Constituição de 1988 — direitos e garantias",
    description:
      "Marco legal que redefine cidadania, relações de trabalho e acesso a políticas públicas. Entenda impactos no mundo do trabalho e na organização sindical.",
    href: "/politica-nacional/constituicao-1988",
    cover: "/hero.png",
    date: "05/10/1988",
  },
  axes: [
    { key: "todos", label: "Todos" },
    { key: "trabalho", label: "Trabalho" },
    { key: "previdencia", label: "Previdência" },
    { key: "educacao", label: "Educação" },
    { key: "saude", label: "Saúde" },
    { key: "direitos", label: "Direitos" },
  ],
  events: [
    {
      title: "Reforma Trabalhista — Contexto e Efeitos",
      date: "2017",
      summary:
        "Mudanças em contratos, negociação coletiva e representação sindical — linhas gerais e debates.",
      href: "/politica-nacional/reforma-trabalhista-2017",
      axis: ["trabalho", "direitos"],
    },
    {
      title: "Política de Valorização do Salário Mínimo",
      date: "2008—Atualizações",
      summary:
        "Indexadores e fórmulas que influenciam renda, consumo e negociações setoriais.",
      href: "/politica-nacional/salario-minimo",
      axis: ["trabalho"],
    },
    {
      title: "Reforma da Previdência — Regras Gerais",
      date: "2019",
      summary:
        "Idade mínima, tempo de contribuição e transições: o que muda para diferentes categorias.",
      href: "/politica-nacional/previdencia-2019",
      axis: ["previdencia", "direitos"],
    },
    {
      title: "Pisos Salariais Profissionais",
      date: "Diversas Leis",
      summary:
        "Estruturas de piso por ocupação e seus reflexos em carreiras e negociações.",
      href: "/politica-nacional/pisos-salariais",
      axis: ["trabalho"],
    },
    {
      title: "Diretrizes Nacionais de Educação Profissional",
      date: "Atualizações",
      summary:
        "Qualificação e certificação para o mundo do trabalho: histórico e políticas.",
      href: "/politica-nacional/educacao-profissional",
      axis: ["educacao", "trabalho"],
    },
    {
      title: "SUS — Estrutura e Participação Social",
      date: "1988—",
      summary:
        "Conselhos, conferências e acesso universal: como a saúde pública se organiza.",
      href: "/politica-nacional/sus-participacao",
      axis: ["saude", "direitos"],
    },
    {
      title: "Segurança e Saúde no Trabalho",
      date: "NRs e Atualizações",
      summary:
        "Normas Regulamentadoras, prevenção e condições de trabalho ao longo das décadas.",
      href: "/politica-nacional/seguranca-saude-trabalho",
      axis: ["trabalho", "saude"],
    },
    {
      title: "Conselhos e Mesas de Negociação",
      date: "Histórico",
      summary:
        "Mecanismos de diálogo social entre governo, trabalhadores e empregadores.",
      href: "/politica-nacional/dialogo-social",
      axis: ["direitos", "trabalho"],
    },
    {
      title: "Programas de Habitação de Interesse Social",
      date: "Várias Fases",
      summary:
        "Acesso à moradia e impactos socioeconômicos para a classe trabalhadora.",
      href: "/politica-nacional/habitacao",
      axis: ["direitos"],
    },
    {
      title: "Política de Transparência e Acesso",
      date: "Lei e Decretos",
      summary:
        "Bases legais de transparência ativa, prazos de resposta e controle social.",
      href: "/politica-nacional/transparencia",
      axis: ["direitos"],
    },
    {
      title: "Carta de Princípios",
      date: "Documento",
      summary:
        "Valores e compromissos que orientam a atuação institucional.",
      href: "/politica-nacional/carta-principios",
      axis: ["direitos", "trabalho"],
    },
    {
      title: "Pactos Regionais",
      date: "Acordos",
      summary: "Implementação regional de metas e prioridades da política nacional.",
      href: "/politica-nacional/pactos-regionais",
      axis: ["direitos", "trabalho"],
    },
  ],
  notes: [
    "Seleções curadas com fontes verificadas.",
    "Resumos objetivos para leitura rápida.",
    "Aprofunde-se nas páginas das análises.",
  ],
  methodologyLink: { label: "Metodologia", href: "/politica-nacional/metodologia" },
  searchPlaceholder: "Buscar marcos…",
};
