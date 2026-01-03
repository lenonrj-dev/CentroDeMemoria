"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, apiPost } from "../../../lib/backend-client";
import type { ContentStatus, JournalContent, JournalPage } from "../../../lib/backend-types";
import { useAdminAuth } from "../AdminAuthProvider";
import { slugify } from "../../../lib/slugify";
import { joinCsv, moveItem, splitCsv } from "./common";
import StudyModal from "../../viewer/StudyModal";

type Props = { id?: string };

const emptyPage: JournalPage = { pageNumber: 1, imageUrl: "", thumbUrl: "" };

const empty: Partial<JournalContent> = {
  title: "",
  slug: "",
  description: "",
  coverImageUrl: "",
  status: "draft",
  tags: [],
  featured: false,
  sortOrder: 0,
  issueDate: new Date().toISOString().slice(0, 10),
  edition: "",
  city: "",
  pdfUrl: "",
  pages: [],
  pagesCount: undefined,
};

export default function JournalForm({ id }: Props) {
  const { token } = useAdminAuth();
  const [data, setData] = useState<Partial<JournalContent>>(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverPreviewSize, setCoverPreviewSize] = useState<{ w: number; h: number }>({ w: 520, h: 160 });
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const coverPreviewW = clamp(coverPreviewSize.w, 240, 820);
  const coverPreviewH = clamp(coverPreviewSize.h, 120, 520);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cmodrm_admin_cover_preview_size_form");
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (
        parsed &&
        typeof parsed === "object" &&
        "w" in parsed &&
        "h" in parsed &&
        typeof (parsed as any).w === "number" &&
        typeof (parsed as any).h === "number"
      ) {
        setCoverPreviewSize({ w: (parsed as any).w, h: (parsed as any).h });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("cmodrm_admin_cover_preview_size_form", JSON.stringify({ w: coverPreviewW, h: coverPreviewH }));
    } catch {
      // ignore
    }
  }, [coverPreviewH, coverPreviewW]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGet<JournalContent>(`/api/admin/jornais/${id}`, token || undefined);
        const raw = res.data;
        if (!cancelled) {
          setData({
            ...raw,
            issueDate: raw.issueDate?.slice(0, 10) ?? "",
          });
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Falha ao carregar");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, token]);

  const pages = data.pages ?? [];
  const tagsCsv = useMemo(() => joinCsv(data.tags), [data.tags]);

  const setField = <K extends keyof JournalContent>(key: K, value: JournalContent[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (status: ContentStatus) => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: data.title,
        slug: data.slug,
        description: data.description,
        coverImageUrl: data.coverImageUrl,
        status,
        tags: data.tags ?? [],
        featured: !!data.featured,
        sortOrder: Number(data.sortOrder ?? 0),
        issueDate: data.issueDate,
        edition: data.edition || undefined,
        city: data.city || undefined,
        pdfUrl: data.pdfUrl || undefined,
        pages: (data.pages ?? [])
          .filter((p) => p.imageUrl)
          .map((p) => ({
            pageNumber: Number(p.pageNumber),
            imageUrl: p.imageUrl,
            thumbUrl: p.thumbUrl || undefined,
          })),
        pagesCount: data.pagesCount ? Number(data.pagesCount) : undefined,
      };

      if (id) {
        await apiPatch<JournalContent>(`/api/admin/jornais/${id}`, payload, token || undefined);
      } else {
        await apiPost<JournalContent>("/api/admin/jornais", payload, token || undefined);
      }
      window.location.href = "/admin/jornais";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-white/70">Carregando...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">{id ? "Editar jornal" : "Novo jornal"}</h1>
          <p className="mt-1 text-sm text-white/70">Pages (imagens) e/ou pdfUrl via link.</p>
        </div>
        <Link href="/admin/jornais" className="text-sm text-white/70 hover:text-white">
          Voltar
        </Link>
      </div>

      {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          <label className="block text-sm text-white/70">
            Título
            <input
              value={data.title ?? ""}
              onChange={(e) => {
                const title = e.target.value;
                setField("title", title as any);
                if (!slugTouched) setField("slug", slugify(title) as any);
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

          <label className="block text-sm text-white/70">
            Slug
            <input
              value={data.slug ?? ""}
              onChange={(e) => {
                setSlugTouched(true);
                setField("slug", e.target.value as any);
              }}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </label>

          <label className="block text-sm text-white/70">
            Descrição
            <textarea
              value={data.description ?? ""}
              onChange={(e) => setField("description", e.target.value as any)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              required
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Data da edição
              <input
                value={data.issueDate ?? ""}
                onChange={(e) => setField("issueDate", e.target.value as any)}
                type="date"
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                required
              />
            </label>
            <label className="block text-sm text-white/70">
              Edição (opcional)
              <input
                value={data.edition ?? ""}
                onChange={(e) => setField("edition", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Edição 42"
              />
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm text-white/70">
              Cidade (opcional)
              <input
                value={data.city ?? ""}
                onChange={(e) => setField("city", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="Volta Redonda"
              />
            </label>
            <label className="block text-sm text-white/70">
              pdfUrl (opcional)
              <input
                value={data.pdfUrl ?? ""}
                onChange={(e) => setField("pdfUrl", e.target.value as any)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder="https://.../arquivo.pdf"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white/90">Páginas (ordenadas)</div>
              <button
                type="button"
                onClick={() => setField("pages", [...pages, { ...emptyPage, pageNumber: pages.length + 1 }] as any)}
                className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15"
              >
                Adicionar
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {pages.map((p, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-black/40 p-3">
                  <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
                    <input
                      value={String(p.pageNumber)}
                      onChange={(e) => {
                        const next = pages.slice();
                        next[idx] = { ...p, pageNumber: Number(e.target.value) };
                        setField("pages", next as any);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      inputMode="numeric"
                      placeholder="Nº"
                    />
                    <input
                      value={p.imageUrl}
                      onChange={(e) => {
                        const next = pages.slice();
                        next[idx] = { ...p, imageUrl: e.target.value };
                        setField("pages", next as any);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="imageUrl"
                    />
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
                    <input
                      value={p.thumbUrl ?? ""}
                      onChange={(e) => {
                        const next = pages.slice();
                        next[idx] = { ...p, thumbUrl: e.target.value };
                        setField("pages", next as any);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                      placeholder="thumbUrl (opcional)"
                    />
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => setField("pages", moveItem(pages, idx, idx - 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5 disabled:opacity-40"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={idx === pages.length - 1}
                      onClick={() => setField("pages", moveItem(pages, idx, idx + 1) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5 disabled:opacity-40"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => setField("pages", pages.filter((_, i) => i !== idx) as any)}
                      className="rounded-xl border border-white/10 bg-transparent px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                    >
                      Remover
                    </button>
                  </div>
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.imageUrl} alt={`página ${p.pageNumber}`} className="mt-3 h-40 w-full rounded-2xl object-cover" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3 lg:col-span-4">
          <label className="block text-sm text-white/70">
            coverImageUrl
            <input
              value={data.coverImageUrl ?? ""}
              onChange={(e) => setField("coverImageUrl", e.target.value as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="https://res.cloudinary.com/.../cover.jpg"
              required
            />
          </label>

          <label className="block text-sm text-white/70">
            Tags (csv)
            <input
              value={tagsCsv}
              onChange={(e) => setField("tags", splitCsv(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              placeholder="Volta Redonda, Greves"
            />
          </label>

          <label className="block text-sm text-white/70">
            pagesCount (opcional)
            <input
              value={data.pagesCount ? String(data.pagesCount) : ""}
              onChange={(e) => setField("pagesCount", (e.target.value ? Number(e.target.value) : undefined) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              inputMode="numeric"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={!!data.featured}
              onChange={(e) => setField("featured", e.target.checked as any)}
              className="h-4 w-4 accent-white"
            />
            Destaque
          </label>

          <label className="block text-sm text-white/70">
            sortOrder
            <input
              value={String(data.sortOrder ?? 0)}
              onChange={(e) => setField("sortOrder", Number(e.target.value) as any)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/20"
              inputMode="numeric"
            />
          </label>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="text-sm font-semibold text-white/90">Preview</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-white/60">
                Largura: {coverPreviewW}px
                <input
                  type="range"
                  min={240}
                  max={820}
                  step={20}
                  value={coverPreviewW}
                  onChange={(e) => setCoverPreviewSize((s) => ({ ...s, w: Number(e.target.value) }))}
                  className="mt-2 w-full accent-white/80"
                />
              </label>
              <label className="text-xs text-white/60">
                Altura: {coverPreviewH}px
                <input
                  type="range"
                  min={120}
                  max={520}
                  step={20}
                  value={coverPreviewH}
                  onChange={(e) => setCoverPreviewSize((s) => ({ ...s, h: Number(e.target.value) }))}
                  className="mt-2 w-full accent-white/80"
                />
              </label>
            </div>
            <div className="mt-3 space-y-2">
              {data.coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.coverImageUrl}
                  alt={data.title || "cover"}
                  className="mx-auto w-full rounded-2xl border border-white/10 bg-black/40 object-cover"
                  style={{ maxWidth: coverPreviewW, height: coverPreviewH }}
                />
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">Sem cover</div>
              )}
              {data.pdfUrl ? (
                <button
                  type="button"
                  onClick={() => setFilePreview(data.pdfUrl || null)}
                  className="text-xs text-white/70 underline underline-offset-2"
                >
                  Visualizar PDF
                </button>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => save("draft")}
              className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-white/80 hover:bg-white/5 disabled:opacity-60"
            >
              Salvar rascunho
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => save("published")}
              className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-60"
            >
              Publicar
            </button>
          </div>
      </div>
    </div>
    <StudyModal
      open={Boolean(filePreview)}
      onClose={() => setFilePreview(null)}
      title={data.title || "Documento"}
      src={filePreview || ""}
    />
  </div>
);
}
