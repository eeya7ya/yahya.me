"use client";

import { motion } from "framer-motion";
import type { Lang } from "@/lib/i18n";
import type { RoadmapRow } from "@/lib/schema";
import type { SiteContent } from "@/lib/settings";

export default function Roadmap({
  lang,
  content,
  items,
}: {
  lang: Lang;
  content: SiteContent;
  items: RoadmapRow[];
}) {
  const r = content.roadmap;
  const title = lang === "ar" ? r.titleAr : r.titleEn;
  const subtitle = lang === "ar" ? r.subtitleAr : r.subtitleEn;

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col items-center justify-start md:justify-center px-6 md:px-16 py-24">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]">
            {subtitle}
          </span>
          <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--color-ink)]">{title}</h2>
        </motion.div>

        <ol className="relative">
          <span className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-[var(--color-orange-300)] via-[var(--color-orange-500)]/40 to-transparent" />
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
                className={`relative grid grid-cols-2 gap-6 py-6 ${side ? "" : "[&>div:first-child]:order-2"}`}
              >
                <div className={`px-6 ${side ? "text-right" : "text-left"}`}>
                  <span className="text-sm font-semibold text-[var(--color-orange-600)]">{it.year}</span>
                  <h3 className="mt-1 text-xl font-semibold text-[var(--color-ink)]">
                    {lang === "ar" ? it.titleAr : it.titleEn}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                    {lang === "ar" ? it.descAr : it.descEn}
                  </p>
                </div>
                <div />
                <span className="absolute left-1/2 top-8 -translate-x-1/2 size-3 rounded-full bg-[var(--color-orange-500)] ring-4 ring-[var(--color-cream)]" />
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
