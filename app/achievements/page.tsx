import { LangProvider } from "@/components/LangProvider";
import SiteHeader from "@/components/SiteHeader";
import AchievementsFull from "./AchievementsFull";
import { loadContent } from "@/lib/settings";
import { loadAchievements } from "@/lib/content";

export const revalidate = 60;

export default async function AchievementsPage() {
  const [content, items] = await Promise.all([loadContent(), loadAchievements()]);
  return (
    <LangProvider>
      <div className="min-h-screen sunglow">
        <SiteHeader current="achievements" />
        <main><AchievementsFull content={content} items={items} /></main>
      </div>
    </LangProvider>
  );
}
