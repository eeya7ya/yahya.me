import { renderContactPage } from "@/lib/pages";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export function generateMetadata() {
  return pageMeta("contact", "ar");
}

export default async function ContactPage() {
  return renderContactPage("ar");
}
