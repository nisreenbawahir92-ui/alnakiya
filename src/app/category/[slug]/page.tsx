import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { SiteImage } from "@/components/site-image";
import {
  getProductCategories,
  getProducts,
  getStaticCategoryParams,
} from "@/lib/products";
import { decodeHtml } from "@/lib/text";
import { createPageMetadata } from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getStaticCategoryParams();
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getProductCategories();
  const category = categories.find((item) => item.slug === slug);
  if (!category) {
    return {
      title: "Category Not Found",
      robots: { index: false, follow: false },
    };
  }

  const name = decodeHtml(category.name);
  return createPageMetadata({
    title: name,
    description: `Browse ${name} products from Al Nakiya Trading in the UAE. ${category.productCount || ""} quality tools and hardware available with fast delivery.`.replace(
      /\s+/g,
      " ",
    ),
    path: `/category/${category.slug}`,
    keywords: [name, "Al Nakiya Trading", "industrial tools UAE"],
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  const categoryProducts = products.filter((product) =>
    product.categories.some((item) => item.slug === slug),
  );
  const heroImage = categoryProducts.find((product) => product.image)?.image;

  return (
    <main className="flex-1 bg-zinc-50">
      <section className="relative overflow-hidden bg-[#800517] px-4 py-12 text-white sm:px-6 sm:py-16">
        {heroImage && (
          <SiteImage
            src={heroImage.url}
            alt={heroImage.alt || decodeHtml(category.name)}
            fill
            priority
            optimizeWidth={1400}
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#800517]/95 via-[#800517]/90 to-[#0B3954]/75" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-200">
            Product Category
          </p>
          <h1 className="mt-2 text-3xl font-black sm:text-5xl">
            {decodeHtml(category.name)}
          </h1>
          <p className="mt-3 text-red-100">
            {categoryProducts.length} products
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard
              key={`${product.source}-${product.id}`}
              product={product}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
