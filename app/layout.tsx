import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yahya Khaled — Electrical Power Engineer",
  description: "Interactive CV — roadmap, achievements, and journey of Yahya Khaled.",
  openGraph: {
    title: "Yahya Khaled",
    description: "Electrical Power Engineer — interactive CV.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body className="sunglow">{children}</body>
    </html>
  );
}
