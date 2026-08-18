"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const SPRING = { type: "spring" as const, stiffness: 80, damping: 20, mass: 1 };

export function Reveal({
  children,
  delay = 0,
  y = 60,
  blur = 12,
  className,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, scale: 0.97, filter: `blur(${blur}px)` }}
      animate={inView ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}

export function WordReveal({
  text,
  as = "h2",
  delay = 0,
  className,
  style,
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const words = text.split(" ");

  const Tag = as as "h2";

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...style, display: "flex", flexWrap: "wrap", columnGap: "0.28em" }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block" }}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ ...SPRING, delay: delay + i * 0.07 }}
        >
          {word}
          {"\u00A0"}
        </motion.span>
      ))}
    </Tag>
  );
}
