"use client";

// Shows a still first frame for a video cover instead of a black box.
// Browsers often don't paint a frame for preload="metadata" until they seek,
// so we nudge currentTime to a small offset once metadata loads (the #t=0.1
// fragment is a belt-and-suspenders hint for browsers that honor it).

import { useRef } from "react";

export default function VideoCover({ url, className }: { url: string; className?: string }) {
  const seeked = useRef(false);
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={`${url}#t=0.1`}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => {
          if (seeked.current) return;
          seeked.current = true;
          try {
            e.currentTarget.currentTime = 0.1;
          } catch {
            // ignore: some browsers reject early seeks
          }
        }}
        className={className ?? "absolute inset-0 size-full object-cover bg-black pointer-events-none"}
      />
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <span className="grid place-items-center size-12 rounded-full bg-black/45 text-white text-xl backdrop-blur-sm">
          ▶
        </span>
      </div>
    </>
  );
}
