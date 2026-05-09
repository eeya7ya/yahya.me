import type { MetadataRoute } from "next";
import { pathFor, SITE_URL, type Route } from "@/lib/seo";

const ROUTES: Route[] = ["home", "about", "roadmap", "achievements", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.flatMap((route) => {
    const enUrl = `${SITE_URL}${pathFor("en", route)}`;
    const arUrl = `${SITE_URL}${pathFor("ar", route)}`;
    const languages = { en: enUrl, ar: arUrl, "x-default": enUrl };
    const isHome = route === "home";
    return [
      {
        url: enUrl,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: isHome ? 1.0 : 0.7,
        alternates: { languages },
      },
      {
        url: arUrl,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: isHome ? 0.9 : 0.6,
        alternates: { languages },
      },
    ];
  });
}
