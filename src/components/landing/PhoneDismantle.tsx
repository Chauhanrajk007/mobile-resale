"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
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

// ─────────────────────────────────────────────────────────────
// SVG LAYER COMPONENTS (each perfectly sized to fit the phone)
// ─────────────────────────────────────────────────────────────

/** Layer 1 – OLED display panel (front face, topmost layer) */
function ScreenFront({ sheenX }: { sheenX: any }) {
  return (
    <svg viewBox="0 0 240 490" xmlns="http://www.w3.org/2000/svg" style={{ width: PW, height: PH, display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="sf-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0a1b" />
          <stop offset="100%" stopColor="#090412" />
        </linearGradient>
        <linearGradient id="sf-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="sf-btn" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <clipPath id="sf-clip">
          <rect width="240" height="490" rx="44" />
        </clipPath>
      </defs>

      {/* Phone bezel border ring */}
      <rect width="240" height="490" rx="44" fill="#0a0a0c" />

      {/* OLED screen surface */}
      <rect x="6" y="6" width="228" height="478" rx="38" fill="url(#sf-bg)" clipPath="url(#sf-clip)" />

      {/* Subtle pixel grid */}
      <g opacity="0.1" clipPath="url(#sf-clip)">
        <path d="M6,80H234M6,130H234M6,180H234M6,230H234M6,280H234M6,330H234M6,380H234M6,430H234" stroke="#8b5cf6" strokeWidth="0.5" />
        <path d="M50,6V484M100,6V484M150,6V484M200,6V484" stroke="#8b5cf6" strokeWidth="0.5" />
      </g>

      {/* Dynamic Island notch */}
      <rect x="78" y="15" width="84" height="26" rx="13" fill="#000" />
      {/* Front camera */}
      <circle cx="95" cy="28" r="4.5" fill="#0a0a0f" />
      <circle cx="95" cy="28" r="2.2" fill="#1e3a8a" opacity="0.7" />
      <circle cx="94" cy="27" r="0.8" fill="rgba(255,255,255,0.5)" />

      {/* Status bar */}
      <text x="32" y="33" fill="#fff" fontSize="9" fontWeight="700" fontFamily="system-ui">9:41</text>
      {/* Battery icon */}
      <rect x="196" y="22" width="18" height="9" rx="2" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
      <rect x="198" y="24" width="12" height="5" rx="0.5" fill="#22c55e" />

      {/* Diagnostic dashboard content */}
      <text x="120" y="76" fill="#a855f7" fontSize="8.5" fontWeight="800" letterSpacing="3" textAnchor="middle" fontFamily="system-ui">SYSTEM REPORT</text>
      <text x="120" y="100" fill="#fff" fontSize="18" fontWeight="800" textAnchor="middle" fontFamily="system-ui">Device Health</text>

      <rect x="24" y="118" width="192" height="200" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Circular health gauge */}
      <circle cx="120" cy="180" r="32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
      <circle cx="120" cy="180" r="32" fill="none" stroke="#22c55e" strokeWidth="5"
        strokeDasharray="201" strokeDashoffset="18" strokeLinecap="round"
        transform="rotate(-90 120 180)" />
      <text x="120" y="185" fill="#fff" fontSize="14" fontWeight="800" textAnchor="middle" fontFamily="system-ui">96%</text>
      <text x="120" y="226" fill="#22c55e" fontSize="7.5" fontWeight="700" textAnchor="middle" fontFamily="system-ui" letterSpacing="1">EXCELLENT</text>

      {/* Check rows */}
      <g fontFamily="system-ui" fontSize="9.5" fill="rgba(255,255,255,0.5)" transform="translate(36,248)">
        <text x="0" y="0">Display &amp; Touch</text><text x="144" y="0" fill="#22c55e" fontWeight="700" textAnchor="end">✓</text>
        <line x1="0" y1="4" x2="148" y2="4" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <text x="0" y="18">Battery Health</text><text x="144" y="18" fill="#22c55e" fontWeight="700" textAnchor="end">✓</text>
        <line x1="0" y1="22" x2="148" y2="22" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <text x="0" y="36">Camera Aperture</text><text x="144" y="36" fill="#22c55e" fontWeight="700" textAnchor="end">✓</text>
      </g>

      {/* CTA button */}
      <rect x="24" y="340" width="192" height="38" rx="12" fill="url(#sf-btn)" />
      <text x="120" y="363" fill="#fff" fontSize="10.5" fontWeight="800" textAnchor="middle" letterSpacing="1.5" fontFamily="system-ui">VERIFIED REPORT</text>

      {/* Bottom home bar */}
      <rect x="90" y="472" width="60" height="4" rx="2" fill="rgba(255,255,255,0.2)" />

      {/* Dynamic light sheen */}
      <motion.rect x="-100" y="6" width="200" height="478"
        fill="url(#sf-sheen)"
        style={{ x: sheenX, skewX: -20, mixBlendMode: "overlay" } as any}
        pointerEvents="none" />
    </svg>
  );
}

/** Layer 2 – Internal view: full phone-shaped frame with realistic components seated inside */
function InternalFrame() {
  return (
    <svg viewBox="0 0 240 490" xmlns="http://www.w3.org/2000/svg" style={{ width: PW, height: PH, display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="if-chassis" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#27272a" />
          <stop offset="100%" stopColor="#18181b" />
        </linearGradient>
        <radialGradient id="if-coil" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="60%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#1c1917" />
        </radialGradient>
        <radialGradient id="if-lens" cx="0.38" cy="0.38" r="0.6">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="45%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#060410" />
        </radialGradient>
        <linearGradient id="if-pcb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#022c22" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="if-batt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#131016" />
        </linearGradient>
        <clipPath id="if-clip">
          <rect width="240" height="490" rx="44" />
        </clipPath>
      </defs>

      {/* ── CHASSIS BASE (full phone shape, aluminum mid-frame) ── */}
      <rect width="240" height="490" rx="44" fill="url(#if-chassis)" />

      {/* Inner groove showing depth of frame */}
      <rect x="8" y="8" width="224" height="474" rx="38" fill="#1c1c1f" />
      <rect x="12" y="12" width="216" height="466" rx="35" fill="#141417" />

      {/* ── COMPONENTS SEATED IN CHASSIS (NO camera island here — that's back cover) ── */}

      {/* LOGIC BOARD (top-left quadrant, green PCB) */}
      <rect x="16" y="52" width="90" height="160" rx="8" fill="url(#if-pcb)" stroke="rgba(34,197,94,0.25)" strokeWidth="1" />
      {/* PCB copper traces */}
      <g stroke="#ca8a04" strokeWidth="0.5" fill="none" opacity="0.55">
        <path d="M26,68 H80 M26,80 H60 M26,92 H70 M26,104 H55" />
        <path d="M80,68 V120 H60 V140" />
        <path d="M26,140 H50 V160 H90" />
        <path d="M50,180 V200 H80" />
      </g>
      {/* Central CPU die */}
      <rect x="30" y="100" width="60" height="58" rx="7" fill="#0f1910" stroke="rgba(34,197,94,0.5)" strokeWidth="0.8" />
      <text x="60" y="127" fill="#22c55e" fontSize="7" fontWeight="900" textAnchor="middle" fontFamily="system-ui" letterSpacing="0.5">A17 PRO</text>
      <text x="60" y="137" fill="rgba(255,255,255,0.25)" fontSize="5" textAnchor="middle" fontFamily="system-ui">TSMC 3nm</text>
      {/* Modem & RAM chips */}
      <rect x="30" y="68" width="22" height="14" rx="2" fill="#1a2a1a" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
      <text x="41" y="77" fill="rgba(34,197,94,0.6)" fontSize="4.5" textAnchor="middle" fontFamily="system-ui">5G MODEM</text>
      <rect x="60" y="68" width="22" height="14" rx="2" fill="#1a2a1a" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
      <text x="71" y="77" fill="rgba(34,197,94,0.6)" fontSize="4.5" textAnchor="middle" fontFamily="system-ui">8GB RAM</text>
      {/* Flex ribbon connectors from board */}
      <path d="M106,80 Q115,80 115,100" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M106,120 Q120,120 120,140" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

      {/* FRONT CAMERA MODULE (housed inside chassis, top area) */}
      <rect x="112" y="22" width="48" height="28" rx="6" fill="#0a0a0e" stroke="rgba(56,189,248,0.25)" strokeWidth="0.8" />
      <circle cx="126" cy="36" r="8" fill="#060408" stroke="rgba(56,189,248,0.3)" strokeWidth="0.8" />
      <circle cx="126" cy="36" r="5.5" fill="url(#if-lens)" />
      <circle cx="126" cy="36" r="1.8" fill="#000" />
      <circle cx="124" cy="34" r="0.8" fill="rgba(255,255,255,0.45)" />
      <text x="148" y="40" fill="rgba(56,189,248,0.5)" fontSize="5" textAnchor="middle" fontFamily="system-ui">FACE ID</text>

      {/* BATTERY (right large rectangle) */}
      <rect x="116" y="110" width="108" height="228" rx="8" fill="url(#if-batt)" stroke="rgba(168,85,247,0.3)" strokeWidth="1" />
      {/* Battery cell grid */}
      <rect x="122" y="116" width="96" height="216" rx="5" fill="none" stroke="rgba(168,85,247,0.06)" strokeWidth="1" strokeDasharray="3 3" />
      {/* Battery label */}
      <text x="170" y="168" fill="rgba(168,85,247,0.6)" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="system-ui" letterSpacing="0.5">CMP POWER</text>
      <text x="170" y="180" fill="rgba(255,255,255,0.25)" fontSize="5.5" textAnchor="middle" fontFamily="system-ui">3274 mAh · 3.85V</text>
      <text x="170" y="194" fill="#f43f5e" fontSize="5" fontWeight="700" textAnchor="middle" fontFamily="system-ui">⚠ DO NOT CRUSH</text>
      {/* Battery health bar */}
      <rect x="130" y="210" width="80" height="40" rx="6" fill="rgba(34,197,94,0.04)" stroke="#22c55e" strokeWidth="0.6" />
      <text x="170" y="227" fill="#22c55e" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="system-ui">HEALTH</text>
      <text x="170" y="241" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="system-ui">89%</text>
      {/* Ribbon connector top of battery */}
      <rect x="150" y="106" width="20" height="6" rx="1.5" fill="#d97706" opacity="0.7" />

      {/* WIRELESS CHARGING COIL (bottom of battery area, visible as concentric rings) */}
      <circle cx="170" cy="310" r="32" fill="url(#if-coil)" opacity="0.55" />
      <circle cx="170" cy="310" r="27" fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.5" />
      <circle cx="170" cy="310" r="22" fill="none" stroke="#ea580c" strokeWidth="0.9" opacity="0.45" />
      <circle cx="170" cy="310" r="16" fill="none" stroke="#d97706" strokeWidth="0.6" opacity="0.35" />

      {/* SPEAKER (bottom of chassis) */}
      <rect x="16" y="394" width="88" height="44" rx="6" fill="#0f0f12" stroke="rgba(156,163,175,0.2)" strokeWidth="0.8" />
      {/* Speaker grille holes */}
      <g fill="rgba(255,255,255,0.06)">
        {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
          <rect key={i} x={20 + (i % 7) * 11} y={406 + Math.floor(i / 7) * 10} width="6" height="6" rx="1.5" />
        ))}
        {[0,1,2,3,4,5].map(i => (
          <rect key={i} x={20 + i * 11} y={416} width="6" height="6" rx="1.5" />
        ))}
      </g>
      <circle cx="80" cy="416" r="9" fill="#0a0a0c" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <circle cx="80" cy="416" r="5.5" fill="#f59e0b" opacity="0.18" />

      {/* USB-C port block */}
      <rect x="96" y="450" width="48" height="22" rx="5" fill="#0c0c0e" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <rect x="102" y="455" width="36" height="7" rx="3" fill="#1a1a1e" />

      {/* Screw posts (corner mounts visible in chassis) */}
      {[[20,20],[220,20],[20,470],[220,470]].map(([cx,cy],i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="4.5" fill="#222226" stroke="#444" strokeWidth="0.6" />
          <line x1={cx - 2.5} y1={cy} x2={cx + 2.5} y2={cy} stroke="#555" strokeWidth="0.8" />
          <line x1={cx} y1={cy - 2.5} x2={cx} y2={cy + 2.5} stroke="#555" strokeWidth="0.8" />
        </g>
      ))}
    </svg>
  );
}

/** Layer 3 – BACK COVER with titanium finish and camera island */
function BackCover({ sheenX }: { sheenX: any }) {
  return (
    <svg viewBox="0 0 240 490" xmlns="http://www.w3.org/2000/svg" style={{ width: PW, height: PH, display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id="bc-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#323238" />
          <stop offset="40%" stopColor="#1e1e22" />
          <stop offset="100%" stopColor="#101012" />
        </linearGradient>
        <radialGradient id="bc-lens" cx="0.38" cy="0.38" r="0.62">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="35%" stopColor="#1d4ed8" />
          <stop offset="80%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#04060c" />
        </radialGradient>
        <linearGradient id="bc-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.14)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <clipPath id="bc-clip">
          <rect width="240" height="490" rx="44" />
        </clipPath>
      </defs>

      {/* Matte titanium body */}
      <rect width="240" height="490" rx="44" fill="url(#bc-body)" />

      {/* Subtle brushed metal texture lines */}
      <g opacity="0.04" clipPath="url(#bc-clip)">
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1={0} y1={i * 22} x2={240} y2={i * 22 + 4} stroke="#fff" strokeWidth="6" />
        ))}
      </g>

      {/* ── CAMERA ISLAND (raised plateau on back cover, NOT on chassis) ── */}
      {/* Island base — raised rounded square */}
      <rect x="12" y="12" width="100" height="100" rx="24" fill="#0f0f12" />
      <rect x="14" y="14" width="96" height="96" rx="22" fill="#141418" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />

      {/* Camera Lens 1 — Main Wide */}
      <g transform="translate(40,40)">
        <circle r="19" fill="#0c0c10" stroke="rgba(255,255,255,0.13)" strokeWidth="1.4" />
        <circle r="15" fill="#060408" />
        <circle r="12" fill="url(#bc-lens)" />
        <circle r="5" fill="#000" />
        <circle cx="-4" cy="-4" r="2" fill="rgba(255,255,255,0.35)" />
        <text y="32" fill="rgba(255,255,255,0.2)" fontSize="5" textAnchor="middle" fontFamily="system-ui">48MP</text>
      </g>

      {/* Camera Lens 2 — Ultrawide */}
      <g transform="translate(40,88)">
        <circle r="17" fill="#0c0c10" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2" />
        <circle r="13" fill="#060408" />
        <circle r="10" fill="url(#bc-lens)" />
        <circle r="4" fill="#000" />
        <circle cx="-3" cy="-3" r="1.5" fill="rgba(255,255,255,0.35)" />
        <text y="28" fill="rgba(255,255,255,0.2)" fontSize="5" textAnchor="middle" fontFamily="system-ui">12MP</text>
      </g>

      {/* Camera Lens 3 — Telephoto */}
      <g transform="translate(86,64)">
        <circle r="14.5" fill="#0c0c10" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle r="11" fill="#060408" />
        <circle r="8.5" fill="url(#bc-lens)" />
        <circle r="3.5" fill="#000" />
        <circle cx="-2.5" cy="-2.5" r="1.2" fill="rgba(255,255,255,0.35)" />
        <text y="24" fill="rgba(255,255,255,0.2)" fontSize="5" textAnchor="middle" fontFamily="system-ui">5x</text>
      </g>

      {/* LED Flash */}
      <circle cx="86" cy="30" r="7" fill="#2a2a30" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
      <circle cx="86" cy="30" r="5" fill="#f59e0b" opacity="0.75" />
      <circle cx="86" cy="30" r="3.5" fill="#fcd34d" opacity="0.5" />

      {/* LiDAR scanner */}
      <circle cx="86" cy="95" r="5" fill="#18181b" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
      <circle cx="86" cy="95" r="2.5" fill="#0a0a0e" />

      {/* Microphone dot */}
      <circle cx="62" cy="8" r="2.5" fill="#0a0a0e" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

      {/* CMP logo watermark */}
      <text x="120" y="448" fill="rgba(255,255,255,0.08)" fontSize="6.5" fontWeight="600" textAnchor="middle" letterSpacing="1.5" fontFamily="system-ui">CHECKMYPHONE</text>
      <text x="120" y="459" fill="rgba(255,255,255,0.05)" fontSize="5" textAnchor="middle" fontFamily="system-ui">Model CMP-T1 · Designed in India</text>

      {/* Dynamic light sheen on glass back */}
      <motion.rect x="-100" y="0" width="200" height="490" rx="44"
        fill="url(#bc-sheen)"
        style={{ x: sheenX, skewX: -20, mixBlendMode: "overlay" } as any}
        pointerEvents="none"
        clipPath="url(#bc-clip)"
      />
    </svg>
  );
}

