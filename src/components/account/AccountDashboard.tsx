"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BOOKING_STATUSES } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";
import { startPayment } from "@/lib/payments";
import Link from "next/link";

export default function AccountDashboard() {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [paying, setPaying] = useState("");

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handlePay = async (id: string) => {
    setPaying(id);
    try {
      const result = await startPayment(id);
      if (result.success) {
        await fetchBookings();
        alert("Payment successful!");
      } else {
        alert(result.error || "Payment failed");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Payment failed");
    } finally { setPaying(""); }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Hello, {user?.name?.split(" ")[0]}</h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Your bookings</p>
        </div>
        <button onClick={logout} style={{
          padding: "0.5rem 1rem", background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", color: "var(--text2)", fontWeight: 500, cursor: "pointer",
        }}>Logout</button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1rem" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>No bookings yet</p>
          <Link href="/book" style={{
            display: "inline-block", padding: "0.875rem 2rem",
            background: "var(--primary)", color: "#fff", borderRadius: "var(--radius)",
            textDecoration: "none", fontWeight: 600,
          }}>Book Your First Inspection</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((b: any, i: number) => {
            const statusInfo = BOOKING_STATUSES[b.status] || { label: b.status, color: "gray" };
            const isExpanded = expanded === b._id;
            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setExpanded(isExpanded ? null : b._id)}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "1.25rem",
                  cursor: "pointer", boxShadow: "var(--shadow)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text2)" }}>{b.bookingNo}</span>
                  <span style={{
                    padding: "0.25rem 0.75rem", borderRadius: 99, fontSize: "0.75rem",
                    fontWeight: 600, color: "#fff", background: statusInfo.color,
                  }}>{statusInfo.label}</span>
                </div>
                <p style={{ fontWeight: 600, fontSize: "1.05rem" }}>{b.phone?.brand} {b.phone?.model}</p>
                <p style={{ color: "var(--text2)", fontSize: "0.85rem" }}>{formatDate(b.meetDate)} • {b.timeSlot}</p>

                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} style={{ marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text2)" }}>{b.address?.line1}, {b.address?.city} {b.address?.pincode}</p>
                    {b.technician && <p style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>Technician: <strong>{b.technician.name}</strong></p>}
                    {b.bill?.total > 0 && <p style={{ fontSize: "0.95rem", fontWeight: 600, marginTop: "0.5rem" }}>Total: {formatCurrency(b.bill.total)}</p>}
                    {b.timeline?.map((t: any, j: number) => (
                      <p key={j} style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: "0.25rem" }}>• {t.label} — {formatDate(t.at)}</p>
                    ))}
                  </motion.div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }} onClick={e => e.stopPropagation()}>
                  {b.status === "priced" && (
                    <button onClick={() => handlePay(b._id)} disabled={paying === b._id} style={{
                      padding: "0.625rem 1.25rem", background: "var(--success)", color: "#fff",
                      border: "none", borderRadius: "var(--radius)", fontWeight: 600, fontSize: "0.875rem",
                      cursor: paying === b._id ? "wait" : "pointer",
                    }}>{paying === b._id ? "Processing..." : `Pay ${formatCurrency(b.bill.total)}`}</button>
                  )}
                  {(b.status === "paid" || b.status === "completed") && (
                    <Link href={`/invoice/${b._id}`} style={{
                      padding: "0.625rem 1.25rem", background: "var(--primary)", color: "#fff",
                      borderRadius: "var(--radius)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
                    }}>View Invoice</Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Link href="/book" style={{
        position: "fixed", bottom: 100, right: 20,
        width: 56, height: 56, borderRadius: "50%",
        background: "var(--primary)", color: "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.5rem", boxShadow: "var(--shadow-lg)",
        textDecoration: "none", zIndex: 40,
      }}>+</Link>
    </div>
  );
}
