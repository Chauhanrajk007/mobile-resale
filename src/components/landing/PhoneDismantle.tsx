"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
} from "framer-motion";

const dataUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const PHONE_FRONT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 475">
<defs>
<linearGradient id="ti" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#9a9aae"/><stop offset="30%" stop-color="#7a7a90"/><stop offset="60%" stop-color="#6e6e82"/><stop offset="100%" stop-color="#8a8a9e"/></linearGradient>
<linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a0a1a"/><stop offset="100%" stop-color="#050510"/></linearGradient>
<linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.08)"/><stop offset="40%" stop-color="rgba(255,255,255,0)"/></linearGradient>
<radialGradient id="lens" cx="0.35" cy="0.35" r="0.65"><stop offset="0%" stop-color="#4a8aff"/><stop offset="40%" stop-color="#1a3a8a"/><stop offset="70%" stop-color="#0a1a4a"/><stop offset="100%" stop-color="#050a2a"/></radialGradient>
<radialGradient id="cam" cx="0.3" cy="0.3" r="0.3"><stop offset="0%" stop-color="rgba(255,255,255,0.6)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
<radialGradient id="pg" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="#064e3b"/><stop offset="100%" stop-color="#059669"/></radialGradient>
</defs>
<rect width="230" height="475" rx="42" fill="#1a1a2e" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
<rect width="230" height="475" rx="42" fill="url(#glass)"/>
<rect x="74" y="14" width="82" height="24" rx="12" fill="#000" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
<circle cx="142" cy="26" r="4.5" fill="#0a0a1a" stroke="rgba(255,255,255,0.08)" stroke-width="0.5"/>
<circle cx="142" cy="26" r="2.5" fill="url(#lens)"/>
<circle cx="141" cy="25" r="0.8" fill="rgba(255,255,255,0.4)"/>
<text x="16" y="52" fill="rgba(255,255,255,0.7)" font-size="11" font-weight="600" font-family="system-ui">9:41</text>
<g transform="translate(180,42)">
<path d="M0,8 L2,6 Q5,3 8,0 Q11,3 14,6 L16,8" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.2"/>
<path d="M3,8 L5,6 Q7,4 9,2 Q11,4 13,6 L15,8" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
</g>
<g transform="translate(200,44)">
<rect x="0" y="3" width="2.5" height="5" rx="0.5" fill="rgba(255,255,255,0.3)"/>
<rect x="3.5" y="1.5" width="2.5" height="6.5" rx="0.5" fill="rgba(255,255,255,0.5)"/>
<rect x="7" y="0" width="2.5" height="8" rx="0.5" fill="rgba(255,255,255,0.7)"/>
<rect x="10.5" y="0" width="2.5" height="8" rx="0.5" fill="#fff"/>
</g>
<g transform="translate(216,44)">
<rect width="20" height="10" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
<rect x="1.5" y="1.5" width="14" height="7" rx="1" fill="#4cd964"/>
<rect x="21" y="3" width="2" height="4" rx="0.8" fill="rgba(255,255,255,0.4)"/>
</g>
<text x="16" y="82" fill="#8b5cf6" font-size="9" font-weight="800" letter-spacing="2" font-family="system-ui">CHECKMYPHONE</text>
<text x="16" y="104" fill="#fff" font-size="18" font-weight="800" font-family="system-ui">Inspection Report</text>
<rect x="16" y="114" width="198" height="190" rx="14" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
<text x="28" y="136" fill="#fff" font-size="13" font-weight="700" font-family="system-ui">iPhone 15 Pro</text>
<rect x="130" y="124" width="40" height="16" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>
<text x="150" y="135" fill="rgba(255,255,255,0.4)" font-size="8" font-weight="600" text-anchor="middle" font-family="system-ui">256 GB</text>
<circle cx="182" cy="160" r="22" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>
<circle cx="182" cy="160" r="22" fill="none" stroke="#059669" stroke-width="4" stroke-dasharray="132 4" transform="rotate(-90 182 160)"/>
<text x="182" y="164" fill="#059669" font-size="12" font-weight="800" text-anchor="middle" font-family="system-ui">96%</text>
<text x="28" y="200" fill="rgba(255,255,255,0.4)" font-size="9" font-family="system-ui">Display</text>
<text x="196" y="200" fill="#059669" font-size="9" font-weight="700" text-anchor="end" font-family="system-ui">✓</text>
<line x1="28" y1="205" x2="196" y2="205" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
<text x="28" y="220" fill="rgba(255,255,255,0.4)" font-size="9" font-family="system-ui">Battery</text>
<text x="196" y="220" fill="#059669" font-size="9" font-weight="700" text-anchor="end" font-family="system-ui">✓</text>
<line x1="28" y1="225" x2="196" y2="225" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
<text x="28" y="240" fill="rgba(255,255,255,0.4)" font-size="9" font-family="system-ui">Camera</text>
<text x="196" y="240" fill="#059669" font-size="9" font-weight="700" text-anchor="end" font-family="system-ui">✓</text>
<line x1="28" y1="245" x2="196" y2="245" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
<text x="28" y="260" fill="rgba(255,255,255,0.4)" font-size="9" font-family="system-ui">Speaker</text>
<text x="196" y="260" fill="#059669" font-size="9" font-weight="700" text-anchor="end" font-family="system-ui">✓</text>
<line x1="28" y1="265" x2="196" y2="265" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
<text x="28" y="280" fill="rgba(255,255,255,0.4)" font-size="9" font-family="system-ui">Face ID</text>
<text x="196" y="280" fill="#059669" font-size="9" font-weight="700" text-anchor="end" font-family="system-ui">✓</text>
<rect x="16" y="310" width="198" height="32" rx="10" fill="url(#ti)" opacity="0.15"/>
<rect x="16" y="310" width="198" height="32" rx="10" fill="none" stroke="#8b5cf6" stroke-width="0.5" opacity="0.5"/>
<text x="115" y="330" fill="#fff" font-size="10" font-weight="700" text-anchor="middle" font-family="system-ui">Share Report</text>
<rect x="85" y="460" width="60" height="4" rx="2" fill="rgba(255,255,255,0.15)"/>
</svg>`;

const PHONE_BACK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 230 475">
<defs>
<linearGradient id="ti2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#9a9aae"/><stop offset="30%" stop-color="#7a7a90"/><stop offset="60%" stop-color="#6e6e82"/><stop offset="100%" stop-color="#8a8a9e"/></linearGradient>
<radialGradient id="lens2" cx="0.35" cy="0.35" r="0.65"><stop offset="0%" stop-color="#4a8aff"/><stop offset="40%" stop-color="#1a3a8a"/><stop offset="70%" stop-color="#0a1a4a"/><stop offset="100%" stop-color="#050a2a"/></radialGradient>
<radialGradient id="cam2" cx="0.3" cy="0.3" r="0.3"><stop offset="0%" stop-color="rgba(255,255,255,0.6)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
<radialGradient id="flash2" cx="0.4" cy="0.4" r="0.6"><stop offset="0%" stop-color="#ffeaa7"/><stop offset="50%" stop-color="#fdcb6e"/><stop offset="100%" stop-color="#e17055"/></radialGradient>
</defs>
<rect width="230" height="475" rx="42" fill="#1a1a28" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
<rect x="14" y="14" width="82" height="82" rx="20" fill="#151520" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>
<g transform="translate(26,26)">
<circle cx="16" cy="16" r="14" fill="#111" stroke="url(#ti2)" stroke-width="2"/>
<circle cx="16" cy="16" r="10" fill="url(#lens2)"/>
<circle cx="16" cy="16" r="5" fill="#0a0a2a"/>
<circle cx="14" cy="14" r="2" fill="url(#cam2)"/>
<circle cx="48" cy="16" r="14" fill="#111" stroke="url(#ti2)" stroke-width="2"/>
<circle cx="48" cy="16" r="10" fill="url(#lens2)"/>
<circle cx="48" cy="16" r="5" fill="#0a0a2a"/>
<circle cx="46" cy="14" r="2" fill="url(#cam2)"/>
<circle cx="16" cy="48" r="12" fill="#111" stroke="url(#ti2)" stroke-width="2"/>
<circle cx="16" cy="48" r="8" fill="url(#lens2)"/>
<circle cx="16" cy="48" r="4" fill="#0a0a2a"/>
<circle cx="14.5" cy="46.5" r="1.5" fill="url(#cam2)"/>
<circle cx="48" cy="48" r="8" fill="url(#flash2)"/>
<circle cx="48" cy="48" r="4" fill="rgba(255,255,255,0.1)"/>
<circle cx="60" cy="54" r="3" fill="#111" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/>
</g>
<text x="115" y="120" fill="rgba(255,255,255,0.1)" font-size="5" font-weight="600" text-anchor="middle" letter-spacing="1.5" font-family="system-ui">DESIGNED BY APPLE IN CALIFORNIA</text>
<text x="115" y="132" fill="rgba(255,255,255,0.07)" font-size="5" text-anchor="middle" font-family="system-ui">iPhone 15 Pro · 256GB</text>
<g transform="translate(95,200)" opacity="0.06">
<path d="M20,0 C20,0 30,0 35,10 C40,20 35,35 20,45 C5,35 0,20 5,10 C10,0 20,0 20,0 Z" fill="none" stroke="#fff" stroke-width="1.5"/>
<rect x="17" y="45" width="6" height="4" rx="1" fill="#fff"/>
</g>
<rect x="85" y="458" width="60" height="4" rx="2" fill="rgba(255,255,255,0.06)"/>
</svg>`;

