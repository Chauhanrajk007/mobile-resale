"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BRANDS, PHONE_CONDITIONS, DEFAULT_MODELS } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import PhoneDismantle from "@/components/landing/PhoneDismantle";

const steps = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
    title: "Select Your Phone",
    desc: "Choose brand, model & current condition",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Where We Inspect",
    desc: "Doorstep service — tell us your location & pick a time slot",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
    title: "We Inspect",
    desc: "Certified technician checks 30+ test points on the spot",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Get Your Report",
    desc: "Detailed verified report & pay online — all in one go",
  },
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
    desc: "₹349 flat inspection fee. No hidden charges, no markups, ever.",
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
  const { user, loading: authLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (authLoading) return;
    if (!phone.brand || !phone.model || !phone.condition) {
      document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    localStorage.setItem("bookingDraft", JSON.stringify({ phone }));
    router.push("/book");
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
    <div className="landing-page" style={{ minHeight: "100vh" }}>
      {/* ── Top bar ── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 64, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem", borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--surface) 82%, transparent)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem", textDecoration: "none" }}>
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
        </Link>

        <nav className="hide-on-mobile" style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
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

        <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <ThemeToggle />
          <div style={{ position: "relative" }}>
            <button
              type="button"
              aria-label="Account menu"
              onClick={() => setMenuOpen((o) => !o)}
              style={{
                display: "flex", alignItems: "center", gap: "0.55rem",
                padding: "0.3rem 0.3rem 0.3rem 0.6rem", cursor: "pointer",
                background: "var(--surface2)", border: "1px solid var(--border)",
                borderRadius: 999, transition: "all 0.2s",
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: user ? "linear-gradient(135deg, var(--primary), var(--primary-hover))" : "var(--surface)",
                border: "1px solid var(--border)",
                color: user ? "#fff" : "var(--text2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: "0.8rem",
              }}>
                {user ? user.name.charAt(0).toUpperCase() : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
              </div>
              {user && <span className="hide-on-mobile" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>}
              <svg className="hide-on-mobile" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.25rem" }}><polyline points="6 9 12 15 18 9" /></svg>
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute", top: "calc(100% + 0.5rem)", right: 0, zIndex: 60,
                  minWidth: 200, background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", boxShadow: "var(--shadow-lg)", overflow: "hidden",
                }}
              >
                {user ? (
                  <>
                    <div style={{ padding: "0.9rem 1rem", borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{user.name}</div>
                      <div style={{ color: "var(--text2)", fontSize: "0.78rem", marginTop: "0.15rem" }}>{user.email}</div>
                    </div>
                    {(user.role === "admin" || user.role === "technician") && (
                      <Link href={user.role === "admin" ? "/admin" : "/technician"} onClick={() => setMenuOpen(false)} style={{
                        display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem",
                        color: "var(--text)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500,
                        transition: "background 0.15s",
                      }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface2)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>
                        Dashboard
                      </Link>
                    )}
                    <button type="button" onClick={() => { setMenuOpen(false); logout(); }} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem", width: "100%", padding: "0.75rem 1rem",
                      background: "none", border: "none", cursor: "pointer", color: "var(--danger)",
                      fontSize: "0.85rem", fontWeight: 600, textAlign: "left", transition: "background 0.15s",
                    }} onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem",
                      color: "var(--text)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500,
                      transition: "background 0.15s",
                    }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface2)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                      Sign in
                    </Link>
                    <Link href="/login?tab=register" onClick={() => setMenuOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem",
                      color: "var(--text)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500,
                      transition: "background 0.15s",
                    }} onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface2)"; }} onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                      Create account
                    </Link>
                  </>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* ── Teardown Video ── */}
      <section style={{ padding: "2rem 1.5rem", maxWidth: 640, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          style={{ position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)" }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ width: "100%", display: "block", borderRadius: "var(--radius-lg)" }}
          >
            <source src="/teardown-video.mp4" type="video/mp4" />
          </video>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
            background: "linear-gradient(transparent, var(--bg))",
            pointerEvents: "none",
          }} />
        </motion.div>
      </section>

      {/* ── Hero: 3D Dismantle ── */}
      <PhoneDismantle />

      {/* ── Booking Card ── */}
      <section id="book" style={{ padding: "4rem 1.5rem", maxWidth: 520, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ type: "spring", stiffness: 50, damping: 18 }}
          style={{
            width: "100%",
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
              ₹349 flat
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
                    <button
                      key={b}
                      onClick={() => setPhone({ ...phone, brand: b, model: "", condition: "" })}
                      style={pillStyle(phone.brand === b)}
                    >
                      {b}
                    </button>
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
                                <button
                                  type="button"
                                  key={m}
                                  onClick={() => setPhone({ ...phone, model: m })}
                                  style={pillStyle(phone.model === m)}
                                >
                                  {m}
                                </button>
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
                    <button
                      key={c}
                      onClick={() => setPhone({ ...phone, condition: c })}
                      style={pillStyle(phone.condition === c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <button
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
                outline: "none", transform: "scale(1)",
              }}
              onMouseEnter={(e) => { if (ready) e.currentTarget.style.transform = "scale(1.01)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {ready ? "Book Doorstep Inspection →" : "Select brand, model & condition"}
            </button>

            <p style={{ textAlign: "center", color: "var(--text2)", fontSize: "0.8rem" }}>
              Free cancellation · Pay after inspection
            </p>
          </div>
        </motion.div>
      </section>

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
            <Reveal key={i} delay={0.1 + i * 0.12}>
              <div
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "2rem 1.5rem", textAlign: "center",
                  boxShadow: "var(--shadow)", transition: "box-shadow 0.5s ease, transform 0.5s ease",
                  height: "100%",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
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
              </div>
            </Reveal>
          ))}
        </div>

        {/* Coverage strip */}
        <Reveal delay={0.2}>
          <div style={{
            marginTop: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.75rem", flexWrap: "wrap", textAlign: "center",
            padding: "1rem 1.5rem", borderRadius: "var(--radius)",
            background: "color-mix(in srgb, var(--primary) 8%, transparent)",
            border: "1px solid color-mix(in srgb, var(--primary) 20%, transparent)",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ color: "var(--text2)", fontSize: "0.875rem", fontWeight: 500 }}>
              We inspect at your doorstep — wherever you are.
            </span>
          </div>
        </Reveal>
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
              <Reveal key={i} delay={0.1 + i * 0.15}>
              <div
                style={{
                  background: "var(--surface)", borderRadius: "var(--radius-lg)",
                  padding: "2rem", boxShadow: "var(--shadow)", transition: "all 0.3s", height: "100%",
                  border: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
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
              </div>
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
                Get your phone inspected today — the ₹349 fee pays for itself on your first fair deal.
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

      {/* Mobile sticky booking CTA */}
      <div
        className="mobile-sticky-cta"
        style={{
          position: "fixed", left: "1rem", right: "1rem", bottom: "calc(1rem + env(safe-area-inset-bottom))",
          zIndex: 90,
        }}
      >
        <button
          type="button"
          onClick={handleBook}
          disabled={authLoading}
          style={{
            width: "100%", padding: "1rem", border: "none", borderRadius: "var(--radius)",
            background: ready ? "linear-gradient(135deg, var(--primary), var(--primary-hover))" : "var(--border)",
            color: ready ? "#fff" : "var(--text2)",
            fontWeight: 700, fontSize: "1rem", cursor: "pointer",
            boxShadow: "0 8px 24px color-mix(in srgb, var(--primary) 40%, transparent)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
          {ready ? "Book Doorstep Inspection" : "Select phone to book"}
        </button>
      </div>
    </div>
  );
}
