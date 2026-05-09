import { renderAboutPage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata() {
  return pageMeta("about", "ar");
}

export default async function AboutPage() {
  return renderAboutPage("ar");
}
