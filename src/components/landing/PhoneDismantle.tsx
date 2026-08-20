"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionValue,
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

// ── HIGH-FIDELITY VECTOR COMPONENTS ──

function PhoneFront({ sheenX }: { sheenX: any }) {
  return (
    <svg viewBox="0 0 240 490" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: PW, height: PH, display: "block" }}>
      <defs>
        <linearGradient id="front-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
          <stop offset="50%" stopColor="rgba(255,255,255,0.22)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
        <linearGradient id="front-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0a1b"/>
          <stop offset="50%" stopColor="#050508"/>
          <stop offset="100%" stopColor="#090412"/>
        </linearGradient>
        <linearGradient id="glow-btn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7"/>
          <stop offset="100%" stopColor="#6366f1"/>
        </linearGradient>
      </defs>
      
      {/* Outer Bezel */}
      <rect width="240" height="490" rx="44" fill="#09090b" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
      <rect x="5" y="5" width="230" height="480" rx="39" fill="url(#front-bg)"/>

      {/* Grid Overlay */}
      <g opacity="0.12">
        <path d="M 6,50 H 234 M 6,100 H 234 M 6,150 H 234 M 6,200 H 234 M 6,250 H 234 M 6,300 H 234 M 6,350 H 234 M 6,400 H 234 M 6,450 H 234" stroke="#8b5cf6" strokeWidth="0.5"/>
        <path d="M 50,6 V 484 M 100,6 V 484 M 150,6 V 484 M 200,6 V 484" stroke="#8b5cf6" strokeWidth="0.5"/>
      </g>

      <rect x="76" y="16" width="88" height="28" rx="14" fill="#000" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
      <circle cx="94" cy="30" r="4.5" fill="#111"/>
      <circle cx="94" cy="30" r="2" fill="#2563eb" opacity="0.6"/>

      <text x="32" y="34" fill="#fff" fontSize="9.5" fontWeight="700" fontFamily="system-ui">9:41</text>
      <g transform="translate(182, 25)" fill="#fff">
        <rect x="0" y="0" width="18" height="9" rx="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8"/>
        <rect x="2" y="2" width="11" height="5" rx="0.5" fill="#22c55e"/>
      </g>

      <text x="120" y="80" fill="#a855f7" fontSize="9" fontWeight="800" letterSpacing="3" textAnchor="middle" fontFamily="system-ui">SYSTEM REPORT</text>
      <text x="120" y="104" fill="#fff" fontSize="19" fontWeight="800" textAnchor="middle" fontFamily="system-ui" letterSpacing="-0.02em">Device Health</text>

      <rect x="24" y="124" width="192" height="198" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

      <circle cx="120" cy="184" r="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5"/>
      <circle cx="120" cy="184" r="30" fill="none" stroke="#22c55e" strokeWidth="5" strokeDasharray="188" strokeDashoffset="15" strokeLinecap="round" transform="rotate(-90 120 184)"/>
      <text x="120" y="188" fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="system-ui">96%</text>
      <text x="120" y="228" fill="#22c55e" fontSize="8" fontWeight="700" textAnchor="middle" fontFamily="system-ui" letterSpacing="1">EXCELLENT</text>

      <g transform="translate(36, 252)" fontFamily="system-ui" fontSize="10">
        <text x="0" y="0" fill="rgba(255,255,255,0.5)">Display & Touch</text>
        <text x="144" y="0" fill="#22c55e" fontWeight="700" textAnchor="end">✓</text>
        <line x1="0" y1="4" x2="148" y2="4" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        
        <text x="0" y="18" fill="rgba(255,255,255,0.5)">Power Cell Health</text>
        <text x="144" y="18" fill="#22c55e" fontWeight="700" textAnchor="end">✓</text>
        <line x1="0" y1="22" x2="148" y2="22" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
        
        <text x="0" y="36" fill="rgba(255,255,255,0.5)">Camera Aperture</text>
        <text x="144" y="36" fill="#22c55e" fontWeight="700" textAnchor="end">✓</text>
        <line x1="0" y1="40" x2="148" y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      </g>

      <g transform="translate(24, 342)">
        <rect width="192" height="38" rx="12" fill="url(#glow-btn)"/>
        <text x="96" y="23" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle" letterSpacing="1.5" fontFamily="system-ui">VERIFIED REPORT</text>
      </g>

      <motion.rect
        x="-100"
        y="6"
        width="200"
        height="478"
        fill="url(#front-sheen)"
        style={{ x: sheenX, skewX: -20, mixBlendMode: "overlay" }}
        pointerEvents="none"
      />
    </svg>
  );
}

