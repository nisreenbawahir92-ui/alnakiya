import type { Metadata } from "next";
import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { getProductBySlug, getProducts, getStaticProductParams } from "@/lib/products";
import { createPageMetadata } from "@/lib/seo";
import { safeProductHtml } from "@/lib/safe-html";
import { decodeHtml, stripHtml } from "@/lib/text";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getStaticProductParams();
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return {
      title: "Product Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = decodeHtml(product.title);
  const description =
    stripHtml(product.shortDescription || product.description).slice(0, 155) ||
    `Buy ${title} from Al Nakiya Trading in the UAE. Quality industrial tools with fast delivery.`;
  const image = product.image?.url || "/icons/og-icon.png";

  return createPageMetadata({
    title,
    description,
    path: `/product/${product.slug}`,
    image,
    keywords: [
      title,
      ...product.categories.map((item) => decodeHtml(item.name)),
      ...product.brands.map((item) => decodeHtml(item.name)),
      "Al Nakiya Trading",
      "UAE",
    ].filter(Boolean),
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const products = await getProducts();
  const categorySlugs = new Set(product.categories.map((item) => item.slug));
  const related = products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        item.categories.some((category) => categorySlugs.has(category.slug)),
    )
    .slice(0, 4);
  const productName = decodeHtml(product.title);
  const html = safeProductHtml(
    [product.shortDescription, product.description].filter(Boolean).join("\n"),
  );
  const inquiryUrl = `https://wa.me/971506859158?text=${encodeURIComponent(
    `Hello, I am interested in ${productName}${product.sku ? ` (SKU: ${product.sku})` : ""}.`,
  )}`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    image: product.image?.url,
    description: stripHtml(product.shortDescription || product.description),
    sku: product.sku ?? product.id,
    brand: product.brands[0]
      ? { "@type": "Brand", name: decodeHtml(product.brands[0].name) }
      : undefined,
    offers: product.price
      ? {
          "@type": "Offer",
          priceCurrency: product.currency,
          price: product.price,
          availability:
            product.stockStatus === "instock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          url: `/product/${product.slug}`,
        }
      : undefined,
  };

  return (
    <main className="flex-1 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="border-b bg-zinc-50">
        <div className="mx-auto max-w-7xl truncate px-4 py-4 text-sm text-zinc-500 sm:px-6">
          <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{" "}
          <span className="text-zinc-900">{productName}</span>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:gap-10">
        <div>
          <div className="relative aspect-square overflow-hidden bg-white">
            {product.image ? (
              <SiteImage
                src={product.image.url}
                alt={product.image.alt || productName}
                fill
                priority
                optimizeWidth={960}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                Image unavailable
              </div>
            )}
          </div>
          {product.gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {product.gallery.slice(0, 5).map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden bg-zinc-50"
                >
                  <SiteImage
                    src={image.url}
                    alt={image.alt || productName}
                    fill
                    optimizeWidth={240}
                    sizes="120px"
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-center text-center lg:py-5">
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {product.categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-900"
              >
                {decodeHtml(category.name)}
              </Link>
            ))}
          </div>
          <h1 className="text-3xl font-black leading-tight text-zinc-950 sm:text-5xl">
            {productName}
          </h1>
          <div className="mt-6 text-3xl font-black text-[#800517]">
            {product.price ? `د.إ${product.price}` : "Contact for price"}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
            {product.sku && <span>SKU: {product.sku}</span>}
            <span>
              Availability:{" "}
              <strong className="text-emerald-700">
                {product.stockStatus === "instock" ? "In stock" : "Out of stock"}
              </strong>
            </span>
            {product.brands[0] && (
              <span>Brand: {decodeHtml(product.brands[0].name)}</span>
            )}
          </div>

          <AddToCart
            product={{
              id: `${product.source}-${product.id}`,
              slug: product.slug,
              title: productName,
              price: Number(product.price ?? 0),
              imageUrl: product.image?.url ?? null,
            }}
            whatsappUrl={inquiryUrl}
          />

          <div className="mt-7 w-full max-w-md border-y border-zinc-200 py-5 text-center">
            <h2 className="font-semibold text-[#0B3954]">Shipping Info</h2>
            <p className="mt-2 text-sm leading-6 text-[#5C676D]">
              Order by 2PM to get delivered next working day. We use fast
              courier services in most cases so your order arrives on time.
            </p>
          </div>

          {html && (
            <div
              className="product-content mt-8 w-full leading-7 text-zinc-700"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          )}

          <div className="mt-7 grid w-full max-w-md gap-2 border-t border-zinc-200 pt-5 text-center text-sm text-[#5C676D]">
            <span>Free shipping on all qualifying orders</span>
            <span>Cash on delivery available</span>
            <span>Next day delivery within the UAE</span>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-zinc-100">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#800517] sm:text-4xl">
                Related Products
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={`${item.source}-${item.id}`} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
