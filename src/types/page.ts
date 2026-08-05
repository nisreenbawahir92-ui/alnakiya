import type { ProductImage, ProductTerm } from "./product";

export type WordPressPage = {
  id: string;
  type: "page" | "post" | "staticblocks" | "etheme_portfolio";
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  parentId: string;
  featuredImage: ProductImage | null;
  template: string | null;
  hadElementorData: boolean;
  terms: ProductTerm[];
  createdAt: string;
  updatedAt: string;
  source: "json";
};
