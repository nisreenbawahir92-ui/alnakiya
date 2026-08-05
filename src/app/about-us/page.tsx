import type { Metadata } from "next";
import { SiteImage } from "@/components/site-image";
import Link from "next/link";
import { StatsSection } from "@/components/stats-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about Al Nakiya Trading — a trusted Sharjah, UAE supplier of industrial tools, hardware, electrical accessories and building materials.",
  path: "/about-us",
  image: "/uploads/2025/08/samuel-cruz-o8C5SxNCGaw-unsplash-scaled.jpg",
});

export default function AboutPage() {
  return (
    <main className="flex-1 bg-white">
      <section className="relative flex min-h-[260px] items-center overflow-hidden px-4 py-10 text-white sm:min-h-[300px] sm:px-6 sm:py-12">
        <SiteImage
          src="/uploads/2025/10/hand4-1.jpg"
          alt="Professional tools supplied by Al Nakiya Trading"
          fill
          priority
          optimizeWidth={1600}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3954]/95 via-[#0B3954]/85 to-[#126782]/55" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">
            About Al Nakiya Trading
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            Reliable products. Honest service. Long-term partnerships.
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-9 px-4 py-12 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-100">
          <SiteImage
            src="/uploads/2025/08/samuel-cruz-o8C5SxNCGaw-unsplash-scaled.jpg"
            alt="Industrial tools supplied by Al Nakiya Trading"
            fill
            optimizeWidth={960}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-bold uppercase tracking-[0.18em] text-red-800">
            Your trusted UAE supplier
          </p>
          <h2 className="mt-3 text-3xl font-black text-zinc-950 sm:text-4xl">
            Tools and materials for work that matters
          </h2>
          <div className="mt-6 space-y-4 leading-7 text-zinc-600">
            <p>
              Al Nakiya Trading LLC supplies a broad range of professional hand
              tools, power tools, electrical accessories, plumbing products,
              safety equipment, and building materials.
            </p>
            <p>
              We support contractors, workshops, maintenance teams, and
              businesses with dependable products, competitive pricing, and
              responsive service across the United Arab Emirates.
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-8 inline-block rounded-full bg-[#800517] px-7 py-4 font-bold text-white"
          >
            Browse Our Products
          </Link>
        </div>
      </section>

      <StatsSection />
    </main>
  );
}
