"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const lenis = new Lenis({
      duration: isMobile ? 0.9 : 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: isMobile ? 1 : 1.5,
      anchors: true,
    });

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    const rafId = requestAnimationFrame(function loop(time) {
      raf(time);
      requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
