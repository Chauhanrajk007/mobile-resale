"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  MotionValue,
} from "framer-motion";

const PW = 240;   // phone width  (represents ~71.5 mm)
const PH = 490;   // phone height (represents ~147 mm)
const TK = 44;    // phone depth  (represents ~8.3 mm) — the "thickness"

const PARTS = [
  { label: "30+ Checkpoints", desc: "Every angle inspected under studio light" },
  { label: "Display & Touch", desc: "Dead pixels, burn-in, touch accuracy" },
  { label: "Battery Health", desc: "Capacity, cycle count, swelling detection" },
  { label: "Camera & Sensors", desc: "Focus, stabilization, Face ID integrity" },
  { label: "Verified Report", desc: "Shareable, tamper-proof certificate" },
];

// ─────────────────────────────────────────────────────────────────────────────
// FACE 1 — OLED SCREEN PANEL (front face)
// ─────────────────────────────────────────────────────────────────────────────
function ScreenFront({ sheenX }: { sheenX: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 240 490" xmlns="http://www.w3.org/2000/svg"
      style={{ width: PW, height: PH, display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="sf-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c0919" />
          <stop offset="100%" stopColor="#080410" />
        </linearGradient>
        <linearGradient id="sf-btn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="sf-sheen-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="46%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="54%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        {/* Bezel edge highlight — the glass sits inside a raised rail */}
        <linearGradient id="sf-edge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.03)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.10)" />
        </linearGradient>
        <clipPath id="sf-clip"><rect width="240" height="490" rx="44" /></clipPath>
      </defs>

      {/* Titanium frame ring of the screen assembly */}
      <rect width="240" height="490" rx="44" fill="#070709" />
      <rect width="240" height="490" rx="44" fill="url(#sf-edge)" />

      {/* OLED panel (slightly inset from bezel) */}
      <rect x="5" y="5" width="230" height="480" rx="40" fill="url(#sf-bg)" clipPath="url(#sf-clip)" />

      {/* Faint pixel-grid texture */}
      <g opacity="0.07" clipPath="url(#sf-clip)">
        {[80,130,180,230,280,330,380,430].map(y => (
          <line key={y} x1="5" y1={y} x2="235" y2={y} stroke="#8b5cf6" strokeWidth="0.5" />
        ))}
      </g>

      {/* ── Dynamic Island ── */}
      <rect x="78" y="12" width="84" height="28" rx="14" fill="#000" />
      {/* Front camera inside island */}
      <circle cx="92" cy="26" r="5.5" fill="#06060a" />
      <circle cx="92" cy="26" r="3.5" fill="#0d163a" />
      <circle cx="92" cy="26" r="1.6" fill="#000" />
      <circle cx="90.5" cy="24.5" r="0.7" fill="rgba(255,255,255,0.5)" />
      {/* Face ID dot projector */}
      <circle cx="153" cy="26" r="1.8" fill="#111128" />

      {/* ── Status bar ── */}
      <text x="30" y="33" fill="#fff" fontSize="9.5" fontWeight="700" fontFamily="-apple-system,system-ui">9:41</text>
      {/* Signal */}
      <g fill="rgba(255,255,255,0.6)">
        <rect x="186" y="28" width="2.5" height="5" rx="0.5" />
        <rect x="190" y="26" width="2.5" height="7" rx="0.5" />
        <rect x="194" y="24" width="2.5" height="9" rx="0.5" />
        <rect x="198" y="22" width="2.5" height="11" rx="0.5" />
      </g>
      {/* Battery */}
      <rect x="216" y="23" width="17" height="9" rx="2" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" />
      <rect x="233" y="25.5" width="2.5" height="4" rx="1" fill="rgba(255,255,255,0.25)" />
      <rect x="218" y="25" width="12" height="5" rx="1" fill="#22c55e" />

      {/* ── Diagnostic UI ── */}
      <text x="120" y="75" fill="rgba(168,85,247,0.8)" fontSize="7.5" fontWeight="900" letterSpacing="3.5" textAnchor="middle" fontFamily="-apple-system,system-ui">DIAGNOSTIC REPORT</text>
      <text x="120" y="95" fill="#fff" fontSize="20" fontWeight="800" textAnchor="middle" fontFamily="-apple-system,system-ui" letterSpacing="-0.5">Device Health</text>

      {/* Health card */}
      <rect x="18" y="108" width="204" height="208" rx="18" fill="rgba(255,255,255,0.022)" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />

      {/* Ring gauge */}
      <circle cx="120" cy="176" r="37" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
      <circle cx="120" cy="176" r="37" fill="none" stroke="url(#sf-btn)" strokeWidth="8"
        strokeDasharray={2 * 3.14159 * 37} strokeDashoffset={2 * 3.14159 * 37 * 0.04}
        strokeLinecap="round" transform="rotate(-90 120 176)" />
      <text x="120" y="181" fill="#fff" fontSize="16" fontWeight="800" textAnchor="middle" fontFamily="-apple-system,system-ui">96%</text>
      <text x="120" y="225" fill="#22c55e" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="-apple-system,system-ui" letterSpacing="2">EXCELLENT CONDITION</text>

      {/* Check rows */}
      <g fontFamily="-apple-system,system-ui" fontSize="9">
        {[["Display & Touch","Pass"],["Battery 89%","Pass"],["Camera System","Pass"],["Face ID & Sensors","Pass"]].map(([k,v],i) => (
          <g key={i} transform={`translate(0,${i*18})`}>
            <text x="32" y="248" fill="rgba(255,255,255,0.42)">{k}</text>
            <text x="208" y="248" fill="#22c55e" fontWeight="700" textAnchor="end">✓ {v}</text>
            {i<3 && <line x1="32" y1="252" x2="208" y2="252" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>}
          </g>
        ))}
      </g>

      {/* CTA */}
      <rect x="18" y="332" width="204" height="42" rx="14" fill="url(#sf-btn)" />
      <text x="120" y="357" fill="#fff" fontSize="10.5" fontWeight="800" textAnchor="middle" letterSpacing="1.5" fontFamily="-apple-system,system-ui">VIEW FULL REPORT →</text>

      {/* Home indicator */}
      <rect x="84" y="473" width="72" height="4.5" rx="2.25" fill="rgba(255,255,255,0.22)" />

      {/* Glass sheen */}
      <motion.rect x="-120" y="4" width="240" height="482" rx="40"
        fill="url(#sf-sheen-g)"
        style={{ x: sheenX, skewX: -18, mixBlendMode: "overlay" } as any}
        clipPath="url(#sf-clip)" pointerEvents="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FACE 2 — TITANIUM BACK COVER (back face, rotateY=180)
// ─────────────────────────────────────────────────────────────────────────────
function BackCover({ sheenX }: { sheenX: MotionValue<number> }) {
  return (
    <svg viewBox="0 0 240 490" xmlns="http://www.w3.org/2000/svg"
      style={{ width: PW, height: PH, display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="bc-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c2c30" />
          <stop offset="50%" stopColor="#1a1a1e" />
          <stop offset="100%" stopColor="#0e0e10" />
        </linearGradient>
        <linearGradient id="bc-island" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101014" /><stop offset="100%" stopColor="#0a0a0c" />
        </linearGradient>
        <radialGradient id="bc-lens-blue" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="28%" stopColor="#3b82f6" />
          <stop offset="60%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#03060e" />
        </radialGradient>
        <radialGradient id="bc-lens-green" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="28%" stopColor="#22c55e" />
          <stop offset="60%" stopColor="#14532d" />
          <stop offset="100%" stopColor="#020a04" />
        </radialGradient>
        <radialGradient id="bc-lens-amber" cx="0.35" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="28%" stopColor="#f59e0b" />
          <stop offset="60%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#0a0502" />
        </radialGradient>
        <radialGradient id="bc-flash" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#fefce8" />
          <stop offset="40%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#78350f" />
        </radialGradient>
        <linearGradient id="bc-sheen-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="bc-clip"><rect width="240" height="490" rx="44" /></clipPath>
      </defs>

      {/* Back body */}
      <rect width="240" height="490" rx="44" fill="url(#bc-body)" />
      {/* Brushed metal texture lines */}
      <g opacity="0.04" clipPath="url(#bc-clip)">
        {Array.from({length:28}).map((_,i) => (
          <line key={i} x1="0" y1={i*18} x2="240" y2={i*18+3} stroke="#fff" strokeWidth="5"/>
        ))}
      </g>
      {/* Outer edge bevel */}
      <rect x="2" y="2" width="236" height="486" rx="42" fill="none" stroke="rgba(255,255,255,0.075)" strokeWidth="1.5"/>
      <rect x="5" y="5" width="230" height="480" rx="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>

      {/* ── CAMERA ISLAND (raised bump) ── */}
      {/* Island drop shadow */}
      <rect x="9" y="15" width="112" height="112" rx="26" fill="rgba(0,0,0,0.7)" />
      {/* Island body */}
      <rect x="10" y="12" width="110" height="110" rx="24" fill="url(#bc-island)" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2"/>
      {/* Island inner recess */}
      <rect x="13" y="15" width="104" height="104" rx="22" fill="rgba(0,0,0,0.45)" />

      {/* ── Lens 1: 48 MP Main Wide ── */}
      <g transform="translate(42,43)">
        <circle r="22.5" fill="#080809" stroke="rgba(255,255,255,0.14)" strokeWidth="1.8"/>
        <circle r="19" fill="#050406" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7"/>
        <circle r="16" fill="url(#bc-lens-blue)"/>
        <circle r="5.5" fill="rgba(0,0,0,0.94)"/>
        {/* Specular flare */}
        <circle cx="-5" cy="-5" r="3.2" fill="rgba(255,255,255,0.18)"/>
        <circle cx="-3" cy="-3" r="1.4" fill="rgba(255,255,255,0.4)"/>
        <ellipse cx="5" cy="6" rx="2.2" ry="1.4" fill="rgba(255,255,255,0.07)" transform="rotate(-30 5 6)"/>
        {/* Focus ring dashes */}
        <circle r="14" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="0.5" strokeDasharray="1.5 4"/>
        <text y="32" fill="rgba(255,255,255,0.22)" fontSize="5" textAnchor="middle" fontFamily="system-ui" fontWeight="600">48MP · ƒ/1.78</text>
      </g>

      {/* ── Lens 2: 12 MP Ultrawide ── */}
      <g transform="translate(42,95)">
        <circle r="20" fill="#080809" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
        <circle r="16.5" fill="#050406" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6"/>
        <circle r="13.5" fill="url(#bc-lens-green)"/>
        <circle r="4.5" fill="rgba(0,0,0,0.94)"/>
        <circle cx="-4" cy="-4" r="2.5" fill="rgba(255,255,255,0.16)"/>
        <circle cx="-2.5" cy="-2.5" r="1.1" fill="rgba(255,255,255,0.38)"/>
        <circle r="12" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" strokeDasharray="1.5 4"/>
        <text y="28" fill="rgba(255,255,255,0.2)" fontSize="5" textAnchor="middle" fontFamily="system-ui" fontWeight="600">12MP · ƒ/2.2 UW</text>
      </g>

      {/* ── Lens 3: 12 MP 5× Telephoto ── */}
      <g transform="translate(94,69)">
        <circle r="17.5" fill="#080809" stroke="rgba(255,255,255,0.11)" strokeWidth="1.4"/>
        <circle r="14" fill="#050406" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6"/>
        <circle r="11.5" fill="url(#bc-lens-amber)"/>
        <circle r="4" fill="rgba(0,0,0,0.94)"/>
        <circle cx="-3.5" cy="-3.5" r="2" fill="rgba(255,255,255,0.14)"/>
        <circle cx="-2" cy="-2" r="0.9" fill="rgba(255,255,255,0.36)"/>
        <circle r="10" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" strokeDasharray="1.5 4"/>
        <text y="25" fill="rgba(255,255,255,0.2)" fontSize="5" textAnchor="middle" fontFamily="system-ui" fontWeight="600">5× Tele</text>
      </g>

      {/* ── LED Flash ── */}
      <g transform="translate(94,28)">
        <circle r="8.5" fill="#1a1a1e" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
        <circle r="6.5" fill="url(#bc-flash)" opacity="0.88"/>
        <circle r="4" fill="#fffbeb" opacity="0.55"/>
      </g>

      {/* ── LiDAR Scanner ── */}
      <circle cx="94" cy="108" r="6.5" fill="#0e0e12" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
      <circle cx="94" cy="108" r="4" fill="#0a0a0e"/>
      <circle cx="94" cy="108" r="1.8" fill="rgba(100,120,200,0.5)"/>

      {/* Mic hole */}
      <circle cx="62" cy="10" r="2.8" fill="#0a0a0c" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>

      {/* Branding */}
      <text x="175" y="450" fill="rgba(255,255,255,0.065)" fontSize="7" fontWeight="600" textAnchor="middle" letterSpacing="2" fontFamily="-apple-system,system-ui">CHECKMYPHONE</text>
      <text x="175" y="462" fill="rgba(255,255,255,0.04)" fontSize="5" textAnchor="middle" fontFamily="system-ui">Model T1 · Designed in India</text>

      {/* Light sheen */}
      <motion.rect x="-120" y="0" width="240" height="490" rx="44"
        fill="url(#bc-sheen-g)"
        style={{ x: sheenX, skewX: -18, mixBlendMode: "overlay" } as any}
        clipPath="url(#bc-clip)" pointerEvents="none" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FACE 3 — LEFT RAIL (volume buttons + mute toggle)
// ─────────────────────────────────────────────────────────────────────────────
function LeftRail() {
  return (
    <svg viewBox={`0 0 ${TK} ${PH}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: TK, height: PH, display: "block" }}>
      <defs>
        <linearGradient id="lr-bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a1a1c"/><stop offset="55%" stopColor="#282828"/><stop offset="100%" stopColor="#202022"/>
        </linearGradient>
        <linearGradient id="lr-btn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#303034"/><stop offset="100%" stopColor="#3c3c40"/>
        </linearGradient>
      </defs>
      <rect width={TK} height={PH} rx="0" fill="url(#lr-bg)"/>
      {/* Outer edge highlight (facing outward) */}
      <line x1="0" y1="44" x2="0" y2={PH-44} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>
      {/* Inner edge (joins front+back face) */}
      <line x1={TK} y1="44" x2={TK} y2={PH-44} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>

      {/* Mute / Silent toggle */}
      <rect x={TK-12} y="75" width="9" height="26" rx="4.5" fill="url(#lr-btn)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
      {/* Toggle notch */}
      <circle cx={TK-7.5} cy="86" r="3" fill="#484850"/>

      {/* Volume Up */}
      <rect x={TK-12} y="124" width="9" height="48" rx="4.5" fill="url(#lr-btn)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
      <line x1={TK-10} y1="148" x2={TK-5} y2="148" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1={TK-7.5} y1="145.5" x2={TK-7.5} y2="150.5" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" strokeLinecap="round"/>

      {/* Volume Down */}
      <rect x={TK-12} y="184" width="9" height="48" rx="4.5" fill="url(#lr-btn)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
      <line x1={TK-10} y1="208" x2={TK-5} y2="208" stroke="rgba(255,255,255,0.22)" strokeWidth="1.3" strokeLinecap="round"/>

      {/* Antenna break lines */}
      <line x1="4" y1="70" x2="4" y2="73" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
      <line x1="4" y1={PH-73} x2="4" y2={PH-70} stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FACE 4 — RIGHT RAIL (power button + SIM tray)
// ─────────────────────────────────────────────────────────────────────────────
function RightRail() {
  return (
    <svg viewBox={`0 0 ${TK} ${PH}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: TK, height: PH, display: "block" }}>
      <defs>
        <linearGradient id="rr-bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#202022"/><stop offset="45%" stopColor="#282828"/><stop offset="100%" stopColor="#1a1a1c"/>
        </linearGradient>
        <linearGradient id="rr-btn" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3c3c40"/><stop offset="100%" stopColor="#303034"/>
        </linearGradient>
      </defs>
      <rect width={TK} height={PH} fill="url(#rr-bg)"/>
      <line x1="0" y1="44" x2="0" y2={PH-44} stroke="rgba(255,255,255,0.06)" strokeWidth="0.8"/>
      <line x1={TK} y1="44" x2={TK} y2={PH-44} stroke="rgba(255,255,255,0.04)" strokeWidth="0.8"/>

      {/* Power / Sleep-Wake button (long, centered on height) */}
      <rect x="3" y="152" width="9" height="70" rx="4.5" fill="url(#rr-btn)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.7"/>
      {/* Subtle center seam */}
      <line x1="4" y1="187" x2="11" y2="187" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"/>

      {/* SIM tray slot */}
      <rect x="3" y="262" width="9" height="24" rx="3.5" fill="#16161a" stroke="rgba(255,255,255,0.065)" strokeWidth="0.8"/>
      {/* SIM ejection pinhole */}
      <circle cx="7.5" cy="285" r="1.8" fill="#101012" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>

      {/* Antenna breaks */}
      <line x1={TK-4} y1="70" x2={TK-4} y2="73" stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
      <line x1={TK-4} y1={PH-73} x2={TK-4} y2={PH-70} stroke="rgba(255,255,255,0.06)" strokeWidth="2"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FACE 5 — TOP RAIL (secondary microphone)
// ─────────────────────────────────────────────────────────────────────────────
function TopRail() {
  return (
    <svg viewBox={`0 0 ${PW} ${TK}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: PW, height: TK, display: "block" }}>
      <defs>
        <linearGradient id="tr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1a1c"/><stop offset="100%" stopColor="#262628"/>
        </linearGradient>
      </defs>
      <rect width={PW} height={TK} fill="url(#tr-bg)"/>
      <line x1="44" y1="0" x2={PW-44} y2="0" stroke="rgba(255,255,255,0.055)" strokeWidth="0.8"/>
      <line x1="44" y1={TK} x2={PW-44} y2={TK} stroke="rgba(255,255,255,0.055)" strokeWidth="0.8"/>
      {/* Secondary mic */}
      <circle cx={PW * 0.62} cy={TK/2} r="2.8" fill="#0e0e10" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>
      <circle cx={PW * 0.62} cy={TK/2} r="1.4" fill="#0a0a0c"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FACE 6 — BOTTOM RAIL (USB-C + speakers + mic)
// ─────────────────────────────────────────────────────────────────────────────
function BottomRail() {
  const h = TK;
  return (
    <svg viewBox={`0 0 ${PW} ${h}`} xmlns="http://www.w3.org/2000/svg"
      style={{ width: PW, height: h, display: "block" }}>
      <defs>
        <linearGradient id="br-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262628"/><stop offset="100%" stopColor="#1a1a1c"/>
        </linearGradient>
      </defs>
      <rect width={PW} height={h} fill="url(#br-bg)"/>
      <line x1="44" y1="0" x2={PW-44} y2="0" stroke="rgba(255,255,255,0.055)" strokeWidth="0.8"/>
      <line x1="44" y1={h} x2={PW-44} y2={h} stroke="rgba(255,255,255,0.055)" strokeWidth="0.8"/>

      {/* Primary mic (far left) */}
      <circle cx="28" cy={h/2} r="2.8" fill="#0e0e10" stroke="rgba(255,255,255,0.09)" strokeWidth="0.5"/>
      <circle cx="28" cy={h/2} r="1.3" fill="#0a0a0c"/>

      {/* Left speaker holes */}
      {[46,55,64,73,82,91].map(x => (
        <circle key={x} cx={x} cy={h/2} r="2.2" fill="#0c0c0e" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      ))}

      {/* USB-C port */}
      <rect x="100" y={7} width="40" height={h-14} rx={5} fill="#0a0a0c" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
      <rect x="103" y={10} width="34" height={h-20} rx={4} fill="#070709"/>

      {/* Right speaker holes */}
      {[149,158,167,176,185,194].map(x => (
        <circle key={x} cx={x} cy={h/2} r="2.2" fill="#0c0c0e" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      ))}

      {/* 5G antenna break (right) */}
      <line x1="216" y1="8" x2="216" y2={h-8} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL FRAME — the phone's guts (visible through opening)
// ─────────────────────────────────────────────────────────────────────────────
function InternalFrame() {
  return (
    <svg viewBox="0 0 240 490" xmlns="http://www.w3.org/2000/svg"
      style={{ width: PW, height: PH, display: "block" }}>
      <defs>
        <linearGradient id="if-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141416"/><stop offset="100%" stopColor="#0e0e10"/>
        </linearGradient>
        <linearGradient id="if-pcb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#042a1c"/><stop offset="100%" stopColor="#063d28"/>
        </linearGradient>
        <linearGradient id="if-batt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#18154a"/><stop offset="100%" stopColor="#0e0c1e"/>
        </linearGradient>
        <radialGradient id="if-coil" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#92400e"/>
          <stop offset="65%" stopColor="#78350f"/>
          <stop offset="100%" stopColor="#1c1917"/>
        </radialGradient>
        <radialGradient id="if-cam" cx="0.38" cy="0.38" r="0.62">
          <stop offset="0%" stopColor="#60a5fa"/><stop offset="45%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#060410"/>
        </radialGradient>
      </defs>

      {/* Chassis base (dark aluminum mid-frame) */}
      <rect width="240" height="490" rx="44" fill="url(#if-bg)"/>
      <rect x="6" y="6" width="228" height="478" rx="40" fill="#111114"/>
      <rect x="10" y="10" width="220" height="470" rx="36" fill="#0d0d0f"/>

      {/* ── LOGIC BOARD (top-left quadrant, green PCB) ── */}
      <rect x="14" y="48" width="96" height="172" rx="8" fill="url(#if-pcb)" stroke="rgba(34,197,94,0.18)" strokeWidth="1"/>
      {/* PCB via-hole matrix */}
      <g fill="rgba(202,138,4,0.12)">
        {Array.from({length:25}).map((_,i) => (
          <circle key={i} cx={18+(i%5)*16} cy={54+Math.floor(i/5)*16} r="1.5"/>
        ))}
      </g>
      {/* Trace lines */}
      <g stroke="#ca8a04" strokeWidth="0.6" fill="none" opacity="0.38">
        <path d="M24,72 H82 M24,84 H66 M24,96 H74 M24,108 H58"/>
        <path d="M82,72 V124 H66 V152"/>
        <path d="M24,152 H52 V172 H96"/>
        <path d="M54,192 V212 H90"/>
      </g>
      {/* Central CPU die */}
      <rect x="28" y="102" width="68" height="66" rx="9" fill="#091008" stroke="rgba(34,197,94,0.42)" strokeWidth="1"/>
      <rect x="32" y="106" width="60" height="58" rx="7" fill="#0c1a0c"/>
      <text x="62" y="132" fill="#22c55e" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="system-ui" letterSpacing="0.5">A17 PRO</text>
      <text x="62" y="143" fill="rgba(34,197,94,0.38)" fontSize="4.8" textAnchor="middle" fontFamily="system-ui">6-core · 3nm · TSMC</text>
      <text x="62" y="153" fill="rgba(34,197,94,0.22)" fontSize="4" textAnchor="middle" fontFamily="system-ui">S/N: APL1W104</text>
      {/* Sub-chips */}
      <rect x="28" y="66" width="26" height="18" rx="2.5" fill="#091008" stroke="rgba(34,197,94,0.18)" strokeWidth="0.5"/>
      <text x="41" y="77.5" fill="rgba(34,197,94,0.45)" fontSize="4.5" textAnchor="middle" fontFamily="system-ui">5G UW</text>
      <rect x="60" y="66" width="26" height="18" rx="2.5" fill="#091008" stroke="rgba(34,197,94,0.18)" strokeWidth="0.5"/>
      <text x="73" y="77.5" fill="rgba(34,197,94,0.45)" fontSize="4.5" textAnchor="middle" fontFamily="system-ui">8GB LP5</text>
      {/* Flex ribbon connectors from board */}
      <rect x="110" y="74" width="4" height="42" rx="2" fill="#d97706" opacity="0.52"/>
      <rect x="110" y="120" width="4" height="34" rx="2" fill="#d97706" opacity="0.42"/>

      {/* ── FRONT CAMERA MODULE (top area) ── */}
      <rect x="114" y="18" width="52" height="32" rx="7" fill="#0a0a0e" stroke="rgba(56,189,248,0.18)" strokeWidth="0.8"/>
      <circle cx="130" cy="34" r="9.5" fill="#060408" stroke="rgba(56,189,248,0.22)" strokeWidth="0.8"/>
      <circle cx="130" cy="34" r="6.5" fill="url(#if-cam)"/>
      <circle cx="130" cy="34" r="2.5" fill="#000"/>
      <circle cx="128" cy="32" r="1" fill="rgba(255,255,255,0.45)"/>
      <text x="152" y="36" fill="rgba(56,189,248,0.38)" fontSize="4.5" textAnchor="middle" fontFamily="system-ui">FACE ID · TrueDepth</text>

      {/* ── BATTERY (right half, largest component) ── */}
      <rect x="116" y="108" width="110" height="236" rx="9" fill="url(#if-batt)" stroke="rgba(168,85,247,0.22)" strokeWidth="1"/>
      <line x1="116" y1="226" x2="226" y2="226" stroke="rgba(168,85,247,0.06)" strokeWidth="1"/>
      <text x="171" y="150" fill="rgba(168,85,247,0.52)" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="system-ui" letterSpacing="0.5">CMP POWER</text>
      <text x="171" y="163" fill="rgba(255,255,255,0.18)" fontSize="5.5" textAnchor="middle" fontFamily="system-ui">3274 mAh · Li-Ion · 3.85V</text>
      <text x="171" y="176" fill="rgba(244,63,94,0.55)" fontSize="5" fontWeight="700" textAnchor="middle" fontFamily="system-ui">⚠ DO NOT PUNCTURE</text>
      <rect x="124" y="190" width="94" height="50" rx="8" fill="rgba(34,197,94,0.04)" stroke="rgba(34,197,94,0.18)" strokeWidth="0.7"/>
      <text x="171" y="209" fill="#22c55e" fontSize="6.5" fontWeight="800" textAnchor="middle" fontFamily="system-ui">BATTERY HEALTH</text>
      <text x="171" y="228" fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle" fontFamily="system-ui">89%</text>
      <text x="171" y="238" fill="rgba(255,255,255,0.18)" fontSize="4.5" textAnchor="middle" fontFamily="system-ui">342 CYCLES</text>
      {/* Battery connector */}
      <rect x="154" y="104" width="24" height="6" rx="2" fill="#d97706" opacity="0.6"/>

      {/* ── WIRELESS CHARGING COIL (concentric rings below battery) ── */}
      <circle cx="171" cy="325" r="40" fill="url(#if-coil)" opacity="0.4"/>
      <circle cx="171" cy="325" r="34" fill="none" stroke="#d97706" strokeWidth="1.6" opacity="0.42"/>
      <circle cx="171" cy="325" r="27" fill="none" stroke="#ea580c" strokeWidth="1.2" opacity="0.36"/>
      <circle cx="171" cy="325" r="20" fill="none" stroke="#d97706" strokeWidth="0.8" opacity="0.28"/>
      <circle cx="171" cy="325" r="13" fill="none" stroke="#ea580c" strokeWidth="0.5" opacity="0.18"/>

      {/* ── SPEAKER (bottom left) ── */}
      <rect x="14" y="398" width="92" height="50" rx="7" fill="#0a0a0c" stroke="rgba(156,163,175,0.13)" strokeWidth="0.8"/>
      <g fill="rgba(255,255,255,0.048)">
        {Array.from({length:14}).map((_,i) => (
          <rect key={i} x={18+(i%7)*11} y={408+Math.floor(i/7)*13} width="7" height="7" rx="1.5"/>
        ))}
      </g>
      <circle cx="80" cy="423" r="13" fill="#080808" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
      <circle cx="80" cy="423" r="8.5" fill="rgba(245,158,11,0.1)"/>
      <circle cx="80" cy="423" r="4" fill="rgba(245,158,11,0.05)"/>

      {/* ── USB-C PORT ── */}
      <rect x="84" y="453" width="72" height="22" rx="6" fill="#0c0c0e" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7"/>
      <rect x="90" y="458" width="60" height="8" rx="3.5" fill="#111115"/>
      <text x="120" y="464.5" fill="rgba(255,255,255,0.07)" fontSize="4" textAnchor="middle" fontFamily="system-ui">USB-C 3.2</text>

      {/* ── CORNER SCREW POSTS (Phillips heads) ── */}
      {[[22,22],[218,22],[22,468],[218,468]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="5.5" fill="#1c1c1e" stroke="rgba(255,255,255,0.11)" strokeWidth="0.8"/>
          <line x1={cx-2.8} y1={cy} x2={cx+2.8} y2={cy} stroke="rgba(255,255,255,0.2)" strokeWidth="0.9" strokeLinecap="round"/>
          <line x1={cx} y1={cy-2.8} x2={cx} y2={cy+2.8} stroke="rgba(255,255,255,0.2)" strokeWidth="0.9" strokeLinecap="round"/>
        </g>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPLODED FLOATING COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function BatteryPanel() {
  return (
    <svg viewBox="0 0 106 232" xmlns="http://www.w3.org/2000/svg" style={{ width: 106, height: 232, display: "block" }}>
      <defs>
        <linearGradient id="bpf-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b"/><stop offset="100%" stopColor="#0c0a14"/>
        </linearGradient>
      </defs>
      <rect width="106" height="232" rx="9" fill="url(#bpf-body)" stroke="rgba(168,85,247,0.38)" strokeWidth="1"/>
      <rect x="38" y="-5" width="28" height="8" rx="2" fill="#d97706"/>
      <text x="53" y="70" fill="rgba(168,85,247,0.68)" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="system-ui">CMP POWER</text>
      <text x="53" y="82" fill="rgba(255,255,255,0.2)" fontSize="5" textAnchor="middle" fontFamily="system-ui">3274 mAh · Li-Ion</text>
      <text x="53" y="95" fill="rgba(244,63,94,0.5)" fontSize="4.5" fontWeight="700" textAnchor="middle" fontFamily="system-ui">⚠ DO NOT PUNCTURE</text>
      <rect x="12" y="108" width="82" height="52" rx="8" fill="rgba(34,197,94,0.05)" stroke="#22c55e" strokeWidth="0.7"/>
      <text x="53" y="128" fill="#22c55e" fontSize="7" fontWeight="700" textAnchor="middle" fontFamily="system-ui">HEALTH</text>
      <text x="53" y="146" fill="#fff" fontSize="15" fontWeight="800" textAnchor="middle" fontFamily="system-ui">89%</text>
      <text x="53" y="157" fill="rgba(255,255,255,0.18)" fontSize="4.5" textAnchor="middle" fontFamily="system-ui">342 CYCLES</text>
    </svg>
  );
}

function CameraPanel() {
  return (
    <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" style={{ width: 96, height: 96, display: "block" }}>
      <defs>
        <radialGradient id="cpf-l" cx="0.38" cy="0.38" r="0.62">
          <stop offset="0%" stopColor="#60a5fa"/><stop offset="40%" stopColor="#1d4ed8"/><stop offset="100%" stopColor="#060410"/>
        </radialGradient>
      </defs>
      <rect width="96" height="96" rx="22" fill="#0c0c10" stroke="rgba(56,189,248,0.32)" strokeWidth="1"/>
      <rect x="3" y="3" width="90" height="90" rx="20" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="0.8"/>
      <g transform="translate(24,24)">
        <circle r="16" fill="#060408" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2"/>
        <circle r="12" fill="url(#cpf-l)"/><circle r="4.5" fill="#000"/>
        <circle cx="-4" cy="-4" r="1.8" fill="rgba(255,255,255,0.42)"/>
      </g>
      <g transform="translate(24,70)">
        <circle r="14" fill="#060408" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        <circle r="10" fill="url(#cpf-l)"/><circle r="3.8" fill="#000"/>
        <circle cx="-3" cy="-3" r="1.4" fill="rgba(255,255,255,0.4)"/>
      </g>
      <g transform="translate(70,47)">
        <circle r="12.5" fill="#060408" stroke="rgba(255,255,255,0.1)" strokeWidth="0.9"/>
        <circle r="9" fill="url(#cpf-l)"/><circle r="3.3" fill="#000"/>
        <circle cx="-2.5" cy="-2.5" r="1.1" fill="rgba(255,255,255,0.38)"/>
      </g>
    </svg>
  );
}

function BoardPanel() {
  return (
    <svg viewBox="0 0 90 162" xmlns="http://www.w3.org/2000/svg" style={{ width: 90, height: 162, display: "block" }}>
      <defs>
        <linearGradient id="bof-pcb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#042a1c"/><stop offset="100%" stopColor="#063d28"/>
        </linearGradient>
      </defs>
      <rect width="90" height="162" rx="7" fill="url(#bof-pcb)" stroke="rgba(34,197,94,0.28)" strokeWidth="1"/>
      <g stroke="#ca8a04" strokeWidth="0.6" fill="none" opacity="0.48">
        <path d="M12,14 H70 M12,26 H56 M12,38 H62 M70,14 V64 H56 V82"/>
        <path d="M22,118 V142 H54 L62,154"/>
      </g>
      <rect x="12" y="50" width="66" height="66" rx="9" fill="#091008" stroke="rgba(34,197,94,0.48)" strokeWidth="1"/>
      <text x="45" y="79" fill="#22c55e" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="system-ui">A17 PRO</text>
      <text x="45" y="91" fill="rgba(34,197,94,0.38)" fontSize="5" textAnchor="middle" fontFamily="system-ui">6-core · 3nm</text>
    </svg>
  );
}

function SpeakerPanel() {
  return (
    <svg viewBox="0 0 92 52" xmlns="http://www.w3.org/2000/svg" style={{ width: 92, height: 52, display: "block" }}>
      <rect width="92" height="52" rx="7" fill="#0c0c10" stroke="rgba(156,163,175,0.25)" strokeWidth="1"/>
      <g fill="rgba(255,255,255,0.05)">
        {Array.from({length:14}).map((_,i) => (
          <rect key={i} x={8+(i%7)*11} y={10+Math.floor(i/7)*13} width="7" height="8" rx="1.8"/>
        ))}
      </g>
      <circle cx="76" cy="26" r="12" fill="#080808" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      <circle cx="76" cy="26" r="7.5" fill="rgba(245,158,11,0.12)"/>
      <circle cx="76" cy="26" r="3.5" fill="rgba(245,158,11,0.06)"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PhoneDismantle() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    const onMouse = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMouse);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [mouseX, mouseY]);

  const smoothMX = useSpring(mouseX, { stiffness: 55, damping: 18 });
  const smoothMY = useSpring(mouseY, { stiffness: 55, damping: 18 });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const sp = useSpring(scrollYProgress, { stiffness: 40, damping: 22, mass: 0.6 });

  // ── SCROLL STORY ──────────────────────────────────────────────────────────
  // 0.00 – 0.14  Idle — cursor hover parallax active, gentle resting tilt
  // 0.14 – 0.42  SCREEN lifts off (Z+) — front glass separates from body
  // 0.42 – 0.68  Phone ROTATES sideways — see the aluminum rails + buttons
  // 0.55 – 0.74  BACK COVER drops off (Z-) — internals exposed from behind
  // 0.62 – 0.84  Components FAN OUT — camera, board, battery, speaker lift
  // 0.76 – 0.89  Green laser scanner sweeps the chassis
  // 0.90 – 1.00  Everything SNAPS BACK — CTA fades in

  const scrollRotX = useTransform(sp, [0, 0.15, 0.55, 0.85, 1], [12, 16, 10, 6, 2]);
  const scrollRotY = useTransform(sp, [0, 0.14, 0.42, 0.68, 0.88, 1], [-10, -12, 82, 204, 344, 360]);
  const scrollRotZ = useTransform(sp, [0, 0.42, 0.68, 1], [-2, 0, 2, 0]);

  // Mouse hover tilt stacked on top of scroll rotation
  const hRX = useTransform(smoothMY, [-0.5, 0.5], [9, -9]);
  const hRY = useTransform(smoothMX, [-0.5, 0.5], [-9, 9]);
  const finalRX = useTransform(
    [scrollRotX as MotionValue<number>, hRX as MotionValue<number>],
    ([s, h]: number[]) => s + h
  );
  const finalRY = useTransform(
    [scrollRotY as MotionValue<number>, hRY as MotionValue<number>],
    ([s, h]: number[]) => s + h
  );

  // Screen z-lift: starts at TK/2 (front surface), lifts to 215, snaps back
  const screenTZ = useTransform(sp, [0, 0.14, 0.42, 0.88, 0.95], [TK/2, TK/2, 215, 215, TK/2]);

  // Back cover z-drop: starts at -TK/2 (back surface), drops to -175, snaps back
  const backTZ  = useTransform(sp, [0, 0.55, 0.74, 0.88, 0.95], [-TK/2, -TK/2, -175, -175, -TK/2]);

  // Shadow cast on chassis from lifting screen
  const shadowBlur  = useTransform(screenTZ, [TK/2, 215], [2, 30]);
  const shadowOp    = useTransform(screenTZ, [TK/2, TK/2+20, 215], [0, 0.3, 0.55]);
  const shadowScale = useTransform(screenTZ, [TK/2, 215], [0.99, 0.82]);

  // Camera module floats up-right
  const camTZ = useTransform(sp, [0.62, 0.78, 0.88, 0.95], [0, 135, 135, 0]);
  const camX  = useTransform(sp, [0.62, 0.78, 0.88, 0.95], [0, 32, 32, 0]);
  const camY  = useTransform(sp, [0.62, 0.78, 0.88, 0.95], [0, -52, -52, 0]);
  const camOp = useTransform(sp, [0.60, 0.66, 0.88, 0.95], [0, 1, 1, 0]);

  // Logic board floats left
  const boardTZ = useTransform(sp, [0.64, 0.80, 0.88, 0.95], [0, 92, 92, 0]);
  const boardX  = useTransform(sp, [0.64, 0.80, 0.88, 0.95], [0, -42, -42, 0]);
  const boardOp = useTransform(sp, [0.62, 0.68, 0.88, 0.95], [0, 1, 1, 0]);

  // Battery floats right
  const battTZ = useTransform(sp, [0.66, 0.82, 0.88, 0.95], [0, 68, 68, 0]);
  const battX  = useTransform(sp, [0.66, 0.82, 0.88, 0.95], [0, 50, 50, 0]);
  const battOp = useTransform(sp, [0.64, 0.70, 0.88, 0.95], [0, 1, 1, 0]);

  // Speaker floats down
  const spkTZ = useTransform(sp, [0.68, 0.84, 0.88, 0.95], [0, 46, 46, 0]);
  const spkY  = useTransform(sp, [0.68, 0.84, 0.88, 0.95], [0, 55, 55, 0]);
  const spkOp = useTransform(sp, [0.66, 0.72, 0.88, 0.95], [0, 1, 1, 0]);

  // Laser scanner
  const laserY  = useTransform(sp, [0.76, 0.88], [-238, 238]);
  const laserOp = useTransform(sp, [0.74, 0.78, 0.86, 0.90], [0, 1, 1, 0]);

  // Glass sheen
  const sheenX = useTransform(sp, [0, 0.5, 1], [-280, 280, -280]);

  // CTA
  const ctaOp = useTransform(sp, [0.90, 0.97], [0, 1]);
  const ctaY  = useTransform(sp, [0.90, 0.97], [28, 0]);

  // Scroll hint (fades out when scrolling starts)
  const hintOp = useTransform(sp, [0, 0.05], [1, 0]);

  // HUD cards (single reveal for all left, single for all right)
  const lCardsOp = useTransform(sp, [0.04, 0.14, 0.88, 0.95], [0, 1, 1, 0]);
  const lCardsX  = useTransform(sp, [0.04, 0.14], [-28, 0]);
  const rCardsOp = useTransform(sp, [0.07, 0.18, 0.88, 0.95], [0, 1, 1, 0]);
  const rCardsX  = useTransform(sp, [0.07, 0.18], [28, 0]);

  const rightAnnotations = [
    "12-point display glass & pixel test",
    "Li-ion cell, cycles & swelling check",
    "Aperture, OIS & stabilization test",
    "Chip, logic traces & connectors",
    "Driver, membrane & acoustic seal",
  ];

  return (
    <div ref={containerRef} style={{ height: "560vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100vh", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Ambient radial glow */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 800, height: 800, borderRadius: "50%",
          background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 14%, transparent), transparent 65%)",
          filter: "blur(90px)", pointerEvents: "none", zIndex: 0,
        }}/>

        {/* ── LEFT HUD ── */}
        <motion.div
          className="hide-on-mobile"
          style={{
            position: "absolute",
            left: "clamp(1rem, 4vw, 5rem)",
            top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: "1.8rem",
            maxWidth: 290, zIndex: 10,
            opacity: lCardsOp, x: lCardsX,
          }}
        >
          {PARTS.map((part, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.3rem" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, white))",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 800, flexShrink: 0,
                  boxShadow: "0 2px 12px color-mix(in srgb, var(--primary) 40%, transparent)",
                }}>{i + 1}</div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>
                  {part.label}
                </div>
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text2)", lineHeight: 1.55, paddingLeft: "2.5rem" }}>
                {part.desc}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── RIGHT HUD ── */}
        <motion.div
          className="hide-on-mobile"
          style={{
            position: "absolute",
            right: "clamp(1rem, 4vw, 5rem)",
            top: "50%", transform: "translateY(-50%)",
            display: "flex", flexDirection: "column", gap: "1rem",
            maxWidth: 265, zIndex: 10, alignItems: "flex-end",
            opacity: rCardsOp, x: rCardsX,
          }}
        >
          {rightAnnotations.map((text, i) => (
            <div key={i} style={{
              padding: "0.65rem 1rem", borderRadius: "var(--radius)",
              background: "color-mix(in srgb, var(--surface) 80%, transparent)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
              fontSize: "0.76rem", fontWeight: 600, color: "var(--text)",
              textAlign: "right", lineHeight: 1.42,
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}>
              {text}
            </div>
          ))}
        </motion.div>

        {/* ── 3D PHONE SCENE ── */}
        <motion.div style={{ perspective: 2400, perspectiveOrigin: "50% 50%", position: "relative", zIndex: 5 }}>
          <motion.div
            style={{
              rotateX: finalRX,
              rotateY: finalRY,
              rotateZ: scrollRotZ,
              transformStyle: "preserve-3d",
              position: "relative",
              width: PW, height: PH,
              willChange: "transform",
            }}
          >
            {/* ══ BACK COVER — back face (rotateY:180, backface hidden) ══ */}
            <motion.div style={{
              position: "absolute", top: 0, left: 0, width: PW, height: PH,
              z: backTZ,
              rotateY: 180,
              transformStyle: "preserve-3d",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              filter: "drop-shadow(0 14px 34px rgba(0,0,0,0.55))",
            }}>
              <BackCover sheenX={sheenX} />
            </motion.div>

            {/* ══ LEFT RAIL — volume buttons + mute ══ */}
            <div style={{
              position: "absolute", top: 0, left: -TK,
              width: TK, height: PH,
              transformOrigin: "100% 50%",
              transform: "rotateY(-90deg)",
            }}>
              <LeftRail />
            </div>

            {/* ══ RIGHT RAIL — power button + SIM tray ══ */}
            <div style={{
              position: "absolute", top: 0, left: PW,
              width: TK, height: PH,
              transformOrigin: "0% 50%",
              transform: "rotateY(90deg)",
            }}>
              <RightRail />
            </div>

            {/* ══ TOP RAIL — secondary mic ══ */}
            <div style={{
              position: "absolute", left: 0, top: -TK,
              width: PW, height: TK,
              transformOrigin: "50% 100%",
              transform: "rotateX(90deg)",
            }}>
              <TopRail />
            </div>

            {/* ══ BOTTOM RAIL — USB-C + speakers ══ */}
            <div style={{
              position: "absolute", left: 0, top: PH,
              width: PW, height: TK,
              transformOrigin: "50% 0%",
              transform: "rotateX(-90deg)",
            }}>
              <BottomRail />
            </div>

            {/* ══ INTERNAL FRAME — always visible through openings ══ */}
            <div style={{ position: "absolute", top: 0, left: 0, width: PW, height: PH }}>
              <InternalFrame />
            </div>

            {/* Shadow of lifting screen cast on chassis */}
            <motion.div style={{
              position: "absolute", top: 5, left: 5, width: PW - 10, height: PH - 10,
              z: TK / 2 - 1,
              borderRadius: 40, background: "#000",
              opacity: shadowOp,
              filter: useTransform(shadowBlur, v => `blur(${v}px)`),
              scale: shadowScale,
              pointerEvents: "none",
            }}/>

            {/* ── Camera module floats out ── */}
            <motion.div style={{
              position: "absolute", top: 18, left: 114,
              z: camTZ, x: camX, y: camY, opacity: camOp,
              filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.6))",
              transformStyle: "preserve-3d",
            }}>
              <CameraPanel />
            </motion.div>

            {/* ── Logic board floats out ── */}
            <motion.div style={{
              position: "absolute", top: 48, left: 14,
              z: boardTZ, x: boardX, opacity: boardOp,
              filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.6))",
              transformStyle: "preserve-3d",
            }}>
              <BoardPanel />
            </motion.div>

            {/* ── Battery floats out ── */}
            <motion.div style={{
              position: "absolute", top: 108, right: 12,
              z: battTZ, x: battX, opacity: battOp,
              filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.6))",
              transformStyle: "preserve-3d",
            }}>
              <BatteryPanel />
            </motion.div>

            {/* ── Speaker floats out ── */}
            <motion.div style={{
              position: "absolute", bottom: 52, left: 14,
              z: spkTZ, y: spkY, opacity: spkOp,
              filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.6))",
              transformStyle: "preserve-3d",
            }}>
              <SpeakerPanel />
            </motion.div>

            {/* ── Green laser diagnostic sweep ── */}
            <motion.div style={{
              position: "absolute", left: 3, width: PW - 6, height: 4,
              z: 105,
              background: "linear-gradient(90deg, rgba(34,197,94,0), rgba(34,197,94,0.95) 18%, rgba(34,197,94,0.95) 82%, rgba(34,197,94,0))",
              boxShadow: "0 0 22px #22c55e, 0 0 8px #22c55e",
              y: laserY, opacity: laserOp,
              borderRadius: "50%", pointerEvents: "none",
            }}/>

            {/* ══ FRONT SCREEN — front face (backface hidden) ══ */}
            <motion.div style={{
              position: "absolute", top: 0, left: 0, width: PW, height: PH,
              z: screenTZ,
              transformStyle: "preserve-3d",
              WebkitBackfaceVisibility: "hidden",
              backfaceVisibility: "hidden",
              filter: "drop-shadow(0 26px 48px rgba(0,0,0,0.65))",
              zIndex: 9,
            }}>
              <ScreenFront sheenX={sheenX} />
            </motion.div>

          </motion.div>
        </motion.div>

        {/* ── SCROLL HINT (fades when scrolling starts) ── */}
        <motion.div style={{
          position: "absolute", bottom: "clamp(1.5rem, 4vh, 3rem)", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
          opacity: hintOp, zIndex: 12, pointerEvents: "none",
        }}>
          <span style={{ fontSize: "0.74rem", color: "var(--text2)", fontWeight: 500, letterSpacing: "0.04em" }}>
            Scroll to watch the teardown
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            style={{ color: "var(--text2)", opacity: 0.55 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </motion.div>
        </motion.div>

        {/* ── CTA (fades in at end) ── */}
        <motion.div style={{
          position: "absolute",
          bottom: "clamp(1.5rem, 4vh, 3.5rem)",
          left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "0.65rem",
          opacity: ctaOp, y: ctaY, zIndex: 12,
        }}>
          <a
            href={isMobile ? "#book" : "/book"}
            style={{
              padding: "0.88rem 2.2rem", borderRadius: "var(--radius)",
              background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, white))",
              color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "0.92rem",
              boxShadow: "0 4px 26px color-mix(in srgb, var(--primary) 40%, transparent), var(--glow)",
              display: "inline-flex", alignItems: "center", gap: "0.55rem",
              letterSpacing: "-0.01em",
            }}
          >
            Book an Inspection — ₹350
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <span style={{ fontSize: "0.74rem", color: "var(--text2)", fontWeight: 500 }}>
            Doorstep inspection · 30+ checkpoints · Verified report
          </span>
        </motion.div>

      </div>
    </div>
  );
}