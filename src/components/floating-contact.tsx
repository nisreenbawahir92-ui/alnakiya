"use client";

import { usePathname } from "next/navigation";
import { ContactIcon } from "@/components/contact-icon";
import { CALL_PHONE_E164, WHATSAPP_PHONE } from "@/lib/seo";

function productNameFromPath(pathname: string) {
  if (!pathname.startsWith("/product/")) return null;
  const slug = pathname.split("/")[2];
  if (!slug) return null;
  return decodeURIComponent(slug)
    .replace(/-\d+$/, "")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function FloatingContact() {
  const pathname = usePathname();
  if (
    pathname === "/cart" ||
    pathname === "/contact-us" ||
    pathname === "/login"
  ) {
    return null;
  }
  const productName = productNameFromPath(pathname);
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://alnakiyatrading.com"}${pathname}`;
  const message = productName
    ? `Hello, I am interested in ${productName}.\nProduct: ${pageUrl}`
    : `Hello Al Nakiya Trading, I would like more information.\nPage: ${pageUrl}`;

  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-6">
      <a
        href={`tel:${CALL_PHONE_E164}`}
        aria-label="Call Al Nakiya Trading"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#800517] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:scale-105 sm:h-16 sm:w-16"
      >
        <ContactIcon name="phone" className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
      <a
        href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center overflow-visible rounded-full border-2 border-[#800517] bg-white shadow-[0_8px_24px_rgba(128,5,23,0.25)] hover:scale-105 sm:h-16 sm:w-16"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#800517]/20 [animation-duration:2.2s]" />
        <ContactIcon name="whatsapp" className="h-6 w-6 sm:h-7 sm:w-7" />
      </a>
    </div>
  );
}
