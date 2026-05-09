"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import type { RoadmapRow } from "@/lib/schema";
import type { SiteContent } from "@/lib/settings";

export default function RoadmapFull({
  content,
  items,
}: {
  content: SiteContent;
  items: RoadmapRow[];
}) {
  const lang = useLang();
  const r = content.roadmap;
  const title = lang === "ar" ? r.titleAr : r.titleEn;
  const subtitle = lang === "ar" ? r.subtitleAr : r.subtitleEn;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 text-center"
      >
        <span className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]">{subtitle}</span>
        <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-ink)]">{title}</h2>
      </motion.div>

      <ol className="relative">
        <span
          aria-hidden
          className={`absolute top-0 bottom-0 ${
            lang === "ar"
              ? "right-4 md:right-auto md:left-1/2"
              : "left-4 md:left-1/2"
          } md:-translate-x-1/2 w-px bg-gradient-to-b from-[var(--color-orange-300)] via-[var(--color-orange-500)]/40 to-transparent`}
        />
        {items.map((it, i) => {
          const onLeft = i % 2 === 0;
          const side = lang === "ar" ? !onLeft : onLeft;
          return (
            <motion.li
              key={it.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 py-4 md:py-6 ${side ? "" : "md:[&>div:first-child]:order-2"}`}
            >
              <div className={`${lang === "ar" ? "pr-12 md:pr-6 text-right" : "pl-12 md:pl-6 text-left"} md:px-6 ${side ? "md:text-right" : "md:text-left"}`}>
                <span className="text-xs md:text-sm font-semibold text-[var(--color-orange-600)]">{it.year}</span>
                <h3 className="mt-1 text-lg md:text-xl font-semibold text-[var(--color-ink)]">
                  {lang === "ar" ? it.titleAr : it.titleEn}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                  {lang === "ar" ? it.descAr : it.descEn}
                </p>
              </div>
              <div className="hidden md:block" />
              <span
                aria-hidden
                className={`absolute ${
                  lang === "ar"
                    ? "right-4 translate-x-1/2 md:right-auto md:left-1/2 md:-translate-x-1/2"
                    : "left-4 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2"
                } top-7 md:top-8 size-3 rounded-full bg-[var(--color-orange-500)] ring-4 ring-[var(--color-cream)]`}
              />
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
