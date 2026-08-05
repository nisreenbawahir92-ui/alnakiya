"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { decodeHtml, stripHtml } from "@/lib/text";
import type { Product, ProductTerm } from "@/types/product";

export type ShopCategory = ProductTerm & { productCount: number };

type ShopCatalogProps = {
  products: Product[];
  categories: ShopCategory[];
};

function pageHref(q: string, category: string, page: number) {
  const search = new URLSearchParams();
  if (q) search.set("q", q);
  if (category) search.set("category", category);
  if (page > 1) search.set("page", page.toString());
  const query = search.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function ShopCatalog({ products, categories }: ShopCatalogProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category") ?? "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = 24;

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        !category ||
        product.categories.some((item) => item.slug === category);
      const searchable = [
        product.title,
        product.sku,
        product.shortDescription,
        ...product.categories.map((item) => item.name),
        ...product.brands.map((item) => item.name),
        ...product.models.flatMap((model) => Object.values(model)),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || stripHtml(searchable).includes(query));
    });
  }, [products, category, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const modelEntryCount = filtered.reduce(
    (total, product) => total + (product.models.length || 1),
    0,
  );
  const safePage = Math.min(currentPage, pageCount);
  const visibleProducts = filtered.slice(
    (safePage - 1) * perPage,
    safePage * perPage,
  );

  const qParam = searchParams.get("q") ?? "";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="mb-6 text-sm text-zinc-600">
        {filtered.length} product pages · {modelEntryCount} models and sizes
      </p>
        <form className="mb-8 flex max-w-2xl" action="/shop" method="get">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            name="q"
            defaultValue={qParam}
            placeholder="Search by product, category, brand or SKU"
            className="h-12 min-w-0 flex-1 rounded-l-xl border border-zinc-300 bg-white px-4 outline-none focus:border-red-800"
          />
          <button className="rounded-r-xl bg-[#800517] px-4 font-bold text-white sm:px-6">
            Search
          </button>
        </form>

        <details className="mb-6 rounded-xl border border-zinc-200 bg-white lg:hidden">
          <summary className="cursor-pointer px-4 py-3 font-bold">
            Filter by Category
          </summary>
          <div className="max-h-72 space-y-1 overflow-y-auto border-t p-3">
            <Link
              href={qParam ? `/shop?q=${encodeURIComponent(qParam)}` : "/shop"}
              className="block rounded-lg px-3 py-2 text-sm"
            >
              All Products ({products.length})
            </Link>
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/shop?category=${item.slug}${qParam ? `&q=${encodeURIComponent(qParam)}` : ""}`}
                className={`flex justify-between rounded-lg px-3 py-2 text-sm ${
                  category === item.slug
                    ? "bg-red-50 font-bold text-red-900"
                    : "hover:bg-zinc-100"
                }`}
              >
                <span>{decodeHtml(item.name)}</span>
                <span className="text-zinc-400">{item.productCount}</span>
              </Link>
            ))}
          </div>
        </details>

        <div className="grid gap-9 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-36 rounded-2xl border border-zinc-200 bg-white p-5">
              <h2 className="mb-4 font-black text-zinc-950">Categories</h2>
              <div className="max-h-[65vh] space-y-1 overflow-auto pr-2">
                <Link
                  href={qParam ? `/shop?q=${encodeURIComponent(qParam)}` : "/shop"}
                  className={`flex justify-between rounded-lg px-3 py-2 text-sm ${
                    !category ? "bg-red-50 font-bold text-red-900" : "hover:bg-zinc-100"
                  }`}
                >
                  <span>All Products</span>
                  <span>{products.length}</span>
                </Link>
                {categories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/shop?category=${item.slug}${qParam ? `&q=${encodeURIComponent(qParam)}` : ""}`}
                    className={`flex justify-between gap-3 rounded-lg px-3 py-2 text-sm ${
                      category === item.slug
                        ? "bg-red-50 font-bold text-red-900"
                        : "hover:bg-zinc-100"
                    }`}
                  >
                    <span>{decodeHtml(item.name)}</span>
                    <span className="text-zinc-400">{item.productCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div>
            {visibleProducts.length ? (
              <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={`${product.source}-${product.id}`} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white p-12 text-center">
                <h2 className="text-xl font-bold">No products found</h2>
                <Link href="/shop" className="mt-3 inline-block text-red-800">
                  Clear filters
                </Link>
              </div>
            )}

            {pageCount > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-3">
                {safePage > 1 && (
                  <Link
                    href={pageHref(qParam, category, safePage - 1)}
                    className="rounded-lg border bg-white px-4 py-2 font-semibold"
                  >
                    Previous
                  </Link>
                )}
                <span className="px-3 text-sm text-zinc-600">
                  Page {safePage} of {pageCount}
                </span>
                {safePage < pageCount && (
                  <Link
                    href={pageHref(qParam, category, safePage + 1)}
                    className="rounded-lg border bg-white px-4 py-2 font-semibold"
                  >
                    Next
                  </Link>
                )}
              </nav>
            )}
          </div>
        </div>
    </div>
  );
}
