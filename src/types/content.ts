export type ContentItem = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  category: string;
  imageUrl: string | null;
  publishedAt: string;
  source: "json" | "supabase";
};
