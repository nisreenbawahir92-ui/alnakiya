import type { Metadata } from "next";
import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { getBlogPosts } from "@/lib/pages";
import { createPageMetadata } from "@/lib/seo";
import { decodeHtml, stripHtml } from "@/lib/text";

export const metadata: Metadata = createPageMetadata({
  title: "Industrial Tools Blog",
  description:
    "Guides and practical advice about industrial tools, hardware buying, safety and UAE market insights from Al Nakiya Trading.",
  path: "/blog",
  image: "/uploads/2025/08/samuel-cruz-o8C5SxNCGaw-unsplash-scaled.jpg",
});

const fallbackImage =
  "/uploads/2025/08/samuel-cruz-o8C5SxNCGaw-unsplash-scaled.jpg";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main className="flex-1 bg-[#f8fafc]">
      <section className="relative flex min-h-[260px] items-center overflow-hidden bg-gradient-to-r from-[#0B3954] to-[#126782] text-white sm:min-h-[300px]">
        <div className="absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#ffb128]/15 blur-3xl" />
        <div className="relative mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ffb128]">
            Knowledge & Resources
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">
            Industrial Tools, Hardware & UAE Market Insights
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-blue-50/85">
            Practical buying guides, product knowledge, safety advice and
            expert insights for contractors, workshops and maintenance teams.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#800517]">
              Latest Articles
            </p>
            <h2 className="mt-1 text-2xl font-bold text-[#0B3954] sm:text-3xl">
              Guides from our team
            </h2>
          </div>
          <Link
            href="/shop"
            className="rounded-full border border-[#800517] px-5 py-2.5 text-sm font-bold text-[#800517] hover:bg-[#800517] hover:text-white"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-8 divide-y divide-zinc-300 border-y border-zinc-300">
          {posts.map((post) => {
            const imageUrl = post.featuredImage?.url || fallbackImage;
            const summary = stripHtml(post.excerpt || post.content).slice(
              0,
              220,
            );
            return (
              <article
                key={post.id}
                className="group grid gap-6 py-8 md:grid-cols-[minmax(260px,38%)_1fr] md:items-center"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="relative block aspect-[16/10] overflow-hidden bg-zinc-100"
                >
                  <SiteImage
                    src={imageUrl}
                    alt={decodeHtml(post.title)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 bg-[#800517] px-3 py-1 text-xs font-bold text-white">
                    {post.terms[0] ? decodeHtml(post.terms[0].name) : "Blog"}
                  </span>
                </Link>
                <div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-zinc-500">
                    <time>
                      {new Intl.DateTimeFormat("en-AE", {
                        dateStyle: "medium",
                      }).format(new Date(`${post.createdAt}Z`))}
                    </time>
                    <span className="border-l border-zinc-300 pl-3">
                      8 min read
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-snug text-[#0B3954] sm:text-2xl">
                    <Link href={`/blog/${post.slug}`}>
                      {decodeHtml(post.title)}
                    </Link>
                  </h2>
                  <p className="mt-3 line-clamp-3 leading-7 text-zinc-600">
                    {summary}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 font-bold text-[#800517]"
                  >
                    Read full article
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 px-4 py-10 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-[#0B3954]">
            Need help selecting an industrial product?
          </h2>
          <p className="max-w-2xl text-zinc-600">
            Send our team your requirement for product recommendations,
            availability and bulk pricing.
          </p>
          <Link
            href="/contact-us"
            className="rounded-full bg-[#800517] px-7 py-3 font-bold text-white"
          >
            Contact Our Team
          </Link>
        </div>
      </section>
    </main>
  );
}
