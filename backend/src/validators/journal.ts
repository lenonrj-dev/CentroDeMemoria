import { z } from "zod";
import { UrlSchema } from "../utils/url";

const PageSchema = z.object({
  pageNumber: z.number().int().min(1),
  imageUrl: UrlSchema,
  thumbUrl: UrlSchema.optional(),
});

export const JournalCreateSchema = z.object({
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
  issueDate: z.coerce.date(),
  edition: z.string().optional(),
  city: z.string().optional(),
  pdfUrl: UrlSchema.optional(),
  pages: z.array(PageSchema).optional(),
  pagesCount: z.number().int().optional(),
});

export const JournalUpdateSchema = JournalCreateSchema.partial();
