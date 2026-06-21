import type { Lang } from "./i18n";

// A downloadable résumé entry. The file itself lives wherever the admin
// upload stored it (Cloudflare R2) — we only keep the public URL + labels.
// Managed from the admin panel ("Content" tab → "Résumés"), persisted in
// site settings. Order reflects the primary focus: protection first, then
// networking, then ELV & home automation.
export type Resume = {
  labelEn: string;
  labelAr: string;
  url: string;
};

// Seed entries shown before anything is uploaded — labels only, no files yet.
export const defaultResumes: Resume[] = [
  { labelEn: "Protection Systems", labelAr: "أنظمة الحماية", url: "" },
  { labelEn: "Networking", labelAr: "الشبكات", url: "" },
  { labelEn: "ELV & Home Automation", labelAr: "الأنظمة منخفضة الجهد وأتمتة المنازل", url: "" },
];

export function resumeLabel(r: Resume, lang: Lang): string {
  return lang === "ar" ? r.labelAr : r.labelEn;
}
