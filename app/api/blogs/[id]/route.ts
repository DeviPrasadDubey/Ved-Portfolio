import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Blog } from "@/lib/models/Blog";

type Params = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const blog = await Blog.findById(id).lean();
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
