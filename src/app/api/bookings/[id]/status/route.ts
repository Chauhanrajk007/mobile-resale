import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { requireRoles } from "@/lib/auth";

const ALLOWED_TRANSITIONS: Record<string, { from: string[]; to: string; label: string }> = {
  completed: {
    from: ["paid"],
    to: "completed",
    label: "Marked as completed",
  },
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const authUser = await requireRoles(["technician", "admin"]);
    const { id } = await params;
    const { action } = await req.json();

    const transition = ALLOWED_TRANSITIONS[action];
    if (!transition) {
      return Response.json({ error: "Unknown action" }, { status: 400 });
    }

    const booking = await Booking.findById(id);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    if (authUser.role === "technician" && booking.technician?.toString() !== authUser._id.toString()) {
      return Response.json({ error: "Not your booking" }, { status: 403 });
    }

    if (!transition.from.includes(booking.status)) {
      return Response.json({ error: `Cannot ${action} from ${booking.status}` }, { status: 400 });
    }

    booking.status = transition.to;
    booking.timeline.push({ status: transition.to, label: transition.label, at: new Date(), by: authUser._id });
    await booking.save();

    const updated = await Booking.findById(id)
      .populate("customer", "name email phone")
      .populate("technician", "name technicianId");

    return Response.json({ booking: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return Response.json({ error: msg }, { status });
  }
}
