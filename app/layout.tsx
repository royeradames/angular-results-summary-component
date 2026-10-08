import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteName, siteUrl } from "./site";

const hankenGrotesk = localFont({
  src: "../public/assets/fonts/HankenGrotesk-VariableFont_wght.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-hanken",
});

const title = "Results Summary | Royer Adames";
const description = "A responsive results summary using the supplied Frontend Mentor sample scores.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName, title, description },
  twitter: { card: "summary_large_image" },
};

const websiteJsonLd = { "@context": "https://schema.org", "@type": "WebSite", name: siteName, url: siteUrl };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={hankenGrotesk.variable}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
