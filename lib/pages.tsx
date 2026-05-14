import { LangProvider } from "@/components/LangProvider";
import SiteHeader from "@/components/SiteHeader";
import AboutFull from "@/app/about/AboutFull";
import RoadmapFull from "@/app/roadmap/RoadmapFull";
import AchievementsFull from "@/app/achievements/AchievementsFull";
import ProjectsFull from "@/app/projects/ProjectsFull";
import ContactFull from "@/app/contact/ContactFull";
import { loadContent } from "@/lib/settings";
import { loadAchievements, loadProjects, loadRoadmap } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

export async function renderAboutPage(lang: Lang) {
  const content = await loadContent();
  return (
    <LangProvider initialLang={lang}>
      <div className="min-h-screen sunglow">
        <SiteHeader current="about" lang={lang} />
        <main>
          <AboutFull content={content} />
        </main>
      </div>
    </LangProvider>
  );
}

export async function renderRoadmapPage(lang: Lang) {
  const [content, items] = await Promise.all([loadContent(), loadRoadmap()]);
  return (
    <LangProvider initialLang={lang}>
      <div className="min-h-screen sunglow">
        <SiteHeader current="roadmap" lang={lang} />
        <main>
          <RoadmapFull content={content} items={items} />
        </main>
      </div>
    </LangProvider>
  );
}

export async function renderAchievementsPage(lang: Lang) {
  const [content, items] = await Promise.all([loadContent(), loadAchievements()]);
  return (
    <LangProvider initialLang={lang}>
      <div className="min-h-screen sunglow">
        <SiteHeader current="achievements" lang={lang} />
        <main>
          <AchievementsFull content={content} items={items} />
        </main>
      </div>
    </LangProvider>
  );
}

export async function renderProjectsPage(lang: Lang) {
  const [content, items] = await Promise.all([loadContent(), loadProjects()]);
  return (
    <LangProvider initialLang={lang}>
      <div className="min-h-screen sunglow">
        <SiteHeader current="projects" lang={lang} />
        <main>
          <ProjectsFull content={content} items={items} />
        </main>
      </div>
    </LangProvider>
  );
}

export async function renderContactPage(lang: Lang) {
  const content = await loadContent();
  return (
    <LangProvider initialLang={lang}>
      <div className="min-h-screen sunglow">
        <SiteHeader current="contact" lang={lang} />
        <main>
          <ContactFull content={content} />
        </main>
      </div>
    </LangProvider>
  );
}
