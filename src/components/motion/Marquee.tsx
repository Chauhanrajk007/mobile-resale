"use client";

import { motion } from "framer-motion";

export function Marquee({
  items,
  className,
  reverse = false,
  onItemClick,
}: {
  items: string[];
  className?: string;
  reverse?: boolean;
  onItemClick?: (item: string) => void;
}) {
  const doubled = [...items, ...items];

  return (
    <div className={className} style={{ overflow: "hidden", position: "relative", maskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)" }}>
      <motion.div
        style={{ display: "flex", gap: "1rem", width: "max-content" }}
        animate={{ x: reverse ? ["0%", "50%"] : ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {doubled.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={onItemClick ? () => onItemClick(item) : undefined}
            style={{
              flexShrink: 0, display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.85rem 1.75rem", borderRadius: 999,
              background: "var(--surface2)", border: "1px solid var(--border)",
              color: "var(--text)", fontWeight: 700, fontSize: "1rem", whiteSpace: "nowrap",
              cursor: onItemClick ? "pointer" : "default",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ color: "var(--primary)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.5L5.7 21l2.3-7.2-6-4.6h7.6z" /></svg>
            </span>
            {item}
          </button>
        ))}
      </motion.div>
    </div>
  );
}
