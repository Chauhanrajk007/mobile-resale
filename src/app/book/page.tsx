"use client";

import { useEffect, useState } from "react";
import BookingFlow from "@/components/book/BookingFlow";

export default function BookPage() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(() => setOk(true))
      .catch(() => setOk(true));
  }, []);

  if (!ok) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return <BookingFlow />;
}
