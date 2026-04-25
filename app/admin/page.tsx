"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const ADMIN_KEY =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_ADMIN_KEY ?? "vedadmin2025"
    : "vedadmin2025";

type PostState = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-lg border border-white/[0.1] bg-white/[0.04] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted/40 transition-all duration-300 focus:border-[color:color-mix(in_srgb,var(--glow-validate-ok)50%,white_0%)] focus:outline-none focus:ring-2 focus:ring-[color:color-mix(in_srgb,var(--glow-validate-ok)30%,transparent)]";

export default function AdminPage() {
  const router = useRouter();
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    readTime: "",
    themeColor: "#c9a44c",
    featured: false,
  });
  const [postState, setPostState] = useState<PostState>("idle");

  const unlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_KEY) {
      setUnlocked(true);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 1800);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) return;
    setPostState("submitting");
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          content: form.content,
          featured: form.featured,
        }),
      });
      if (res.ok) {
        setPostState("success");
        setTimeout(() => router.push("/blogs"), 1500);
      } else {
        setPostState("error");
      }
    } catch {
      setPostState("error");
    }
  };

  if (!unlocked) {
    return (
      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <p className="mb-1 text-center text-[10px] uppercase tracking-[0.5em] text-muted/45">
            Admin · Bento
          </p>
          <h1 className="mb-2 text-center font-serif text-3xl font-semibold text-foreground/90">
            Content studio
          </h1>
          <p className="mb-8 text-center text-xs text-muted/60">
            Single surface — no floating card stack
          </p>
          <form
            onSubmit={unlock}
            className="grid gap-4 overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-8 shadow-[0_0_0_1px_rgba(201,164,76,0.12),0_30px_80px_-20px_rgba(0,0,0,0.55)]"
          >
            <label
              htmlFor="pwd"
              className="text-[9px] uppercase tracking-[0.35em] text-muted/55"
            >
              Passphrase
            </label>
            <input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter key"
              className={`${inputClass} ${passwordError ? "border-red-500/50" : ""}`}
              autoComplete="current-password"
            />
            {passwordError && (
              <p className="text-xs text-red-400">Incorrect.</p>
            )}
            <button
              type="submit"
              className="w-full rounded-full py-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-background transition hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #d4af37 0%, #8a6a1a 100%)",
              }}
            >
              Unlock
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative z-10 min-h-screen px-4 pb-20 pt-24 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.5em] text-muted/50">
              Dashboard
            </p>
            <h1 className="mt-1 font-serif text-3xl text-foreground/90 md:text-4xl">
              Essay composer
            </h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/blogs")}
            className="text-[10px] uppercase tracking-[0.28em] text-muted/55 transition hover:text-foreground"
          >
            View essays →
          </button>
        </div>

        {postState === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[color:var(--glow-success-gold)]/40 bg-white/[0.04] p-12 text-center"
          >
            <p className="font-serif text-xl text-foreground/90">Published.</p>
            <p className="mt-2 text-sm text-muted/60">Redirecting…</p>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-6 md:grid-rows-[auto_1fr]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:col-span-3">
              {[
                { k: "11+", v: "Years in copy" },
                { k: "4", v: "Blogs (seed)" },
                { k: "1", v: "Featured slot" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-transparent p-4"
                >
                  <p className="font-serif text-2xl text-accent md:text-3xl">
                    {s.k}
                  </p>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-muted/50">
                    {s.v}
                  </p>
                </div>
              ))}
            </div>
            <aside className="md:col-span-3">
              <div
                className="h-full rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-5 text-sm leading-relaxed text-muted/65"
              >
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted/50">
                  Notes
                </p>
                <p className="mt-3">
                  Use blank lines in the body to split paragraphs. Theme
                  color flows to the public essay header when the post is live.
                </p>
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              className="md:col-span-6 grid grid-cols-1 gap-5 md:grid-cols-2"
            >
              <div className="md:col-span-2 rounded-xl border border-white/[0.1] bg-white/[0.02] p-5 md:p-6">
                <h2 className="mb-4 text-[9px] uppercase tracking-[0.4em] text-muted/50">
                  Metadata
                </h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[9px] uppercase tracking-[0.25em] text-muted/50">
                      Title *
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="Essay title"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[9px] uppercase tracking-[0.25em] text-muted/50">
                      Category
                    </label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="mb-1.5 block text-[9px] uppercase tracking-[0.25em] text-muted/50">
                    Excerpt *
                  </label>
                  <textarea
                    name="excerpt"
                    rows={2}
                    value={form.excerpt}
                    onChange={handleChange}
                    className={`${inputClass} resize-y`}
                    required
                  />
                </div>
              </div>

              <div className="md:col-span-2 rounded-xl border border-white/[0.1] bg-white/[0.02] p-5 md:col-span-2 md:row-span-1 md:p-6">
                <h2 className="mb-4 text-[9px] uppercase tracking-[0.4em] text-muted/50">
                  Body
                </h2>
                <textarea
                  name="content"
                  rows={16}
                  value={form.content}
                  onChange={handleChange}
                  className={`${inputClass} min-h-[280px] w-full font-mono text-xs leading-relaxed md:text-sm`}
                  placeholder="Paragraphs separated by a blank line…"
                  required
                />
              </div>

              <div className="md:col-span-2 grid gap-3 rounded-xl border border-white/[0.1] bg-white/[0.02] p-5 md:grid-cols-2 md:p-6">
                <div>
                  <label className="mb-1.5 block text-[9px] uppercase tracking-[0.25em] text-muted/50">
                    Read time
                  </label>
                  <input
                    name="readTime"
                    value={form.readTime}
                    onChange={handleChange}
                    placeholder="6 min read"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[9px] uppercase tracking-[0.25em] text-muted/50">
                    Theme
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      name="themeColor"
                      type="color"
                      value={form.themeColor}
                      onChange={handleChange}
                      className="h-10 w-12 cursor-pointer rounded border border-white/[0.1] bg-transparent p-0.5"
                    />
                    <input
                      name="themeColor"
                      type="text"
                      value={form.themeColor}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, featured: e.target.checked }))
                      }
                      className="h-4 w-4 accent-accent"
                    />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted/60">
                      Featured
                    </span>
                  </label>
                </div>
              </div>

              {postState === "error" && (
                <p className="md:col-span-2 text-sm text-red-400">
                  Publish failed. Check API / Mongo and retry.
                </p>
              )}

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={postState === "submitting"}
                  className="w-full rounded-full border border-white/[0.1] py-3.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-background transition enabled:hover:opacity-90 disabled:opacity-50"
                  style={{
                    background:
                      "linear-gradient(125deg, #c9a44c 0%, #5a4518 45%, #d4af37 100%)",
                  }}
                >
                  {postState === "submitting" ? "Publishing…" : "Publish essay"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