/** Individual component layers that float out from the chassis */
function BatteryLayer() {
  return (
    <svg viewBox="0 0 100 210" xmlns="http://www.w3.org/2000/svg" style={{ width: 100, height: 210, display: "block" }}>
      <defs>
        <linearGradient id="bl-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0c0a14" />
        </linearGradient>
      </defs>
      <rect width="100" height="210" rx="7" fill="url(#bl-body)" stroke="rgba(168,85,247,0.4)" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="200" rx="5" fill="none" stroke="rgba(168,85,247,0.06)" strokeWidth="1" strokeDasharray="3 2" />
      {/* Ribbon connector */}
      <rect x="38" y="-5" width="24" height="8" rx="2" fill="#d97706" />
      {/* Labels */}
      <text x="50" y="58" fill="#a855f7" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="system-ui" letterSpacing="0.8">CMP POWER</text>
      <text x="50" y="70" fill="rgba(255,255,255,0.25)" fontSize="5.5" textAnchor="middle" fontFamily="system-ui">3274 mAh · 3.85V</text>
      <text x="50" y="86" fill="#f43f5e" fontSize="5" fontWeight="700" textAnchor="middle" fontFamily="system-ui">⚠ DO NOT PUNCTURE</text>
      {/* Health readout */}
      <rect x="10" y="100" width="80" height="40" rx="6" fill="rgba(34,197,94,0.05)" stroke="#22c55e" strokeWidth="0.7" />
      <text x="50" y="117" fill="#22c55e" fontSize="7" fontWeight="800" textAnchor="middle" fontFamily="system-ui">BATTERY HEALTH</text>
      <text x="50" y="131" fill="#fff" fontSize="13" fontWeight="800" textAnchor="middle" fontFamily="system-ui">89%</text>
    </svg>
  );
}

