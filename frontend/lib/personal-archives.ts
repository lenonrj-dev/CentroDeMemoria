export type PersonalArchive = {
  slug: string;
  name: string;
  role?: string;
  summary: string;
  occupation?: string;
  portrait?: string;
  tags?: string[];
  sameAs?: string[];
};

export const personalArchives: PersonalArchive[] = [
  {
    slug: "rubem-machado",
    name: "Rubem Machado",
    role: "Pesquisador e sindicalista",
    occupation: "Pesquisador e sindicalista",
    summary:
      "Trajetória dedicada à organização dos trabalhadores e à preservação da memória do trabalho. Produções em jornais, relatórios, entrevistas e fotografia.",
    portrait: "https://res.cloudinary.com/diwvlsgsw/image/upload/v1762965931/images_2_wysfnt.jpg",
    tags: ["Volta Redonda", "Movimento operário", "Jornais", "História oral"],
    sameAs: ["https://example.com/rubem-machado"],
  },
  {
    slug: "dom-waldyr",
    name: "Dom Waldyr Calheiros",
    role: "Bispo aliado ao movimento operário",
    occupation: "Bispo e articulador pastoral",
    summary:
      "Acervo pessoal que reúne cartas, relatos e registros de mediação social de Dom Waldyr, com foco na defesa de direitos humanos, apoio a greves e ações pastorais.",
    portrait:
      "https://res.cloudinary.com/dc7u5spia/image/upload/v1764469350/Pres%C3%A9pio_Igreja_Santa_Cec%C3%ADlia_-_dezembro_de_1968_nwjnrn.jpg",
    tags: ["Direitos humanos", "Pastoral operária", "Ditadura", "Mediação"],
  },
];
