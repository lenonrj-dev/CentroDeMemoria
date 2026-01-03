import Image from "next/image";
import Link from "next/link";
import { ContentContainer } from "../../../_components/ui";
import { heroImage } from "../data";

export function DomWaldyrIntro() {
  return (
    <ContentContainer>
      <div className="mx-auto max-w-4xl space-y-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-6 shadow-xl sm:px-8 sm:py-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <div className="relative aspect-[16/7] w-full">
            <Image
              src="https://res.cloudinary.com/dc7u5spia/image/upload/v1765292802/DOCUMENTA%C3%87%C3%83O_HIST%C3%93RICA_g0pzkc.png"
              alt="Dom Waldyr Calheiros de Novaes em atividade pastoral"
              fill
              sizes="(min-width:1024px) 640px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent" />
        </div>
        <p className="text-xs uppercase tracking-[0.22em] text-white/60">Dom Waldyr Calheiros de Novaes</p>
        <h2 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">Documentação histórica</h2>
        <p className="mt-3 text-sm text-white/70 sm:text-base">
          Antes de abrir as séries completas, veja um recorte das cartas, relatórios, circulares e publicações que demonstram a
          presença de Dom Waldyr nas negociações, visitas às vilas operárias e no apoio direto aos trabalhadores da região.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="#documentos"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Ver documentos
          </Link>
          <Link
            href="#depoimentos"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10"
          >
            Ver relatos
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-widest text-white/60">Ação pastoral</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Presença pastoral e mediação social</h3>
          <p className="mt-2 text-sm text-white/70">
            Cartas, relatórios e fotografias que registram as visitas às comunidades, a escuta dos trabalhadores e as mediações
            conduzidas pela Diocese.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href="#documentos"
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/80 hover:bg-white/10"
            >
              Documentos
            </Link>
            <Link
              href="#acervo-fotografico"
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/80 hover:bg-white/10"
            >
              Fotografias
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-5">
          <p className="text-xs uppercase tracking-widest text-white/60">Erasmo</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Breve biografia</h3>
          <div className="mt-3 flex items-start gap-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10">
              <Image src={heroImage} alt="Breve biografia de Dom Waldyr" fill className="object-cover" sizes="64px" />
            </div>
            <p className="text-sm text-white/70">
              Prévia do texto biográfico com linhas de atuação pastoral, recortes documentais e referências de contexto.
            </p>
          </div>
          <Link
            href="/acervo/fundos/dom-waldyr/historias/breve-biografia"
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15"
          >
            Ver biografia breve
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-widest text-white/60">Ditadura civil-militar</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Direitos humanos e prisioneiros políticos</h3>
          <p className="mt-2 text-sm text-white/70">
            Recortes de dossiês, cartas e relatos sobre perseguições, prisões e ações de proteção às lideranças locais.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href="/acervo/fundos/dom-waldyr/historias/prisioneiros"
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/80 hover:bg-white/10"
            >
              Recorte sobre prisioneiros
            </Link>
            <Link
              href="#depoimentos"
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/80 hover:bg-white/10"
            >
              Depoimentos
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-widest text-white/60">Movimento operário</p>
          <h3 className="mt-2 text-lg font-semibold text-white">Jornais, boletins e mobilizações</h3>
          <p className="mt-2 text-sm text-white/70">
            Boletins solidários, comunicados e materiais que narram greves, assembleias e redes de apoio.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href="#jornais"
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/80 hover:bg-white/10"
            >
              Jornais
            </Link>
            <Link
              href="#referencias"
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-white/80 hover:bg-white/10"
            >
              Referências
            </Link>
          </div>
        </div>
      </div>
    </ContentContainer>
  );
}
