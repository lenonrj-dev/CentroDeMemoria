import mongoose, { Schema } from "mongoose";
import type { BaseContentFields } from "./common";

export type DocumentType = "pdf" | "image" | "mixed";

export type DocumentContent = BaseContentFields & {
  documentType: DocumentType;
  fileUrl?: string | null;
  images?: string[];
  source?: string;
  collection?: string;
  year?: number;
  authors?: string[];
};

const DocumentSchema = new Schema<DocumentContent>(
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
    documentType: { type: String, enum: ["pdf", "image", "mixed"], required: true },
    fileUrl: { type: String, default: null },
    images: { type: [String], default: [] },
    source: { type: String },
    collection: { type: String, index: true },
    year: { type: Number, index: true },
    authors: { type: [String], default: [] },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

DocumentSchema.index({ title: "text", description: "text" });

export const DocumentModel = mongoose.models.Document || mongoose.model<DocumentContent>("Document", DocumentSchema);
