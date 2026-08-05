import pageData from "@/data/pages.json";
import type { WordPressPage } from "@/types/page";

const pages = pageData as WordPressPage[];

export function getBlogPosts() {
  return pages
    .filter((page) => page.type === "post")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getBlogPost(slug: string) {
  return getBlogPosts().find((post) => post.slug === slug) ?? null;
}
