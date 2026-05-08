"use client";

import { motion } from "framer-motion";
import type { Lang, Dict } from "@/lib/i18n";

const LINKS = [
  { key: "email", href: "mailto:contact@yahya.me", icon: "✉" },
  { key: "github", href: "https://github.com/eeya7ya", icon: "◐" },
  { key: "linkedin", href: "https://linkedin.com/in/yahya-khaled", icon: "in" },
] as const;

export default function Contact({ t }: { lang: Lang; t: Dict[Lang] }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8 md:px-16 text-center">
      <motion.span
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]"
      >
        {t.contact.subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-3 text-5xl md:text-7xl font-bold text-[var(--color-ink)]"
      >
        {t.contact.title}
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-12 flex flex-wrap items-center justify-center gap-3 md:gap-4"
      >
        {LINKS.map((l) => (
          <a
            key={l.key}
            href={l.href}
            target={l.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 backdrop-blur px-6 py-3 text-sm md:text-base font-medium text-[var(--color-ink)] hover:border-[var(--color-orange-500)] hover:text-[var(--color-orange-600)] transition"
          >
            <span className="grid place-items-center size-6 rounded-full bg-[var(--color-orange-50)] text-[var(--color-orange-600)] text-xs">
              {l.icon}
            </span>
            <span>{t.contact[l.key]}</span>
          </a>
        ))}
      </motion.div>
    </div>
  );
}
