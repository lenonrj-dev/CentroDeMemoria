import mongoose, { Schema } from "mongoose";
import type { BaseContentFields } from "./common";

export type JournalPage = { pageNumber: number; imageUrl: string; thumbUrl?: string };

export type JournalContent = BaseContentFields & {
  issueDate: Date;
  edition?: string;
  city?: string;
  pdfUrl?: string;
  pages: JournalPage[];
  pagesCount?: number;
};

const PageSchema = new Schema<JournalPage>(
  {
    pageNumber: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    thumbUrl: { type: String },
  },
  { _id: false }
);

const JournalSchema = new Schema<JournalContent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    coverImageUrl: { type: String, required: true, trim: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    tags: { type: [String], default: [], index: true },
    relatedPersonSlug: { type: String, index: true },
    relatedFundKey: { type: String, index: true },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    publishedAt: { type: Date, default: null, index: true },
    issueDate: { type: Date, required: true, index: true },
    edition: { type: String },
    city: { type: String, index: true },
    pdfUrl: { type: String },
    pages: { type: [PageSchema], default: [] },
    pagesCount: { type: Number },
  },
  { timestamps: true }
);

JournalSchema.index({ title: "text", description: "text" });

export const JournalModel = mongoose.models.Journal || mongoose.model<JournalContent>("Journal", JournalSchema);
