import { getAdminStaticProducts } from "@/lib/products";
import { createClient } from "@/lib/supabase/server";
import { decodeHtml } from "@/lib/text";

type SupabaseClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export type DashboardProduct = {
  id: string;
  title: string;
  slug: string;
  sku: string | null;
  price: string | null;
  stockStatus: string;
  category: string;
  source: "json" | "supabase";
  published: boolean;
  isDeleted: boolean;
  isOverridden: boolean;
};

export async function getDashboardProducts(
  supabase: SupabaseClient | null,
): Promise<DashboardProduct[]> {
  const [adminStaticProducts, databaseResult] = await Promise.all([
    getAdminStaticProducts(),
    supabase
      ? supabase
          .from("products")
          .select(
            "id, title, slug, sku, price, stock_status, categories, is_published, created_at",
          )
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);
  const databaseProducts = databaseResult.data ?? [];

  return [
    ...adminStaticProducts.map(({ product, isDeleted, isOverridden }) => ({
      id: product.id,
      title: decodeHtml(product.title),
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      stockStatus: product.stockStatus,
      category: product.categories[0]
        ? decodeHtml(product.categories[0].name)
        : "",
      source: "json" as const,
      published: !isDeleted,
      isDeleted,
      isOverridden,
    })),
    ...databaseProducts.map((product) => {
      const categories = (product.categories ?? []) as Array<{ name?: string }>;
      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        price: product.price?.toString() ?? null,
        stockStatus: product.stock_status,
        category: categories[0]?.name ?? "",
        source: "supabase" as const,
        published: product.is_published,
        isDeleted: false,
        isOverridden: false,
      };
    }),
  ];
}
