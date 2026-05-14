import { asc } from "drizzle-orm";
import { ensureSchema, getDb } from "@/lib/db";
import { roadmap, achievements, projects } from "@/lib/schema";
import { loadContent } from "@/lib/settings";
import { seedRoadmap, seedAchievements, seedProjects } from "@/lib/seed-data";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const content = await loadContent();
  const db = getDb();
  let roadmapRows = seedRoadmap;
  let achievementRows = seedAchievements;
  let projectRows = seedProjects;
  let dbConnected = false;
  if (db) {
    try {
      await ensureSchema();
      let [r, a, p] = await Promise.all([
        db.select().from(roadmap).orderBy(asc(roadmap.sortOrder)),
        db.select().from(achievements).orderBy(asc(achievements.sortOrder)),
        db.select().from(projects).orderBy(asc(projects.sortOrder)),
      ]);
      // First-run auto-seed so the editor shows real DB rows (with real IDs)
      // instead of hardcoded seed data the API can't update.
      if (r.length === 0) {
        await db.insert(roadmap).values(seedRoadmap.map(({ id: _id, ...row }) => row));
        r = await db.select().from(roadmap).orderBy(asc(roadmap.sortOrder));
      }
      if (a.length === 0) {
        await db.insert(achievements).values(seedAchievements.map(({ id: _id, ...row }) => row));
        a = await db.select().from(achievements).orderBy(asc(achievements.sortOrder));
      }
      roadmapRows = r;
      achievementRows = a;
      projectRows = p;
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
      projects={projectRows}
      dbConnected={dbConnected}
    />
  );
}
