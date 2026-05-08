"use client";

import { motion } from "framer-motion";
import type { Lang, Dict } from "@/lib/i18n";
import { dict } from "@/lib/i18n";
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
  const site = dict[lang].hero.site;
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
          style={{ mixBlendMode: "multiply" }}
          loading="eager"
        />
      </motion.div>

      {/* Orange UI — name + tagline, sits ABOVE the photo */}
      <div className="relative z-10 flex h-full flex-col justify-center px-8 md:px-16 lg:px-24 py-20 md:max-w-[60%]">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="text-base md:text-xl lg:text-2xl text-[var(--color-orange-600)] tracking-widest uppercase"
        >
          {greeting}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-3 text-6xl md:text-8xl lg:text-9xl font-bold leading-tight text-[var(--color-ink)]"
        >
          {name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-4 text-xl md:text-2xl lg:text-3xl text-[var(--color-ink-soft)]"
        >
          {role}
        </motion.p>

        {/* Tagline chip — dot sits flush against the chip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-10 flex items-center gap-2"
        >
          <span aria-hidden className="size-2.5 rounded-full bg-[var(--color-orange-500)] shadow-[0_0_0_4px_rgba(217,112,26,0.15)]" />
          <span className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/60 backdrop-blur px-4 py-1.5 text-base md:text-lg font-semibold tracking-wide text-[var(--color-orange-600)]">
            {tagline}
          </span>
        </motion.div>

        {/* Site / handle */}
        <motion.a
          href="https://eSpark.dev"
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
          className="mt-5 inline-flex items-center gap-2 self-start text-xs md:text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-orange-600)] transition"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--color-orange-500)]/70" />
          <span className="tracking-wide">{site}</span>
          <span aria-hidden className="opacity-60">↗</span>
        </motion.a>
      </div>

      {/* Floating CTA — sits at the bottom, horizontally centered between text and image */}
      <motion.button
        onClick={onNext}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20 group inline-flex flex-col items-center gap-2 text-xs md:text-sm tracking-[0.2em] uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-orange-600)] transition"
      >
        <span>{cta}</span>
        <span
          aria-hidden
          className="inline-flex items-center justify-center size-8 rounded-full border border-[var(--color-orange-300)]/60 bg-white/60 backdrop-blur transition-transform group-hover:translate-y-0.5 group-hover:border-[var(--color-orange-500)]"
        >
          <span className="text-[var(--color-orange-600)]">↓</span>
        </span>
      </motion.button>
    </div>
  );
}
