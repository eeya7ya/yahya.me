import { renderAchievementsPage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata() {
  return pageMeta("achievements", "ar");
}

export default async function AchievementsPage() {
  return renderAchievementsPage("ar");
}
