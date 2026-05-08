import { LangProvider } from "@/components/LangProvider";
import SiteHeader from "@/components/SiteHeader";
import ContactFull from "./ContactFull";
import { loadContent } from "@/lib/settings";

export const revalidate = 60;

export default async function ContactPage() {
  const content = await loadContent();
  return (
    <LangProvider>
      <div className="min-h-screen sunglow">
        <SiteHeader current="contact" />
        <main><ContactFull content={content} /></main>
      </div>
    </LangProvider>
  );
}
