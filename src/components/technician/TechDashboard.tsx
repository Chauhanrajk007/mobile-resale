"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui";
import { BOOKING_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import BillGeneratorModal from "./BillGeneratorModal";
import InspectionWizard from "@/components/inspect/InspectionWizard";

export default function TechDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [billBooking, setBillBooking] = useState<any | null>(null);
  const [inspectBooking, setInspectBooking] = useState<any | null>(null);

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
  const canBill = (b: any) => b.status === "inspected";
  const canInspect = (b: any) => ["pending", "assigned", "out_for_inspection", "inspected"].includes(b.status);

  const refreshBookings = async () => {
    const bookRes = await fetch("/api/bookings");
    if (bookRes.ok) {
      const d = await bookRes.json();
      setBookings(d.bookings || []);
    }
  };

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
                    {b.customer?.name} · {b.customer?.phone ? `📞 ${b.customer.phone}` : ""} · {b.meetDate ? formatDate(b.meetDate) : ""} · {b.timeSlot}
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
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {canInspect(b) && (
                      <button
                        onClick={() => setInspectBooking(b)}
                        style={{
                          whiteSpace: 'nowrap', padding: '0.45rem 0.9rem', background: 'var(--surface2)',
                          color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                          fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.2s',
                        }}
                      >
                        Inspect
                      </button>
                    )}
                    {canBill(b) && (
                      <button
                        onClick={() => setBillBooking(b)}
                        style={{
                          whiteSpace: 'nowrap', padding: '0.45rem 0.9rem', background: 'var(--primary)',
                          color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600,
                          fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.2s',
                        }}
                      >
                        Generate Bill
                      </button>
                    )}
                    {!canBill(b) && ["pending", "assigned", "out_for_inspection"].includes(b.status) && (
                      <span style={{ whiteSpace: 'nowrap', fontSize: '0.72rem', color: 'var(--text2)' }}>
                        Inspect first to generate bill
                      </span>
                    )}
                    {b.status === "priced" && (
                      <>
                        <span style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)' }}>
                          ⏳ Payment Pending
                        </span>
                        <a href={`/invoice/${b._id}`} target="_blank" rel="noreferrer" style={{
                          whiteSpace: 'nowrap', padding: '0.45rem 0.9rem', background: 'var(--primary)',
                          color: '#fff', borderRadius: 'var(--radius)', textDecoration: 'none',
                          fontWeight: 600, fontSize: '0.8rem', display: 'inline-block',
                        }}>
                          ⬇ Bill PDF
                        </a>
                      </>
                    )}
                    {(b.status === "paid" || b.status === "completed") && (
                      <Link href={`/invoice/${b._id}`} style={{
                        whiteSpace: 'nowrap', padding: '0.45rem 0.9rem', background: 'var(--success)',
                        color: '#fff', borderRadius: 'var(--radius)', textDecoration: 'none',
                        fontWeight: 600, fontSize: '0.8rem',
                      }}>
                        View Invoice
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {billBooking && (
        <BillGeneratorModal
          booking={billBooking}
          onClose={() => setBillBooking(null)}
          onGenerated={() => {
            setBillBooking(null);
            refreshBookings();
          }}
        />
      )}

      {inspectBooking && (
        <div style={{
          position: "fixed", inset: 0, background: "var(--bg)", zIndex: 200,
          overflowY: "auto",
        }}>
          <div style={{
            position: "sticky", top: 0, display: "flex", justifyContent: "flex-end",
            padding: "0.75rem 1rem", background: "color-mix(in srgb, var(--bg) 88%, transparent)",
            backdropFilter: "blur(6px)", zIndex: 10,
          }}>
            <button
              onClick={() => setInspectBooking(null)}
              style={{
                padding: "0.5rem 1rem", background: "var(--surface2)", color: "var(--text)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)", fontWeight: 600,
                cursor: "pointer", fontSize: "0.85rem",
              }}
            >
              ✕ Close Inspection
            </button>
          </div>
          <InspectionWizard
            initialBooking={inspectBooking}
            onComplete={() => {
              setInspectBooking(null);
              refreshBookings();
            }}
          />
        </div>
      )}
    </div>
  );
}
