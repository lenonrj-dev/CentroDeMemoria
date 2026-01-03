// app/acesso-a-informacao/convenios/page.js
import Link from "next/link";

export const metadata = {
  title: "Convênios e cooperações — Acesso à Informação | Sintracon",
  description:
    "Termos, metas e prestações de contas em convênios institucionais e comunitários.",
  alternates: { canonical: "/acesso-a-informacao/convenios" },
  robots: { index: true, follow: true },
};

const CONVENIOS = [
  {
    title: "Convênio 04/2024 — Digitalização compartilhada",
    parceiro: "Arquivo Público Municipal",
    vigencia: "mai/2024 — mai/2026",
    metas: "Digitalizar 12k páginas; catalogar 400 itens",
    situacao: "Em execução",
  },
  {
    title: "Convênio 02/2023 — Acervo fotográfico",
    parceiro: "Instituto Memórias",
    vigencia: "mar/2023 — dez/2024",
    metas: "Ceder 2.000 fotos; publicar entregas trimestrais",
    situacao: "Encerrado",
  },
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Convênios e cooperações",
    url: "/acesso-a-informacao/convenios",
  };

  return (
    <main className="relative w-full py-10 sm:py-14 lg:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">
            Acesso à Informação
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            Convênios e cooperações
          </h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Listagem de instrumentos de cooperação, com metas pactuadas e
            situação. Relatórios de execução e prestação de contas serão
            publicados assim que homologados.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5">
          <div className="border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="text-sm font-medium text-white">Convênios</div>
            <div className="text-xs text-white/60">
              Conteúdo parcial. Versões oficiais podem ser solicitadas.
            </div>
          </div>
          <ul className="divide-y divide-white/10">
            {CONVENIOS.map((c) => (
              <li key={c.title} className="px-4 py-4 sm:px-6">
                <h2 className="text-base font-semibold text-white">{c.title}</h2>
                <p className="text-sm text-white/70">{c.parceiro}</p>
                <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-white/70 sm:grid-cols-3">
                  <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-1">
                    Vigência: {c.vigencia}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-1">
                    Metas: {c.metas}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-1">
                    Situação: {c.situacao}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white">Dúvidas e protocolos</h2>
          <p className="mt-2 text-sm text-white/70">
            Para solicitar cópias de termos, aditivos ou relatórios, use o{" "}
            <Link href="/contato" className="underline">
              Contato
            </Link>{" "}
            ou abra um pedido formal na área{" "}
            <Link href="/acesso-a-informacao" className="underline">
              Acesso à Informação
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
