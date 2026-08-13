"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BRANDS, PHONE_CONDITIONS, DEFAULT_MODELS } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";

const steps = [
  { icon: "📱", title: "Select Your Phone", desc: "Choose brand, model & current condition" },
  { icon: "📍", title: "Tell Us Where", desc: "Enter your address & pick a convenient time" },
  { icon: "🔍", title: "We Inspect", desc: "Our technician visits & checks 30+ test points" },
  { icon: "📋", title: "Get Your Report", desc: "Detailed inspection report & pay online" },
];

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    title: "30+ Point Check",
    desc: "Display, camera, sensors, battery — every component tested by a certified technician.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: "Fair Pricing",
    desc: "₹350 flat inspection fee. No hidden charges, no markups, ever.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Verified Reports",
    desc: "Share your inspection report with any buyer or seller. Trusted proof, instantly.",
  },
];

const inputStyle = {
  width: "100%", padding: "0.75rem 1rem", background: "var(--surface2)",
  border: "1px solid var(--border)", borderRadius: "var(--radius)",
  color: "var(--text)", fontSize: "0.9rem", outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

export default function LandingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBlur = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(10px)"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const [brands, setBrands] = useState<string[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [phone, setPhone] = useState({ brand: "", model: "", condition: "" });
  const [models, setModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [modelsSource, setModelsSource] = useState<"db" | "builtin">("builtin");
  const [customModel, setCustomModel] = useState(false);
  const [modelSearch, setModelSearch] = useState("");

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
    if (!phone.brand) return;
    setModelsLoading(true);
    setModelsSource("builtin");
    setCustomModel(false);
    setModelSearch(""); // Reset search on brand change
    fetch(`/api/phones?brand=${encodeURIComponent(phone.brand)}`)
      .then((r) => r.json())
      .then((d) => {
        const dbModels = Array.isArray(d?.phones) ? d.phones.filter((p: any) => p?.model).map((p: any) => p.model) : [];
        if (dbModels.length > 0) {
          setModels(dbModels);
          setModelsSource("db");
        } else {
          setModels(DEFAULT_MODELS[phone.brand] || []);
        }
        setModelsLoading(false);
      })
      .catch(() => {
        setModels(DEFAULT_MODELS[phone.brand] || []);
        setModelsLoading(false);
      });
  }, [phone.brand]);

  const handleBook = () => {
    if (!phone.brand || !phone.model || !phone.condition) return;
    localStorage.setItem("bookingDraft", JSON.stringify({ phone }));
    if (user) {
      router.push("/book");
    } else {
      router.push("/login?redirect=/book");
    }
  };

  const ready = phone.brand && phone.model && phone.condition;

  const pillStyle = (selected: boolean) => ({
    padding: "0.55rem 0.95rem",
    borderRadius: "var(--radius-sm)",
    border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
    background: selected ? "var(--primary)" : "var(--surface)",
    color: selected ? "#fff" : "var(--text)",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "center" as const,
    outline: "none",
    boxShadow: selected ? "0 4px 12px color-mix(in srgb, var(--primary) 25%, transparent)" : "none",
  });

  const labelStyle = {
    fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)",
    display: "block", marginBottom: "0.5rem", letterSpacing: "0.01em",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* ── Top bar ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 64, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem", borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--surface) 82%, transparent)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 10px color-mix(in srgb, var(--primary) 35%, transparent)",
          }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="2" width="12" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em", color: "var(--text)" }}>
            Check<span style={{ color: "var(--primary)" }}>My</span>Phone
          </span>
        </div>

        <nav style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          {[
            { href: "#how", label: "How it works" },
            { href: "#why", label: "Why us" },
          ].map((l) => (
            <a key={l.href} href={l.href} style={{
              padding: "0.5rem 0.9rem", color: "var(--text2)", textDecoration: "none",
              fontWeight: 500, fontSize: "0.9rem", borderRadius: "var(--radius-sm)",
              transition: "color 0.2s, background 0.2s",
            }}>{l.label}</a>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ThemeToggle />
          {authLoading ? (
            <span style={{
              padding: "0.5rem 1.25rem", color: "var(--text2)",
              border: "1px solid var(--border)", borderRadius: "var(--radius)",
              fontSize: "0.875rem", fontWeight: 600,
            }}>...</span>
          ) : user ? (
            <Link href={user.role === "admin" ? "/admin" : user.role === "technician" ? "/technician" : "/account"} style={{
              padding: "0.5rem 1.25rem", background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text)", borderRadius: "var(--radius)", textDecoration: "none",
              fontWeight: 600, fontSize: "0.875rem",
            }}>Dashboard</Link>
          ) : (
            <Link href="/login" style={{
              padding: "0.55rem 1.35rem", background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              color: "#fff", borderRadius: "var(--radius)", textDecoration: "none",
              fontWeight: 600, fontSize: "0.875rem",
              boxShadow: "0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent)",
            }}>Sign in</Link>
          )}
        </div>
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="hero-wrap" style={{
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexWrap: "wrap", gap: "3rem",
        minHeight: "100vh", padding: "7rem 1.5rem 5rem",
        maxWidth: 1240, margin: "0 auto",
      }}>
        {/* Ambient glows */}
        <div style={{
          position: "absolute", top: "-15%", right: "-10%", width: 480, height: 480,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 16%, transparent), transparent 65%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-20%", left: "-12%", width: 420, height: 420,
          borderRadius: "50%", pointerEvents: "none",
          background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 10%, transparent), transparent 65%)",
        }} />
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.45,
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        {/* Parallax hero content */}
        <motion.div
          style={{
            display: "contents",
            filter: heroBlur, opacity: heroOpacity,
          }}
        >
        <motion.div style={{ flex: "1 1 460px", position: "relative", scale: heroScale }}>
        {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.4rem 0.9rem", borderRadius: 999, marginBottom: "1.5rem",
              background: "color-mix(in srgb, var(--primary) 10%, transparent)",
              border: "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
              color: "var(--primary)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.02em",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 0 3px color-mix(in srgb, var(--success) 25%, transparent)" }} />
            Doorstep inspections · Across your city
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.1rem)", fontWeight: 800, lineHeight: 1.06,
              letterSpacing: "-0.045em", marginBottom: "1.5rem",
            }}
          >
            Know exactly what{" "}
            <span className="gradient-text">your phone is worth</span> before you buy or sell
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ color: "var(--text2)", fontSize: "1.15rem", lineHeight: 1.65, maxWidth: 520, marginBottom: "2rem" }}
          >
            A certified technician inspects 30+ checkpoints at your doorstep and generates a verified,
            shareable report — so every used-phone deal is fair and transparent.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2.5rem" }}
          >
            <a href="#book" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.9rem 1.6rem", borderRadius: "var(--radius)",
              background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
              boxShadow: "var(--glow)",
            }}>
              Book an Inspection
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <a href="#how" style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.9rem 1.6rem", borderRadius: "var(--radius)",
              background: "var(--surface)", border: "1px solid var(--border)",
              color: "var(--text)", textDecoration: "none", fontWeight: 600, fontSize: "0.95rem",
              transition: "border-color 0.2s, background 0.2s",
            }}>How it works</a>
          </motion.div>

                    {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            style={{
              display: "flex", gap: "2.25rem", flexWrap: "wrap",
              paddingTop: "1.75rem", borderTop: "1px solid var(--border)",
            }}
          >
            {[
              { value: "₹350", label: "Flat fee" },
              { value: "30+", label: "Checkpoints" },
              { value: "60 min", label: "Avg. visit" },
              { value: "100%", label: "Verified report" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text)" }}>{s.value}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text2)", fontWeight: 500, marginTop: "0.15rem" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Phone mockup + floating cards (decorative) */}
        <motion.div
          className="mockup-wrap"
          initial={{ opacity: 0, y: 40, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -3 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ flex: "1 1 240px", display: "flex", justifyContent: "center", position: "relative" }}
        >
          <div style={{
            width: 210, height: 400, borderRadius: 28,
            background: "linear-gradient(160deg, var(--surface2), var(--surface))",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-xl)",
            padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem",
          }}>
            <div style={{ alignSelf: "center", width: 84, height: 18, borderRadius: 99, background: "var(--border)" }} />
            <div style={{
              flex: 1, borderRadius: 18, background: "var(--surface2)",
              border: "1px solid var(--border)", padding: "1rem",
              display: "flex", flexDirection: "column", gap: "0.5rem",
            }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--primary)" }}>Inspection Report</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 800 }}>iPhone 15 Pro</div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ flex: 1, height: 6, borderRadius: 99, background: "var(--border)" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--success)" }}>96%</span>
              </div>
              {["Display", "Battery", "Camera"].map((t) => (
                <div key={t} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text2)" }}>
                  <span>{t}</span>
                  <span style={{ color: "var(--success)", fontWeight: 700 }}>PASS</span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating chip: technician en route */}
          <div className="chip-float" style={{
            position: "absolute", top: "12%", right: "-1.5rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.55rem 0.9rem", borderRadius: "var(--radius)",
            background: "color-mix(in srgb, var(--surface) 90%, transparent)",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 0 3px color-mix(in srgb, var(--success) 25%, transparent)" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)" }}>Technician en route</span>
          </div>

          {/* Floating chip: report ready */}
          <div className="chip-float" style={{
            position: "absolute", bottom: "10%", left: "-2rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.55rem 0.9rem", borderRadius: "var(--radius)",
            background: "color-mix(in srgb, var(--surface) 90%, transparent)",
            border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)",
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          }}>
            <span style={{ width: 30, height: 30, borderRadius: "var(--radius-sm)", background: "color-mix(in srgb, var(--primary) 14%, transparent)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </span>
            <div>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text)" }}>Report ready</div>
              <div style={{ fontSize: "0.68rem", color: "var(--text2)" }}>Shareable & verified</div>
            </div>
          </div>
        </motion.div>

        {/* Right: Booking card */}
        <motion.div
          id="book"
          className="booking-card"
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            flex: "1 1 400px", maxWidth: 500, width: "100%",
            background: "color-mix(in srgb, var(--surface) 92%, transparent)",
            backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
            padding: "2.25rem 2rem", boxShadow: "var(--shadow-xl)",
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 3,
            borderRadius: "0 0 6px 6px",
            background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Book Doorstep Inspection</h2>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.3rem 0.75rem", borderRadius: 999,
              background: "color-mix(in srgb, var(--success) 12%, transparent)",
              color: "var(--success)", fontSize: "0.78rem", fontWeight: 700,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)" }} />
              ₹350 flat
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.35rem" }}>
            {/* Brand */}
            <div>
              <label style={labelStyle}>Brand</label>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {brandsLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text2)" }}>
                    <div style={{ width: 14, height: 14, border: "2px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Loading brands…
                  </div>
                ) : (
                  brands.map((b) => (
                    <motion.button
                      key={b} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setPhone({ ...phone, brand: b, model: "", condition: "" })}
                      style={pillStyle(phone.brand === b)}
                    >
                      {b}
                    </motion.button>
                  ))
                )}
              </div>
            </div>

            {/* Model */}
            {phone.brand && (
              <div>
                <label style={labelStyle}>Model</label>
                {modelsLoading ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.85rem", color: "var(--text2)" }}>
                    <div style={{ width: 16, height: 16, border: "2px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Loading models…
                  </div>
                ) : models.length > 0 ? (
                  <div>
                    {customModel ? (
                      <input
                        autoFocus
                        placeholder="Type your model (e.g. iPhone 15 Pro Max)"
                        value={phone.model}
                        onChange={(e) => setPhone({ ...phone, model: e.target.value })}
                        style={inputStyle}
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
                            placeholder={`Search ${phone.brand} models...`}
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
                              <div style={{ textAlign: "center", padding: "1.25rem 0", color: "var(--text2)", fontSize: "0.85rem", border: "1px dashed var(--border)", borderRadius: "var(--radius)" }}>
                                No matching models found.
                              </div>
                            );
                          }
                          return (
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: "0.45rem",
                              maxHeight: "170px",
                              overflowY: "auto",
                              paddingRight: "0.25rem",
                            }}>
                              {filtered.map((m) => (
                                <motion.button
                                  type="button"
                                  key={m} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                  onClick={() => setPhone({ ...phone, model: m })}
                                  style={pillStyle(phone.model === m)}
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
                      onClick={() => { setCustomModel(v => !v); if (!customModel) setPhone({ ...phone, model: "" }); }}
                      style={{
                        background: "transparent", border: "none", color: "var(--primary)",
                        fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                        padding: "0.35rem 0", textDecoration: "underline", textUnderlineOffset: 3,
                        marginTop: "0.6rem", display: "inline-block"
                      }}
                    >
                      {customModel ? "← Choose from list instead" : "My model isn't listed — enter it manually"}
                    </button>
                  </div>
                ) : (
                  <input
                    placeholder="Enter model name manually"
                    value={phone.model}
                    onChange={(e) => setPhone({ ...phone, model: e.target.value })}
                    style={inputStyle}
                  />
                )}
              </div>
            )}

            {/* Condition */}
            {phone.brand && phone.model && (
              <div>
                <label style={labelStyle}>Condition</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.4rem" }}>
                  {PHONE_CONDITIONS.map((c) => (
                    <motion.button
                      key={c} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setPhone({ ...phone, condition: c })}
                      style={pillStyle(phone.condition === c)}
                    >
                      {c}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <motion.button
              whileHover={ready ? { scale: 1.01, boxShadow: "0 8px 24px color-mix(in srgb, var(--primary) 45%, transparent)" } : {}}
              whileTap={ready ? { scale: 0.99 } : {}}
              onClick={handleBook}
              disabled={!ready}
              aria-disabled={!ready}
              title={ready ? "Continue to booking" : "Select brand, model and condition first"}
              style={{
                padding: "1rem",
                background: ready ? "linear-gradient(135deg, var(--primary), var(--primary-hover))" : "var(--border)",
                color: ready ? "#fff" : "var(--text2)",
                border: "none", borderRadius: "var(--radius)", fontWeight: 700, fontSize: "1rem",
                cursor: ready ? "pointer" : "not-allowed",
                transition: "all 0.2s ease", width: "100%",
                boxShadow: ready ? "0 6px 18px color-mix(in srgb, var(--primary) 35%, transparent)" : "none",
                outline: "none",
              }}
            >
              {ready ? "Book Doorstep Inspection →" : "Select brand, model & condition"}
            </motion.button>

            <p style={{ textAlign: "center", color: "var(--text2)", fontSize: "0.8rem" }}>
              Free cancellation · Pay after inspection
            </p>
          </div>
        </motion.div>
        </motion.div>
      </section>

      {/* ── Popular brands strip ── */}
      <section style={{ padding: "3.5rem 0 4.5rem", borderTop: "1px solid var(--border)" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "2rem", padding: "0 1.5rem" }}>
            <span style={{ color: "var(--text2)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              We inspect every major brand
            </span>
          </div>
          <Marquee
            items={Array.isArray(brands) && brands.length ? brands : Array.from(BRANDS)}
            onItemClick={(b) => { setPhone({ brand: b, model: "", condition: "" }); document.getElementById("book")?.scrollIntoView({ behavior: "smooth" }); }}
          />
        </Reveal>
      </section>

      {/* ── How It Works ── */}
      <section id="how" style={{ padding: "5.5rem 1.5rem", maxWidth: 1080, margin: "0 auto", scrollMarginTop: "4rem" }}>
        <Reveal>
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 3.5rem" }}>
            <div style={{
              display: "inline-block", padding: "0.35rem 0.85rem", borderRadius: 999, marginBottom: "1rem",
              background: "color-mix(in srgb, var(--primary) 10%, transparent)",
              color: "var(--primary)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>Process</div>
            <WordReveal
              text="How it works"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.75rem", justifyContent: "center" }}
            />
            <p style={{ color: "var(--text2)", fontSize: "1rem", lineHeight: 1.6 }}>
              From booking to verified report in four simple steps.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1.5rem" }}>
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -5 }}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "2rem 1.5rem", textAlign: "center",
                  boxShadow: "var(--shadow)", transition: "box-shadow 0.3s, transform 0.3s",
                  height: "100%",
                }}
              >
                <div style={{
                  width: 58, height: 58, borderRadius: "50%", margin: "0 auto 1.1rem",
                  background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--primary) 5%, transparent))",
                  border: "1px solid color-mix(in srgb, var(--primary) 25%, transparent)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", position: "relative",
                }}>
                  {step.icon}
                  <span style={{
                    position: "absolute", top: -6, right: -6,
                    width: 24, height: 24, borderRadius: "50%",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
                    color: "#fff", fontSize: "0.72rem", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 10px color-mix(in srgb, var(--primary) 40%, transparent)",
                  }}>{i + 1}</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{step.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "0.875rem", lineHeight: 1.55 }}>{step.desc}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="why" style={{ padding: "5rem 1.5rem", background: "var(--surface2)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", scrollMarginTop: "4rem" }}>
          <Reveal>
            <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 3.5rem" }}>
              <div style={{
                display: "inline-block", padding: "0.35rem 0.85rem", borderRadius: 999, marginBottom: "1rem",
                background: "color-mix(in srgb, var(--accent) 12%, transparent)",
                color: "var(--accent)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>Why us</div>
              <WordReveal
                text="Peace of mind, every time"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.75rem", justifyContent: "center" }}
              />
              <p style={{ color: "var(--text2)", fontSize: "1rem", lineHeight: 1.6 }}>
                A professional inspection removes the guesswork from every used-phone transaction.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  style={{
                    background: "var(--surface)", borderRadius: "var(--radius-lg)",
                    padding: "2rem", boxShadow: "var(--shadow)", transition: "all 0.3s", height: "100%",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{
                    width: 50, height: 50, borderRadius: "var(--radius)",
                    background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
                    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.1rem", boxShadow: "0 6px 16px color-mix(in srgb, var(--primary) 30%, transparent)",
                  }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{f.title}</h3>
                  <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: 1080, margin: "0 auto" }}>
        <Reveal>
          <div style={{
            position: "relative", overflow: "hidden", textAlign: "center",
            borderRadius: "var(--radius-lg)", padding: "3.5rem 2rem",
            background: "linear-gradient(135deg, color-mix(in srgb, var(--primary) 90%, var(--text)), color-mix(in srgb, var(--primary-hover) 90%, var(--text)))",
            color: "#fff", boxShadow: "var(--shadow-xl)",
          }}>
            <div style={{
              position: "absolute", inset: 0, opacity: 0.15,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
                Sell or buy with total confidence
              </h2>
              <p style={{ fontSize: "1rem", opacity: 0.9, marginBottom: "2rem" }}>
                Get your phone inspected today — the ₹350 fee pays for itself on your first fair deal.
              </p>
              <a href="#book" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.95rem 2rem", borderRadius: "var(--radius)",
                background: "#fff", color: "var(--primary-hover)",
                textDecoration: "none", fontWeight: 800, fontSize: "0.95rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
              }}>
                Start Your Inspection
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "3rem 1.5rem 4rem", textAlign: "center",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem", marginBottom: "0.75rem" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="2" width="12" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <span style={{ fontWeight: 800, color: "var(--text)" }}>CheckMyPhone</span>
        </div>
        <p style={{ color: "var(--text2)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
          Professional phone inspection reports · © {new Date().getFullYear()}
        </p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/book" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>Book Inspection</Link>
          <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem" }}>Sign in</Link>
        </div>
      </footer>
    </div>
  );
}
