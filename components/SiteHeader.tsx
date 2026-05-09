"use client";

import Link from "next/link";
import { dict } from "@/lib/i18n";
import { useLangCtx } from "./LangProvider";

type Current = "about" | "roadmap" | "achievements" | "contact";

export default function SiteHeader({ current }: { current: Current }) {
  const { lang, setLang } = useLangCtx();
  const t = dict[lang];
  const tabs: Array<{ key: Current; href: string; label: string }> = [
    { key: "about",        href: "/about",        label: t.nav.about },
    { key: "roadmap",      href: "/roadmap",      label: t.nav.roadmap },
    { key: "achievements", href: "/achievements", label: t.nav.achievements },
    { key: "contact",      href: "/contact",      label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[var(--color-cream)]/70 border-b border-[var(--color-orange-300)]/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 md:gap-4 px-4 sm:px-6 md:px-10 py-3 md:py-4">
        <Link href="/" className="text-sm md:text-base font-medium tracking-wide text-[var(--color-ink)]/80 hover:text-[var(--color-orange-600)] transition">
          {lang === "ar" ? "يحيى خالد" : "Yahya Khaled"}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-orange-600)] transition"
          >
            {t.nav.home}
          </Link>
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                tab.key === current
                  ? "bg-[var(--color-orange-50)] text-[var(--color-orange-600)] border border-[var(--color-orange-300)]/60"
                  : "text-[var(--color-ink-soft)] hover:text-[var(--color-orange-600)]"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          aria-label="Toggle language"
          className="size-10 rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 backdrop-blur text-sm font-semibold text-[var(--color-orange-600)] hover:bg-[var(--color-orange-50)] transition"
        >
          {t.ui.switchLang}
        </button>
      </div>

      {/* Mobile tab strip */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3 no-scrollbar">
        <Link href="/" className="shrink-0 px-3 py-1.5 rounded-full text-xs text-[var(--color-ink-soft)]">
          {t.nav.home}
        </Link>
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={tab.href}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs transition ${
              tab.key === current
                ? "bg-[var(--color-orange-50)] text-[var(--color-orange-600)] border border-[var(--color-orange-300)]/60"
                : "text-[var(--color-ink-soft)]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
