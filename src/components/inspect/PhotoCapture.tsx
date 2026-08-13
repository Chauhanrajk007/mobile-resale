"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { InspectionPhoto } from "@/lib/types";
import { compressImage } from "@/lib/utils";

interface PhotoCaptureProps {
  photos: InspectionPhoto[];
  comments: string;
  onPhotosChange: (photos: InspectionPhoto[]) => void;
  onCommentsChange: (comments: string) => void;
}

export default function PhotoCapture({ photos, comments, onPhotosChange, onCommentsChange }: PhotoCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setProcessing(true);
    const newPhotos = [...photos];
    
    for (let i = 0; i < e.target.files.length; i++) {
      if (newPhotos.length >= 10) break;
      const file = e.target.files[i];
      try {
        const base64 = await compressImage(file, 1024, 0.7);
        newPhotos.push({
          label: "",
          data: base64,
          mimeType: "image/jpeg",
        });
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
    
    onPhotosChange(newPhotos);
    setProcessing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    onPhotosChange(newPhotos);
  };

  const updateLabel = (index: number, label: string) => {
    const newPhotos = [...photos];
    newPhotos[index].label = label;
    onPhotosChange(newPhotos);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ background: "var(--surface)", padding: "24px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)", textAlign: "center" }}>
        <h3 style={{ marginBottom: "8px", color: "var(--text)" }}>Device Photos</h3>
        <p style={{ color: "var(--text2)", marginBottom: "16px", fontSize: "14px" }}>
          {photos.length} / 10 photos added
        </p>
        
        <input
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          disabled={photos.length >= 10 || processing}
          style={{
            padding: "16px 32px",
            borderRadius: "50px",
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: (photos.length >= 10 || processing) ? "not-allowed" : "pointer",
            opacity: (photos.length >= 10 || processing) ? 0.7 : 1,
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          {processing ? "Processing..." : "📸 Take Photo"}
        </motion.button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <AnimatePresence>
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              layout
              style={{
                background: "var(--surface)",
                borderRadius: "var(--radius)",
                overflow: "hidden",
                boxShadow: "var(--shadow)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{ position: "relative", paddingTop: "100%", background: "var(--surface2)" }}>
                <img
                  src={photo.data}
                  alt={`Photo ${i+1}`}
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  onClick={() => removePhoto(i)}
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(0,0,0,0.6)",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ padding: "12px" }}>
                <input
                  type="text"
                  placeholder="Add label (e.g. Screen scratch)"
                  value={photo.label}
                  onChange={(e) => updateLabel(i, e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontSize: "14px"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ background: "var(--surface)", padding: "16px", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", border: "1px solid var(--border)" }}>
        <h3 style={{ marginBottom: "12px", color: "var(--text)" }}>General Comments</h3>
        <textarea
          placeholder="Any final notes about this device..."
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          rows={4}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "var(--surface2)",
            color: "var(--text)",
            resize: "vertical",
            fontSize: "16px"
          }}
        />
      </div>
    </div>
  );
}
