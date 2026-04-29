import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/models/Blog";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({})
      .sort({ publishedAt: -1 })
      .lean();
    return NextResponse.json(blogs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, excerpt, content, category, readTime, themeColor, featured } = body;

    if (!title || !excerpt) {
      return NextResponse.json(
        { error: "title and excerpt are required" },
        { status: 400 },
      );
    }

    const slug = slugify(title) + "-" + Date.now();
    const blog = await Blog.create({
      slug,
      title,
      excerpt,
      content: Array.isArray(content)
        ? content
        : String(content)
            .split("\n\n")
            .filter(Boolean),
      category,
      readTime,
      themeColor,
      featured: Boolean(featured),
      publishedAt: new Date(),
    });

    return NextResponse.json(blog, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
