"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEST_CATEGORIES } from "@/lib/constants";
import type { TestResult } from "@/lib/types";

interface TestRunnerProps {
  tests: TestResult[];
  onChange: (tests: TestResult[]) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  Display: "📱",
  Camera: "📷",
  Audio: "🔊",
  Hardware: "⚙️",
  Connectivity: "📶",
  Biometrics: "🔐",
  Sensors: "📡",
  Identity: "🆔",
};

export default function TestRunner({ tests, onChange }: TestRunnerProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(TEST_CATEGORIES[0].category);
  const [commentOpenFor, setCommentOpenFor] = useState<string | null>(null);

  const handleResultChange = (category: string, name: string, result: "pass" | "fail" | "not_tested") => {
    const newTests = tests.map((t) => 
      t.category === category && t.name === name ? { ...t, result } : t
    );
    onChange(newTests);
  };

  const handleCommentChange = (category: string, name: string, comment: string) => {
    const newTests = tests.map((t) => 
      t.category === category && t.name === name ? { ...t, comment } : t
    );
    onChange(newTests);
  };

  const completedCount = tests.filter(t => t.result !== "not_tested").length;
  const progressPercent = Math.round((completedCount / tests.length) * 100) || 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Progress Bar */}
      <div style={{ background: "var(--surface)", padding: "16px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "var(--text)", fontWeight: "bold" }}>Progress</span>
          <span style={{ color: "var(--primary)", fontWeight: "bold" }}>{completedCount} / {tests.length} ({progressPercent}%)</span>
        </div>
        <div style={{ width: "100%", height: "8px", background: "var(--surface2)", borderRadius: "4px", overflow: "hidden" }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "spring", stiffness: 50 }}
            style={{ height: "100%", background: "var(--primary)" }}
          />
        </div>
      </div>

      {/* Categories */}
      {TEST_CATEGORIES.map((cat) => {
        const catTests = tests.filter(t => t.category === cat.category);
        const isExpanded = expandedCategory === cat.category;
        const passCount = catTests.filter(t => t.result === "pass").length;
        const failCount = catTests.filter(t => t.result === "fail").length;
        
        return (
          <div key={cat.category} style={{ background: "var(--surface)", borderRadius: "var(--radius)", overflow: "hidden", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : cat.category)}
              style={{
                width: "100%",
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "24px" }}>{CATEGORY_ICONS[cat.category] || "🔹"}</span>
                <span style={{ color: "var(--text)", fontSize: "18px", fontWeight: "bold" }}>{cat.category}</span>
              </div>
              <div style={{ display: "flex", gap: "8px", fontSize: "14px" }}>
                {passCount > 0 && <span style={{ color: "var(--success)" }}>{passCount} ✓</span>}
                {failCount > 0 && <span style={{ color: "var(--danger)" }}>{failCount} ✗</span>}
                <motion.span 
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  style={{ color: "var(--text2)", marginLeft: "8px" }}
                >
                  ▼
                </motion.span>
              </div>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {catTests.map((t) => (
                      <div key={t.name} style={{ background: "var(--surface2)", padding: "16px", borderRadius: "var(--radius)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ color: "var(--text)", fontWeight: "500" }}>{t.name}</span>
                          <button 
                            onClick={() => setCommentOpenFor(commentOpenFor === t.name ? null : t.name)}
                            style={{ background: "transparent", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: "18px" }}
                          >
                            💬
                          </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResultChange(t.category, t.name, "pass")}
                            style={{
                              padding: "12px 0",
                              borderRadius: "8px",
                              border: `2px solid ${t.result === "pass" ? "var(--success)" : "var(--border)"}`,
                              background: t.result === "pass" ? "var(--success)" : "transparent",
                              color: t.result === "pass" ? "#fff" : "var(--text)",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            ✓ Pass
                          </motion.button>
                          
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResultChange(t.category, t.name, "fail")}
                            style={{
                              padding: "12px 0",
                              borderRadius: "8px",
                              border: `2px solid ${t.result === "fail" ? "var(--danger)" : "var(--border)"}`,
                              background: t.result === "fail" ? "var(--danger)" : "transparent",
                              color: t.result === "fail" ? "#fff" : "var(--text)",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            ✗ Fail
                          </motion.button>

                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleResultChange(t.category, t.name, "not_tested")}
                            style={{
                              padding: "12px 0",
                              borderRadius: "8px",
                              border: `2px solid ${t.result === "not_tested" ? "var(--text2)" : "var(--border)"}`,
                              background: t.result === "not_tested" ? "var(--text2)" : "transparent",
                              color: t.result === "not_tested" ? "#fff" : "var(--text)",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                          >
                            ○ Skip
                          </motion.button>
                        </div>

                        <AnimatePresence>
                          {commentOpenFor === t.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              style={{ overflow: "hidden" }}
                            >
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={t.comment}
                                onChange={(e) => handleCommentChange(t.category, t.name, e.target.value)}
                                style={{
                                  width: "100%",
                                  padding: "12px",
                                  borderRadius: "8px",
                                  border: "1px solid var(--border)",
                                  background: "var(--surface)",
                                  color: "var(--text)",
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
