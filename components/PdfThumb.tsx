"use client";

// Renders a PDF's first page to an image client-side (via PDF.js) when no
// pre-generated thumbUrl is stored. Unlike an <iframe>, a rendered canvas
// works on mobile browsers, so PDFs display on both desktop and phones.
// Falls back to the branded placeholder while loading or on failure.

import { useEffect, useRef, useState } from "react";
import PdfCoverPlaceholder from "./PdfCoverPlaceholder";

// Cache rendered object URLs per source PDF for the session so repeat mounts
// (and revisits within a page) don't re-fetch / re-render.
const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

function renderThumb(url: string): Promise<string> {
  const cached = cache.get(url);
  if (cached) return Promise.resolve(cached);
  let p = inflight.get(url);
  if (!p) {
    p = (async () => {
      const { fetchPdfAsBlob, renderPdfFirstPageToJpeg } = await import("@/lib/pdf-thumb");
      const blob = await fetchPdfAsBlob(url);
      const jpeg = await renderPdfFirstPageToJpeg(blob, { width: 800 });
      const obj = URL.createObjectURL(jpeg);
      cache.set(url, obj);
      return obj;
    })();
    inflight.set(url, p);
    void p.finally(() => inflight.delete(url));
  }
  return p;
}

export default function PdfThumb({
  url,
  alt,
  fit = "cover",
  className = "absolute inset-0 overflow-hidden",
}: {
  url: string;
  alt?: string;
  fit?: "cover" | "contain";
  className?: string;
}) {
  const [src, setSrc] = useState<string | null>(() => cache.get(url) ?? null);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (src || failed || inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, failed, inView]);

  useEffect(() => {
    if (!inView || src || failed) return;
    let alive = true;
    renderThumb(url)
      .then((obj) => {
        if (alive) setSrc(obj);
      })
      .catch(() => {
        if (alive) setFailed(true);
      });
    return () => {
      alive = false;
    };
  }, [inView, url, src, failed]);

  return (
    <div ref={ref} className={className}>
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt ?? ""}
          className={`absolute inset-0 size-full object-${fit} ${fit === "cover" ? "transition-transform duration-700 group-hover:scale-[1.04]" : ""}`}
        />
      ) : (
        <PdfCoverPlaceholder url={url} />
      )}
    </div>
  );
}
