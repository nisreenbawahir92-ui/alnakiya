import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/pages";
import { getProductCategories, getProducts } from "@/lib/products";
import { getSiteUrl, safeDate } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1 },
    { path: "/shop", changeFrequency: "daily", priority: 0.95 },
    { path: "/about-us", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact-us", changeFrequency: "monthly", priority: 0.7 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.75 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...products.map((product) => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: safeDate(product.updatedAt || product.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getBlogPosts().map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: safeDate(post.updatedAt || post.createdAt),
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ];
}
