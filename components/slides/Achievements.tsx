"use client";

import { motion } from "framer-motion";
import type { Lang, Dict } from "@/lib/i18n";
import type { AchievementRow } from "@/lib/schema";

const ICONS: Record<string, string> = {
  trophy: "🏆",
  bolt: "⚡",
  sun: "☀",
  spark: "✦",
};

export default function Achievements({ lang, t, items }: { lang: Lang; t: Dict[Lang]; items: AchievementRow[] }) {
  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col items-center justify-start md:justify-center px-6 md:px-16 py-24">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]">
            {t.achievements.subtitle}
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--color-ink)]">{t.achievements.title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
          {items.map((it, i) => (
            <motion.article
              key={it.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group relative rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/70 backdrop-blur-sm p-6 hover:border-[var(--color-orange-500)] hover:shadow-[0_10px_40px_-15px_rgba(217,112,26,0.4)] transition"
            >
              <div className="flex items-start gap-4">
                <span className="grid place-items-center size-12 rounded-xl bg-[var(--color-orange-50)] text-2xl">
                  {ICONS[it.icon] ?? ICONS.spark}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[var(--color-orange-600)]">{it.year}</span>
                  <h3 className="mt-1 text-lg font-semibold text-[var(--color-ink)]">
                    {lang === "ar" ? it.titleAr : it.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {lang === "ar" ? it.descAr : it.descEn}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
