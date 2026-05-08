"use client";

import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import type { SiteContent } from "@/lib/settings";

function splitParagraphs(body: string): string[] {
  return body
    .split(/(?<=[.؟!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function splitLabel(sentence: string): { label?: string; rest: string } {
  const m = sentence.match(/^(.+?)\s+[—–-]\s+(.+)$/);
  if (m && m[1].length <= 40) {
    return { label: m[1].trim(), rest: m[2].trim() };
  }
  return { rest: sentence };
}

export default function AboutFull({ content }: { content: SiteContent }) {
  const lang = useLang();
  const a = content.about;
  const title = lang === "ar" ? a.titleAr : a.titleEn;
  const body = lang === "ar" ? a.bodyAr : a.bodyEn;
  const values = lang === "ar" ? a.valuesAr : a.valuesEn;
  const media = a.media ?? [];
  const photo = content.photoUrl;

  const paragraphs = splitParagraphs(body);
  const [lead, ...rest] = paragraphs;

  return (
    <section className="max-w-5xl mx-auto px-6 md:px-10 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10"
      >
        {photo && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={photo}
            alt=""
            className="size-24 md:size-32 rounded-2xl object-cover border border-[var(--color-orange-300)]/50 shadow-sm shrink-0"
          />
        )}
        <div className="flex-1">
          <span className="text-xs tracking-[0.3em] uppercase text-[var(--color-orange-600)]">
            {lang === "ar" ? "نبذة" : "Profile"}
          </span>
          <h1 className="mt-2 text-4xl md:text-6xl font-semibold tracking-tight text-[var(--color-ink)]">
            {title}
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mt-10 md:mt-14 rounded-3xl border border-[var(--color-orange-300)]/40 bg-white/70 backdrop-blur-sm shadow-sm p-6 md:p-10"
      >
        {lead && (
          <p className="text-lg md:text-2xl leading-loose text-[var(--color-ink)] font-medium">
            {lead}
          </p>
        )}

        {rest.length > 0 && (
          <ul className="mt-8 grid gap-5 md:gap-6 sm:grid-cols-2">
            {rest.map((sentence, i) => {
              const { label, rest: text } = splitLabel(sentence);
              return (
                <li
                  key={i}
                  className="rounded-2xl bg-[var(--color-orange-50)]/60 border border-[var(--color-orange-300)]/30 p-5"
                >
                  {label && (
                    <h3 className="text-sm font-semibold text-[var(--color-orange-600)] mb-2">
                      {label}
                    </h3>
                  )}
                  <p className="text-base leading-relaxed text-[var(--color-ink-soft)]">
                    {text}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </motion.div>

      {values.length > 0 && (
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          {values.map((v) => (
            <li
              key={v}
              className="rounded-full border border-[var(--color-orange-300)]/60 bg-white/60 px-5 py-2 text-sm font-medium text-[var(--color-orange-600)]"
            >
              {v}
            </li>
          ))}
        </motion.ul>
      )}

      {media.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {media.map((m, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/70 overflow-hidden"
            >
              {m.type === "video" ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video src={m.url} controls className="w-full h-64 object-cover bg-black" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={m.url} alt={m.caption ?? ""} className="w-full h-64 object-cover" />
              )}
              {m.caption && (
                <figcaption className="px-4 py-2 text-sm text-[var(--color-ink-soft)]">{m.caption}</figcaption>
              )}
            </figure>
          ))}
        </motion.div>
      )}
    </section>
  );
}
