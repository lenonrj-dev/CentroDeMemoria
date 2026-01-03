import mongoose, { Schema } from "mongoose";
import type { BaseContentFields } from "./common";
import type { Attachment } from "./testimonial";

export type ReferenceContent = BaseContentFields & {
  citation: string;
  authors: string[];
  year: number;
  publisher?: string;
  isbn?: string;
  externalUrl?: string;
  attachments?: Attachment[];
};

const AttachmentSchema = new Schema<Attachment>(
  {
    type: { type: String, enum: ["pdf", "image", "link"], required: true },
    url: { type: String, required: true },
    label: { type: String },
  },
  { _id: false }
);

const ReferenceSchema = new Schema<ReferenceContent>(
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
    citation: { type: String, required: true, trim: true },
    authors: { type: [String], default: [], index: true },
    year: { type: Number, required: true, index: true },
    publisher: { type: String },
    isbn: { type: String },
    externalUrl: { type: String },
    attachments: { type: [AttachmentSchema], default: [] },
  },
  { timestamps: true }
);

ReferenceSchema.index({ title: "text", description: "text", citation: "text" });

export const ReferenceModel =
  mongoose.models.Reference || mongoose.model<ReferenceContent>("Reference", ReferenceSchema);
