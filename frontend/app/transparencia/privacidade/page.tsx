// app/transparencia/privacidade/page.js
import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade | Sintracon",
  description:
    "Tratamento de dados pessoais, bases legais e direitos do titular no banco de memória.",
  alternates: { canonical: "/transparencia/privacidade" },
  robots: { index: true, follow: true },
};

const BLOCOS = [
  {
    title: "Coleta e finalidade",
    items: [
      "Uso de cookies apenas para analytics e melhoria de navegação.",
      "Dados de contato coletados para resposta a pedidos e suporte.",
      "Dados sensíveis só tratados com base legal e mínima exposição.",
    ],
  },
  {
    title: "Armazenamento e segurança",
    items: [
      "Acesso restrito por perfil; logs de auditoria em operações sensíveis.",
      "Backups periódicos e criptografia em trânsito (HTTPS).",
      "Retenção mínima conforme finalidade e obrigação legal.",
    ],
  },
  {
    title: "Direitos do titular",
    items: [
      "Confirmação de tratamento e acesso aos dados.",
      "Correção, anonimização ou eliminação quando aplicável.",
      "Revisão de decisões automatizadas (quando existirem).",
    ],
  },
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    name: "Política de Privacidade",
    url: "/transparencia/privacidade",
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
            Política de Privacidade
          </h1>
          <p className="mt-2 max-w-3xl text-white/70">
            Compromisso com a proteção de dados pessoais e tratamento adequado
            na hospedagem e difusão do acervo.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {BLOCOS.map((b) => (
            <section
              key={b.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-semibold text-white">{b.title}</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {b.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/50" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
          <h3 className="text-base font-semibold text-white">Contato LGPD</h3>
          <p className="mt-2 text-sm text-white/70">
            Para solicitações relacionadas a dados pessoais, utilize o canal{" "}
            <Link href="/contato" className="underline">
              Contato
            </Link>{" "}
            ou envie protocolo via{" "}
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
