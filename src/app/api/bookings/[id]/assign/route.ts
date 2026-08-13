import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const adminUser = await requireRoles(["admin"]);
    const { id } = await params;
    const { technicianId } = await req.json();

    const tech = await User.findById(technicianId);
    if (!tech || tech.role !== "technician") {
      return Response.json({ error: "Invalid technician" }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    booking.technician = tech._id;
    booking.status = "assigned";
    booking.timeline.push({ status: "assigned", label: `Assigned to ${tech.name}`, at: new Date(), by: adminUser._id });
    await booking.save();

    const updated = await Booking.findById(id).populate("customer", "name email phone").populate("technician", "name technicianId phone");
    return Response.json({ booking: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return Response.json({ error: msg }, { status });
  }
}
