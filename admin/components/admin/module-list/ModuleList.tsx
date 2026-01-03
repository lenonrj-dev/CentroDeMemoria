"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { apiDelete, apiGet, apiPatch } from "../../../lib/backend-client";
import type { ContentStatus } from "../../../lib/backend-types";
import type { NormalizedApiError } from "../../../lib/api-errors";
import { useAdminAuth } from "../AdminAuthProvider";
import { ConfirmDialog } from "../ConfirmDialog";
import { useToast } from "../ToastProvider";
import type { AdminModule } from "../../../lib/public-site";
import { getModuleMap } from "../../../lib/site-map";
import { useApiErrorHandler } from "../useApiErrorHandler";
import { ContentPreviewModal } from "./ContentPreviewModal";
import { ModuleCards } from "./ModuleCards";
import { ModuleTable } from "./ModuleTable";
import type { ListItem, ListMeta, ListQuery, ListViewMode, RowAction } from "./types";
import { SORT_OPTIONS, buildQueryString, clamp, getItemId, safeMeta } from "./utils";

type Props = {
  module: AdminModule;
  title: string;
};

const VIEW_KEY_PREFIX = "sintracon_admin_list_view_";

function isStatus(v: string): v is ContentStatus {
  return v === "draft" || v === "published" || v === "archived";
}

