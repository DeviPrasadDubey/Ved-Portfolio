"use client";
import { useRef, useState, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

type FormState = "idle" | "submitting" | "success" | "error";

const emailValid = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export function ContactForm() {
  const cardRef = useRef<HTMLFormElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    damping: 30,
    stiffness: 180,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    damping: 30,
    stiffness: 180,
  });

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<FormState>("idle");
  const [touched, setTouched] = useState(false);

  const { isFormValid, hireIntent, hasAny } = useMemo(() => {
    const nameOk = form.name.trim().length >= 2;
    const msgOk = form.message.trim().length >= 6;
    const eOk = emailValid(form.email);
    return {
      isFormValid: nameOk && eOk && msgOk,
      hireIntent: /hire/i.test(form.message),
      hasAny:
        form.name.length > 0 || form.email.length > 0 || form.message.length > 0,
    };
  }, [form]);

  const onMouseMove = (e: React.MouseEvent<HTMLFormElement>) => {
    const rect = cardRef.current!.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTouched(true);
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const formGlow = [
    "glass rounded-2xl p-8 transition-[box-shadow,background] duration-300 md:p-10",
    "border border-white/[0.08] bg-white/[0.04] backdrop-blur-md",
    hireIntent
      ? "form-live-glow form-live-glow--hire"
      : isFormValid
        ? "form-live-glow form-live-glow--valid"
        : !isFormValid && touched && hasAny
          ? "form-live-glow form-live-glow--editing"
          : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  };

  const inputClass = [
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-foreground",
    "placeholder:text-muted/40 transition-[border-color,box-shadow] duration-300",
    isFormValid
      ? "ring-0 border-[color:color-mix(in_srgb,var(--glow-validate-ok)55%,white_0%)]"
      : "neon-gold-focus",
  ].join(" ");

  return (
    <section className="relative bg-background py-32" id="contact">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-muted/40">
          Get in Touch
        </p>
        <h2 className="mb-12 font-serif text-4xl font-semibold text-foreground/90 md:text-5xl">
          You bring the remit. <br />
          <span className="italic text-accent/80">I bring the ledger and the line.</span>
        </h2>

        {state === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-[color:var(--glow-success-gold)]/35 bg-white/[0.04] p-12 text-center shadow-[0_0_60px_color-mix(in_srgb,var(--glow-success-gold)28%,transparent)]"
          >
            <p className="mb-2 font-serif text-2xl font-semibold text-foreground/90">
              Message received.
            </p>
            <p className="text-sm text-muted/60">
              I&apos;ll be in touch at {form.email} within 24 hours.
            </p>
          </motion.div>
        ) : (
          <motion.form
            ref={cardRef}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onSubmit={handleSubmit}
            style={{ rotateX, rotateY, transformPerspective: 900 }}
            className={formGlow}
            aria-describedby="form-glow-hint"
          >
            <p id="form-glow-hint" className="sr-only">
              Border glow shows live validation. Typing the word hire with a
              valid message uses success-gold.
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-[9px] uppercase tracking-[0.35em] text-muted/50"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={() => setTouched(true)}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[9px] uppercase tracking-[0.35em] text-muted/50"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={() => setTouched(true)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="message"
                className="mb-2 block text-[9px] uppercase tracking-[0.35em] text-muted/50"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Try: “We are looking to hire a regional quality head…”"
                value={form.message}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
                required
                className={`${inputClass} resize-none`}
              />
            </div>

            {state === "error" && (
              <p className="mt-3 text-xs text-red-400">
                Something went wrong. Please try again or email me directly at{" "}
                <a href="mailto:ved.hqts@gmail.com" className="underline">
                  ved.hqts@gmail.com
                </a>
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[9px] text-muted/50">
                Direct:{" "}
                <a
                  href="mailto:ved.hqts@gmail.com"
                  className="text-accent/80 transition-colors hover:text-accent"
                >
                  ved.hqts@gmail.com
                </a>
              </p>
              <button
                type="submit"
                disabled={state === "submitting" || !isFormValid}
                className="group flex shrink-0 items-center justify-center overflow-hidden rounded-full px-[1px] py-[1px] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background:
                    hireIntent
                      ? "linear-gradient(135deg, var(--glow-success-gold) 0%, #8a6a1a 100%)"
                      : "linear-gradient(135deg, #d4af37 0%, #3a2d0a 50%, #c9a227 100%)",
                }}
              >
                <span
                  className="flex w-full min-w-[10rem] items-center justify-center gap-2 rounded-full bg-background px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-accent transition-colors duration-300 group-hover:bg-transparent group-hover:text-background"
                  style={
                    hireIntent ? { color: "var(--glow-success-gold)" } : undefined
                  }
                >
                  {state === "submitting" ? "Sending…" : "Send message"}
                </span>
              </button>
            </div>
          </motion.form>
        )}

        <div className="mt-20 border-t border-white/[0.05] pt-10 text-center">
          <p className="font-serif text-base italic text-muted/40">
            Global Quality &amp; Supply Chain Leadership
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.4em] text-muted/30">
            © {new Date().getFullYear()} Ved Prakash Dwivedi
          </p>
        </div>
      </div>
    </section>
  );
}
