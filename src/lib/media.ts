/** Local media paths — served from /public on Vercel (pre-compressed, unoptimized). */
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

export function normalizeProductMedia<
  T extends {
    image?: { url?: string | null } | null;
    gallery?: Array<{ url?: string | null }>;
  },
>(product: T): T {
  return {
    ...product,
    image: product.image?.url
      ? { ...product.image, url: getMediaUrl(product.image.url) }
      : product.image,
    gallery: product.gallery?.map((item) =>
      item.url ? { ...item, url: getMediaUrl(item.url) } : item,
    ),
  };
}
