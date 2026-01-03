import type { Request, Response } from "express";
import type { Model } from "mongoose";
import { DocumentModel } from "../models/document";
import { TestimonialModel } from "../models/testimonial";
import { ReferenceModel } from "../models/reference";
import { JournalModel } from "../models/journal";
import { PhotoArchiveModel } from "../models/photo-archive";
import { PersonalArchiveModel } from "../models/personal-archive";
import { ok } from "../utils/api-error";

type ContentStatus = "draft" | "published" | "archived";
type LegacyKey = "documentos" | "depoimentos" | "referencias" | "jornais" | "acervoFotografico" | "acervosPessoais";
type AdminModule = "documentos" | "depoimentos" | "referencias" | "jornais" | "acervo-fotografico" | "acervos-pessoais";

type ItemRef = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  updatedAt?: string;
  publishedAt?: string | null;
};

type CountRow = {
  key: LegacyKey;
  module: AdminModule;
  total: number;
  published: number;
  drafts: number;
  archived: number;
  lastUpdated: ItemRef | null;
  lastPublished: ItemRef | null;
};

type QualityBucket = {
  key: LegacyKey;
  module: AdminModule;
  count: number;
  items: ItemRef[];
};

function toItemRef(doc: any): ItemRef {
  return {
    id: String(doc._id),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    status: doc.status as ContentStatus,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : null,
  };
}

async function shortStringFieldBucket(
  model: Model<any>,
  maxLen: number,
  pick: { field: string; key: LegacyKey; module: AdminModule }
): Promise<QualityBucket> {
  const { field, key, module } = pick;

  const out = await model.aggregate([
    {
      $addFields: {
        __len: {
          $strLenCP: {
            $trim: {
              input: { $ifNull: [`$${field}`, ""] },
            },
          },
        },
      },
    },
    { $match: { __len: { $gt: 0, $lt: maxLen } } },
    {
      $facet: {
        items: [
          { $sort: { __len: 1, updatedAt: -1 } },
          { $limit: 12 },
          { $project: { _id: 1, title: 1, slug: 1, status: 1, updatedAt: 1, publishedAt: 1 } },
        ],
        meta: [{ $count: "count" }],
      },
    },
  ]);

  const first = out?.[0] as any;
  const count = Number(first?.meta?.[0]?.count ?? 0);
  const items = Array.isArray(first?.items) ? first.items.map(toItemRef) : [];
  return { key, module, count, items };
}

async function countAndSample(model: Model<any>, filter: any): Promise<{ count: number; items: ItemRef[] }> {
  const [count, sample] = await Promise.all([
    model.countDocuments(filter),
    model
      .find(filter)
      .select("_id title slug status updatedAt publishedAt")
      .sort({ updatedAt: -1 })
      .limit(12)
      .lean(),
  ]);
  return { count, items: sample.map(toItemRef) };
}

