"use client";

// Renders a PDF's first page to an image client-side (via PDF.js) when no
// pre-generated thumbUrl is stored. Unlike an <iframe>, a rendered canvas
// works on mobile browsers, so PDFs display on both desktop and phones.
// Falls back to the branded placeholder while loading or on failure.

import { useEffect, useState } from "react";
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
      const { renderPdfFirstPageFromUrl } = await import("@/lib/pdf-thumb");
      const jpeg = await renderPdfFirstPageFromUrl(url, { width: 800 });
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

  // Kick off the render immediately on mount. A PdfThumb only mounts once the
  // visitor opens a folder, so there's nothing to defer — rendering right away
  // makes the cover appear as fast as possible instead of waiting for an
  // intersection callback.
  useEffect(() => {
    if (src || failed) return;
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
  }, [url, src, failed]);

  return (
    <div className={className}>
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={alt ?? ""}
          className={`absolute inset-0 size-full object-${fit} ${fit === "cover" ? "transition-transform duration-700 group-hover:scale-[1.04]" : ""}`}
        />
      ) : (
        <>
          <PdfCoverPlaceholder url={url} />
          {!failed && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-white/40 to-transparent" />
          )}
        </>
      )}
    </div>
  );
}
