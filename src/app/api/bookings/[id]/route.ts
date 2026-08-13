import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { getAuthUser, requireRoles } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const booking = await Booking.findById(id)
      .populate("customer", "name email phone")
      .populate("technician", "name technicianId phone");
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json({ booking });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const booking = await Booking.findById(id);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    const allowed = ["status", "adminNotes", "review", "bill"];
    for (const key of allowed) {
      if (body[key] !== undefined) (booking as any)[key] = body[key];
    }
    if (body.status && body.timelineLabel) {
      booking.timeline.push({ status: body.status, label: body.timelineLabel, at: new Date(), by: authUser._id });
    }
    await booking.save();
    return Response.json({ booking });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    await requireRoles(["admin"]);
    const { id } = await params;
    await Booking.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return Response.json({ error: msg }, { status });
  }
}
