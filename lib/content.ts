import { asc } from "drizzle-orm";
import { getDb } from "./db";
import { roadmap, achievements, type RoadmapRow, type AchievementRow } from "./schema";
import { seedRoadmap, seedAchievements } from "./seed-data";

export async function loadRoadmap(): Promise<RoadmapRow[]> {
  const db = getDb();
  if (!db) return seedRoadmap;
  try {
    const rows = await db.select().from(roadmap).orderBy(asc(roadmap.sortOrder));
    return rows.length ? rows : seedRoadmap;
  } catch {
    return seedRoadmap;
  }
}

export async function loadAchievements(): Promise<AchievementRow[]> {
  const db = getDb();
  if (!db) return seedAchievements;
  try {
    const rows = await db.select().from(achievements).orderBy(asc(achievements.sortOrder));
    return rows.length ? rows : seedAchievements;
  } catch {
    return seedAchievements;
  }
}
