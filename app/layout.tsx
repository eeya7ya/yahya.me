import type { Metadata } from "next";
import { headers } from "next/headers";
import JsonLd from "@/components/JsonLd";
import { loadContent } from "@/lib/settings";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yahya Khaled — Power System Protection Engineer",
    template: "%s — Yahya Khaled",
  },
  description:
    "Yahya Khaled (يحيى خالد) — Power System Protection Engineer. Interactive CV covering his roadmap, achievements, and projects across protection systems, networking, and ELV & home automation.",
  applicationName: "Yahya Khaled",
  authors: [{ name: "Yahya Khaled", url: SITE_URL }],
  creator: "Yahya Khaled",
  publisher: "Yahya Khaled",
  alternates: {
    canonical: "/",
    languages: { en: "/", ar: "/ar", "x-default": "/" },
  },
  keywords: [
    "Yahya Khaled",
    "Yahya Khaled engineer",
    "يحيى خالد",
    "Yahya Khaled Electrical Engineer",
    "Power System Protection Engineer",
    "Electrical Power Engineer",
    "Protection Systems",
    "Networking",
    "ELV",
    "Home Automation",
    "Smart Grids",
    "eSpark.dev",
  ],
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    siteName: "Yahya Khaled",
    url: SITE_URL,
    title: "Yahya Khaled — Power System Protection Engineer",
    description:
      "Interactive CV — roadmap, achievements, and journey of Yahya Khaled.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yahya Khaled — Power System Protection Engineer",
    description:
      "Interactive CV — roadmap, achievements, and journey of Yahya Khaled.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "/";
  const lang = pathname.startsWith("/ar") ? "ar" : "en";
  const dir = lang === "ar" ? "rtl" : "ltr";

  const content = await loadContent();
  const sameAs = [content.contact.github, content.contact.linkedin, content.contact.website]
    .filter((v): v is string => Boolean(v && v.trim()));

  const personId = `${SITE_URL}/#person`;
  const websiteId = `${SITE_URL}/#website`;
  const email = content.contact.email
    ? content.contact.email.startsWith("mailto:")
      ? content.contact.email
      : `mailto:${content.contact.email}`
    : undefined;

  const personSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: "Yahya Khaled",
        alternateName: ["يحيى خالد", "Yahya Khaled Engineer"],
        givenName: "Yahya",
        familyName: "Khaled",
        jobTitle: "Power System Protection Engineer",
        description:
          "Yahya Khaled is a Power System Protection Engineer working across protection systems, networking, and ELV & home automation.",
        url: SITE_URL,
        image: `${SITE_URL}/profile.png`,
        email,
        sameAs,
        worksFor: content.contact.website
          ? { "@type": "Organization", name: "eSpark.dev", url: content.contact.website }
          : undefined,
        knowsAbout: [
          "Power System Protection",
          "Electrical Power Engineering",
          "Protection Systems",
          "Networking",
          "ELV Systems",
          "Home Automation",
          "Smart Grids",
        ],
        knowsLanguage: ["en", "ar"],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: "Yahya Khaled",
        alternateName: "يحيى خالد",
        inLanguage: ["en", "ar"],
        publisher: { "@id": personId },
        about: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: "Yahya Khaled — Power System Protection Engineer",
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        inLanguage: lang,
      },
    ],
  };

  return (
    <html lang={lang} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="sunglow">
        {children}
        <JsonLd data={personSchema} />
      </body>
    </html>
  );
}
