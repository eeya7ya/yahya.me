import Deck from "@/components/Deck";
import { loadAchievements, loadRoadmap } from "@/lib/content";
import { loadContent } from "@/lib/settings";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata() {
  return pageMeta("home", "ar");
}

export default async function Page() {
  const [content, roadmap, achievements] = await Promise.all([
    loadContent(),
    loadRoadmap(),
    loadAchievements(),
  ]);
  return <Deck content={content} roadmap={roadmap} achievements={achievements} initialLang="ar" />;
}
