"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity } from "framer-motion";

export default function Phone3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { stiffness: 150, damping: 20, mass: 0.5 });

  const rotateY = useTransform(smoothVelocity, [-1500, 0, 1500], [-35, 0, 35]);
  const rotateXFromScroll = useTransform(scrollY, [0, 3000], [-10, 10]);
  const rotateXFromVelocity = useTransform(smoothVelocity, [-1500, 0, 1500], [12, 0, -12]);
  const scale = useTransform(smoothVelocity, [-1500, 0, 1500], [0.92, 1, 0.92]);

  return (
    <div
      ref={containerRef}
      style={{
        perspective: 1200,
        perspectiveOrigin: "50% 50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem 0",
      }}
    >
      <motion.div
        style={{
          rotateY,
          rotateX: rotateXFromScroll,
          scale,
          transformStyle: "preserve-3d" as const,
          position: "relative" as const,
          willChange: "transform",
        }}
      >
        {/* Phone body */}
        <div
          style={{
            width: 220,
            height: 440,
            borderRadius: 36,
            background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            boxShadow: `
              0 0 0 2px rgba(255,255,255,0.1),
              0 25px 60px rgba(0,0,0,0.4),
              0 0 80px color-mix(in srgb, var(--primary) 20%, transparent),
              inset 0 1px 0 rgba(255,255,255,0.15)
            `,
            padding: "12px",
            position: "relative",
            transformStyle: "preserve-3d" as const,
          }}
        >
          {/* Side highlight (3D edge) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 36,
              border: "1px solid rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
          />

          {/* Notch / Dynamic Island */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: "50%",
              transform: "translateX(-50%)",
              width: 90,
              height: 24,
              borderRadius: 12,
              background: "#000",
              zIndex: 10,
            }}
          />

          {/* Screen */}
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              background: "linear-gradient(180deg, #1a1a2e 0%, #0f0f23 100%)",
            }}
          >
            {/* Status bar */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px 8px",
                fontSize: "0.65rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <span>9:41</span>
              <span style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>
              </span>
            </div>

            {/* App header */}
            <div style={{ padding: "4px 20px 12px" }}>
              <div style={{ fontSize: "0.6rem", color: "var(--primary)", fontWeight: 700, letterSpacing: "0.05em", marginBottom: 4 }}>
                CHECKMYPHONE
              </div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
                Inspection Report
              </div>
            </div>

            {/* Report card inside phone */}
            <div
              style={{
                margin: "0 12px",
                padding: "14px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#fff" }}>iPhone 15 Pro</div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.4)", marginTop: 2 }}>INS-2024-0042</div>
                </div>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "conic-gradient(var(--success) 96%, rgba(255,255,255,0.1) 96%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#1a1a2e",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.6rem",
                      fontWeight: 800,
                      color: "var(--success)",
                    }}
                  >
                    96%
                  </div>
                </div>
              </div>

              {/* Test items */}
              {[
                { name: "Display", status: "pass" },
                { name: "Battery Health", status: "pass" },
                { name: "Camera", status: "pass" },
                { name: "Speaker", status: "pass" },
                { name: "Face ID", status: "pass" },
              ].map((item) => (
                <div
                  key={item.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "6px 0",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    fontSize: "0.62rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{item.name}</span>
                  <span style={{ color: "var(--success)", fontWeight: 700 }}>PASS</span>
                </div>
              ))}
            </div>

            {/* Bottom CTA inside phone */}
            <div style={{ padding: "14px 12px" }}>
              <div
                style={{
                  padding: "10px",
                  borderRadius: 12,
                  background: "linear-gradient(135deg, var(--primary), var(--primary-hover))",
                  textAlign: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                Share Report
              </div>
            </div>
          </div>
        </div>

        {/* Floating glow behind phone */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 15%, transparent), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
      </motion.div>
    </div>
  );
}
