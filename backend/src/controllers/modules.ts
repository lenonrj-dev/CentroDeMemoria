import { buildAdminControllers, buildPublicControllers } from "./factory";
import { DocumentModel } from "../models/document";
import { TestimonialModel } from "../models/testimonial";
import { ReferenceModel } from "../models/reference";
import { JournalModel } from "../models/journal";
import { PhotoArchiveModel } from "../models/photo-archive";
import { PersonalArchiveModel } from "../models/personal-archive";
import { DocumentCreateSchema, DocumentUpdateSchema } from "../validators/document";
import { TestimonialCreateSchema, TestimonialUpdateSchema } from "../validators/testimonial";
import { ReferenceCreateSchema, ReferenceUpdateSchema } from "../validators/reference";
import { JournalCreateSchema, JournalUpdateSchema } from "../validators/journal";
import { PhotoArchiveCreateSchema, PhotoArchiveUpdateSchema } from "../validators/photo-archive";
import { PersonalArchiveCreateSchema, PersonalArchiveUpdateSchema } from "../validators/personal-archive";

const publishedSort = { sortOrder: -1 as const, publishedAt: -1 as const, createdAt: -1 as const };

export const documentsPublic = buildPublicControllers(DocumentModel as any, publishedSort);
export const testimonialsPublic = buildPublicControllers(TestimonialModel as any, publishedSort);
export const referencesPublic = buildPublicControllers(ReferenceModel as any, { year: -1 as const, ...publishedSort });
export const journalsPublic = buildPublicControllers(JournalModel as any, { issueDate: -1 as const, ...publishedSort });
export const photosPublic = buildPublicControllers(PhotoArchiveModel as any, publishedSort);
export const personalArchivesPublic = buildPublicControllers(PersonalArchiveModel as any, publishedSort);

export const documentsAdmin = buildAdminControllers(
  DocumentModel as any,
  { updatedAt: -1 as const },
  {
    create: (input) => DocumentCreateSchema.parse(input),
    update: (input) => DocumentUpdateSchema.parse(input),
  },
  { label: "documento" }
);

export const testimonialsAdmin = buildAdminControllers(
  TestimonialModel as any,
  { updatedAt: -1 as const },
  {
    create: (input) => TestimonialCreateSchema.parse(input),
    update: (input) => TestimonialUpdateSchema.parse(input),
  },
  { label: "depoimento" }
);

export const referencesAdmin = buildAdminControllers(
  ReferenceModel as any,
  { updatedAt: -1 as const },
  {
    create: (input) => ReferenceCreateSchema.parse(input),
    update: (input) => ReferenceUpdateSchema.parse(input),
  },
  { label: "referencia" }
);

export const journalsAdmin = buildAdminControllers(
  JournalModel as any,
  { updatedAt: -1 as const },
  {
    create: (input) => JournalCreateSchema.parse(input),
    update: (input) => JournalUpdateSchema.parse(input),
  },
  { label: "jornal" }
);

export const photosAdmin = buildAdminControllers(
  PhotoArchiveModel as any,
  { updatedAt: -1 as const },
  {
    create: (input) => PhotoArchiveCreateSchema.parse(input),
    update: (input) => PhotoArchiveUpdateSchema.parse(input),
  },
  { label: "acervo fotografico" }
);

export const personalArchivesAdmin = buildAdminControllers(
  PersonalArchiveModel as any,
  { updatedAt: -1 as const },
  {
    create: (input) => PersonalArchiveCreateSchema.parse(input),
    update: (input) => PersonalArchiveUpdateSchema.parse(input),
  },
  { label: "acervo pessoal" }
);
