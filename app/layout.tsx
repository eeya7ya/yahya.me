import type { Metadata } from "next";
import { headers } from "next/headers";
import JsonLd from "@/components/JsonLd";
import { loadContent } from "@/lib/settings";
import { SITE_URL } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yahya Khaled — Electrical Power & Machines Engineer",
    template: "%s — Yahya Khaled",
  },
  description:
    "Interactive CV — roadmap, achievements, and journey of Yahya Khaled, Electrical Power & Machines Engineer.",
  applicationName: "Yahya Khaled",
  authors: [{ name: "Yahya Khaled", url: SITE_URL }],
  creator: "Yahya Khaled",
  keywords: [
    "Yahya Khaled",
    "Electrical Power Engineer",
    "Electrical Machines",
    "AI Solutions",
    "EdTech",
    "Smart Grids",
    "Renewable Energy",
    "eSpark.dev",
  ],
  openGraph: {
    type: "website",
    siteName: "Yahya Khaled",
    url: SITE_URL,
    title: "Yahya Khaled — Electrical Power & Machines Engineer",
    description:
      "Interactive CV — roadmap, achievements, and journey of Yahya Khaled.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yahya Khaled — Electrical Power & Machines Engineer",
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

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Yahya Khaled",
    alternateName: "يحيى خالد",
    jobTitle: "Electrical Power & Machines Engineer",
    url: SITE_URL,
    image: `${SITE_URL}/profile.png`,
    email: content.contact.email
      ? content.contact.email.startsWith("mailto:")
        ? content.contact.email
        : `mailto:${content.contact.email}`
      : undefined,
    sameAs,
    knowsAbout: ["Electrical Power Engineering", "AI Solutions", "EdTech", "Smart Grids"],
    knowsLanguage: ["en", "ar"],
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
