import type { Metadata } from "next";
import Link from "next/link";
import { createProduct } from "@/app/dashboard/actions";
import { requireAdminViewer } from "@/lib/admin-session";
import { getProductCategories } from "@/lib/products";
import { decodeHtml } from "@/lib/text";

export const metadata: Metadata = {
  title: "Add New Product",
  robots: { index: false, follow: false },
};

type NewProductPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  const [, categories, status] = await Promise.all([
    requireAdminViewer(),
    getProductCategories(),
    searchParams,
  ]);

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Add New Product</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Add product details, inventory, category and image.
            </p>
          </div>
          <Link
            href="/dashboard/products"
            className="rounded-lg border border-[#2271b1] px-4 py-2 text-sm font-semibold text-[#2271b1]"
          >
            View Products
          </Link>
        </div>

        {status.error && (
          <div className="mt-5 border-l-4 border-red-500 bg-white p-4 text-sm shadow-sm">
            {status.error === "slug"
              ? "A product with this slug already exists."
              : status.error === "image"
                ? "Use a JPG, PNG or WebP image smaller than 5 MB."
                : status.error === "upload"
                  ? "Image upload failed. Please try again."
                  : "Product could not be saved. Check all required fields."}
          </div>
        )}

        <form action={createProduct} className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid content-start gap-5">
              <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                <label className="text-sm font-semibold" htmlFor="title">
                  Product name
                </label>
                <input
                  id="title"
                  required
                  name="title"
                  maxLength={200}
                  placeholder="Enter product name"
                  className="mt-2 h-12 w-full rounded-lg border border-zinc-300 px-4 text-base outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10 sm:text-lg"
                />
              </section>

              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <h2 className="border-b border-zinc-300 px-5 py-3 font-semibold">
                  Product description
                </h2>
                <div className="p-4 sm:p-5">
                  <textarea
                    name="description"
                    rows={12}
                    maxLength={20000}
                    placeholder="Full product description"
                    className="w-full rounded-lg border border-zinc-300 p-4 outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                  />
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <h2 className="border-b border-zinc-300 px-5 py-3 font-semibold">
                  Product short description
                </h2>
                <div className="p-4 sm:p-5">
                  <textarea
                    name="shortDescription"
                    rows={6}
                    maxLength={5000}
                    placeholder="Short details, models, sizes, or packaging"
                    className="w-full rounded-lg border border-zinc-300 p-4 outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                  />
                </div>
              </section>
            </div>

            <aside className="grid content-start gap-5">
              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <h2 className="border-b border-zinc-300 px-4 py-3 font-semibold">
                  Publish
                </h2>
                <div className="grid gap-4 p-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input name="published" type="checkbox" defaultChecked />
                    Publish immediately
                  </label>
                  <button className="rounded-lg bg-[#2271b1] px-5 py-3 font-semibold text-white shadow-sm hover:bg-[#135e96]">
                    Publish Product
                  </button>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <h2 className="border-b border-zinc-300 px-4 py-3 font-semibold">
                  Product data
                </h2>
                <div className="grid gap-4 p-4">
                  <label className="grid gap-1.5 text-sm">
                    Price (AED) *
                    <input
                      required
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      className="h-11 rounded-lg border border-zinc-300 px-3 outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    SKU
                    <input
                      name="sku"
                      maxLength={100}
                      className="h-11 rounded-lg border border-zinc-300 px-3 outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                    />
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    Stock status
                    <select
                      name="stockStatus"
                      className="h-11 rounded-lg border border-zinc-300 px-3 outline-none focus:border-[#2271b1]"
                    >
                      <option value="instock">In stock</option>
                      <option value="outofstock">Out of stock</option>
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-sm">
                    Custom slug
                    <input
                      name="slug"
                      maxLength={220}
                      placeholder="Generated automatically"
                      className="h-11 rounded-lg border border-zinc-300 px-3 outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                    />
                  </label>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <h2 className="border-b border-zinc-300 px-4 py-3 font-semibold">
                  Product category
                </h2>
                <div className="p-4">
                  <select
                    required
                    name="category"
                    className="h-11 w-full rounded-lg border border-zinc-300 px-3 outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category.slug}
                        value={decodeHtml(category.name)}
                      >
                        {decodeHtml(category.name)}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-zinc-500">
                    New categories added from Categories will appear here.
                  </p>
                </div>
              </section>

              <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <h2 className="border-b border-zinc-300 px-4 py-3 font-semibold">
                  Product image
                </h2>
                <div className="p-4">
                  <input
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="w-full rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#2271b1] file:px-3 file:py-2 file:font-semibold file:text-white"
                  />
                  <p className="mt-2 text-xs text-zinc-500">
                    JPG, PNG or WebP. Maximum 5 MB.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}
