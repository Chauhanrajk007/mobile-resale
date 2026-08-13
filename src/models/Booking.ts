import mongoose, { Schema } from "mongoose";

export interface IBooking {
  _id: mongoose.Types.ObjectId;
  bookingNo: string;
  customer: mongoose.Types.ObjectId;
  phone: { brand: string; model: string; condition: string; imei: string };
  address: { line1: string; city: string; pincode: string; landmark: string };
  meetDate: Date;
  timeSlot: string;
  status: string;
  technician: mongoose.Types.ObjectId | null;
  adminNotes: string;
  bill: {
    serviceFee: number;
    items: Array<{ name: string; qty: number; rate: number; amount: number }>;
    subtotal: number;
    total: number;
    notes: string;
    generatedBy: mongoose.Types.ObjectId | null;
    generatedAt: Date | null;
  };
  review: {
    condition: { screen: number; battery: number; body: number; camera: number; buttons: number; overall: number };
    issues: string;
    verdict: string;
  };
  payment: {
    orderId: string;
    paymentId: string;
    signature: string;
    method: string;
    amount: number;
    status: string;
    paidAt: Date | null;
  };
  timeline: Array<{ status: string; label: string; at: Date; by: mongoose.Types.ObjectId | null }>;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema(
  {
    bookingNo: { type: String, required: true, unique: true },
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    phone: {
      brand: { type: String, required: true },
      model: { type: String, required: true },
      condition: { type: String, default: "" },
      imei: { type: String, default: "" },
    },
    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      landmark: { type: String, default: "" },
    },
    meetDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "assigned", "out_for_inspection", "inspected", "priced", "paid", "completed", "cancelled"],
      default: "pending",
    },
    technician: { type: Schema.Types.ObjectId, ref: "User", default: null },
    adminNotes: { type: String, default: "" },
    bill: {
      serviceFee: { type: Number, default: 350 },
      items: [{ name: String, qty: { type: Number, default: 1 }, rate: Number, amount: Number }],
      subtotal: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      notes: { type: String, default: "" },
      generatedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
      generatedAt: { type: Date, default: null },
    },
    review: {
      condition: {
        screen: { type: Number, default: 0 },
        battery: { type: Number, default: 0 },
        body: { type: Number, default: 0 },
        camera: { type: Number, default: 0 },
        buttons: { type: Number, default: 0 },
        overall: { type: Number, default: 0 },
      },
      issues: { type: String, default: "" },
      verdict: { type: String, default: "" },
    },
    payment: {
      orderId: { type: String, default: "" },
      paymentId: { type: String, default: "" },
      signature: { type: String, default: "" },
      method: { type: String, default: "" },
      amount: { type: Number, default: 0 },
      status: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
      paidAt: { type: Date, default: null },
    },
    timeline: [{
      status: String,
      label: String,
      at: { type: Date, default: Date.now },
      by: { type: Schema.Types.ObjectId, ref: "User", default: null },
    }],
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1, createdAt: -1 });
bookingSchema.index({ technician: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingNo: 1 });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
