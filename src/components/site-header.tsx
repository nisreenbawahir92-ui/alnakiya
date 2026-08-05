"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteImage } from "@/components/site-image";
import { useCart } from "@/components/cart-provider";
import { ContactIcon } from "@/components/contact-icon";
import {
  CALL_PHONE_DISPLAY,
  CALL_PHONE_E164,
  SITE_LOGO,
  WHATSAPP_PHONE,
} from "@/lib/seo";

type HeaderCategory = {
  slug: string;
  name: string;
  productCount?: number;
};

const defaultCategories: HeaderCategory[] = [
  { slug: "switch-socket-dimmer", name: "Switch Socket & Dimmer" },
  { slug: "cutting-tools", name: "Cutting Tools" },
  {
    slug: "gardening-tools-accessories",
    name: "Gardening Tools & Accessories",
  },
  { slug: "pliers", name: "Pliers" },
  { slug: "electrical-accessories", name: "Electrical Accessories" },
  { slug: "sanitary-plumbing", name: "Sanitary & Plumbing" },
  {
    slug: "hardware-tool-accessories",
    name: "Hardware Tools & Accessories",
  },
  { slug: "painting-accessories", name: "Painting Accessories" },
  { slug: "power-tool", name: "Power Tools" },
  { slug: "safety-products", name: "Safety Products" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categoryItems, setCategoryItems] = useState(defaultCategories);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const { count } = useCart();

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoriesOpen(false);
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const loadCategories = async () => {
    if (categoriesLoaded) return;
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) return;
      const data = (await response.json()) as HeaderCategory[];
      if (data.length) setCategoryItems(data);
      setCategoriesLoaded(true);
    } catch {
      // Keep the built-in category list available if the request fails.
    }
  };

  const toggleCategories = () => {
    const willOpen = !categoriesOpen;
    setCategoriesOpen(willOpen);
    if (willOpen) void loadCategories();
  };

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-r from-[#800517] via-[#a70722] to-[#800517] text-white shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
      <div className="hidden border-b border-white/10 bg-[#0B3954] md:block">
        <div className="mx-auto flex h-8 max-w-[1460px] items-center justify-between px-4 text-[11px] font-medium text-blue-50 xl:px-7">
          <span className="flex items-center gap-2">
            <ContactIcon name="location" className="h-3.5 w-3.5 text-[#ffb128]" />
            Industrial tools and hardware supplier in the UAE
          </span>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-2">
              <ContactIcon name="delivery" className="h-4 w-4 text-[#ffb128]" />
              Fast UAE delivery
            </span>
            <a
              href={`tel:${CALL_PHONE_E164}`}
              className="flex items-center gap-2 hover:text-[#ffb128]"
            >
              <ContactIcon name="phone" className="h-3.5 w-3.5" />
              {CALL_PHONE_DISPLAY}
            </a>
            <a
              href="mailto:info@alnakiyatrading.com"
              className="hidden items-center gap-2 hover:text-[#ffb128] lg:flex"
            >
              <ContactIcon name="email" className="h-3.5 w-3.5" />
              info@alnakiyatrading.com
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto flex min-h-[72px] max-w-[1460px] items-center gap-3 border-b-2 border-[#ffb128]/70 px-3 sm:px-4 lg:min-h-[82px] xl:gap-5 xl:px-7">
        <Link
          href="/"
          aria-label="Al Nakiya Trading home"
          className="shrink-0"
        >
          <SiteImage
            src={SITE_LOGO}
            alt="Al Nakiya Trading"
            width={76}
            height={76}
            priority
            optimizeWidth={160}
            className="h-14 w-14 rounded-full object-cover shadow-md ring-2 ring-white/40 lg:h-16 lg:w-16"
          />
        </Link>

        <div
          ref={categoriesRef}
          className="relative z-[70] hidden shrink-0 lg:block"
        >
          <button
            type="button"
            onClick={toggleCategories}
            aria-expanded={categoriesOpen}
            aria-controls="desktop-category-menu"
            className="flex h-12 w-[194px] items-center justify-between rounded-full bg-[#0B3954] px-5 text-sm font-semibold shadow-md hover:bg-[#06283d]"
          >
            <span className="flex items-center gap-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-none stroke-current"
                strokeWidth="2"
              >
                <rect x="4" y="4" width="5" height="5" rx="1" />
                <rect x="15" y="4" width="5" height="5" rx="1" />
                <rect x="4" y="15" width="5" height="5" rx="1" />
                <rect x="15" y="15" width="5" height="5" rx="1" />
              </svg>
              All Categories
            </span>
            <span
              className={`text-lg font-light transition-transform ${
                categoriesOpen ? "rotate-180" : ""
              }`}
            >
              ⌄
            </span>
          </button>
          {categoriesOpen && (
            <div
              id="desktop-category-menu"
              className="absolute left-0 top-[calc(100%+10px)] z-[80] max-h-[min(70vh,560px)] w-[340px] overflow-y-auto overscroll-contain rounded-xl border border-zinc-200 bg-white p-2 text-zinc-800 shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between rounded-lg bg-[#f6f7f7] px-4 py-3">
                <span className="text-sm font-bold text-[#0B3954]">
                  Product Categories
                </span>
                <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold text-zinc-500">
                  {categoryItems.length}
                </span>
              </div>
              <div className="mt-1">
                {categoryItems.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  onClick={() => setCategoriesOpen(false)}
                  className="flex items-center justify-between gap-3 rounded-lg px-4 py-2.5 text-sm hover:bg-red-50 hover:text-[#970018]"
                >
                  <span>{category.name}</span>
                  {typeof category.productCount === "number" && (
                    <span className="shrink-0 text-xs text-zinc-400">
                      {category.productCount}
                    </span>
                  )}
                </Link>
              ))}
              </div>
              <Link
                href="/shop"
                onClick={() => setCategoriesOpen(false)}
                className="mt-2 block rounded-lg bg-[#800517] px-5 py-3 text-center text-sm font-bold text-white"
              >
                View All Categories
              </Link>
            </div>
          )}
        </div>

        <form
          action="/shop"
          className="group relative flex h-10 min-w-0 flex-1 items-center rounded-full bg-white shadow-[0_5px_18px_rgba(0,0,0,0.16)] ring-2 ring-transparent transition focus-within:ring-[#ffb128] md:h-12"
        >
          <label className="sr-only" htmlFor="header-search">
            Search products
          </label>
          <input
            id="header-search"
            name="q"
            placeholder="Search products..."
            className="h-10 w-full rounded-full border-0 bg-transparent pl-4 pr-12 text-xs text-zinc-800 outline-none placeholder:text-zinc-400 md:h-12 md:pl-5 md:pr-14 md:text-sm"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#ffb128] text-[#0B3954] shadow-sm transition group-focus-within:bg-[#800517] group-focus-within:text-white hover:scale-105 hover:bg-[#800517] hover:text-white md:h-10 md:w-10"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-5 w-5 fill-none stroke-current"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>
        </form>

        <div className="hidden shrink-0 items-center gap-3 border-l border-white/20 pl-4 text-left leading-tight xl:flex">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
            <ContactIcon name="phone" className="h-4 w-4" />
          </span>
          <div>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-red-100">
            Call our team
          </span>
          <a
            href={`tel:${CALL_PHONE_E164}`}
            className="mt-1 block text-sm font-extrabold"
          >
            {CALL_PHONE_DISPLAY}
          </a>
          </div>
        </div>

        <button className="hidden h-10 shrink-0 items-center gap-2 rounded-full border border-white/25 px-3 text-sm font-medium xl:flex">
          <ContactIcon name="globe" className="h-4 w-4" />
          UAE (AED)
          <span className="text-lg font-light">⌄</span>
        </button>

        <Link
          href="/login"
          aria-label="Account"
          className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white md:flex"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6 fill-none stroke-current"
            strokeWidth="1.8"
          >
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5.5 20c.7-4 3-6 6.5-6s5.8 2 6.5 6" />
          </svg>
        </Link>

        <Link
          href="/cart"
          aria-label="Shopping bag"
          className="relative ml-auto shrink-0 lg:ml-0"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-7 w-7 fill-none stroke-current sm:h-8 sm:w-8"
            strokeWidth="1.7"
          >
            <path d="M5 8h14l-1 12H6L5 8Z" />
            <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          </svg>
          <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ffb128] px-1 text-[10px] font-bold text-zinc-950">
            {count}
          </span>
        </Link>

        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
          className="rounded border border-white/40 p-2 text-xl lg:hidden"
        >
          ☰
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/20 px-4 pb-4 lg:hidden">
          <div className="grid gap-1">
            <details
              className="border-b border-white/10"
              onToggle={(event) => {
                if (event.currentTarget.open) void loadCategories();
              }}
            >
              <summary className="cursor-pointer py-3 text-sm font-semibold">
                All Categories
              </summary>
              <div className="mb-3 max-h-64 space-y-1 overflow-y-auto rounded-lg bg-white/10 p-2">
                {categoryItems.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex justify-between gap-3 rounded px-3 py-2 text-sm hover:bg-white/10"
                  >
                    <span>{category.name}</span>
                    {typeof category.productCount === "number" && (
                      <span className="text-white/60">
                        {category.productCount}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </details>
            {[
              ["/", "Home"],
              ["/shop", "Shop All Products"],
              ["/cart", `Cart (${count})`],
              ["/about-us", "About Us"],
              ["/contact-us", "Contact Us"],
              ["/blog", "Blog"],
              ["/login", "Admin Login"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-3 text-sm font-semibold"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={`tel:${CALL_PHONE_E164}`}
              className="flex items-center justify-center gap-2 rounded bg-white/10 px-3 py-3 text-center text-sm font-semibold text-white"
            >
              <ContactIcon name="phone" className="h-4 w-4" />
              Call Us
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_PHONE}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded bg-white/10 px-3 py-3 text-center text-sm font-semibold text-white"
            >
              <ContactIcon name="whatsapp" className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </nav>
      )}
    </header>
    <div
      aria-hidden="true"
      className="h-[74px] shrink-0 md:h-[104px] lg:h-[114px]"
    />
    </>
  );
}
