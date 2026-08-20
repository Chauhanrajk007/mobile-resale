"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const PARTS = [
  { label: "30+ Checkpoints", desc: "Every angle inspected", scrollFrom: 0, scrollTo: 0.25 },
  { label: "Display & Touch", desc: "Dead pixels, burn-in, touch accuracy", scrollFrom: 0.2, scrollTo: 0.5 },
  { label: "Battery Health", desc: "Capacity, cycles, swelling", scrollFrom: 0.4, scrollTo: 0.65 },
  { label: "Camera & Sensors", desc: "Focus, stabilization, Face ID", scrollFrom: 0.55, scrollTo: 0.8 },
  { label: "Verified Report", desc: "Shareable, tamper-proof", scrollFrom: 0.75, scrollTo: 1 },
];

export default function PhoneDismantle() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 0.5 });

  const screenY = useTransform(smoothProgress, [0.15, 0.35], [0, -120]);
  const screenOpacity = useTransform(smoothProgress, [0.1, 0.2, 0.85, 0.95], [1, 1, 1, 0]);
  const screenRotateX = useTransform(smoothProgress, [0.15, 0.35], [0, -8]);

  const batteryY = useTransform(smoothProgress, [0.3, 0.5], [0, 90]);
  const batteryX = useTransform(smoothProgress, [0.3, 0.5], [0, 100]);
  const batteryOpacity = useTransform(smoothProgress, [0.25, 0.35, 0.85, 0.95], [0, 1, 1, 0]);

  const cameraY = useTransform(smoothProgress, [0.45, 0.65], [0, -100]);
  const cameraX = useTransform(smoothProgress, [0.45, 0.65], [0, 80]);
  const cameraOpacity = useTransform(smoothProgress, [0.4, 0.5, 0.85, 0.95], [0, 1, 1, 0]);

  const boardY = useTransform(smoothProgress, [0.55, 0.7], [0, 60]);
  const boardX = useTransform(smoothProgress, [0.55, 0.7], [0, -100]);
  const boardOpacity = useTransform(smoothProgress, [0.5, 0.6, 0.85, 0.95], [0, 1, 1, 0]);

  const phoneRotateY = useTransform(smoothProgress, [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1], [0, -5, 5, -3, 4, -2, 0]);
  const phoneRotateX = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 3, -2, 0]);

  const reassembleScale = useTransform(smoothProgress, [0.85, 1], [0.95, 1]);
  const reassembleOpacity = useTransform(smoothProgress, [0.85, 1], [0.6, 1]);

  const globalOpacity = useTransform(smoothProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 1]);

  const ctaOpacity = useTransform(smoothProgress, [0.88, 0.95], [0, 1]);
  const ctaY = useTransform(smoothProgress, [0.88, 0.95], [20, 0]);

  return (
    <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{
          maxWidth: 1240, margin: "0 auto", height: "100%",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 1.5rem", position: "relative",
        }}>
          {/* Background glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent), transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none",
          }} />

          {/* Left: scroll-driven text labels */}
          <div style={{
            position: "absolute", left: "clamp(1rem, 4vw, 6rem)",
            top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: "1.5rem",
            maxWidth: 320, zIndex: 2,
          }}>
            {PARTS.map((part, i) => (
              <ScrollLabel
                key={i}
                progress={smoothProgress}
                scrollFrom={part.scrollFrom}
                scrollTo={part.scrollTo}
                label={part.label}
                desc={part.desc}
                index={i}
              />
            ))}
          </div>

          {/* Right side: feature callouts */}
          <div style={{
            position: "absolute", right: "clamp(1rem, 4vw, 6rem)",
            top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: "1.5rem",
            maxWidth: 280, zIndex: 2, alignItems: "flex-end",
          }}>
            <RightCallout progress={smoothProgress} from={0.15} to={0.35} text="Screen lifts off — 12 checkpoints" />
            <RightCallout progress={smoothProgress} from={0.3} to={0.55} text="Battery pulled — health & capacity checked" />
            <RightCallout progress={smoothProgress} from={0.5} to={0.75} text="Camera module — lens, focus, stabilization" />
            <RightCallout progress={smoothProgress} from={0.7} to={0.95} text="Logic board — processor, memory, ports" />
          </div>

          {/* Center: 3D phone dismantling */}
          <motion.div
            style={{
              perspective: 1400,
              perspectiveOrigin: "50% 50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              opacity: globalOpacity,
              scale: reassembleScale,
            }}
          >
            <motion.div
              style={{
                rotateY: phoneRotateY,
                rotateX: phoneRotateX,
                transformStyle: "preserve-3d" as const,
                position: "relative",
                width: 220,
                height: 440,
                willChange: "transform",
              }}
            >
              {/* Phone frame (stays) */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: 36,
                background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                boxShadow: `
                  0 0 0 2px rgba(255,255,255,0.08),
                  0 30px 80px rgba(0,0,0,0.5),
                  0 0 100px color-mix(in srgb, var(--primary) 15%, transparent)
                `,
                border: "1px solid rgba(255,255,255,0.06)",
                transformStyle: "preserve-3d" as const,
              }}>
                {/* Dynamic Island */}
                <div style={{
                  position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)",
                  width: 80, height: 22, borderRadius: 11, background: "#000", zIndex: 20,
                }} />
              </div>

              {/* Screen piece — lifts off */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 10, left: 10, right: 10, bottom: 10,
                  borderRadius: 26,
                  overflow: "hidden",
                  background: "linear-gradient(180deg, #111128 0%, #0a0a1a 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  y: screenY,
                  rotateX: screenRotateX,
                  opacity: screenOpacity,
                  transformStyle: "preserve-3d" as const,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  zIndex: 5,
                }}
              >
                <div style={{ padding: "32px 16px 8px", fontSize: "0.58rem", color: "var(--primary)", fontWeight: 700, letterSpacing: "0.06em" }}>CHECKMYPHONE</div>
                <div style={{ padding: "0 16px", fontSize: "0.85rem", fontWeight: 800, color: "#fff" }}>Inspection Report</div>
                <div style={{ margin: "12px 12px 0", padding: "12px", borderRadius: 14, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>iPhone 15 Pro</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                    <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.08)" }} />
                    <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--success)" }}>96%</span>
                  </div>
                  {["Display", "Battery", "Camera", "Speaker", "Face ID"].map(t => (
                    <div key={t} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: "0.56rem" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>{t}</span>
                      <span style={{ color: "var(--success)", fontWeight: 700 }}>PASS</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Battery piece — slides right-down */}
              <motion.div
                style={{
                  position: "absolute", bottom: 60, left: 25,
                  width: 80, height: 50, borderRadius: 8,
                  background: "linear-gradient(135deg, #2d1b69, #1a1145)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 4px 20px rgba(139,92,246,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                  y: batteryY, x: batteryX, opacity: batteryOpacity,
                  transformStyle: "preserve-3d" as const,
                  zIndex: 3,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <div style={{ fontSize: "0.5rem", color: "rgba(139,92,246,0.8)", fontWeight: 700, textAlign: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", margin: "0 auto 2px" }}><rect x="1" y="6" width="18" height="12" rx="2" /><line x1="23" y1="13" x2="23" y2="11" /></svg>
                  BATTERY
                </div>
              </motion.div>

              {/* Camera module — pops up-right */}
              <motion.div
                style={{
                  position: "absolute", top: 40, right: 10,
                  width: 70, height: 70, borderRadius: 18,
                  background: "linear-gradient(135deg, #1a2332, #0d1520)",
                  border: "1px solid rgba(14,165,233,0.3)",
                  boxShadow: "0 4px 20px rgba(14,165,233,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                  y: cameraY, x: cameraX, opacity: cameraOpacity,
                  transformStyle: "preserve-3d" as const,
                  zIndex: 3,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
                }}
              >
                {/* Camera lenses */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "radial-gradient(circle, rgba(14,165,233,0.4) 30%, rgba(14,165,233,0.1) 70%)",
                      border: "1.5px solid rgba(14,165,233,0.4)",
                    }} />
                  ))}
                </div>
                <div style={{ fontSize: "0.42rem", color: "rgba(14,165,233,0.7)", fontWeight: 700 }}>CAMERA</div>
              </motion.div>

              {/* Logic board — slides left */}
              <motion.div
                style={{
                  position: "absolute", top: 140, left: 15,
                  width: 90, height: 120, borderRadius: 10,
                  background: "linear-gradient(135deg, #0d2818, #0a1f14)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  boxShadow: "0 4px 20px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.03)",
                  y: boardY, x: boardX, opacity: boardOpacity,
                  transformStyle: "preserve-3d" as const,
                  zIndex: 3,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
                  overflow: "hidden",
                }}
              >
                {/* Chip pattern */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
                  {Array.from({length:12}).map((_,i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: 1,
                      background: i % 3 === 0 ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.15)",
                    }} />
                  ))}
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 6, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.38rem", color: "rgba(34,197,94,0.6)", fontWeight: 700 }}>A17</div>
                </div>
                <div style={{ fontSize: "0.42rem", color: "rgba(34,197,94,0.6)", fontWeight: 700 }}>LOGIC BOARD</div>
              </motion.div>

              {/* Glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 350, height: 350, borderRadius: "50%",
                background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)",
                filter: "blur(50px)", pointerEvents: "none", zIndex: -1,
              }} />
            </motion.div>
          </motion.div>

          {/* Bottom: CTA appears at end */}
          <motion.div
            style={{
              position: "absolute", bottom: "clamp(2rem, 5vh, 4rem)",
              left: "50%", transform: "translateX(-50%)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem",
              opacity: ctaOpacity,
              y: ctaY,
              zIndex: 10,
            }}
          >
            <a href="#book" style={{
              padding: "0.85rem 2rem", borderRadius: "var(--radius)",
              background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
              color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem",
              boxShadow: "var(--glow)",
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
            }}>
              Book an Inspection — ₹349
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
            <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>Scroll up to explore ↓</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ScrollLabel({
  progress, scrollFrom, scrollTo, label, desc, index,
}: {
  progress: any;
  scrollFrom: number;
  scrollTo: number;
  label: string;
  desc: string;
  index: number;
}) {
  const opacity = useTransform(progress, [scrollFrom - 0.05, scrollFrom, scrollTo, scrollTo + 0.05], [0, 1, 1, 0.3]);
  const x = useTransform(progress, [scrollFrom - 0.05, scrollFrom], [-30, 0]);
  const scale = useTransform(progress, [scrollFrom, scrollFrom + 0.05, scrollTo], [0.95, 1, 1]);

  return (
    <motion.div style={{ opacity, x, scale }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        marginBottom: "0.25rem",
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: "var(--primary)", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.7rem", fontWeight: 800, flexShrink: 0,
        }}>
          {index + 1}
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
          {label}
        </div>
      </div>
      <div style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.5, paddingLeft: "2.75rem" }}>
        {desc}
      </div>
    </motion.div>
  );
}

function RightCallout({
  progress, from, to, text,
}: {
  progress: any;
  from: number;
  to: number;
  text: string;
}) {
  const opacity = useTransform(progress, [from - 0.05, from, to - 0.05, to], [0, 0.7, 0.7, 0]);
  const x = useTransform(progress, [from, from + 0.05], [30, 0]);

  return (
    <motion.div
      style={{
        opacity, x,
        padding: "0.6rem 1rem",
        borderRadius: "var(--radius)",
        background: "color-mix(in srgb, var(--surface) 80%, transparent)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(8px)",
        fontSize: "0.75rem",
        color: "var(--text2)",
        textAlign: "right" as const,
        lineHeight: 1.4,
      }}
    >
      {text}
    </motion.div>
  );
}