const CHASSIS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 224 469">
<defs>
<radialGradient id="sh" cx="0.5" cy="0.5" r="0.5"><stop offset="0%" stop-color="rgba(200,200,220,0.5)"/><stop offset="100%" stop-color="rgba(80,80,100,0.2)"/></radialGradient>
</defs>
<rect x="3" y="3" width="218" height="463" rx="38" fill="#222230"/>
<circle cx="14" cy="40" r="2.5" fill="url(#sh)"/>
<circle cx="210" cy="40" r="2.5" fill="url(#sh)"/>
<circle cx="14" cy="94" r="2.5" fill="url(#sh)"/>
<circle cx="210" cy="94" r="2.5" fill="url(#sh)"/>
<circle cx="14" cy="148" r="2.5" fill="url(#sh)"/>
<circle cx="210" cy="148" r="2.5" fill="url(#sh)"/>
<circle cx="14" cy="202" r="2.5" fill="url(#sh)"/>
<circle cx="210" cy="202" r="2.5" fill="url(#sh)"/>
<line x1="40" y1="40" x2="40" y2="430" stroke="rgba(100,100,130,0.06)" stroke-width="0.5"/>
<line x1="180" y1="40" x2="180" y2="430" stroke="rgba(100,100,130,0.06)" stroke-width="0.5"/>
<line x1="40" y1="250" x2="180" y2="250" stroke="rgba(100,100,130,0.06)" stroke-width="0.5"/>
<rect x="22" y="349" width="88" height="62" rx="8" fill="#1a1a28" stroke="rgba(100,100,120,0.15)" stroke-width="0.5"/>
<rect x="25" y="352" width="82" height="56" rx="6" fill="#161624"/>
<rect x="144" y="42" width="60" height="60" rx="14" fill="#1a1a28" stroke="rgba(100,100,120,0.15)" stroke-width="0.5"/>
<circle cx="162" cy="60" r="11" fill="#111" stroke="rgba(80,80,100,0.1)" stroke-width="0.5"/>
<circle cx="184" cy="60" r="11" fill="#111" stroke="rgba(80,80,100,0.1)" stroke-width="0.5"/>
<circle cx="162" cy="84" r="9" fill="#111" stroke="rgba(80,80,100,0.1)" stroke-width="0.5"/>
<circle cx="184" cy="84" r="6" fill="#1a1a20" stroke="rgba(80,80,100,0.1)" stroke-width="0.5"/>
<rect x="14" y="118" width="78" height="135" rx="8" fill="#0d1a12" stroke="rgba(34,197,94,0.1)" stroke-width="0.5"/>
<rect x="30" y="165" width="38" height="38" rx="4" fill="#0a1a0e" stroke="rgba(34,197,94,0.08)" stroke-width="0.5"/>
<rect x="52" y="439" width="55" height="18" rx="6" fill="#1a1a24" stroke="rgba(100,100,120,0.1)" stroke-width="0.5"/>
<line x1="80" y1="253" x2="80" y2="349" stroke="rgba(100,100,120,0.08)" stroke-width="0.5"/>
<line x1="92" y1="102" x2="144" y2="102" stroke="rgba(100,100,120,0.08)" stroke-width="0.5"/>
<line x1="92" y1="200" x2="144" y2="200" stroke="rgba(100,100,120,0.08)" stroke-width="0.5"/>
</svg>`;

const BATTERY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 62">
<defs>
<linearGradient id="batt2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2d1b69"/><stop offset="100%" stop-color="#1a1145"/></linearGradient>
</defs>
<rect width="88" height="62" rx="8" fill="url(#batt2)" stroke="rgba(139,92,246,0.3)" stroke-width="0.8"/>
<rect x="6" y="6" width="76" height="50" rx="4" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.15)" stroke-width="0.5"/>
<line x1="10" y1="14" x2="78" y2="14" stroke="rgba(139,92,246,0.1)" stroke-width="0.5"/>
<line x1="10" y1="23" x2="78" y2="23" stroke="rgba(139,92,246,0.1)" stroke-width="0.5"/>
<line x1="10" y1="32" x2="78" y2="32" stroke="rgba(139,92,246,0.1)" stroke-width="0.5"/>
<line x1="10" y1="41" x2="78" y2="41" stroke="rgba(139,92,246,0.1)" stroke-width="0.5"/>
<line x1="10" y1="50" x2="78" y2="50" stroke="rgba(139,92,246,0.1)" stroke-width="0.5"/>
<rect x="82" y="20" width="4" height="22" rx="2" fill="rgba(139,92,246,0.4)"/>
<text x="44" y="30" fill="rgba(139,92,246,0.7)" font-size="8" font-weight="700" text-anchor="middle" font-family="system-ui">Li-ion</text>
<text x="44" y="42" fill="rgba(139,92,246,0.4)" font-size="6" text-anchor="middle" font-family="system-ui">3274 mAh</text>
<text x="44" y="52" fill="rgba(139,92,246,0.3)" font-size="5" text-anchor="middle" font-family="system-ui">89% Health</text>
<line x1="6" y1="5" x2="82" y2="5" stroke="rgba(139,92,246,0.08)" stroke-width="0.3"/>
<line x1="6" y1="57" x2="82" y2="57" stroke="rgba(139,92,246,0.08)" stroke-width="0.3"/>
</svg>`;

