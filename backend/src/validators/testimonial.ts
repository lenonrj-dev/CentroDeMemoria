import { z } from "zod";
import { UrlSchema } from "../utils/url";
import { extractYoutubeId } from "../utils/youtube";

const AttachmentSchema = z.object({
  type: z.enum(["pdf", "image", "link"]),
  url: UrlSchema,
  label: z.string().optional(),
});

const MediaTypeSchema = z.enum(["youtube", "image", "text"]);

const TestimonialInputSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().min(1),
  coverImageUrl: UrlSchema.optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  tags: z.array(z.string()).optional(),
  relatedPersonSlug: z.string().optional(),
  relatedFundKey: z.string().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  authorName: z.string().min(1),
  authorRole: z.string().optional(),
  testimonialText: z.string().min(1),
  attachments: z.array(AttachmentSchema).optional(),
  date: z.string().optional(),
  location: z.string().optional(),
  mediaType: MediaTypeSchema.optional(),
  youtubeId: z.string().optional(),
  youtubeUrl: z.string().optional(),
  imageUrl: UrlSchema.optional(),
});

function inferMediaType(data: {
  mediaType?: string;
  youtubeId?: string;
  youtubeUrl?: string;
  imageUrl?: string;
  coverImageUrl?: string;
  testimonialText?: string;
}) {
  if (data.mediaType) return data.mediaType;
  if (data.youtubeId || data.youtubeUrl) return "youtube";
  if (data.imageUrl || data.coverImageUrl) return "image";
  if (data.testimonialText) return "text";
  return undefined;
}

function resolveYoutubeId(data: { youtubeId?: string; youtubeUrl?: string }) {
  return extractYoutubeId(data.youtubeId || data.youtubeUrl || "");
}

export const TestimonialCreateSchema = TestimonialInputSchema.superRefine((data, ctx) => {
  const mediaType = inferMediaType(data) || "text";

  if (mediaType === "youtube") {
    const id = resolveYoutubeId(data);
    if (!id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["youtubeUrl"],
        message: "Link do YouTube invalido. Cole uma URL valida.",
      });
    }
  }

  if (mediaType === "image" && !data.imageUrl && !data.coverImageUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["imageUrl"],
      message: "Informe uma imagem valida para o depoimento.",
    });
  }

  if (mediaType === "text" && !data.testimonialText?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["testimonialText"],
      message: "Informe o texto do depoimento.",
    });
  }
}).transform((data) => {
  const mediaType = inferMediaType(data) || "text";
  const youtubeId = mediaType === "youtube" ? resolveYoutubeId(data) : data.youtubeId;
  const { youtubeUrl, ...rest } = data;
  return {
    ...rest,
    mediaType,
    youtubeId: youtubeId || undefined,
  };
});

export const TestimonialUpdateSchema = TestimonialInputSchema.partial().superRefine((data, ctx) => {
  const mediaType = inferMediaType(data as any);
  if (!mediaType) return;

  if (mediaType === "youtube") {
    const id = resolveYoutubeId(data as any);
    if (!id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["youtubeUrl"],
        message: "Link do YouTube invalido. Cole uma URL valida.",
      });
    }
  }

  if (mediaType === "image" && !data.imageUrl && !data.coverImageUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["imageUrl"],
      message: "Informe uma imagem valida para o depoimento.",
    });
  }

  if (mediaType === "text" && data.testimonialText != null && !data.testimonialText.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["testimonialText"],
      message: "Informe o texto do depoimento.",
    });
  }
}).transform((data) => {
  const mediaType = inferMediaType(data as any);
  const youtubeId = mediaType === "youtube" ? resolveYoutubeId(data as any) : data.youtubeId;
  const { youtubeUrl, ...rest } = data as any;
  return {
    ...rest,
    ...(mediaType ? { mediaType } : null),
    ...(youtubeId ? { youtubeId } : null),
  };
});
