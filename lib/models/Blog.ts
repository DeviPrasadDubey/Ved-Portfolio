import mongoose, { Schema, model, models } from "mongoose";

export interface IBlog {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  category?: string;
  readTime?: string;
  themeColor?: string;
  featured?: boolean;
  publishedAt?: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: [{ type: String }],
    category: String,
    readTime: String,
    themeColor: String,
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Blog =
  (models.Blog as mongoose.Model<IBlog>) ?? model<IBlog>("Blog", BlogSchema);
