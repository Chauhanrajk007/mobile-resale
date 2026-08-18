"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ToastProvider";
import { formatCurrency } from "@/lib/utils";

const CONDITION_FIELDS = [
  { key: "screen", label: "Screen" },
  { key: "battery", label: "Battery" },
  { key: "body", label: "Body" },
  { key: "camera", label: "Camera" },
  { key: "buttons", label: "Buttons" },
  { key: "overall", label: "Overall" },
] as const;

type BillItem = { name: string; qty: number; rate: number };

export default function BillGeneratorModal({
  booking,
  onClose,
  onGenerated,
  demo = false,
}: {
  booking: any;
  onClose: () => void;
  onGenerated?: (booking: any) => void;
  demo?: boolean;
}) {
  const { toast } = useToast();
  const [condition, setCondition] = useState<Record<string, number>>({ screen: 0, battery: 0, body: 0, camera: 0, buttons: 0, overall: 0 });
  const [issues, setIssues] = useState(booking?.review?.issues || "");
  const [verdict, setVerdict] = useState(booking?.review?.verdict || "");
  const [items, setItems] = useState<BillItem[]>([{ name: "", qty: 1, rate: 0 }]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputStyle = {
    width: "100%", padding: "0.6rem 0.75rem", background: "var(--surface2)",
    border: "1px solid var(--border)", borderRadius: "var(--radius)",
    color: "var(--text)", fontSize: "0.875rem", outline: "none",
  };

  const subtotal = items.reduce((s, it) => s + (it.rate || 0) * (it.qty || 1), 0);

  const handleGenerate = async () => {
    setSubmitting(true);
    try {
      if (demo) {
        await new Promise((r) => setTimeout(r, 500));
        toast("success", "Bill generated (demo)", "In the real app this saves the bill and unlocks payment.");
        onGenerated?.({ ...booking, status: "priced" });
        return;
      }
      const cleanItems = items
        .filter((it) => it.name.trim() && it.rate >= 0)
        .map((it) => ({ name: it.name.trim(), qty: it.qty || 1, rate: it.rate || 0 }));
      const res = await fetch(`/api/bookings/${booking._id}/bill`, {
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
      onGenerated?.(data.booking || booking);
    } catch (err) {
      toast("error", "Failed to generate bill", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", padding: "1.25rem", maxWidth: 520, width: "100%",
            maxHeight: "92vh", overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              Generate Bill · {booking.bookingNo}
            </h3>
            <button
              onClick={onClose}
              style={{ background: "var(--surface2)", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", color: "var(--text2)", fontSize: "1.05rem", flexShrink: 0 }}
            >
              ×
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {/* Condition review */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text2)", marginBottom: "0.45rem" }}>PHONE CONDITION (0–10)</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                {CONDITION_FIELDS.map((f) => (
                  <div key={f.key}>
                    <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.2rem" }}>{f.label}</label>
                    <input
                      type="number" min={0} max={10} value={condition[f.key]}
                      onChange={(e) => setCondition({ ...condition, [f.key]: Number(e.target.value) })}
                      style={{ ...inputStyle, padding: "0.45rem 0.6rem" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <div>
                <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.2rem" }}>Issues Found</label>
                <textarea rows={2} value={issues} onChange={(e) => setIssues(e.target.value)} placeholder="e.g. scratch on screen, battery 82%" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.2rem" }}>Verdict</label>
                <input value={verdict} onChange={(e) => setVerdict(e.target.value)} placeholder="e.g. Fair condition" style={inputStyle} />
              </div>
            </div>

            {/* Bill items */}
            <div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text2)", marginBottom: "0.45rem" }}>BILL ITEMS</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {items.map((it, idx) => (
                  <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 62px 80px 30px", gap: "0.4rem" }}>
                    <input placeholder="Item name (optional)" value={it.name} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], name: e.target.value }; setItems(n); }} style={{ ...inputStyle, padding: "0.4rem 0.6rem" }} />
                    <input type="number" min={1} placeholder="Qty" value={it.qty} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], qty: Number(e.target.value) }; setItems(n); }} style={{ ...inputStyle, padding: "0.4rem 0.6rem" }} />
                    <input type="number" min={0} placeholder="₹" value={it.rate} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], rate: Number(e.target.value) }; setItems(n); }} style={{ ...inputStyle, padding: "0.4rem 0.6rem" }} />
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
                    alignSelf: "flex-start", padding: "0.3rem 0.7rem", background: "var(--surface2)",
                    border: "1px dashed var(--border)", borderRadius: "var(--radius)", color: "var(--text2)",
                    fontSize: "0.72rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  + Add item
                </button>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.6rem", fontSize: "0.8rem", color: "var(--text2)" }}>
                <span>Service fee</span>
                <span>{formatCurrency(349)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem", fontSize: "0.9rem", fontWeight: 800, color: "var(--text)" }}>
                <span>Total</span>
                <span>{formatCurrency(subtotal + 349)}</span>
              </div>
            </div>

            <div>
              <label style={{ fontSize: "0.68rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.2rem" }}>Bill Note</label>
              <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional note for the customer" style={inputStyle} />
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={handleGenerate}
                disabled={submitting}
                style={{
                  flex: 1, padding: "0.7rem", background: "var(--primary)", color: "#fff",
                  border: "none", borderRadius: "var(--radius)", fontWeight: 700, cursor: "pointer",
                  opacity: submitting ? 0.6 : 1,
                }}
              >
                {submitting ? "Generating..." : "Generate Bill"}
              </button>
              <button
                onClick={onClose}
                style={{ padding: "0.7rem 1.1rem", background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
