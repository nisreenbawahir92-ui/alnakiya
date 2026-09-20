import type { Metadata } from "next";
import { Suspense } from "react";
import { SiteImage } from "@/components/site-image";
import { ShopCatalog } from "@/components/shop-catalog";
import {
  getProductCategories,
  getProducts,
  toShopListingProduct,
} from "@/lib/products";
import { createPageMetadata } from "@/lib/seo";

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

/** Rebuild catalog hourly; filtering runs client-side so the page stays static. */
export const revalidate = 3600;

export default async function Shop() {
  const [allProducts, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);
  const products = allProducts.map(toShopListingProduct);

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
            {products.length}+ product pages · search and filter below
          </p>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-12 text-center text-zinc-500">
            Loading catalog…
          </div>
        }
      >
        <ShopCatalog products={products} categories={categories} />
      </Suspense>
    </main>
  );
}
