"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Status = "idle" | "sending" | "sent" | "error";

/* ─── 3D tilt card ────────────────────────────────────────────────────── */
function TiltCard({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const [rot, setRot] = useState({ x: 0, y: 0 });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    setRot({
      x: ((e.clientY - r.top) / r.height - 0.5) * -14,
      y: ((e.clientX - r.left) / r.width - 0.5) * 18,
    });
  }

  return (
    <div style={{ perspective: 1200 }} onMouseMove={onMouseMove} onMouseLeave={() => setRot({ x: 0, y: 0 })}>
      <motion.div
        animate={reduce ? {} : { rotateX: rot.x, rotateY: rot.y }}
        transition={{ type: "spring", stiffness: 220, damping: 28 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    company: "",
  });
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setFeedback("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setFeedback("Message sent successfully.");
        setForm({ name: "", email: "", message: "", company: "" });
        return;
      }

      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setStatus("error");
      setFeedback(data?.error || "Unable to send message right now. Please try again.");
    } catch {
      setStatus("error");
      setFeedback("Unable to send message right now. Please try again.");
    }
  }

  const inputCls =
    "w-full border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground/90 placeholder:text-muted/35 outline-none transition-colors focus:border-accent/40";

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-background py-16 md:py-32"
    >
      {/* gold ambient */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
        style={{
          width: 500,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* left copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6">
              <SectionHeading title="Let's Connect." />
            </div>
            <p className="mb-10 max-w-sm text-sm leading-relaxed text-muted/65">
              Open to senior quality leadership, regional director, and sourcing
              operations roles globally. Reach out for collaborations, consulting,
              or just a conversation about the supply chain.
            </p>

            <div className="space-y-4">
              {[
                ["Email", "vedtdp@gmail.com"],
                ["Location", "India"],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <p className="w-28 shrink-0 text-[9px] uppercase tracking-[0.38em] text-muted/40 pt-0.5">
                    {label}
                  </p>
                  <p className="text-sm text-foreground/75">{value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* right — 3D tilt form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard>
              <div
                className="relative overflow-hidden border border-white/[0.07] p-5 md:p-10"
                style={{
                  background: "#080808",
                  boxShadow:
                    "0 32px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08)",
                }}
              >
                {/* ambient */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.06), transparent 65%)",
                  }}
                />

                {status === "sent" ? (
                  <motion.div
                    className="relative flex flex-col items-center justify-center py-12 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <div className="mb-4 h-px w-12 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
                    <p className="font-serif text-xl font-semibold text-accent md:text-2xl">
                      Message sent.
                    </p>
                    <p className="mt-2 text-sm text-muted/55">
                      I&apos;ll get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="relative space-y-4">
                    <input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      aria-hidden="true"
                    />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      className={inputCls + " min-h-11"}
                    />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      className={inputCls + " min-h-11"}
                    />
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={5}
                      required
                      className={inputCls + " resize-none min-h-32"}
                    />

                    <p className="text-xs text-muted/65">
                      Your information is only used to respond to your message and
                      is not shared.
                    </p>

                    {status === "error" && (
                      <p className="text-xs text-red-400/80">
                        {feedback || "Unable to send message right now. Please try again."}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full border border-accent/35 py-3.5 text-[10px] uppercase tracking-[0.3em] text-accent/85 transition-colors duration-200 hover:border-accent/65 hover:bg-accent/[0.06] disabled:opacity-50 md:tracking-[0.45em]"
                    >
                      {status === "sending" ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                )}
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
