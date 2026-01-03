"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteRouteRecord } from "../../../../lib/backend-types";
import { apiDelete, apiGet, apiPatch, apiPost } from "../../../../lib/backend-client";
import { useAdminAuth } from "../../../../components/admin/AdminAuthProvider";
import { useApiErrorHandler } from "../../../../components/admin/useApiErrorHandler";
import { FormErrorSummary } from "../../../../components/admin/forms/FormErrorSummary";

type FormState = {
  id?: string;
  routePath: string;
  label: string;
  routeType: string;
  contentTypes: string;
  query: string;
  enabled: boolean;
};

const emptyForm: FormState = {
  routePath: "",
  label: "",
  routeType: "",
  contentTypes: "",
  query: "{}",
  enabled: true,
};

function csvToList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function buildQueryParams(query?: Record<string, unknown>) {
  if (!query) return "";
  const params = new URLSearchParams();
  const tag = typeof query.tag === "string" ? query.tag : "";
  const personSlug = typeof (query as any).personSlug === "string" ? (query as any).personSlug : "";
  const fundKey = typeof (query as any).fundKey === "string" ? (query as any).fundKey : "";
  if (tag) params.set("tag", tag);
  if (personSlug) params.set("personSlug", personSlug);
  if (fundKey) params.set("fundKey", fundKey);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function toAdminModule(type: string) {
  if (type === "entrevistas") return "depoimentos";
  return type;
}

export default function Page() {
  const { token } = useAdminAuth();
  const handleApiError = useApiErrorHandler();

  const [items, setItems] = useState<SiteRouteRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchList = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<SiteRouteRecord[]>("/api/admin/rotas", token || undefined);
      setItems(res.data || []);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  const onEdit = (item: SiteRouteRecord) => {
    setForm({
      id: item._id,
      routePath: item.routePath,
      label: item.label,
      routeType: item.routeType,
      contentTypes: (item.contentTypes || []).join(", "),
      query: JSON.stringify(item.query || {}, null, 2),
      enabled: item.enabled !== false,
    });
  };

  const onReset = () => setForm(emptyForm);

  const onSave = async () => {
    if (!token) return;
    let query: Record<string, unknown> | undefined = undefined;
    try {
      query = form.query?.trim() ? (JSON.parse(form.query) as Record<string, unknown>) : undefined;
    } catch {
      setError({ message: "JSON invalido no campo query." });
      return;
    }

    const payload = {
      routePath: form.routePath.trim(),
      label: form.label.trim(),
      routeType: form.routeType.trim(),
      contentTypes: csvToList(form.contentTypes),
      query,
      enabled: form.enabled,
    };

    if (!payload.routePath || !payload.label || !payload.routeType) {
      setError({ message: "Preencha routePath, label e routeType." });
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (form.id) {
        await apiPatch(`/api/admin/rotas/${form.id}`, payload, token || undefined);
      } else {
        await apiPost("/api/admin/rotas", payload, token || undefined);
      }
      await fetchList();
      setForm(emptyForm);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const onRemove = async (id: string) => {
    if (!token) return;
    const ok = window.confirm("Excluir rota?");
    if (!ok) return;
    setSaving(true);
    setError(null);
    try {
      await apiDelete(`/api/admin/rotas/${id}`, token || undefined);
      await fetchList();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const countLabel = useMemo(() => (items.length ? `${items.length} rotas` : "Sem rotas"), [items.length]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">Conteudos do site</h1>
          <p className="mt-1 text-sm text-white/70">Inventario de rotas historicas e regras de exibicao.</p>
        </div>
        <button
          type="button"
          onClick={fetchList}
          className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/85 hover:bg-white/5"
        >
          Atualizar
        </button>
      </div>

      <FormErrorSummary error={error} />

      <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm text-white/70">{loading ? "Carregando..." : countLabel}</div>
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs text-white/80 hover:bg-white/5"
          >
            Novo
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-black/30">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="text-xs text-white/60">
              <tr>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Label</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Content types</th>
                <th className="px-4 py-3">Enabled</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {items.map((item) => (
                <tr key={item._id} className="text-white/80">
                  <td className="px-4 py-3 font-mono text-xs">{item.routePath}</td>
                  <td className="px-4 py-3">{item.label}</td>
                  <td className="px-4 py-3 text-xs">{item.routeType}</td>
                  <td className="px-4 py-3 text-xs">{(item.contentTypes || []).join(", ") || "-"}</td>
                  <td className="px-4 py-3 text-xs">{item.enabled === false ? "Nao" : "Sim"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(item._id)}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-50 hover:bg-red-500/15"
                      >
                        Excluir
                      </button>
                    </div>
                    {(item.contentTypes || []).length ? (
                      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/70">
                        {(item.contentTypes || []).map((type) => {
                          const module = toAdminModule(type);
                          const qs = buildQueryParams(item.query);
                          return (
                            <a
                              key={`${item._id}-${type}`}
                              href={`/admin/${module}${qs}`}
                              className="rounded-full border border-white/10 bg-white/5 px-2 py-1 hover:bg-white/10"
                            >
                              Ver {type}
                            </a>
                          );
                        })}
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
              {!items.length && !loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-white/60">
                    Nenhuma rota cadastrada.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-sm font-semibold text-white/90">{form.id ? "Editar rota" : "Nova rota"}</div>
        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          <label className="block text-sm text-white/70">
            routePath
            <input
              value={form.routePath}
              onChange={(e) => setForm((prev) => ({ ...prev, routePath: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="/acervo-pessoal/dom-waldyr"
            />
          </label>
          <label className="block text-sm text-white/70">
            Label
            <input
              value={form.label}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Acervo pessoal - Dom Waldyr"
            />
          </label>
          <label className="block text-sm text-white/70">
            routeType
            <input
              value={form.routeType}
              onChange={(e) => setForm((prev) => ({ ...prev, routeType: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="PERSON_ARCHIVE"
            />
          </label>
          <label className="block text-sm text-white/70">
            contentTypes (CSV)
            <input
              value={form.contentTypes}
              onChange={(e) => setForm((prev) => ({ ...prev, contentTypes: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="documentos, jornais, depoimentos"
            />
          </label>
        </div>

        <label className="mt-3 block text-sm text-white/70">
          query (JSON)
          <textarea
            value={form.query}
            onChange={(e) => setForm((prev) => ({ ...prev, query: e.target.value }))}
            className="mt-1 min-h-[160px] w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder='{"relatedFundKey":"dom-waldyr"}'
          />
          <div className="mt-1 text-xs text-white/50">Filtro para listar conteudos vinculados (tag, personSlug, fundKey).</div>
        </label>

        <label className="mt-3 flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
            className="h-4 w-4 accent-white"
          />
          Enabled
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-60"
          >
            {form.id ? "Salvar alteracoes" : "Criar rota"}
          </button>
          {form.id ? (
            <button
              type="button"
              disabled={saving}
              onClick={onReset}
              className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5 disabled:opacity-60"
            >
              Cancelar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
