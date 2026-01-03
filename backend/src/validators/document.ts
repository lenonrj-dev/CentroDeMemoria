import { z } from "zod";
import { UrlSchema } from "../utils/url";

export const DocumentCreateSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  coverImageUrl: UrlSchema,
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  relatedPersonSlug: z.string().optional(),
  relatedFundKey: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  documentType: z.enum(["pdf", "image", "mixed"]),
  fileUrl: UrlSchema.optional().nullable(),
  images: z.array(UrlSchema).optional(),
  source: z.string().optional(),
  collection: z.string().optional(),
  year: z.number().int().optional(),
  authors: z.array(z.string()).optional(),
});

export const DocumentUpdateSchema = DocumentCreateSchema.partial();
