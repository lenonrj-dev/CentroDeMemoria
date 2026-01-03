"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../../../lib/backend-client";
import { useAdminAuth } from "../../../components/admin/AdminAuthProvider";

type Overview = {
  counts: Array<{ key: string; total: number; published: number; drafts: number }>;
  alerts: {
    missingCover: Array<{ key: string; count: number }>;
    shortDescriptions: Array<{ key: string; count: number }>;
    journalsWithoutPagesOrPdf: number;
    photoArchivesWithFewPhotos: number;
    referencesMissingYearOrCitation: number;
  };
  suggestions: string[];
};

const quickLinks = [
  { href: "/admin/documentos/new", label: "Novo documento" },
  { href: "/admin/depoimentos/new", label: "Novo depoimento" },
  { href: "/admin/referencias/new", label: "Nova referência" },
  { href: "/admin/jornais/new", label: "Novo jornal" },
  { href: "/admin/acervo-fotografico/new", label: "Novo álbum de fotos" },
];

export default function AdminHome() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<Overview>("/api/admin/overview", token || undefined);
        if (!cancelled) setData(res.data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Falha ao carregar");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const countsByKey = useMemo(() => {
    const map = new Map<string, { total: number; published: number; drafts: number }>();
    data?.counts?.forEach((c) => map.set(c.key, c));
    return map;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <h1 className="text-xl font-semibold text-white">Conteúdo & Pendências</h1>
        <p className="mt-1 text-sm text-white/70">Visão rápida do estado do banco e checklist editorial.</p>
      </div>

      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      {data && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { key: "documentos", label: "Documentos" },
              { key: "depoimentos", label: "Depoimentos" },
              { key: "referencias", label: "Referências" },
              { key: "jornais", label: "Jornais" },
              { key: "acervoFotografico", label: "Acervo fotográfico" },
            ].map(({ key, label }) => {
              const c = countsByKey.get(key);
              return (
                <div key={key} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-sm font-semibold text-white/90">{label}</div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-white/70">
                    <div>
                      <div className="text-white/40">Total</div>
                      <div className="text-white">{c?.total ?? 0}</div>
                    </div>
                    <div>
                      <div className="text-white/40">Publicados</div>
                      <div className="text-white">{c?.published ?? 0}</div>
                    </div>
                    <div>
                      <div className="text-white/40">Rascunhos</div>
                      <div className="text-white">{c?.drafts ?? 0}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-base font-semibold text-white">Alertas de qualidade</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/75">
              {data.alerts.missingCover.some((x) => x.count > 0) && <li>Itens sem `coverImageUrl` em algum módulo.</li>}
              {data.alerts.shortDescriptions.some((x) => x.count > 0) && <li>Descrições muito curtas (&lt; 80 caracteres).</li>}
              {data.alerts.journalsWithoutPagesOrPdf > 0 && <li>Jornais sem pages e sem pdfUrl.</li>}
              {data.alerts.photoArchivesWithFewPhotos > 0 && <li>Álbuns com poucas fotos (&lt; 3).</li>}
              {data.alerts.referencesMissingYearOrCitation > 0 && <li>Referências sem year ou citation.</li>}
              {!data.alerts.missingCover.some((x) => x.count > 0) &&
                !data.alerts.shortDescriptions.some((x) => x.count > 0) &&
                data.alerts.journalsWithoutPagesOrPdf === 0 &&
                data.alerts.photoArchivesWithFewPhotos === 0 &&
                data.alerts.referencesMissingYearOrCitation === 0 && <li>Nenhum alerta crítico encontrado.</li>}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-base font-semibold text-white">Sugestões objetivas</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/75">
              {data.suggestions.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-base font-semibold text-white">Próximos passos</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

