import type { Metadata } from "next";
import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { notFound } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/pages";
import { createPageMetadata } from "@/lib/seo";
import { safeProductHtml } from "@/lib/safe-html";
import { decodeHtml, stripHtml } from "@/lib/text";

type BlogPostProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }
  const imageUrl =
    post.featuredImage?.url ||
    "/uploads/2025/08/samuel-cruz-o8C5SxNCGaw-unsplash-scaled.jpg";

  return createPageMetadata({
    title: decodeHtml(post.title),
    description: stripHtml(post.excerpt || post.content).slice(0, 155),
    path: `/blog/${post.slug}`,
    image: imageUrl,
    type: "article",
  });
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const imageUrl =
    post.featuredImage?.url ||
    "/uploads/2025/08/samuel-cruz-o8C5SxNCGaw-unsplash-scaled.jpg";

  return (
    <main className="flex-1 bg-[#f8fafc]">
      <article>
        <header className="relative flex min-h-[360px] items-end overflow-hidden text-white sm:min-h-[420px]">
          <SiteImage
            src={imageUrl}
            alt={decodeHtml(post.title)}
            fill
            priority
            optimizeWidth={1400}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06283d] via-[#0B3954]/70 to-black/15" />
          <div className="relative mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6 sm:pb-10">
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white/80">
              <Link href="/">Home</Link>
              <span>/</span>
              <Link href="/blog">Blog</Link>
            </div>
            <span className="mt-4 inline-block bg-[#800517] px-3 py-1 text-xs font-bold">
              {post.terms[0] ? decodeHtml(post.terms[0].name) : "Industry Blog"}
            </span>
            <h1 className="mt-3 max-w-4xl text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
              {decodeHtml(post.title)}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <time>
                {new Intl.DateTimeFormat("en-AE", {
                  dateStyle: "long",
                }).format(new Date(`${post.createdAt}Z`))}
              </time>
              <span className="border-l border-white/40 pl-3">
                8 minute read
              </span>
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="bg-white py-2 lg:pr-8">
            <div
              className="product-content text-base leading-8 text-zinc-700 sm:text-lg sm:leading-9 [&_a]:font-semibold [&_a]:text-[#800517] [&_blockquote]:my-8 [&_blockquote]:border-l-4 [&_blockquote]:border-[#ffb128] [&_blockquote]:bg-amber-50 [&_blockquote]:p-5 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#0B3954] sm:[&_h2]:text-3xl [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-zinc-950 sm:[&_h3]:text-2xl [&_p]:mb-5"
              dangerouslySetInnerHTML={{
                __html: safeProductHtml(post.content),
              }}
            />
            <div className="mt-10 border-y border-zinc-200 py-7">
              <p className="text-sm font-bold uppercase tracking-wider text-[#800517]">
                Al Nakiya Trading
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Professional industrial tools, hardware and building supplies
                for businesses across the UAE.
              </p>
            </div>
          </div>

          <aside className="grid gap-5 lg:sticky lg:top-28">
            <div className="border-l-4 border-[#ffb128] bg-[#0B3954] p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-wider text-[#ffb128]">
                Product Support
              </p>
              <h2 className="mt-2 text-xl font-bold">
                Need the right tools for your project?
              </h2>
              <p className="mt-3 text-sm leading-6 text-blue-50/85">
                Contact our team for product guidance, pricing and
                availability.
              </p>
              <Link
                href="/contact-us"
                className="mt-5 block rounded-full bg-[#ffb128] px-5 py-3 text-center text-sm font-bold text-[#0B3954]"
              >
                Ask Our Team
              </Link>
            </div>
            <div className="border-y border-zinc-300 bg-white py-6">
              <h2 className="font-bold text-[#0B3954]">Explore More</h2>
              <div className="mt-3 grid text-sm font-semibold">
                <Link href="/shop" className="border-b py-3 text-[#800517]">
                  Browse all products
                </Link>
                <Link
                  href="/category/power-tool"
                  className="border-b py-3 text-[#800517]"
                >
                  Power tools
                </Link>
                <Link
                  href="/category/safety-products"
                  className="py-3 text-[#800517]"
                >
                  Safety products
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
