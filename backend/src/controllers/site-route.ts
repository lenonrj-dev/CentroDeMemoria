import type { Request, Response } from "express";
import { SiteRouteModel } from "../models/site-route";
import { SiteRouteCreateSchema, SiteRouteUpdateSchema } from "../validators/site-route";
import { ApiError, ok } from "../utils/api-error";

async function ensureUniqueRoute(routePath: string, excludeId?: string) {
  const exists = await SiteRouteModel.exists(
    excludeId ? { routePath, _id: { $ne: excludeId } } : { routePath }
  );
  if (exists) {
    throw new ApiError(409, "CONFLICT", "Ja existe uma rota com esse caminho.", {
      fieldErrors: { routePath: "Rota ja cadastrada." },
    });
  }
}

export async function listSiteRoutes(_req: Request, res: Response) {
  const items = await SiteRouteModel.find({}).sort({ routePath: 1 }).lean();
  res.json(ok(items));
}

export async function createSiteRoute(req: Request, res: Response) {
  const body = SiteRouteCreateSchema.parse(req.body);
  await ensureUniqueRoute(body.routePath);
  const created = await SiteRouteModel.create(body);
  res.status(201).json(ok(created));
}

export async function updateSiteRoute(req: Request, res: Response) {
  const body = SiteRouteUpdateSchema.parse(req.body);
  const existing = await SiteRouteModel.findById(req.params.id);
  if (!existing) throw new ApiError(404, "NOT_FOUND", "Rota nao encontrada.");
  if (body.routePath && body.routePath !== existing.routePath) {
    await ensureUniqueRoute(body.routePath, String(existing._id));
  }
  Object.assign(existing, body);
  const saved = await existing.save();
  res.json(ok(saved));
}

export async function removeSiteRoute(req: Request, res: Response) {
  const deleted = await SiteRouteModel.findByIdAndDelete(req.params.id).lean();
  if (!deleted) throw new ApiError(404, "NOT_FOUND", "Rota nao encontrada.");
  res.json(ok({ id: req.params.id }));
}
