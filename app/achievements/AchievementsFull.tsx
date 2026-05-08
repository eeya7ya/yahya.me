"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import type { AchievementRow } from "@/lib/schema";
import type { SiteContent } from "@/lib/settings";

const ICONS: Record<string, string> = {
  trophy: "🏆",
  bolt: "⚡",
  sun: "☀",
  spark: "✦",
};

export default function AchievementsFull({
  content,
  items,
}: {
  content: SiteContent;
  items: AchievementRow[];
}) {
  const lang = useLang();
  const a = content.achievements;
  const title = lang === "ar" ? a.titleAr : a.titleEn;
  const subtitle = lang === "ar" ? a.subtitleAr : a.subtitleEn;

  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]">{subtitle}</span>
        <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--color-ink)]">{title}</h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
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
            {(it.imageUrl || it.videoUrl) && (
              <div className="mt-4 grid gap-3">
                {it.imageUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={it.imageUrl}
                    alt={lang === "ar" ? it.titleAr : it.titleEn}
                    className="w-full max-h-80 rounded-xl border border-[var(--color-orange-300)]/40 object-contain bg-white"
                  />
                )}
                {it.videoUrl && (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={it.videoUrl}
                    controls
                    className="w-full max-h-80 rounded-xl border border-[var(--color-orange-300)]/40 bg-black"
                  />
                )}
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
