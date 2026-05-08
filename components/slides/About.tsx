"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { dict, type Lang } from "@/lib/i18n";
import type { SiteContent } from "@/lib/settings";

export default function About({ lang, content }: { lang: Lang; content: SiteContent }) {
  const a = content.about;
  const title = lang === "ar" ? a.titleAr : a.titleEn;
  const body = lang === "ar" ? a.bodyAr : a.bodyEn;
  const values = lang === "ar" ? a.valuesAr : a.valuesEn;
  const viewMore = dict[lang].ui.viewMore;

  return (
    <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16">
      <div className="max-w-3xl">
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
          className="mt-12 flex flex-wrap gap-3"
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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10"
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white text-sm font-semibold px-5 py-2.5 shadow-md transition"
          >
            <span>{viewMore}</span>
            <span aria-hidden>{lang === "ar" ? "←" : "→"}</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
