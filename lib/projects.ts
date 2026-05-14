import type { ProjectRow } from "./schema";

export type ProjectMedia = {
  url: string;
  type: "image" | "video";
  caption?: string;
};

export function parseProjectMedia(row: ProjectRow): ProjectMedia[] {
  const items: ProjectMedia[] = [];
  if (!row.media) return items;
  try {
    const parsed = JSON.parse(row.media);
    if (!Array.isArray(parsed)) return items;
    for (const m of parsed) {
      if (!m || typeof m.url !== "string" || !m.url) continue;
      const type = m.type === "video" ? "video" : "image";
      items.push({ url: m.url, type, caption: typeof m.caption === "string" ? m.caption : undefined });
    }
  } catch {
    // ignore
  }
  return items;
}
