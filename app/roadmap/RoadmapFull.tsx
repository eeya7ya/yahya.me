"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [openId, setOpenId] = useState<number | string | null>(null);

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]">{subtitle}</span>
        <h2 className="mt-2 text-4xl md:text-5xl font-bold text-[var(--color-ink)]">{title}</h2>
      </motion.div>

      <ol className="relative">
        <span className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-[var(--color-orange-300)] via-[var(--color-orange-500)]/40 to-transparent" />
        {items.map((it, i) => {
          const onLeft = i % 2 === 0;
          const side = lang === "ar" ? !onLeft : onLeft;
          const isOpen = openId === it.id;
          const desc = lang === "ar" ? it.descAr : it.descEn;
          return (
            <motion.li
              key={it.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`relative grid grid-cols-2 gap-6 py-4 ${side ? "" : "[&>div:first-child]:order-2"}`}
            >
              <div className={`px-6 ${side ? "text-right" : "text-left"}`}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : it.id)}
                  aria-expanded={isOpen}
                  className={`group w-full rounded-xl px-3 py-2 -mx-3 transition hover:bg-[var(--color-orange-500)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange-500)]/40 ${side ? "text-right" : "text-left"}`}
                >
                  <span className="text-sm font-semibold text-[var(--color-orange-600)]">{it.year}</span>
                  <h3 className="mt-1 text-xl font-semibold text-[var(--color-ink)] flex items-center gap-2 justify-between">
                    <span>{lang === "ar" ? it.titleAr : it.titleEn}</span>
                    <motion.span
                      aria-hidden
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-[var(--color-orange-500)] text-base shrink-0"
                    >
                      ▾
                    </motion.span>
                  </h3>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && desc ? (
                    <motion.div
                      key="desc"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 px-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                        {desc}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
              <div />
              <span className="absolute left-1/2 top-8 -translate-x-1/2 size-3 rounded-full bg-[var(--color-orange-500)] ring-4 ring-[var(--color-cream)]" />
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
