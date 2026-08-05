export type ProductTerm = {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
  description: string;
  parentId: number;
};

export type ProductImage = {
  id: number | string;
  title: string;
  alt: string;
  caption: string;
  description: string;
  mimeType: string;
  file: string | null;
  sourceUrl: string;
  url: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  sku: string | null;
  price: string | null;
  regularPrice: string | null;
  salePrice: string | null;
  currency: string;
  stockStatus: string;
  stockQuantity: string | null;
  manageStock: boolean;
  featured: boolean;
  image: ProductImage | null;
  gallery: ProductImage[];
  models: Record<string, string>[];
  categories: ProductTerm[];
  tags: ProductTerm[];
  brands: ProductTerm[];
  attributes: ProductTerm[];
  dimensions: {
    weight: string | null;
    length: string | null;
    width: string | null;
    height: string | null;
  };
  createdAt: string;
  updatedAt: string;
  source: "json" | "supabase";
};
