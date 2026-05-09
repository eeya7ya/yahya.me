"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { dict, type Lang } from "@/lib/i18n";
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
  const viewMore = dict[lang].ui.viewMore;
  const [openId, setOpenId] = useState<number | string | null>(null);

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col items-center justify-start md:justify-center px-4 sm:px-6 md:px-16 pt-20 pb-20 md:py-24">
      <div className="w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 md:mb-12 text-center"
        >
          <span className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]">
            {subtitle}
          </span>
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
            const isOpen = openId === it.id;
            const desc = lang === "ar" ? it.descAr : it.descEn;
            return (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className={`relative grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 py-3 md:py-4 ${side ? "" : "md:[&>div:first-child]:order-2"}`}
              >
                <div className={`${lang === "ar" ? "pr-12 md:pr-6 text-right" : "pl-12 md:pl-6 text-left"} md:px-6 ${side ? "md:text-right" : "md:text-left"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : it.id)}
                    aria-expanded={isOpen}
                    className={`group w-full rounded-xl px-3 py-2 -mx-3 transition hover:bg-[var(--color-orange-500)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange-500)]/40 ${lang === "ar" ? "text-right" : "text-left"} ${side ? "md:text-right" : "md:text-left"}`}
                  >
                    <span className="text-xs md:text-sm font-semibold text-[var(--color-orange-600)]">{it.year}</span>
                    <h3 className="mt-1 text-lg md:text-xl font-semibold text-[var(--color-ink)] flex items-center gap-2 justify-between">
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

        <div className="mt-10 flex justify-center">
          <Link
            href="/roadmap"
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