function PhoneBack({ sheenX }: { sheenX: any }) {
  return (
    <svg viewBox="0 0 240 490" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: PW, height: PH, display: "block" }}>
      <defs>
        <linearGradient id="back-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2e2e33"/>
          <stop offset="50%" stopColor="#1c1c1f"/>
          <stop offset="100%" stopColor="#0f0f11"/>
        </linearGradient>
        <radialGradient id="glass-lens" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#3b82f6"/>
          <stop offset="40%" stopColor="#1e3a8a"/>
          <stop offset="100%" stopColor="#090514"/>
        </radialGradient>
        <linearGradient id="back-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)"/>
          <stop offset="50%" stopColor="rgba(255,255,255,0.18)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </linearGradient>
      </defs>
      
      <rect width="240" height="490" rx="44" fill="url(#back-body)" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

      <rect x="14" y="14" width="94" height="94" rx="22" fill="#141417" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>

      <g transform="translate(38, 38)">
        <circle r="17" fill="#1c1c21" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"/>
        <circle r="13" fill="#09090b"/>
        <circle r="10" fill="url(#glass-lens)"/>
        <circle r="4" fill="#000"/>
      </g>

      <g transform="translate(38, 82)">
        <circle r="17" fill="#1c1c21" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2"/>
        <circle r="13" fill="#09090b"/>
        <circle r="10" fill="url(#glass-lens)"/>
        <circle r="4" fill="#000"/>
      </g>

      <g transform="translate(82, 60)">
        <circle r="14" fill="#1c1c21" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <circle r="11" fill="#09090b"/>
        <circle r="8" fill="url(#glass-lens)"/>
        <circle r="3" fill="#000"/>
      </g>

      <circle cx="82" cy="32" r="6" fill="#3f3f46"/>
      <circle cx="82" cy="32" r="4.5" fill="#f59e0b" opacity="0.8"/>
      <circle cx="82" cy="88" r="4" fill="#18181b" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>

      <g transform="translate(120, 245)" opacity="0.1" stroke="#fff" strokeWidth="1.8" fill="none">
        <path d="M -12,-15 H 12 L 18,0 C 18,10 8,18 0,22 C -8,18 -18,10 -18,0 Z"/>
      </g>

      <motion.rect
        x="-100"
        y="6"
        width="200"
        height="478"
        fill="url(#back-sheen)"
        style={{ x: sheenX, skewX: -20, mixBlendMode: "overlay" }}
        pointerEvents="none"
      />
    </svg>
  );
}

function Chassis() {
  return (
    <svg viewBox="0 0 234 484" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: PW - 6, height: PH - 6, display: "block" }}>
      <defs>
        <radialGradient id="chassis-coil" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ea580c"/>
          <stop offset="50%" stopColor="#92400e"/>
          <stop offset="100%" stopColor="#1c1917"/>
        </radialGradient>
      </defs>
      <rect width="234" height="484" rx="38" fill="#1c1917"/>
      <path d="M 46,120 V 380 L 160,380 V 220" fill="none" stroke="#ca8a04" strokeWidth="2.5" opacity="0.5"/>
      <circle cx="117" cy="242" r="54" fill="url(#chassis-coil)" opacity="0.85"/>
      <circle cx="117" cy="242" r="48" fill="none" stroke="#ea580c" strokeWidth="1.5" opacity="0.7"/>
      <circle cx="117" cy="242" r="40" fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.6"/>
      <rect x="14" y="44" width="82" height="154" rx="6" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="4 2"/>
      <rect x="104" y="108" width="116" height="236" rx="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" strokeDasharray="4 2"/>
    </svg>
  );
}

