"use client";

// Interactive ambient backdrop for the hero. Soft orange color-blobs
// drift slowly and parallax toward the cursor, breaking up the flat cream
// background. A faint dot grid adds texture. Sits behind everything,
// never intercepts pointer events, and degrades to a calm static wash
// under prefers-reduced-motion.

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

export default function HeroAmbient() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0); // -0.5 … 0.5
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 35, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 35, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduce) return;
    function onMove(e: PointerEvent) {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my, reduce]);

  // Each blob parallaxes at a different depth for a layered feel.
  const b1x = useTransform(sx, (v) => v * 46);
  const b1y = useTransform(sy, (v) => v * 46);
  const b2x = useTransform(sx, (v) => v * -34);
  const b2y = useTransform(sy, (v) => v * -34);
  const b3x = useTransform(sx, (v) => v * 26);
  const b3y = useTransform(sy, (v) => v * 26);

  const drift = () =>
    reduce ? undefined : { scale: [1, 1.12, 1], opacity: [0.55, 0.78, 0.55] };
  const driftT = (dur: number) => ({ duration: dur, repeat: Infinity, ease: "easeInOut" as const });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* top-right warm glow */}
      <motion.span
        style={{ x: b1x, y: b1y }}
        animate={drift()}
        transition={driftT(13)}
        className="absolute -top-28 -right-20 size-[30rem] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,var(--color-orange-300),transparent_65%)]"
      />
      {/* bottom-corner ember pool (the RHS-down corner) */}
      <motion.span
        style={{ x: b2x, y: b2y }}
        animate={drift()}
        transition={driftT(16)}
        className="absolute -bottom-24 right-[-10%] size-[26rem] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,var(--color-orange-500),transparent_62%)] opacity-60"
      />
      {/* soft fill drifting near the text side */}
      <motion.span
        style={{ x: b3x, y: b3y }}
        animate={drift()}
        transition={driftT(19)}
        className="absolute top-1/3 -left-24 size-[24rem] rounded-full blur-3xl bg-[radial-gradient(circle_at_center,var(--color-orange-100),transparent_60%)]"
      />
      {/* faint dotted texture to break the flat fill */}
      <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(var(--color-orange-600)_1px,transparent_1px)] [background-size:22px_22px]" />
    </div>
  );
}
