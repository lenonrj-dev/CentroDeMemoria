export type GlobalContent = {
  navbar: {
    items: {
      type: "link" | "dropdown";
      label: string;
      href?: string;
      items?: { label: string; href: string; children?: { label: string; href: string }[] }[];
    }[];
    socials: { platform: "instagram" | "facebook" | "youtube"; href: string }[];
  };
  footer: {
    copyright: string;
    links: { label: string; href: string }[];
  };
};

export type AcervoContent = {
  hero: {
    searchLabel: string;
    searchPlaceholder: string;
    emptyStateMessage: string;
    filters: {
      types: string[];
      origins: string[];
      tags: string[];
    };
    filterLabels?: {
      types: Record<string, string>;
      origins: Record<string, string>;
      tags: Record<string, string>;
    };
    labels?: {
      viewItem: string;
      previous: string;
      next: string;
      results: string;
    };
    items: {
      title: string;
      origin: string;
      type: string;
      date: string;
      tags: string[];
      href: string;
    }[];
  };
  cityShowcase: {
    eyebrow: string;
    title: string;
    description: string;
    badges: { label: string; icon: "newspaper" | "photo" | "documents" }[];
    cities: {
      name: string;
      description: string;
      coverage: string;
      focus: string[];
      image: string;
      sections: {
        title: string;
        description: string;
        href: string;
        thumb: string;
      }[];
    }[];
  };
};

export type HomeContent = {
  hero: {
    imageSrc: string;
    alt: string;
    logos: { src: string; alt: string; wrapperClassName?: string; className?: string }[];
  };
  search: {
    title: string;
    tagline: string;
    description?: string;
    placeholder: string;
    buttonLabel: string;
    categoryLabel: string;
    categories: { value: string; label: string }[];
    socials: { platform: "facebook" | "instagram" | "youtube"; href: string }[];
    logos?: { src: string; alt: string; className?: string }[];
  };
  featuredCollections: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    items: { title: string; description: string; href: string; cover: string; badge?: string }[];
    footnote: string;
  };
  personalTimeline: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; description: string; href: string; meta?: string }[];
    aside: {
      label: string;
      name: string;
      role: string;
      avatar: string;
      highlights: string[];
    };
    footnote: string;
  };
  journals: {
    eyebrow: string;
    title: string;
    description: string;
    cta: { label: string; href: string };
    filters: { value: string; label: string }[];
    items: {
      title: string;
      date: string;
      decade: string;
      description: string;
      href: string;
      cover: string;
      tags?: string[];
    }[];
    ui?: {
      allLabel?: string;
      readLabel?: string;
      prevLabel?: string;
      nextLabel?: string;
      carouselAriaLabel?: string;
      coverAltTemplate?: string;
    };
  };
  team: {
    eyebrow: string;
    title: string;
    description: string;
    cta: { label: string; href: string };
    people: {
      name: string;
      role: string;
      bio: string;
      photo: string;
      tags: string[];
      href: string;
      email: string;
      linkedin: string;
    }[];
    ui?: {
      photoAltTemplate?: string;
      viewProfileLabel?: string;
      emailLabel?: string;
      linkedinLabel?: string;
    };
  };
  access: {
    eyebrow: string;
    title: string;
    description: string;
    filters: { key: string; label: string }[];
    items: { title: string; description: string; href: string; tags: string[] }[];
    ui?: {
      searchPlaceholder?: string;
      filtersLabel?: string;
      resultsTemplate?: string;
      allFiltersLabel?: string;
      prevLabel?: string;
      nextLabel?: string;
      readMoreLabel?: string;
      howItWorksTitle?: string;
      howItWorksSteps?: string[];
      ctaLabel?: string;
      rightsTitle?: string;
      rightsItems?: string[];
      rightsLinkLabel?: string;
    };
  };
  politics: PoliticsContent;
};

