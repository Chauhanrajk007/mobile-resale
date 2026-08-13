"use client";

import { useState, useMemo, useRef, useEffect } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function DatePicker({
  value,
  onChange,
  min,
}: {
  value: string;
  onChange: (v: string) => void;
  min?: string;
}) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => (value ? new Date(value) : new Date()));
  const ref = useRef<HTMLDivElement>(null);

  const minDate = min ? new Date(min + "T00:00:00") : null;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(view.getFullYear(), view.getMonth(), d));
    return arr;
  }, [view]);

  const todayKey = toDateKey(new Date());

  const goPrev = () => {
    const cur = new Date(view);
    if (minDate && view.getFullYear() <= minDate.getFullYear() && view.getMonth() <= minDate.getMonth()) return;
    cur.setMonth(cur.getMonth() - 1);
    setView(cur);
  };

  const goNext = () => {
    const cur = new Date(view);
    cur.setMonth(cur.getMonth() + 1);
    setView(cur);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          display: "flex", alignItems: "center", gap: "0.75rem",
          padding: "0.875rem 1rem",
          background: "var(--surface2)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", color: value ? "var(--text)" : "var(--text2)",
          fontSize: "1rem", cursor: "pointer", textAlign: "left", transition: "border-color 0.2s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text2)" }}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <span style={{ flex: 1 }}>
          {value
            ? new Date(value + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
            : "Select a date"}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: "var(--text2)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 0.5rem)", left: 0, right: 0, zIndex: 50,
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", padding: "1rem",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <button
              type="button"
              onClick={goPrev}
              disabled={!!(minDate && view.getFullYear() <= minDate.getFullYear() && view.getMonth() <= minDate.getMonth())}
              style={{
                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                cursor: "pointer", color: "var(--text)", opacity: 1, transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </div>
            <button
              type="button"
              onClick={goNext}
              style={{
                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                cursor: "pointer", color: "var(--text)", transition: "all 0.2s",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          {/* Weekday labels */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem", marginBottom: "0.25rem" }}>
            {WEEKDAYS.map(w => (
              <div key={w} style={{ textAlign: "center", fontSize: "0.7rem", fontWeight: 700, color: "var(--text2)", padding: "0.25rem 0" }}>{w}</div>
            ))}
          </div>

          {/* Day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.25rem" }}>
            {cells.map((d, i) => {
              if (!d) return <div key={i} />;
              const key = toDateKey(d);
              const isPast = minDate && d < minDate;
              const isToday = key === todayKey;
              const isSelected = key === value;
              return (
                <button
                  type="button"
                  key={i}
                  disabled={!!isPast}
                  onClick={() => { onChange(key); setOpen(false); }}
                  style={{
                    aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: "var(--radius-sm)", fontSize: "0.85rem", cursor: isPast ? "not-allowed" : "pointer",
                    border: isSelected ? "2px solid var(--primary)" : "none",
                    background: isSelected ? "var(--primary)" : isToday ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent",
                    color: isSelected ? "#fff" : isPast ? "color-mix(in srgb, var(--text2) 45%, transparent)" : "var(--text)",
                    fontWeight: isToday ? 700 : 500,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!isPast && !isSelected) (e.currentTarget as HTMLButtonElement).style.background = "var(--surface2)"; }}
                  onMouseLeave={e => { if (!isPast && !isSelected) (e.currentTarget as HTMLButtonElement).style.background = isToday ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent"; }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {minDate && (
            <p style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "var(--text2)" }}>Earliest available: {minDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</p>
          )}
        </div>
      )}
    </div>
  );
}
