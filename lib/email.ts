import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

const DEFAULT_SMTP_PORT = 587;

export type SendEmailInput = {
  to?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
};

export type SendEmailResult =
  | { ok: true; messageId?: string }
  | { ok: false; error: string; logDetail?: string };

type ResolvedMailConfig = {
  defaultFromAddress: string;
};

let cachedTransporter: Transporter | null = null;
let devVerifyStarted = false;

function readTrimmedEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Gmail app passwords are often pasted with spaces; SMTP auth must not include them. */
function readSmtpUser(): string | undefined {
  const u = readTrimmedEnv("EMAIL_USER");
  if (!u) return undefined;
  return u.toLowerCase();
}

function readSmtpPass(): string | undefined {
  const p = readTrimmedEnv("EMAIL_PASS");
  if (!p) return undefined;
  const user = readTrimmedEnv("EMAIL_USER")?.toLowerCase() ?? "";
  const isLikelyGmail =
    user.endsWith("@gmail.com") || user.endsWith("@googlemail.com");
  if (isLikelyGmail) {
    return p.replace(/\s+/g, "");
  }
  return p;
}

function resolveMailConfig():
  | { ok: true; config: ResolvedMailConfig }
  | { ok: false; error: string } {
  const user = readSmtpUser();
  const pass = readSmtpPass();
  const fromOverride = readTrimmedEnv("EMAIL_FROM");

  if (!user || !pass) {
    return {
      ok: false,
      error: "Mail is not configured (missing EMAIL_USER or EMAIL_PASS).",
    };
  }

  const defaultFromAddress = fromOverride ?? user;
  return { ok: true, config: { defaultFromAddress } };
}

function createTransporter(): Transporter | null {
  const user = readSmtpUser();
  const pass = readSmtpPass();
  if (!user || !pass) return null;

  const host = readTrimmedEnv("EMAIL_HOST");
  const portRaw = readTrimmedEnv("EMAIL_PORT");
  const port = portRaw ? Number(portRaw) : DEFAULT_SMTP_PORT;

  if (host) {
    if (Number.isNaN(port) || port <= 0) {
      return null;
    }
    const useTlsUpgrade = port === 587;
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      requireTLS: useTlsUpgrade,
      auth: { user, pass },
      tls: { minVersion: "TLSv1.2" as const },
    });
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function getOrCreateTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  cachedTransporter = createTransporter();
  if (!cachedTransporter) return null;

  if (process.env.NODE_ENV === "development" && !devVerifyStarted) {
    devVerifyStarted = true;
    void cachedTransporter
      .verify()
      .then(() => console.log("[email] SMTP ok"))
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error("[email] SMTP verify failed:", message);
      });
  }

  return cachedTransporter;
}

/** Same normalized address used for SMTP auth (use in `From` so it matches Gmail). */
export function getEmailUserForSending(): string | undefined {
  return readSmtpUser();
}

export function escapeHtmlForEmail(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const cfg = resolveMailConfig();
  if (!cfg.ok) {
    return { ok: false, error: cfg.error, logDetail: cfg.error };
  }

  const transporter = getOrCreateTransporter();
  if (!transporter) {
    const detail =
      "Transporter build failed (check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS).";
    return { ok: false, error: detail, logDetail: detail };
  }

  const defaultTo = readTrimmedEnv("EMAIL_TO");
  const to = (input.to ?? defaultTo ?? "").trim();
  if (!to) {
    const detail = "No recipient: set EMAIL_TO or pass `to`.";
    return { ok: false, error: detail, logDetail: detail };
  }
  const subject = input.subject.trim();
  const from = (input.from ?? cfg.config.defaultFromAddress).trim();

  if (!subject || !from) {
    const detail = "Subject or From was empty after trim.";
    return { ok: false, error: detail, logDetail: detail };
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo?.trim() || undefined,
    });
    return { ok: true, messageId: info.messageId };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[email] sendMail:", message);
    return {
      ok: false,
      error: "SMTP rejected the message (see server logs).",
      logDetail: message,
    };
  }
}