export function ModuleListView({ module, title }: Props) {
  const { token } = useAdminAuth();
  const { pushToast } = useToast();
  const handleApiError = useApiErrorHandler();

  const [viewMode, setViewMode] = useState<ListViewMode>("table");
  const searchParams = useSearchParams();

  const initialQuery = useMemo<ListQuery>(() => {
    const pick = (key: string) => searchParams?.get(key) || "";
    const page = Number(pick("page") || 1);
    const limit = Number(pick("limit") || 24);
    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 24,
      q: pick("q"),
      status: pick("status") as ListQuery["status"],
      tag: pick("tag"),
      personSlug: pick("personSlug"),
      fundKey: pick("fundKey"),
      featured: pick("featured") as ListQuery["featured"],
      sort: (pick("sort") as ListQuery["sort"]) || "updated_desc",
    };
  }, [searchParams]);

  const [query, setQuery] = useState<ListQuery>(initialQuery);

  const [items, setItems] = useState<ListItem[]>([]);
  const [meta, setMeta] = useState<ListMeta>(() => safeMeta());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<NormalizedApiError | null>(null);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [confirm, setConfirm] = useState<{
    open: boolean;
    title: string;
    description?: string;
    tone?: "danger" | "default";
    confirmLabel?: string;
    onConfirm?: () => void;
  }>({ open: false, title: "" });

  const [previewId, setPreviewId] = useState<string | null>(null);

  const map = useMemo(() => getModuleMap(module), [module]);
  const publicListUrl = map?.placements?.[0]?.url || null;

  const toastError = (err: unknown, fallback: string) => {
    const normalized = handleApiError(err);
    const message = normalized.requestId ? `${normalized.message} (ID: ${normalized.requestId})` : normalized.message;
    pushToast({ type: "error", message: message || fallback });
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`${VIEW_KEY_PREFIX}${module}`);
      if (raw === "table" || raw === "cards") setViewMode(raw);
    } catch {
      // ignore
    }
  }, [module]);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery, module]);

  useEffect(() => {
    try {
      localStorage.setItem(`${VIEW_KEY_PREFIX}${module}`, viewMode);
    } catch {
      // ignore
    }
  }, [module, viewMode]);

  const fetchList = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryString(query);
      const res = await apiGet<ListItem[]>(`/api/admin/${module}${qs}`, token || undefined);
      setItems(res.data || []);
      setMeta(safeMeta(res.meta as any));
      setSelectedIds(new Set());
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const qs = buildQueryString(query);
        const res = await apiGet<ListItem[]>(`/api/admin/${module}${qs}`, token || undefined);
        if (cancelled) return;
        setItems(res.data || []);
        setMeta(safeMeta(res.meta as any));
        setSelectedIds(new Set());
      } catch (err) {
        if (!cancelled) setError(handleApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [module, query, token]);

  const selectedItems = useMemo(() => {
    const byId = new Map(items.map((it) => [getItemId(it), it]));
    return Array.from(selectedIds).map((id) => byId.get(id)).filter(Boolean) as ListItem[];
  }, [items, selectedIds]);

  const setPage = (page: number) => setQuery((q) => ({ ...q, page: clamp(page, 1, Math.max(1, meta.totalPages || 1)) }));

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (!checked) return setSelectedIds(new Set());
    setSelectedIds(new Set(items.map(getItemId)));
  };

  const updateStatus = async (id: string, status: ContentStatus) => {
    if (!token) return;
    await apiPatch(`/api/admin/${module}/${id}/status`, { status }, token || undefined);
  };

  const removeOne = async (id: string) => {
    if (!token) return;
    await apiDelete(`/api/admin/${module}/${id}`, token || undefined);
  };

  const patchOne = async (id: string, body: unknown) => {
    if (!token) return;
    await apiPatch(`/api/admin/${module}/${id}`, body, token || undefined);
  };

  const onRowAction = (action: RowAction, item: ListItem) => {
    const id = getItemId(item);
    if (action === "preview") {
      setPreviewId(id);
      return;
    }
    if (action === "delete") {
      setConfirm({
        open: true,
        title: "Excluir item?",
        description: `Esta ação não pode ser desfeita: “${item.title || id}”.`,
        tone: "danger",
        confirmLabel: "Excluir",
        onConfirm: async () => {
          setConfirm((c) => ({ ...c, open: false }));
          try {
            await removeOne(id);
            pushToast({ type: "success", message: "Item excluído." });
            await fetchList();
          } catch (err) {
            toastError(err, "Falha ao excluir");
          }
        },
      });
      return;
    }
    if (action === "publish") {
      setConfirm({
        open: true,
        title: "Publicar item?",
        description: `Ele ficará visível no site público (onde se aplica).`,
        confirmLabel: "Publicar",
        onConfirm: async () => {
          setConfirm((c) => ({ ...c, open: false }));
          try {
            await updateStatus(id, "published");
            pushToast({ type: "success", message: "Item publicado." });
            await fetchList();
          } catch (err) {
            toastError(err, "Falha ao publicar");
          }
        },
      });
      return;
    }
    if (action === "archive") {
      setConfirm({
        open: true,
        title: "Arquivar item?",
        description: "Ele sairá do site público, mas continuará salvo.",
        confirmLabel: "Arquivar",
        onConfirm: async () => {
          setConfirm((c) => ({ ...c, open: false }));
          try {
            await updateStatus(id, "archived");
            pushToast({ type: "success", message: "Item arquivado." });
            await fetchList();
          } catch (err) {
            toastError(err, "Falha ao arquivar");
          }
        },
      });
      return;
    }
  };

  const bulkPublish = async (status: ContentStatus) => {
    const count = selectedIds.size;
    setConfirm({
      open: true,
      title: status === "published" ? "Publicar itens?" : status === "archived" ? "Arquivar itens?" : "Atualizar status?",
      description: `Confirmar ação em ${count} item(ns).`,
      confirmLabel: status === "published" ? "Publicar" : status === "archived" ? "Arquivar" : "Confirmar",
      onConfirm: async () => {
        setConfirm((c) => ({ ...c, open: false }));
        try {
          for (const id of Array.from(selectedIds)) {
            await updateStatus(id, status);
          }
          pushToast({ type: "success", message: `Ação aplicada em ${count} item(ns).` });
          await fetchList();
        } catch (err) {
          toastError(err, "Falha na acao em lote");
        }
      },
    });
  };

  const bulkDelete = async () => {
    const count = selectedIds.size;
    setConfirm({
      open: true,
      title: "Excluir itens?",
      description: `Esta ação não pode ser desfeita (total: ${count}).`,
      tone: "danger",
      confirmLabel: "Excluir",
      onConfirm: async () => {
        setConfirm((c) => ({ ...c, open: false }));
        try {
          for (const id of Array.from(selectedIds)) {
            await removeOne(id);
          }
          pushToast({ type: "success", message: `Itens excluídos: ${count}.` });
          await fetchList();
        } catch (err) {
          toastError(err, "Falha ao excluir em lote");
        }
      },
    });
  };

  const [tagEditOpen, setTagEditOpen] = useState<null | "add" | "remove">(null);
  const [tagEditValue, setTagEditValue] = useState<string>("");

  const downloadTextFile = (filename: string, text: string, mime: string) => {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportSelectedJson = () => {
    const payload = {
      module,
      exportedAt: new Date().toISOString(),
      count: selectedItems.length,
      items: selectedItems,
    };
    downloadTextFile(`${module}-export.json`, JSON.stringify(payload, null, 2), "application/json");
    pushToast({ type: "success", message: "Export JSON gerado." });
  };

  const exportSelectedCsv = () => {
    const esc = (v: unknown) => {
      const s = String(v ?? "");
      const q = s.replaceAll('"', '""');
      return `"${q}"`;
    };
    const rows = selectedItems.map((it) => {
      const tags = Array.isArray(it.tags) ? (it.tags as string[]).join("|") : "";
      return [it._id, it.title, it.slug, it.status, it.updatedAt || it.createdAt || "", tags].map(esc).join(",");
    });
    const header = ["id", "title", "slug", "status", "updatedAt", "tags"].join(",");
    downloadTextFile(`${module}-export.csv`, [header, ...rows].join("\n"), "text/csv");
    pushToast({ type: "success", message: "Export CSV gerado." });
  };

  const applyTagEdit = async () => {
    const mode = tagEditOpen;
    const tag = tagEditValue.trim();
    if (!mode || !tag) return;
    const count = selectedIds.size;
    setConfirm({
      open: true,
      title: mode === "add" ? "Adicionar tag?" : "Remover tag?",
      description: `${mode === "add" ? "Adicionar" : "Remover"} “${tag}” em ${count} item(ns).`,
      confirmLabel: mode === "add" ? "Adicionar" : "Remover",
      onConfirm: async () => {
        setConfirm((c) => ({ ...c, open: false }));
        try {
          for (const id of Array.from(selectedIds)) {
            const it = selectedItems.find((x) => getItemId(x) === id);
            const tags = Array.isArray(it?.tags) ? (it!.tags as string[]) : [];
            const next = mode === "add" ? Array.from(new Set([...tags, tag])) : tags.filter((t) => t !== tag);
            await patchOne(id, { tags: next });
          }
          setTagEditOpen(null);
          setTagEditValue("");
          pushToast({ type: "success", message: `Tags atualizadas em ${count} item(ns).` });
          await fetchList();
        } catch (err) {
          toastError(err, "Falha ao atualizar tags");
        }
      },
    });
  };

  const from = (meta.page - 1) * meta.limit + 1;
  const to = Math.min(meta.page * meta.limit, meta.total);
  const pageSummary = meta.total ? `${from}–${to} de ${meta.total}` : "0 itens";
  const errorText = error ? `${error.message}${error.requestId ? ` (ID: ${error.requestId})` : ""}` : "";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
          <div className="mt-1 text-sm text-white/60">
            Gestão completa: filtros, ações em lote, preview e onde aparece no site.
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {publicListUrl ? (
            <a
              href={publicListUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/85 hover:bg-white/5"
            >
              Ver no site
            </a>
          ) : null}
          <button
            type="button"
            onClick={fetchList}
            className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/85 hover:bg-white/5"
          >
            Atualizar
          </button>
          <Link href={`/admin/${module}/new`} className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15">
            Novo
          </Link>
        </div>
      </div>

      <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 lg:grid-cols-[1fr_160px_160px_160px_160px_160px_180px_160px]">
        <label className="block text-sm text-white/70">
          Busca
          <input
            value={query.q}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, q: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="Pesquisar por título/descrição"
          />
          <div className="mt-1 text-xs text-white/50">Dica: use palavras-chave, nomes e tags.</div>
        </label>

        <label className="block text-sm text-white/70">
          Status
          <select
            value={query.status}
            onChange={(e) => {
              const v = e.target.value;
              setQuery((q) => ({ ...q, page: 1, status: isStatus(v) ? v : "" }));
            }}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">Todos</option>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
          <div className="mt-1 text-xs text-white/50">Publicado aparece no site.</div>
        </label>

        <label className="block text-sm text-white/70">
          Tag
          <input
            value={query.tag}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, tag: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="ex.: Volta Redonda"
          />
          <div className="mt-1 text-xs text-white/50">Filtra por uma tag exata.</div>
        </label>

        <label className="block text-sm text-white/70">
          Pessoa (slug)
          <input
            value={query.personSlug || ""}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, personSlug: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="dom-waldyr"
          />
          <div className="mt-1 text-xs text-white/50">Usa relatedPersonSlug no backend.</div>
        </label>

        <label className="block text-sm text-white/70">
          Fundo (chave)
          <input
            value={query.fundKey || ""}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, fundKey: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
            placeholder="dom-waldyr"
          />
          <div className="mt-1 text-xs text-white/50">Usa relatedFundKey no backend.</div>
        </label>

        <label className="block text-sm text-white/70">
          Destaque
          <select
            value={query.featured}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, featured: e.target.value as any }))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <option value="">Todos</option>
            <option value="true">Somente destaque</option>
            <option value="false">Sem destaque</option>
          </select>
          <div className="mt-1 text-xs text-white/50">Ordene por “Destaque” se usar.</div>
        </label>

        <label className="block text-sm text-white/70">
          Ordenação
          <select
            value={query.sort}
            onChange={(e) => setQuery((q) => ({ ...q, page: 1, sort: e.target.value as any }))}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-2">
          <div className="text-sm text-white/70">Visualização</div>
          <div className="inline-flex overflow-hidden rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={"px-3 py-2 text-sm " + (viewMode === "table" ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5")}
            >
              Tabela
            </button>
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={"px-3 py-2 text-sm " + (viewMode === "cards" ? "bg-white/10 text-white" : "bg-transparent text-white/70 hover:bg-white/5")}
            >
              Cards
            </button>
          </div>
          <div className="text-xs text-white/50">Preferência salva neste navegador.</div>
        </div>
      </div>

      {selectedIds.size ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/80">
              Selecionados: <span className="font-semibold text-white">{selectedIds.size}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => bulkPublish("published")}
                className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-50 hover:bg-emerald-500/15"
              >
                Publicar
              </button>
              <button
                type="button"
                onClick={() => bulkPublish("archived")}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              >
                Arquivar
              </button>
              <button
                type="button"
                onClick={() => {
                  setTagEditOpen("add");
                  setTagEditValue("");
                }}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              >
                + Tag
              </button>
              <button
                type="button"
                onClick={() => {
                  setTagEditOpen("remove");
                  setTagEditValue("");
                }}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              >
                − Tag
              </button>
              <button
                type="button"
                onClick={exportSelectedJson}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={exportSelectedCsv}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5"
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={bulkDelete}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-50 hover:bg-red-500/15"
              >
                Excluir
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5"
              >
                Limpar
              </button>
            </div>
          </div>

          {tagEditOpen ? (
            <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-black/30 p-4 sm:grid-cols-[1fr_auto]">
              <label className="block text-sm text-white/70">
                {tagEditOpen === "add" ? "Adicionar tag" : "Remover tag"}
                <input
                  value={tagEditValue}
                  onChange={(e) => setTagEditValue(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-white/20"
                  placeholder="ex.: Dom Waldyr"
                />
                <div className="mt-1 text-xs text-white/50">Aplica em todos os itens selecionados nesta página.</div>
              </label>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={applyTagEdit}
                  className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
                >
                  Aplicar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTagEditOpen(null);
                    setTagEditValue("");
                  }}
                  className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-white/60">{loading ? "Carregando..." : error ? `Erro: ${errorText}` : pageSummary}</div>
        <div className="flex items-center gap-2">
          {error ? (
            <button
              type="button"
              disabled={loading}
              onClick={fetchList}
              className="rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-white hover:bg-white/15 disabled:opacity-50"
            >
              Tentar novamente
            </button>
          ) : null}
          <button
            type="button"
            disabled={!meta.hasPrev || loading}
            onClick={() => setPage(meta.page - 1)}
            className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
          >
            Anterior
          </button>
          <div className="text-xs text-white/60">
            Página {meta.page} / {meta.totalPages}
          </div>
          <button
            type="button"
            disabled={!meta.hasNext || loading}
            onClick={() => setPage(meta.page + 1)}
            className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/80 hover:bg-white/5 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>

      {!loading && !error && !items.length ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
          <div className="text-base font-semibold text-white">Nenhum item encontrado</div>
          <div className="mt-2 text-sm text-white/70">Ajuste filtros ou crie o primeiro conteúdo deste módulo.</div>
          <Link href={`/admin/${module}/new`} className="mt-5 inline-flex rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15">
            Criar primeiro item
          </Link>
        </div>
      ) : null}

      {items.length ? (
        viewMode === "cards" ? (
          <ModuleCards module={module} items={items} selectedIds={selectedIds} onToggleSelect={toggleSelect} onAction={onRowAction} />
        ) : (
          <ModuleTable
            module={module}
            items={items}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onToggleSelectAll={toggleSelectAll}
            onAction={onRowAction}
          />
        )
      ) : null}

      <ConfirmDialog
        open={confirm.open}
        title={confirm.title}
        description={confirm.description}
        confirmLabel={confirm.confirmLabel}
        tone={confirm.tone}
        onClose={() => setConfirm((c) => ({ ...c, open: false }))}
        onConfirm={() => confirm.onConfirm?.()}
      />

      <ContentPreviewModal open={!!previewId} module={module} itemId={previewId} token={token} onClose={() => setPreviewId(null)} />
    </div>
  );
}
