"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { AchievementMedia } from "@/lib/achievements";

type Props = {
  open: boolean;
  media: AchievementMedia[];
  startIndex?: number;
  title?: string;
  onClose: () => void;
};

export default function MediaLightbox({ open, media, startIndex = 0, title, onClose }: Props) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (open) setIndex(Math.min(startIndex, Math.max(0, media.length - 1)));
  }, [open, startIndex, media.length]);

  const next = useCallback(() => {
    setIndex((i) => (media.length ? (i + 1) % media.length : 0));
  }, [media.length]);

  const prev = useCallback(() => {
    setIndex((i) => (media.length ? (i - 1 + media.length) % media.length : 0));
  }, [media.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev, onClose]);

  const active = media[index];

  return (
    <AnimatePresence>
      {open && active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex flex-col"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Media viewer"}
        >
          <div className="flex items-center justify-between px-4 md:px-6 py-3 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="min-w-0 flex-1 truncate text-sm md:text-base font-medium">
              {title}
              {media.length > 1 && (
                <span className="ml-2 text-white/60 text-xs">
                  {index + 1} / {media.length}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid place-items-center size-9 rounded-full bg-white/10 hover:bg-white/20 transition text-xl"
            >
              ×
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center px-4 md:px-12 pb-4" onClick={(e) => e.stopPropagation()}>
            {media.length > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center size-10 md:size-12 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl transition"
              >
                ‹
              </button>
            )}

            <motion.div
              key={active.url + index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-full max-w-full flex items-center justify-center"
            >
              {active.type === "video" ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={active.url}
                  controls
                  autoPlay
                  className="max-h-[80vh] max-w-full rounded-lg bg-black"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={active.url}
                  alt={active.caption ?? title ?? ""}
                  className="max-h-[80vh] max-w-full object-contain rounded-lg"
                />
              )}
            </motion.div>

            {media.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 grid place-items-center size-10 md:size-12 rounded-full bg-white/10 hover:bg-white/25 text-white text-2xl transition"
              >
                ›
              </button>
            )}
          </div>

          {(active.caption || media.length > 1) && (
            <div className="px-4 md:px-6 pb-4" onClick={(e) => e.stopPropagation()}>
              {active.caption && (
                <p className="text-center text-white/80 text-sm mb-3">{active.caption}</p>
              )}
              {media.length > 1 && (
                <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
                  {media.map((m, i) => {
                    const isActive = i === index;
                    return (
                      <button
                        key={`${m.url}-${i}`}
                        type="button"
                        onClick={() => setIndex(i)}
                        aria-label={`Show media ${i + 1}`}
                        aria-pressed={isActive}
                        className={`relative shrink-0 size-14 rounded-lg overflow-hidden border-2 transition ${
                          isActive ? "border-white" : "border-white/20 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {m.type === "video" ? (
                          <span className="absolute inset-0 grid place-items-center bg-black text-white text-base">▶</span>
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={m.url} alt="" className="absolute inset-0 size-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
