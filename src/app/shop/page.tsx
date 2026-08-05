import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SiteImage } from "@/components/site-image";
import { getProductCategories, getProducts } from "@/lib/products";
import { createPageMetadata } from "@/lib/seo";
import { decodeHtml, stripHtml } from "@/lib/text";

export const metadata: Metadata = createPageMetadata({
  title: "Shop Industrial Tools",
  description:
    "Browse 488+ industrial tools, hardware, electrical accessories and building materials from Al Nakiya Trading. Search by product, brand, SKU or category.",
  path: "/shop",
  image: "/uploads/2025/10/Nakiya-post-1-1-scaled.jpg",
  keywords: [
    "shop industrial tools UAE",
    "buy hardware Sharjah",
    "tool catalog UAE",
  ],
});

type ShopProps = {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
};

export default async function Shop({ searchParams }: ShopProps) {
  const params = await searchParams;
  const query = params.q?.trim().toLowerCase() ?? "";
  const category = params.category ?? "";
  const currentPage = Math.max(1, Number(params.page) || 1);
  const perPage = 24;
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  const filtered = products.filter((product) => {
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
  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q);
    if (category) search.set("category", category);
    search.set("page", page.toString());
    return `/shop?${search.toString()}`;
  };

  return (
    <main className="flex-1 bg-zinc-50">
      <section className="relative overflow-hidden px-4 py-12 text-white sm:px-6 sm:py-16">
        <SiteImage
          src="/uploads/2025/10/Nakiya-post-1-1-scaled.jpg"
          alt="Industrial products catalog"
          fill
          priority
          optimizeWidth={1600}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3954]/95 via-[#0B3954]/85 to-[#126782]/60" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            Complete catalog
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">
            Shop Industrial Products
          </h1>
          <p className="mt-3 text-zinc-400">
            {filtered.length} product pages · {modelEntryCount} models and sizes
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <form className="mb-8 flex max-w-2xl" action="/shop">
          {category && <input type="hidden" name="category" value={category} />}
          <input
            name="q"
            defaultValue={params.q}
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
              href={params.q ? `/shop?q=${encodeURIComponent(params.q)}` : "/shop"}
              className="block rounded-lg px-3 py-2 text-sm"
            >
              All Products ({products.length})
            </Link>
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/shop?category=${item.slug}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
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
                  href={params.q ? `/shop?q=${encodeURIComponent(params.q)}` : "/shop"}
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
                    href={`/shop?category=${item.slug}${params.q ? `&q=${encodeURIComponent(params.q)}` : ""}`}
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
                    href={pageHref(safePage - 1)}
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
                    href={pageHref(safePage + 1)}
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
    </main>
  );
}
