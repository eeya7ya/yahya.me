"use client";

import { motion } from "framer-motion";
import type { Lang, Dict } from "@/lib/i18n";
import type { SiteContent } from "@/lib/settings";

type Props = {
  lang: Lang;
  t: Dict[Lang];
  content: SiteContent;
  onNext: () => void;
};

export default function Hero({ lang, t, content, onNext }: Props) {
  const h = content.hero;
  const photoUrl = content.photoUrl;
  const greeting = lang === "ar" ? h.greetingAr : h.greetingEn;
  const name = lang === "ar" ? h.nameAr : h.nameEn;
  const role = lang === "ar" ? h.roleAr : h.roleEn;
  const tagline = lang === "ar" ? h.taglineAr : h.taglineEn;
  const cta = lang === "ar" ? h.ctaAr : h.ctaEn;
  void t;

  const isRtl = lang === "ar";

  return (
    <div className="absolute inset-0">
      {/* Photo — full-bleed background layer, sits BEHIND the orange UI */}
      <motion.div
        aria-hidden
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute inset-y-0 ${isRtl ? "left-0" : "right-0"} w-full md:w-[58%] lg:w-[52%] z-0 pointer-events-none`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoUrl}
          alt={name}
          className="h-full w-full object-contain object-bottom"
          style={{
            WebkitMaskImage: isRtl
              ? "linear-gradient(to right, transparent 0%, black 24%, black 100%)"
              : "linear-gradient(to left, transparent 0%, black 24%, black 100%)",
            maskImage: isRtl
              ? "linear-gradient(to right, transparent 0%, black 24%, black 100%)"
              : "linear-gradient(to left, transparent 0%, black 24%, black 100%)",
          }}
          loading="eager"
        />
        {/* soft cream fade at the bottom so the legs blend into the page */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 md:h-56"
          style={{
            background:
              "linear-gradient(to top, var(--color-cream) 0%, rgba(255,250,243,0.7) 45%, transparent 100%)",
          }}
        />
      </motion.div>

      {/* Orange UI — name + tagline, sits ABOVE the photo */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:max-w-[60%]">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-sm md:text-base text-[var(--color-orange-600)] tracking-widest uppercase"
        >
          {greeting}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-3 text-5xl md:text-7xl lg:text-8xl font-bold leading-tight text-[var(--color-ink)]"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-[var(--color-ink-soft)]"
        >
          {role}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 flex items-center gap-4"
        >
          <span className="h-px w-16 bg-[var(--color-orange-500)]" />
          <span className="text-2xl md:text-3xl font-medium text-[var(--color-orange-600)]">
            {tagline}
          </span>
        </motion.div>

        <motion.button
          onClick={onNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-12 self-start group inline-flex items-center gap-3 text-sm tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-orange-600)] transition"
        >
          <span>{cta}</span>
          <span className="inline-block transition-transform group-hover:translate-y-0.5">↓</span>
        </motion.button>
      </div>
    </div>
  );
}
