import type { Model } from "mongoose";
import type { Request, Response } from "express";
import { parsePagination } from "../utils/pagination";
import { slugify } from "../utils/slugify";
import type { ContentStatus } from "../types/content";
import { ApiError, ok } from "../utils/api-error";

type AnyDoc = {
  _id: unknown;
  slug: string;
  title: string;
  description: string;
  status: ContentStatus;
  tags?: string[];
  publishedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
} & Record<string, unknown>;

async function ensureUniqueSlug<T extends AnyDoc>(
  model: Model<T>,
  desired: string,
  excludeId?: string,
  label?: string
) {
  const base = (desired || "").trim();
  if (!base) {
    throw new ApiError(422, "VALIDATION_ERROR", "Slug vazio ou invalido.", {
      fieldErrors: { slug: "Informe um slug valido." },
    });
  }
  const exists = await model.exists(excludeId ? { slug: base, _id: { $ne: excludeId } } : { slug: base });
  if (exists) {
    const kind = label ? `um ${label}` : "um item";
    throw new ApiError(409, "CONFLICT", `Ja existe ${kind} com esse slug.`, {
      fieldErrors: { slug: "Slug ja existe. Use outro." },
    });
  }
  return base;
}

export function buildPublicControllers<T extends AnyDoc>(model: Model<T>, defaultSort: Record<string, 1 | -1>) {
  return {
    list: async (req: Request, res: Response) => {
      const { page, limit, skip } = parsePagination(req.query);
      const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
      const tag = typeof req.query.tag === "string" ? req.query.tag.trim() : "";
      const personSlug = typeof req.query.personSlug === "string"
        ? req.query.personSlug.trim()
        : typeof req.query.person === "string"
          ? req.query.person.trim()
          : "";
      const fundKey = typeof req.query.fundKey === "string"
        ? req.query.fundKey.trim()
        : typeof req.query.fund === "string"
          ? req.query.fund.trim()
          : "";

      const filter: Record<string, unknown> = { status: "published" };
      const orFilters: Record<string, unknown>[] = [];
      if (personSlug) orFilters.push({ relatedPersonSlug: personSlug });
      if (fundKey) orFilters.push({ relatedFundKey: fundKey });
      if (tag) {
        if (orFilters.length) orFilters.push({ tags: tag });
        else filter.tags = tag;
      }
      if (orFilters.length) filter.$or = orFilters;
      if (q) filter.$text = { $search: q };

      const sort = q ? ({ score: { $meta: "textScore" } } as any) : defaultSort;
      const projection = q ? ({ score: { $meta: "textScore" } } as any) : undefined;

      const [total, items] = await Promise.all([
        model.countDocuments(filter),
        model.find(filter, projection).sort(sort as any).skip(skip).limit(limit).lean(),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));
      res.json(
        ok(items, {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        })
      );
    },
    bySlug: async (req: Request, res: Response) => {
      const slug = req.params.slug;
      const item = await model.findOne({ slug, status: "published" }).lean();
      if (!item) throw new ApiError(404, "NOT_FOUND", "Conteudo nao encontrado.");
      res.json(ok(item));
    },
  };
}

