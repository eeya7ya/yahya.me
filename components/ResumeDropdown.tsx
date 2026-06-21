"use client";

// Dropdown of downloadable résumés, used on the home (Hero) and About slides.
// The list and its order come from `lib/resumes` — protection first, then
// networking, then ELV & home automation.

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { dict, type Lang } from "@/lib/i18n";
import { resumeLabel, type Resume } from "@/lib/resumes";

type Props = {
  lang: Lang;
  /** Résumés to list — only those with an uploaded file are shown. */
  resumes: Resume[];
  /** Visual weight of the trigger button. */
  variant?: "solid" | "outline";
  /** Which edge the menu aligns to. Defaults to the reading-start edge. */
  align?: "start" | "end";
  className?: string;
};

export default function ResumeDropdown({ lang, resumes, variant = "solid", align, className = "" }: Props) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isRtl = lang === "ar";
  const label = dict[lang].ui.downloadResume;
  const menuAlign = align ?? (isRtl ? "end" : "start");

  // Only show résumés that actually have a downloadable file.
  const available = resumes.filter((r) => r.url && r.url.trim().length > 0);
  if (available.length === 0) return null;

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const solid = variant === "solid";
  const triggerClasses = solid
    ? "bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white"
    : "border border-[var(--color-orange-300)]/60 bg-white/60 backdrop-blur text-[var(--color-orange-600)] hover:bg-[var(--color-orange-50)]";

  return (
    <div ref={ref} className={`relative inline-block ${className}`} dir={isRtl ? "rtl" : "ltr"}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-orange-600)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-cream)] ${triggerClasses}`}
      >
        {/* download glyph */}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
        >
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        <span>{label}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="leading-none"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute z-30 mt-2 min-w-[15rem] overflow-hidden rounded-2xl border border-[var(--color-orange-300)]/60 bg-white/95 backdrop-blur shadow-[0_24px_50px_-24px_rgba(217,112,26,0.45)] ${
              menuAlign === "end" ? "end-0" : "start-0"
            }`}
          >
            {available.map((r, i) => (
              <li key={`${r.url}-${i}`} role="none">
                <a
                  role="menuitem"
                  href={r.url}
                  download
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between gap-3 px-4 py-3 text-sm text-[var(--color-ink)] transition-colors hover:bg-[var(--color-orange-50)] hover:text-[var(--color-orange-600)] ${
                    i !== 0 ? "border-t border-[var(--color-orange-300)]/30" : ""
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      aria-hidden
                      className="grid size-6 place-items-center rounded-full bg-[var(--color-orange-50)] text-[11px] font-bold text-[var(--color-orange-600)]"
                    >
                      {i + 1}
                    </span>
                    <span className="font-medium">{resumeLabel(r, lang)}</span>
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-4 shrink-0 text-[var(--color-orange-500)]"
                  >
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
