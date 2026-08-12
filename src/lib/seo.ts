import type { Metadata } from "next";
import { getMediaUrl } from "@/lib/media";

export const SITE_NAME = "Al Nakiya Trading";
export const SITE_LOGO = getMediaUrl("/uploads/2025/08/al-nakiya-logo.jpg");
export const SITE_TAGLINE =
  "Industrial tools, hardware, electrical accessories and building materials supplier in the UAE.";

export const GOOGLE_MAPS_URL =
  "https://maps.app.goo.gl/AzKTLw2Wa7d1ncs2A";
export const GOOGLE_MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.691745980468!2d55.4858883!3d25.3815558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f59007e404e91%3A0x38e2b9325a561a98!2sAl+Nakiya+Trading+l.l.c+-+Ajman+Industrial+1+-+Ajman!5e0!3m2!1sen!2sae!4v1721720000000!5m2!1sen!2sae";
export const BUSINESS_ADDRESS =
  "Ajman Industrial 1, Ajman, United Arab Emirates";
export const BUSINESS_GEO = {
  latitude: 25.3815558,
  longitude: 55.4858883,
} as const;

export const CALL_PHONE_E164 = "+971553412355";
export const CALL_PHONE_DISPLAY = "+971 55 341 2355";
export const WHATSAPP_PHONE = "971506859158";
export const INSTAGRAM_URL =
  "https://www.instagram.com/alnakiyatradingllc?igsh=b3ZhaWY5cGJ0cGVp";
export const FACEBOOK_URL = "https://www.facebook.com/share/1DWyt8GQKL/";

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://alnakiyatrading.com";
  return raw.replace(/\/$/, "");
}

/** Live public URL for customer-facing links (WhatsApp orders, etc.). Never localhost. */
export function getPublicSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (
    configured &&
    !/localhost|127\.0\.0\.1/i.test(configured) &&
    /^https?:\/\//i.test(configured)
  ) {
    return configured.replace(/\/$/, "");
  }
  return "https://alnakiyatrading.com";
}

export function absoluteUrl(path = "/") {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function productPageUrl(slug: string) {
  const base = getPublicSiteUrl();
  return `${base}/product/${slug}`;
}

/** WhatsApp inquiry for a single product (includes clickable product link). */
export function buildProductWhatsAppMessage(options: {
  title: string;
  slug: string;
  sku?: string | null;
  price?: string | number | null;
  quantity?: number;
}) {
  const link = productPageUrl(options.slug);
  const qty = options.quantity && options.quantity > 1 ? options.quantity : null;
  const lines = [
    "Hello, I would like to order this product:",
    "",
    `Product: ${options.title}`,
    options.sku ? `SKU: ${options.sku}` : null,
    qty ? `Quantity: ${qty}` : null,
    options.price != null && options.price !== ""
      ? `Price: AED ${options.price}`
      : null,
    `Link: ${link}`,
    "",
    "Please confirm availability and delivery.",
  ].filter((line): line is string => line !== null);

  return lines.join("\n");
}

/** WhatsApp cart checkout message (each item includes product link). */
export function buildCartWhatsAppMessage(
  items: Array<{
    title: string;
    slug: string;
    quantity: number;
    price: number;
  }>,
  total: number,
) {
  const lines = [
    "Hello, I would like to place an order:",
    "",
    ...items.flatMap((item, index) => [
      `${index + 1}. ${item.title}`,
      `   Qty: ${item.quantity} × AED ${item.price.toFixed(2)} = AED ${(item.price * item.quantity).toFixed(2)}`,
      `   Link: ${productPageUrl(item.slug)}`,
      "",
    ]),
    `Total: AED ${total.toFixed(2)}`,
    "",
    "Please confirm availability, delivery, and payment.",
  ];

  return lines.join("\n");
}

export function truncateMeta(value: string, max = 155) {
  const clean = value.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  image = "/icons/og-icon.png",
  type = "website",
  noIndex = false,
  keywords = [],
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME)
    ? title
    : undefined; /* use template */
  const desc = truncateMeta(description);
  const resolvedImage = getMediaUrl(image);
  const imageUrl = resolvedImage.startsWith("http")
    ? resolvedImage
    : absoluteUrl(resolvedImage);

  return {
    title: fullTitle ?? title,
    description: desc,
    keywords: keywords.length ? keywords : undefined,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      url,
      siteName: SITE_NAME,
      locale: "en_AE",
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description: desc,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getSiteUrl(),
    logo: absoluteUrl("/icons/android-chrome-512x512.png"),
    image: absoluteUrl("/icons/og-icon.png"),
    description: SITE_TAGLINE,
    email: "info@alnakiyatrading.com",
    telephone: CALL_PHONE_E164,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ajman Industrial 1",
      addressLocality: "Ajman",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS_GEO.latitude,
      longitude: BUSINESS_GEO.longitude,
    },
    hasMap: GOOGLE_MAPS_URL,
    sameAs: [INSTAGRAM_URL, FACEBOOK_URL, `https://wa.me/${WHATSAPP_PHONE}`],
    areaServed: {
      "@type": "Country",
      name: "United Arab Emirates",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: getSiteUrl(),
    description: SITE_TAGLINE,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/shop")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function safeDate(value?: string | null) {
  if (!value) return new Date();
  const normalized = value.includes("T")
    ? value
    : value.replace(" ", "T") + (value.endsWith("Z") ? "" : "Z");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}
