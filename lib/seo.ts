import type { Metadata } from "next";
import { dict, type Lang } from "./i18n";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yahyakhaled.com";

export const LOCALE_MAP: Record<Lang, string> = {
  en: "en_US",
  ar: "ar_EG",
};

export type Route = "home" | "about" | "roadmap" | "achievements" | "projects" | "contact";

const ROUTE_BASE: Record<Route, string> = {
  home: "",
  about: "/about",
  roadmap: "/roadmap",
  achievements: "/achievements",
  projects: "/projects",
  contact: "/contact",
};

export function pathFor(lang: Lang, route: Route): string {
  const base = ROUTE_BASE[route];
  if (lang === "ar") return base ? `/ar${base}` : "/ar";
  return base || "/";
}

export function urlFor(lang: Lang, route: Route): string {
  return `${SITE_URL}${pathFor(lang, route)}`;
}

type Copy = { title: string; description: string };

function copyFor(route: Route, lang: Lang): Copy {
  const t = dict[lang];
  switch (route) {
    case "home":
      return { title: `${t.hero.name} — ${t.hero.role}`, description: t.hero.tagline };
    case "about":
      return { title: t.about.title, description: t.about.body.slice(0, 160) };
    case "roadmap":
      return { title: t.roadmap.title, description: t.roadmap.subtitle };
    case "achievements":
      return { title: t.achievements.title, description: t.achievements.subtitle };
    case "projects":
      return { title: t.projects.title, description: t.projects.subtitle };
    case "contact":
      return { title: t.contact.title, description: t.contact.subtitle };
  }
}

export function pageMeta(route: Route, lang: Lang, overrides?: Partial<Copy>): Metadata {
  const { title, description } = { ...copyFor(route, lang), ...overrides };
  const canonical = pathFor(lang, route);
  const url = urlFor(lang, route);

  return {
    title: route === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        en: pathFor("en", route),
        ar: pathFor("ar", route),
        "x-default": pathFor("en", route),
      },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "Yahya Khaled",
      locale: LOCALE_MAP[lang],
      alternateLocale: lang === "en" ? LOCALE_MAP.ar : LOCALE_MAP.en,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