export function buildAdminControllers<T extends AnyDoc>(
  model: Model<T>,
  defaultSort: Record<string, 1 | -1>,
  schemas: { create: (input: unknown) => any; update: (input: unknown) => any },
  options?: { label?: string }
) {
  return {
    list: async (req: Request, res: Response) => {
      const { page, limit, skip } = parsePagination(req.query);
      const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
      const tag = typeof req.query.tag === "string" ? req.query.tag.trim() : "";
      const personSlug = typeof req.query.personSlug === "string"
        ? req.query.personSlug.trim()
        : typeof req.query.person === "string"
          ? req.query.person.trim()
          : "";
      const fundKey = typeof req.query.fundKey === "string"
        ? req.query.fundKey.trim()
        : typeof req.query.fund === "string"
          ? req.query.fund.trim()
          : "";
      const status = typeof req.query.status === "string" ? req.query.status.trim() : "";
      const slug = typeof req.query.slug === "string" ? req.query.slug.trim() : "";
      const sortKey = typeof req.query.sort === "string" ? req.query.sort.trim() : "";
      const featured = typeof req.query.featured === "string" ? req.query.featured.trim() : "";

      const filter: Record<string, unknown> = {};
      const orFilters: Record<string, unknown>[] = [];
      if (personSlug) orFilters.push({ relatedPersonSlug: personSlug });
      if (fundKey) orFilters.push({ relatedFundKey: fundKey });
      if (tag) {
        if (orFilters.length) orFilters.push({ tags: tag });
        else filter.tags = tag;
      }
      if (orFilters.length) filter.$or = orFilters;
      if (slug) filter.slug = slug;
      if (status) filter.status = status;
      if (featured) {
        if (["1", "true", "yes"].includes(featured.toLowerCase())) filter.featured = true;
        if (["0", "false", "no"].includes(featured.toLowerCase())) filter.featured = false;
      }
      if (q) filter.$text = { $search: q };

      const sortMap: Record<string, Record<string, 1 | -1>> = {
        updated_desc: { updatedAt: -1, createdAt: -1 },
        updated_asc: { updatedAt: 1, createdAt: 1 },
        created_desc: { createdAt: -1 },
        created_asc: { createdAt: 1 },
        published_desc: { publishedAt: -1, updatedAt: -1 },
        published_asc: { publishedAt: 1, updatedAt: 1 },
        title_asc: { title: 1 },
        title_desc: { title: -1 },
        featured_desc: { featured: -1, updatedAt: -1 },
        featured_asc: { featured: 1, updatedAt: -1 },
        sortOrder_desc: { sortOrder: -1, updatedAt: -1 },
        sortOrder_asc: { sortOrder: 1, updatedAt: -1 },
      };

      const pickedSort = sortMap[sortKey] ?? defaultSort;
      const sort = q ? ({ score: { $meta: "textScore" } } as any) : pickedSort;
      const projection = q ? ({ score: { $meta: "textScore" } } as any) : undefined;

      const [total, items] = await Promise.all([
        model.countDocuments(filter),
        model.find(filter, projection).sort(sort as any).skip(skip).limit(limit).lean(),
      ]);

      const totalPages = Math.max(1, Math.ceil(total / limit));
      res.json(
        ok(items, {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        })
      );
    },
    create: async (req: Request, res: Response) => {
      const body = schemas.create(req.body);
      const desired = slugify(body.slug || body.title);
      const slug = await ensureUniqueSlug(model, desired, undefined, options?.label);
      const publishedAt = body.status === "published" ? new Date() : null;
      const created = await model.create({ ...body, slug, publishedAt });
      res.status(201).json(ok(created));
    },
    byId: async (req: Request, res: Response) => {
      const item = await model.findById(req.params.id).lean();
      if (!item) throw new ApiError(404, "NOT_FOUND", "Conteudo nao encontrado.");
      res.json(ok(item));
    },
    update: async (req: Request, res: Response) => {
      const body = schemas.update(req.body);
      const existing = await model.findById(req.params.id);
      if (!existing) throw new ApiError(404, "NOT_FOUND", "Conteudo nao encontrado.");

      if (body.slug || body.title) {
        const desired = slugify(body.slug || (body.title as string));
        body.slug = await ensureUniqueSlug(model, desired, String(existing._id), options?.label);
      }

      Object.assign(existing, body);
      if (existing.status === "published" && !existing.publishedAt) {
        existing.publishedAt = new Date();
      }
      const saved = await existing.save();
      res.json(ok(saved));
    },
    remove: async (req: Request, res: Response) => {
      const deleted = await model.findByIdAndDelete(req.params.id).lean();
      if (!deleted) throw new ApiError(404, "NOT_FOUND", "Conteudo nao encontrado.");
      res.json(ok({ id: req.params.id }));
    },
    updateStatus: async (req: Request, res: Response) => {
      const status = req.body?.status as ContentStatus | undefined;
      if (!status || !["draft", "published", "archived"].includes(status)) {
        throw new ApiError(422, "VALIDATION_ERROR", "Status invalido.", {
          fieldErrors: { status: "Status invalido." },
        });
      }
      const existing = await model.findById(req.params.id);
      if (!existing) throw new ApiError(404, "NOT_FOUND", "Conteudo nao encontrado.");
      existing.status = status;
      existing.publishedAt = status === "published" ? existing.publishedAt ?? new Date() : existing.publishedAt;
      const saved = await existing.save();
      res.json(ok(saved));
    },
  };
}
