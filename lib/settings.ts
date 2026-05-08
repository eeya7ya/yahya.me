import { getDb } from "./db";
import { siteSettings } from "./schema";
import { dict } from "./i18n";

const DEFAULT_PHOTO =
  "https://raw.githubusercontent.com/eeya7ya/yahya.me/main/ChatGPT%20Image%20May%208%2C%202026%2C%2007_03_21%20PM.png";

export type SiteContent = {
  photoUrl: string;
  hero: {
    greetingAr: string; greetingEn: string;
    nameAr: string;     nameEn: string;
    roleAr: string;     roleEn: string;
    taglineAr: string;  taglineEn: string;
    ctaAr: string;      ctaEn: string;
  };
  about: {
    titleAr: string; titleEn: string;
    bodyAr: string;  bodyEn: string;
    valuesAr: string[]; valuesEn: string[];
  };
  roadmap: {
    titleAr: string; titleEn: string;
    subtitleAr: string; subtitleEn: string;
  };
  achievements: {
    titleAr: string; titleEn: string;
    subtitleAr: string; subtitleEn: string;
  };
  contact: {
    titleAr: string; titleEn: string;
    subtitleAr: string; subtitleEn: string;
    email: string; github: string; linkedin: string;
  };
};

export const defaultContent: SiteContent = {
  photoUrl: process.env.NEXT_PUBLIC_PHOTO_URL || DEFAULT_PHOTO,
  hero: {
    greetingAr: dict.ar.hero.greeting, greetingEn: dict.en.hero.greeting,
    nameAr: dict.ar.hero.name,         nameEn: dict.en.hero.name,
    roleAr: dict.ar.hero.role,         roleEn: dict.en.hero.role,
    taglineAr: dict.ar.hero.tagline,   taglineEn: dict.en.hero.tagline,
    ctaAr: dict.ar.hero.cta,           ctaEn: dict.en.hero.cta,
  },
  about: {
    titleAr: dict.ar.about.title, titleEn: dict.en.about.title,
    bodyAr: dict.ar.about.body,   bodyEn: dict.en.about.body,
    valuesAr: [...dict.ar.about.values],
    valuesEn: [...dict.en.about.values],
  },
  roadmap: {
    titleAr: dict.ar.roadmap.title,    titleEn: dict.en.roadmap.title,
    subtitleAr: dict.ar.roadmap.subtitle, subtitleEn: dict.en.roadmap.subtitle,
  },
  achievements: {
    titleAr: dict.ar.achievements.title,    titleEn: dict.en.achievements.title,
    subtitleAr: dict.ar.achievements.subtitle, subtitleEn: dict.en.achievements.subtitle,
  },
  contact: {
    titleAr: dict.ar.contact.title,        titleEn: dict.en.contact.title,
    subtitleAr: dict.ar.contact.subtitle,  subtitleEn: dict.en.contact.subtitle,
    email: "contact@yahya.me",
    github: "https://github.com/eeya7ya",
    linkedin: "https://linkedin.com/in/yahya-khaled",
  },
};

// Mapping between flat keys (stored in DB) and the structured SiteContent.
// Each entry: [key, type] where type indicates encoding for the value.
export const SETTING_KEYS = [
  ["photo.url", "string"],

  ["hero.greeting.ar", "string"], ["hero.greeting.en", "string"],
  ["hero.name.ar", "string"],     ["hero.name.en", "string"],
  ["hero.role.ar", "string"],     ["hero.role.en", "string"],
  ["hero.tagline.ar", "string"],  ["hero.tagline.en", "string"],
  ["hero.cta.ar", "string"],      ["hero.cta.en", "string"],

  ["about.title.ar", "string"], ["about.title.en", "string"],
  ["about.body.ar", "string"],  ["about.body.en", "string"],
  ["about.values.ar", "json"],  ["about.values.en", "json"],

  ["roadmap.title.ar", "string"], ["roadmap.title.en", "string"],
  ["roadmap.subtitle.ar", "string"], ["roadmap.subtitle.en", "string"],

  ["achievements.title.ar", "string"], ["achievements.title.en", "string"],
  ["achievements.subtitle.ar", "string"], ["achievements.subtitle.en", "string"],

  ["contact.title.ar", "string"], ["contact.title.en", "string"],
  ["contact.subtitle.ar", "string"], ["contact.subtitle.en", "string"],
  ["contact.email", "string"], ["contact.github", "string"], ["contact.linkedin", "string"],
] as const;

export type SettingKey = (typeof SETTING_KEYS)[number][0];