const CAMERA_MODULE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 68">
<defs>
<linearGradient id="ti3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#9a9aae"/><stop offset="30%" stop-color="#7a7a90"/><stop offset="60%" stop-color="#6e6e82"/><stop offset="100%" stop-color="#8a8a9e"/></linearGradient>
<radialGradient id="lens3" cx="0.35" cy="0.35" r="0.65"><stop offset="0%" stop-color="#4a8aff"/><stop offset="40%" stop-color="#1a3a8a"/><stop offset="70%" stop-color="#0a1a4a"/><stop offset="100%" stop-color="#050a2a"/></radialGradient>
<radialGradient id="cam3" cx="0.3" cy="0.3" r="0.3"><stop offset="0%" stop-color="rgba(255,255,255,0.6)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></radialGradient>
<radialGradient id="flash3" cx="0.4" cy="0.4" r="0.6"><stop offset="0%" stop-color="#ffeaa7"/><stop offset="50%" stop-color="#fdcb6e"/><stop offset="100%" stop-color="#e17055"/></radialGradient>
</defs>
<rect width="68" height="68" rx="16" fill="#151e2d" stroke="rgba(14,165,233,0.3)" stroke-width="0.8"/>
<circle cx="22" cy="22" r="13" fill="#111" stroke="url(#ti3)" stroke-width="1.5"/>
<circle cx="22" cy="22" r="10" fill="url(#lens3)"/>
<circle cx="22" cy="22" r="5" fill="#0a0a2a"/>
<circle cx="20" cy="20" r="2" fill="url(#cam3)"/>
<circle cx="48" cy="22" r="13" fill="#111" stroke="url(#ti3)" stroke-width="1.5"/>
<circle cx="48" cy="22" r="10" fill="url(#lens3)"/>
<circle cx="48" cy="22" r="5" fill="#0a0a2a"/>
<circle cx="46" cy="20" r="2" fill="url(#cam3)"/>
<circle cx="22" cy="48" r="11" fill="#111" stroke="url(#ti3)" stroke-width="1.5"/>
<circle cx="22" cy="48" r="8" fill="url(#lens3)"/>
<circle cx="22" cy="48" r="4" fill="#0a0a2a"/>
<circle cx="20.5" cy="46.5" r="1.5" fill="url(#cam3)"/>
<circle cx="48" cy="48" r="8" fill="url(#flash3)"/>
<circle cx="48" cy="48" r="4" fill="rgba(255,255,255,0.08)"/>
<text x="34" y="66" fill="rgba(14,165,233,0.6)" font-size="5" font-weight="700" text-anchor="middle" letter-spacing="1" font-family="system-ui">CAMERA</text>
</svg>`;

const LOGIC_BOARD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 78 135">
<defs>
<linearGradient id="pcb2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0d2818"/><stop offset="100%" stop-color="#081a10"/></linearGradient>
<linearGradient id="chip2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2a2a3a"/><stop offset="100%" stop-color="#1a1a28"/></linearGradient>
</defs>
<rect width="78" height="135" rx="8" fill="url(#pcb2)" stroke="rgba(34,197,94,0.25)" stroke-width="0.8"/>
<rect x="20" y="42" width="38" height="38" rx="4" fill="url(#chip2)" stroke="rgba(34,197,94,0.3)" stroke-width="0.8"/>
<text x="39" y="64" fill="rgba(34,197,94,0.7)" font-size="7" font-weight="800" text-anchor="middle" font-family="system-ui">A17 Pro</text>
<rect x="6" y="8" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="24" y="8" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="42" y="8" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="60" y="8" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="6" y="15" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="24" y="15" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="42" y="15" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="60" y="15" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="6" y="22" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="24" y="22" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="42" y="22" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="60" y="22" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="6" y="29" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="24" y="29" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="42" y="29" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.15)"/>
<rect x="60" y="29" width="5" height="4" rx="0.5" fill="rgba(34,197,94,0.4)"/>
<rect x="6" y="90" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="30" y="90" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="54" y="90" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="6" y="96" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="30" y="96" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="54" y="96" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="6" y="102" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="30" y="102" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="54" y="102" width="10" height="3" rx="0.5" fill="rgba(34,197,94,0.2)"/>
<rect x="6" y="124" width="10" height="3" rx="0.5" fill="rgba(180,160,80,0.3)"/>
<rect x="30" y="124" width="10" height="3" rx="0.5" fill="rgba(180,160,80,0.3)"/>
<rect x="54" y="124" width="10" height="3" rx="0.5" fill="rgba(180,160,80,0.3)"/>
<line x1="8" y1="118" x2="70" y2="118" stroke="rgba(34,197,94,0.08)" stroke-width="0.5"/>
<line x1="8" y1="123" x2="70" y2="123" stroke="rgba(34,197,94,0.08)" stroke-width="0.5"/>
<line x1="8" y1="128" x2="70" y2="128" stroke="rgba(34,197,94,0.08)" stroke-width="0.5"/>
<circle cx="12" cy="38" r="1" fill="rgba(34,197,94,0.25)"/>
<circle cx="30" cy="36" r="1" fill="rgba(34,197,94,0.25)"/>
<circle cx="48" cy="38" r="1" fill="rgba(34,197,94,0.25)"/>
<circle cx="66" cy="36" r="1" fill="rgba(34,197,94,0.25)"/>
<circle cx="12" cy="86" r="1" fill="rgba(34,197,94,0.25)"/>
<circle cx="66" cy="86" r="1" fill="rgba(34,197,94,0.25)"/>
<text x="39" y="131" fill="rgba(34,197,94,0.5)" font-size="5" font-weight="700" text-anchor="middle" letter-spacing="1" font-family="system-ui">LOGIC BOARD</text>
</svg>`;