function CameraLayer() {
  return (
    <svg viewBox="0 0 94 94" xmlns="http://www.w3.org/2000/svg" style={{ width: 94, height: 94, display: "block" }}>
      <defs>
        <radialGradient id="cl-lens" cx="0.38" cy="0.38" r="0.62">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="40%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#060410" />
        </radialGradient>
      </defs>
      <rect width="94" height="94" rx="20" fill="#0e0e12" stroke="rgba(56,189,248,0.35)" strokeWidth="1" />
      <g transform="translate(24,24)"><circle r="14" fill="#060408" stroke="rgba(255,255,255,0.15)" strokeWidth="1" /><circle r="10" fill="url(#cl-lens)" /><circle r="3.5" fill="#000" /><circle cx="-3" cy="-3" r="1.2" fill="rgba(255,255,255,0.4)" /></g>
      <g transform="translate(24,68)"><circle r="14" fill="#060408" stroke="rgba(255,255,255,0.12)" strokeWidth="1" /><circle r="10" fill="url(#cl-lens)" /><circle r="3.5" fill="#000" /><circle cx="-3" cy="-3" r="1.2" fill="rgba(255,255,255,0.4)" /></g>
      <g transform="translate(68,46)"><circle r="12" fill="#060408" stroke="rgba(255,255,255,0.1)" strokeWidth="1" /><circle r="8.5" fill="url(#cl-lens)" /><circle r="3" fill="#000" /><circle cx="-2" cy="-2" r="1" fill="rgba(255,255,255,0.4)" /></g>
    </svg>
  );
}

