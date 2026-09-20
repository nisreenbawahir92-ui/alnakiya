import { cache } from "react";
import staticProductData from "@/data/products.json";
import { normalizeProductMedia } from "@/lib/media";
import { createPublicClient } from "@/lib/supabase/public";
import { stripHtml } from "@/lib/text";
import type { Product, ProductTerm } from "@/types/product";

/** Defer normalize work until first use — avoids Worker cold-start CPU (Error 1102). */
let staticProductsCache: Product[] | undefined;

function getStaticProducts(): Product[] {
  if (!staticProductsCache) {
    staticProductsCache = (staticProductData as Product[]).map((product) =>
      normalizeProductMedia(product),
    );
  }
  return staticProductsCache;
}

function withMedia(product: Product): Product {
  return normalizeProductMedia(product);
}

/** Lean product shape for catalog grids — drops heavy HTML fields from RSC payload. */
export function toShopListingProduct(product: Product): Product {
  return {
    ...product,
    description: "",
    shortDescription: stripHtml(product.shortDescription || "").slice(0, 240),
    gallery: [],
    attributes: [],
  };
}

export type ProductOverride = {
  legacy_id: string;
  product_data: Partial<Product>;
  is_deleted: boolean;
  updated_at: string;
};

type DatabaseProduct = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  short_description: string | null;
  sku: string | null;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  currency: string;
  stock_status: string;
  stock_quantity: number | null;
  image_url: string | null;
  gallery: Product["gallery"] | null;
  categories: ProductTerm[] | null;
  brands: ProductTerm[] | null;
  created_at: string;
  updated_at: string;
};

function fromDatabase(product: DatabaseProduct): Product {
  const image = product.image_url
    ? {
        id: product.id,
        title: product.title,
        alt: product.title,
        caption: "",
        description: "",
        mimeType: "image/webp",
        file: null,
        sourceUrl: product.image_url,
        url: product.image_url,
      }
    : null;

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description ?? "",
    shortDescription: product.short_description ?? "",
    sku: product.sku,
    price: product.price?.toString() ?? null,
    regularPrice: product.regular_price?.toString() ?? null,
    salePrice: product.sale_price?.toString() ?? null,
    currency: product.currency,
    stockStatus: product.stock_status,
    stockQuantity: product.stock_quantity?.toString() ?? null,
    manageStock: product.stock_quantity !== null,
    featured: false,
    image,
    gallery: product.gallery ?? [],
    models: [],
    categories: product.categories ?? [],
    brands: product.brands ?? [],
    tags: [],
    attributes: [],
    dimensions: { weight: null, length: null, width: null, height: null },
    createdAt: product.created_at,
    updatedAt: product.updated_at,
    source: "supabase",
  };
}

export const getProductOverrides = cache(
  async (): Promise<ProductOverride[]> => {
    const supabase = createPublicClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("product_overrides")
      .select("legacy_id, product_data, is_deleted, updated_at");

    if (error) {
      console.error("Unable to load product overrides:", error.message);
      return [];
    }

    return (data ?? []) as ProductOverride[];
  },
);

export async function getAdminStaticProducts() {
  const overrides = await getProductOverrides();
  const overrideMap = new Map(
    overrides.map((override) => [override.legacy_id, override]),
  );

  return getStaticProducts().map((baseProduct) => {
    const override = overrideMap.get(baseProduct.id);
    const product = override
      ? {
          ...baseProduct,
          ...override.product_data,
          id: baseProduct.id,
          source: "json" as const,
        }
      : baseProduct;

    return {
      product,
      isOverridden: Boolean(override),
      isDeleted: override?.is_deleted ?? false,
    };
  });
}

/** JSON-only params safe for generateStaticParams (no cookies). */
export function getStaticProductParams() {
  return getStaticProducts().map((product) => ({ slug: product.slug }));
}

export function getStaticCategoryParams() {
  const slugs = new Set<string>();
  for (const product of getStaticProducts()) {
    for (const category of product.categories) {
      slugs.add(category.slug);
    }
  }
  return [...slugs].map((slug) => ({ slug }));
}

export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = createPublicClient();
  if (!supabase) return getStaticProducts();

  const [{ data, error }, adminStaticProducts] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, slug, title, description, short_description, sku, price, regular_price, sale_price, currency, stock_status, stock_quantity, image_url, gallery, categories, brands, created_at, updated_at",
      )
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    getAdminStaticProducts(),
  ]);

  if (error) {
    console.error("Unable to load Supabase products:", error.message);
  }

  return [
    ...adminStaticProducts
      .filter((item) => !item.isDeleted)
      .map((item) => withMedia(item.product)),
    ...((data ?? []) as DatabaseProduct[]).map((row) => withMedia(fromDatabase(row))),
  ];
});

export const getProductBySlug = cache(async (slug: string) => {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
});

export async function getProductCategories() {
  const supabase = createPublicClient();
  const products = await getProducts();
  const { data: savedCategories } = supabase
    ? await supabase
        .from("product_categories")
        .select("id, name, slug, description")
        .order("name")
    : { data: [] };
  const categories = new Map<string, ProductTerm & { productCount: number }>();

  for (const category of savedCategories ?? []) {
    categories.set(category.slug, {
      id: 0,
      name: category.name,
      slug: category.slug,
      taxonomy: "product_cat",
      description: category.description ?? "",
      parentId: 0,
      productCount: 0,
    });
  }

  for (const product of products) {
    for (const category of product.categories) {
      const current = categories.get(category.slug);
      categories.set(category.slug, {
        ...category,
        productCount: (current?.productCount ?? 0) + 1,
      });
    }
  }

  return [...categories.values()].sort(
    (a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name),
  );
}

export type ManagedCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

export async function getManagedCategories(): Promise<ManagedCategory[]> {
  const supabase = createPublicClient();
  const products = await getProducts();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("product_categories")
    .select("id, name, slug, description")
    .order("name");

  if (error) {
    console.error("Unable to load managed categories:", error.message);
    return [];
  }

  return (data ?? []).map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    productCount: products.filter((product) =>
      product.categories.some((entry) => entry.slug === category.slug),
    ).length,
  }));
}
