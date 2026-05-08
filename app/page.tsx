import Deck from "@/components/Deck";
import { loadAchievements, loadRoadmap } from "@/lib/content";
import { loadContent } from "@/lib/settings";

export const revalidate = 60;

export default async function Page() {
  const [content, roadmap, achievements] = await Promise.all([
    loadContent(),
    loadRoadmap(),
    loadAchievements(),
  ]);
  return <Deck content={content} roadmap={roadmap} achievements={achievements} />;
}
