import Deck from "@/components/Deck";
import { loadAchievements, loadRoadmap } from "@/lib/content";

export const revalidate = 3600;

const DEFAULT_PHOTO =
  "https://raw.githubusercontent.com/eeya7ya/yahya.me/main/ChatGPT%20Image%20May%208%2C%202026%2C%2007_03_21%20PM.png";

export default async function Page() {
  const [roadmap, achievements] = await Promise.all([loadRoadmap(), loadAchievements()]);
  const photoUrl = process.env.NEXT_PUBLIC_PHOTO_URL || DEFAULT_PHOTO;
  return <Deck photoUrl={photoUrl} roadmap={roadmap} achievements={achievements} />;
}
