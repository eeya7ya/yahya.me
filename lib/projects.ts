import type { ProjectRow } from "./schema";

export type ProjectMedia = {
  url: string;
  type: "image" | "video" | "pdf";
  caption?: string;
};

function inferTypeFromUrl(url: string): ProjectMedia["type"] {
  return /\.pdf(\?|#|$)/i.test(url) ? "pdf" : "image";
}

export function parseProjectMedia(row: ProjectRow): ProjectMedia[] {
  const items: ProjectMedia[] = [];
  if (!row.media) return items;
  try {
    const parsed = JSON.parse(row.media);
    if (!Array.isArray(parsed)) return items;
    for (const m of parsed) {
      if (!m || typeof m.url !== "string" || !m.url) continue;
      const isPdfUrl = /\.pdf(\?|#|$)/i.test(m.url);
      const type: ProjectMedia["type"] =
        isPdfUrl ? "pdf" :
        m.type === "video" ? "video" :
        m.type === "pdf" ? "pdf" :
        m.type === "image" ? "image" :
        "image";
      items.push({ url: m.url, type, caption: typeof m.caption === "string" ? m.caption : undefined });
    }
  } catch {
    // ignore
  }
  return items;
}
