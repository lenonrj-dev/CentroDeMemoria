// app/transparencia/relatorio-2024/page.js
import Link from "next/link";

export const metadata = {
  title: "Relat??rio de Transpar??ncia 2024 | Sintracon",
  description:
    "Indicadores de atendimento, prazos, indeferimentos e bases publicadas em 2024.",
  alternates: { canonical: "/transparencia/relatorio-2024" },
  robots: { index: true, follow: true },
};

const INDICADORES = [
  { label: "Pedidos recebidos", value: "128" },
  { label: "Atendidos no prazo", value: "121 (94%)" },
  { label: "Indeferidos", value: "7" },
  { label: "M??dio de resposta", value: "8 dias corridos" },
];

const ENTREGAS = [
  "Publica????o de acervo fotogr??fico (lote 02)",
  "Revis??o do vocabul??rio controlado e normaliza????o de datas",
  "Disponibiliza????o de datasets CSV/JSON com metadados m??nimos",
  "Implanta????o do leitor de jornais com zoom e rolagem vertical",
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "Relat??rio de Transpar??ncia 2024",
    url: "/transparencia/relatorio-2024",
    datePublished: "2024-12-20",
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
            Transpar??ncia
          </p>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">
            Relat??rio de Transpar??ncia 2024
          </h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Resumo anual de pedidos, prazos, indeferimentos e entregas de
            publica????o ativa do banco de mem??ria.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDICADORES.map((i) => (
            <div
              key={i.label}
              className="rounded-xl border border-white/10 bg-white/5 p-4"
            >
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">
                {i.label}
              </div>
              <div className="text-lg font-semibold text-white">{i.value}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Entregas em 2024
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {ENTREGAS.map((e) => (
              <li key={e} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-base font-semibold text-white">
            Relatorio completo
          </h3>
          <p className="mt-2 text-sm text-white/70">
            Versao detalhada com tabelas, anexos e metodologia. Disponivel para
            consulta mediante solicitacao.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
            >
              Solicitar acesso
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
