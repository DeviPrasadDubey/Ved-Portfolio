import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAX_MESSAGE_LENGTH = 2000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const ipRequestLog = new Map<string, number[]>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, company } = body as {
      name?: string;
      email?: string;
      message?: string;
      company?: string;
    };

    if (typeof company === "string" && company.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
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

    /* ── Validation ─────────────────────────────────────────────────────── */
    if (!cleanName) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!cleanEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!cleanMessage) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 },
      );
    }
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: "Message is too long (max 2000 characters)." },
        { status: 400 },
      );
    }

    /* ── Guard: env vars must exist at runtime ──────────────────────────── */
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_TO = process.env.EMAIL_TO;
    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      console.error("[contact] Missing email environment variables.");
      return NextResponse.json(
        { error: "Unable to process your message right now." },
        { status: 500 },
      );
    }

    /* ── Nodemailer transporter (Gmail + App Password) ──────────────────── */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    /* ── Send email ─────────────────────────────────────────────────────── */
    await transporter.sendMail({
      from: `"${cleanName}" <${EMAIL_USER}>`, // Gmail requires from = authenticated user
      replyTo: cleanEmail, // Reply-To points to the visitor's address
      to: EMAIL_TO,
      subject: `Portfolio Contact — ${cleanName}`,
      text: [
        `Name:    ${cleanName}`,
        `Email:   ${cleanEmail}`,
        ``,
        cleanMessage,
      ].join("\n"),
      html: `
        <table style="font-family:sans-serif;font-size:14px;color:#1a1a1a;max-width:560px">
          <tr><td style="padding:24px 0 8px">
            <h2 style="margin:0;font-size:18px">New portfolio contact</h2>
          </td></tr>
          <tr><td style="padding:4px 0"><b>Name:</b> ${escHtml(cleanName)}</td></tr>
          <tr><td style="padding:4px 0"><b>Email:</b>
            <a href="mailto:${escHtml(cleanEmail)}">${escHtml(cleanEmail)}</a>
          </td></tr>
          <tr><td style="padding:16px 0 0">
            <p style="margin:0;white-space:pre-wrap;border-left:3px solid #D4AF37;padding-left:12px;color:#333">
              ${escHtml(cleanMessage)}
            </p>
          </td></tr>
        </table>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] sendMail failed:", err);
    return NextResponse.json(
      { error: "Unable to process your message right now." },
      { status: 500 },
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

/* Escape user content before embedding in HTML */
function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
