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
  const media = a.media ?? [];

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
        className="mt-6 text-base md:text-xl leading-[1.9] text-[var(--color-ink)]"
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

      {media.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {media.map((m, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/70 overflow-hidden"
            >
              {m.type === "video" ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={m.url} controls className="w-full h-64 object-cover bg-black" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={m.url} alt={m.caption ?? ""} className="w-full h-64 object-cover" />
              )}
              {m.caption && (
                <figcaption className="px-4 py-2 text-sm text-[var(--color-ink-soft)]">{m.caption}</figcaption>
              )}
            </figure>
          ))}
        </motion.div>
      )}
    </section>
  );
}
