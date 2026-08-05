import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProduct } from "@/app/dashboard/actions";
import { requireAdmin } from "@/lib/admin-session";
import {
  getAdminStaticProducts,
  getProductCategories,
} from "@/lib/products";
import { decodeHtml } from "@/lib/text";

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
};

type EditProductProps = {
  params: Promise<{ source: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditProduct({
  params,
  searchParams,
}: EditProductProps) {
  const [{ source, id }, query] = await Promise.all([params, searchParams]);
  if (!["json", "supabase"].includes(source)) notFound();

  const viewer = await requireAdmin();
  const supabase = viewer.supabase;
  const categories = await getProductCategories();

  let product:
    | {
        id: string;
        title: string;
        slug: string;
        price: string | null;
        sku: string | null;
        category: string;
        shortDescription: string;
        description: string;
        stockStatus: string;
        imageUrl: string | null;
      }
    | undefined;

  if (source === "json") {
    const item = (await getAdminStaticProducts()).find(
      (entry) => entry.product.id === id,
    );
    if (item) {
      product = {
        id: item.product.id,
        title: decodeHtml(item.product.title),
        slug: item.product.slug,
        price: item.product.price,
        sku: item.product.sku,
        category: item.product.categories[0]
          ? decodeHtml(item.product.categories[0].name)
          : "",
        shortDescription: item.product.shortDescription,
        description: item.product.description,
        stockStatus: item.product.stockStatus,
        imageUrl:
          item.product.image?.url ?? item.product.image?.sourceUrl ?? null,
      };
    }
  } else {
    const { data } = await supabase
      .from("products")
      .select(
        "id, title, slug, price, sku, categories, short_description, description, stock_status, image_url",
      )
      .eq("id", id)
      .maybeSingle();

    if (data) {
      const productCategories = (data.categories ?? []) as Array<{
        name?: string;
      }>;
      product = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        price: data.price?.toString() ?? null,
        sku: data.sku,
        category: productCategories[0]?.name ?? "",
        shortDescription: data.short_description ?? "",
        description: data.description ?? "",
        stockStatus: data.stock_status ?? "instock",
        imageUrl: data.image_url,
      };
    }
  }

  if (!product) notFound();

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Edit Product</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Update product information, stock, category and image.
            </p>
          </div>
          <Link
            href="/dashboard/products"
            className="rounded-lg border border-[#2271b1] px-4 py-2 text-sm font-semibold text-[#2271b1]"
          >
            All Products
          </Link>
        </div>
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {source === "json" && (
            <p className="border-b border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Changes will be stored in Supabase. The original JSON record
              remains safe and can be restored from the dashboard.
            </p>
          )}
          {query.error && (
            <div className="border-b border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">
              {query.error === "slug"
                ? "That slug is already used by another product."
                : query.error === "image"
                  ? "Use a JPG, PNG or WebP image smaller than 5 MB."
                  : query.error === "upload"
                    ? "Image upload failed. Please try again."
                    : "Check the required fields and try again."}
            </div>
          )}

          <form action={updateProduct}>
            <div className="grid gap-6 p-4 sm:p-6 lg:p-8">
              <input type="hidden" name="source" value={source} />
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="originalSlug" value={product.slug} />
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Product title *
                  <input
                    required
                    name="title"
                    defaultValue={product.title}
                    className="h-11 rounded-xl border border-zinc-300 px-4"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Slug *
                  <input
                    required
                    name="slug"
                    defaultValue={product.slug}
                    className="h-11 rounded-xl border border-zinc-300 px-4"
                  />
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <label className="grid gap-2 text-sm font-semibold">
                  Category *
                  <select
                    required
                    name="category"
                    defaultValue={product.category}
                    className="h-11 rounded-xl border border-zinc-300 px-4"
                  >
                    {!categories.some(
                      (category) =>
                        decodeHtml(category.name) === product.category,
                    ) && (
                      <option value={product.category}>
                        {product.category}
                      </option>
                    )}
                    {categories.map((category) => (
                      <option
                        key={category.slug}
                        value={decodeHtml(category.name)}
                      >
                        {decodeHtml(category.name)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  SKU
                  <input
                    name="sku"
                    defaultValue={product.sku ?? ""}
                    className="h-11 rounded-xl border border-zinc-300 px-4"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Price (AED)
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={product.price ?? ""}
                    className="h-11 rounded-xl border border-zinc-300 px-4"
                  />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Stock status
                  <select
                    name="stockStatus"
                    defaultValue={product.stockStatus}
                    className="h-11 rounded-xl border border-zinc-300 px-4"
                  >
                    <option value="instock">In stock</option>
                    <option value="outofstock">Out of stock</option>
                  </select>
                </label>
              </div>
              <label className="grid gap-2 text-sm font-semibold">
                Short description
                <textarea
                  name="shortDescription"
                  rows={7}
                  defaultValue={product.shortDescription}
                  className="rounded-xl border border-zinc-300 p-4 font-mono text-sm"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                Full description
                <textarea
                  name="description"
                  rows={8}
                  defaultValue={product.description}
                  className="rounded-xl border border-zinc-300 p-4 font-mono text-sm"
                />
              </label>
              <div className="grid gap-3">
                <p className="text-sm font-semibold">Product image</p>
                {product.imageUrl && (
                  <div className="relative h-40 w-40 overflow-hidden bg-zinc-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-contain"
                      sizes="160px"
                    />
                  </div>
                )}
                <input
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#2271b1] file:px-3 file:py-2 file:font-semibold file:text-white"
                />
                <p className="text-xs text-zinc-500">
                  Leave empty to keep the current image. JPG, PNG or WebP.
                  Maximum 5 MB.
                </p>
              </div>
              <button className="w-full rounded-lg bg-[#2271b1] px-7 py-3 font-bold text-white shadow-sm hover:bg-[#135e96] sm:w-auto sm:justify-self-end">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
