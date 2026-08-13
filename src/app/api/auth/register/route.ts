import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { name, email, phone, password, role } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    const requestedRole = role || "customer";
    if (requestedRole === "technician" || requestedRole === "admin") {
      await requireRoles(["admin"]);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return Response.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password, // Pre-save hook will hash this
      role: requestedRole,
    });

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
    await sendEmail({
      to: email,
      subject: "Welcome to CheckMyPhone — your account is ready",
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#fafaf8;border:1px solid #e7e5e4;border-radius:16px;">
          <div style="text-align:center;margin-bottom:20px;">
            <div style="width:48px;height:48px;margin:0 auto 10px;border-radius:12px;background:linear-gradient(135deg,#d97706,#b45309);display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;font-weight:bold;">📱</div>
            <h1 style="font-size:22px;color:#1c1917;margin:0;">Welcome, ${name}!</h1>
          </div>
          <p style="color:#44403c;font-size:15px;line-height:1.6;">
            Your <strong>CheckMyPhone</strong> account has been created successfully.
          </p>
          <p style="color:#44403c;font-size:15px;line-height:1.6;">
            You can now book doorstep phone inspections, track your reports, and get verified
            inspection results for any used-phone deal.
          </p>
          <div style="text-align:center;margin:24px 0;">
            <a href="${appUrl}/login" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#d97706,#b45309);color:#fff;text-decoration:none;border-radius:10px;font-weight:bold;font-size:15px;">
              Sign in to your account
            </a>
          </div>
          <p style="color:#78716c;font-size:12px;line-height:1.5;text-align:center;margin:0;">
            If you didn't create this account, you can safely ignore this email.
          </p>
        </div>
      `,
      text: `Welcome to CheckMyPhone, ${name}! Your account has been created successfully. You can now book doorstep phone inspections and get verified reports. Sign in here: ${appUrl}/login`,
    });

    return Response.json({ user }, { status: 201 });
  } catch (error: any) {
    // If requireRoles throws, we return 403 or 401 depending on the error message
    const status = error.message === "Forbidden" ? 403 : (error.message === "Unauthorized" ? 401 : 500);
    return Response.json({ error: error.message }, { status });
  }
}
