"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
} from "framer-motion";

const PARTS = [
  { label: "30+ Checkpoints", desc: "Every angle inspected under studio light" },
  { label: "Display & Touch", desc: "Dead pixels, burn-in, touch accuracy" },
  { label: "Battery Health", desc: "Capacity, cycle count, swelling detection" },
  { label: "Camera & Sensors", desc: "Focus, stabilization, Face ID integrity" },
  { label: "Verified Report", desc: "Shareable, tamper-proof certificate" },
];

const PHONE_W = 240;
const PHONE_H = 490;
const PHONE_D = 16;

export default function PhoneDismantle() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sp = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.5,
  });

  const rawVelocity = useVelocity(scrollYProgress);
  const velocity = useSpring(rawVelocity, { stiffness: 80, damping: 15 });

  const velocityBoost = useTransform(velocity, [-2, 0, 2], [-12, 0, 12]);

  const baseRotateY = useTransform(sp, [0, 0.5, 1], [0, 180, 360]);
  const phoneRotateY = useTransform(
    [baseRotateY, velocityBoost] as any,
    ([base, boost]: number[]) => base + boost
  );

  const phoneRotateX = useTransform(
    sp,
    [0, 0.15, 0.35, 0.5, 0.65, 0.85, 1],
    [0, 5, -3, 0, 3, -5, 0]
  );

  const screenY = useTransform(sp, [0.1, 0.3], [0, -170]);
  const screenRX = useTransform(sp, [0.1, 0.3], [0, -20]);
  const screenOp = useTransform(sp, [0.08, 0.18, 0.62, 0.76], [1, 1, 1, 0]);

  const battX = useTransform(sp, [0.25, 0.45], [0, 135]);
  const battY = useTransform(sp, [0.25, 0.45], [0, 115]);
  const battR = useTransform(sp, [0.25, 0.45], [0, 18]);
  const battOp = useTransform(sp, [0.23, 0.33, 0.6, 0.74], [0, 1, 1, 0]);

  const camX = useTransform(sp, [0.42, 0.6], [0, 145]);
  const camY = useTransform(sp, [0.42, 0.6], [0, -135]);
  const camR = useTransform(sp, [0.42, 0.6], [0, -12]);
  const camOp = useTransform(sp, [0.4, 0.5, 0.6, 0.74], [0, 1, 1, 0]);

  const boardX = useTransform(sp, [0.56, 0.74], [0, -150]);
  const boardY = useTransform(sp, [0.56, 0.74], [0, 85]);
  const boardR = useTransform(sp, [0.56, 0.74], [0, -10]);
  const boardOp = useTransform(sp, [0.54, 0.64, 0.68, 0.8], [0, 1, 1, 0]);

  const spkY = useTransform(sp, [0.68, 0.86], [0, 165]);
  const spkR = useTransform(sp, [0.68, 0.86], [0, 15]);
  const spkOp = useTransform(sp, [0.66, 0.76, 0.82, 0.92], [0, 1, 1, 0]);

  const reasScale = useTransform(sp, [0.84, 0.96], [0.9, 1]);

  const ctaOp = useTransform(sp, [0.88, 0.95], [0, 1]);
  const ctaY = useTransform(sp, [0.88, 0.95], [30, 0]);

  const lOp = (f: number, pk: number, t: number) =>
    useTransform(sp, [f, f + 0.06, pk, t], [0, 1, 1, 0]);
  const lX = (f: number) => useTransform(sp, [f, f + 0.06], [-40, 0]);
  const rOp = (f: number, pk: number, t: number) =>
    useTransform(sp, [f, f + 0.08, pk, t], [0, 1, 1, 0]);
  const rX = (f: number) => useTransform(sp, [f, f + 0.08], [40, 0]);

  const lOps = [lOp(0.1, 0.16, 0.28), lOp(0.26, 0.32, 0.46), lOp(0.42, 0.48, 0.6), lOp(0.56, 0.62, 0.74), lOp(0.7, 0.76, 0.9)];
  const lXs = [lX(0.1), lX(0.26), lX(0.42), lX(0.56), lX(0.7)];
  const rOps = [rOp(0.12, 0.2, 0.32), rOp(0.28, 0.36, 0.5), rOp(0.44, 0.52, 0.64), rOp(0.58, 0.66, 0.78), rOp(0.72, 0.8, 0.92)];
  const rXs = [rX(0.12), rX(0.28), rX(0.44), rX(0.58), rX(0.72)];

  const metallicBase =
    "linear-gradient(180deg, rgba(160,160,180,0.45) 0%, rgba(100,100,120,0.35) 30%, rgba(80,80,100,0.3) 70%, rgba(120,120,140,0.4) 100%)";
  const metallicDark =
    "linear-gradient(180deg, rgba(90,90,110,0.5) 0%, rgba(60,60,80,0.4) 40%, rgba(50,50,70,0.35) 100%)";

  return (
    <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 2rem",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--primary) 15%, transparent), transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "clamp(1rem, 4vw, 6rem)",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              maxWidth: 320,
              zIndex: 2,
            }}
          >
            {PARTS.map((part, i) => (
              <motion.div key={i} style={{ opacity: lOps[i], x: lXs[i] }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.35rem",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, white))",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      flexShrink: 0,
                      boxShadow:
                        "0 2px 12px color-mix(in srgb, var(--primary) 40%, transparent)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "var(--text)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {part.label}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text2)",
                    lineHeight: 1.5,
                    paddingLeft: "2.75rem",
                  }}
                >
                  {part.desc}
                </div>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              right: "clamp(1rem, 4vw, 6rem)",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              maxWidth: 280,
              zIndex: 2,
              alignItems: "flex-end",
            }}
          >
            {[
              { op: rOps[0], x: rXs[0], text: "12 checkpoints — screen & display" },
              { op: rOps[1], x: rXs[1], text: "Health, cycles & swelling check" },
              { op: rOps[2], x: rXs[2], text: "Lens, focus & stabilization test" },
              { op: rOps[3], x: rXs[3], text: "Processor, memory & port integrity" },
              { op: rOps[4], x: rXs[4], text: "Grille cleared, driver verified" },
            ].map((c, i) => (
              <motion.div
                key={i}
                style={{
                  opacity: c.op,
                  x: c.x,
                  padding: "0.75rem 1.1rem",
                  borderRadius: "var(--radius)",
                  background: "color-mix(in srgb, var(--surface) 60%, transparent)",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  fontSize: "0.78rem",
                  color: "var(--text2)",
                  textAlign: "right",
                  lineHeight: 1.45,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                }}
              >
                {c.text}
              </motion.div>
            ))}
          </div>

          <motion.div
            style={{
              perspective: 1800,
              perspectiveOrigin: "50% 50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              scale: reasScale,
              zIndex: 5,
            }}
          >
            <motion.div
              style={{
                rotateY: phoneRotateY,
                rotateX: phoneRotateX,
                transformStyle: "preserve-3d",
                position: "relative",
                width: PHONE_W,
                height: PHONE_H,
                willChange: "transform",
              }}
            >
              {/* FRONT FACE */}
              <div
                style={{
                  position: "absolute",
                  width: PHONE_W,
                  height: PHONE_H,
                  borderRadius: 44,
                  background: "linear-gradient(160deg, #2a2a3e 0%, #1a1a2e 40%, #12121f 100%)",
                  boxShadow: `
                    inset 0 1px 0 rgba(255,255,255,0.08),
                    inset 0 -1px 0 rgba(0,0,0,0.3),
                    0 40px 100px rgba(0,0,0,0.6),
                    0 0 120px color-mix(in srgb, var(--primary) 18%, transparent)
                  `,
                  border: "1px solid rgba(255,255,255,0.08)",
                  transform: `translateZ(${PHONE_D / 2}px)`,
                  overflow: "hidden",
                  backfaceVisibility: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "50%",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)",
                    borderRadius: "44px 44px 0 0",
                    pointerEvents: "none",
                  }}
                />

                <div style={{ position: "absolute", top: 18, left: "50%", transform: "translateX(-50%)", width: 90, height: 25, borderRadius: 12.5, background: "#000", zIndex: 20, boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" }}>
                  <div style={{ position: "absolute", top: "50%", right: 10, transform: "translateY(-50%)", width: 8, height: 8, borderRadius: "50%", background: "radial-gradient(circle, #1a1a3e, #0a0a1a)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>

                <motion.div
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    right: 10,
                    bottom: 10,
                    borderRadius: 36,
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #0c0c1d 0%, #06060f 100%)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    y: screenY,
                    rotateX: screenRX,
                    opacity: screenOp,
                    transformStyle: "preserve-3d",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
                    zIndex: 5,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 14px 4px", fontSize: "0.48rem", fontWeight: 600, color: "rgba(255,255,255,0.6)" }}>
                    <span>9:41</span>
                    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                      <svg width="10" height="8" viewBox="0 0 16 12" fill="none">
                        <rect x="0" y="8" width="3" height="4" rx="0.5" fill="rgba(255,255,255,0.5)" />
                        <rect x="4" y="5" width="3" height="7" rx="0.5" fill="rgba(255,255,255,0.6)" />
                        <rect x="8" y="2" width="3" height="10" rx="0.5" fill="rgba(255,255,255,0.8)" />
                        <rect x="12" y="0" width="3" height="12" rx="0.5" fill="#fff" />
                      </svg>
                      <svg width="14" height="8" viewBox="0 0 24 12" fill="none">
                        <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="rgba(255,255,255,0.4)" />
                        <rect x="2" y="2" width="15" height="8" rx="1" fill="#fff" />
                        <rect x="22" y="3.5" width="2" height="5" rx="1" fill="rgba(255,255,255,0.4)" />
                      </svg>
                    </div>
                  </div>
                  <div style={{ padding: "4px 14px 0", fontSize: "0.55rem", fontWeight: 700, color: "var(--primary)", letterSpacing: "0.08em" }}>
                    CHECKMYPHONE
                  </div>
                  <div style={{ padding: "0 14px", fontSize: "0.88rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.01em" }}>
                    Inspection Report
                  </div>
                  <div style={{ margin: "8px 12px 0", padding: "10px", borderRadius: 14, background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#fff" }}>iPhone 15 Pro</div>
                      <div style={{ fontSize: "0.46rem", color: "rgba(255,255,255,0.35)", padding: "2px 6px", borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>256 GB</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                      <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{ width: "96%", height: "100%", borderRadius: 99, background: "linear-gradient(90deg, var(--success), color-mix(in srgb, var(--success) 70%, white))" }} />
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--success)" }}>96%</span>
                    </div>
                    {["Display", "Battery", "Camera", "Speaker", "Face ID"].map((t) => (
                      <div key={t} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "3px 0", borderTop: "1px solid rgba(255,255,255,0.04)", fontSize: "0.52rem" }}>
                        <span style={{ color: "rgba(255,255,255,0.4)" }}>{t}</span>
                        <span style={{ color: "var(--success)", fontWeight: 700 }}>PASS</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ flex: 1 }} />
                  <div style={{ margin: "0 12px 10px", padding: "8px", borderRadius: 10, background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 80%, white))", textAlign: "center", fontSize: "0.62rem", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                    Share Report
                  </div>
                  <div style={{ height: 6 }} />
                </motion.div>
              </div>

              {/* RIGHT SIDE */}
              <div
                style={{
                  position: "absolute",
                  width: PHONE_D,
                  height: PHONE_H,
                  top: 0,
                  right: -PHONE_D / 2,
                  borderRadius: `0 ${PHONE_D / 2}px ${PHONE_D / 2}px 0`,
                  background: metallicBase,
                  borderRight: "1px solid rgba(255,255,255,0.12)",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  transform: `rotateY(90deg) translateZ(${PHONE_D / 2}px)`,
                  transformOrigin: "right center",
                  backfaceVisibility: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: "28%", left: 2, width: 12, height: 45, borderRadius: "3px 2px 2px 3px", background: "linear-gradient(90deg, rgba(200,200,220,0.6), rgba(140,140,160,0.4))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 3px rgba(0,0,0,0.3)" }} />
                <div style={{ position: "absolute", top: "48%", left: 2, width: 12, height: 32, borderRadius: "3px 2px 2px 3px", background: "linear-gradient(90deg, rgba(200,200,220,0.5), rgba(140,140,160,0.35))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 3px rgba(0,0,0,0.25)" }} />
              </div>

              {/* LEFT SIDE */}
              <div
                style={{
                  position: "absolute",
                  width: PHONE_D,
                  height: PHONE_H,
                  top: 0,
                  left: -PHONE_D / 2,
                  borderRadius: `${PHONE_D / 2}px 0 0 ${PHONE_D / 2}px`,
                  background: metallicDark,
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  transform: `rotateY(-90deg) translateZ(${PHONE_D / 2}px)`,
                  transformOrigin: "left center",
                  backfaceVisibility: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: "18%", right: 2, width: 10, height: 38, borderRadius: "2px 3px 3px 2px", background: "linear-gradient(270deg, rgba(180,180,200,0.5), rgba(120,120,140,0.3))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.25)" }} />
                <div style={{ position: "absolute", top: "28%", right: 2, width: 10, height: 32, borderRadius: "2px 3px 3px 2px", background: "linear-gradient(270deg, rgba(180,180,200,0.5), rgba(120,120,140,0.3))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.25)" }} />
                <div style={{ position: "absolute", top: "38%", right: 2, width: 10, height: 32, borderRadius: "2px 3px 3px 2px", background: "linear-gradient(270deg, rgba(180,180,200,0.5), rgba(120,120,140,0.3))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 1px 2px rgba(0,0,0,0.25)" }} />
                <div style={{ position: "absolute", top: "52%", right: 2, width: 10, height: 70, borderRadius: "2px 3px 3px 2px", background: "linear-gradient(270deg, rgba(160,160,180,0.4), rgba(100,100,120,0.25))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 2px rgba(0,0,0,0.2)" }} />
              </div>

              {/* TOP SIDE */}
              <div
                style={{
                  position: "absolute",
                  width: PHONE_W,
                  height: PHONE_D,
                  top: -PHONE_D / 2,
                  left: 0,
                  borderRadius: `${PHONE_D / 2}px ${PHONE_D / 2}px 0 0`,
                  background: "linear-gradient(90deg, rgba(130,130,150,0.4), rgba(160,160,180,0.5), rgba(130,130,150,0.4))",
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  borderLeft: "1px solid rgba(255,255,255,0.05)",
                  borderRight: "1px solid rgba(255,255,255,0.05)",
                  transform: `rotateX(90deg) translateZ(${PHONE_D / 2}px)`,
                  transformOrigin: "center top",
                  backfaceVisibility: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: "radial-gradient(circle, rgba(80,80,100,0.6), rgba(50,50,70,0.3))", border: "1px solid rgba(255,255,255,0.08)" }} />
              </div>

              {/* BOTTOM SIDE */}
              <div
                style={{
                  position: "absolute",
                  width: PHONE_W,
                  height: PHONE_D,
                  bottom: -PHONE_D / 2,
                  left: 0,
                  borderRadius: `0 0 ${PHONE_D / 2}px ${PHONE_D / 2}px`,
                  background: "linear-gradient(90deg, rgba(110,110,130,0.4), rgba(140,140,160,0.5), rgba(110,110,130,0.4))",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: "1px solid rgba(255,255,255,0.04)",
                  borderRight: "1px solid rgba(255,255,255,0.04)",
                  transform: `rotateX(-90deg) translateZ(${PHONE_D / 2}px)`,
                  transformOrigin: "center bottom",
                  backfaceVisibility: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 2 }}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(150,150,170,0.4)" }} />
                  ))}
                </div>
              </div>

              {/* BACK FACE */}
              <div
                style={{
                  position: "absolute",
                  width: PHONE_W,
                  height: PHONE_H,
                  borderRadius: 44,
                  background: "linear-gradient(160deg, #1e1e32 0%, #141428 40%, #0c0c1c 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transform: `rotateY(180deg) translateZ(${PHONE_D / 2}px)`,
                  backfaceVisibility: "hidden",
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", width: 60, height: 60, borderRadius: 16, background: "linear-gradient(135deg, #1a2332, #0d1520)", border: "1px solid rgba(14,165,233,0.2)", boxShadow: "0 4px 16px rgba(14,165,233,0.15)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, padding: 10 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} style={{ width: 16, height: 16, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.4), rgba(14,165,233,0.1))", border: "1px solid rgba(14,165,233,0.3)" }} />
                    ))}
                  </div>
                </div>
                <div style={{ position: "absolute", top: 90, left: "50%", transform: "translateX(-50%)", fontSize: "0.45rem", color: "rgba(255,255,255,0.15)", fontWeight: 700, letterSpacing: "0.1em" }}>DESIGNED BY APPLE IN CALIFORNIA</div>
                <div style={{ position: "absolute", top: 105, left: "50%", transform: "translateX(-50%)", fontSize: "0.38rem", color: "rgba(255,255,255,0.1)", fontWeight: 600 }}>iPhone 15 Pro · 256GB</div>
                <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", width: 40, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* BATTERY */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 56,
                  left: 28,
                  width: 82,
                  height: 54,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #2d1b69, #1a1145)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 6px 24px rgba(139,92,246,0.25), inset 0 1px 0 rgba(255,255,255,0.06)",
                  x: battX,
                  y: battY,
                  rotate: battR,
                  opacity: battOp,
                  transformStyle: "preserve-3d",
                  zIndex: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  translateZ: 20,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="6" width="18" height="12" rx="2" /><line x1="23" y1="13" x2="23" y2="11" /></svg>
                <div style={{ fontSize: "0.42rem", color: "rgba(139,92,246,0.8)", fontWeight: 700, letterSpacing: "0.06em" }}>BATTERY</div>
                <div style={{ fontSize: "0.36rem", color: "rgba(139,92,246,0.4)" }}>3274 mAh · 89%</div>
              </motion.div>

              {/* CAMERA */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 50,
                  right: 8,
                  width: 72,
                  height: 72,
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #1a2332, #0d1520)",
                  border: "1px solid rgba(14,165,233,0.3)",
                  boxShadow: "0 6px 24px rgba(14,165,233,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                  x: camX,
                  y: camY,
                  rotate: camR,
                  opacity: camOp,
                  transformStyle: "preserve-3d",
                  zIndex: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  translateZ: 20,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "radial-gradient(circle, rgba(14,165,233,0.5) 20%, rgba(14,165,233,0.15) 70%, transparent 100%)",
                        border: "1.5px solid rgba(14,165,233,0.45)",
                        boxShadow: "0 0 8px rgba(14,165,233,0.3), inset 0 0 4px rgba(14,165,233,0.2)",
                      }}
                    />
                  ))}
                </div>
                <div style={{ fontSize: "0.4rem", color: "rgba(14,165,233,0.75)", fontWeight: 700, letterSpacing: "0.06em" }}>CAMERA</div>
              </motion.div>

              {/* LOGIC BOARD */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 140,
                  left: 18,
                  width: 92,
                  height: 124,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #0d2818, #0a1f14)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  boxShadow: "0 6px 24px rgba(34,197,94,0.12), inset 0 1px 0 rgba(255,255,255,0.03)",
                  x: boardX,
                  y: boardY,
                  rotate: boardR,
                  opacity: boardOp,
                  transformStyle: "preserve-3d",
                  zIndex: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  overflow: "hidden",
                  translateZ: 20,
                }}
              >
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 1,
                        background: i % 3 === 0 ? "rgba(34,197,94,0.5)" : "rgba(34,197,94,0.15)",
                      }}
                    />
                  ))}
                </div>
                <div style={{ width: 42, height: 42, borderRadius: 6, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ fontSize: "0.4rem", color: "rgba(34,197,94,0.7)", fontWeight: 800 }}>A17</div>
                </div>
                <div style={{ fontSize: "0.4rem", color: "rgba(34,197,94,0.6)", fontWeight: 700, letterSpacing: "0.06em" }}>LOGIC BOARD</div>
              </motion.div>

              {/* SPEAKER */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 18,
                  left: 30,
                  width: 60,
                  height: 20,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #2a2a30, #1a1a22)",
                  border: "1px solid rgba(156,163,175,0.25)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
                  y: spkY,
                  rotate: spkR,
                  opacity: spkOp,
                  transformStyle: "preserve-3d",
                  zIndex: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                  overflow: "hidden",
                  translateZ: 20,
                }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(156,163,175,0.35)" }} />
                ))}
              </motion.div>

              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)",
                  filter: "blur(60px)",
                  pointerEvents: "none",
                  zIndex: -1,
                }}
              />
            </motion.div>
          </motion.div>

          <motion.div
            style={{
              position: "absolute",
              bottom: "clamp(2rem, 5vh, 4rem)",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              opacity: ctaOp,
              y: ctaY,
              zIndex: 10,
            }}
          >
            <a
              href="#book"
              style={{
                padding: "0.9rem 2.2rem",
                borderRadius: "var(--radius)",
                background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, white))",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 40%, transparent), var(--glow)",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                letterSpacing: "-0.01em",
              }}
            >
              Book an Inspection — ₹349
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>
              Scroll to explore the inspection
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
