export type Lang = "ar" | "en";

export const dict = {
  ar: {
    nav: { home: "الرئيسية", about: "عني", roadmap: "المسيرة", achievements: "الإنجازات", projects: "المشاريع", contact: "تواصل" },
    hero: {
      greeting: "مرحباً، أنا",
      name: "يحيى خالد",
      role: "مهندس حماية أنظمة القوى الكهربائية",
      tagline: "حماية أنظمة القوى · الشبكات · الأنظمة منخفضة الجهد وأتمتة المنازل",
      site: "eSpark.dev",
      cta: "اعرف المزيد",
    },
    about: {
      title: "عنّي",
      body:
        "مهندس حماية أنظمة القوى الكهربائية، متخصص في تنسيق الريليهات ودراسات تيار القصر وتقييم مخاطر القوس الكهربائي، مع خبرة عملية في تصميم أنظمة الجهد المنخفض وELV على AutoCAD وRevit. تركيزي مرتّب: أنظمة الحماية أولاً، ثم الشبكات، ثم الأنظمة منخفضة الجهد وأتمتة المنازل. ومن خلال eSpark أقدّم هندسة دقيقة قائمة على المعايير تحوّل المتطلبات المعقّدة إلى أنظمة كهربائية آمنة وانتقائية وموثوقة.",
      values: ["دقة", "تصميم", "أثر"],
    },
    roadmap: { title: "خارطة الطريق", subtitle: "المحطات الكبرى في رحلتي" },
    achievements: { title: "إنجازات", subtitle: "محطات أفتخر بها" },
    projects: { title: "المشاريع", subtitle: "أعمال أفتخر بها" },
    contact: {
      title: "تواصل",
      subtitle: "لنبني شيئاً جميلاً معاً",
      email: "البريد الإلكتروني",
      github: "جيت‑هاب",
      linkedin: "لينكد‑إن",
      website: "الموقع",
    },
    ui: { switchLang: "EN", scrollHint: "مرّر للأسفل", viewMore: "اعرف المزيد", downloadResume: "تحميل السيرة الذاتية" },
  },
  en: {
    nav: { home: "Home", about: "About", roadmap: "Roadmap", achievements: "Achievements", projects: "Projects", contact: "Contact" },
    hero: {
      greeting: "Hello, I'm",
      name: "Yahya Khaled",
      role: "Power System Protection Engineer",
      tagline: "Protection Systems · Networking · ELV & Home Automation",
      site: "eSpark.dev",
      cta: "Learn more",
    },
    about: {
      title: "About",
      body:
        "Power system protection engineer specializing in relay coordination, short-circuit studies, and arc-flash assessments, with hands-on LV/ELV system design in AutoCAD & Revit. My focus runs in order — protection systems first, then networking, then ELV & home automation. Through eSpark I deliver precise, standards-driven engineering that turns complex requirements into safe, selective, and reliable electrical systems.",
      values: ["Precision", "Design", "Impact"],
    },
    roadmap: { title: "Roadmap", subtitle: "Milestones along the journey" },
    achievements: { title: "Achievements", subtitle: "Moments I'm proud of" },
    projects: { title: "Projects", subtitle: "Work I'm proud of" },
    contact: {
      title: "Contact",
      subtitle: "Let's build something beautiful",
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
      website: "Website",
    },
    ui: { switchLang: "ع", scrollHint: "Scroll", viewMore: "View more", downloadResume: "Download résumé" },
  },
} as const;

export type Dict = typeof dict;
