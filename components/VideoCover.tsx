"use client";

// Shows a still, representative frame for a video cover instead of a black box.
// Browsers don't paint a frame for preload="metadata" until they seek, and the
// very first frame is often a black fade-in — so once the video is ready we
// seek a little way into the clip to land on actual content.

import { useRef } from "react";

export default function VideoCover({ url, className }: { url: string; className?: string }) {
  const seeked = useRef(false);

  const seekToFrame = (video: HTMLVideoElement) => {
    if (seeked.current) return;
    seeked.current = true;
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    // The first second is a dark intro on these clips, so land at least 2s in
    // (scaling to ~20% for longer videos, capped at 5s) to show real content.
    const base = Math.min(Math.max(duration * 0.2, 2), 5);
    const target = duration > 0 ? Math.min(base, duration - 0.05) : 2;
    try {
      video.currentTime = target;
    } catch {
      // ignore: some browsers reject early seeks
    }
  };

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        src={`${url}#t=2`}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => seekToFrame(e.currentTarget)}
        onLoadedData={(e) => seekToFrame(e.currentTarget)}
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
