"use client";

// Shared "view more" call-to-action used across every home-deck slide.
// Wraps a Link with attention-grabbing motion — a soft pulsing glow, a
// periodic shimmer sweep, and a nudging arrow — to invite the visitor to
// click through. All looping motion is disabled under prefers-reduced-motion.

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  href: string;
  label: string;
  rtl?: boolean;
  variant?: "solid" | "outline";
};

export default function ViewMoreButton({ href, label, rtl = false, variant = "solid" }: Props) {
  const reduce = useReducedMotion();
  const arrow = rtl ? "←" : "→";
  const solid = variant === "solid";

  const buttonClasses = solid
    ? "bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white"
    : "border border-[var(--color-orange-300)]/60 bg-white/60 backdrop-blur text-[var(--color-orange-600)] hover:bg-[var(--color-orange-50)]";

  const shimmer = solid
    ? "linear-gradient(110deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)"
    : "linear-gradient(110deg, transparent 35%, rgba(240,138,43,0.28) 50%, transparent 65%)";

  return (
    <motion.div
      className="relative inline-flex rounded-full"
      animate={
        reduce
          ? undefined
          : {
              boxShadow: [
                "0 6px 18px -10px rgba(240,138,43,0.5)",
                "0 14px 38px -8px rgba(240,138,43,0.85)",
                "0 6px 18px -10px rgba(240,138,43,0.5)",
              ],
            }
      }
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      whileHover={reduce ? undefined : { scale: 1.045 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        href={href}
        className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)] ${buttonClasses}`}
      >
        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: shimmer }}
            initial={{ x: "-130%" }}
            animate={{ x: "130%" }}
            transition={{ duration: 1.05, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
          />
        )}
        <span className="relative z-10">{label}</span>
        <motion.span
          aria-hidden
          className="relative z-10 text-base leading-none"
          animate={reduce ? undefined : { x: rtl ? [0, -4, 0] : [0, 4, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          {arrow}
        </motion.span>
      </Link>
    </motion.div>
  );
}
