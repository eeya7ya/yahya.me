export type Lang = "ar" | "en";

export const dict = {
  ar: {
    nav: { home: "الرئيسية", about: "عني", roadmap: "المسيرة", achievements: "الإنجازات", contact: "تواصل" },
    hero: {
      greeting: "مرحباً، أنا",
      name: "يحيى خالد",
      role: "مهندس قوى كهربائية",
      tagline: "أصمّم. أُنفّذ.",
      cta: "اعرف المزيد",
    },
    about: {
      title: "عنّي",
      body:
        "مهندس قوى كهربائية شغوف بأنظمة الطاقة المتجددة والشبكات الذكية. أؤمن أن المعرفة الحقيقية تُبنى بالمشاريع والتجارب، لا بالكتب فقط.",
      values: ["دقة", "تصميم", "أثر"],
    },
    roadmap: { title: "خارطة الطريق", subtitle: "المحطات الكبرى في رحلتي" },
    achievements: { title: "إنجازات", subtitle: "محطات أفتخر بها" },
    contact: {
      title: "تواصل",
      subtitle: "لنبني شيئاً جميلاً معاً",
      email: "البريد الإلكتروني",
      github: "جيت‑هاب",
      linkedin: "لينكد‑إن",
    },
    ui: { switchLang: "EN", scrollHint: "مرّر للأسفل" },
  },
  en: {
    nav: { home: "Home", about: "About", roadmap: "Roadmap", achievements: "Achievements", contact: "Contact" },
    hero: {
      greeting: "Hello, I'm",
      name: "Yahya Khaled",
      role: "Electrical Power Engineer",
      tagline: "Design. Deliver.",
      cta: "Learn more",
    },
    about: {
      title: "About",
      body:
        "Electrical power engineer with a passion for renewable energy and smart grids. Real knowledge is built through projects and experiments, not books alone.",
      values: ["Precision", "Design", "Impact"],
    },
    roadmap: { title: "Roadmap", subtitle: "Milestones along the journey" },
    achievements: { title: "Achievements", subtitle: "Moments I'm proud of" },
    contact: {
      title: "Contact",
      subtitle: "Let's build something beautiful",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    ui: { switchLang: "ع", scrollHint: "Scroll" },
  },
} as const;

export type Dict = typeof dict;
