// app/transparencia/politica/page.js
import Link from "next/link";

export const metadata = {
  title: "Política de Transparência | Sintracon",
  description:
    "Diretrizes para publicação de informações, prazos de resposta e canais de recurso.",
  alternates: { canonical: "/transparencia/politica" },
  robots: { index: true, follow: true },
};

const DIRETRIZES = [
  "Publicação ativa de contratos, despesas e relatórios de execução.",
  "Divulgação de datasets abertos em formatos CSV/JSON, com metadados.",
  "Resposta a pedidos de acesso dentro dos prazos legais.",
  "Proteção de dados pessoais conforme a LGPD, com minimização de exposição.",
  "Registro de protocolo e possibilidade de recurso.",
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Política de Transparência",
    url: "/transparencia/politica",
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
            Política de Transparência
          </h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Regras para divulgação ativa de informações, tratamento de pedidos e
            proteção de dados sensíveis.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Diretrizes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            {DIRETRIZES.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h3 className="text-base font-semibold text-white">
              Prazos e recursos
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-white/70">
              <li>• Protocolo imediato e número de acompanhamento.</li>
              <li>• Resposta inicial em até 20 dias corridos, prorrogável.</li>
              <li>• Possibilidade de recurso administrativo.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <h3 className="text-base font-semibold text-white">
              Como solicitar
            </h3>
            <p className="mt-2 text-sm text-white/70">
              Utilize a seção{" "}
              <Link href="/acesso-a-informacao" className="underline">
                Acesso à Informação
              </Link>{" "}
              ou envie mensagem via{" "}
              <Link href="/contato" className="underline">
                Contato
              </Link>
              . Inclua descrição do material, período e finalidade.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
