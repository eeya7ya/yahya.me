import { LangProvider } from "@/components/LangProvider";
import SiteHeader from "@/components/SiteHeader";
import RoadmapFull from "./RoadmapFull";
import { loadContent } from "@/lib/settings";
import { loadRoadmap } from "@/lib/content";

export const revalidate = 60;

export default async function RoadmapPage() {
  const [content, items] = await Promise.all([loadContent(), loadRoadmap()]);
  return (
    <LangProvider>
      <div className="min-h-screen sunglow">
        <SiteHeader current="roadmap" />
        <main><RoadmapFull content={content} items={items} /></main>
      </div>
    </LangProvider>
  );
}
