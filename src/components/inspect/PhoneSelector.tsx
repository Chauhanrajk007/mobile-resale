"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRANDS, DEFAULT_MODELS } from "@/lib/constants";
import type { PhoneModelDoc } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PhoneSelectorProps {
  value: { brand: string; model: string; variant: string };
  onChange: (value: { brand: string; model: string; variant: string }) => void;
}

export default function PhoneSelector({ value, onChange }: PhoneSelectorProps) {
  const [models, setModels] = useState<PhoneModelDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!value.brand) { setModels([]); return; }
    const fetchModels = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/phones?brand=${encodeURIComponent(value.brand)}`);
        if (res.ok) {
          const data = await res.json();
          let list: PhoneModelDoc[] = data.phones || [];
          if (list.length === 0 && DEFAULT_MODELS[value.brand]) {
            list = DEFAULT_MODELS[value.brand].map((m) => ({
              _id: m, brand: value.brand, model: m, variants: [], active: true,
            } as PhoneModelDoc));
          }
          setModels(list);
        }
      } catch (err) {
        const fallback = (DEFAULT_MODELS[value.brand] || []).map((m) => ({
          _id: m, brand: value.brand, model: m, variants: [], active: true,
        } as PhoneModelDoc));
        setModels(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchModels();
  }, [value.brand]);

  const handleBrandSelect = (brand: string) => {
    onChange({ brand, model: "", variant: "" });
    setSearch("");
  };

  const handleModelSelect = (modelDoc: PhoneModelDoc) => {
    onChange({ brand: value.brand, model: modelDoc.model, variant: "" });
  };

  const handleVariantSelect = (variant: string) => {
    onChange({ ...value, variant });
  };

  const filteredModels = models.filter((m) =>
    m.model.toLowerCase().includes(search.toLowerCase())
  );

  const selectedModelDoc = models.find((m) => m.model === value.model);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h3 style={{ marginBottom: "12px", color: "var(--text)" }}>Select Brand</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "12px",
          }}
        >
          {BRANDS.map((brand) => (
            <motion.button
              key={brand}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleBrandSelect(brand)}
              style={{
                padding: "16px 8px",
                borderRadius: "var(--radius)",
                background: "var(--surface)",
                border: `2px solid ${
                  value.brand === brand ? "var(--primary)" : "var(--border)"
                }`,
                color: value.brand === brand ? "var(--primary)" : "var(--text)",
                fontWeight: value.brand === brand ? "bold" : "normal",
                cursor: "pointer",
                boxShadow: "var(--shadow)",
                transition: "all 0.2s",
                minHeight: "44px",
              }}
            >
              {brand}
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {value.brand && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <h3 style={{ marginBottom: "12px", color: "var(--text)" }}>Select Model</h3>
            <input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text)",
                marginBottom: "16px",
                minHeight: "44px",
                fontSize: "16px",
              }}
            />

            {loading ? (
              <p style={{ color: "var(--text2)" }}>Loading models...</p>
            ) : filteredModels.length === 0 ? (
              <p style={{ color: "var(--text2)" }}>No models found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filteredModels.map((m) => (
                  <motion.button
                    key={m._id || m.model}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModelSelect(m)}
                    style={{
                      padding: "16px",
                      borderRadius: "var(--radius)",
                      background: "var(--surface)",
                      border: `2px solid ${
                        value.model === m.model ? "var(--primary)" : "var(--border)"
                      }`,
                      color: value.model === m.model ? "var(--primary)" : "var(--text)",
                      textAlign: "left",
                      fontWeight: value.model === m.model ? "bold" : "normal",
                      cursor: "pointer",
                      minHeight: "44px",
                    }}
                  >
                    {m.model}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {value.model && selectedModelDoc?.variants && selectedModelDoc.variants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: "hidden" }}
          >
            <h3 style={{ marginBottom: "12px", color: "var(--text)" }}>Select Variant</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {selectedModelDoc.variants.map((v) => (
                <motion.button
                  key={v}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVariantSelect(v)}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "50px",
                    background: value.variant === v ? "var(--primary)" : "var(--surface)",
                    border: `1px solid ${
                      value.variant === v ? "var(--primary)" : "var(--border)"
                    }`,
                    color: value.variant === v ? "#fff" : "var(--text)",
                    cursor: "pointer",
                    minHeight: "44px",
                  }}
                >
                  {v}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
