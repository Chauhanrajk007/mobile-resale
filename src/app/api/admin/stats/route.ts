import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import Inspection from "@/models/Inspection";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    await requireRoles(["admin"]);

    const [totalBookings, pendingBookings, completedBookings, technicianCount, totalInspections, recentBookings, revenueAgg] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: { $in: ["paid", "completed"] } }),
      User.countDocuments({ role: "technician", active: true }),
      Inspection.countDocuments(),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate("customer", "name").populate("technician", "name"),
      Booking.aggregate([{ $match: { "payment.status": "paid" } }, { $group: { _id: null, total: { $sum: "$bill.total" } } }]),
    ]);

    return Response.json({
      totalBookings,
      pendingBookings,
      completedBookings,
      totalRevenue: revenueAgg[0]?.total || 0,
      technicianCount,
      totalInspections,
      recentBookings,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return Response.json({ error: msg }, { status });
  }
}