const SPEAKER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 18">
<defs>
<linearGradient id="spk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a2a30"/><stop offset="100%" stop-color="#1a1a22"/></linearGradient>
</defs>
<rect width="55" height="18" rx="6" fill="url(#spk2)" stroke="rgba(156,163,175,0.25)" stroke-width="0.8"/>
<circle cx="10" cy="9" r="2" fill="#111" stroke="rgba(156,163,175,0.15)" stroke-width="0.3"/>
<circle cx="17" cy="9" r="2" fill="#111" stroke="rgba(156,163,175,0.15)" stroke-width="0.3"/>
<circle cx="24" cy="9" r="2" fill="#111" stroke="rgba(156,163,175,0.15)" stroke-width="0.3"/>
<circle cx="31" cy="9" r="2" fill="#111" stroke="rgba(156,163,175,0.15)" stroke-width="0.3"/>
<circle cx="38" cy="9" r="2" fill="#111" stroke="rgba(156,163,175,0.15)" stroke-width="0.3"/>
<circle cx="45" cy="9" r="2" fill="#111" stroke="rgba(156,163,175,0.15)" stroke-width="0.3"/>
</svg>`;

const PW = 230;
const PH = 475;
const PARTS = [
  { label: "30+ Checkpoints", desc: "Every angle inspected under studio light" },
  { label: "Display & Touch", desc: "Dead pixels, burn-in, touch accuracy" },
  { label: "Battery Health", desc: "Capacity, cycle count, swelling detection" },
  { label: "Camera & Sensors", desc: "Focus, stabilization, Face ID integrity" },
  { label: "Verified Report", desc: "Shareable, tamper-proof certificate" },
];

export default function PhoneDismantle() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const sp = useSpring(scrollYProgress, { stiffness: 40, damping: 25, mass: 0.6 });
  const rawVelocity = useVelocity(scrollYProgress);
  const velocity = useSpring(rawVelocity, { stiffness: 60, damping: 12 });
  const vBoost = useTransform(velocity, [-1.5, 0, 1.5], [-10, 0, 10]);
  const baseRotY = useTransform(sp, [0, 1], [0, 360]);
  const phoneRotY = useTransform([baseRotY, vBoost] as any, ([b, v]: number[]) => b + v);

  const phoneRotX = useTransform(sp, [0, 0.06, 0.22, 0.38, 0.54, 0.68, 0.8, 0.92, 1], [0, 0, -4, 5, -3, 4, -5, 3, 0]);
  const phoneScale = useTransform(sp, [0, 0.05, 0.92, 1], [1, 1, 1, 0.94]);

  const screenY = useTransform(sp, [0.08, 0.28], [0, -180]);
  const screenRX = useTransform(sp, [0.08, 0.28], [0, -28]);
  const screenOp = useTransform(sp, [0.06, 0.12, 0.6, 0.74], [1, 1, 1, 0]);

  const battX = useTransform(sp, [0.24, 0.42], [0, 155]);
  const battY = useTransform(sp, [0.24, 0.42], [0, 105]);
  const battR = useTransform(sp, [0.24, 0.42], [0, 20]);
  const battOp = useTransform(sp, [0.22, 0.30, 0.78, 0.86], [0, 1, 1, 0]);

  const camX = useTransform(sp, [0.38, 0.56], [0, 140]);
  const camY = useTransform(sp, [0.38, 0.56], [0, -130]);
  const camR = useTransform(sp, [0.38, 0.56], [0, -15]);
  const camOp = useTransform(sp, [0.36, 0.44, 0.78, 0.86], [0, 1, 1, 0]);

  const boardX = useTransform(sp, [0.50, 0.68], [0, -155]);
  const boardY = useTransform(sp, [0.50, 0.68], [0, 65]);
  const boardR = useTransform(sp, [0.50, 0.68], [0, -12]);
  const boardOp = useTransform(sp, [0.48, 0.56, 0.78, 0.86], [0, 1, 1, 0]);

  const spkY = useTransform(sp, [0.62, 0.80], [0, 130]);
  const spkR = useTransform(sp, [0.62, 0.80], [0, 18]);
  const spkOp = useTransform(sp, [0.60, 0.68, 0.78, 0.86], [0, 1, 1, 0]);

  const ctaOp = useTransform(sp, [0.9, 0.96], [0, 1]);
  const ctaY = useTransform(sp, [0.9, 0.96], [25, 0]);

  const lOps = [
    useTransform(sp, [0.08, 0.14, 0.22, 0.30], [0, 1, 1, 0]),
    useTransform(sp, [0.24, 0.30, 0.40, 0.48], [0, 1, 1, 0]),
    useTransform(sp, [0.38, 0.44, 0.54, 0.62], [0, 1, 1, 0]),
    useTransform(sp, [0.50, 0.56, 0.66, 0.74], [0, 1, 1, 0]),
    useTransform(sp, [0.62, 0.68, 0.80, 0.88], [0, 1, 1, 0]),
  ];
  const lXs = [
    useTransform(sp, [0.08, 0.14], [-35, 0]),
    useTransform(sp, [0.24, 0.30], [-35, 0]),
    useTransform(sp, [0.38, 0.44], [-35, 0]),
    useTransform(sp, [0.50, 0.56], [-35, 0]),
    useTransform(sp, [0.62, 0.68], [-35, 0]),
  ];
  const rOps = [
    useTransform(sp, [0.12, 0.20, 0.26, 0.34], [0, 1, 1, 0]),
    useTransform(sp, [0.30, 0.38, 0.44, 0.52], [0, 1, 1, 0]),
    useTransform(sp, [0.44, 0.52, 0.58, 0.66], [0, 1, 1, 0]),
    useTransform(sp, [0.56, 0.64, 0.70, 0.78], [0, 1, 1, 0]),
    useTransform(sp, [0.68, 0.76, 0.84, 0.92], [0, 1, 1, 0]),
  ];
  const rXs = [
    useTransform(sp, [0.12, 0.20], [35, 0]),
    useTransform(sp, [0.30, 0.38], [35, 0]),
    useTransform(sp, [0.44, 0.52], [35, 0]),
    useTransform(sp, [0.56, 0.64], [35, 0]),
    useTransform(sp, [0.68, 0.76], [35, 0]),
  ];

  const imgStyle = (w: number, h: number): React.CSSProperties => ({
    width: w,
    height: h,
    display: "block",
    borderRadius: 42,
    overflow: "hidden",
  });

  return (
    <div ref={containerRef} style={{ height: "500vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", overflow: "hidden" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2rem", position: "relative" }}>

          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 15%, transparent), transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

          <div style={{ position: "absolute", left: "clamp(1rem, 4vw, 6rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "2rem", maxWidth: 320, zIndex: 2 }}>
            {PARTS.map((part, i) => (
              <motion.div key={i} style={{ opacity: lOps[i], x: lXs[i] }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 70%, white))", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0, boxShadow: "0 2px 12px color-mix(in srgb, var(--primary) 40%, transparent)" }}>{i + 1}</div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{part.label}</div>
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.5, paddingLeft: "2.75rem" }}>{part.desc}</div>
              </motion.div>
            ))}
          </div>

          <div style={{ position: "absolute", right: "clamp(1rem, 4vw, 6rem)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: 280, zIndex: 2, alignItems: "flex-end" }}>
            {[
              { op: rOps[0], x: rXs[0], text: "12 checkpoints — screen & display" },
              { op: rOps[1], x: rXs[1], text: "Health, cycles & swelling check" },
              { op: rOps[2], x: rXs[2], text: "Lens, focus & stabilization test" },
              { op: rOps[3], x: rXs[3], text: "Processor, memory & port integrity" },
              { op: rOps[4], x: rXs[4], text: "Grille cleared, driver verified" },
            ].map((c, i) => (
              <motion.div key={i} style={{ opacity: c.op, x: c.x, padding: "0.75rem 1.1rem", borderRadius: "var(--radius)", background: "color-mix(in srgb, var(--surface) 60%, transparent)", border: "1px solid var(--border)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", fontSize: "0.78rem", color: "var(--text2)", textAlign: "right", lineHeight: 1.45, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>{c.text}</motion.div>
            ))}
          </div>

          <motion.div style={{ perspective: 1800, perspectiveOrigin: "50% 50%", display: "flex", justifyContent: "center", alignItems: "center", position: "relative", scale: phoneScale, zIndex: 5 }}>
            <motion.div style={{ rotateY: phoneRotY, rotateX: phoneRotX, transformStyle: "preserve-3d", position: "relative", width: PW, height: PH, willChange: "transform" }}>

              <div style={{ position: "absolute", width: PW, height: PH, borderRadius: 42, transform: "rotateY(180deg) translateZ(7px)", backfaceVisibility: "hidden", overflow: "hidden" }}>
                <img src={dataUri(PHONE_BACK)} style={imgStyle(PW, PH)} alt="" draggable={false} />
              </div>

              <div style={{ position: "absolute", width: 14, height: PH, top: 0, right: -7, transform: "rotateY(90deg) translateZ(0px)", transformOrigin: "right center", backfaceVisibility: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(160,160,180,0.4), rgba(100,100,120,0.3), rgba(120,120,140,0.35))", borderRight: "1px solid rgba(255,255,255,0.1)" }} />
                <div style={{ position: "absolute", top: "28%", left: 1, width: 12, height: 45, borderRadius: "3px 2px 2px 3px", background: "linear-gradient(90deg, rgba(200,200,220,0.5), rgba(140,140,160,0.35))" }} />
                <div style={{ position: "absolute", top: "48%", left: 1, width: 12, height: 32, borderRadius: "3px 2px 2px 3px", background: "linear-gradient(90deg, rgba(200,200,220,0.4), rgba(140,140,160,0.3))" }} />
              </div>

              <div style={{ position: "absolute", width: 14, height: PH, top: 0, left: -7, transform: "rotateY(-90deg) translateZ(0px)", transformOrigin: "left center", backfaceVisibility: "hidden" }}>
                <div style={{ width: "100%", height: "100%", background: "linear-gradient(180deg, rgba(90,90,110,0.5), rgba(60,60,80,0.4), rgba(50,50,70,0.35))", borderLeft: "1px solid rgba(255,255,255,0.08)" }} />
                <div style={{ position: "absolute", top: "18%", right: 1, width: 10, height: 38, borderRadius: "2px 3px 3px 2px", background: "linear-gradient(270deg, rgba(180,180,200,0.5), rgba(120,120,140,0.3))" }} />
                <div style={{ position: "absolute", top: "28%", right: 1, width: 10, height: 32, borderRadius: "2px 3px 3px 2px", background: "linear-gradient(270deg, rgba(180,180,200,0.5), rgba(120,120,140,0.3))" }} />
                <div style={{ position: "absolute", top: "38%", right: 1, width: 10, height: 32, borderRadius: "2px 3px 3px 2px", background: "linear-gradient(270deg, rgba(180,180,200,0.5), rgba(120,120,140,0.3))" }} />
              </div>

              <div style={{ position: "absolute", width: PW, height: 14, top: -7, left: 0, transform: "rotateX(90deg) translateZ(0px)", transformOrigin: "center top", backfaceVisibility: "hidden", background: "linear-gradient(90deg, rgba(130,130,150,0.4), rgba(160,160,180,0.5), rgba(130,130,150,0.4))", borderTop: "1px solid rgba(255,255,255,0.1)" }} />

              <div style={{ position: "absolute", width: PW, height: 14, bottom: -7, left: 0, transform: "rotateX(-90deg) translateZ(0px)", transformOrigin: "center bottom", backfaceVisibility: "hidden", background: "linear-gradient(90deg, rgba(110,110,130,0.4), rgba(140,140,160,0.5), rgba(110,110,130,0.4))", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex", gap: 2 }}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(150,150,170,0.4)" }} />
                  ))}
                </div>
              </div>

              <div style={{ position: "absolute", width: PW - 6, height: PH - 6, top: 3, left: 3, borderRadius: 38, transform: "translateZ(0px)", backfaceVisibility: "hidden", overflow: "hidden" }}>
                <img src={dataUri(CHASSIS)} style={{ width: PW - 6, height: PH - 6, display: "block" }} alt="" draggable={false} />
              </div>

              <motion.div style={{ position: "absolute", width: PW, height: PH, transform: "translateZ(7px)", transformStyle: "preserve-3d", zIndex: 5, y: screenY, rotateX: screenRX, opacity: screenOp, boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
                <img src={dataUri(PHONE_FRONT)} style={imgStyle(PW, PH)} alt="" draggable={false} />
              </motion.div>

              <motion.div style={{ position: "absolute", bottom: 50, left: 22, x: battX, y: battY, rotate: battR, opacity: battOp, transformStyle: "preserve-3d", zIndex: 3, translateZ: 20 }}>
                <img src={dataUri(BATTERY)} style={{ width: 88, height: 62, display: "block" }} alt="" draggable={false} />
              </motion.div>

              <motion.div style={{ position: "absolute", top: 40, right: 15, x: camX, y: camY, rotate: camR, opacity: camOp, transformStyle: "preserve-3d", zIndex: 3, translateZ: 20 }}>
                <img src={dataUri(CAMERA_MODULE)} style={{ width: 68, height: 68, display: "block" }} alt="" draggable={false} />
              </motion.div>

              <motion.div style={{ position: "absolute", top: 125, left: 14, x: boardX, y: boardY, rotate: boardR, opacity: boardOp, transformStyle: "preserve-3d", zIndex: 3, translateZ: 20 }}>
                <img src={dataUri(LOGIC_BOARD)} style={{ width: 78, height: 135, display: "block" }} alt="" draggable={false} />
              </motion.div>

              <motion.div style={{ position: "absolute", bottom: 12, left: 50, y: spkY, rotate: spkR, opacity: spkOp, transformStyle: "preserve-3d", zIndex: 3, translateZ: 20 }}>
                <img src={dataUri(SPEAKER)} style={{ width: 55, height: 18, display: "block" }} alt="" draggable={false} />
              </motion.div>

              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 10%, transparent), transparent 70%)", filter: "blur(60px)", pointerEvents: "none", zIndex: -1 }} />
            </motion.div>
          </motion.div>

          <motion.div style={{ position: "absolute", bottom: "clamp(2rem, 5vh, 4rem)", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", opacity: ctaOp, y: ctaY, zIndex: 10 }}>
            <a href="#book" style={{ padding: "0.9rem 2.2rem", borderRadius: "var(--radius)", background: "linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 75%, white))", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: "1rem", boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 40%, transparent), var(--glow)", display: "inline-flex", alignItems: "center", gap: "0.5rem", letterSpacing: "-0.01em" }}>
              Book an Inspection — ₹349
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
            <span style={{ fontSize: "0.75rem", color: "var(--text2)" }}>Scroll to explore the inspection</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}