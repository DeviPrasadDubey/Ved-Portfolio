import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

/**
 * Dev-only: GET /api/dev/test-email
 * Sends a sample message to process.env.EMAIL_TO.
 */
export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await sendEmail({
    subject: "[dev] Portfolio email test",
    text: "This is a test email from ved-portfolio (dev route).",
    html: "<p>This is a <strong>test</strong> email from <code>ved-portfolio</code> (dev route).</p>",
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    messageId: result.messageId ?? null,
  });
}
