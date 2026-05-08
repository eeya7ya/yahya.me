"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { dict, type Lang } from "@/lib/i18n";
import type { AchievementRow } from "@/lib/schema";
import type { SiteContent } from "@/lib/settings";

const ICONS: Record<string, string> = {
  trophy: "🏆",
  bolt: "⚡",
  sun: "☀",
  spark: "✦",
};

export default function Achievements({
  lang,
  content,
  items,
}: {
  lang: Lang;
  content: SiteContent;
  items: AchievementRow[];
}) {
  const a = content.achievements;
  const title = lang === "ar" ? a.titleAr : a.titleEn;
  const subtitle = lang === "ar" ? a.subtitleAr : a.subtitleEn;
  const viewMore = dict[lang].ui.viewMore;

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col items-center justify-start md:justify-center px-6 md:px-16 py-24">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12 text-center"
        >
          <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-orange-600)] font-semibold">
            {subtitle}
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--color-ink)]">{title}</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
          {items.map((it, i) => {
            const t = lang === "ar" ? it.titleAr : it.titleEn;
            const d = lang === "ar" ? it.descAr : it.descEn;
            const hasMedia = Boolean(it.imageUrl || it.videoUrl);
            return (
              <motion.article
                key={it.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/75 backdrop-blur-sm hover:border-[var(--color-orange-500)] hover:shadow-[0_18px_50px_-20px_rgba(217,112,26,0.4)] transition"
              >
                {/* Media area */}
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
                      <span className="text-5xl md:text-6xl opacity-80">
                        {ICONS[it.icon] ?? ICONS.spark}
                      </span>
                    </div>
                  )}

                  {/* Year badge */}
                  <span className="absolute top-3 left-3 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-orange-600)] border border-[var(--color-orange-300)]/60">
                    {it.year}
                  </span>

                  {/* Icon chip when there's media too */}
                  {hasMedia && (
                    <span className="absolute top-3 right-3 grid place-items-center size-8 rounded-full bg-white/85 backdrop-blur text-base border border-[var(--color-orange-300)]/60">
                      {ICONS[it.icon] ?? ICONS.spark}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold text-[var(--color-ink)] leading-snug">
                    {t}
                  </h3>
                  {d && (
                    <p className="mt-2 text-sm md:text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                      {d}
                    </p>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white text-sm font-semibold px-5 py-2.5 shadow-md transition"
          >
            <span>{viewMore}</span>
            <span aria-hidden>{lang === "ar" ? "←" : "→"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
