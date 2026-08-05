"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FloatingContact } from "@/components/floating-contact";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/dashboard");
  const hideFloatingContact =
    isAdminRoute || pathname === "/login";

  if (isAdminRoute) return children;

  return (
    <>
      <SiteHeader />
      {children}
      {!hideFloatingContact && <FloatingContact />}
      <SiteFooter />
    </>
  );
}
