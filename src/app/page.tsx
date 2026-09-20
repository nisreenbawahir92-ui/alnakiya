import type { Metadata } from "next";
import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { HeroCarousel } from "@/components/hero-carousel";
import { HomeEffects } from "@/components/home-effects";
import { ProductCard } from "@/components/product-card";
import { TiltCard } from "@/components/tilt-card";
import { getProducts } from "@/lib/products";
import { createPageMetadata, INSTAGRAM_URL } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Industrial Tools & Hardware UAE",
  description:
    "Buy industrial tools, power tools, hand tools, electrical accessories and hardware from Al Nakiya Trading in Sharjah, UAE. Quality brands with fast delivery.",
  path: "/",
  image: "/uploads/2025/10/hand4-1.jpg",
  keywords: [
    "industrial tools UAE",
    "hardware Sharjah",
    "Al Nakiya Trading",
    "power tools UAE",
  ],
});

const bestSellerPosts = [
  {
    url: "https://www.instagram.com/p/DPeyI-wk3WS/",
    image: "/uploads/2025/10/1.jpg",
  },
  {
    url: "https://www.instagram.com/p/DPme1hYCGgl/",
    image: "/uploads/2025/10/2.jpg",
  },
  {
    url: "https://www.instagram.com/p/DPe68A4CPdf/",
    image: "/uploads/2025/10/3.jpg",
  },
  {
    url: "https://www.instagram.com/p/DPhWLFECHf-/",
    image: "/uploads/2025/10/4.jpg",
  },
  {
    url: "https://www.instagram.com/p/DPjybdjiGyd/",
    image: "/uploads/2025/10/5.jpg",
  },
  {
    url: "https://www.instagram.com/p/DPmeCAdiKxm/",
    image: "/uploads/2025/10/6.jpg",
  },
  {
    url: "https://www.instagram.com/p/DPe18U2CHaf/",
    image: "/uploads/2025/10/7.jpg",
  },
  {
    url: "https://www.instagram.com/p/DPmeXefiBzC/",
    image: "/uploads/2025/10/8.jpg",
  },
] as const;

function pickFeaturedProducts(
  catalog: Awaited<ReturnType<typeof getProducts>>,
  preferredSlugs: string[],
  count: number,
) {
  const picked: typeof catalog = [];
  const seen = new Set<string>();

  for (const slug of preferredSlugs) {
    const product = catalog.find((item) => item.slug === slug);
    if (!product?.image?.url || seen.has(product.id)) continue;
    picked.push(product);
    seen.add(product.id);
    if (picked.length >= count) return picked;
  }

  for (const product of catalog) {
    if (!product.image?.url || seen.has(product.id)) continue;
    picked.push(product);
    seen.add(product.id);
    if (picked.length >= count) break;
  }

  return picked;
}

