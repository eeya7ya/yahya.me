import { renderProjectsPage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata() {
  return pageMeta("projects", "en");
}

export default async function ProjectsPage() {
  return renderProjectsPage("en");
}