export type AboutContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    pills: string[];
    image: string;
  };
  toc: { href: string; label: string }[];
  escopo: {
    subtitle: string;
    title: string;
    paragraphs: string[];
    tiposDocumentais: string[];
    publicos: string[];
  };
  metodologia: {
    subtitle: string;
    title: string;
    paragraphs: string[];
    boasPraticas: string[];
    tip: string;
  };
  cities: {
    id: string;
    name: string;
    cover: string;
    stats: { label: string; value: string }[];
    paragraphs: string[];
    gallery?: { src: string; alt: string }[];
  }[];
  acesso: {
    subtitle: string;
    title: string;
    paragraphs: string[];
    comoCitar: string;
    solicitacoes: string[];
  };
  guia: {
    subtitle: string;
    title: string;
    tips: { title: string; text: string }[];
  };
  governanca: {
    subtitle: string;
    title: string;
    paragraphs: string[];
    frentes: string[];
    parcerias: string;
  };
  faq: { q: string; a: string }[];
  contato: {
    subtitle: string;
    title: string;
    text: string;
    links: { label: string; href: string; text?: string }[];
    asideLinks: { label: string; href: string }[];
  };
};

export type PoliticsContent = {
  eyebrow: string;
  title: string;
  description: string;
  featured: { title: string; description: string; href: string; cover: string; date: string };
  axes: { key: string; label: string }[];
  events: { title: string; date: string; summary: string; href: string; axis: string[] }[];
  notes: string[];
  methodologyLink: { label: string; href: string };
  searchPlaceholder: string;
  ui?: {
    readAnalysisLabel?: string;
    editorialLabel?: string;
    axesLabel?: string;
    notesLabel?: string;
    quickSearchLabel?: string;
    footerNote?: string;
    prevLabel?: string;
    nextLabel?: string;
  };
};

export type AccessResourceIcon = "clipboard" | "file" | "coins" | "landmark" | "newspaper" | "image";
export type AccessStepIcon = "search" | "check" | "shield";

export type AccessContent = {
  hero: {
    label: string;
    title: string;
    description: string;
    searchPlaceholder: string;
    filterLabel: string;
    filters: string[];
    filterDisplay?: Record<string, string>;
  };
  resources: {
    cards: {
      icon: AccessResourceIcon;
      tag: string;
      title: string;
      description: string;
      href: string;
    }[];
  };
  operations: {
    howItWorksTitle: string;
    howItWorksSteps: { title: string; detail: string }[];
    cta: { label: string; href: string };
  };
  rights: {
    title: string;
    items: string[];
    policyLink: { label: string; href: string };
  };
  transparency: {
    heading: string;
    reports: { title: string; description: string; cover: string; href: string }[];
  };
  datasets: {
    heading: string;
    label: string;
    items: { title: string; type: string; href: string }[];
  };
  quickSteps: {
    icon: AccessStepIcon;
    title: string;
    text: string;
  }[];
  faq: {
    heading: string;
    items: { q: string; a: string }[];
  };
  contact: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  ui?: {
    learnMore: string;
    viewMore: string;
    open: string;
    download: string;
  };
  initialLimit: number;
};

export type ContactHeroContent = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: { label: string; href: string };
  phone: { label: string; href: string };
  email: { label: string; href: string };
};

export type ContactChannelIcon = "phone" | "mail" | "message" | "newspaper" | "building";

export type ContactChannelsContent = {
  title: string;
  description: string;
  cards: {
    title: string;
    subtitle: string;
    href: string;
    icon: ContactChannelIcon;
    description: string;
  }[];
};

export type ContactFormField = {
  label: string;
  id: string;
  type?: "text" | "email" | "tel" | "select";
  required?: boolean;
  options?: string[];
};

export type ContactFormContent = {
  heading: string;
  description: string;
  fields: ContactFormField[];
  textarea: {
    label: string;
    id: string;
    rows: number;
    required: boolean;
  };
  consent: {
    text: string;
    linkLabel: string;
    linkHref: string;
    suffix: string;
  };
  buttonLabel: string;
  successMessage: string;
  selectPlaceholder: string;
};

export type ContactAddressesContent = {
  heading: string;
  description: string;
  locations: {
    title: string;
    address: string;
    hours: string;
    a11y: string;
  }[];
};

