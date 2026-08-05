"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { logout } from "@/app/login/actions";

const menu = [
  { href: "/dashboard", icon: "▦", label: "Dashboard" },
  { href: "/dashboard/products", icon: "▣", label: "Products" },
  { href: "/dashboard/products/new", icon: "＋", label: "Add New Product" },
  { href: "/dashboard/categories", icon: "≡", label: "Categories" },
  { href: "/dashboard/media", icon: "▧", label: "Media Library" },
  { href: "/dashboard/account", icon: "⚙", label: "Account" },
  { href: "/", icon: "↗", label: "View Website" },
];

function activePath(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  if (href === "/dashboard/products/new") return pathname === href;
  if (href === "/dashboard/products") {
    return (
      pathname.startsWith("/dashboard/products") &&
      pathname !== "/dashboard/products/new"
    );
  }
  return href !== "/" && pathname.startsWith(href);
}

export function AdminNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [targetPath, setTargetPath] = useState(pathname);
  const [isNavigating, startNavigation] = useTransition();
  const activePathname = isNavigating ? targetPath : pathname;

  useEffect(() => {
    const timers = menu
      .filter((item) => item.href.startsWith("/dashboard"))
      .map((item, index) =>
        window.setTimeout(() => router.prefetch(item.href), 400 + index * 250),
      );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [router]);

  const navigate = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    setTargetPath(href);
    setMobileOpen(false);
    startNavigation(() => router.push(href));
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-[#800517]/20">
          <div className="h-full w-1/2 animate-pulse bg-[#800517]" />
        </div>
      )}
      <aside className="fixed bottom-0 left-0 top-16 z-40 hidden w-64 flex-col bg-[#17212b] text-zinc-200 shadow-xl lg:flex">
        <div className="px-4 py-5">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Store Management
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {menu.map((item) => {
            const active = activePath(activePathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch
                onClick={(event) => navigate(event, item.href)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-[#800517] text-white shadow"
                    : "text-zinc-300 hover:bg-white/8 hover:text-white"
                }`}
              >
                <span
                  className={`grid h-7 w-7 place-items-center rounded text-base ${
                    active ? "bg-white/15" : "bg-white/5 text-zinc-400"
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-red-500/15 hover:text-red-300">
              <span className="grid h-7 w-7 place-items-center rounded bg-white/5">
                ↪
              </span>
              Log Out
            </button>
          </form>
        </div>
      </aside>

      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open admin menu"
        className="fixed left-20 top-3 z-[60] grid h-10 w-10 place-items-center rounded-md border border-zinc-300 bg-white text-xl shadow-sm lg:hidden"
      >
        ☰
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-black/45 lg:hidden"
        />
      )}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-[70] flex w-[min(82vw,290px)] flex-col bg-[#17212b] text-zinc-200 shadow-2xl transition-transform lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="text-sm font-bold text-white">Al Nakiya Trading</p>
            <p className="text-[11px] text-zinc-400">Admin Menu</p>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
            className="grid h-9 w-9 place-items-center rounded bg-white/10 text-xl"
          >
            ×
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {menu.map((item) => {
            const active = activePath(activePathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch
                onClick={(event) => navigate(event, item.href)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold ${
                  active
                    ? "bg-[#800517] text-white"
                    : "text-zinc-300 hover:bg-white/10"
                }`}
              >
                <span className="grid h-7 w-7 place-items-center rounded bg-white/5">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <form action={logout}>
            <button className="w-full rounded-md bg-red-500/15 px-4 py-3 text-left text-sm font-semibold text-red-300">
              Log Out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
