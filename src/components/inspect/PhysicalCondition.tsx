"use client";

import React from "react";
import { motion } from "framer-motion";
import { PHYSICAL_FIELDS, CONDITION_LEVELS, DAMAGE_LEVELS } from "@/lib/constants";
import type { PhysicalCondition } from "@/lib/types";

interface PhysicalConditionProps {
  condition: PhysicalCondition;
  onChange: (condition: PhysicalCondition) => void;
}

export default function PhysicalConditionForm({ condition, onChange }: PhysicalConditionProps) {
  
  const handleUpdate = (key: keyof PhysicalCondition, value: any) => {
    onChange({ ...condition, [key]: value });
  };

  const getConditionColor = (level: string) => {
    switch (level) {
      case "excellent": return "var(--success)";
      case "good": return "var(--primary)";
      case "fair": return "var(--warning)";
      case "poor": return "orange";
      case "damaged": return "var(--danger)";
      default: return "var(--text2)";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {PHYSICAL_FIELDS.map((field) => (
        <motion.div key={field.key} variants={itemVariants} style={{ background: "var(--surface)", padding: "16px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
          <label style={{ display: "block", marginBottom: "12px", color: "var(--text)", fontWeight: "bold", fontSize: "16px" }}>
            {field.label}
          </label>
          
          {field.type === "condition" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {CONDITION_LEVELS.map((level) => {
                const isSelected = condition[field.key as keyof PhysicalCondition] === level;
                return (
                  <motion.button
                    key={level}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdate(field.key as keyof PhysicalCondition, level)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "50px",
                      background: isSelected ? getConditionColor(level) : "var(--surface2)",
                      color: isSelected ? "#fff" : "var(--text)",
                      border: "none",
                      fontWeight: isSelected ? "bold" : "normal",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {level}
                  </motion.button>
                );
              })}
            </div>
          )}

          {field.type === "damage" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {DAMAGE_LEVELS.map((level) => {
                const isSelected = condition[field.key as keyof PhysicalCondition] === level;
                const levelColor = level === "none" ? "var(--success)" : level === "minor" ? "var(--warning)" : "var(--danger)";
                return (
                  <motion.button
                    key={level}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleUpdate(field.key as keyof PhysicalCondition, level)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "50px",
                      background: isSelected ? levelColor : "var(--surface2)",
                      color: isSelected ? "#fff" : "var(--text)",
                      border: "none",
                      fontWeight: isSelected ? "bold" : "normal",
                      cursor: "pointer",
                      textTransform: "capitalize",
                    }}
                  >
                    {level}
                  </motion.button>
                );
              })}
            </div>
          )}

          {field.type === "boolean" && (
            <div style={{ display: "flex", gap: "12px" }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUpdate(field.key as keyof PhysicalCondition, false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  background: condition[field.key as keyof PhysicalCondition] === false ? "var(--success)" : "var(--surface2)",
                  color: condition[field.key as keyof PhysicalCondition] === false ? "#fff" : "var(--text)",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                No
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleUpdate(field.key as keyof PhysicalCondition, true)}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "8px",
                  background: condition[field.key as keyof PhysicalCondition] === true ? "var(--danger)" : "var(--surface2)",
                  color: condition[field.key as keyof PhysicalCondition] === true ? "#fff" : "var(--text)",
                  border: "none",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Yes
              </motion.button>
            </div>
          )}
        </motion.div>
      ))}

      <motion.div variants={itemVariants} style={{ background: "var(--surface)", padding: "16px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
        <label style={{ display: "block", marginBottom: "12px", color: "var(--text)", fontWeight: "bold" }}>Missing Parts</label>
        <input
          type="text"
          placeholder="e.g. SIM Tray, Stylus..."
          value={condition.missingParts}
          onChange={(e) => handleUpdate("missingParts", e.target.value)}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)" }}
        />
      </motion.div>

      <motion.div variants={itemVariants} style={{ background: "var(--surface)", padding: "16px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
        <label style={{ display: "block", marginBottom: "12px", color: "var(--text)", fontWeight: "bold" }}>Other Damage Details</label>
        <textarea
          placeholder="Any other physical damage..."
          value={condition.otherDamage}
          onChange={(e) => handleUpdate("otherDamage", e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--surface2)", color: "var(--text)", resize: "vertical" }}
        />
      </motion.div>

    </motion.div>
  );
}
