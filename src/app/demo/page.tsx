"use client";

import { useState } from "react";
import BillGeneratorModal from "@/components/technician/BillGeneratorModal";
import { formatCurrency } from "@/lib/utils";

const SAMPLE_BOOKING = {
  _id: "demo-booking-id",
  bookingNo: "CMP-2026-0001",
  status: "assigned",
  phone: { brand: "Samsung", model: "Galaxy S23 Ultra" },
  customer: { name: "Demo Customer" },
  meetDate: new Date().toISOString(),
  timeSlot: "12:00 PM – 2:00 PM",
  address: { line1: "42, MG Road", city: "Pune", pincode: "411001", landmark: "Near City Mall" },
  adminNotes: "Customer reports battery draining fast",
};

export default function DemoPage() {
  const [open, setOpen] = useState(true);
  const [generated, setGenerated] = useState<any | null>(null);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div
        style={{
          display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem",
          padding: "0.8rem 1rem", borderRadius: "var(--radius)",
          background: "color-mix(in srgb, var(--primary) 10%, transparent)",
          border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)",
          fontSize: "0.85rem", color: "var(--text)",
        }}
      >
        <span style={{ fontWeight: 700, color: "var(--primary)" }}>DEMO MODE</span>
        <span>No login needed — this is the technician's Bill Generator. Fill in condition scores, items, then hit Generate Bill. The bill is saved for real only from the technician dashboard.</span>
      </div>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Bill Generator</h1>
      <p style={{ color: "var(--text2)", marginBottom: "1.5rem" }}>
        Try it with this sample booking:
      </p>

      <div className="glass" style={{ padding: "1rem", borderRadius: "var(--radius)", border: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{SAMPLE_BOOKING.phone.brand} {SAMPLE_BOOKING.phone.model}</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text2)" }}>
            {SAMPLE_BOOKING.customer.name} · {SAMPLE_BOOKING.address.line1}, {SAMPLE_BOOKING.address.city}
          </div>
        </div>
        <button
          onClick={() => { setGenerated(null); setOpen(true); }}
          style={{ padding: "0.6rem 1.1rem", background: "var(--primary)", color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 700, cursor: "pointer" }}
        >
          Open Bill Generator
        </button>
      </div>

      {generated && (
        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: "var(--radius-lg)", background: "var(--surface2)", border: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 800, marginBottom: "0.75rem" }}>
            {generated.bookingNo} · {formatCurrency(349)}
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text2)" }}>
            In the real flow this booking becomes <b style={{ color: "var(--primary)" }}>Bill Ready</b> and the customer can Pay via Razorpay, then download the invoice from the account dashboard.
          </div>
        </div>
      )}

      {open && (
        <BillGeneratorModal
          demo
          booking={SAMPLE_BOOKING}
          onClose={() => setOpen(false)}
          onGenerated={(b) => { setOpen(false); setGenerated(b); }}
        />
      )}
    </div>
  );
}
