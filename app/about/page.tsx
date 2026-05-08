import { LangProvider } from "@/components/LangProvider";
import SiteHeader from "@/components/SiteHeader";
import AboutFull from "./AboutFull";
import { loadContent } from "@/lib/settings";

export const revalidate = 60;

export default async function AboutPage() {
  const content = await loadContent();
  return (
    <LangProvider>
      <div className="min-h-screen sunglow">
        <SiteHeader current="about" />
        <main><AboutFull content={content} /></main>
      </div>
    </LangProvider>
  );
}
