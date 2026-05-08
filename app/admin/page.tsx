import { asc } from "drizzle-orm";
import { ensureSchema, getDb } from "@/lib/db";
import { roadmap, achievements } from "@/lib/schema";
import { loadContent } from "@/lib/settings";
import { seedRoadmap, seedAchievements } from "@/lib/seed-data";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const content = await loadContent();
  const db = getDb();
  let roadmapRows = seedRoadmap;
  let achievementRows = seedAchievements;
  let dbConnected = false;
  if (db) {
    try {
      await ensureSchema();
      const [r, a] = await Promise.all([
        db.select().from(roadmap).orderBy(asc(roadmap.sortOrder)),
        db.select().from(achievements).orderBy(asc(achievements.sortOrder)),
      ]);
      if (r.length) roadmapRows = r;
      if (a.length) achievementRows = a;
      dbConnected = true;
    } catch (err) {
      console.error("admin: db init failed", err);
      dbConnected = false;
    }
  }

  return (
    <AdminPanel
      content={content}
      roadmap={roadmapRows}
      achievements={achievementRows}
      dbConnected={dbConnected}
    />
  );
}
