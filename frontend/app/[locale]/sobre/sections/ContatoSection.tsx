import Link from "next/link";
import type { SiteContent } from "@/lib/content-types";
import { Section } from "../components/Section";

export function ContatoSection({ data }: { data: SiteContent["about"]["contato"] }) {
  return (
    <Section id="contato" title={data.title} subtitle={data.subtitle}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <p className="text-white/80">
            Para dúvidas, solicitações de reprodução e propostas de parceria, acesse a{" "}
            <Link href="/contato" className="underline decoration-white/40 underline-offset-4 hover:text-white">
              Contato
            </Link>
            . Para pedidos de informação institucional, consulte também{" "}
            <Link href="/acesso-a-informacao" className="underline decoration-white/40 underline-offset-4 hover:text-white">
              Acesso à Informação
            </Link>
            .
          </p>
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <h3 className="text-white">Navegar o acervo</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {data.asideLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </Section>
  );
}
