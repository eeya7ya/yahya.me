"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/LangProvider";
import type { ProjectRow } from "@/lib/schema";
import type { SiteContent } from "@/lib/settings";
import { parseProjectMedia, type ProjectMedia } from "@/lib/projects";
import MediaLightbox from "@/components/MediaLightbox";

export default function ProjectsFull({
  content,
  items,
}: {
  content: SiteContent;
  items: ProjectRow[];
}) {
  const lang = useLang();
  const p = content.projects;
  const title = lang === "ar" ? p.titleAr : p.titleEn;
  const subtitle = lang === "ar" ? p.subtitleAr : p.subtitleEn;
  const [expandedFields, setExpandedFields] = useState<Set<string>>(new Set(items.map(p => p.field).filter(Boolean)));

  const groupedByField = items.reduce<Record<string, ProjectRow[]>>((acc, row) => {
    const field = row.field || "General";
    if (!acc[field]) acc[field] = [];
    acc[field].push(row);
    return acc;
  }, {});

  const sortedFields = Object.keys(groupedByField).sort((a, b) => {
    if (a === "General") return 1;
    if (b === "General") return -1;
    return a.localeCompare(b);
  });

  const toggleField = (field: string) => {
    setExpandedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) next.delete(field);
      else next.add(field);
      return next;
    });
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 md:mb-12 text-center"
      >
        <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-orange-600)] font-semibold">{subtitle}</span>
        <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-ink)] leading-[1.2]">{title}</h2>
      </motion.div>

      {items.length === 0 ? (
        <p className="text-center text-sm text-[var(--color-ink-soft)]">
          {lang === "ar" ? "لا توجد مشاريع بعد." : "No projects yet."}
        </p>
      ) : (
        <div className="space-y-4">
          {sortedFields.map((field) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border border-[var(--color-orange-300)]/40 overflow-hidden bg-white/50 backdrop-blur-sm"
            >
              <button
                onClick={() => toggleField(field)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--color-orange-50)] transition"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-ink)]">{field}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--color-ink-soft)]">{groupedByField[field].length} {lang === "ar" ? "مشروع" : "project"}{groupedByField[field].length !== 1 ? (lang === "ar" ? "ات" : "s") : ""}</span>
                  <span className="text-[var(--color-orange-500)] transition-transform" style={{ transform: expandedFields.has(field) ? "rotate(180deg)" : "rotate(0deg)" }}>
                    ▼
                  </span>
                </div>
              </button>
              {expandedFields.has(field) && (
                <div className="px-4 sm:px-6 pb-5 border-t border-[var(--color-orange-300)]/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 pt-5">
                    {groupedByField[field].map((it, i) => (
                      <ProjectCard key={it.id} row={it} index={i} lang={lang} />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function ProjectCard({
  row,
  index,
  lang,
}: {
  row: ProjectRow;
  index: number;
  lang: "ar" | "en";
}) {
  const t = lang === "ar" ? row.titleAr : row.titleEn;
  const d = lang === "ar" ? row.descAr : row.descEn;
  const media = parseProjectMedia(row);
  const cover: ProjectMedia | undefined = media[0];
  const hasMedia = Boolean(cover);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStart, setLightboxStart] = useState(0);

  const openAt = (i: number) => {
    setLightboxStart(i);
    setLightboxOpen(true);
  };

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        onClick={() => {
          if (hasMedia) openAt(0);
        }}
        role={hasMedia ? "button" : undefined}
        tabIndex={hasMedia ? 0 : undefined}
        onKeyDown={(e) => {
          if (!hasMedia) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openAt(0);
          }
        }}
        className={`group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-orange-300)]/40 bg-white/75 backdrop-blur-sm hover:border-[var(--color-orange-500)] hover:shadow-[0_24px_60px_-25px_rgba(217,112,26,0.45)] transition ${hasMedia ? "cursor-pointer" : ""}`}
      >
        {hasMedia && cover && (
          <div className="relative w-full aspect-[16/9] bg-gradient-to-br from-[var(--color-orange-50)] via-white to-[var(--color-orange-100)]/60 overflow-hidden">
            {cover.type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={cover.url}
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 size-full object-cover bg-black pointer-events-none"
              />
            ) : cover.type === "pdf" ? (
              <div className="absolute inset-0 bg-white">
                <iframe
                  src={`${cover.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  title={t}
                  className="size-full pointer-events-none"
                />
                <span className="absolute top-3 right-3 rounded-full bg-[var(--color-orange-500)] text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 shadow">PDF</span>
              </div>
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cover.url}
                alt={t}
                loading="lazy"
                className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            )}
            {media.length > 1 && (
              <span className="absolute bottom-3 right-3 rounded-full bg-black/55 text-white text-[11px] px-2 py-0.5 backdrop-blur-sm">
                +{media.length - 1}
              </span>
            )}
            {row.year && (
              <span className="absolute top-3 left-3 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-orange-600)] border border-[var(--color-orange-300)]/60">
                {row.year}
              </span>
            )}
            {row.field && (
              <span className="absolute top-3 right-3 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-ink-soft)] border border-[var(--color-orange-300)]/60">
                {row.field}
              </span>
            )}
          </div>
        )}

        {media.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-4 pt-3">
            {media.map((m, idx) => (
              <button
                key={`${m.url}-${idx}`}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openAt(idx);
                }}
                aria-label={`Open media ${idx + 1}`}
                className="relative shrink-0 size-14 rounded-lg overflow-hidden border border-[var(--color-orange-300)]/50 opacity-80 hover:opacity-100 hover:border-[var(--color-orange-500)] transition"
              >
                {m.type === "video" ? (
                  <span className="absolute inset-0 grid place-items-center bg-black text-white text-base">▶</span>
                ) : m.type === "pdf" ? (
                  <span className="absolute inset-0 grid place-items-center bg-[var(--color-orange-50)] text-[var(--color-orange-700)] text-base">📄</span>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={m.url} alt="" className="absolute inset-0 size-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-start gap-3 md:gap-4 p-4 sm:p-5 md:p-7">
          <div className="flex-1 min-w-0">
            {!hasMedia && (
              <div className="flex items-center gap-2 flex-wrap">
                {row.year && (
                  <span className="text-[11px] font-semibold tracking-wide text-[var(--color-orange-600)]">
                    {row.year}
                  </span>
                )}
                {row.field && (
                  <span className="text-[11px] font-medium tracking-wide text-[var(--color-ink-soft)] px-2 py-0.5 rounded-full border border-[var(--color-orange-300)]/40">
                    {row.field}
                  </span>
                )}
              </div>
            )}
            <h3 className={`${hasMedia ? "" : "mt-1"} text-lg sm:text-xl md:text-2xl font-semibold text-[var(--color-ink)] leading-snug`}>
              {t}
            </h3>
            {d && (
              <p className="mt-1.5 md:mt-2 text-sm md:text-[15px] leading-relaxed text-[var(--color-ink-soft)]">
                {d}
              </p>
            )}
          </div>
        </div>
      </motion.article>

      <MediaLightbox
        open={lightboxOpen}
        media={media}
        startIndex={lightboxStart}
        title={t}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}
