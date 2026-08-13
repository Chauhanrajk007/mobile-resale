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

const ICON = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const icons = {
  phone: (
    <svg width="15" height="15" viewBox="0 0 24 24" {...ICON}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  calendar: (
    <svg width="15" height="15" viewBox="0 0 24 24" {...ICON}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  pin: (
    <svg width="15" height="15" viewBox="0 0 24 24" {...ICON}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  note: (
    <svg width="15" height="15" viewBox="0 0 24 24" {...ICON}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" {...ICON}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  download: (
    <svg width="14" height="14" viewBox="0 0 24 24" {...ICON}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  user: (
    <svg width="15" height="15" viewBox="0 0 24 24" {...ICON}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

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
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}
                className="glass"
                style={{
                  padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text)' }}>
                      {b.phone?.brand} {b.phone?.model}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text2)', marginTop: '0.15rem' }}>
                      {b.bookingNo}
                    </div>
                  </div>
                  <span style={{
                    flexShrink: 0, padding: '0.3rem 0.75rem', borderRadius: 999,
                    background: `color-mix(in srgb, ${statusInfo(b.status).color} 12%, transparent)`,
                    color: statusInfo(b.status).color, fontSize: '0.75rem', fontWeight: 700,
                  }}>
                    {statusInfo(b.status).label}
                  </span>
                </div>

                {/* Info rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <span style={{ flexShrink: 0, display: 'flex', marginTop: 2, color: 'var(--text2)' }}>{icons.user}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>
                      {b.customer?.name}
                      {b.customer?.phone ? <span style={{ color: 'var(--text2)' }}> · {b.customer.phone}</span> : null}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <span style={{ flexShrink: 0, display: 'flex', marginTop: 2, color: 'var(--text2)' }}>{icons.calendar}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>
                      {b.meetDate ? formatDate(b.meetDate) : ""} · {b.timeSlot}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                    <span style={{ flexShrink: 0, display: 'flex', marginTop: 2, color: 'var(--text2)' }}>{icons.pin}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text)', lineHeight: 1.5 }}>
                      {b.address?.line1}, {b.address?.city} - {b.address?.pincode}
                      {b.address?.landmark ? ` · ${b.address.landmark}` : ""}
                    </span>
                  </div>
                  {b.adminNotes && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
                      <span style={{ flexShrink: 0, display: 'flex', marginTop: 2, color: 'var(--text2)' }}>{icons.note}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.5, fontStyle: 'italic' }}>
                        {b.adminNotes}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.1rem', borderTop: '1px solid var(--border)', paddingTop: '0.9rem' }}>
                  {canInspect(b) && (
                    <button
                      onClick={() => setInspectBooking(b)}
                      style={{
                        padding: '0.5rem 1.1rem', background: 'var(--surface2)', color: 'var(--text)',
                        border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: 600,
                        fontSize: '0.8rem', cursor: 'pointer',
                      }}
                    >
                      Inspect
                    </button>
                  )}
                  {canBill(b) && (
                    <button
                      onClick={() => setBillBooking(b)}
                      style={{
                        padding: '0.5rem 1.1rem', background: 'var(--primary)', color: '#fff',
                        border: 'none', borderRadius: 'var(--radius)', fontWeight: 600,
                        fontSize: '0.8rem', cursor: 'pointer',
                      }}
                    >
                      Generate Bill
                    </button>
                  )}
                  {!canBill(b) && ["pending", "assigned", "out_for_inspection"].includes(b.status) && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text2)' }}>
                      Inspect first to generate bill
                    </span>
                  )}
                  {b.status === "priced" && (
                    <>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)' }}>
                        {icons.clock} Payment Pending
                      </span>
                      <a href={`/invoice/${b._id}?print=1`} target="_blank" rel="noreferrer" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1.1rem',
                        background: 'var(--primary)', color: '#fff', borderRadius: 'var(--radius)',
                        textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem',
                      }}>
                        {icons.download} Download Bill PDF
                      </a>
                    </>
                  )}
                  {(b.status === "paid" || b.status === "completed") && (
                    <Link href={`/invoice/${b._id}`} style={{
                      padding: '0.5rem 1.1rem', background: 'var(--success)', color: '#fff',
                      borderRadius: 'var(--radius)', textDecoration: 'none', fontWeight: 600, fontSize: '0.8rem',
                    }}>
                      View Invoice
                    </Link>
                  )}
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
              Close Inspection
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
