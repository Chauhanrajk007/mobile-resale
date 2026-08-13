import { dbConnect } from "@/lib/db";
import Booking from "@/models/Booking";
import { getAuthUser } from "@/lib/auth";
import { verifyPaymentSignature } from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const authUser = await getAuthUser();
    if (!authUser) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    const booking = await Booking.findById(bookingId);
    if (!booking) return Response.json({ error: "Not found" }, { status: 404 });

    // Dev mode check
    const isDev = booking.payment.orderId?.startsWith("mock_");
    if (!isDev) {
      const valid = verifyPaymentSignature({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
      });
      if (!valid) return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    booking.payment = {
      orderId: razorpay_order_id || booking.payment.orderId,
      paymentId: razorpay_payment_id || "mock_pay_" + Date.now(),
      signature: razorpay_signature || "",
      method: "razorpay",
      amount: booking.bill.total,
      status: "paid",
      paidAt: new Date(),
    };
    booking.status = "paid";
    booking.timeline.push({ status: "paid", label: "Payment received", at: new Date(), by: authUser._id });
    await booking.save();

    return Response.json({ booking });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Server error";
    return Response.json({ error: msg }, { status: 500 });
  }
}
