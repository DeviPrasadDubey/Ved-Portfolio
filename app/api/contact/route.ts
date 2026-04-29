import { NextRequest, NextResponse } from "next/server";
import {
  escapeHtmlForEmail,
  getEmailUserForSending,
  sendEmail,
} from "@/lib/email";

const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const ipRequestLog = new Map<string, number[]>();
const isDev = process.env.NODE_ENV === "development";

function contactFail(
  status: number,
  publicMessage: string,
  log?: Record<string, unknown>,
  debug?: string,
) {
  if (log) console.error("[contact]", log);
  return NextResponse.json(
    {
      error: publicMessage,
      ...(isDev && debug ? { debug } : {}),
    },
    { status },
  );
}

/** Gmail is picky about quoted display names; keep the envelope valid. */
function fromDisplayName(name: string): string {
  const collapsed = name
    .replace(/["\\\r\n\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return collapsed.length > 0 ? collapsed : "Portfolio contact";
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return contactFail(400, "Request body must be valid JSON.", undefined, "json parse");
    }

    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      return contactFail(400, "Request body must be a JSON object.", undefined, "not an object");
    }

    const fields = body as Record<string, unknown>;
    const { name, email, message, company } = fields;

    if (typeof company === "string" && company.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return contactFail(
        400,
        "Name, email, and message are required as text.",
        undefined,
        "expected string fields",
      );
    }

    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const cleanName = sanitizeInput(name);
    const cleanEmail = sanitizeInput(email);
    const cleanMessage = sanitizeInput(message);

    if (!cleanName) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!cleanEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!cleanMessage) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is too long (max 2000 characters)." },
        { status: 400 },
      );
    }

    const emailUser = getEmailUserForSending();
    if (!emailUser) {
      return contactFail(
        500,
        "Unable to process your message right now.",
        { reason: "EMAIL_USER unset" },
        "Set EMAIL_USER in .env.local",
      );
    }

    const fromHeader = `"${fromDisplayName(cleanName)}" <${emailUser}>`;

    const mailResult = await sendEmail({
      from: fromHeader,
      replyTo: cleanEmail,
      subject: `Portfolio — ${cleanName}`,
      text: [`Name: ${cleanName}`, `Email: ${cleanEmail}`, "", cleanMessage].join("\n"),
      html: `
        <table style="font-family:sans-serif;font-size:14px;color:#1a1a1a;max-width:560px">
          <tr><td style="padding:24px 0 8px">
            <h2 style="margin:0;font-size:18px">New message</h2>
          </td></tr>
          <tr><td style="padding:4px 0"><b>Name:</b> ${escapeHtmlForEmail(cleanName)}</td></tr>
          <tr><td style="padding:4px 0"><b>Email:</b>
            <a href="mailto:${escapeHtmlForEmail(cleanEmail)}">${escapeHtmlForEmail(cleanEmail)}</a>
          </td></tr>
          <tr><td style="padding:16px 0 0">
            <p style="margin:0;white-space:pre-wrap;border-left:3px solid #D4AF37;padding-left:12px;color:#333">
              ${escapeHtmlForEmail(cleanMessage)}
            </p>
          </td></tr>
        </table>
      `,
    });

    if (!mailResult.ok) {
      const detail = mailResult.logDetail ?? mailResult.error;
      console.error("[contact] sendEmail failed", {
        summary: mailResult.error,
        detail,
        hasHost: Boolean(process.env.EMAIL_HOST?.trim()),
        hasTo: Boolean(process.env.EMAIL_TO?.trim()),
      });
      return contactFail(
        500,
        "Unable to process your message right now.",
        undefined,
        detail,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[contact] unhandled", err);
    return contactFail(
      500,
      "Unable to process your message right now.",
      undefined,
      message,
    );
  }
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const existing = ipRequestLog.get(ip) ?? [];
  const recent = existing.filter((timestamp) => timestamp > windowStart);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipRequestLog.set(ip, recent);
    return true;
  }

  recent.push(now);
  ipRequestLog.set(ip, recent);
  return false;
}

function sanitizeInput(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim();
}

