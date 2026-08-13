import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { getRazorpayInstance } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId } = await req.json();
    const booking = await Booking.findById(bookingId);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });
    if (booking.status !== "priced") return Response.json({ error: "Bill not ready" }, { status: 400 });

    const customer = await User.findById(booking.customer);
    const amount = booking.bill.total * 100; // paise

    const rzp = getRazorpayInstance();
    if (!rzp) {
      // Dev mode: mock order
      const mockId = "mock_" + Date.now();
      booking.payment.orderId = mockId;
      await booking.save();
      return Response.json({
        orderId: mockId, amount, currency: "INR",
        keyId: "rzp_test_mock", receipt: booking.bookingNo,
        prefill: { name: customer?.name, email: customer?.email, contact: customer?.phone },
      });
    }

    const order = await rzp.orders.create({ amount, currency: "INR", receipt: booking.bookingNo });
    booking.payment.orderId = order.id;
    await booking.save();

    return Response.json({
      orderId: order.id, amount, currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID, receipt: booking.bookingNo,
      prefill: { name: customer?.name, email: customer?.email, contact: customer?.phone },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
