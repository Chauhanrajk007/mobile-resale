"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
} from "framer-motion";

const PW = 240;
const PH = 490;

const PARTS = [
  { label: "30+ Checkpoints", desc: "Every angle inspected under studio light" },
  { label: "Display & Touch", desc: "Dead pixels, burn-in, touch accuracy" },
  { label: "Battery Health", desc: "Capacity, cycle count, swelling detection" },
  { label: "Camera & Sensors", desc: "Focus, stabilization, Face ID integrity" },
  { label: "Verified Report", desc: "Shareable, tamper-proof certificate" },
];

export default function PhoneDismantle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sp = useSpring(scrollYProgress, { stiffness: 45, damping: 22, mass: 0.5 });
  const rawVelocity = useVelocity(scrollYProgress);
  const velocity = useSpring(rawVelocity, { stiffness: 60, damping: 12 });
  const vBoost = useTransform(velocity, [-1.5, 0, 1.5], [-6, 0, 6]);

  // Stable 3D container tilt instead of spinning 360 degrees
  const containerRotX = useTransform(sp, [0, 0.5, 1], [18, 12, 8]);
  const containerRotY = useTransform(sp, [0, 0.5, 1], [-14, -8, 0]);
  const containerRotZ = useTransform(sp, [0, 0.5, 1], [-2, 0, 0]);

  // Exploded View Z-axis (Depth) and Sideways separation translations
  const screenZ = useTransform(sp, [0.08, 0.35], [5, 180]);
  const screenY = useTransform(sp, [0.08, 0.35], [0, -120]);
  const screenRX = useTransform(sp, [0.08, 0.35], [0, -18]);
  const screenOp = useTransform(sp, [0.05, 0.12, 0.74, 0.86], [1, 1, 1, 0]);

  const battX = useTransform(sp, [0.24, 0.50], [0, 130]);
  const battZ = useTransform(sp, [0.24, 0.50], [2, 95]);
  const battR = useTransform(sp, [0.24, 0.50], [0, 12]);
  const battOp = useTransform(sp, [0.20, 0.28, 0.80, 0.90], [0, 1, 1, 0]);

  const camX = useTransform(sp, [0.34, 0.60], [0, 125]);
  const camY = useTransform(sp, [0.34, 0.60], [0, -135]);
  const camZ = useTransform(sp, [0.34, 0.60], [5, 120]);
  const camR = useTransform(sp, [0.34, 0.60], [0, -15]);
  const camOp = useTransform(sp, [0.30, 0.38, 0.80, 0.90], [0, 1, 1, 0]);

  const boardX = useTransform(sp, [0.44, 0.70], [0, -130]);
  const boardY = useTransform(sp, [0.44, 0.70], [0, 50]);
  const boardZ = useTransform(sp, [0.44, 0.70], [2, 100]);
  const boardR = useTransform(sp, [0.44, 0.70], [0, -8]);
  const boardOp = useTransform(sp, [0.40, 0.48, 0.80, 0.90], [0, 1, 1, 0]);

  const spkY = useTransform(sp, [0.54, 0.80], [0, 125]);
  const spkZ = useTransform(sp, [0.54, 0.80], [2, 85]);
  const spkR = useTransform(sp, [0.54, 0.80], [0, 14]);
  const spkOp = useTransform(sp, [0.50, 0.58, 0.80, 0.90], [0, 1, 1, 0]);

  // Glowing Scanner Line Sweep
  const scannerY = useTransform(sp, [0.50, 0.85], [-230, 230]);
  const scannerOp = useTransform(sp, [0.48, 0.52, 0.82, 0.86], [0, 1, 1, 0]);

  const ctaOp = useTransform(sp, [0.88, 0.96], [0, 1]);
  const ctaY = useTransform(sp, [0.88, 0.96], [30, 0]);

  // Floating HUD Diagnostic Information Indicators (Fades in dynamically)
  const lOps = [
    useTransform(sp, [0.08, 0.16, 0.24, 0.32], [0, 1, 1, 0]),
    useTransform(sp, [0.22, 0.30, 0.42, 0.50], [0, 1, 1, 0]),
    useTransform(sp, [0.36, 0.44, 0.56, 0.64], [0, 1, 1, 0]),
    useTransform(sp, [0.48, 0.56, 0.68, 0.76], [0, 1, 1, 0]),
    useTransform(sp, [0.60, 0.68, 0.82, 0.90], [0, 1, 1, 0]),
  ];
  const lXs = [
    useTransform(sp, [0.08, 0.16], [-30, 0]),
    useTransform(sp, [0.22, 0.30], [-30, 0]),
    useTransform(sp, [0.36, 0.44], [-30, 0]),
    useTransform(sp, [0.48, 0.56], [-30, 0]),
    useTransform(sp, [0.60, 0.68], [-30, 0]),
  ];
  const rOps = [
    useTransform(sp, [0.12, 0.20, 0.28, 0.36], [0, 1, 1, 0]),
    useTransform(sp, [0.28, 0.36, 0.48, 0.56], [0, 1, 1, 0]),
    useTransform(sp, [0.42, 0.50, 0.62, 0.70], [0, 1, 1, 0]),
    useTransform(sp, [0.54, 0.62, 0.74, 0.82], [0, 1, 1, 0]),
    useTransform(sp, [0.66, 0.74, 0.86, 0.94], [0, 1, 1, 0]),
  ];
  const rXs = [
    useTransform(sp, [0.12, 0.20], [30, 0]),
    useTransform(sp, [0.28, 0.36], [30, 0]),
    useTransform(sp, [0.42, 0.50], [30, 0]),
    useTransform(sp, [0.54, 0.62], [30, 0]),
    useTransform(sp, [0.66, 0.74], [30, 0]),
  ];

  const imgStyle = (w: number, h: number): React.CSSProperties => ({
    width: w,
    height: h,
    display: "block",
    borderRadius: 44,
    overflow: "hidden",
    mixBlendMode: "screen", // Key out solid black background cleanly
  });

  return (
    <div ref={containerRef} style={{ height: "520vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", position: "relative" }}>

          {/* Ambient Glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%)", filter: "blur(90px)", pointerEvents: "none" }} />

          {/* Left HUD Information Box */}
          <div style={{ position: "absolute", left: "clamp(1rem, 4vw, 6rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "2.25rem", maxWidth: 320, zIndex: 10 }}>
            {PARTS.map((part, i) => (
              <motion.div key={i} style={{ opacity: lOps[i], x: lXs[i] }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.45rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, white))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, flexShrink: 0, boxShadow: "0 2px 14px color-mix(in srgb, var(--primary) 40%, transparent)" }}>{i + 1}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{part.label}</div>
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--text2)", lineHeight: 1.5, paddingLeft: "3rem" }}>{part.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* Right HUD Diagnostic Scan Readings */}
          <div style={{ position: "absolute", right: "clamp(1rem, 4vw, 6rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 290, zIndex: 10, alignItems: "flex-end" }}>
            {[
              { op: rOps[0], x: rXs[0], text: "12 checkpoints — screen & display" },
              { op: rOps[1], x: rXs[1], text: "Lithium cell health, cycles & swelling" },
              { op: rOps[2], x: rXs[2], text: "Aperture focus & stabilization test" },
              { op: rOps[3], x: rXs[3], text: "Logic gate pathways & processor logic" },
              { op: rOps[4], x: rXs[4], text: "Decibel driver, audio grille check" },
            ].map((c, i) => (
              <motion.div
                key={i}
                style={{
                  opacity: c.op,
                  x: c.x,
                  padding: "0.85rem 1.25rem",
                  borderRadius: "var(--radius)",
                  background: "color-mix(in srgb, var(--surface) 75%, transparent)",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--text)",
                  textAlign: "right",
                  lineHeight: 1.45,
                  boxShadow: "0 4px 28px rgba(0,0,0,0.08)",
                }}
              >
                {c.text}
              </motion.div>
            ))}
          </div>

          {/* 3D Exploded Teardown Container */}
          <motion.div
            style={{
              perspective: 2000,
              perspectiveOrigin: "50% 50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 5,
            }}
          >
            <motion.div
              style={{
                rotateX: containerRotX,
                rotateY: containerRotY,
                rotateZ: containerRotZ,
                transformStyle: "preserve-3d",
                position: "relative",
                width: PW,
                height: PH,
                willChange: "transform",
              }}
            >
              {/* Back Glass Shell */}
              <div style={{ position: "absolute", width: PW, height: PH, borderRadius: 44, transform: "rotateY(180deg) translateZ(8px)", backfaceVisibility: "hidden", overflow: "hidden" }}>
                <img src="/phone/phone_back.jpg" style={imgStyle(PW, PH)} alt="Smartphone Titanium Shell" draggable={false} />
              </div>

              {/* Chassis Internal Chassis Layer */}
              <div style={{ position: "absolute", width: PW - 6, height: PH - 6, top: 3, left: 3, borderRadius: 38, transform: "translateZ(0px)", backfaceVisibility: "hidden", overflow: "hidden" }}>
                <img src="/phone/phone_chassis.jpg" style={{ width: PW - 6, height: PH - 6, display: "block", mixBlendMode: "screen" }} alt="Smart Chassis" draggable={false} />
              </div>

              {/* Exploded Component: 1. Front Glass Display Panel */}
              <motion.div style={{ position: "absolute", width: PW, height: PH, translateZ: screenZ, y: screenY, rotateX: screenRX, opacity: screenOp, transformStyle: "preserve-3d", zIndex: 9, filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.45))" }}>
                <img src="/phone/phone_front.jpg" style={imgStyle(PW, PH)} alt="Dynamic Island Screen" draggable={false} />
              </motion.div>

              {/* Exploded Component: 2. Smart Battery Cell */}
              <motion.div style={{ position: "absolute", top: 108, right: 14, x: battX, rotate: battR, opacity: battOp, transformStyle: "preserve-3d", zIndex: 6, translateZ: battZ }}>
                <img src="/phone/phone_battery.jpg" style={{ width: 116, height: 236, display: "block", mixBlendMode: "screen" }} alt="Diagnostics Battery Cell" draggable={false} />
              </motion.div>

              {/* Exploded Component: 3. Camera Sensor Ring Array */}
              <motion.div style={{ position: "absolute", top: 14, left: 14, x: camX, y: camY, rotate: camR, opacity: camOp, transformStyle: "preserve-3d", zIndex: 6, translateZ: camZ }}>
                <img src="/phone/phone_camera.jpg" style={{ width: 94, height: 94, display: "block", mixBlendMode: "screen" }} alt="Triple Lens Camera Sensor" draggable={false} />
              </motion.div>

              {/* Exploded Component: 4. PCB Motherboard Logic Board */}
              <motion.div style={{ position: "absolute", top: 44, left: 14, x: boardX, y: boardY, rotate: boardR, opacity: boardOp, transformStyle: "preserve-3d", zIndex: 6, translateZ: boardZ }}>
                <img src="/phone/phone_board.jpg" style={{ width: 82, height: 154, display: "block", mixBlendMode: "screen" }} alt="Logic Board Chip" draggable={false} />
              </motion.div>

              {/* Exploded Component: 5. Speaker Box Driver */}
              <motion.div style={{ position: "absolute", bottom: 52, left: 14, y: spkY, rotate: spkR, opacity: spkOp, transformStyle: "preserve-3d", zIndex: 6, translateZ: spkZ }}>
                <img src="/phone/phone_speaker.jpg" style={{ width: 86, height: 52, display: "block", mixBlendMode: "screen" }} alt="Sound Speaker Chamber" draggable={false} />
              </motion.div>

              {/* Laser Scanning Laser Beam Overlay */}
              <motion.div
                style={{
                  position: "absolute",
                  left: 6,
                  width: PW - 12,
                  height: 6,
                  background: "linear-gradient(90deg, rgba(34,197,94,0), rgba(34,197,94,0.95) 20%, rgba(34,197,94,0.95) 80%, rgba(34,197,94,0))",
                  boxShadow: "0 0 16px #22c55e, 0 0 4px #22c55e",
                  zIndex: 8,
                  opacity: scannerOp,
                  y: scannerY,
                  translateZ: 140,
                  pointerEvents: "none",
                  borderRadius: "50%",
                }}
              />
            </motion.div>
          </motion.div>

          {/* Sticky Bottom Call-To-Action Wrapper */}
          <motion.div style={{ position: "absolute", bottom: "clamp(2rem, 5vh, 4.5rem)", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem", opacity: ctaOp, y: ctaY, zIndex: 12 }}>
            <a href={isMobile ? "#book" : "/book"} style={{ padding: "0.95rem 2.5rem", borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, white))", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1rem", boxShadow: "0 4px 28px color-mix(in srgb, var(--primary) 40%, transparent), var(--glow)", display: "inline-flex", alignItems: "center", gap: "0.6rem", letterSpacing: "-0.01em", transition: "transform 0.2s ease" }}>
              Book an Inspection — ₹350
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <span style={{ fontSize: "0.78rem", color: "var(--text2)", fontWeight: 500 }}>Scroll down to view detailed teardown diagnostic checkpoints</span>
          </motion.div>

        </div>
      </div>
    </div>
  );
}