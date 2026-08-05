import { cache } from "react";
import existingContent from "@/data/existing-content.json";
import { createClient } from "@/lib/supabase/server";
import type { ContentItem } from "@/types/content";

type ContentRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  published_at: string;
};

const staticContent = existingContent as ContentItem[];

export const getContentItems = cache(async (): Promise<ContentItem[]> => {
  const supabase = await createClient();
  let databaseContent: ContentItem[] = [];

  if (supabase) {
    const { data, error } = await supabase
      .from("content")
      .select(
        "id, slug, title, description, content, category, image_url, published_at",
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("Unable to load Supabase content:", error.message);
    } else {
      databaseContent = ((data ?? []) as ContentRow[]).map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        description: item.description,
        content: item.content,
        category: item.category,
        imageUrl: item.image_url,
        publishedAt: item.published_at,
        source: "supabase",
      }));
    }
  }

  return [...staticContent, ...databaseContent].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
});
