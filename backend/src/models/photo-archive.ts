import mongoose, { Schema } from "mongoose";
import type { BaseContentFields } from "./common";

export type PhotoEntry = { imageUrl: string; caption?: string; date?: string; location?: string };

export type PhotoArchiveContent = BaseContentFields & {
  photos: PhotoEntry[];
  photographer?: string;
  collection?: string;
};

const PhotoSchema = new Schema<PhotoEntry>(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String },
    date: { type: String },
    location: { type: String },
  },
  { _id: false }
);

const PhotoArchiveSchema = new Schema<PhotoArchiveContent>(
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
    photos: { type: [PhotoSchema], default: [] },
    photographer: { type: String },
    collection: { type: String, index: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

PhotoArchiveSchema.index({ title: "text", description: "text" });

export const PhotoArchiveModel =
  mongoose.models.PhotoArchive || mongoose.model<PhotoArchiveContent>("PhotoArchive", PhotoArchiveSchema);
