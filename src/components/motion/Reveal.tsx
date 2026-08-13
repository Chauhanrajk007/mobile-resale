"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  y = 60,
  blur = 10,
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
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
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
  const inView = useInView(ref, { once: false, margin: "-80px" });
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
          style={{ display: "inline-block", willChange: "transform, opacity, filter" }}
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.8, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {word}
          {"\u00A0"}
        </motion.span>
      ))}
    </Tag>
  );
}
