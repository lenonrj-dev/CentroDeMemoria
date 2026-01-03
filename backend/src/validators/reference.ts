import { z } from "zod";
import { UrlSchema } from "../utils/url";

const AttachmentSchema = z.object({
  type: z.enum(["pdf", "image", "link"]),
  url: UrlSchema,
  label: z.string().optional(),
});

export const ReferenceCreateSchema = z.object({
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
  citation: z.string().min(1),
  authors: z.array(z.string()).optional(),
  year: z.number().int(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  externalUrl: UrlSchema.optional(),
  attachments: z.array(AttachmentSchema).optional(),
});

export const ReferenceUpdateSchema = ReferenceCreateSchema.partial();
