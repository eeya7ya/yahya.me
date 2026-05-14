"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dict, type Lang } from "@/lib/i18n";

type Current = "about" | "roadmap" | "achievements" | "projects" | "contact";

export default function SiteHeader({ current, lang }: { current: Current; lang: Lang }) {
  const t = dict[lang];
  const pathname = usePathname() ?? "/";
  const prefix = lang === "ar" ? "/ar" : "";
  const homeHref = prefix || "/";

  const tabs: Array<{ key: Current; href: string; label: string }> = [
    { key: "about",        href: `${prefix}/about`,        label: t.nav.about },
    { key: "roadmap",      href: `${prefix}/roadmap`,      label: t.nav.roadmap },
    { key: "achievements", href: `${prefix}/achievements`, label: t.nav.achievements },
    { key: "projects",     href: `${prefix}/projects`,     label: t.nav.projects },
    { key: "contact",      href: `${prefix}/contact`,      label: t.nav.contact },
  ];

  const otherLang: Lang = lang === "ar" ? "en" : "ar";
  const otherHref =
    lang === "ar"
      ? pathname.replace(/^\/ar(?=\/|$)/, "") || "/"
      : pathname === "/"
        ? "/ar"
        : `/ar${pathname}`;

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-[var(--color-cream)]/70 border-b border-[var(--color-orange-300)]/30">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 md:gap-4 px-4 sm:px-6 md:px-10 py-3 md:py-4">
        <Link href={homeHref} className="text-sm md:text-base font-medium tracking-wide text-[var(--color-ink)]/80 hover:text-[var(--color-orange-600)] transition">
          {lang === "ar" ? "يحيى خالد" : "Yahya Khaled"}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href={homeHref}
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

        <Link
          href={otherHref}
          hrefLang={otherLang}
          aria-label="Toggle language"
          className="size-10 grid place-items-center rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 backdrop-blur text-sm font-semibold text-[var(--color-orange-600)] hover:bg-[var(--color-orange-50)] transition"
        >
          {t.ui.switchLang}
        </Link>
      </div>

      {/* Mobile tab strip */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-3 no-scrollbar">
        <Link href={homeHref} className="shrink-0 px-3 py-1.5 rounded-full text-xs text-[var(--color-ink-soft)]">
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
