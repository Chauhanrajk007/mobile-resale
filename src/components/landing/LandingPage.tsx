"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { BRANDS, PHONE_CONDITIONS } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";

const steps = [
  { icon: "📱", title: "Select Your Phone", desc: "Choose brand, model & current condition" },
  { icon: "📍", title: "Tell Us Where", desc: "Enter your address & pick a convenient time" },
  { icon: "🔍", title: "We Inspect", desc: "Our technician visits & checks 30+ test points" },
  { icon: "📋", title: "Get Your Report", desc: "Detailed inspection report & pay online" },
];

const features = [
  { icon: "✓", title: "30+ Point Check", desc: "Display, camera, sensors, battery — everything tested" },
  { icon: "₹", title: "Fair Pricing", desc: "₹350 flat inspection fee. No hidden charges." },
  { icon: "★", title: "Trusted Reports", desc: "Share your inspection report with any buyer or seller" },
];

function AnimatedSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [phone, setPhone] = useState({ brand: "", model: "", condition: "" });
  const [models, setModels] = useState<any[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Fetch models when brand changes
  useEffect(() => {
    if (!phone.brand) return;
    setModelsLoading(true);
    fetch(`/api/phones?brand=${encodeURIComponent(phone.brand)}`)
      .then((r) => r.json())
      .then((d) => {
        setModels(d.phones || []);
        setModelsLoading(false);
      })
      .catch(() => setModelsLoading(false));
  }, [phone.brand]);

  const handleBook = () => {
    if (!phone.brand || !phone.model || !phone.condition) return;

    // Save selected phone to localStorage draft
    localStorage.setItem("bookingDraft", JSON.stringify({ phone }));

    if (user) {
      router.push("/book");
    } else {
      router.push("/login?redirect=/book");
    }
  };

  const pillStyle = (selected: boolean) => ({
    padding: "0.55rem 0.95rem",
    borderRadius: "var(--radius)",
    border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
    background: selected ? "var(--primary)" : "var(--surface)",
    color: selected ? "#fff" : "var(--text)",
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.15s ease",
    textAlign: "center" as const,
    outline: "none",
    boxShadow: selected ? "0 4px 12px color-mix(in srgb, var(--primary) 20%, transparent)" : "none",
  });

  const buttonStyle = {
    padding: "1rem",
    background: phone.brand && phone.model && phone.condition ? "var(--primary)" : "var(--border)",
    color: phone.brand && phone.model && phone.condition ? "#fff" : "var(--text2)",
    border: "none",
    borderRadius: "var(--radius)",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: phone.brand && phone.model && phone.condition ? "pointer" : "not-allowed",
    transition: "all 0.2s ease",
    width: "100%",
    boxShadow: phone.brand && phone.model && phone.condition ? "0 4px 14px color-mix(in srgb, var(--primary) 30%, transparent)" : "none",
    outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 1.5rem", zIndex: 50, borderBottom: "1px solid var(--border)",
        background: "color-mix(in srgb, var(--surface) 80%, transparent)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)"
      }}>
        <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)" }}>CheckMyPhone</span>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <ThemeToggle />
          {authLoading ? (
            <span
              style={{
                padding: "0.5rem 1.25rem", color: "var(--text2)",
                border: "1px solid var(--border)", borderRadius: "var(--radius)",
                fontSize: "0.875rem", fontWeight: 600,
              }}
            >
              ...
            </span>
          ) : user ? (
            <Link href={user.role === "admin" ? "/admin" : user.role === "technician" ? "/technician" : "/account"} style={{
              padding: "0.5rem 1.25rem", background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--text)",
              borderRadius: "var(--radius)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem"
            }}>Dashboard</Link>
          ) : (
            <Link href="/login" style={{
              padding: "0.5rem 1.25rem", background: "var(--primary)", color: "#fff",
              borderRadius: "var(--radius)", textDecoration: "none", fontWeight: 600, fontSize: "0.875rem",
              boxShadow: "0 2px 8px color-mix(in srgb, var(--primary) 35%, transparent)",
            }}>Login</Link>
          )}
        </div>
      </div>

      {/* Hero with direct Booking Option */}
      <section style={{
        display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", padding: "4.5rem 1.5rem 4rem", position: "relative",
        flexWrap: "wrap", gap: "3rem", maxWidth: 1200, margin: "0 auto"
      }}>
        {/* Left Side: Hero Title */}
        <div style={{ flex: "1 1 450px", textAlign: "left" }}>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, lineHeight: 1.1,
              letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: "1.5rem"
            }}
          >
            Get Your Phone Inspected Doorstep
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ color: "var(--text2)", fontSize: "1.2rem", lineHeight: 1.6, maxWidth: 480 }}
          >
            Buying or selling a used mobile? Book a professional inspection. A technician will inspect the phone at your place and generate a verified report.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}
          >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text)", flexWrap: "wrap" }}>
                <span style={{ fontSize: "1.8rem", color: "var(--primary)", fontWeight: 800 }}>₹350</span>
                <span style={{ fontSize: "0.95rem", color: "var(--text2)", fontWeight: 500 }}>Flat Doorstep Inspection Fee</span>
              </div>
          </motion.div>
        </div>

        {/* Right Side: Direct Booking Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            flex: "1 1 420px", maxWidth: 480,
            background: "color-mix(in srgb, var(--surface) 95%, transparent)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--border)", borderRadius: "var(--radius-lg)",
            padding: "2.25rem 2rem", boxShadow: "var(--shadow-lg)"
          }}
        >
          <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>Book Doorstep Inspection</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Brand Selection */}
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.5rem" }}>Brand</label>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {BRANDS.slice(0, 8).map((b) => (
                  <motion.button key={b} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPhone({ ...phone, brand: b, model: "", condition: "" })} style={pillStyle(phone.brand === b)}>
                    {b}
                  </motion.button>
                ))}
                {phone.brand && !(BRANDS.slice(0, 8) as readonly string[]).includes(phone.brand) && (
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={pillStyle(true)}>{phone.brand}</motion.button>
                )}
              </div>
            </div>

            {/* Model Selection */}
            {phone.brand && (
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.5rem" }}>Model</label>
                {modelsLoading ? (
                  <div style={{ fontSize: "0.85rem", color: "var(--text2)" }}>Loading models...</div>
                ) : models.length > 0 ? (
                  <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap", maxHeight: 120, overflowY: "auto" }}>
                    {models.map((m) => (
                      <motion.button key={m._id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPhone({ ...phone, model: m.model })} style={pillStyle(phone.model === m.model)}>
                        {m.model}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <input
                    placeholder="Enter model name manually"
                    value={phone.model}
                    onChange={(e) => setPhone({ ...phone, model: e.target.value })}
                    style={{
                      width: "100%", padding: "0.75rem 1rem", background: "var(--surface2)",
                      border: "1px solid var(--border)", borderRadius: "var(--radius)",
                      color: "var(--text)", fontSize: "0.9rem", outline: "none",
                      transition: "border-color 0.2s ease"
                    }}
                  />
                )}
              </div>
            )}

            {/* Condition Selection */}
            {phone.brand && phone.model && (
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)", display: "block", marginBottom: "0.5rem" }}>Condition</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.375rem" }}>
                  {PHONE_CONDITIONS.map((c) => (
                    <motion.button key={c} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setPhone({ ...phone, condition: c })} style={pillStyle(phone.condition === c)}>
                      {c}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <motion.button
              whileHover={phone.brand && phone.model && phone.condition ? { scale: 1.01, boxShadow: "0 6px 20px color-mix(in srgb, var(--primary) 40%, transparent)" } : {}}
              whileTap={phone.brand && phone.model && phone.condition ? { scale: 0.99 } : {}}
              onClick={handleBook}
              disabled={!phone.brand || !phone.model || !phone.condition}
              aria-disabled={!phone.brand || !phone.model || !phone.condition}
              title={phone.brand && phone.model && phone.condition ? "Continue to booking" : "Select brand, model and condition first"}
              style={buttonStyle}
            >
              {phone.brand && phone.model && phone.condition
                ? "Book Doorstep Inspection →"
                : "Select brand, model & condition"}
            </motion.button>
          </div>
        </motion.div>

        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px", opacity: 0.4, zIndex: -1, pointerEvents: "none"
        }} />
      </section>

      {/* How It Works */}
      <section style={{ padding: "5rem 1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <AnimatedSection>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: "3rem" }}>
            How It Works
          </h2>
        </AnimatedSection>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          {steps.map((step, i) => (
            <AnimatedSection key={i}>
              <motion.div
                whileHover={{ y: -4 }}
                style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)", padding: "2rem 1.5rem", textAlign: "center",
                  boxShadow: "var(--shadow)", transition: "box-shadow 0.3s",
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "var(--surface2)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 1rem",
                  position: "relative"
                }}>
                  {step.icon}
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    width: 22, height: 22, borderRadius: "50%",
                    background: "var(--primary)", color: "#fff",
                    fontSize: "0.7rem", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>{i + 1}</span>
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>{step.title}</h3>
                <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>{step.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "4rem 1.5rem", background: "var(--surface2)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <AnimatedSection>
            <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: "3rem" }}>
              Why CheckMyPhone?
            </h2>
          </AnimatedSection>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {features.map((f, i) => (
              <AnimatedSection key={i}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: "var(--shadow-lg)" }}
                  style={{
                    background: "var(--surface)", borderRadius: "var(--radius-lg)",
                    padding: "2rem", boxShadow: "var(--shadow)", transition: "all 0.3s",
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: "var(--radius)",
                    background: "var(--primary)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem"
                  }}>{f.icon}</div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 600, marginBottom: "0.5rem" }}>{f.title}</h3>
                  <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.6 }}>{f.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "3rem 1.5rem", textAlign: "center",
        borderTop: "1px solid var(--border)"
      }}>
        <p style={{ color: "var(--text2)", fontSize: "0.875rem" }}>
          CheckMyPhone © {new Date().getFullYear()} • Built with ☕
        </p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "1rem" }}>
          <Link href="/book" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500, fontSize: "0.875rem" }}>Book Inspection</Link>
          <Link href="/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 500, fontSize: "0.875rem" }}>Login</Link>
        </div>
      </footer>
    </div>
  );
}
