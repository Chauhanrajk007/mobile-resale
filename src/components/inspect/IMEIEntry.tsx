"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeviceInfo {
  storage: string;
  color: string;
  os: string;
  status: string;
  blacklistStatus: string;
  warrantyInfo: string;
}

interface IMEIEntryProps {
  value: {
    imei: string;
    serialNumber: string;
    deviceInfo: DeviceInfo;
  };
  onChange: (value: any) => void;
}

export default function IMEIEntry({ value, onChange }: IMEIEntryProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lookedUp, setLookedUp] = useState(false);

  const formatIMEI = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 15);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(" ") : digits;
  };

  const handleIMEIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatIMEI(e.target.value);
    onChange({ ...value, imei: formatted.replace(/\s/g, "") });
  };

  const handleLookup = async () => {
    if (value.imei.length < 15) {
      setError("IMEI must be 15 digits");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/imei/${value.imei}`);
      if (!res.ok) throw new Error("Lookup failed");
      const data = await res.json();
      
      onChange({
        ...value,
        serialNumber: data.serial || value.serialNumber,
        deviceInfo: {
          ...value.deviceInfo,
          storage: data.storage || value.deviceInfo.storage,
          color: data.color || value.deviceInfo.color,
          status: data.status || "Unknown",
          blacklistStatus: data.blacklisted ? "Blacklisted" : "Clean",
          warrantyInfo: data.warranty || "Unknown",
        },
      });
      setLookedUp(true);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch device info. Please enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const updateDeviceInfo = (field: keyof DeviceInfo, val: string) => {
    onChange({
      ...value,
      deviceInfo: {
        ...value.deviceInfo,
        [field]: val,
      },
    });
  };

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "var(--radius)",
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text)",
    fontSize: "16px",
    minHeight: "56px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    color: "var(--text2)",
    fontSize: "14px",
    fontWeight: "500" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <label style={labelStyle}>IMEI Number (15 digits)</label>
        <div style={{ position: "relative", display: "flex", gap: "12px" }}>
          <input
            type="text"
            inputMode="numeric"
            value={formatIMEI(value.imei)}
            onChange={handleIMEIChange}
            placeholder="0000 0000 0000 000"
            style={{ ...inputStyle, flex: 1, letterSpacing: "1px", fontSize: "18px", fontWeight: "bold" }}
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleLookup}
            disabled={loading}
            style={{
              padding: "0 24px",
              borderRadius: "var(--radius)",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "..." : "Lookup"}
          </motion.button>
        </div>
        {value.imei.length === 15 && (
          <p style={{ color: "var(--success)", fontSize: "14px", marginTop: "8px" }}>
            ✓ Valid IMEI format
          </p>
        )}
        {error && (
          <p style={{ color: "var(--danger)", fontSize: "14px", marginTop: "8px" }}>
            {error}
          </p>
        )}
      </div>

      <AnimatePresence>
        {(lookedUp || value.imei.length > 5) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div>
              <label style={labelStyle}>Serial Number</label>
              <input
                type="text"
                value={value.serialNumber}
                onChange={(e) => onChange({ ...value, serialNumber: e.target.value })}
                placeholder="Serial Number"
                style={inputStyle}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={labelStyle}>Storage</label>
                <input
                  type="text"
                  value={value.deviceInfo.storage}
                  onChange={(e) => updateDeviceInfo("storage", e.target.value)}
                  placeholder="e.g. 128GB"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Color</label>
                <input
                  type="text"
                  value={value.deviceInfo.color}
                  onChange={(e) => updateDeviceInfo("color", e.target.value)}
                  placeholder="e.g. Midnight Black"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>OS / Version</label>
                <input
                  type="text"
                  value={value.deviceInfo.os}
                  onChange={(e) => updateDeviceInfo("os", e.target.value)}
                  placeholder="e.g. iOS 16.5"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Blacklist Status</label>
                <select
                  value={value.deviceInfo.blacklistStatus}
                  onChange={(e) => updateDeviceInfo("blacklistStatus", e.target.value)}
                  style={{ ...inputStyle, appearance: "none" }}
                >
                  <option value="">Select...</option>
                  <option value="Clean">Clean</option>
                  <option value="Blacklisted">Blacklisted</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
