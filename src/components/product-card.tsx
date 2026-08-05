import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { decodeHtml } from "@/lib/text";
import type { Product } from "@/types/product";

export function ProductCard({ product }: { product: Product }) {
  const category = product.categories[0];
  const brand = product.brands[0];
  const imageUrl = product.image?.url;
  const title = decodeHtml(product.title);

  return (
    <article className="home-product-card group flex h-full flex-col bg-white">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-[#f4f5f6]"
      >
        {imageUrl ? (
          <SiteImage
            src={imageUrl}
            alt={product.image?.alt || title}
            fill
            optimizeWidth={480}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-400">
            Image unavailable
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col border border-t-0 border-zinc-200 px-3.5 pb-4 pt-3.5">
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500">
          {brand && <span>{decodeHtml(brand.name)}</span>}
          {brand && category && <span className="text-zinc-300">·</span>}
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-[#800517]"
            >
              {decodeHtml(category.name)}
            </Link>
          )}
        </div>

        <h3 className="line-clamp-2 min-h-[2.5rem] text-[15px] font-semibold leading-snug text-[#0B3954]">
          <Link
            href={`/product/${product.slug}`}
            className="transition-colors hover:text-[#800517]"
          >
            {title}
          </Link>
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="text-lg font-bold tracking-tight text-[#800517]">
            {product.price ? `د.إ${product.price}` : "Contact for price"}
          </div>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wide ${
              product.stockStatus === "instock"
                ? "text-emerald-700"
                : "text-zinc-400"
            }`}
          >
            {product.stockStatus === "instock" ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
