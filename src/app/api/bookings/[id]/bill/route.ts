import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { requireRoles } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const authUser = await requireRoles(["technician", "admin"]);
    const { id } = await params;
    const { review, items, notes } = await req.json();

    const booking = await Booking.findById(id);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    booking.review = review;

    const billItems = (items || []).map((it: any) => ({
      name: it.name,
      qty: it.qty || 1,
      rate: it.rate || 0,
      amount: (it.qty || 1) * (it.rate || 0),
    }));
    const subtotal = billItems.reduce((s: number, i: any) => s + i.amount, 0);
    const serviceFee = 349;

    booking.bill = {
      serviceFee,
      items: billItems,
      subtotal,
      total: subtotal + serviceFee,
      notes: notes || "",
      generatedBy: authUser._id,
      generatedAt: new Date(),
    };
    booking.status = "priced";
    booking.timeline.push({ status: "priced", label: "Bill generated", at: new Date(), by: authUser._id });
    await booking.save();

    const updated = await Booking.findById(id).populate("customer", "name email phone").populate("technician", "name technicianId");
    return Response.json({ booking: updated });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    const status = msg === "Unauthorized" ? 401 : msg === "Forbidden" ? 403 : 500;
    return Response.json({ error: msg }, { status });
  }
}
