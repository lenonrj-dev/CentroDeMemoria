import type { ContactContent } from "../../../../lib/content-types";

export const contactContent: ContactContent = {
  hero: {
    eyebrow: "Fale conosco",
    title: "Contato - Banco de Memória",
    description:
      "Estamos à disposição para demandas de pesquisa, doações, imprensa e atendimento ao trabalhador. Use os canais abaixo para agilizar o contato com o acervo.",
    primaryAction: { label: "Enviar mensagem", href: "#form" },
    phone: { label: "(11) 0000-0000", href: "tel:+551100000000" },
    email: { label: "contato@CMODRM.org.br", href: "mailto:contato@CMODRM.org.br" },
  },
  channels: {
    title: "Canais oficiais",
    description: "Escolha o canal que melhor se encaixa na sua demanda para agilizar o atendimento.",
    cards: [
      {
        title: "Atendimento ao Trabalhador",
        subtitle: "Dúvidas e orientações",
        href: "mailto:atendimento@CMODRM.org.br",
        icon: "phone",
        description: "Direitos, documentos e encaminhamentos. Resposta em até 2 dias úteis.",
      },
      {
        title: "Pesquisa & Acervo",
        subtitle: "Solicitações de pesquisa",
        href: "mailto:acervo@CMODRM.org.br",
        icon: "mail",
        description: "Consulta ao banco de memória, doações e uso de imagem.",
      },
      {
        title: "WhatsApp",
        subtitle: "Mensagens rápidas",
        href: "https://wa.me/5500000000000",
        icon: "message",
        description: "Atendimento em horário comercial. Não envie documentos sensíveis.",
      },
      {
        title: "Imprensa",
        subtitle: "Assessoria",
        href: "mailto:imprensa@CMODRM.org.br",
        icon: "newspaper",
        description: "Entrevistas, dados e imagens com crédito institucional.",
      },
      {
        title: "Atendimento Presencial",
        subtitle: "Matriz",
        href: "#enderecos",
        icon: "building",
        description: "Endereço, horários e agendamento para consulta local.",
      },
    ],
  },
  form: {
    heading: "Envie uma mensagem",
    description: "Preencha o formulário e retornaremos em até 2 dias úteis.",
    fields: [
      { label: "Nome completo", id: "nome", type: "text", required: true },
      { label: "E-mail", id: "email", type: "email", required: true },
      { label: "Telefone (opcional)", id: "telefone", type: "tel" },
      {
        label: "Assunto",
        id: "assunto",
        type: "select",
        required: true,
        options: ["Atendimento ao Trabalhador", "Pesquisa / Acervo", "Doação de materiais", "Imprensa", "Outros"],
      },
    ],
    textarea: { label: "Mensagem", id: "mensagem", rows: 6, required: true },
    consent: {
      text: "Ao enviar, você concorda com nossa ",
      linkLabel: "Política de Privacidade (LGPD)",
      linkHref: "/transparencia/privacidade",
      suffix: " e com o uso das informações para fins de atendimento.",
    },
    buttonLabel: "Enviar",
    successMessage: "Mensagem enviada! Obrigado pelo contato.",
    selectPlaceholder: "Selecione",
  },
  addresses: {
    heading: "Endereços & horários",
    description: "Atendimento presencial mediante disponibilidade. Traga documento com foto.",
    locations: [
      {
        title: "Matriz - Centro de Memória",
        address: "Rua Exemplo, 123 - Centro, São Paulo/SP",
        hours: "Seg a Sex, 9h - 17h",
        a11y: "Acesso facilitado, elevador, sanitários",
      },
      {
        title: "Unidade de Atendimento",
        address: "Av. Modelo, 456 - Bairro, São Paulo/SP",
        hours: "Seg a Sex, 10h - 16h",
        a11y: "Rampa de acesso, balcão prioritário",
      },
    ],
  },
  map: {
    heading: "Mapa & como chegar",
    description: "Use transporte público sempre que possível. Consulte rotas e horários atualizados.",
    iframeTitle: "Mapa - Centro de Memória",
    iframeSrc:
      "https://www.openstreetmap.org/export/embed.html?bbox=-46.64%2C-23.55%2C-46.62%2C-23.54&layer=mapnik",
    note: "Transporte público recomendado; confira itinerários recentes.",
  },
  faq: {
    heading: "Perguntas frequentes",
    items: [
      { q: "Qual o prazo de resposta?", a: "Até 2 dias úteis, dependendo do volume de solicitações." },
      {
        q: "Posso solicitar cópias digitalizadas?",
        a: "Sim, conforme política de uso e direitos. Alguns materiais exigem autorização.",
      },
      {
        q: "Como doar materiais ao acervo?",
        a: "Envie detalhes pelo formulário ou e-mail. A equipe orienta a avaliação e os trâmites.",
      },
      {
        q: "Há atendimento presencial para pesquisa?",
        a: "Sim, com agendamento e disponibilidade. Consulte horários e traga documento.",
      },
    ],
    note: "Para outros assuntos, consulte nossa ",
    noteLink: { label: "Política de Transparência", href: "/acesso-a-informacao/politica" },
    openSymbol: "-",
    closeSymbol: "+",
  },
};
