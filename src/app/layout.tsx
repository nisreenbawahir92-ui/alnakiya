import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { SiteShell } from "@/components/site-shell";
import {
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  getSiteUrl,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | Industrial Tools & Hardware UAE`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: getSiteUrl() }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "shopping",
  keywords: [
    "Al Nakiya Trading",
    "industrial tools UAE",
    "hardware Sharjah",
    "power tools Dubai",
    "electrical accessories UAE",
    "building materials Sharjah",
    "hand tools UAE",
  ],
  alternates: {
    canonical: "/",
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#800517" },
    { media: "(prefers-color-scheme: dark)", color: "#800517" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: `${SITE_NAME} | Industrial Tools & Hardware UAE`,
    description: SITE_TAGLINE,
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "en_AE",
    type: "website",
    images: [
      {
        url: absoluteUrl("/icons/og-icon.png"),
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Industrial Tools & Hardware UAE`,
    description: SITE_TAGLINE,
    images: [absoluteUrl("/icons/og-icon.png")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AE" className={`${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]),
          }}
        />
        <CartProvider>
          <SiteShell>{children}</SiteShell>
        </CartProvider>
      </body>
    </html>
  );
}