function Battery() {
  return (
    <svg viewBox="0 0 116 236" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 116, height: 236, display: "block" }}>
      <rect width="116" height="236" rx="8" fill="#131316" stroke="rgba(168,85,247,0.2)" strokeWidth="1"/>
      <rect x="6" y="6" width="104" height="224" rx="5" fill="none" stroke="rgba(168,85,247,0.06)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M -4,52 H 4" fill="none" stroke="#c084fc" strokeWidth="1.5"/>
      <g transform="translate(14, 24)" fontFamily="system-ui" fill="#a855f7">
        <text x="0" y="10" fontSize="8" fontWeight="800" letterSpacing="1">CMP POWER CELL</text>
        <text x="0" y="24" fill="#fff" fontSize="7" fontWeight="600">Model BATT-L15P</text>
        <text x="0" y="42" fill="rgba(255,255,255,0.4)" fontSize="6.5">Capacity: 3274 mAh</text>
        <text x="0" y="106" fill="#f43f5e" fontSize="6.5" fontWeight="800">WARNING / CAUTION</text>
        <text x="0" y="116" fill="rgba(255,255,255,0.3)" fontSize="5.5">DO NOT CRUSH OR BEND</text>
        <rect x="0" y="148" width="88" height="42" rx="8" fill="rgba(34,197,94,0.04)" stroke="#22c55e" strokeWidth="0.8"/>
        <text x="8" y="162" fill="#22c55e" fontSize="8" fontWeight="800">HEALTH VALUE</text>
        <text x="8" y="174" fill="#fff" fontSize="11" fontWeight="800">89%</text>
      </g>
    </svg>
  );
}

function CameraModule() {
  return (
    <svg viewBox="0 0 94 94" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 94, height: 94, display: "block" }}>
      <defs>
        <radialGradient id="cam-lens-3d" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0%" stopColor="#60a5fa"/>
          <stop offset="40%" stopColor="#1d4ed8"/>
          <stop offset="100%" stopColor="#0f172a"/>
        </radialGradient>
      </defs>
      <rect width="94" height="94" rx="22" fill="#141416" stroke="rgba(56,189,248,0.3)" strokeWidth="1"/>
      <g transform="translate(28, 28)">
        <circle r="14" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <circle r="10" fill="url(#cam-lens-3d)"/>
        <circle r="3" fill="#000"/>
      </g>
      <g transform="translate(28, 68)">
        <circle r="14" fill="#09090b" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
        <circle r="10" fill="url(#cam-lens-3d)"/>
        <circle r="3" fill="#000"/>
      </g>
      <g transform="translate(68, 48)">
        <circle r="12" fill="#09090b" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <circle r="8" fill="url(#cam-lens-3d)"/>
        <circle r="2.5" fill="#000"/>
      </g>
    </svg>
  );
}

function LogicBoard() {
  return (
    <svg viewBox="0 0 82 154" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 82, height: 154, display: "block" }}>
      <defs>
        <linearGradient id="pcb-color" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#022c22"/>
          <stop offset="100%" stopColor="#064e3b"/>
        </linearGradient>
      </defs>
      <rect width="82" height="154" rx="6" fill="url(#pcb-color)" stroke="rgba(34,197,94,0.3)" strokeWidth="1"/>
      <g stroke="#ca8a04" strokeWidth="0.5" fill="none" opacity="0.6">
        <path d="M 12,12 L 12,40 L 24,40 M 70,12 V 42 L 58,50"/>
        <path d="M 22,96 L 22,120 H 42 L 50,132"/>
      </g>
      <rect x="12" y="52" width="58" height="58" rx="8" fill="#18181b" stroke="rgba(34,197,94,0.5)" strokeWidth="1"/>
      <text x="41" y="82" fill="#22c55e" fontSize="8.5" fontWeight="900" textAnchor="middle" fontFamily="system-ui">A17 PRO</text>
      <text x="41" y="93" fill="rgba(255,255,255,0.3)" fontSize="5.5" textAnchor="middle" fontFamily="system-ui">6-CORE</text>
    </svg>
  );
}

