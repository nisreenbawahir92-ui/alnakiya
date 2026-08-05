import type { Metadata } from "next";
import Image from "next/image";
import mediaData from "@/data/media.json";
import { requireAdminViewer } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Media Library",
  robots: { index: false, follow: false },
};

export default async function MediaPage() {
  await requireAdminViewer();
  const images = mediaData
    .filter((item) => item.mimeType.startsWith("image/") && item.file)
    .slice(0, 100);

  return (
    <main className="min-h-[calc(100vh-3rem)] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-semibold">Media Library</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {mediaData.length} WordPress media records recovered. Showing the
          latest 100 images.
        </p>
        <section className="mt-6 border border-zinc-300 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-7 xl:grid-cols-9">
            {images.map((image) => (
              <a
                key={image.id}
                href={image.url}
                target="_blank"
                rel="noreferrer"
                title={image.title}
                className="group relative aspect-square overflow-hidden border border-zinc-300 bg-[#f6f7f7]"
              >
                <Image
                  src={image.url}
                  alt={image.alt || image.title}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-2 py-1 text-[10px] text-white opacity-0 group-hover:opacity-100">
                  {image.title}
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
