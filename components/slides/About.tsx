"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { dict, type Lang } from "@/lib/i18n";
import type { SiteContent } from "@/lib/settings";

export default function About({ lang, content }: { lang: Lang; content: SiteContent }) {
  const a = content.about;
  const isRtl = lang === "ar";
  const title = isRtl ? a.titleAr : a.titleEn;
  const body = isRtl ? a.bodyAr : a.bodyEn;
  const values = isRtl ? a.valuesAr : a.valuesEn;
  const viewMore = dict[lang].ui.viewMore;
  const prefix = lang === "ar" ? "/ar" : "";
  const media = (a.media ?? []).slice(0, 1);

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex items-start md:items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20 pt-24 pb-24 md:py-24">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 lg:gap-14 items-center">
        {/* Text column */}
        <div className={`lg:col-span-7 ${isRtl ? "lg:order-2" : ""}`}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <span aria-hidden className="h-px w-10 bg-[var(--color-orange-500)]/70" />
            <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-orange-600)] font-semibold">
              {title}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-4 md:mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.15] text-[var(--color-ink)]"
          >
            {isRtl ? "قصة قصيرة عنّي." : "A short story about me."}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-4 md:mt-6 max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl leading-[1.75] md:leading-[1.85] text-[var(--color-ink-soft)]"
          >
            {body}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-5 md:mt-8 flex flex-wrap gap-2 md:gap-2.5"
          >
            {values.map((v) => (
              <li
                key={v}
                className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 backdrop-blur-sm px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-medium text-[var(--color-orange-600)]"
              >
                {v}
              </li>
            ))}
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="mt-8"
          >
            <Link
              href={`${prefix}/about`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white text-sm font-semibold px-5 py-2.5 shadow-md transition"
            >
              <span>{viewMore}</span>
              <span aria-hidden>{isRtl ? "←" : "→"}</span>
            </Link>
          </motion.div>
        </div>

        {/* Media column — optional preview, falls back to a decorative card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={`lg:col-span-5 ${isRtl ? "lg:order-1" : ""}`}
        >
          {media[0] ? (
            <figure className="relative rounded-3xl overflow-hidden border border-[var(--color-orange-300)]/50 bg-white/60 shadow-[0_30px_60px_-30px_rgba(217,112,26,0.35)]">
              {media[0].type === "video" ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={media[0].url} controls className="w-full aspect-[3/4] md:aspect-[4/5] object-cover object-top md:object-center bg-black" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={media[0].url} alt={media[0].caption ?? ""} className="w-full aspect-[3/4] md:aspect-[4/5] object-cover object-top md:object-center" />
              )}
              {media[0].caption && (
                <figcaption className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent text-sm text-white">
                  {media[0].caption}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="relative aspect-[16/10] md:aspect-[4/5] rounded-3xl border border-[var(--color-orange-300)]/40 bg-gradient-to-br from-[var(--color-orange-50)] via-white/60 to-[var(--color-orange-100)]/60 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center px-6">
                  <span className="block text-[11px] tracking-[0.3em] uppercase text-[var(--color-orange-600)] font-semibold">
                    {isRtl ? "ملخص سريع" : "At a glance"}
                  </span>
                  <span className="mt-3 block text-4xl md:text-5xl font-bold text-[var(--color-ink)]">
                    {isRtl ? "هندسة · ذكاء · أثر" : "Engineer · AI · Impact"}
                  </span>
                </div>
              </div>
              <span aria-hidden className="absolute -top-10 -right-10 size-40 rounded-full bg-[var(--color-orange-300)]/30 blur-3xl" />
              <span aria-hidden className="absolute -bottom-10 -left-10 size-40 rounded-full bg-[var(--color-orange-500)]/20 blur-3xl" />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
