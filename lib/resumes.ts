import type { Lang } from "./i18n";

// Downloadable résumés, shown in the home + about dropdowns.
// Order matters — it reflects the primary focus: protection first, then
// networking, then ELV & home automation.
//
// To wire up a résumé, drop the PDF into `public/resumes/` using the file
// name referenced below (or update the `file` path here).
export type Resume = {
  id: string;
  labelEn: string;
  labelAr: string;
  file: string; // path served from /public
};

export const resumes: Resume[] = [
  {
    id: "protection",
    labelEn: "Protection Systems",
    labelAr: "أنظمة الحماية",
    file: "/resumes/yahya-khaled-protection-systems.pdf",
  },
  {
    id: "networking",
    labelEn: "Networking",
    labelAr: "الشبكات",
    file: "/resumes/yahya-khaled-networking.pdf",
  },
  {
    id: "elv",
    labelEn: "ELV & Home Automation",
    labelAr: "الأنظمة منخفضة الجهد وأتمتة المنازل",
    file: "/resumes/yahya-khaled-elv-home-automation.pdf",
  },
];

export function resumeLabel(r: Resume, lang: Lang): string {
  return lang === "ar" ? r.labelAr : r.labelEn;
}
