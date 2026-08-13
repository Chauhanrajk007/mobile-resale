"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PhysicalCondition, TestResult, InspectionPhoto } from "@/lib/types";

interface InspectionData {
  phone: { brand: string; model: string; variant: string };
  imei: string;
  serialNumber: string;
  deviceInfo: any;
  tests: TestResult[];
  physicalCondition: PhysicalCondition;
  photos: InspectionPhoto[];
  comments: string;
}

interface InspectionSummaryProps {
  data: InspectionData;
  onSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export default function InspectionSummary({ data, onSubmit, isSubmitting }: InspectionSummaryProps) {
  const [submitted, setSubmitted] = useState(false);

  const passedTests = data.tests.filter(t => t.result === "pass").length;
  const failedTests = data.tests.filter(t => t.result === "fail").length;
  const notTested = data.tests.filter(t => t.result === "not_tested").length;

  const handleSubmit = async () => {
    await onSubmit();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", padding: "40px 20px" }}
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          style={{
            width: 80, height: 80, borderRadius: "50%", background: "var(--success)",
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.5rem", margin: "0 auto 20px",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        <h2 style={{ color: "var(--success)", marginBottom: "16px" }}>Inspection Complete!</h2>
        <p style={{ color: "var(--text2)", marginBottom: "32px" }}>The report has been saved successfully.</p>
        <button
          onClick={() => window.location.href = "/"}
          style={{
            padding: "16px 32px",
            borderRadius: "50px",
            background: "var(--surface)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "var(--shadow)",
          }}
        >
          Return to Dashboard
        </button>
      </motion.div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", paddingBottom: "80px" }}>
      <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Device Info</h3>
        <p style={{ color: "var(--text)", marginBottom: "8px", fontSize: "18px", fontWeight: "bold" }}>
          {data.phone.brand} {data.phone.model} {data.phone.variant && `- ${data.phone.variant}`}
        </p>
        <p style={{ color: "var(--text2)", marginBottom: "4px" }}>IMEI: <span style={{ color: "var(--text)" }}>{data.imei || "N/A"}</span></p>
        <p style={{ color: "var(--text2)", marginBottom: "4px" }}>Serial: <span style={{ color: "var(--text)" }}>{data.serialNumber || "N/A"}</span></p>
        <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
          <span style={{ padding: "4px 8px", background: "var(--surface2)", borderRadius: "4px", fontSize: "14px" }}>{data.deviceInfo.storage || "N/A"}</span>
          <span style={{ padding: "4px 8px", background: "var(--surface2)", borderRadius: "4px", fontSize: "14px" }}>{data.deviceInfo.color || "N/A"}</span>
        </div>
      </div>

      <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Test Results</h3>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--success)" }}>{passedTests}</div>
            <div style={{ fontSize: "12px", color: "var(--text2)" }}>Passed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--danger)" }}>{failedTests}</div>
            <div style={{ fontSize: "12px", color: "var(--text2)" }}>Failed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text2)" }}>{notTested}</div>
            <div style={{ fontSize: "12px", color: "var(--text2)" }}>Not Tested</div>
          </div>
        </div>
        
        {failedTests > 0 && (
          <div style={{ marginTop: "16px" }}>
            <p style={{ color: "var(--danger)", fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>Failed Tests:</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "14px" }}>
              {data.tests.filter(t => t.result === "fail").map(t => (
                <li key={t.name} style={{ color: "var(--text)", marginBottom: "4px" }}>• {t.name} <span style={{ color: "var(--text2)" }}>({t.category})</span></li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
        <h3 style={{ marginBottom: "16px", color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Physical Condition</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "14px" }}>
          <div><span style={{ color: "var(--text2)" }}>Screen:</span> <span style={{ textTransform: "capitalize" }}>{data.physicalCondition.screen}</span></div>
          <div><span style={{ color: "var(--text2)" }}>Body:</span> <span style={{ textTransform: "capitalize" }}>{data.physicalCondition.overallBody}</span></div>
          <div><span style={{ color: "var(--text2)" }}>Water Damage:</span> {data.physicalCondition.waterDamage ? "Yes" : "No"}</div>
          {data.physicalCondition.missingParts && (
            <div style={{ gridColumn: "1 / -1" }}><span style={{ color: "var(--text2)" }}>Missing:</span> {data.physicalCondition.missingParts}</div>
          )}
        </div>
      </div>

      {data.photos.length > 0 && (
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
          <h3 style={{ marginBottom: "16px", color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Photos ({data.photos.length})</h3>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px" }}>
            {data.photos.map((p, i) => (
              <img key={i} src={p.data} alt={`Photo ${i+1}`} style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }} />
            ))}
          </div>
        </div>
      )}

      {data.comments && (
        <div style={{ background: "var(--surface)", padding: "20px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
          <h3 style={{ marginBottom: "16px", color: "var(--text)", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>Comments</h3>
          <p style={{ color: "var(--text)", fontSize: "14px", whiteSpace: "pre-wrap" }}>{data.comments}</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            padding: "16px",
            borderRadius: "var(--radius)",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            fontSize: "18px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            boxShadow: "var(--shadow)",
            opacity: isSubmitting ? 0.7 : 1,
            minHeight: "56px"
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit Inspection"}
        </motion.button>
      </div>
    </div>
  );
}
