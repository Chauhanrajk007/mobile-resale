"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui";
import { BOOKING_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function TechDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
                <div>
                  <div style={{ fontWeight: 'bold' }}>{b.phone?.brand} {b.phone?.model}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
                    {b.bookingNo} · {b.customer?.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>
                    {b.meetDate ? formatDate(b.meetDate) : ""} · {b.timeSlot}
                  </div>
                </div>
                <span style={{
                  whiteSpace: 'nowrap', padding: '0.25rem 0.6rem', borderRadius: 999,
                  background: `color-mix(in srgb, ${statusInfo(b.status).color} 14%, transparent)`,
                  color: statusInfo(b.status).color, fontSize: '0.72rem', fontWeight: 700,
                }}>
                  {statusInfo(b.status).label}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
