import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400", "500"] });
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  // Set SITE_URL to the real domain at deploy time so the OG image URL is absolute.
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: "Kishore Sudhir · Data and AI",
  description:
    "Kish (Kishore Sudhir) is a Data Scientist and AI Engineer in Melbourne working on data engineering, AI adoption and automation.",
  openGraph: { title: "Kishore Sudhir · Data and AI", type: "website", locale: "en_AU" },
};

export const viewport: Viewport = { themeColor: "#0B2545", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`}>
      <head>
        <link rel="preload" as="image" type="image/webp" href="/assets/melbourne-dusk-960.webp" media="(max-width: 960px)" fetchPriority="high" />
        <link rel="preload" as="image" type="image/webp" href="/assets/melbourne-dusk.webp" media="(min-width: 961px)" fetchPriority="high" />
        <noscript>
          <style>{`[data-reveal]{transform:none!important;opacity:1!important}.statement__word{opacity:1}.stat__strike{transform:none}.stat__same{opacity:1}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
