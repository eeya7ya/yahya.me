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

  return (
    <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-[1.3fr_1.1fr]">
      {/* Left side — name + tagline */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-20">
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

      {/* Right side — photo blended into the cream, behind a colorless cover */}
      <div className="relative h-full min-h-[35vh] md:min-h-0 flex items-center justify-center p-2 md:p-4 lg:p-6">
        <motion.div
          initial={{ scale: 1.04, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full max-h-[92vh] max-w-[36rem]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={name}
            className="h-full w-full object-contain object-center"
            style={{ mixBlendMode: "multiply" }}
            loading="eager"
          />
          <div className="absolute inset-0 photo-veil pointer-events-none" />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to left, rgba(255,244,230,0.0) 0%, rgba(255,244,230,0.14) 80%, rgba(255,250,243,0.34) 100%)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
