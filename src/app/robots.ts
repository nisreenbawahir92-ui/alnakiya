import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

const SCRAPER_BOTS = [
  "AhrefsBot",
  "SemrushBot",
  "DotBot",
  "PetalBot",
  "Bytespider",
  "MJ12bot",
  "BLEXBot",
  "DataForSeoBot",
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "CCBot",
  "meta-externalagent",
  "Applebot-Extended",
  "ImagesiftBot",
  "SerpstatBot",
  "MegaIndex",
  "Seokicks",
  "LinkdexBot",
  "spbot",
];

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/login",
          "/login/",
          "/cart",
          "/cart/",
          "/api/",
        ],
      },
      ...SCRAPER_BOTS.map((userAgent) => ({
        userAgent,
        disallow: ["/"],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
