import { renderRoadmapPage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata() {
  return pageMeta("roadmap", "ar");
}

export default async function RoadmapPage() {
  return renderRoadmapPage("ar");
}
