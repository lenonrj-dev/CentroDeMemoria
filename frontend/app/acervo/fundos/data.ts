import type { Fund } from "./types";

export const funds: Fund[] = [
  {
    name: "Construcao Civil",
    slug: "const-civil",
    summary:
      "Contratos, diarios de obra, negociacoes coletivas, imagens de canteiros e relatos de seguranca no trabalho.",
    highlights: ["Contratos e atas", "Seguranca e saude", "Jornais de obra", "Fotografias de campo"],
    image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
    documents: [
      { title: "Ata de obra 1965", summary: "Deliberacoes sobre estrutura de concreto.", date: "1965-08-12", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Relatorio de seguranca", summary: "Check-list de EPIs e riscos em canteiro.", date: "1970-03-04", location: "Barra Mansa", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Contrato de empreitada", summary: "Clausulas de jornada e pagamentos.", date: "1968-11-20", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Mapa de diario de obra", summary: "Registro de avancos e incidentes.", date: "1972-05-02", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    depoimentos: [
      { author: "Tecnico de seguranca", role: "Obras pesadas", excerpt: "\"Os relatorios mostravam falhas de EPI e causaram revisao imediata.\"", date: "1972", theme: "Seguranca", avatar: "/hero.png" },
      { author: "Mestre de obras", role: "Canteiro", excerpt: "\"As atas de 65 definiram novos fluxos de inspecao.\"", date: "1965", theme: "Organizacao", avatar: "/hero.png" },
    ],
    referencias: [
      { title: "Manual de seguranca em obras", authors: "Silva, R.; Nogueira, L.", year: "1975", type: "Livro", source: "Editora Obra", citation: "Silva, R.; Nogueira, L. Manual de seguranca em obras. Editora Obra, 1975." },
    ],
    jornais: [
      { title: "Boletim do canteiro", summary: "Pautas de seguranca e cronograma.", date: "1969-09-10", location: "Volta Redonda", tags: ["Seguranca"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Circular de obra", summary: "Atualizacoes semanais e comunicados.", date: "1971-02-18", location: "Barra Mansa", tags: ["Cronograma"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    fotos: [
      {
        src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        alt: "Canteiro de obras",
        caption: "Inspecao de seguranca",
        year: "1970",
        location: "Volta Redonda",
        description: "Tecnico avalia uso de EPIs e sinalizacao no local.",
      },
    ],
  },
  {
    name: "Metalurgicos",
    slug: "metalurgico",
    summary:
      "Greves, boletins, mapas de turnos, boletins internos e fotos de portaria que narram o cotidiano fabril e as lutas na CSN.",
    highlights: ["Boletins e jornais", "Escalas e turnos", "Linha de producao", "Historia oral"],
    image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
    documents: [
      { title: "Boletim Operario 1952", summary: "Chamada para assembleia e negociacao.", date: "1952-03-10", location: "Volta Redonda", tags: ["Greves"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Ata de turnos", summary: "Reorganizacao de escala em linha de producao.", date: "1961-09-12", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Relatorio de condicoes", summary: "Temperatura e ruido nas linhas.", date: "1975-05-08", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Mapa de producao", summary: "Dados diarios de laminacao.", date: "1982-04-22", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    depoimentos: [
      { author: "Operador de alto-forno", role: "CSN", excerpt: "\"Os boletins eram ponte entre portaria e turnos.\"", date: "1979", theme: "Comunicacao", avatar: "/hero.png" },
      { author: "Lideranca sindical", role: "Metalurgicos", excerpt: "\"Mapas de turno revelaram sobrecarga e basearam a pauta de 82.\"", date: "1982", theme: "Pauta sindical", avatar: "/hero.png" },
    ],
    referencias: [
      { title: "Linha de producao e direitos", authors: "Barbosa, T.", year: "1984", type: "Artigo", source: "Revista Trabalho", citation: "Barbosa, T. Linha de producao e direitos. Revista Trabalho, 1984." },
    ],
    jornais: [
      { title: "Boletim da portaria", summary: "Informes de greve e seguranca.", date: "1979-04-02", location: "Volta Redonda", tags: ["Greves", "Seguranca"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Jornal do turno", summary: "Cobertura de revezamento e saude.", date: "1981-06-15", location: "Volta Redonda", tags: ["Turnos"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    fotos: [
      {
        src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        alt: "Portaria da CSN",
        caption: "Assembleia em portaria",
        year: "1979",
        location: "Volta Redonda",
        description: "Registro de assembleia em frente a portaria principal.",
      },
    ],
  },
  {
    name: "Movimentos Populares",
    slug: "mov-operario",
    summary:
      "Cartazes, panfletos, atas de assembleia comunitaria, fotografias de mobilizacao e entrevistas com liderancas.",
    highlights: ["Cartazes e panfletos", "Atas comunitarias", "Mobilizacoes urbanas", "Depoimentos"],
    image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
    documents: [
      { title: "Ata comunitaria", summary: "Deliberacoes sobre transporte e moradia.", date: "1978-10-05", location: "Barra Mansa", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Cartaz de mobilizacao", summary: "Chamada para marcha urbana.", date: "1980-06-11", location: "Volta Redonda", tags: ["Cartazes"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Panfleto de bairro", summary: "Organizacao de comissoes de rua.", date: "1982-09-02", location: "Barra Mansa", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Relato de assembleia popular", summary: "Encaminhamentos de saneamento e moradia.", date: "1983-03-22", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    depoimentos: [
      { author: "Lider comunitario", role: "Mobilizacao urbana", excerpt: "\"Os cartazes ajudaram a unir bairros e sindicatos.\"", date: "1980", theme: "Organizacao popular", avatar: "/hero.png" },
      { author: "Educadora popular", role: "Base comunitaria", excerpt: "\"As atas registram quem falou e quais demandas voltaram.\"", date: "1983", theme: "Memoria coletiva", avatar: "/hero.png" },
    ],
    referencias: [
      { title: "Cidades e lutas populares", authors: "Gomes, A.", year: "1987", type: "Tese", source: "Universidade Federal", citation: "Gomes, A. Cidades e lutas populares. Universidade Federal, 1987." },
    ],
    jornais: [
      { title: "Jornal da comunidade", summary: "Pautas de transporte, moradia e saude.", date: "1981-01-14", location: "Volta Redonda", tags: ["Comunidade"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Folheto especial", summary: "Cobertura de marcha e reivindicacoes.", date: "1982-05-09", location: "Barra Mansa", tags: ["Mobilizacao"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    fotos: [
      {
        src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        alt: "Marcha urbana",
        caption: "Mobilizacao em avenida central",
        year: "1980",
        location: "Volta Redonda",
        description: "Registro fotografico de marcha com cartazes e faixas.",
      },
    ],
  },
  {
    name: "Dom Waldyr",
    slug: "dom-waldyr",
    summary:
      "Pastoral operaria, mediacao de conflitos e vigilancia em direitos humanos atraves de cartas, circulares e registros fotograficos.",
    highlights: ["Cartas pastorais", "Jornais solidarios", "Relatos de mediacao", "Acervo fotografico"],
    image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
    documents: [
      { title: "Carta pastoral", summary: "Defesa de direitos e dignidade no trabalho.", date: "1978-06-12", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Relatorio de visitas", summary: "Condicoes em vilas operarias.", date: "1981-03-04", location: "Barra Mansa", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Notas de mediacao", summary: "Acordos de 1985 com sindicatos.", date: "1985-09-18", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Circular pastoral", summary: "Direitos humanos e vigilia.", date: "1983-11-22", location: "Volta Redonda", image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    depoimentos: [
      { author: "Agente pastoral", role: "Pastoral operaria", excerpt: "\"As circulares eram lidas em assembleias e portarias.\"", date: "1983", theme: "Fe e mediacao", avatar: "/hero.png" },
      { author: "Lideranca sindical", role: "Metalurgicos", excerpt: "\"Dom Waldyr mediava processos e reduzia tensoes.\"", date: "1985", theme: "Mediacao", avatar: "/hero.png" },
    ],
    referencias: [
      { title: "Pastoral e direitos", authors: "Ferreira, J.", year: "1990", type: "Livro", source: "Editora Diocesana", citation: "Ferreira, J. Pastoral e direitos. Editora Diocesana, 1990." },
    ],
    jornais: [
      { title: "Boletim solidario", summary: "Notas de apoio as greves e vigilia.", date: "1979-04-10", location: "Volta Redonda", tags: ["Solidariedade"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
      { title: "Circular de direitos", summary: "Denuncias e chamadas a vigilia.", date: "1983-11-22", location: "Barra Mansa", tags: ["Direitos humanos"], image: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg" },
    ],
    fotos: [
      {
        src: "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821829/Funcionarios_da_Siderurgica_BM_dec._de_1950_esytij.jpg",
        alt: "Assembleia com Dom Waldyr",
        caption: "Mediacao em assembleia",
        year: "1983",
        location: "Volta Redonda",
        description: "Dom Waldyr acompanha trabalhadores em reuniao publica.",
      },
    ],
  },
];
