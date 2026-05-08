import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { roadmap, achievements } from "../lib/schema";
import { seedRoadmap, seedAchievements } from "../lib/seed-data";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");

  const db = drizzle(neon(url));

  await db.delete(roadmap);
  await db.delete(achievements);

  await db.insert(roadmap).values(seedRoadmap.map(({ id: _id, ...row }) => row));
  await db.insert(achievements).values(seedAchievements.map(({ id: _id, ...row }) => row));

  console.log(`Seeded ${seedRoadmap.length} roadmap rows and ${seedAchievements.length} achievements.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
