"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* sw optional */
      });
    }
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  return (
    <AnimatePresence>
      {deferredPrompt && (
        <motion.button
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50, x: '-50%' }}
          onClick={async () => {
            if (!deferredPrompt) return;
            (deferredPrompt as unknown as { prompt: () => Promise<void> }).prompt?.();
            setDeferredPrompt(null);
          }}
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            zIndex: 50,
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            background: 'var(--primary)',
            color: '#fff',
            border: 'none',
            boxShadow: 'var(--shadow-lg)',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            whiteSpace: 'nowrap'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Install CheckMyPhone App
        </motion.button>
      )}
    </AnimatePresence>
  );
}
