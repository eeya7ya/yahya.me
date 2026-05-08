import type { AchievementRow } from "./schema";

export type AchievementMedia = {
  url: string;
  type: "image" | "video";
  caption?: string;
};

export function parseAchievementMedia(row: AchievementRow): AchievementMedia[] {
  const items: AchievementMedia[] = [];
  if (row.media) {
    try {
      const parsed = JSON.parse(row.media);
      if (Array.isArray(parsed)) {
        for (const m of parsed) {
          if (!m || typeof m.url !== "string" || !m.url) continue;
          const type = m.type === "video" ? "video" : "image";
          items.push({ url: m.url, type, caption: typeof m.caption === "string" ? m.caption : undefined });
        }
      }
    } catch {
      // fall through to legacy fields
    }
  }
  if (items.length === 0) {
    if (row.videoUrl) items.push({ url: row.videoUrl, type: "video" });
    if (row.imageUrl) items.push({ url: row.imageUrl, type: "image" });
  }
  return items;
}
