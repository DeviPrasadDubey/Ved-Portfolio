import { blogPosts } from "@/app/blog/data";
import { BlogCard } from "@/components/ui/BlogCard";
import type { IBlog } from "@/lib/models/Blog";

async function getDynamicPosts(): Promise<IBlog[]> {
  if (!process.env.MONGODB_URI) return [];
  try {
    const { connectDB } = await import("@/lib/db");
    const { Blog } = await import("@/lib/models/Blog");
    await connectDB();
    return Blog.find({}).sort({ publishedAt: -1 }).lean<IBlog[]>();
  } catch {
    return [];
  }
}

export default async function BlogsPage() {
  const dynamic = await getDynamicPosts();
  const dynamicSlugs = new Set(dynamic.map((d) => d.slug));
  const staticFiltered = blogPosts.filter((p) => !dynamicSlugs.has(p.slug));
  const allPosts = [
    ...dynamic.map((d) => ({
      slug: d.slug,
      title: d.title,
      excerpt: d.excerpt,
      category: d.category,
      readTime: d.readTime,
      publishedAt: d.publishedAt?.toString(),
      themeColor: d.themeColor,
      featured: d.featured,
    })),
    ...staticFiltered.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      readTime: p.readTime,
      publishedAt: p.publishedAt,
      themeColor: p.themeColor,
      featured: p.featured,
    })),
  ];

  const featured = allPosts.filter((p) => p.featured);
  const rest = allPosts.filter((p) => !p.featured);

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-3 text-[10px] uppercase tracking-[0.5em] text-muted/40">
            Essays &amp; Thinking
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-tight text-foreground/90 md:text-6xl">
            Quality in Writing
          </h1>
          <p className="mt-4 max-w-lg text-base italic text-muted/60">
            Perspectives on supply chain, textile science, and the discipline
            behind consistent quality at scale.
          </p>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <section className="mb-16">
            <p className="mb-6 text-[9px] uppercase tracking-[0.4em] text-muted/40">
              Featured Essays
            </p>
            <div className="grid gap-6 md:grid-cols-2">
              {featured.map((p) => (
                <BlogCard key={p.slug} {...p} />
              ))}
            </div>
          </section>
        )}

        {/* All posts */}
        {rest.length > 0 && (
          <section>
            <p className="mb-6 text-[9px] uppercase tracking-[0.4em] text-muted/40">
              All Essays
            </p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <BlogCard key={p.slug} {...p} />
              ))}
            </div>
          </section>
        )}

        {allPosts.length === 0 && (
          <p className="text-sm text-muted/50">No essays yet.</p>
        )}
      </div>
    </main>
  );
}