export async function adminOverview(_req: Request, res: Response) {
  const modules: Array<{ key: LegacyKey; module: AdminModule; model: Model<any> }> = [
    { key: "documentos", module: "documentos", model: DocumentModel as any },
    { key: "depoimentos", module: "depoimentos", model: TestimonialModel as any },
    { key: "referencias", module: "referencias", model: ReferenceModel as any },
    { key: "jornais", module: "jornais", model: JournalModel as any },
    { key: "acervoFotografico", module: "acervo-fotografico", model: PhotoArchiveModel as any },
    { key: "acervosPessoais", module: "acervos-pessoais", model: PersonalArchiveModel as any },
  ];

  const counts: CountRow[] = await Promise.all(
    modules.map(async ({ key, module, model }) => {
      const [total, published, drafts, archived, lastUpdated, lastPublished] = await Promise.all([
        model.countDocuments({}),
        model.countDocuments({ status: "published" }),
        model.countDocuments({ status: "draft" }),
        model.countDocuments({ status: "archived" }),
        model.findOne({}).select("_id title slug status updatedAt publishedAt").sort({ updatedAt: -1 }).lean(),
        model
          .findOne({ status: "published" })
          .select("_id title slug status updatedAt publishedAt")
          .sort({ publishedAt: -1, updatedAt: -1 })
          .lean(),
      ]);
      return {
        key,
        module,
        total,
        published,
        drafts,
        archived,
        lastUpdated: lastUpdated ? toItemRef(lastUpdated) : null,
        lastPublished: lastPublished ? toItemRef(lastPublished) : null,
      };
    })
  );

  const missingCover: QualityBucket[] = await Promise.all(
    modules.map(async ({ key, module, model }) => {
      const filter = { $or: [{ coverImageUrl: { $exists: false } }, { coverImageUrl: "" }] };
      const { count, items } = await countAndSample(model, filter);
      return { key, module, count, items };
    })
  );

  const shortDescriptions: QualityBucket[] = await Promise.all(
    modules.map(({ key, module, model }) => shortStringFieldBucket(model, 80, { field: "description", key, module }))
  );

  const documentsWithoutFileOrImages = await countAndSample(DocumentModel as any, {
    $and: [
      { $or: [{ fileUrl: { $exists: false } }, { fileUrl: "" }, { fileUrl: null }] },
      { $or: [{ images: { $size: 0 } }, { images: { $exists: false } }] },
    ],
  });

  const journalsWithoutPagesOrPdf = await countAndSample(JournalModel as any, {
    $and: [
      { $or: [{ pages: { $size: 0 } }, { pages: { $exists: false } }] },
      { $or: [{ pdfUrl: { $exists: false } }, { pdfUrl: "" }, { pdfUrl: null }] },
    ],
  });

  const photoArchivesWithFewPhotos = await (async () => {
    const out = await (PhotoArchiveModel as any).aggregate([
      { $addFields: { __photosCount: { $size: { $ifNull: ["$photos", []] } } } },
      { $match: { __photosCount: { $lt: 3 } } },
      {
        $facet: {
          items: [
            { $sort: { __photosCount: 1, updatedAt: -1 } },
            { $limit: 12 },
            { $project: { _id: 1, title: 1, slug: 1, status: 1, updatedAt: 1, publishedAt: 1 } },
          ],
          meta: [{ $count: "count" }],
        },
      },
    ]);
    const first = out?.[0] as any;
    const count = Number(first?.meta?.[0]?.count ?? 0);
    const items = Array.isArray(first?.items) ? first.items.map(toItemRef) : [];
    return { count, items };
  })();

  const referencesMissingYearOrCitation = await countAndSample(ReferenceModel as any, {
    $or: [
      { year: { $exists: false } },
      { year: null },
      { year: 0 },
      { citation: { $exists: false } },
      { citation: "" },
    ],
  });

  const testimonialsMissingAuthorOrShortText = await (async () => {
    const out = await (TestimonialModel as any).aggregate([
      {
        $addFields: {
          __authorLen: { $strLenCP: { $trim: { input: { $ifNull: ["$authorName", ""] } } } },
          __textLen: { $strLenCP: { $trim: { input: { $ifNull: ["$testimonialText", ""] } } } },
        },
      },
      { $match: { $or: [{ __authorLen: { $lt: 1 } }, { __textLen: { $lt: 80 } }] } },
      {
        $facet: {
          items: [
            { $sort: { __authorLen: 1, __textLen: 1, updatedAt: -1 } },
            { $limit: 12 },
            { $project: { _id: 1, title: 1, slug: 1, status: 1, updatedAt: 1, publishedAt: 1 } },
          ],
          meta: [{ $count: "count" }],
        },
      },
    ]);
    const first = out?.[0] as any;
    const count = Number(first?.meta?.[0]?.count ?? 0);
    const items = Array.isArray(first?.items) ? first.items.map(toItemRef) : [];
    return { count, items };
  })();

  res.json(ok({
    success: true,
    data: {
      counts,
      alerts: {
        missingCover: missingCover.map((x) => ({ key: x.key, count: x.count })),
        shortDescriptions: shortDescriptions.map((x) => ({ key: x.key, count: x.count })),
        documentsWithoutFileOrImages: documentsWithoutFileOrImages.count,
        journalsWithoutPagesOrPdf: journalsWithoutPagesOrPdf.count,
        photoArchivesWithFewPhotos: photoArchivesWithFewPhotos.count,
        referencesMissingYearOrCitation: referencesMissingYearOrCitation.count,
        testimonialsMissingAuthorOrShortText: testimonialsMissingAuthorOrShortText.count,
      },
      quality: {
        missingCover,
        shortDescriptions,
        documentsWithoutFileOrImages,
        journalsWithoutPagesOrPdf,
        photoArchivesWithFewPhotos,
        referencesMissingYearOrCitation,
        testimonialsMissingAuthorOrShortText,
      },
      suggestions: [
        "Adicione 10 jornais com 6–12 páginas cada",
        "Adicione 20 fotos no acervo com legenda",
        "Adicione 15 documentos (PDF) com descrição completa",
        "Adicione 10 depoimentos com anexos quando houver",
        "Adicione 20 referências com ano e citação",
      ],
    },
  }));
}

