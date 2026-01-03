import mongoose, { Schema } from "mongoose";
import type { BaseContentFields } from "./common";

export type AttachmentType = "pdf" | "image" | "link";
export type Attachment = { type: AttachmentType; url: string; label?: string };

export type MediaType = "youtube" | "image" | "text";

export type TestimonialContent = Omit<BaseContentFields, "coverImageUrl"> & {
  coverImageUrl?: string;
  authorName: string;
  authorRole?: string;
  testimonialText: string;
  attachments?: Attachment[];
  date?: string;
  location?: string;
  mediaType?: MediaType;
  youtubeId?: string;
  imageUrl?: string;
};

const AttachmentSchema = new Schema<Attachment>(
  {
    type: { type: String, enum: ["pdf", "image", "link"], required: true },
    url: { type: String, required: true },
    label: { type: String },
  },
  { _id: false }
);

const TestimonialSchema = new Schema<TestimonialContent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    coverImageUrl: { type: String, trim: true },
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft", index: true },
    tags: { type: [String], default: [], index: true },
    relatedPersonSlug: { type: String, index: true },
    relatedFundKey: { type: String, index: true },
    featured: { type: Boolean, default: false, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    publishedAt: { type: Date, default: null, index: true },
    authorName: { type: String, required: true, trim: true },
    authorRole: { type: String, trim: true },
    testimonialText: { type: String, required: true, trim: true },
    attachments: { type: [AttachmentSchema], default: [] },
    date: { type: String },
    location: { type: String },
    mediaType: { type: String, enum: ["youtube", "image", "text"], default: "image" },
    youtubeId: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

TestimonialSchema.index({ title: "text", description: "text", testimonialText: "text" });

export const TestimonialModel =
  mongoose.models.Testimonial || mongoose.model<TestimonialContent>("Testimonial", TestimonialSchema);
