import type { BoardContent } from "../../../../lib/content-types";

export const boardContent: BoardContent = {
  title: "Diretoria",
  subtitle: "Gestão 2025–2028",
  introduction:
    "A pirâmide sintetiza a governança que articula presidência, vice-presidência, diretoria executiva e conselho consultivo.",
  levels: [
    {
      key: "presidencia",
      label: "Presidência",
      description: "Responsável pela estratégia geral e pela representação institucional.",
      columns: 1,
      members: [
        {
          name: "Rubens Almeida",
          role: "Presidente",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        },
      ],
    },
    {
      key: "vice-sec",
      label: "Vice-Presidência & Secretaria",
      description: "Coordena agendas políticas e gazeta oficial das decisões.",
      columns: 2,
      members: [
        {
          name: "Marina Duarte",
          role: "Vice-Presidente",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
        },
        {
          name: "Edson Ribeiro",
          role: "Secretário-Geral",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
        },
      ],
    },
    {
      key: "executiva",
      label: "Diretoria Executiva",
      description: "Comitê técnico que conduz curadoria, finanças e formação institucional.",
      columns: 3,
      members: [
        {
          name: "Lívia Nascimento",
          role: "Diretora de Comunicação",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        },
        {
          name: "Carlos Menezes",
          role: "Diretor Financeiro",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        },
        {
          name: "Juliana Pires",
          role: "Diretora de Formação",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        },
      ],
    },
    {
      key: "conselho",
      label: "Conselho",
      description: "Corpo consultivo que avalia políticas e acompanha indicadores.",
      columns: 4,
      members: [
        {
          name: "André Souza",
          role: "Conselheiro",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
        },
        {
          name: "Bianca Monteiro",
          role: "Conselheira",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
        },
        {
          name: "Felipe Araújo",
          role: "Conselheiro",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
        },
        {
          name: "Renata Carvalho",
          role: "Conselheira",
          photo:
            "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821791/Tropas_policiais_de_Barra_Mansa_Nova_Igua%C3%A7u_e_Niter%C3%B3i_reprimem_manifesta%C3%A7%C3%A3o_popular_em_ocasi%C3%A3o_do_assassinato_do_l%C3%ADder_sindical_Rubem_Machado_em_Volta_Redonda-RJ_1_iuqf4r.png",
        },
      ],
    },
  ],
  footerNote:
    "Estrutura ilustrativa, atualize nomes, cargos e fotos conforme os registros oficiais da diretoria.",
};
