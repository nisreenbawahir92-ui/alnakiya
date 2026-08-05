import type { Metadata } from "next";
import type { ReactNode } from "react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Shopping Cart",
  description: "Review items in your Al Nakiya Trading cart and order on WhatsApp.",
  path: "/cart",
  noIndex: true,
});

export default function CartLayout({ children }: { children: ReactNode }) {
  return children;
}
