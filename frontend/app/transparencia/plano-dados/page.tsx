// app/transparencia/plano-dados/page.js
import Link from "next/link";

export const metadata = {
  title: "Plano de Dados Abertos | Sintracon",
  description:
    "Datasets priorizados, formato, atualização e responsáveis pelo banco de memória.",
  alternates: { canonical: "/transparencia/plano-dados" },
  robots: { index: true, follow: true },
};

const DATASETS = [
  { title: "Catálogo de documentos", format: "CSV", freq: "Mensal", owner: "Curadoria" },
  { title: "Vocabulário controlado", format: "JSON", freq: "Trimestral", owner: "Pesquisa" },
  { title: "Pedidos de acesso", format: "CSV", freq: "Mensal", owner: "Atendimento" },
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: "Plano de Dados Abertos",
    url: "/transparencia/plano-dados",
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
            Transparência
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            Plano de Dados Abertos
          </h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Conjunto de bases priorizadas para publicação em formatos abertos,
            com responsáveis e frequência de atualização.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-4 gap-3 border-b border-white/10 px-4 py-3 text-[13px] font-semibold text-white sm:px-6">
            <span className="col-span-2">Dataset</span>
            <span>Formato</span>
            <span>Frequência</span>
          </div>
          <ul className="divide-y divide-white/10">
            {DATASETS.map((d) => (
              <li
                key={d.title}
                className="grid grid-cols-4 items-center gap-3 px-4 py-3 text-sm text-white/80 sm:px-6"
              >
                <div className="col-span-2">
                  <div className="font-semibold text-white">{d.title}</div>
                  <div className="text-xs text-white/60">Responsável: {d.owner}</div>
                </div>
                <span>{d.format}</span>
                <span>{d.freq}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h3 className="text-base font-semibold text-white">Como consultar</h3>
            <p className="mt-2 text-sm text-white/70">
              Use a secao de datasets em{" "}
              <Link href="/acesso-a-informacao" className="underline">
                Acesso a Informacao
              </Link>{" "}
              para visualizar as bases publicadas.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h3 className="text-base font-semibold text-white">
              Versões e controle
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Cada dataset recebe carimbo de data e número de versão. Mudanças
              estruturais serão informadas com antecedência.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
