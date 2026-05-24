"use client";

// Persists generated media thumbnails (PDF first page, video first frame) in
// the browser's Cache Storage so they load instantly on repeat visits and
// across pages — the first render is the only slow one, per device.

const CACHE_NAME = "media-thumbs-v1";

function keyFor(url: string, kind: string): string {
  return `https://thumb.local/${kind}?u=${encodeURIComponent(url)}`;
}

export async function getCachedThumb(url: string, kind: string): Promise<string | null> {
  if (typeof caches === "undefined") return null;
  try {
    const cache = await caches.open(CACHE_NAME);
    const res = await cache.match(keyFor(url, kind));
    if (!res) return null;
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export async function putCachedThumb(url: string, kind: string, blob: Blob): Promise<void> {
  if (typeof caches === "undefined") return;
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(
      keyFor(url, kind),
      new Response(blob, { headers: { "Content-Type": blob.type || "image/jpeg" } }),
    );
  } catch {
    // best-effort; ignore quota/security errors
  }
}
