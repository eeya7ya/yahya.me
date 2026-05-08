"use client";

import { motion } from "framer-motion";
import type { Lang, Dict } from "@/lib/i18n";

export default function About({ t }: { lang: Lang; t: Dict[Lang] }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-8 md:px-16">
      <div className="max-w-3xl">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]"
        >
          {t.about.title}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-6 text-2xl md:text-4xl leading-relaxed text-[var(--color-ink)]"
        >
          {t.about.body}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-12 flex flex-wrap gap-3"
        >
          {t.about.values.map((v) => (
            <li
              key={v}
              className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/60 px-5 py-2 text-sm font-medium text-[var(--color-orange-600)]"
            >
              {v}
            </li>
          ))}
        </motion.ul>
      </div>
    </div>
  );
}