function BoardLayer() {
  return (
    <svg viewBox="0 0 82 154" xmlns="http://www.w3.org/2000/svg" style={{ width: 82, height: 154, display: "block" }}>
      <defs>
        <linearGradient id="board-pcb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#022c22" /><stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
      </defs>
      <rect width="82" height="154" rx="6" fill="url(#board-pcb)" stroke="rgba(34,197,94,0.3)" strokeWidth="1" />
      <g stroke="#ca8a04" strokeWidth="0.5" fill="none" opacity="0.6">
        <path d="M12,12 L12,40 L24,40 M70,12 V42 L58,50" /><path d="M22,96 L22,120 H42 L50,132" />
      </g>
      <rect x="12" y="52" width="58" height="58" rx="8" fill="#0f1910" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
      <text x="41" y="82" fill="#22c55e" fontSize="8" fontWeight="900" textAnchor="middle" fontFamily="system-ui">A17 PRO</text>
      <text x="41" y="93" fill="rgba(255,255,255,0.25)" fontSize="5" textAnchor="middle" fontFamily="system-ui">6-CORE · 3nm</text>
    </svg>
  );
}

function SpeakerLayer() {
  return (
    <svg viewBox="0 0 88 46" xmlns="http://www.w3.org/2000/svg" style={{ width: 88, height: 46, display: "block" }}>
      <rect width="88" height="46" rx="6" fill="#0f0f12" stroke="rgba(156,163,175,0.3)" strokeWidth="1" />
      <g fill="rgba(255,255,255,0.06)">
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => (
          <rect key={i} x={8 + (i % 7) * 10} y={10 + Math.floor(i / 7) * 10} width="6" height="6" rx="1.5" />
        ))}
      </g>
      <circle cx="72" cy="23" r="10" fill="#0a0a0c" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <circle cx="72" cy="23" r="6" fill="#f59e0b" opacity="0.15" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
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
    return () => { window.removeEventListener("resize", onResize); window.removeEventListener("mousemove", onMouse); };
  }, [mouseX, mouseY]);

  const smoothMX = useSpring(mouseX, { stiffness: 55, damping: 18 });
  const smoothMY = useSpring(mouseY, { stiffness: 55, damping: 18 });

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const sp = useSpring(scrollYProgress, { stiffness: 40, damping: 22, mass: 0.6 });

  // ── SCROLL STORY BREAKDOWN ──
  // 0.00–0.15  : Phone sits idle, gentle tilt
  // 0.15–0.35  : Screen panel lifts off the front (Z+), back cover starts glowing at seam
  // 0.35–0.55  : Phone rotates to show the side profile. Back cover pops off (Z-)
  // 0.55–0.75  : Internal components float out one by one (camera, board, battery, speaker)
  // 0.75–0.90  : Laser scanner sweeps. HUD annotations active.
  // 0.90–1.00  : Everything magnetically snaps back. CTA appears.

  // Container 3-D rotation (scroll-driven)
  const scrollRotX = useTransform(sp, [0, 0.15, 0.35, 0.65, 0.85, 1], [14, 18, 22, 14, 8, 0]);
  const scrollRotY = useTransform(sp, [0, 0.15, 0.35, 0.65, 0.85, 1], [-12, -12, 90, 180, 270, 360]);
  const scrollRotZ = useTransform(sp, [0, 0.35, 0.65, 1], [-3, 0, 4, 0]);

  // Mouse hover adds layered tilt on top of scroll
  const hRX = useTransform(smoothMY, [-0.5, 0.5], [9, -9]);
  const hRY = useTransform(smoothMX, [-0.5, 0.5], [-10, 10]);
  const finalRX = useTransform([scrollRotX, hRX] as any, ([s, h]: number[]) => s + h);
  const finalRY = useTransform([scrollRotY, hRY] as any, ([s, h]: number[]) => s + h);

  // Screen lifts off (Z forward)
  const screenZ = useTransform(sp, [0.15, 0.40, 0.88, 0.95], [0, 240, 240, 0]);
  const screenOp = useTransform(sp, [0.0, 0.15, 0.88, 0.95], [1, 1, 1, 1]);

  // Back cover pops off (Z backward) — DELAYED until phone is rotating sideways
  const backZ = useTransform(sp, [0.35, 0.55, 0.88, 0.95], [0, -180, -180, 0]);
  const backOp = useTransform(sp, [0.0, 0.35, 0.88, 0.95], [1, 1, 1, 1]);
  // Back cover subtly lifts slightly even earlier to hint
  const backScale = useTransform(sp, [0.28, 0.38], [1, 0.96]);

  // Internal components fan out (each has a distinct Z depth so they look layered)
  const camZ = useTransform(sp, [0.50, 0.70, 0.88, 0.95], [0, 160, 160, 0]);
  const camX = useTransform(sp, [0.50, 0.70, 0.88, 0.95], [0, 30, 30, 0]);
  const camY = useTransform(sp, [0.50, 0.70, 0.88, 0.95], [0, -60, -60, 0]);
  const camOp = useTransform(sp, [0.48, 0.55, 0.88, 0.95], [0, 1, 1, 0]);

  const boardZ = useTransform(sp, [0.52, 0.72, 0.88, 0.95], [0, 110, 110, 0]);
  const boardX = useTransform(sp, [0.52, 0.72, 0.88, 0.95], [0, -40, -40, 0]);
  const boardOp = useTransform(sp, [0.50, 0.57, 0.88, 0.95], [0, 1, 1, 0]);

  const battZ = useTransform(sp, [0.54, 0.74, 0.88, 0.95], [0, 80, 80, 0]);
  const battX = useTransform(sp, [0.54, 0.74, 0.88, 0.95], [0, 50, 50, 0]);
  const battOp = useTransform(sp, [0.52, 0.59, 0.88, 0.95], [0, 1, 1, 0]);

  const spkZ = useTransform(sp, [0.56, 0.76, 0.88, 0.95], [0, 50, 50, 0]);
  const spkY = useTransform(sp, [0.56, 0.76, 0.88, 0.95], [0, 60, 60, 0]);
  const spkOp = useTransform(sp, [0.54, 0.61, 0.88, 0.95], [0, 1, 1, 0]);

  // Laser scanner
  const laserY = useTransform(sp, [0.72, 0.88], [-230, 230]);
  const laserOp = useTransform(sp, [0.70, 0.75, 0.86, 0.90], [0, 1, 1, 0]);

  // Dynamic drop shadow beneath screen as it lifts
  const shadowBlur = useTransform(screenZ, [0, 240], [4, 28]);
  const shadowOp = useTransform(screenZ, [0, 240], [0, 0.55]);
  const shadowScale = useTransform(screenZ, [0, 240], [1, 0.86]);

  // Glass sheen on scroll
  const sheenX = useTransform(sp, [0, 0.5, 1], [-280, 280, -280]);

  // CTA fade-up
  const ctaOp = useTransform(sp, [0.90, 0.98], [0, 1]);
  const ctaY = useTransform(sp, [0.90, 0.98], [32, 0]);

  // Side HUD cards
  const lOps = Array.from({ length: 5 }, (_, i) => {
    const s = i * 0.14;
    return useTransform(sp, [s, s + 0.08, s + 0.16, s + 0.24], [0, 1, 1, 0]);
  });
  const lXs = Array.from({ length: 5 }, (_, i) => {
    const s = i * 0.14;
    return useTransform(sp, [s, s + 0.08], [-28, 0]);
  });
  const rOps = Array.from({ length: 5 }, (_, i) => {
    const s = i * 0.14 + 0.06;
    return useTransform(sp, [s, s + 0.08, s + 0.16, s + 0.24], [0, 1, 1, 0]);
  });
  const rXs = Array.from({ length: 5 }, (_, i) => {
    const s = i * 0.14 + 0.06;
    return useTransform(sp, [s, s + 0.08], [28, 0]);
  });

  return (
    <div ref={containerRef} style={{ height: "540vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", position: "relative" }}>

          {/* Ambient radial glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 16%, transparent), transparent 68%)", filter: "blur(100px)", pointerEvents: "none" }} />

          {/* ── LEFT HUD ── */}
          <div className="hide-on-mobile" style={{ position: "absolute", left: "clamp(1rem, 4vw, 5rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 300, zIndex: 10 }}>
            {PARTS.map((part, i) => (
              <motion.div key={i} style={{ opacity: lOps[i], x: lXs[i] }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, white))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0, boxShadow: "0 2px 12px color-mix(in srgb, var(--primary) 40%, transparent)" }}>{i + 1}</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{part.label}</div>
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.55, paddingLeft: "2.75rem" }}>{part.desc}</div>
              </motion.div>
            ))}
          </div>

          {/* ── RIGHT HUD ── */}
          <div className="hide-on-mobile" style={{ position: "absolute", right: "clamp(1rem, 4vw, 5rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 280, zIndex: 10, alignItems: "flex-end" }}>
            {[
              "12 points — display glass & pixels",
              "Li-ion cell, cycles & swelling check",
              "Aperture, OIS & stabilization test",
              "A17 chip, logic traces & connectors",
              "Acoustic driver & grille inspection",
            ].map((text, i) => (
              <motion.div key={i} style={{ opacity: rOps[i], x: rXs[i], padding: "0.75rem 1.1rem", borderRadius: "var(--radius)", background: "color-mix(in srgb, var(--surface) 80%, transparent)", border: "1px solid var(--border)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", fontSize: "0.78rem", fontWeight: 600, color: "var(--text)", textAlign: "right", lineHeight: 1.45, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
                {text}
              </motion.div>
            ))}
          </div>

          {/* ── 3D PHONE CONTAINER ── */}
          <motion.div style={{ perspective: 2200, perspectiveOrigin: "50% 50%", position: "relative", zIndex: 5 }}>
            <motion.div style={{ rotateX: finalRX, rotateY: finalRY, rotateZ: scrollRotZ, transformStyle: "preserve-3d", position: "relative", width: PW, height: PH, willChange: "transform" }}>

              {/* Ground shadow beneath lifting screen */}
              <motion.div style={{
                position: "absolute", width: PW - 16, height: PH - 16, top: 8, left: 8, z: 1,
                background: "var(--ground-shadow)", borderRadius: 40,
                opacity: shadowOp,
                filter: useTransform(shadowBlur, v => `blur(${v}px)`),
                scale: shadowScale,
                pointerEvents: "none",
              }} />

              {/* LAYER 1: BACK COVER — pops off backward */}
              <motion.div style={{ position: "absolute", width: PW, height: PH, z: backZ, opacity: backOp, scale: backScale, transformStyle: "preserve-3d", zIndex: 1 }}>
                <BackCover sheenX={sheenX} />
              </motion.div>

              {/* LAYER 2: INTERNAL FRAME — the guts, stays centred */}
              <div style={{ position: "absolute", width: PW, height: PH, zIndex: 4 }}>
                <InternalFrame />
              </div>

              {/* LAYER 3: FRONT SCREEN — lifts off the front */}
              <motion.div style={{ position: "absolute", width: PW, height: PH, z: screenZ, opacity: screenOp, transformStyle: "preserve-3d", zIndex: 9, filter: "drop-shadow(0 18px 38px rgba(0,0,0,0.4)) drop-shadow(0 0 60px color-mix(in srgb, var(--primary) 10%, transparent))" }}>
                <ScreenFront sheenX={sheenX} />
              </motion.div>

              {/* ── FLOATING COMPONENT LAYERS (fan out from chassis) ── */}

              {/* Camera Module */}
              <motion.div style={{ position: "absolute", top: 22, left: 112, z: camZ, x: camX, y: camY, opacity: camOp, zIndex: 7, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4)) drop-shadow(0 0 40px color-mix(in srgb, var(--primary) 8%, transparent))", transformStyle: "preserve-3d" }}>
                <CameraLayer />
              </motion.div>

              {/* Logic Board */}
              <motion.div style={{ position: "absolute", top: 52, left: 16, z: boardZ, x: boardX, opacity: boardOp, zIndex: 7, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4)) drop-shadow(0 0 40px color-mix(in srgb, var(--primary) 8%, transparent))", transformStyle: "preserve-3d" }}>
                <BoardLayer />
              </motion.div>

              {/* Battery */}
              <motion.div style={{ position: "absolute", top: 110, right: 14, z: battZ, x: battX, opacity: battOp, zIndex: 6, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4)) drop-shadow(0 0 40px color-mix(in srgb, var(--primary) 8%, transparent))", transformStyle: "preserve-3d" }}>
                <BatteryLayer />
              </motion.div>

              {/* Speaker */}
              <motion.div style={{ position: "absolute", bottom: 50, left: 16, z: spkZ, y: spkY, opacity: spkOp, zIndex: 6, filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.4)) drop-shadow(0 0 40px color-mix(in srgb, var(--primary) 8%, transparent))", transformStyle: "preserve-3d" }}>
                <SpeakerLayer />
              </motion.div>

              {/* ── LASER DIAGNOSTIC SWEEP ── */}
              <motion.div style={{
                position: "absolute", left: 6, width: PW - 12, height: 5,
                background: "linear-gradient(90deg, rgba(34,197,94,0), rgba(34,197,94,0.92) 25%, rgba(34,197,94,0.92) 75%, rgba(34,197,94,0))",
                boxShadow: "0 0 18px #22c55e, 0 0 5px #22c55e",
                zIndex: 8, opacity: laserOp, y: laserY, z: 120,
                pointerEvents: "none", borderRadius: "50%",
              }} />
            </motion.div>
          </motion.div>

          {/* ── BOTTOM CTA ── */}
          <motion.div style={{ position: "absolute", bottom: "clamp(2rem, 5vh, 4rem)", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", opacity: ctaOp, y: ctaY, zIndex: 12 }}>
            <a href={isMobile ? "#book" : "/book"} style={{ padding: "0.9rem 2.4rem", borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, white))", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "0.95rem", boxShadow: "0 4px 28px color-mix(in srgb, var(--primary) 40%, transparent), var(--glow)", display: "inline-flex", alignItems: "center", gap: "0.6rem", letterSpacing: "-0.01em" }}>
              Book an Inspection — ₹350
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <span style={{ fontSize: "0.76rem", color: "var(--text2)", fontWeight: 500 }}>Scroll to see full diagnostic teardown</span>
          </motion.div>

        </div>
      </div>
    </div>
  );
}