"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

function AdminLoginContent() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.user?.role !== "admin") {
        throw new Error("This portal is for admins only");
      }

      router.push("/admin");
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
      <div style={{
        position: "absolute", inset: 0, zIndex: -1,
        backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
        backgroundSize: "28px 28px", opacity: 0.5,
      }} />
      <div style={{
        position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)",
        width: 560, height: 560, borderRadius: "50%", zIndex: -1,
        background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)",
      }} />

      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}><ThemeToggle /></div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: "100%", maxWidth: 400,
          background: "color-mix(in srgb, var(--surface) 92%, transparent)",
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
          padding: "2.5rem 2.25rem", border: "1px solid var(--border)",
          position: "relative",
        }}
      >
        <div style={{
          position: "absolute", top: 0, left: "15%", right: "15%", height: 3,
          borderRadius: "0 0 6px 6px",
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
        }} />

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "var(--radius-lg)", margin: "0 auto 0.75rem",
            background: "linear-gradient(135deg, var(--accent), var(--success))",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 20px color-mix(in srgb, var(--accent) 35%, transparent)",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>
            Admin Portal
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>
            Restricted access · Authorized staff only
          </p>
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
          <div>
            <label style={labelStyle}>Admin Email</label>
            <input
              type="email" placeholder="admin@checkmyphone.in"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={inputStyle} required autoComplete="username"
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ ...inputStyle, paddingRight: "3rem" }}
                required autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)",
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--text2)", borderRadius: "var(--radius-sm)",
                }}
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
              padding: "1rem", background: "linear-gradient(135deg, var(--accent), var(--success))",
              color: "#fff", border: "none", borderRadius: "var(--radius)", fontWeight: 700,
              fontSize: "1rem", cursor: loading ? "wait" : "pointer", marginTop: "0.25rem",
              opacity: loading ? 0.7 : 1, transition: "opacity 0.2s",
              boxShadow: loading ? "none" : "0 6px 18px color-mix(in srgb, var(--accent) 35%, transparent)",
            }}
          >
            {loading ? "Signing in..." : "Login to Admin Portal"}
          </motion.button>
        </form>
      </motion.div>

      <Link href="/login" style={{
        marginTop: "1.75rem", color: "var(--text2)", textDecoration: "none",
        fontSize: "0.875rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.35rem",
      }}>
        ← Back to customer login
      </Link>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      </div>
    }>
      <AdminLoginContent />
    </Suspense>
  );
}
