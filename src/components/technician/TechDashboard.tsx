"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui";
import { useToast } from "@/components/ToastProvider";
import { BOOKING_STATUSES } from "@/lib/constants";
import { formatDate, formatCurrency } from "@/lib/utils";

const CONDITION_FIELDS = [
  { key: "screen", label: "Screen" },
  { key: "battery", label: "Battery" },
  { key: "body", label: "Body" },
  { key: "camera", label: "Camera" },
  { key: "buttons", label: "Buttons" },
  { key: "overall", label: "Overall" },
] as const;

export default function TechDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Bill generator state
  const [billBooking, setBillBooking] = useState<any | null>(null);
  const [condition, setCondition] = useState<Record<string, number>>({ screen: 0, battery: 0, body: 0, camera: 0, buttons: 0, overall: 0 });
  const [issues, setIssues] = useState("");
  const [verdict, setVerdict] = useState("");
  const [items, setItems] = useState<{ name: string; qty: number; rate: number }[]>([{ name: "", qty: 1, rate: 0 }]);
  const [notes, setNotes] = useState("");
  const [billSubmitting, setBillSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [inspRes, bookRes] = await Promise.all([
          fetch("/api/inspections"),
          fetch("/api/bookings"),
        ]);
        if (inspRes.ok) {
          const data = await inspRes.json();
          setStats({
            total: data.inspections?.length || 0,
            today: data.inspections?.filter((i: any) => new Date(i.createdAt).toDateString() === new Date().toDateString()).length || 0
          });
        }
        if (bookRes.ok) {
          const data = await bookRes.json();
          setBookings(data.bookings || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spinner />
      </div>
    );
  }

  const statusInfo = (s: string) => BOOKING_STATUSES[s] || { label: s, color: "#78716c" };
  const canBill = (b: any) => !["priced", "paid", "completed", "cancelled"].includes(b.status);

  const openBill = (b: any) => {
    setCondition({ screen: 0, battery: 0, body: 0, camera: 0, buttons: 0, overall: 0 });
    setIssues(b.review?.issues || "");
    setVerdict(b.review?.verdict || "");
    setItems([{ name: "", qty: 1, rate: 0 }]);
    setNotes("");
    setBillBooking(b);
  };

  const handleGenerateBill = async () => {
    if (!billBooking) return;
    setBillSubmitting(true);
    try {
      const cleanItems = items
        .filter((it) => it.name.trim() && it.rate >= 0)
        .map((it) => ({ name: it.name.trim(), qty: it.qty || 1, rate: it.rate || 0 }));
      const res = await fetch(`/api/bookings/${billBooking._id}/bill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: {
            condition: {
              screen: condition.screen || 0,
              battery: condition.battery || 0,
              body: condition.body || 0,
              camera: condition.camera || 0,
              buttons: condition.buttons || 0,
              overall: condition.overall || 0,
            },
            issues,
            verdict,
          },
          items: cleanItems,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate bill");
      toast("success", "Bill generated", "Booking is now ready for payment.");
      setBillBooking(null);
      const bookRes = await fetch("/api/bookings");
      if (bookRes.ok) {
        const d = await bookRes.json();
        setBookings(d.bookings || []);
      }
    } catch (err) {
      toast("error", "Failed to generate bill", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBillSubmitting(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.6rem 0.75rem", background: "var(--surface2)",
    border: "1px solid var(--border)", borderRadius: "var(--radius)",
    color: "var(--text)", fontSize: "0.875rem", outline: "none",
  };

  const subtotal = items.reduce((s, it) => s + (it.rate || 0) * (it.qty || 1), 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Hello, {user?.name}</h1>
        <p style={{ color: 'var(--text2)' }}>Here are the inspections assigned to you.</p>
      </motion.div>

      <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="glass"
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
        >
          <div style={{ color: 'var(--text2)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Assigned to me</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{bookings.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="glass"
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
        >
          <div style={{ color: 'var(--text2)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Completed Today</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{stats.today}</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Assigned Bookings</h2>

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text2)', background: 'var(--surface2)', borderRadius: 'var(--radius-lg)' }}>
            No bookings assigned yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {bookings.map((b, i) => (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                className="glass"
                style={{
                  padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 'bold' }}>{b.phone?.brand} {b.phone?.model}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>{b.bookingNo}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: '0.2rem' }}>
                    {b.customer?.name} · {b.meetDate ? formatDate(b.meetDate) : ""} · {b.timeSlot}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.35rem', marginTop: '0.4rem',
                    fontSize: '0.8rem', color: 'var(--text)',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>
                      {b.address?.line1}, {b.address?.city} - {b.address?.pincode}
                      {b.address?.landmark ? ` · ${b.address.landmark}` : ""}
                    </span>
                  </div>
                  {b.adminNotes && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text2)', marginTop: '0.3rem', fontStyle: 'italic' }}>
                      Note: {b.adminNotes}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                  <span style={{
                    whiteSpace: 'nowrap', padding: '0.25rem 0.6rem', borderRadius: 999,
                    background: `color-mix(in srgb, ${statusInfo(b.status).color} 14%, transparent)`,
                    color: statusInfo(b.status).color, fontSize: '0.72rem', fontWeight: 700,
                  }}>
                    {statusInfo(b.status).label}
                  </span>
                  {canBill(b) && (
                    <button
                      onClick={() => openBill(b)}
                      style={{
                        whiteSpace: 'nowrap', padding: '0.45rem 0.9rem', background: 'var(--primary)',
                        color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600,
                        fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.2s',
                      }}
                    >
                      Generate Bill
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Bill Generator Modal */}
      <AnimatePresence>
        {billBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100,
              display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
            }}
            onClick={() => setBillBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", padding: "1.5rem", maxWidth: 560, width: "100%",
                maxHeight: "88vh", overflowY: "auto",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                  Generate Bill · {billBooking.bookingNo}
                </h3>
                <button
                  onClick={() => setBillBooking(null)}
                  style={{ background: "var(--surface2)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "var(--text2)", fontSize: "1.1rem" }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Condition review */}
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text2)", marginBottom: "0.6rem" }}>PHONE CONDITION (0–10)</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    {CONDITION_FIELDS.map((f) => (
                      <div key={f.key}>
                        <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.25rem" }}>{f.label}</label>
                        <input
                          type="number" min={0} max={10} value={condition[f.key]}
                          onChange={(e) => setCondition({ ...condition, [f.key]: Number(e.target.value) })}
                          style={inputStyle}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.25rem" }}>Issues Found</label>
                  <textarea rows={2} value={issues} onChange={(e) => setIssues(e.target.value)} placeholder="e.g. minor scratch on screen, battery health 82%" style={inputStyle} />
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.25rem" }}>Verdict</label>
                  <input value={verdict} onChange={(e) => setVerdict(e.target.value)} placeholder="e.g. Fair condition, needs new battery" style={inputStyle} />
                </div>

                {/* Bill items */}
                <div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text2)", marginBottom: "0.6rem" }}>BILL ITEMS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {items.map((it, idx) => (
                      <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 70px 90px 34px", gap: "0.5rem" }}>
                        <input placeholder="Item name (optional)" value={it.name} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], name: e.target.value }; setItems(n); }} style={inputStyle} />
                        <input type="number" min={1} placeholder="Qty" value={it.qty} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], qty: Number(e.target.value) }; setItems(n); }} style={inputStyle} />
                        <input type="number" min={0} placeholder="₹" value={it.rate} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], rate: Number(e.target.value) }; setItems(n); }} style={inputStyle} />
                        <button
                          onClick={() => setItems(items.filter((_, i2) => i2 !== idx))}
                          style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--danger)", cursor: "pointer" }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setItems([...items, { name: "", qty: 1, rate: 0 }])}
                      style={{
                        alignSelf: "flex-start", padding: "0.4rem 0.8rem", background: "var(--surface2)",
                        border: "1px dashed var(--border)", borderRadius: "var(--radius)", color: "var(--text2)",
                        fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      + Add item
                    </button>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--text2)" }}>
                    <span>Service fee</span>
                    <span>{formatCurrency(350)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem", fontSize: "0.95rem", fontWeight: 800, color: "var(--text)" }}>
                    <span>Total</span>
                    <span>{formatCurrency(subtotal + 350)}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.25rem" }}>Bill Note</label>
                  <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional note for the customer" style={inputStyle} />
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    onClick={handleGenerateBill}
                    disabled={billSubmitting}
                    style={{
                      flex: 1, padding: "0.8rem", background: "var(--primary)", color: "#fff",
                      border: "none", borderRadius: "var(--radius)", fontWeight: 700, cursor: "pointer",
                      opacity: billSubmitting ? 0.6 : 1,
                    }}
                  >
                    {billSubmitting ? "Generating..." : "Generate Bill"}
                  </button>
                  <button
                    onClick={() => setBillBooking(null)}
                    style={{ padding: "0.8rem 1.25rem", background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontWeight: 600, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
