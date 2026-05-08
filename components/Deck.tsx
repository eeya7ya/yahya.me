"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { dict, type Lang } from "@/lib/i18n";
import Hero from "./slides/Hero";
import About from "./slides/About";
import Roadmap from "./slides/Roadmap";
import Achievements from "./slides/Achievements";
import Contact from "./slides/Contact";
import type { RoadmapRow, AchievementRow } from "@/lib/schema";

type Props = {
  photoUrl: string;
  roadmap: RoadmapRow[];
  achievements: AchievementRow[];
};

const WHEEL_LOCK_MS = 700;
const TOUCH_THRESHOLD = 50;

export default function Deck({ photoUrl, roadmap, achievements }: Props) {
  const [lang, setLang] = useState<Lang>("ar");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const lockRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const t = dict[lang];

  const slides: ReactNode[] = [
    <Hero key="hero" lang={lang} t={t} photoUrl={photoUrl} onNext={() => go(1)} />,
    <About key="about" lang={lang} t={t} />,
    <Roadmap key="roadmap" lang={lang} t={t} items={roadmap} />,
    <Achievements key="ach" lang={lang} t={t} items={achievements} />,
    <Contact key="contact" lang={lang} t={t} />,
  ];

  const go = useCallback(
    (delta: number) => {
      if (lockRef.current) return;
      setIndex((prev) => {
        const next = Math.min(slides.length - 1, Math.max(0, prev + delta));
        if (next === prev) return prev;
        setDirection(delta);
        lockRef.current = true;
        setTimeout(() => (lockRef.current = false), WHEEL_LOCK_MS);
        return next;
      });
    },
    [slides.length],
  );

  // keep <html dir> + lang in sync
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // wheel + keyboard navigation
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return;
      e.preventDefault();
      go(e.deltaY > 0 ? 1 : -1);
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(e.key)) { e.preventDefault(); go(1); }
      else if (["ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(-1); }
      else if (e.key === "Home") { e.preventDefault(); setIndex(0); }
      else if (e.key === "End") { e.preventDefault(); setIndex(slides.length - 1); }
    };
    const onTouchStart = (e: TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > TOUCH_THRESHOLD) go(dy > 0 ? 1 : -1);
      touchStartY.current = null;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [go, slides.length]);

  const navLabels = [t.nav.home, t.nav.about, t.nav.roadmap, t.nav.achievements, t.nav.contact];

  return (
    <main className="fixed inset-0 overflow-hidden">
      {/* Top bar */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-10 py-5">
        <button
          onClick={() => setIndex(0)}
          className="text-sm md:text-base font-medium tracking-wide text-[var(--color-ink)]/80 hover:text-[var(--color-orange-600)] transition"
        >
          {lang === "ar" ? "يحيى خالد" : "Yahya Khaled"}
        </button>
        <button
          onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          aria-label="Toggle language"
          className="size-10 rounded-full border border-[var(--color-orange-300)]/60 bg-white/70 backdrop-blur text-sm font-semibold text-[var(--color-orange-600)] hover:bg-[var(--color-orange-50)] transition"
        >
          {t.ui.switchLang}
        </button>
      </header>

      {/* Slide */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={index}
          custom={direction}
          initial={{ y: direction > 0 ? "8%" : "-8%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction > 0 ? "-8%" : "8%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {slides[index]}
        </motion.section>
      </AnimatePresence>

      {/* Side rail (page indicators) */}
      <nav
        className={`absolute top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 ${lang === "ar" ? "left-5 md:left-8" : "right-5 md:right-8"}`}
        aria-label="Slide navigation"
      >
        {navLabels.map((label, i) => (
          <button
            key={label}
            onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
            aria-label={label}
            className="group flex items-center gap-3"
          >
            <span
              className={`block h-px transition-all duration-300 ${
                i === index ? "w-10 bg-[var(--color-orange-500)]" : "w-5 bg-[var(--color-ink)]/30 group-hover:bg-[var(--color-orange-300)]"
              }`}
            />
            <span
              className={`text-[11px] tracking-wider uppercase transition-opacity ${
                i === index ? "opacity-100 text-[var(--color-orange-600)]" : "opacity-0 group-hover:opacity-60"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </nav>
    </main>
  );
}
