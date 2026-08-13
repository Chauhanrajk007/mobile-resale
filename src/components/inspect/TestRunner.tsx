"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TEST_CATEGORIES } from "@/lib/constants";
import type { TestResult } from "@/lib/types";

interface TestRunnerProps {
  tests: TestResult[];
  onChange: (tests: TestResult[]) => void;
}

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Display: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
  Camera: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>,
  Audio: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>,
  Hardware: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
  Connectivity: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
  Biometrics: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><path d="M12 11a5 5 0 0 1 5 5" /><path d="M12 7a9 9 0 0 1 9 9" /><path d="M12 3a13 13 0 0 1 13 13" /><path d="M2 13a10 10 0 0 1 10-10" /><path d="M2 17a6 6 0 0 1 6-6" /><path d="M2 21a2 2 0 0 1 2-2" /></svg>,
  Sensors: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  Identity: <svg width="22" height="22" viewBox="0 0 24 24" {...ICON}><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="11" r="2" /><path d="M5 17a4 4 0 0 1 8 0" /><line x1="15" y1="9" x2="21" y2="9" /><line x1="15" y1="13" x2="21" y2="13" /></svg>,
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
                <span style={{ display: "flex", color: "var(--text2)" }}>{CATEGORY_ICONS[cat.category]}</span>
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
