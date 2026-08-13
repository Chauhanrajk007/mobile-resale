"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Badge, Spinner } from "@/components/ui";

export default function TechDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/inspections");
        if (res.ok) {
          const data = await res.json();
          setInspections(data.inspections || []);
          setStats({
            total: data.inspections?.length || 0,
            today: data.inspections?.filter((i: any) => new Date(i.createdAt).toDateString() === new Date().toDateString()).length || 0
          });
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

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '2rem' }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Hello, {user?.name}</h1>
        <p style={{ color: 'var(--text2)' }}>Ready for your next inspection?</p>
      </motion.div>

      <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          className="glass"
          style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}
        >
          <div style={{ color: 'var(--text2)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Inspections</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{stats.total}</div>
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

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ marginBottom: '2.5rem' }}>
        <Link href="/inspect" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'var(--primary)',
            color: '#fff',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '1.125rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'transform 0.2s, background 0.2s',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Start New Inspection
          </div>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Inspections</h2>
        
        {inspections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text2)', background: 'var(--surface2)', borderRadius: 'var(--radius-lg)' }}>
            No inspections found. Start your first one!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {inspections.slice(0, 5).map((insp, i) => (
              <motion.div 
                key={insp._id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
              >
                <Link href={`/report/${insp.inspectionId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="glass" style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'background 0.2s'
                  }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{insp.brand} {insp.model}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text2)' }}>ID: {insp.inspectionId}</div>
                    </div>
                    <div>
                      <Badge tone={insp.status === 'completed' ? 'green' : 'amber'}>{insp.status}</Badge>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
