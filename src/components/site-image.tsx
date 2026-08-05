import Image, { type ImageProps } from "next/image";
import { getMediaUrl } from "@/lib/media";

type SiteImageProps = Omit<ImageProps, "src"> & {
  src: string;
  /** Ignored — files are pre-compressed in /public/uploads */
  optimizeWidth?: number;
  optimizeQuality?: number;
};

/** Pre-compressed files from /public/uploads — no Vercel image optimization. */
export function SiteImage({
  src,
  optimizeWidth: _w,
  optimizeQuality: _q,
  unoptimized: _ignored,
  ...props
}: SiteImageProps) {
  return <Image {...props} src={getMediaUrl(src)} unoptimized />;
}
