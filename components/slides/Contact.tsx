"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { dict, type Lang, type Dict } from "@/lib/i18n";
import type { SiteContent } from "@/lib/settings";

export default function Contact({
  lang,
  t,
  content,
}: {
  lang: Lang;
  t: Dict[Lang];
  content: SiteContent;
}) {
  const c = content.contact;
  const title = lang === "ar" ? c.titleAr : c.titleEn;
  const subtitle = lang === "ar" ? c.subtitleAr : c.subtitleEn;
  const viewMore = dict[lang].ui.viewMore;
  const prefix = lang === "ar" ? "/ar" : "";

  const links = [
    { key: "email" as const,    href: c.email.startsWith("mailto:") ? c.email : `mailto:${c.email}`, icon: "✉" },
    { key: "website" as const,  href: c.website,  icon: "↗" },
    { key: "github" as const,   href: c.github,   icon: "◐" },
    { key: "linkedin" as const, href: c.linkedin, icon: "in" },
  ].filter((l) => l.href && l.href.trim() !== "");

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 sm:px-8 md:px-16 pb-20 md:pb-0 text-center">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[11px] md:text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]"
      >
        {subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-3 text-4xl sm:text-5xl md:text-7xl font-bold text-[var(--color-ink)]"
      >
        {title}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 md:mt-12 flex flex-wrap items-center justify-center gap-2.5 md:gap-4"
      >
        {links.map((l) => (
          <a
            key={l.key}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="group inline-flex items-center gap-2.5 md:gap-3 rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 backdrop-blur px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base font-medium text-[var(--color-ink)] hover:border-[var(--color-orange-500)] hover:text-[var(--color-orange-600)] transition"
          >
            <span className="grid place-items-center size-6 rounded-full bg-[var(--color-orange-50)] text-[var(--color-orange-600)] text-xs">
              {l.icon}
            </span>
            <span>{t.contact[l.key]}</span>
          </a>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mt-8"
      >
        <Link
          href={`${prefix}/contact`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-orange-300)]/60 bg-white/60 backdrop-blur text-[var(--color-orange-600)] text-sm font-semibold px-5 py-2.5 hover:bg-[var(--color-orange-50)] transition"
        >
          <span>{viewMore}</span>
          <span aria-hidden>{lang === "ar" ? "←" : "→"}</span>
        </Link>
      </motion.div>
    </div>
  );
}
