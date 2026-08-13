"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";
  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [tab, setTab] = useState<"login" | "register">(initialTab);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (tab === "register") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed");
      }
      // Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      const role = data.user?.role;
      if (role === "admin") router.push("/admin");
      else if (role === "technician") router.push("/technician");
      else router.push(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "0.875rem 1rem",
    background: "var(--surface)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "1rem",
    outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    fontSize: "0.8rem", fontWeight: 600, color: "var(--text2)",
    display: "block", marginBottom: "0.4rem",
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "2rem 1.5rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative background */}
      <div style={{
        position: "absolute", inset: 0, zIndex: -1,
        backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
        backgroundSize: "28px 28px", opacity: 0.5,
      }} />
      <div style={{
        position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: 560, height: 560, borderRadius: "50%", zIndex: -1,
        background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 14%, transparent), transparent 65%)",
      }} />

      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: "100%", maxWidth: 440, background: "color-mix(in srgb, var(--surface) 92%, transparent)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
          padding: "2.5rem 2.25rem", border: "1px solid var(--border)",
          position: "relative",
        }}
      >
        {/* Gradient top accent */}
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 3,
          borderRadius: "0 0 6px 6px",
          background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
        }} />

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "var(--radius-lg)", margin: "0 auto 0.75rem",
            background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px color-mix(in srgb, var(--primary) 35%, transparent)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
            Welcome to CheckMyPhone
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>
            {tab === "login" ? "Sign in to your account" : "Create your account"}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "0", marginBottom: "1.75rem",
          background: "var(--surface2)", borderRadius: "var(--radius)", padding: 4,
        }}>
          {(["login", "register"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
              flex: 1, padding: "0.625rem", border: "none", cursor: "pointer",
              borderRadius: "var(--radius-sm)", fontWeight: 600, fontSize: "0.875rem",
              background: tab === t ? "var(--surface)" : "transparent",
              color: tab === t ? "var(--primary)" : "var(--text2)",
              boxShadow: tab === t ? "var(--shadow)" : "none",
              transition: "all 0.2s",
            }}>{t === "login" ? "Login" : "Register"}</button>
          ))}
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "0.75rem 1rem", background: "color-mix(in srgb, var(--danger) 12%, var(--surface))",
              border: "1px solid color-mix(in srgb, var(--danger) 40%, transparent)", borderRadius: "var(--radius-sm)",
              color: "var(--danger)", fontSize: "0.875rem", marginBottom: "1rem",
            }}
          >{error}</motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <AnimatePresence mode="wait">
            {tab === "register" && (
              <motion.div
                key="reg-fields"
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: "1.1rem", overflow: "hidden" }}
              >
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input placeholder="10-digit mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} required />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder={tab === "register" ? "Minimum 6 characters" : "Enter your password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...inputStyle, paddingRight: "3rem" }}
                required
                minLength={tab === "register" ? 6 : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)",
                  width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--surface2)", border: "1px solid var(--border)",
                  cursor: "pointer", color: "var(--text2)", borderRadius: "var(--radius-sm)",
                  transition: "background 0.2s, color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text2)"; }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            style={{
              padding: "1rem", background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 700,
              fontSize: "1rem", cursor: loading ? "wait" : "pointer", marginTop: "0.25rem",
              opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
              boxShadow: loading ? "none" : "0 6px 18px color-mix(in srgb, var(--primary) 35%, transparent)",
            }}
          >
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </motion.button>
        </form>
      </motion.div>

      <Link href="/" style={{
        marginTop: "1.75rem", color: "var(--text2)", textDecoration: "none",
        fontSize: "0.875rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.35rem",
      }}>
        ← Back to home
      </Link>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
