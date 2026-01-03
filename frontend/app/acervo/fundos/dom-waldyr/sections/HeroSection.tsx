import Image from "next/image";
import Link from "next/link";
import { HeroBanner } from "../../../_components/ui";

type HeroProps = {
  image: string;
};

export function DomWaldyrHero({ image }: HeroProps) {
  const heroBackground =
    "https://res.cloudinary.com/dc7u5spia/image/upload/v1758821776/1935_Lan%C3%A7amento_da_pedra_fundamental_sbm_assinando_dr_dario_aragao_upoqze.jpg";
  return (
    // Ajuste altura (h-*) e largura full-bleed (w-screen + offsets) do background aqui.
    <section className="relative h-[680px] w-[1900px] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-clip bg-black sm:h-[740px] lg:h-[820px]">
      {/* HeroBackgroundLayer */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={heroBackground}
          alt="Acervo Dom Waldyr"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/55 to-black/90" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black" />
      </div>

      {/* HeroContentLayer */}
      <div className="relative z-10">
        {/* Largura do container centralizado do hero definida aqui (max-w-6xl + px-*) */}
        <div className="relative mb-40 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-start pt-10 pb-0 sm:pt-14 lg:pt-20">
            {/* Altura/recorte da midia controlados no mediaClassName */}
            {/* Espacamento interno do card controlado no contentClassName */}
            <HeroBanner
              eyebrow="Fundos"
              badge="Dom Waldyr"
              title="Acervo Dom Waldyr Calheiros de Novaes"
              description="Recortes documentais sobre ação pastoral, ditadura civil-militar e movimento operário. Este fundo reúne cartas, depoimentos, jornais e imagens que registram a atuação de Dom Waldyr nas comunidades do Sul Fluminense."
              image={image}
              mediaClassName="h-[17rem] self-start sm:h-[19rem] lg:h-auto lg:aspect-[15/16]"
              contentClassName="p-5 sm:p-7 lg:p-8 space-y-3"
              titleClassName="text-4xl sm:text-5xl lg:text-6xl"
              descriptionClassName="text-base sm:text-lg lg:text-xl"
              actions={
                <>
                  <Link
                    href="/acervo/fundos/dom-waldyr/historias/breve-biografia"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
                  >
                    Breve biografia
                  </Link>
                  <Link
                    href="#documentos"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/5"
                  >
                    Ver recortes
                  </Link>
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
