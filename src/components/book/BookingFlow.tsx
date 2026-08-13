"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRANDS, TIME_SLOTS, PHONE_CONDITIONS, DEFAULT_MODELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { DatePicker } from "@/components/DatePicker";
import { useToast } from "@/components/ToastProvider";
import Link from "next/link";

const STEPS = ["Phone", "Location", "Review", "Done"];

export default function BookingFlow() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingNo, setBookingNo] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [models, setModels] = useState<string[]>([]);
  const [customModel, setCustomModel] = useState(false);
  const [modelSearch, setModelSearch] = useState("");
  const [minDate, setMinDate] = useState("");
  const [data, setData] = useState({
    phone: { brand: "", model: "", condition: "" },
    address: { line1: "", city: "", pincode: "", landmark: "" },
    meetDate: "",
    timeSlot: "",
  });

  useEffect(() => {
    fetch("/api/phones?distinct=brand")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.brands) && d.brands.length > 0) {
          setBrands(d.brands);
        } else {
          setBrands(Array.from(BRANDS));
        }
        setBrandsLoading(false);
      })
      .catch(() => {
        setBrands(Array.from(BRANDS));
        setBrandsLoading(false);
      });
  }, []);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    setMinDate(today.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    try {
      const draft = localStorage.getItem("bookingDraft");
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.phone) {
          setData(prev => ({ ...prev, ...parsed }));
          if (parsed.phone.brand && parsed.phone.model && parsed.phone.condition) {
            setStep(1);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (step < 3) {
      localStorage.setItem("bookingDraft", JSON.stringify(data));
    } else {
      localStorage.removeItem("bookingDraft");
    }
  }, [data, step]);

  useEffect(() => {
    if (!data.phone.brand) return;
    setCustomModel(false);
    setModelSearch(""); // Reset search on brand change
    fetch(`/api/phones?brand=${encodeURIComponent(data.phone.brand)}`)
      .then(r => r.json())
      .then(d => {
        const dbModels = Array.isArray(d?.phones) ? d.phones.filter((p: any) => p?.model).map((p: any) => p.model) : [];
        setModels(dbModels.length > 0 ? dbModels : DEFAULT_MODELS[data.phone.brand] || []);
      })
      .catch(() => setModels(DEFAULT_MODELS[data.phone.brand] || []));
  }, [data.phone.brand]);

  const update = (partial: any) => setData(prev => ({ ...prev, ...partial }));
  const updatePhone = (partial: any) => update({ phone: { ...data.phone, ...partial } });
  const updateAddress = (partial: any) => update({ address: { ...data.address, ...partial } });

  const canNext = () => {
    if (step === 0) return data.phone.brand && data.phone.model && data.phone.condition;
    if (step === 1) return data.address.line1 && data.address.city && data.address.pincode && data.meetDate && data.timeSlot;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setBookingNo(result.booking.bookingNo);
      setStep(3);
    } catch (err) {
      toast("error", "Booking failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pillStyle = (selected: boolean) => ({
    padding: "0.75rem 1.25rem",
    borderRadius: "var(--radius)",
    border: `2px solid ${selected ? "var(--primary)" : "var(--border)"}`,
    background: selected ? "var(--primary)" : "var(--surface)",
    color: selected ? "#fff" : "var(--text)",
    fontWeight: 600 as const,
    fontSize: "0.9rem",
    cursor: "pointer" as const,
    transition: "all 0.2s",
    textAlign: "center" as const,
  });

  const inputStyle = {
    width: "100%", padding: "0.875rem 1rem",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "1rem",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem" }}>
      {/* Step Indicator */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", gap: 8 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : undefined }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: i <= step ? "var(--primary)" : "var(--surface2)",
              color: i <= step ? "#fff" : "var(--text2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.8rem", flexShrink: 0,
            }}>{i < step ? "✓" : i + 1}</div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < step ? "var(--primary)" : "var(--border)", margin: "0 4px" }} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {/* Step 0: Phone */}
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Select Your Phone</h2>
              <p style={{ color: "var(--text2)", marginBottom: "1rem", fontSize: "0.9rem" }}>Brand</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {brandsLoading ? (
                  <span style={{ fontSize: "0.85rem", color: "var(--text2)", gridColumn: "1 / -1" }}>Loading brands…</span>
                ) : (
                  brands.map(b => (
                    <motion.button key={b} whileTap={{ scale: 0.95 }} onClick={() => updatePhone({ brand: b, model: "" })} style={pillStyle(data.phone.brand === b)}>{b}</motion.button>
                  ))
                )}
              </div>
              {data.phone.brand && (
                <>
                  <p style={{ color: "var(--text2)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>Model</p>
                  {customModel ? (
                    <input
                      autoFocus
                      placeholder="Type your model (e.g. iPhone 15 Pro Max)"
                      value={data.phone.model}
                      onChange={e => updatePhone({ model: e.target.value })}
                      style={{ ...inputStyle, marginBottom: "0.5rem" }}
                    />
                  ) : (
                    <div>
                      {/* Search Bar */}
                      <div style={{ position: "relative", marginBottom: "0.65rem" }}>
                        <svg
                          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text2)", pointerEvents: "none" }}
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                          placeholder={`Search ${data.phone.brand} models...`}
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          style={{ ...inputStyle, paddingLeft: "2.4rem", paddingRight: "2.4rem", height: "40px" }}
                        />
                        {modelSearch && (
                          <button
                            type="button"
                            onClick={() => setModelSearch("")}
                            aria-label="Clear search"
                            style={{
                              position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)",
                              background: "var(--surface2)", border: "none", color: "var(--text2)",
                              cursor: "pointer", width: 26, height: 26, borderRadius: "50%",
                              display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          </button>
                        )}
                      </div>

                      {/* Filtered Grid */}
                      {(() => {
                        const filtered = models.filter((m) => m.toLowerCase().includes(modelSearch.toLowerCase()));
                        if (filtered.length === 0) {
                          return (
                            <div style={{ textAlign: "center", padding: "1.25rem 0", color: "var(--text2)", fontSize: "0.85rem", border: "1px dashed var(--border)", borderRadius: "var(--radius)", marginBottom: "0.5rem" }}>
                              No matching models found.
                            </div>
                          );
                        }
                        return (
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                            gap: "0.45rem",
                            maxHeight: "170px",
                            overflowY: "auto",
                            paddingRight: "0.25rem",
                            marginBottom: "0.5rem"
                          }}>
                            {filtered.map((m) => (
                              <motion.button
                                type="button"
                                key={m} whileTap={{ scale: 0.95 }}
                                onClick={() => updatePhone({ model: m })}
                                style={pillStyle(data.phone.model === m)}
                              >
                                {m}
                              </motion.button>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  <button
                    onClick={() => { setCustomModel(v => !v); if (!customModel) updatePhone({ model: "" }); }}
                    style={{
                      background: "transparent", border: "none", color: "var(--primary)",
                      fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                      padding: "0.35rem 0", textDecoration: "underline", textUnderlineOffset: 3,
                      marginBottom: "1.5rem", display: "inline-block"
                    }}
                  >
                    {customModel ? "← Choose from list instead" : "My model isn't listed — enter it manually"}
                  </button>
                  <p style={{ color: "var(--text2)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>Condition</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.5rem" }}>
                    {PHONE_CONDITIONS.map(c => (
                      <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => updatePhone({ condition: c })} style={pillStyle(data.phone.condition === c)}>{c}</motion.button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 1: Address & Time */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Where & When</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input placeholder="Address Line 1 *" value={data.address.line1} onChange={e => updateAddress({ line1: e.target.value })} style={inputStyle} required />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <input placeholder="City *" value={data.address.city} onChange={e => updateAddress({ city: e.target.value })} style={inputStyle} required />
                  <input placeholder="Pincode *" value={data.address.pincode} onChange={e => updateAddress({ pincode: e.target.value })} style={inputStyle} required />
                </div>
                <input placeholder="Landmark (optional)" value={data.address.landmark} onChange={e => updateAddress({ landmark: e.target.value })} style={inputStyle} />
                <p style={{ color: "var(--text2)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Preferred Date</p>
                <DatePicker value={data.meetDate} onChange={v => update({ meetDate: v })} min={minDate} />
                <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Time Slot</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {TIME_SLOTS.map(t => (
                    <motion.button key={t} whileTap={{ scale: 0.95 }} onClick={() => update({ timeSlot: t })} style={pillStyle(data.timeSlot === t)}>{t}</motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Review & Confirm</h2>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "1.5rem" }}>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ color: "var(--text2)", fontSize: "0.85rem" }}>Phone</span>
                  <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{data.phone.brand} {data.phone.model}</p>
                  <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>{data.phone.condition}</p>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ color: "var(--text2)", fontSize: "0.85rem" }}>Address</span>
                  <p style={{ fontWeight: 500 }}>{data.address.line1}, {data.address.city} {data.address.pincode}</p>
                  {data.address.landmark && <p style={{ color: "var(--text2)", fontSize: "0.875rem" }}>Near {data.address.landmark}</p>}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <span style={{ color: "var(--text2)", fontSize: "0.85rem" }}>When</span>
                  <p style={{ fontWeight: 500 }}>{data.meetDate && formatDate(data.meetDate)} • {data.timeSlot}</p>
                </div>
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: 600 }}>Inspection Fee</span>
                  <span style={{ fontWeight: 700, color: "var(--primary)", fontSize: "1.15rem" }}>₹350</span>
                </div>
                <p style={{ color: "var(--text2)", fontSize: "0.8rem", marginTop: "0.5rem" }}>Payable after inspection is complete</p>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                style={{
                  width: 80, height: 80, borderRadius: "50%", background: "var(--success)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.5rem", margin: "0 auto 1.5rem",
                }}
              >✓</motion.div>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>Booking Confirmed!</h2>
              <p style={{ color: "var(--text2)", marginBottom: "1rem" }}>Our team will assign a technician shortly</p>
              <div style={{
                display: "inline-block", padding: "0.75rem 1.5rem",
                background: "var(--surface2)", borderRadius: "var(--radius)",
                fontWeight: 700, fontSize: "1.25rem", marginBottom: "2rem", letterSpacing: "0.05em"
              }}>{bookingNo}</div>
              <br />
              <Link href="/account" style={{
                display: "inline-block", padding: "1rem 2rem",
                background: "var(--primary)", color: "#fff",
                borderRadius: "var(--radius)", textDecoration: "none", fontWeight: 600,
              }}>View My Bookings</Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Buttons */}
      {step < 3 && (
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} style={{
              flex: 1, padding: "1rem", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", background: "var(--surface)",
              color: "var(--text)", fontWeight: 600, fontSize: "1rem", cursor: "pointer",
            }}>Back</button>
          )}
          <button
            onClick={() => step === 2 ? handleSubmit() : setStep(step + 1)}
            disabled={!canNext() || loading}
            style={{
              flex: 1, padding: "1rem", border: "none",
              borderRadius: "var(--radius)", background: canNext() ? "var(--primary)" : "var(--border)",
              color: "#fff", fontWeight: 700, fontSize: "1rem",
              cursor: canNext() && !loading ? "pointer" : "not-allowed",
              opacity: canNext() ? 1 : 0.5, transition: "all 0.2s",
            }}
          >{step === 2 ? (loading ? "Booking..." : "Confirm Booking") : "Next"}</button>
        </div>
      )}
    </div>
  );
}
