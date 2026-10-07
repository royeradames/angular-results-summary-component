import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const hankenGrotesk = localFont({
  src: "../public/assets/fonts/HankenGrotesk-VariableFont_wght.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-hanken",
});

export const metadata: Metadata = {
  title: "Results Summary | Royer Adames",
  description: "A responsive results summary using the supplied Frontend Mentor sample scores.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={hankenGrotesk.variable}>{children}</body></html>;
}
