import type { TeamContent } from "../../../../lib/content-types";

export const teamContent: TeamContent = {
  hero: {
    eyebrow: "Equipe técnica",
    title: "Pessoas por trás do Banco de Memória",
    description:
      "Coordenação, curadoria, preservação digital, pesquisa e comunicação atuam em conjunto para dar sentido histórico e acesso seguro ao acervo.",
  },
  stats: [
    { icon: "GraduationCap", label: "Áreas", value: 6 },
    { icon: "ShieldCheck", label: "Curadoria", value: "2 times" },
    { icon: "Cpu", label: "Tech", value: 2 },
    { icon: "Database", label: "Metadados", value: 1 },
    { icon: "Accessibility", label: "Acessibilidade", value: 1 },
    { icon: "MessageSquare", label: "Comunicação", value: 1 },
  ],
  searchPlaceholder: "Buscar por nome, função ou área",
  filters: [
    "Todos",
    "Coordenação",
    "Curadoria",
    "Preservação Digital",
    "Pesquisa & Catalogação",
    "Desenvolvimento",
    "Acessibilidade & Comunicação",
  ],
  members: [
    {
      id: "m1",
      name: "Helena Prado",
      role: "Coordenação Geral",
      area: "Coordenação",
      bio: "Planejamento estratégico, governança e captação de recursos.",
      avatar: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
      links: {
        linkedin: "https://linkedin.com/in/helena-prado",
        email: "mailto:helena.prado@CMODRM.org.br",
      },
    },
    {
      id: "m2",
      name: "Rubem Machado",
      role: "Curadoria de Jornalismo Operário",
      area: "Curadoria",
      bio: "Coordena acervos impressos, comenta boletins e edições históricas.",
      avatar: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
      links: {
        linkedin: "https://linkedin.com/in/rubem-machado",
        email: "mailto:rubem.machado@CMODRM.org.br",
      },
    },
    {
      id: "m3",
      name: "Marina Lopes",
      role: "Curadoria Fotográfica",
      area: "Curadoria",
      bio: "Documenta imagens operárias e orienta descrições sensíveis.",
      avatar: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
      links: {
        linkedin: "https://linkedin.com/in/marina-lopes",
        email: "mailto:marina.lopes@CMODRM.org.br",
      },
    },
    {
      id: "m4",
      name: "Lucas Andrade",
      role: "Preservação Digital",
      area: "Preservação Digital",
      bio: "Fluxos de ingestão, backup e fixidade em nuvem e servidores locais.",
      avatar: "/hero.png",
      links: {
        linkedin: "https://linkedin.com/in/lucas-andrade",
        github: "https://github.com/lucasandrade",
      },
    },
    {
      id: "m5",
      name: "Ana Bezerra",
      role: "Pesquisa & Catalogação",
      area: "Pesquisa & Catalogação",
      bio: "Modela vocabulários controlados e valida metadados.",
      avatar: "/hero.png",
      links: {
        linkedin: "https://linkedin.com/in/ana-bezerra",
        email: "mailto:ana.bezerra@CMODRM.org.br",
      },
    },
    {
      id: "m6",
      name: "Caio Nunes",
      role: "Frontend",
      area: "Desenvolvimento",
      bio: "Next.js, acessibilidade e performance para as interfaces públicas.",
      avatar: "/hero.png",
      links: {
        github: "https://github.com/caiomd",
        linkedin: "https://linkedin.com/in/caio-nunes",
      },
    },
    {
      id: "m7",
      name: "Rita Alves",
      role: "Backend & Infra",
      area: "Desenvolvimento",
      bio: "APIs, pipelines e monitoramento das integrações do acervo.",
      avatar: "/hero.png",
      links: {
        github: "https://github.com/ritaalves",
        linkedin: "https://linkedin.com/in/rita-alves",
      },
    },
    {
      id: "m8",
      name: "João Brito",
      role: "Acessibilidade",
      area: "Acessibilidade & Comunicação",
      bio: "Testes assistidos, WCAG e orientações de linguagem inclusiva.",
      avatar: "/hero.png",
      links: {
        linkedin: "https://linkedin.com/in/joaobrito",
      },
    },
    {
      id: "m9",
      name: "Larissa Mota",
      role: "Comunicação",
      area: "Acessibilidade & Comunicação",
      bio: "Diretrizes de linguagem, redes sociais e relacionamento com a imprensa.",
      avatar: "/hero.png",
      links: {
        email: "mailto:larissa.mota@CMODRM.org.br",
      },
    },
  ],
  advisors: [
    {
      name: "Profa. Sabrina Almeida",
      title: "Conselho Consultivo — História do Trabalho",
      avatar: "/hero.png",
    },
    {
      name: "Dr. Paulo Ramos",
      title: "Conselho Consultivo — Direito & Acesso",
      avatar: "/hero.png",
    },
    {
      name: "Msc. Letícia Farias",
      title: "Conselho Consultivo — Preservação Digital",
      avatar: "/hero.png",
    },
    {
      name: "Gabriel Tavares",
      title: "Consultor — UX de Leitura",
      avatar: "/hero.png",
    },
  ],
  process: [
    { icon: "ClipboardList", title: "Planejamento", text: "Escopo, governança e cronograma macro." },
    { icon: "ScanSearch", title: "Pesquisa", text: "Levantamento, triagem e seleção de itens do acervo." },
    { icon: "ImageDown", title: "Digitalização", text: "Captura, calibração e padronização dos arquivos." },
    { icon: "Database", title: "Metadados", text: "Modelo, vocabulário controlado e indexação." },
    { icon: "FileCog", title: "Preservação", text: "Fixidade, backups 3-2-1 e monitoração contínua." },
    { icon: "CheckCircle2", title: "Publicação", text: "Revisão final, acessibilidade e SEO das páginas." },
  ],
  faq: [
    {
      q: "Como é definido o que entra no acervo?",
      a: "A curadoria avalia relevância histórica, integridade física e direitos de uso, com diretrizes públicas.",
    },
    {
      q: "Qual é o padrão de metadados adotado?",
      a: "Adotamos campos Dublin Core estendidos e vocabulário próprio mapeado para interoperabilidade.",
    },
    {
      q: "Como garantir a preservação digital?",
      a: "Seguindo a estratégia 3-2-1, verificamos fixidade e distribuímos réplicas geográficas.",
    },
  ],
  cta: {
    title: "Fale com a equipe",
    description: "Dúvidas, parcerias, imprensa ou contribuições ao acervo.",
    actionLabel: "Entrar em contato",
    actionHref: "/contato",
  },
};
