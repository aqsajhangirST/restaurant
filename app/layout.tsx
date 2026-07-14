import type { Metadata } from "next";
import { Fraunces, Inter, Whisper } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { AudioProvider } from "@/providers/AudioProvider";
import { AmbientAudio } from "@/components/audio/AmbientAudio";
import { ScrollTimelineProvider } from "@/providers/ScrollTimelineProvider";
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const whisper = Whisper({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-whisper",
});

const SITE_URL = "https://www.bayroute.pk";
const SITE_TITLE = "Bayroute — Taste the Bay";
const SITE_DESCRIPTION =
  "Bayroute, F-6 Islamabad — premium fusion dining beneath the bloom canopy. Taste the Bay.";

/**
 * Audit fix: the original metadata export only had title/description.
 * Added here (all additive, no rewrite): metadataBase so relative OG/
 * icon URLs resolve correctly, Open Graph + Twitter card data for real
 * link-preview cards when this gets shared, and a robots directive. No
 * OG image is set yet — there's no real photography to use for one (same
 * "don't fabricate" rule as everywhere else in this build); once real
 * photography exists, add `openGraph.images`.
 *
 * SITE_URL is a placeholder domain — swap it for the real one once
 * Bayroute has a production domain; metadataBase just needs *a* valid
 * absolute origin to resolve relative paths against in the meantime.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "Bayroute",
    "Islamabad restaurant",
    "F-6 Islamabad",
    "fusion restaurant Islamabad",
    "Pakistani continental Chinese restaurant",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Bayroute",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

/**
 * Audit fix: LocalBusiness/Restaurant structured data. Only fields with a
 * real, known value are included (name, cuisine, neighborhood, social
 * profile) — no fabricated phone number, hours, or geo-coordinates, same
 * honesty rule as ContactSection's DOM copy. Search engines tolerate a
 * partial LocalBusiness record; they don't tolerate wrong data.
 */
const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Bayroute",
  servesCuisine: ["Pakistani", "Continental", "Chinese", "Fusion"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "F-6, Islamabad",
    addressCountry: "PK",
  },
  sameAs: ["https://www.instagram.com/bayroute_f6/"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${whisper.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-charcoal-900 text-ivory-50">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <Providers> <ScrollTimelineProvider>
    <AudioProvider>
      <AmbientAudio />
      {children}
    </AudioProvider>
  </ScrollTimelineProvider></Providers>
      </body>
    </html>
  );
}
