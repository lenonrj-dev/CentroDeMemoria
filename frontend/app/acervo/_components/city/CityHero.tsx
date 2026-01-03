import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CityData } from "../../cityData";
import { Breadcrumb, HeroBanner, Section } from "../ui";

export function CityHero({ city, mission }: { city: CityData; mission: string }) {
  return (
    <Section className="pt-6">
      <Breadcrumb
        items={[
          { label: "Início", href: "/" },
          { label: "Acervo", href: "/acervo" },
          { label: city.name },
        ]}
      />
      <HeroBanner
        eyebrow="Acervo"
        title={`Acervo de ${city.name}`}
        description={`${city.description} ${mission}`}
        image={city.image}
        badge="Centro de Memória"
        mediaClassName="lg:h-full"
        actions={
          <>
            <Link
              href="#sessoes"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              Explorar seções <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/acervo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Visão geral do acervo
            </Link>
          </>
        }
      />
    </Section>
  );
}
