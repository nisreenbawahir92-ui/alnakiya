import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardProducts } from "@/lib/admin-catalog";
import { requireAdmin } from "@/lib/admin-session";
import { getProductCategories } from "@/lib/products";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function Dashboard() {
  const viewer = await requireAdmin();
  const [products, categories] = await Promise.all([
    getDashboardProducts(viewer.supabase),
    getProductCategories(),
  ]);
  const visibleProducts = products.filter((product) => !product.isDeleted);
  const editedProducts = products.filter(
    (product) => product.isOverridden,
  ).length;

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Welcome back, {viewer.email}
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="rounded-lg bg-[#2271b1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#135e96]"
          >
            Add New Product
          </Link>
        </div>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Products", visibleProducts.length, "/dashboard/products"],
            ["Categories", categories.length, "/dashboard/categories"],
            ["Media", 1455, "/dashboard/media"],
          ].map(([label, value, href]) => (
            <Link
              key={label}
              href={String(href)}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2271b1] hover:shadow-md"
            >
              <div className="text-3xl font-semibold text-[#2271b1]">
                {value}
              </div>
              <div className="mt-2 text-sm text-zinc-600">{label}</div>
            </Link>
          ))}
        </section>

        <div className="mt-7 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-300 px-5 py-4">
              <h2 className="text-lg font-semibold">Recent Products</h2>
              <Link
                href="/dashboard/products"
                className="text-sm text-[#2271b1]"
              >
                View All
              </Link>
            </div>
            <div className="divide-y divide-zinc-200">
              {visibleProducts.slice(0, 8).map((product) => (
                <div
                  key={`${product.source}-${product.id}`}
                  className="grid grid-cols-[1fr_auto] gap-4 px-5 py-3 text-sm"
                >
                  <div className="min-w-0">
                    <Link
                      href={
                        viewer.supabase
                          ? `/dashboard/products/${product.source}/${product.id}`
                          : `/product/${product.slug}`
                      }
                      className="block truncate font-semibold text-[#2271b1]"
                    >
                      {product.title}
                    </Link>
                    <div className="mt-1 text-xs text-zinc-500">
                      {product.category || "Uncategorized"}
                    </div>
                  </div>
                  <span className="font-semibold">
                    {product.price ? `د.إ${product.price}` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <div className="grid content-start gap-6">
            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Catalog Summary</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between border-b pb-3">
                  <dt>Edited JSON products</dt>
                  <dd className="font-semibold">{editedProducts}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Media assets</dt>
                  <dd className="font-semibold">1,455</dd>
                </div>
              </dl>
            </section>
            <section className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <div className="mt-4 grid gap-2 text-sm">
                <Link href="/dashboard/products/new" className="text-[#2271b1]">
                  Add a new product
                </Link>
                <Link href="/dashboard/products" className="text-[#2271b1]">
                  Manage products
                </Link>
                <Link href="/" className="text-[#2271b1]">
                  View website
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
