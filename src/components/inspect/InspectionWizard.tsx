"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PhoneSelector from "./PhoneSelector";
import IMEIEntry from "./IMEIEntry";
import TestRunner from "./TestRunner";
import PhysicalConditionForm from "./PhysicalCondition";
import PhotoCapture from "./PhotoCapture";
import InspectionSummary from "./InspectionSummary";
import { ALL_TEST_ITEMS } from "@/lib/constants";
import type { TestResult, PhysicalCondition, InspectionPhoto } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";

const STEPS = [
  "Device Model",
  "IMEI & Info",
  "Hardware Tests",
  "Physical Condition",
  "Photos",
  "Review"
];

const INITIAL_TESTS: TestResult[] = ALL_TEST_ITEMS.map((t) => ({
  ...t,
  result: "not_tested" as const,
  comment: ""
}));

const INITIAL_CONDITION: PhysicalCondition = {
  screen: "good",
  backPanel: "good",
  frame: "good",
  cameraGlass: "good",
  scratches: "none",
  dents: "none",
  cracks: "none",
  waterDamage: false,
  missingParts: "",
  otherDamage: "",
  overallBody: "good"
};

export default function InspectionWizard() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<{lat: number | null, lng: number | null, address: string}>({ lat: null, lng: null, address: "" });

  const [data, setData] = useState({
    phone: { brand: "", model: "", variant: "" },
    imei: "",
    serialNumber: "",
    deviceInfo: {
      storage: "",
      color: "",
      os: "",
      status: "Unknown",
      blacklistStatus: "Unknown",
      warrantyInfo: "Unknown"
    },
    tests: INITIAL_TESTS,
    physicalCondition: INITIAL_CONDITION,
    photos: [] as InspectionPhoto[],
    comments: ""
  });

  useEffect(() => {
    // Load draft
    const draft = localStorage.getItem("inspectionDraft");
    if (draft) {
      try {
        setData(JSON.parse(draft));
      } catch(e) {}
    }

    // Get Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, address: "" }),
        (err) => console.log("Location access denied")
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inspectionDraft", JSON.stringify(data));
  }, [data]);

  const updateData = (updates: Partial<typeof data>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Create inspection
      const createRes = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: data.phone,
          imei: data.imei,
          serialNumber: data.serialNumber
        })
      });
      if (!createRes.ok) throw new Error("Failed to create inspection");
      const { inspectionId, _id } = await createRes.json();

      // 2. Update with full data
      const updateRes = await fetch(`/api/inspections`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id,
          deviceInfo: data.deviceInfo,
          tests: data.tests,
          physicalCondition: data.physicalCondition,
          photos: data.photos,
          location,
          comments: data.comments
        })
      });
      if (!updateRes.ok) throw new Error("Failed to update inspection");

      // 3. Complete inspection
      const completeRes = await fetch(`/api/inspections/${_id}/complete`, {
        method: "POST"
      });
      if (!completeRes.ok) throw new Error("Failed to complete inspection");

      localStorage.removeItem("inspectionDraft");
    } catch (err) {
      console.error(err);
      toast("error", "Failed to submit inspection", "Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  const canProceed = () => {
    if (currentStep === 0) return data.phone.brand && data.phone.model;
    if (currentStep === 1) return data.imei.length === 15;
    return true;
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Progress Header */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ color: "var(--text)", marginBottom: "16px", textAlign: "center" }}>New Inspection</h2>
        
        <div style={{ display: "flex", justifyContent: "space-between", position: "relative", marginBottom: "8px" }}>
          {/* Connecting Line */}
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "2px", background: "var(--surface2)", zIndex: 1, transform: "translateY(-50%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 0, width: `${(currentStep / (STEPS.length - 1)) * 100}%`, height: "2px", background: "var(--primary)", zIndex: 2, transform: "translateY(-50%)", transition: "width 0.3s ease" }} />

          {STEPS.map((step, i) => (
            <div key={i} style={{ position: "relative", zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <motion.div
                animate={{
                  backgroundColor: i <= currentStep ? "var(--primary)" : "var(--surface)",
                  color: i <= currentStep ? "#fff" : "var(--text2)",
                  borderColor: i <= currentStep ? "var(--primary)" : "var(--border)"
                }}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              >
                {i < currentStep ? "✓" : i + 1}
              </motion.div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", color: "var(--text)", fontWeight: "500", fontSize: "14px" }}>
          {STEPS[currentStep]}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, position: "relative", overflowX: "hidden" }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ width: "100%", paddingBottom: "80px" }}
          >
            {currentStep === 0 && <PhoneSelector value={data.phone} onChange={(phone) => updateData({ phone })} />}
            {currentStep === 1 && <IMEIEntry value={{ imei: data.imei, serialNumber: data.serialNumber, deviceInfo: data.deviceInfo }} onChange={(val) => updateData({ ...val })} />}
            {currentStep === 2 && <TestRunner tests={data.tests} onChange={(tests) => updateData({ tests })} />}
            {currentStep === 3 && <PhysicalConditionForm condition={data.physicalCondition} onChange={(physicalCondition) => updateData({ physicalCondition })} />}
            {currentStep === 4 && <PhotoCapture photos={data.photos} comments={data.comments} onPhotosChange={(photos) => updateData({ photos })} onCommentsChange={(comments) => updateData({ comments })} />}
            {currentStep === 5 && <InspectionSummary data={data} onSubmit={handleSubmit} isSubmitting={isSubmitting} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      {currentStep < STEPS.length - 1 && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px", background: "var(--bg)", borderTop: "1px solid var(--border)", display: "flex", gap: "16px", zIndex: 10, maxWidth: "600px", margin: "0 auto" }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "var(--radius)",
              background: "var(--surface)",
              color: currentStep === 0 ? "var(--text2)" : "var(--text)",
              border: "1px solid var(--border)",
              fontWeight: "bold",
              fontSize: "16px",
              minHeight: "56px",
              opacity: currentStep === 0 ? 0.5 : 1
            }}
          >
            Back
          </button>
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            style={{
              flex: 2,
              padding: "16px",
              borderRadius: "var(--radius)",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              minHeight: "56px",
              opacity: !canProceed() ? 0.5 : 1,
              boxShadow: "var(--shadow)"
            }}
          >
            Next Step
          </button>
        </div>
      )}
    </div>
  );
}