export type ContactMapContent = {
  heading: string;
  description: string;
  iframeTitle: string;
  iframeSrc: string;
  note: string;
};

export type ContactFAQContent = {
  heading: string;
  items: { q: string; a: string }[];
  note: string;
  noteLink: { label: string; href: string };
  openSymbol: string;
  closeSymbol: string;
};

export type ContactContent = {
  hero: ContactHeroContent;
  channels: ContactChannelsContent;
  form: ContactFormContent;
  addresses: ContactAddressesContent;
  map: ContactMapContent;
  faq: ContactFAQContent;
};

export type TransparencyCard = {
  title: string;
  description: string;
  href: string;
  badge?: string;
  actionLabel: string;
};

export type TransparencyContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  portalLinks: TransparencyCard[];
  footerNote: string;
};

export type BoardMember = {
  name: string;
  role: string;
  photo: string;
};

export type BoardLevel = {
  key: string;
  label: string;
  description?: string;
  members: BoardMember[];
  columns?: number;
};

export type BoardContent = {
  title: string;
  subtitle: string;
  introduction: string;
  levels: BoardLevel[];
  footerNote: string;
};

export type TeamMemberLinks = {
  linkedin?: string;
  email?: string;
  github?: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  area: string;
  bio: string;
  avatar: string;
  links: TeamMemberLinks;
};

export type TeamAdvisor = {
  name: string;
  title: string;
  avatar: string;
};

export type TeamProcessStep = {
  icon: string;
  title: string;
  text: string;
};

export type TeamFaqItem = {
  q: string;
  a: string;
};

export type TeamStat = {
  icon: string;
  label: string;
  value: string | number;
};

export type TeamContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  stats: TeamStat[];
  searchPlaceholder: string;
  filters: string[];
  members: TeamMember[];
  advisors: TeamAdvisor[];
  process: TeamProcessStep[];
  faq: TeamFaqItem[];
  cta: {
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
  };
};

export type BibliographyItem = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: string;
  decade: string;
  tags: string[];
  abstract: string;
  cover: string;
  href: string;
  pdf: string;
};

export type BibliographyContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    cta: { label: string; href: string };
  };
  filters: {
    types: string[];
    decades: string[];
    tags: string[];
  };
  items: BibliographyItem[];
  searchPlaceholder: string;
  footnote: string;
};

export type JournalEdition = {
  slug: string;
  title: string;
  date: string;
  decade: string;
  summary: string;
  cover: string;
  full: string;
  width: number;
  height: number;
};

export type JournalsContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    note: string;
  };
  searchPlaceholder: string;
  filterLabel: string;
  decades: string[];
  defaultCover: string;
  editions: JournalEdition[];
  footerNote: string;
};

export type SiteContent = {
  home: HomeContent;
  about: AboutContent;
  acervo: AcervoContent;
  politics: PoliticsContent;
  access: AccessContent;
  contact: ContactContent;
  personal: PersonalArchiveContent;
  global: GlobalContent;
  transparency: TransparencyContent;
  board: BoardContent;
  team: TeamContent;
  production: BibliographyContent;
  journals: JournalsContent;
};

export type PersonalArchiveContent = {
  hero: {
    label: string;
    name: string;
    roles: string[];
    summary: string;
    biography: string;
    cover: string;
    portrait: string;
    stats: { label: string; value: string }[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  gallery: { src: string; alt: string }[];
  documents: { title: string; href: string; meta: string }[];
  interviews: { title: string; href: string; meta: string }[];
  timeline: { year: string; text: string }[];
  about: {
    heading: string;
    description: string;
    links: { label: string; href: string; icon: "newspaper" | "book" }[];
  };
  quote: { text: string; author: string; note: string };
  downloads: { label: string; href: string }[];
  navigation: {
    backLabel: string;
    backHref: string;
    note: string;
    noteLink: { label: string; href: string };
  };
  faq: { q: string; a: string }[];
  steps: { icon: "search" | "check" | "shield"; title: string; text: string }[];
};
