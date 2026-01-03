"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Flag, FileText, Layers, ShieldCheck } from "lucide-react";
import type { PoliticsContent } from "../../../lib/content-types";

const fadeUp = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

type Props = { content: PoliticsContent };

export default function PoliticaLanding({ content }: Props) {
  const previewItems =
    content.events?.length > 0
      ? content.events.slice(0, 4).map((ev) => ({
          title: ev.title,
          summary: ev.summary,
        }))
      : [
          {
            title: "Direitos do trabalho e negociação coletiva",
            summary: "Panorama de marcos legais, reformas e seus impactos setoriais.",
          },
          {
            title: "Previdência e proteção social",
            summary: "Linha do tempo das reformas, regras e atualizações.",
          },
          {
            title: "Saúde do trabalhador e segurança",
            summary: "Normas, campanhas e documentos-base de referência.",
          },
          {
            title: "Educação profissional e qualificação",
            summary: "Diretrizes, programas e materiais de apoio.",
          },
        ];

  const axes = (content.axes || []).filter((ax) => ax.key !== "todos");

  return (
    <section className="relative w-full py-16 sm:py-20 lg:py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 lg:p-10">
          <div className="mb-3 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50">
            <Flag className="h-4 w-4" />
            Política Nacional
          </div>
          <h1 className="text-2xl font-semibold text-white sm:text-3xl lg:text-4xl">Em breve</h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-white/70 sm:text-lg">
            Estamos organizando documentos, diretrizes e análises sobre políticas públicas e direitos do trabalho.
            Esta página já está em construção e receberá novas publicações em breve.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr,1fr]">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <FileText className="h-4 w-4" />
                O que será publicado
              </div>
              <ul className="mt-3 space-y-3 text-sm text-white/70">
                {previewItems.map((item) => (
                  <li key={item.title} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-1 text-xs text-white/60">{item.summary}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Layers className="h-4 w-4" />
                Eixos em preparação
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(axes.length ? axes : [{ key: "trabalho", label: "Trabalho" }]).map((ax) => (
                  <span
                    key={ax.key}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                  >
                    {ax.label}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-sm text-white/60">
                Conteúdo em curadoria editorial e revisão de fontes.
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/inicio"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
            >
              Voltar ao início <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/acervo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Explorar acervo
            </Link>
            <Link
              href="/acesso-a-informacao"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Acesso à informação
            </Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="inline-flex items-center gap-2 text-white/80">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-medium">Transparência</span>
            </div>
            <p className="mt-2 text-sm text-white/70">
              Consulte a área de Acesso à Informação para pedidos, diretrizes e documentos-base.
            </p>
            <Link href="/acesso-a-informacao" className="mt-3 inline-flex items-center text-sm text-white/80 hover:text-white">
              Ver acesso à informação <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="inline-flex items-center gap-2 text-white/80">
              <FileText className="h-5 w-5" />
              <span className="font-medium">Documentos do acervo</span>
            </div>
            <p className="mt-2 text-sm text-white/70">
              Navegue por documentos históricos, relatórios e arquivos digitalizados.
            </p>
            <Link href="/acervo" className="mt-3 inline-flex items-center text-sm text-white/80 hover:text-white">
              Ir para o acervo <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="inline-flex items-center gap-2 text-white/80">
              <Layers className="h-5 w-5" />
              <span className="font-medium">Produção bibliográfica</span>
            </div>
            <p className="mt-2 text-sm text-white/70">
              Confira referências e bibliografia relacionadas às políticas públicas.
            </p>
            <Link
              href="/producao-bibliografica"
              className="mt-3 inline-flex items-center text-sm text-white/80 hover:text-white"
            >
              Ver bibliografia <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
