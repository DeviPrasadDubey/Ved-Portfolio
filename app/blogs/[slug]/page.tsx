import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/app/blog/data";
import Link from "next/link";
import { ThemeColorApplier } from "./ThemeColorApplier";

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  if (process.env.MONGODB_URI) {
    try {
      const { connectDB } = await import("@/lib/db");
      const { Blog } = await import("@/lib/models/Blog");
      await connectDB();
      const doc = await Blog.findOne({ slug }).lean();
      if (doc) {
        return {
          title: doc.title,
          excerpt: doc.excerpt,
          content: doc.content,
          category: doc.category,
          readTime: doc.readTime,
          themeColor: doc.themeColor,
          publishedAt: doc.publishedAt?.toString(),
        };
      }
    } catch {
      /* fall through */
    }
  }

  const staticPost = getBlogPost(slug);
  if (!staticPost) return null;
  return {
    title: staticPost.title,
    excerpt: staticPost.excerpt,
    content: staticPost.content,
    category: staticPost.category,
    readTime: staticPost.readTime,
    themeColor: staticPost.themeColor,
    publishedAt: staticPost.publishedAt,
  };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogSlugPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const dateStr = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(post.publishedAt))
    : null;

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-28">
      {/* Dynamically updates --color-accent and --cursor-glow CSS vars */}
      <ThemeColorApplier color={post.themeColor} />

      <div className="mx-auto max-w-3xl">
        <Link
          href="/blogs"
          className="mb-10 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted/50 transition-colors hover:text-accent"
        >
          ← All essays
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.35em] text-muted/40">
          {post.category && <span>{post.category}</span>}
          {dateStr && <span>{dateStr}</span>}
          {post.readTime && <span>{post.readTime}</span>}
        </div>

        <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <p className="mt-5 text-base italic text-muted/70 md:text-lg">
          {post.excerpt}
        </p>

        <div className="mt-10 space-y-6 rounded-2xl border border-white/[0.08] bg-black/40 p-8 backdrop-blur-md">
          {post.content.map((paragraph: string, i: number) => (
            <p key={i} className="text-[15px] leading-[1.9] text-zinc-300">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Dynamic accent bar */}
        <div
          className="mt-10 h-[2px] rounded-full opacity-30"
          style={{ background: post.themeColor ?? "var(--color-accent)" }}
        />

        <div className="mt-12 border-t border-white/[0.06] pt-8 text-center">
          <Link
            href="/blogs"
            className="rounded-full border border-accent/40 px-7 py-3 text-xs font-semibold uppercase tracking-widest text-accent transition hover:bg-accent hover:text-background"
          >
            More essays
          </Link>
        </div>
      </div>
    </main>
  );
}
