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
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
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
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--radius)", color: "var(--text)", fontSize: "1rem",
    outline: "none", transition: "border-color 0.2s",
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "2rem",
    }}>
      <div style={{ position: "absolute", top: "1rem", right: "1rem" }}><ThemeToggle /></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%", maxWidth: 420, background: "var(--surface)",
          borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)",
          padding: "2.5rem 2rem", border: "1px solid var(--border)",
        }}
      >
        <h1 style={{
          fontSize: "1.75rem", fontWeight: 800, textAlign: "center",
          color: "var(--primary)", marginBottom: "1.5rem"
        }}>CheckMyPhone</h1>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: "0", marginBottom: "1.5rem",
          background: "var(--surface2)", borderRadius: "var(--radius)", padding: 4,
        }}>
          {(["login", "register"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
              flex: 1, padding: "0.625rem", border: "none", cursor: "pointer",
              borderRadius: "var(--radius-sm)", fontWeight: 600, fontSize: "0.875rem",
              background: tab === t ? "var(--surface)" : "transparent",
              color: tab === t ? "var(--text)" : "var(--text2)",
              boxShadow: tab === t ? "var(--shadow)" : "none",
              transition: "all 0.2s",
            }}>{t === "login" ? "Login" : "Register"}</button>
          ))}
        </div>

        {error && (
          <div style={{
            padding: "0.75rem 1rem", background: "color-mix(in srgb, var(--danger) 12%, var(--surface))",
            border: "1px solid color-mix(in srgb, var(--danger) 40%, transparent)", borderRadius: "var(--radius-sm)",
            color: "var(--danger)", fontSize: "0.875rem", marginBottom: "1rem",
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <AnimatePresence mode="wait">
            {tab === "register" && (
              <motion.div
                key="reg-fields"
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: "1rem", overflow: "hidden" }}
              >
                <input placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
                <input placeholder="Phone Number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} required />
              </motion.div>
            )}
          </AnimatePresence>
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} required />
          <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} required />
          <button type="submit" disabled={loading} style={{
            padding: "1rem", background: "var(--primary)", color: "#fff",
            border: "none", borderRadius: "var(--radius)", fontWeight: 700,
            fontSize: "1rem", cursor: loading ? "wait" : "pointer",
            opacity: loading ? 0.7 : 1, transition: "opacity 0.2s, transform 0.15s",
            boxShadow: loading ? "none" : "0 4px 14px color-mix(in srgb, var(--primary) 30%, transparent)",
          }}>{loading ? "Please wait..." : tab === "login" ? "Login" : "Create Account"}</button>
        </form>
      </motion.div>

      <Link href="/" style={{
        marginTop: "1.5rem", color: "var(--text2)", textDecoration: "none",
        fontSize: "0.875rem", fontWeight: 500,
      }}>← Back to home</Link>
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