function applyOverrides(base: SiteContent, map: Map<string, string>): SiteContent {
  const get = (k: string) => map.get(k);
  const c: SiteContent = JSON.parse(JSON.stringify(base));

  if (get("photo.url")) c.photoUrl = get("photo.url")!;

  c.hero.greetingAr = get("hero.greeting.ar") ?? c.hero.greetingAr;
  c.hero.greetingEn = get("hero.greeting.en") ?? c.hero.greetingEn;
  c.hero.nameAr     = get("hero.name.ar")     ?? c.hero.nameAr;
  c.hero.nameEn     = get("hero.name.en")     ?? c.hero.nameEn;
  c.hero.roleAr     = get("hero.role.ar")     ?? c.hero.roleAr;
  c.hero.roleEn     = get("hero.role.en")     ?? c.hero.roleEn;
  c.hero.taglineAr  = get("hero.tagline.ar")  ?? c.hero.taglineAr;
  c.hero.taglineEn  = get("hero.tagline.en")  ?? c.hero.taglineEn;
  c.hero.ctaAr      = get("hero.cta.ar")      ?? c.hero.ctaAr;
  c.hero.ctaEn      = get("hero.cta.en")      ?? c.hero.ctaEn;

  c.about.titleAr = get("about.title.ar") ?? c.about.titleAr;
  c.about.titleEn = get("about.title.en") ?? c.about.titleEn;
  c.about.bodyAr  = get("about.body.ar")  ?? c.about.bodyAr;
  c.about.bodyEn  = get("about.body.en")  ?? c.about.bodyEn;
  const vAr = get("about.values.ar"); if (vAr) { try { c.about.valuesAr = JSON.parse(vAr); } catch {} }
  const vEn = get("about.values.en"); if (vEn) { try { c.about.valuesEn = JSON.parse(vEn); } catch {} }

  c.roadmap.titleAr    = get("roadmap.title.ar")    ?? c.roadmap.titleAr;
  c.roadmap.titleEn    = get("roadmap.title.en")    ?? c.roadmap.titleEn;
  c.roadmap.subtitleAr = get("roadmap.subtitle.ar") ?? c.roadmap.subtitleAr;
  c.roadmap.subtitleEn = get("roadmap.subtitle.en") ?? c.roadmap.subtitleEn;

  c.achievements.titleAr    = get("achievements.title.ar")    ?? c.achievements.titleAr;
  c.achievements.titleEn    = get("achievements.title.en")    ?? c.achievements.titleEn;
  c.achievements.subtitleAr = get("achievements.subtitle.ar") ?? c.achievements.subtitleAr;
  c.achievements.subtitleEn = get("achievements.subtitle.en") ?? c.achievements.subtitleEn;

  c.contact.titleAr    = get("contact.title.ar")    ?? c.contact.titleAr;
  c.contact.titleEn    = get("contact.title.en")    ?? c.contact.titleEn;
  c.contact.subtitleAr = get("contact.subtitle.ar") ?? c.contact.subtitleAr;
  c.contact.subtitleEn = get("contact.subtitle.en") ?? c.contact.subtitleEn;
  c.contact.email    = get("contact.email")    ?? c.contact.email;
  c.contact.github   = get("contact.github")   ?? c.contact.github;
  c.contact.linkedin = get("contact.linkedin") ?? c.contact.linkedin;

  return c;
}

export function contentToFlat(c: SiteContent): Record<SettingKey, string> {
  return {
    "photo.url": c.photoUrl,
    "hero.greeting.ar": c.hero.greetingAr, "hero.greeting.en": c.hero.greetingEn,
    "hero.name.ar": c.hero.nameAr,         "hero.name.en": c.hero.nameEn,
    "hero.role.ar": c.hero.roleAr,         "hero.role.en": c.hero.roleEn,
    "hero.tagline.ar": c.hero.taglineAr,   "hero.tagline.en": c.hero.taglineEn,
    "hero.cta.ar": c.hero.ctaAr,           "hero.cta.en": c.hero.ctaEn,
    "about.title.ar": c.about.titleAr,     "about.title.en": c.about.titleEn,
    "about.body.ar": c.about.bodyAr,       "about.body.en": c.about.bodyEn,
    "about.values.ar": JSON.stringify(c.about.valuesAr),
    "about.values.en": JSON.stringify(c.about.valuesEn),
    "roadmap.title.ar": c.roadmap.titleAr, "roadmap.title.en": c.roadmap.titleEn,
    "roadmap.subtitle.ar": c.roadmap.subtitleAr, "roadmap.subtitle.en": c.roadmap.subtitleEn,
    "achievements.title.ar": c.achievements.titleAr, "achievements.title.en": c.achievements.titleEn,
    "achievements.subtitle.ar": c.achievements.subtitleAr, "achievements.subtitle.en": c.achievements.subtitleEn,
    "contact.title.ar": c.contact.titleAr, "contact.title.en": c.contact.titleEn,
    "contact.subtitle.ar": c.contact.subtitleAr, "contact.subtitle.en": c.contact.subtitleEn,
    "contact.email": c.contact.email,
    "contact.github": c.contact.github,
    "contact.linkedin": c.contact.linkedin,
  };
}

export async function loadContent(): Promise<SiteContent> {
  const db = getDb();
  if (!db) return defaultContent;
  try {
    const rows = await db.select().from(siteSettings);
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return applyOverrides(defaultContent, map);
  } catch {
    return defaultContent;
  }
}

export async function saveContent(updates: Partial<Record<SettingKey, string>>) {
  const db = getDb();
  if (!db) throw new Error("DATABASE_URL not set");
  const entries = Object.entries(updates).filter(([, v]) => typeof v === "string") as [SettingKey, string][];
  if (entries.length === 0) return;
  // upsert one-by-one to keep it simple and portable
  for (const [key, value] of entries) {
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value } });
  }
}
