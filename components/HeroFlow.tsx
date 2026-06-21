"use client";

// A gentle stream of soft sparks drifting from the bottom corner (the
// photo side) up toward the hero text. Purely ambient — sits behind the
// text, never intercepts pointer events, and disables under
// prefers-reduced-motion.

import { motion, useReducedMotion } from "framer-motion";

const SPARKS = [
  { delay: 0, duration: 6.5, size: 6 },
  { delay: 1.3, duration: 7.5, size: 4 },
  { delay: 2.6, duration: 6, size: 5 },
  { delay: 3.9, duration: 8, size: 3 },
  { delay: 5.1, duration: 7, size: 5 },
];

export default function HeroFlow({ rtl = false }: { rtl?: boolean }) {
  const reduce = useReducedMotion();
  if (reduce) return null;

  // Flow originates from the bottom corner on the photo side and drifts
  // toward the text. In LTR the photo is on the right, so sparks go
  // up-and-left; mirrored for RTL.
  const dir = rtl ? 1 : -1;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {SPARKS.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[var(--color-orange-500)]"
          style={{
            width: s.size,
            height: s.size,
            bottom: "9%",
            left: rtl ? "8%" : "auto",
            right: rtl ? "auto" : "8%",
            boxShadow: "0 0 10px 2px rgba(240,138,43,0.45)",
          }}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
          animate={{
            opacity: [0, 0.85, 0.7, 0],
            x: [0, dir * 140, dir * 300],
            y: [0, -150, -320],
            scale: [0.6, 1, 0.4],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
