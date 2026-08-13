"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

type ToastContextType = {
  toast: (type: ToastType, title: string, message?: string) => void;
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const ICONS: Record<ToastType, ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const COLORS: Record<ToastType, { bg: string; fg: string; border: string }> = {
  success: { bg: "color-mix(in srgb, var(--success) 12%, var(--surface))", fg: "var(--success)", border: "color-mix(in srgb, var(--success) 35%, var(--border))" },
  error: { bg: "color-mix(in srgb, var(--danger) 12%, var(--surface))", fg: "var(--danger)", border: "color-mix(in srgb, var(--danger) 35%, var(--border))" },
  info: { bg: "color-mix(in srgb, var(--primary) 12%, var(--surface))", fg: "var(--primary)", border: "color-mix(in srgb, var(--primary) 35%, var(--border))" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmOpts, setConfirmOpts] = useState<(ConfirmOptions & { resolve: (v: boolean) => void }) | null>(null);
  const idRef = useRef(0);

  const toast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 4000);
  }, []);

  const confirm = useCallback((opts: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmOpts({ ...opts, resolve });
    });
  }, []);

  const closeConfirm = (value: boolean) => {
    confirmOpts?.resolve(value);
    setConfirmOpts(null);
  };

  return (
    <ToastContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toasts */}
      <div style={{ position: "fixed", top: "5rem", right: "1rem", zIndex: 1000, display: "flex", flexDirection: "column", gap: "0.6rem", maxWidth: "min(90vw, 380px)" }}>
        <AnimatePresence>
          {toasts.map((t) => {
            const c = COLORS[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 60, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
                style={{
                  display: "flex", gap: "0.75rem", alignItems: "flex-start",
                  padding: "0.9rem 1rem", borderRadius: "var(--radius)",
                  background: c.bg, border: `1px solid ${c.border}`,
                  boxShadow: "var(--shadow-lg)", cursor: "pointer",
                  backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: "50%", background: "var(--surface)", color: c.fg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {ICONS[t.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "var(--text)" }}>{t.title}</div>
                  {t.message && <div style={{ fontSize: "0.8rem", color: "var(--text2)", marginTop: "0.15rem", lineHeight: 1.45 }}>{t.message}</div>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setToasts((all) => all.filter((x) => x.id !== t.id)); }}
                  aria-label="Dismiss"
                  style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", padding: "0.15rem", lineHeight: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmOpts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => closeConfirm(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 1100,
              background: "rgba(0,0,0,0.55)", display: "flex",
              alignItems: "center", justifyContent: "center", padding: "1rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)", padding: "1.75rem", width: "min(92vw, 420px)",
                boxShadow: "var(--shadow-xl)",
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: "50%", marginBottom: "1rem",
                background: confirmOpts.danger ? "color-mix(in srgb, var(--danger) 12%, transparent)" : "color-mix(in srgb, var(--primary) 12%, transparent)",
                color: confirmOpts.danger ? "var(--danger)" : "var(--primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>{confirmOpts.title}</h3>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>{confirmOpts.message}</p>
              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                <button onClick={() => closeConfirm(false)} style={{
                  padding: "0.7rem 1.25rem", background: "var(--surface2)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", color: "var(--text)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                }}>Cancel</button>
                <button onClick={() => closeConfirm(true)} style={{
                  padding: "0.7rem 1.25rem", border: "none", borderRadius: "var(--radius)",
                  background: confirmOpts.danger ? "var(--danger)" : "var(--primary)",
                  color: "#fff", fontWeight: 700, fontSize: "0.875rem", cursor: "pointer",
                }}>{confirmOpts.confirmLabel || "Confirm"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}