export default async function Home() {
  const products = await getProducts();
  const mostSold = pickFeaturedProducts(
    products,
    [
      "demoltion-hammer",
      "demoltion-hammer-2",
      "rotary-hammer-2",
      "multifunction-bar-bending-tool",
    ],
    4,
  );
  const backInStock = pickFeaturedProducts(
    products,
    [
      "cable-cutter-2",
      "mini-bolt-cutter",
      "aviation-tin-snip-straight",
      "tin-snip-cutter-berent",
    ],
    4,
  );
  return (
    <main className="home-page flex-1 bg-white">
      <HomeEffects />
      <HeroCarousel />

      <section className="font-sans">
        <h2 className="bg-white px-4 pb-6 pt-4 text-center text-3xl font-bold text-[#800517] sm:px-0 sm:py-10 sm:text-5xl">
          Our Categories
        </h2>
        <div className="flex flex-col">
          {[
            {
              title: "Hand Tools",
              slug: "hardware-tool-accessories",
              image: "/uploads/2025/10/hand4-1.jpg",
              color: "bg-black",
              copy: "Discover versatile accessories that seamlessly enhance both functionality and style, perfectly complementing your hardware and tools.",
              imageFirst: false,
            },
            {
              title: "Power Tools",
              slug: "power-tool",
              image: "/uploads/2025/10/Nakiya-post-1-1-scaled.jpg",
              color: "bg-black",
              copy: "Explore our extensive range of high-quality hardware, designed to meet all your architectural and construction needs with durability and precision.",
              imageFirst: true,
            },
            {
              title: "Electrical Product",
              slug: "electrical-accessories",
              image: "/uploads/2025/10/e1-1.jpg",
              color: "bg-black",
              copy: "Power up your spaces with our innovative electrical products, offering exceptional quality, safety, and modern design for every application.",
              imageFirst: false,
            },
          ].map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className="group flex min-h-[360px] flex-col overflow-hidden md:min-h-[420px] md:flex-row"
            >
              <div
                className={`relative min-h-[260px] flex-1 overflow-hidden sm:min-h-[320px] md:min-h-full ${
                  category.imageFirst ? "md:order-1" : "md:order-2"
                }`}
              >
                <SiteImage
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition duration-500 group-hover:scale-105"
                />
              </div>
              <div
                className={`${category.color} flex flex-1 flex-col justify-center p-7 text-white sm:p-10 md:order-1 md:p-14`}
              >
                <span className="mb-3 text-xs font-semibold uppercase tracking-wider">
                  Explore the features
                </span>
                <h3 className="text-3xl font-bold sm:text-4xl">
                  {category.title}
                </h3>
                <p className="mt-4 max-w-xl leading-7 text-white">
                  {category.copy}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-4 py-14 sm:px-6 sm:py-20">
        <h2 className="text-center text-3xl font-bold text-[#800517] sm:text-5xl">
          Brands We Deal With
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {[
            ["/uploads/2025/09/3.jpg", "BERENT"],
            ["/uploads/2025/09/2.jpg", "EMERALD"],
            ["/uploads/2025/09/4.jpg", "SENSH"],
            ["/uploads/2025/09/1.jpg", "MGC"],
          ].map(([image, brand]) => (
            <div
              key={brand}
              className="flex min-h-[140px] items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-8 shadow-[0_10px_30px_rgba(11,57,84,0.08)] sm:min-h-[170px] sm:px-8 sm:py-10"
            >
              <SiteImage
                src={image}
                alt={`${brand} logo`}
                width={320}
                height={120}
                className="h-auto max-h-[72px] w-full max-w-[280px] object-contain sm:max-h-[96px]"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 sm:px-6 sm:pb-20">
        <h2 className="mb-8 text-center text-3xl font-bold text-[#800517] sm:text-4xl">
          Our best seller
        </h2>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-[0_25px_60px_rgba(11,57,84,0.28)] sm:rounded-[20px] lg:max-h-[70vh] lg:aspect-auto lg:h-[70vh]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain sm:object-cover"
          >
            <source
              src="/uploads/2025/10/WhatsApp-Video-2025-09-07-at-12.06.20_199960d1.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-12">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-6 sm:gap-6 lg:grid-cols-4">
          {[
            [
              "/uploads/2023/02/Icon-6.svg",
              "4.9 / 5 TrustScore",
              "Rated “Excellent” on Trustpilot",
            ],
            [
              "/uploads/2023/02/Icon-1-2.svg",
              "Free Delivery",
              "Free Delivery for orders",
            ],
            [
              "/uploads/2023/02/Icon-2-2.svg",
              "Your trusted partner",
              "Driven by integrity and care.",
            ],
            [
              "/uploads/2023/02/Icon-3-1.svg",
              "We Only Stock",
              "Top brands stocked here.",
            ],
          ].map(([icon, title, copy]) => (
            <div
              key={title}
              className="home-float flex min-w-0 items-start gap-4 rounded-xl border border-zinc-100 bg-white px-4 py-5 shadow-[0_8px_24px_rgba(11,57,84,0.06)] sm:gap-5 sm:px-5"
            >
              <SiteImage
                src={icon}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-base font-medium text-[#0B3954] sm:text-[19px]">
                  {title}
                </div>
                <div className="mt-1 text-sm font-light text-[#5C676D] sm:text-base">
                  {copy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-14">
        <div className="border-b border-zinc-200 pb-6 text-center sm:pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#800517] sm:text-base">
            Featured
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#800517] sm:mt-3 sm:text-4xl lg:text-5xl">
            Most sold this week
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-[#800517]/80 sm:text-lg">
            Popular tools with next-day UAE delivery options.
          </p>
          <Link
            href="/shop"
            prefetch
            className="relative z-10 mt-5 inline-block text-base font-semibold text-[#800517] underline-offset-4 hover:underline"
          >
            View catalog
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 home-stagger min-[420px]:grid-cols-2 md:grid-cols-4 md:gap-5">
          {mostSold.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="bg-[#f7f8f9]">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-14">
          <div className="border-b border-zinc-200 pb-6 text-center sm:pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#800517] sm:text-base">
              Restocked
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#800517] sm:mt-3 sm:text-4xl lg:text-5xl">
              Back in stock this week
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[#800517]/80 sm:text-lg">
              Fast-selling products available again.
            </p>
            <Link
              href="/shop"
              prefetch
              className="relative z-10 mt-5 inline-block text-base font-semibold text-[#800517] underline-offset-4 hover:underline"
            >
              View all products
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 home-stagger min-[420px]:grid-cols-2 md:grid-cols-4 md:gap-5">
            {backInStock.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-6 sm:py-16">
          <div className="border-b border-zinc-200 pb-6 text-center sm:pb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#800517] sm:text-base">
              Best Seller
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#800517] sm:mt-3 sm:text-4xl lg:text-5xl">
              Top picks from Instagram
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-[#800517]/80 sm:text-lg">
              Explore our most popular products featured on Instagram.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-block text-base font-semibold text-[#800517] underline-offset-4 hover:underline"
            >
              Follow on Instagram
            </a>
          </div>
          <div className="mt-10 grid grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {bestSellerPosts.map((post) => (
              <a
                key={post.url}
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-[0_10px_30px_rgba(11,57,84,0.08)]"
              >
                <SiteImage
                  src={post.image}
                  alt="Al Nakiya Trading best seller on Instagram"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                  View on Instagram
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 text-center sm:px-6 sm:py-16">
        <h2 className="text-3xl font-semibold text-[#800517] sm:text-4xl">
          Why Choose AL Nakiya Trading?
        </h2>
        <div className="mt-11 grid grid-cols-2 items-stretch gap-4 home-stagger md:grid-cols-4 md:gap-6">
          {[
            ["/uploads/2025/10/image-1.svg", "Quality Products"],
            ["/uploads/2025/10/image-2.svg", "Wide Range of Tools From The Top Brands"],
            ["/uploads/2025/10/image-3.svg", "Delivery On Time"],
            ["/uploads/2025/10/image-4.svg", "24×7 Support"],
          ].map(([image, title]) => (
            <TiltCard key={title} maxTilt={12} className="h-full">
              <div className="flex h-full min-h-[240px] flex-col items-center rounded-2xl border border-zinc-100 bg-white px-4 py-6 shadow-[0_12px_30px_rgba(11,57,84,0.08)] sm:min-h-[260px]">
                <div className="flex h-[100px] w-full shrink-0 items-center justify-center">
                  <SiteImage
                    src={image}
                    alt=""
                    width={100}
                    height={100}
                    className="h-[100px] w-[100px] object-contain"
                  />
                </div>
                <h3 className="mt-auto flex min-h-[4.5rem] items-center justify-center pt-5 text-center text-xs font-semibold uppercase leading-snug text-red-600 sm:text-sm lg:text-base">
                  {title}
                </h3>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      <section className="bg-[#f8f9fa] px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-[#800517]">
            What Our Clients Say?
          </p>
          <h2 className="mt-2 text-center text-3xl font-semibold text-[#0B3954] sm:text-4xl">
            Testimonials
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-5 home-stagger sm:grid-cols-2 md:grid-cols-3">
            {[
              [
                "/uploads/2025/10/user1.jpg",
                "Good and friendly place to purchase marine hardware.",
                "PRASHANT GUPTA",
              ],
              [
                "/uploads/2025/10/user2.jpg",
                "Always best price n best quality.",
                "GR SHK",
              ],
              [
                "/uploads/2025/10/user3.jpg",
                "Highly recommend for quality and service.",
                "ANITA ROSS",
              ],
              [
                "/uploads/2025/10/user4.jpg",
                "Wide range of tools and very helpful staff.",
                "AHMED KHAN",
              ],
              [
                "/uploads/2025/10/user5.jpg",
                "Friendly staff and very reliable.",
                "MICHAEL LEE",
              ],
              [
                "/uploads/2025/10/user6.jpg",
                "Excellent customer service.",
                "DERIK XAVIOUR",
              ],
            ].map(([image, quote, name]) => (
              <TiltCard key={name} maxTilt={6}>
                <article className="flex h-full flex-col justify-between rounded-xl bg-white p-7 shadow-[0_14px_34px_rgba(11,57,84,0.1)]">
                  <div>
                    <div className="text-[#FFB128]">★★★★★</div>
                    <p className="mt-4 leading-7 text-[#5C676D]">{quote}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <SiteImage
                      src={image}
                      alt={name}
                      width={52}
                      height={52}
                      className="h-13 w-13 rounded-full object-cover"
                    />
                    <h3 className="font-semibold text-[#0B3954]">{name}</h3>
                  </div>
                </article>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
