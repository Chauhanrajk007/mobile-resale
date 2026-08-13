"use client";

import { formatDate, formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/ToastProvider";

export default function InvoiceView({ booking }: { booking: any }) {
  const { toast } = useToast();
  return (
    <div className="invoice-pad" style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff; color: #000; font-size: 12pt; }
        }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* Print/Share buttons */}
      <div className="no-print" style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
        <button onClick={() => window.print()} style={{
          padding: "0.625rem 1.25rem", background: "var(--primary)", color: "#fff",
          border: "none", borderRadius: "var(--radius)", fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>
          Print
        </button>
        <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast("success", "Link copied to clipboard"); }} style={{
          padding: "0.625rem 1.25rem", background: "var(--surface2)", color: "var(--text)",
          border: "1px solid var(--border)", borderRadius: "var(--radius)", fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
          Share
        </button>
      </div>

      {/* Invoice Card */}
      <div className="invoice-card-pad" style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "2.5rem", boxShadow: "var(--shadow-md)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--primary)" }}>CheckMyPhone</h1>
            <p style={{ color: "var(--text2)", fontSize: "0.875rem" }}>Phone Inspection Service</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>INVOICE</h2>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>#{booking.bookingNo}</p>
            <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>{booking.bill?.generatedAt ? formatDate(booking.bill.generatedAt) : formatDate(booking.createdAt)}</p>
          </div>
        </div>

        {/* Customer & Phone */}
        <div className="grid-2-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          <div>
            <p style={{ color: "var(--text2)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>CUSTOMER</p>
            <p style={{ fontWeight: 600 }}>{booking.customer?.name}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--text2)" }}>{booking.customer?.phone}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--text2)" }}>{booking.customer?.email}</p>
          </div>
          <div>
            <p style={{ color: "var(--text2)", fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.25rem" }}>DEVICE INSPECTED</p>
            <p style={{ fontWeight: 600 }}>{booking.phone?.brand} {booking.phone?.model}</p>
            <p style={{ fontSize: "0.9rem", color: "var(--text2)" }}>Condition: {booking.phone?.condition}</p>
            {booking.technician && <p style={{ fontSize: "0.9rem", color: "var(--text2)", marginTop: "0.5rem" }}>Technician: {booking.technician.name} ({booking.technician.technicianId})</p>}
          </div>
        </div>

        {/* Review Summary */}
        {booking.review?.verdict && (
          <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "var(--surface2)", borderRadius: "var(--radius)" }}>
            <p style={{ fontWeight: 700, marginBottom: "1rem" }}>Inspection Summary</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "0.75rem" }}>
              {Object.entries(booking.review.condition || {}).map(([key, val]) => (
                <div key={key}>
                  <p style={{ fontSize: "0.75rem", color: "var(--text2)", textTransform: "capitalize" }}>{key}</p>
                  <div style={{ height: 6, borderRadius: 3, background: "var(--border)", marginTop: 4 }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${(Number(val) / 10) * 100}%`, background: Number(val) >= 7 ? "var(--success)" : Number(val) >= 4 ? "var(--warning)" : "var(--danger)" }} />
                  </div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, marginTop: 2 }}>{String(val)}/10</p>
                </div>
              ))}
            </div>
            <p style={{ marginTop: "1rem", fontWeight: 600 }}>Verdict: <span style={{ color: booking.review.verdict === "Good to Sell" ? "var(--success)" : "var(--warning)" }}>{booking.review.verdict}</span></p>
            {booking.review.issues && <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginTop: "0.5rem" }}>Issues: {booking.review.issues}</p>}
          </div>
        )}

        {/* Bill Table */}
        <table className="invoice-bill-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--border)" }}>
              <th style={{ textAlign: "left", padding: "0.75rem 0", fontSize: "0.85rem", color: "var(--text2)" }}>Item</th>
              <th style={{ textAlign: "center", padding: "0.75rem 0", fontSize: "0.85rem", color: "var(--text2)" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "0.75rem 0", fontSize: "0.85rem", color: "var(--text2)" }}>Rate</th>
              <th style={{ textAlign: "right", padding: "0.75rem 0", fontSize: "0.85rem", color: "var(--text2)" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              <td style={{ padding: "0.75rem 0" }}>Inspection Service Fee</td>
              <td style={{ textAlign: "center", padding: "0.75rem 0" }}>1</td>
              <td style={{ textAlign: "right", padding: "0.75rem 0" }}>{formatCurrency(booking.bill?.serviceFee || 350)}</td>
              <td style={{ textAlign: "right", padding: "0.75rem 0" }}>{formatCurrency(booking.bill?.serviceFee || 350)}</td>
            </tr>
            {(booking.bill?.items || []).map((item: any, i: number) => (
              <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "0.75rem 0" }}>{item.name}</td>
                <td style={{ textAlign: "center", padding: "0.75rem 0" }}>{item.qty}</td>
                <td style={{ textAlign: "right", padding: "0.75rem 0" }}>{formatCurrency(item.rate)}</td>
                <td style={{ textAlign: "right", padding: "0.75rem 0" }}>{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ borderTop: "2px solid var(--border)" }}>
              <td colSpan={3} style={{ textAlign: "right", padding: "0.75rem 0", fontWeight: 700, fontSize: "1.1rem" }}>Total</td>
              <td style={{ textAlign: "right", padding: "0.75rem 0", fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)" }}>{formatCurrency(booking.bill?.total || 350)}</td>
            </tr>
          </tfoot>
        </table>
        {booking.bill?.notes && <p style={{ color: "var(--text2)", fontSize: "0.85rem", fontStyle: "italic", marginBottom: "1.5rem" }}>Note: {booking.bill.notes}</p>}

        {/* Payment Status */}
        <div style={{
          padding: "1rem 1.25rem", borderRadius: "var(--radius)",
          background: booking.payment?.status === "paid" ? "#ECFDF5" : "#FEF9C3",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontWeight: 600, color: booking.payment?.status === "paid" ? "#059669" : "#CA8A04" }}>
            {booking.payment?.status === "paid" ? "✓ Paid" : "⏳ Payment Pending"}
          </span>
          {booking.payment?.paidAt && <span style={{ fontSize: "0.85rem", color: "var(--text2)" }}>{formatDate(booking.payment.paidAt)}</span>}
        </div>
        {booking.payment?.paymentId && <p style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: "0.5rem" }}>Payment ID: {booking.payment.paymentId}</p>}
      </div>
    </div>
  );
}
