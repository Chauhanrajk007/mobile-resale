import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { requireRoles, getAuthUser } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const q = searchParams.get("q");
    const query: any = {};

    if (authUser.role === "customer") query.customer = authUser._id;
    else if (authUser.role === "technician") query.technician = authUser._id;

    if (status) query.status = status;
    if (q) query.bookingNo = { $regex: q, $options: "i" };

    const bookings = await Booking.find(query)
      .populate("customer", "name email phone")
      .populate("technician", "name technicianId phone")
      .sort({ createdAt: -1 });
    return Response.json({ bookings });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const authUser = await requireRoles(["customer", "admin"]);
    const body = await request.json();
    const count = await Booking.countDocuments();
    const bookingNo = `CMP-B${String(count + 1).padStart(4, "0")}`;

    const booking = await Booking.create({
      bookingNo,
      customer: authUser._id,
      phone: body.phone,
      address: body.address,
      meetDate: body.meetDate,
      timeSlot: body.timeSlot,
      status: "pending",
      bill: { serviceFee: 350 },
      timeline: [{ status: "pending", label: "Booking created", at: new Date(), by: authUser._id }],
    });

    // Notify admins with email notifications enabled
    try {
      const notifyTargets = new Set<string>();
      if (process.env.NOTIFY_EMAIL) notifyTargets.add(process.env.NOTIFY_EMAIL);
      const admins = await User.find({ role: "admin", emailNotifications: { $ne: false }, active: true });
      for (const admin of admins) notifyTargets.add(admin.email);

      for (const to of notifyTargets) {
        await sendEmail({
          to,
          subject: `[New Booking] ${bookingNo} - ${body.phone?.brand} ${body.phone?.model}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px; background: #fff; color: #1c1917;">
              <h2 style="color: #d97706; margin-top: 0;">New doorstep inspection booking created!</h2>
              <p>A new phone inspection has been scheduled by a customer.</p>
              <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; color: #78716c; font-size: 0.9rem; width: 140px;">Booking Number:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${bookingNo}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #78716c; font-size: 0.9rem;">Device:</td>
                  <td style="padding: 6px 0; font-weight: bold;">${body.phone?.brand} ${body.phone?.model} (${body.phone?.condition})</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #78716c; font-size: 0.9rem;">Meet Date/Time:</td>
                  <td style="padding: 6px 0;">${new Date(body.meetDate).toLocaleDateString()} at ${body.timeSlot}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #78716c; font-size: 0.9rem;">Customer Name:</td>
                  <td style="padding: 6px 0;">${authUser.name}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #78716c; font-size: 0.9rem;">Address:</td>
                  <td style="padding: 6px 0;">${body.address?.line1}, ${body.address?.city} - ${body.address?.pincode}</td>
                </tr>
              </table>
              <hr style="border: 0; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
              <p style="font-size: 0.9rem; color: #78716c;">Please log in to the admin panel to assign a technician for this booking.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin" style="display: inline-block; padding: 10px 20px; background: #d97706; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">Go to Admin Panel</a>
            </div>
          `,
          text: `New Booking ${bookingNo}: ${body.phone?.brand} ${body.phone?.model}. Schedule: ${new Date(body.meetDate).toLocaleDateString()} at ${body.timeSlot}. Address: ${body.address?.line1}, ${body.address?.city}.`,
        });
      }
    } catch (emailErr) {
      console.error("Failed to send booking notification email:", emailErr);
    }

    return Response.json({ booking }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return Response.json({ error: msg }, { status });
  }
}
