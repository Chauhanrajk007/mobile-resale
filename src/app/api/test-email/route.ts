import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const hasSmtp = Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );

  const send = req.nextUrl.searchParams.get("send");

  if (send === "1") {
    const to = process.env.NOTIFY_EMAIL;
    if (!to) {
      return NextResponse.json(
        { success: false, error: "No NOTIFY_EMAIL set." },
        { status: 400 }
      );
    }
    const result = await sendEmail({
      to,
      subject: "CheckMyPhone test email",
      text: "This is a test email from CheckMyPhone. If you received this, SMTP is working.",
      html: "<h2>CheckMyPhone</h2><p>This is a test email. If you received this, SMTP is working.</p>",
    });
    return NextResponse.json({ ...result, env: {
      SMTP_HOST: process.env.SMTP_HOST ? "set" : "missing",
      SMTP_PORT: process.env.SMTP_PORT || "missing",
      SMTP_USER: process.env.SMTP_USER ? "set" : "missing",
      SMTP_PASS: process.env.SMTP_PASS ? "set" : "missing",
      NOTIFY_EMAIL: process.env.NOTIFY_EMAIL ? "set" : "missing",
    } });
  }

  return NextResponse.json({
    configured: hasSmtp,
    env: {
      SMTP_HOST: process.env.SMTP_HOST ? "set" : "missing",
      SMTP_PORT: process.env.SMTP_PORT || "missing",
      SMTP_USER: process.env.SMTP_USER ? "set" : "missing",
      SMTP_PASS: process.env.SMTP_PASS ? "set" : "missing",
      NOTIFY_EMAIL: process.env.NOTIFY_EMAIL ? "set" : "missing",
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const to = body.to || process.env.NOTIFY_EMAIL;

  if (!to) {
    return NextResponse.json(
      { success: false, error: "No recipient. Provide `to` in body or set NOTIFY_EMAIL." },
      { status: 400 }
    );
  }

  const result = await sendEmail({
    to,
    subject: "CheckMyPhone test email",
    text: "This is a test email from CheckMyPhone. If you received this, SMTP is working.",
    html: "<h2>CheckMyPhone</h2><p>This is a test email. If you received this, SMTP is working.</p>",
  });

  return NextResponse.json(result);
}
