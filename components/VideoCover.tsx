"use client";

// Shows a still poster captured from the video's first frame instead of a
// black box. Relying on the <video> element to paint a frame is unreliable
// across browsers, so we decode one frame to a canvas and use it as an image.
// The video is loaded through the same-origin /api/media-proxy so the canvas
// isn't tainted (cross-origin draws would throw on toBlob).

import { useEffect, useRef, useState } from "react";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

function capturePoster(url: string): Promise<string> {
  const cached = cache.get(url);
  if (cached) return Promise.resolve(cached);
  let p = inflight.get(url);
  if (!p) {
    p = new Promise<string>((resolve, reject) => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.src = `/api/media-proxy?url=${encodeURIComponent(url)}`;

      let settled = false;
      const cleanup = () => {
        video.removeAttribute("src");
        video.load();
      };
      const fail = (err: unknown) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanup();
        reject(err);
      };
      const grab = () => {
        if (settled) return;
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return fail(new Error("no_dimensions"));
        const targetW = Math.min(800, w);
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = Math.round((h / w) * targetW);
        const ctx = canvas.getContext("2d");
        if (!ctx) return fail(new Error("no_ctx"));
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (b) => {
              if (!b) return fail(new Error("toBlob_null"));
              const obj = URL.createObjectURL(b);
              cache.set(url, obj);
              settled = true;
              clearTimeout(timer);
              cleanup();
              resolve(obj);
            },
            "image/jpeg",
            0.82,
          );
        } catch (err) {
          fail(err);
        }
      };

      video.onloadeddata = () => {
        // Seek a little in to skip black/blank intro frames.
        const t = Math.min(0.5, (video.duration || 1) / 4);
        video.onseeked = () => {
          video.onseeked = null;
          grab();
        };
        try {
          video.currentTime = t;
        } catch {
          grab();
        }
      };
      video.onerror = () => fail(new Error("video_error"));
      const timer = setTimeout(() => fail(new Error("timeout")), 15000);
    });
    inflight.set(url, p);
    void p.finally(() => inflight.delete(url));
  }
  return p;
}

export default function VideoCover({ url }: { url: string }) {
  const [src, setSrc] = useState<string | null>(() => cache.get(url) ?? null);
  const [failed, setFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (src || inView) return;
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
  }, [src, inView]);

  useEffect(() => {
    if (!inView || src || failed) return;
    let alive = true;
    capturePoster(url)
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
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-gradient-to-br from-[var(--color-orange-100)] via-white to-[var(--color-orange-50)]">
      {src && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt=""
          className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      )}
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <span className="grid place-items-center size-12 rounded-full bg-black/45 text-white text-xl backdrop-blur-sm">
          ▶
        </span>
      </div>
      {!src && !failed && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent via-white/40 to-transparent" />
      )}
    </div>
  );
}
