"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { dict, type Lang } from "@/lib/i18n";
import type { ProjectRow } from "@/lib/schema";
import type { SiteContent } from "@/lib/settings";
import { parseProjectMedia, type ProjectMedia } from "@/lib/projects";
import MediaLightbox from "@/components/MediaLightbox";

const HOME_PREVIEW_COUNT = 2;

export default function Projects({
  lang,
  content,
  items,
}: {
  lang: Lang;
  content: SiteContent;
  items: ProjectRow[];
}) {
  const p = content.projects;
  const title = lang === "ar" ? p.titleAr : p.titleEn;
  const subtitle = lang === "ar" ? p.subtitleAr : p.subtitleEn;
  const viewMore = dict[lang].ui.viewMore;
  const prefix = lang === "ar" ? "/ar" : "";
  const previewItems = items.slice(-HOME_PREVIEW_COUNT);
  const hasMore = items.length > previewItems.length;
  const [lightbox, setLightbox] = useState<{ media: ProjectMedia[]; title: string } | null>(null);

  return (
    <div className="absolute inset-0 overflow-y-auto no-scrollbar flex flex-col items-center px-4 sm:px-6 md:px-12 pt-20 md:pt-24 pb-20 md:pb-12">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8 text-center"
        >
          <span className="text-[11px] tracking-[0.3em] uppercase text-[var(--color-orange-600)] font-semibold">
            {subtitle}
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-ink)] leading-[1.2]">
            {title}
          </h2>
        </motion.div>

        {items.length === 0 ? (
          <p className="text-center text-sm text-[var(--color-ink-soft)]">
            {lang === "ar" ? "لا توجد مشاريع بعد." : "No projects yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {previewItems.map((it, i) => {
              const t = lang === "ar" ? it.titleAr : it.titleEn;
              const d = lang === "ar" ? it.descAr : it.descEn;
              const media = parseProjectMedia(it);
              const cover = media[0];
              const hasMedia = Boolean(cover);
              return (
                <motion.article
                  key={it.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  onClick={() => {
                    if (hasMedia) setLightbox({ media, title: t });
                  }}
                  role={hasMedia ? "button" : undefined}
                  tabIndex={hasMedia ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (!hasMedia) return;
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setLightbox({ media, title: t });
                    }
                  }}
                  className={`${i >= 1 ? "hidden sm:flex" : "flex"} group relative flex-col overflow-hidden rounded-2xl border border-[var(--color-orange-300)]/40 bg-white/75 backdrop-blur-sm hover:border-[var(--color-orange-500)] hover:shadow-[0_18px_50px_-20px_rgba(217,112,26,0.4)] transition ${hasMedia ? "cursor-pointer" : ""}`}
                >
                  {hasMedia && cover ? (
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
                      {it.year && (
                        <span className="absolute top-3 left-3 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-orange-600)] border border-[var(--color-orange-300)]/60">
                          {it.year}
                        </span>
                      )}
                      {it.field && (
                        <span className="absolute top-3 right-3 rounded-full bg-white/85 backdrop-blur px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--color-ink-soft)] border border-[var(--color-orange-300)]/60">
                          {it.field}
                        </span>
                      )}
                    </div>
                  ) : null}

                  <div className={`flex items-start gap-4 p-5 ${hasMedia ? "" : "md:p-6"}`}>
                    <div className="flex-1 min-w-0">
                      {!hasMedia && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {it.year && (
                            <span className="text-[11px] font-semibold tracking-wide text-[var(--color-orange-600)]">
                              {it.year}
                            </span>
                          )}
                          {it.field && (
                            <span className="text-[11px] font-medium tracking-wide text-[var(--color-ink-soft)] px-2 py-0.5 rounded-full border border-[var(--color-orange-300)]/40">
                              {it.field}
                            </span>
                          )}
                        </div>
                      )}
                      <h3 className={`${hasMedia ? "" : "mt-1"} text-base md:text-lg font-semibold text-[var(--color-ink)] leading-snug`}>
                        {t}
                      </h3>
                      {d && (
                        <p className="mt-1.5 text-[13px] md:text-sm leading-relaxed text-[var(--color-ink-soft)]">
                          {d}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="mt-6 md:mt-8 flex justify-center">
            <Link
              href={`${prefix}/projects`}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-orange-500)] hover:bg-[var(--color-orange-600)] text-white text-sm font-semibold px-5 py-2.5 shadow-md transition"
            >
              <span>{viewMore}</span>
              <span aria-hidden>{lang === "ar" ? "←" : "→"}</span>
            </Link>
          </div>
        )}
      </div>

      <MediaLightbox
        open={lightbox !== null}
        media={lightbox?.media ?? []}
        title={lightbox?.title}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
