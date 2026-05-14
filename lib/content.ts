import { asc } from "drizzle-orm";
import { getDb } from "./db";
import { roadmap, achievements, projects, type RoadmapRow, type AchievementRow, type ProjectRow } from "./schema";
import { seedRoadmap, seedAchievements, seedProjects } from "./seed-data";

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

export async function loadProjects(): Promise<ProjectRow[]> {
  const db = getDb();
  if (!db) return seedProjects;
  try {
    const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
    return rows;
  } catch {
    return seedProjects;
  }
}
