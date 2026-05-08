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
        <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-orange-600)] font-semibold">{subtitle}</span>
        <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--color-ink)]">{title}</h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {items.map((it, i) => {
          const t = lang === "ar" ? it.titleAr : it.titleEn;
          const d = lang === "ar" ? it.descAr : it.descEn;
          const hasMedia = Boolean(it.imageUrl || it.videoUrl);
          return (
            <motion.article
              key={it.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-orange-300)]/40 bg-white/75 backdrop-blur-sm hover:border-[var(--color-orange-500)] hover:shadow-[0_24px_60px_-25px_rgba(217,112,26,0.45)] transition"
            >
              <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-[var(--color-orange-50)] via-white to-[var(--color-orange-100)]/60 overflow-hidden">
                {it.videoUrl ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
                    src={it.videoUrl}
                    controls
                    poster={it.imageUrl || undefined}
                    className="absolute inset-0 size-full object-cover bg-black"
                  />
                ) : it.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={it.imageUrl}
                    alt={t}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-6xl opacity-80">{ICONS[it.icon] ?? ICONS.spark}</span>
                  </div>
                )}

                <span className="absolute top-3 left-3 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-orange-600)] border border-[var(--color-orange-300)]/60">
                  {it.year}
                </span>
                {hasMedia && (
                  <span className="absolute top-3 right-3 grid place-items-center size-8 rounded-full bg-white/85 backdrop-blur text-base border border-[var(--color-orange-300)]/60">
                    {ICONS[it.icon] ?? ICONS.spark}
                  </span>
                )}
              </div>

              <div className="flex-1 p-6 md:p-7">
                <h3 className="text-xl md:text-2xl font-semibold text-[var(--color-ink)] leading-snug">
                  {t}
                </h3>
                {d && (
                  <p className="mt-3 text-[15px] md:text-base leading-relaxed text-[var(--color-ink-soft)]">
                    {d}
                  </p>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