function Speaker() {
  return (
    <svg viewBox="0 0 86 52" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 86, height: 52, display: "block" }}>
      <rect width="86" height="52" rx="6" fill="#1a1a1d" stroke="rgba(156,163,175,0.3)" strokeWidth="1"/>
      <rect x="14" y="16" width="58" height="20" rx="3" fill="#09090a"/>
      <line x1="20" y1="26" x2="66" y2="26" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="2 2"/>
    </svg>
  );
}

export default function PhoneDismantle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      mouseX.set((clientX / width) - 0.5);
      mouseY.set((clientY / height) - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const smoothMouseX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sp = useSpring(scrollYProgress, { stiffness: 45, damping: 22, mass: 0.5 });

  // Main Scroll Rotation Path
  const containerRotX = useTransform(sp, [0, 0.3, 0.65, 0.85, 1], [15, 20, 15, 10, 0]);
  const containerRotY = useTransform(sp, [0, 0.3, 0.65, 0.85, 1], [-15, 90, 180, 270, 360]);
  const containerRotZ = useTransform(sp, [0, 0.3, 0.65, 0.85, 1], [-4, 0, 4, 0, 0]);

  const hoverRotX = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const hoverRotY = useTransform(smoothMouseX, [-0.5, 0.5], [-12, 12]);

  const finalRotX = useTransform([containerRotX, hoverRotX] as any, ([cX, hX]: number[]) => cX + (hX || 0));
  const finalRotY = useTransform([containerRotY, hoverRotY] as any, ([cY, hY]: number[]) => cY + (hY || 0));

  // ── 3D EXPLODED OUTWARD TRANSLATIONS (X, Y, Z coordinates) ──
  
  // Screen detaches forward (Z-elevation) and pushes upward (Y)
  const screenZ = useTransform(sp, [0.05, 0.35, 0.75, 0.90], [0, 220, 220, 0]);
  const screenY = useTransform(sp, [0.05, 0.35, 0.75, 0.90], [0, -120, -120, 0]);
  const screenOp = useTransform(sp, [0.0, 0.05, 0.85, 0.90], [1, 1, 1, 1]);

  // Back panel detaches backward (Z-depth) and pushes downward (Y)
  const backZ = useTransform(sp, [0.05, 0.35, 0.75, 0.90], [0, -120, -120, 0]);
  const backY = useTransform(sp, [0.05, 0.35, 0.75, 0.90], [0, 60, 60, 0]);
  const backOp = useTransform(sp, [0.0, 0.05, 0.85, 0.90], [1, 1, 1, 1]);

  // Camera Module explodes forward (Z) and floats out to the top-right (X, Y)
  const camZ = useTransform(sp, [0.25, 0.50, 0.75, 0.90], [0, 160, 160, 0]);
  const camX = useTransform(sp, [0.25, 0.50, 0.75, 0.90], [0, 140, 140, 0]);
  const camY = useTransform(sp, [0.25, 0.50, 0.75, 0.90], [0, -90, -90, 0]);
  const camOp = useTransform(sp, [0.20, 0.28, 0.85, 0.92], [0, 1, 1, 0]);

  // Logic Board explodes forward (Z) and floats out to the left (X)
  const boardZ = useTransform(sp, [0.30, 0.55, 0.75, 0.90], [0, 120, 120, 0]);
  const boardX = useTransform(sp, [0.30, 0.55, 0.75, 0.90], [0, -140, -140, 0]);
  const boardY = useTransform(sp, [0.30, 0.55, 0.75, 0.90], [0, 10, 10, 0]);
  const boardOp = useTransform(sp, [0.25, 0.33, 0.85, 0.92], [0, 1, 1, 0]);

  // Battery explodes forward (Z) and floats out to the right (X, Y)
  const battZ = useTransform(sp, [0.35, 0.60, 0.75, 0.90], [0, 90, 90, 0]);
  const battX = useTransform(sp, [0.35, 0.60, 0.75, 0.90], [0, 150, 150, 0]);
  const battY = useTransform(sp, [0.35, 0.60, 0.75, 0.90], [0, 50, 50, 0]);
  const battOp = useTransform(sp, [0.30, 0.38, 0.85, 0.92], [0, 1, 1, 0]);

  // Speaker explodes forward (Z) and floats down-left (X, Y)
  const spkZ = useTransform(sp, [0.40, 0.65, 0.75, 0.90], [0, 60, 60, 0]);
  const spkX = useTransform(sp, [0.40, 0.65, 0.75, 0.90], [0, -120, -120, 0]);
  const spkY = useTransform(sp, [0.40, 0.65, 0.75, 0.90], [0, 130, 130, 0]);
  const spkOp = useTransform(sp, [0.35, 0.43, 0.85, 0.92], [0, 1, 1, 0]);

  const sheenX = useTransform(sp, [0, 0.4, 0.75, 1], [-250, 250, -250, 250]);

  // Glowing laser sweep
  const scannerY = useTransform(sp, [0.45, 0.80], [-230, 230]);
  const scannerOp = useTransform(sp, [0.42, 0.48, 0.78, 0.84], [0, 1, 1, 0]);

  const ctaOp = useTransform(sp, [0.88, 0.96], [0, 1]);
  const ctaY = useTransform(sp, [0.88, 0.96], [30, 0]);

  return (
    <div ref={containerRef} style={{ height: "520vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", position: "relative" }}>

          {/* Ambient Glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 650, height: 650, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 18%, transparent), transparent 70%)", filter: "blur(90px)", pointerEvents: "none" }} />

          {/* Left HUD Information Box (Hidden when 3D holographic text is visible on desktop) */}
          <motion.div className="hide-on-mobile" style={{ position: "absolute", left: "clamp(1rem, 4vw, 6rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "2.25rem", maxWidth: 320, zIndex: 10, opacity: useTransform(sp, [0, 0.15, 0.85, 1], [1, 0.1, 0.1, 1]) }}>
            {PARTS.map((part, i) => (
              <div key={i}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "0.45rem" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, white))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 800, flexShrink: 0, boxShadow: "0 2px 14px color-mix(in srgb, var(--primary) 40%, transparent)" }}>{i + 1}</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{part.label}</div>
                </div>
                <div style={{ fontSize: "0.88rem", color: "var(--text2)", lineHeight: 1.5, paddingLeft: "3rem" }}>{part.desc}</div>
              </div>
            ))}
          </motion.div>

          {/* Right HUD Diagnostic Scan Readings (Hidden when 3D holographic text is active) */}
          <motion.div className="hide-on-mobile" style={{ position: "absolute", right: "clamp(1rem, 4vw, 6rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 290, zIndex: 10, alignItems: "flex-end", opacity: useTransform(sp, [0, 0.15, 0.85, 1], [1, 0.1, 0.1, 1]) }}>
            {[
              "12 checkpoints — screen & display",
              "Lithium cell health, cycles & swelling",
              "Aperture focus & stabilization test",
              "Logic gate pathways & processor logic",
              "Decibel driver, audio grille check",
            ].map((text, i) => (
              <div
                key={i}
                style={{
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
                {text}
              </div>
            ))}
          </motion.div>

          {/* 3.5D Exploded Teardown Container */}
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
                rotateX: finalRotX,
                rotateY: finalRotY,
                rotateZ: containerRotZ,
                transformStyle: "preserve-3d",
                position: "relative",
                width: PW,
                height: PH,
                willChange: "transform",
              }}
            >
              {/* Dynamic Parallax Shadow Layer beneath floating Screen */}
              <motion.div
                style={{
                  position: "absolute",
                  width: PW - 8,
                  height: PH - 8,
                  top: 4,
                  left: 4,
                  z: 1,
                  background: "#000",
                  borderRadius: 44,
                  pointerEvents: "none",
                  opacity: useTransform(screenZ, [0, 220], [0, 0.55]),
                  filter: useTransform(screenZ, [0, 220], ["blur(1px)", "blur(24px)"]),
                  scale: useTransform(screenZ, [0, 220], [1, 0.85]),
                }}
              />

              {/* Back Glass Shell (Extruded 3D style) */}
              <motion.div style={{
                position: "absolute", width: PW, height: PH, borderRadius: 44, transformStyle: "preserve-3d",
                z: backZ, y: backY, opacity: backOp, zIndex: 1,
                boxShadow: "0px -1px 0px #1a1a1f, 0px -2px 0px #141416, 0px -3px 0px #0c0c0e, 0px -4px 8px rgba(0,0,0,0.5)"
              }}>
                <PhoneBack sheenX={sheenX} />
              </motion.div>

              {/* Chassis Internal Chassis Layer (Thick extruded main frame) */}
              <div style={{
                position: "absolute", width: PW - 6, height: PH - 6, top: 3, left: 3, borderRadius: 38, transformStyle: "preserve-3d", zIndex: 4,
                boxShadow: "0px 1px 0px #4b5563, 0px 2px 0px #374151, 0px 3px 0px #27272a, 0px 4px 0px #1f2937, 0px 5px 0px #18181b, 0px 6px 0px #111, 0px 8px 20px rgba(0,0,0,0.6)"
              }}>
                <Chassis />
              </div>

              {/* Exploded Component: 1. Front Glass Display Panel (Extruded 3D style) */}
              <motion.div style={{
                position: "absolute", width: PW, height: PH, transformStyle: "preserve-3d",
                z: screenZ, y: screenY, opacity: screenOp, zIndex: 9,
                boxShadow: "0px 1px 0px #111, 0px 2px 0px #111, 0px 3px 0px #09090b, 0px 4px 0px #09090b, 0px 5px 16px rgba(0,0,0,0.6)"
              }}>
                <PhoneFront sheenX={sheenX} />
                
                {/* 3D Holographic Label for Screen */}
                <motion.div style={{
                  position: "absolute", left: -140, top: 40, opacity: useTransform(screenZ, [50, 150], [0, 1]),
                  color: "var(--primary)", fontSize: "10px", fontWeight: "bold", borderLeft: "2px solid var(--primary)",
                  paddingLeft: 6, transformStyle: "preserve-3d", transform: "translateZ(10px)"
                }}>
                  DISPLAY PANEL
                  <div style={{ fontSize: "8px", color: "var(--text2)", fontWeight: "normal" }}>Super Retina XDR</div>
                </motion.div>
              </motion.div>

              {/* Exploded Component: 2. Smart Battery Cell (Extruded 3D style) */}
              <motion.div style={{
                position: "absolute", top: 108, right: 14, transformStyle: "preserve-3d",
                z: battZ, x: battX, y: battY, opacity: battOp, zIndex: 6,
                boxShadow: "0px 1px 0px #222, 0px 2px 0px #1a1a1a, 0px 3px 0px #111, 0px 4px 8px rgba(0,0,0,0.5)"
              }}>
                <Battery />

                {/* 3D Holographic Label for Battery */}
                <motion.div style={{
                  position: "absolute", right: -150, top: 160, opacity: useTransform(battZ, [30, 70], [0, 1]),
                  color: "#a855f7", fontSize: "10px", fontWeight: "bold", borderRight: "2px solid #a855f7",
                  paddingRight: 6, textAlign: "right", transformStyle: "preserve-3d", transform: "translateZ(10px)"
                }}>
                  LITHIUM CELL
                  <div style={{ fontSize: "8px", color: "var(--text2)", fontWeight: "normal" }}>3274mAh Capacity</div>
                </motion.div>
              </motion.div>

              {/* Exploded Component: 3. Camera Sensor Ring Array (Extruded 3D style) */}
              <motion.div style={{
                position: "absolute", top: 14, left: 14, transformStyle: "preserve-3d",
                z: camZ, x: camX, y: camY, opacity: camOp, zIndex: 6,
                boxShadow: "0px 1px 0px #27272a, 0px 2px 0px #18181b, 0px 3px 6px rgba(0,0,0,0.5)"
              }}>
                <CameraModule />

                {/* 3D Holographic Label for Camera */}
                <motion.div style={{
                  position: "absolute", right: -150, top: 20, opacity: useTransform(camZ, [50, 120], [0, 1]),
                  color: "#38bdf8", fontSize: "10px", fontWeight: "bold", borderRight: "2px solid #38bdf8",
                  paddingRight: 6, textAlign: "right", transformStyle: "preserve-3d", transform: "translateZ(10px)"
                }}>
                  CAMERA SYSTEM
                  <div style={{ fontSize: "8px", color: "var(--text2)", fontWeight: "normal" }}>Triple Lens & LiDAR</div>
                </motion.div>
              </motion.div>

              {/* Exploded Component: 4. PCB Motherboard Logic Board (Extruded 3D style) */}
              <motion.div style={{
                position: "absolute", top: 44, left: 14, transformStyle: "preserve-3d",
                z: boardZ, x: boardX, y: boardY, opacity: boardOp, zIndex: 6,
                boxShadow: "0px 1px 0px #047857, 0px 2px 0px #022c22, 0px 3px 6px rgba(0,0,0,0.5)"
              }}>
                <LogicBoard />

                {/* 3D Holographic Label for Motherboard */}
                <motion.div style={{
                  position: "absolute", left: -140, top: 120, opacity: useTransform(boardZ, [40, 90], [0, 1]),
                  color: "#34d399", fontSize: "10px", fontWeight: "bold", borderLeft: "2px solid #34d399",
                  paddingLeft: 6, transformStyle: "preserve-3d", transform: "translateZ(10px)"
                }}>
                  A17 PRO CHIP
                  <div style={{ fontSize: "8px", color: "var(--text2)", fontWeight: "normal" }}>6-Core Processor</div>
                </motion.div>
              </motion.div>

              {/* Exploded Component: 5. Speaker Box Driver (Extruded 3D style) */}
              <motion.div style={{
                position: "absolute", bottom: 52, left: 14, transformStyle: "preserve-3d",
                z: spkZ, x: spkX, y: spkY, opacity: spkOp, zIndex: 6,
                boxShadow: "0px 1px 0px #1c1c1f, 0px 2px 0px #0a0a0c, 0px 3px 6px rgba(0,0,0,0.5)"
              }}>
                <Speaker />

                {/* 3D Holographic Label for Speaker */}
                <motion.div style={{
                  position: "absolute", left: -140, bottom: 60, opacity: useTransform(spkZ, [20, 50], [0, 1]),
                  color: "#9ca3af", fontSize: "10px", fontWeight: "bold", borderLeft: "2px solid #9ca3af",
                  paddingLeft: 6, transformStyle: "preserve-3d", transform: "translateZ(10px)"
                }}>
                  SPEAKER DRIVER
                  <div style={{ fontSize: "8px", color: "var(--text2)", fontWeight: "normal" }}>Dolby Atmos Audio</div>
                </motion.div>
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
                  z: 110,
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