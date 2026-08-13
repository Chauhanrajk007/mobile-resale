"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui";
import { useToast } from "@/components/ToastProvider";

export default function ReportView({ inspection }: { inspection: any }) {
  const { toast } = useToast();
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Inspection Report - ${inspection.brand} ${inspection.model}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast("success", "Link copied to clipboard");
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div className="no-print" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleShare}
          style={{ padding: '0.5rem 1rem', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer' }}
        >
          Share Link
        </button>
        <button 
          onClick={handlePrint}
          style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
        >
          Print Report
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          padding: '3rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--surface)' // solid background for report
        }}
      >
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.05em', marginBottom: '0.5rem' }}>CheckMyPhone</h1>
            <p style={{ color: 'var(--text2)' }}>Certified Inspection Report</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>ID: {inspection.inspectionId}</div>
            <div style={{ color: 'var(--text2)' }}>{new Date(inspection.createdAt).toLocaleDateString()}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <Badge tone={inspection.status === 'completed' ? 'green' : 'amber'}>{inspection.status.toUpperCase()}</Badge>
            </div>
          </div>
        </header>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Device Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Brand</span>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{inspection.brand || "N/A"}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Model</span>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{inspection.model || "N/A"}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Storage</span>
              <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>{inspection.variant || "N/A"}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>IMEI</span>
              <div style={{ fontWeight: '600', fontSize: '1.125rem', fontFamily: 'monospace' }}>{inspection.imei || "N/A"}</div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Condition Summary</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Screen Condition</span>
              <div style={{ fontWeight: '600' }}>{inspection.condition?.screen || "N/A"}</div>
            </div>
            <div>
              <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Body Condition</span>
              <div style={{ fontWeight: '600' }}>{inspection.condition?.body || "N/A"}</div>
            </div>
          </div>
        </section>

        <div style={{ 
          background: 'var(--surface2)', 
          padding: '2rem', 
          borderRadius: 'var(--radius)', 
          textAlign: 'center',
          marginTop: '3rem',
          border: '1px dashed var(--border)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>Inspection Completed</h3>
          <p style={{ color: 'var(--text2)', marginTop: '0.5rem' }}>This device has been professionally inspected.</p>
        </div>
      </motion.div>
    </div>
  );
}
