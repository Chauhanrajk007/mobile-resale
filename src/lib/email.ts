import nodemailer from "nodemailer";

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM || "CheckMyPhone <noreply@checkmyphone.in>";

  console.log(`[EMAIL-SERVICE] Preparing email to: ${to}, subject: "${subject}"`);

  if (!host || !user || !pass) {
    console.warn(
      `[EMAIL-SERVICE] SMTP credentials are not configured in environment variables (SMTP_HOST, SMTP_USER, SMTP_PASS). ` +
      `Logging email contents instead:\n` +
      `To: ${to}\n` +
      `Subject: ${subject}\n` +
      `Body:\n${text || html}\n`
    );
    return { success: true, mocked: true };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // simple fallback text
      html,
    });

    console.log(`[EMAIL-SERVICE] Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[EMAIL-SERVICE] Error sending email:`, error);
    return { success: false, error };
  }
}
