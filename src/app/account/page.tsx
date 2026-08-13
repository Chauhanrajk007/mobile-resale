"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AccountDashboard from "@/components/account/AccountDashboard";

export default function AccountPage() {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(async (r) => {
      if (!r.ok) { router.replace("/login"); return; }
      const data = await r.json();
      if (data.user?.role !== "customer") { router.replace("/"); return; }
      setOk(true);
    }).catch(() => router.replace("/login"));
  }, [router]);

  if (!ok) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <div style={{ width: 36, height: 36, border: "3px solid var(--border)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
    </div>
  );

  return <AccountDashboard />;
}
