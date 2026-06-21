"use client";

// Protection-engineer themed hero backdrop: a faint technical grid, two
// traveling AC waveforms (power signals), and slowly floating protection
// tokens (relay/ANSI codes, measurements). Deliberately subtle and
// UI-friendly. Sits behind everything, never intercepts pointer events,
// and goes static under prefers-reduced-motion.

import { motion, useReducedMotion } from "framer-motion";

// Faint relay / measurement labels a protection engineer would recognise.
const TOKENS = [
  { t: "50/51", left: "9%", top: "20%", delay: 0.0, dur: 7.5 },
  { t: "I>", left: "24%", top: "63%", delay: 1.5, dur: 8.0 },
  { t: "87T", left: "43%", top: "16%", delay: 0.8, dur: 7.0 },
  { t: "11kV", left: "61%", top: "72%", delay: 2.2, dur: 8.5 },
  { t: "50Hz", left: "80%", top: "28%", delay: 1.1, dur: 7.0 },
  { t: "3I₀", left: "15%", top: "44%", delay: 2.8, dur: 9.0 },
  { t: "ΔI", left: "69%", top: "48%", delay: 0.4, dur: 8.0 },
  { t: "Ω", left: "52%", top: "82%", delay: 1.9, dur: 7.5 },
  { t: "kA", left: "33%", top: "34%", delay: 3.1, dur: 8.0 },
  { t: "ANSI 67", left: "85%", top: "58%", delay: 0.6, dur: 9.0 },
];

// Build a sine path with an integer number of periods so two tiled copies
// join seamlessly (start and end both rest on the baseline).
function sinePath(w = 1000, base = 60, amp = 22, wl = 250, step = 10) {
  let d = `M0 ${base}`;
  for (let x = step; x <= w; x += step) {
    const y = base - amp * Math.sin((2 * Math.PI * x) / wl);
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d;
}

export default function HeroTech() {
  const reduce = useReducedMotion();
  const wave1 = sinePath(1000, 60, 22, 250); // 4 periods
  const wave2 = sinePath(1000, 60, 16, 200); // 5 periods

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* technical grid */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(var(--color-orange-600)_1px,transparent_1px),linear-gradient(90deg,var(--color-orange-600)_1px,transparent_1px)] [background-size:46px_46px]" />

      {/* traveling power waveform */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 opacity-[0.16]">
        <motion.div
          className="flex h-full w-[200%]"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((k) => (
            <svg key={k} className="h-full w-1/2" viewBox="0 0 1000 120" preserveAspectRatio="none" fill="none">
              <path d={wave1} stroke="var(--color-orange-500)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ))}
        </motion.div>
      </div>

      {/* second, slower waveform for depth */}
      <div className="absolute inset-x-0 top-[57%] -translate-y-1/2 h-32 opacity-[0.10]">
        <motion.div
          className="flex h-full w-[200%]"
          animate={reduce ? undefined : { x: ["-50%", "0%"] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((k) => (
            <svg key={k} className="h-full w-1/2" viewBox="0 0 1000 120" preserveAspectRatio="none" fill="none">
              <path d={wave2} stroke="var(--color-orange-600)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ))}
        </motion.div>
      </div>

      {/* floating protection tokens */}
      {TOKENS.map((tk, i) => (
        <motion.span
          key={i}
          className="absolute select-none font-mono text-[11px] md:text-sm font-medium tracking-wider text-[var(--color-orange-600)]"
          style={{ left: tk.left, top: tk.top }}
          initial={{ opacity: 0, y: 0 }}
          animate={reduce ? { opacity: 0.18 } : { opacity: [0, 0.3, 0], y: [0, -14, 0] }}
          transition={{ duration: tk.dur, delay: tk.delay, repeat: Infinity, ease: "easeInOut" }}
        >
          {tk.t}
        </motion.span>
      ))}
    </div>
  );
}
