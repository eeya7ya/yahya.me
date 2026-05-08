"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import type { SiteContent } from "@/lib/settings";

export default function AboutFull({ content }: { content: SiteContent }) {
  const lang = useLang();
  const a = content.about;
  const title = lang === "ar" ? a.titleAr : a.titleEn;
  const body = lang === "ar" ? a.bodyAr : a.bodyEn;
  const values = lang === "ar" ? a.valuesAr : a.valuesEn;

  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]"
      >
        {title}
      </motion.span>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-6 text-2xl md:text-4xl leading-relaxed text-[var(--color-ink)]"
      >
        {body}
      </motion.p>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45, duration: 0.6 }}
        className="mt-10 flex flex-wrap gap-3"
      >
        {values.map((v) => (
          <li
            key={v}
            className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/60 px-5 py-2 text-sm font-medium text-[var(--color-orange-600)]"
          >
            {v}
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
