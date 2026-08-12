"use client";

import Link from "next/link";
import { SiteImage } from "@/components/site-image";
import { useCart } from "@/components/cart-provider";
import { ContactIcon } from "@/components/contact-icon";
import { buildCartWhatsAppMessage, WHATSAPP_PHONE } from "@/lib/seo";

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clear } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const whatsappMessage = buildCartWhatsAppMessage(items, total);

  return (
    <main className="flex-1 bg-[#f7f8f9]">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-end justify-between gap-3 px-4 py-8 sm:px-6 sm:py-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#800517]">
              Checkout
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#0B3954] sm:text-4xl">
              Shopping Cart
            </h1>
          </div>
          {items.length > 0 && (
            <p className="text-sm text-zinc-500">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 sm:py-10">
        {!items.length ? (
          <div className="border border-zinc-200 bg-white px-6 py-16 text-center sm:py-20">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
              Empty cart
            </p>
            <h2 className="mt-3 text-2xl font-bold text-[#0B3954]">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Browse the catalog and add products to request pricing,
              availability, and delivery on WhatsApp.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-11 items-center bg-[#800517] px-7 text-sm font-bold text-white transition hover:bg-[#0B3954]"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
            <section className="border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3.5 sm:px-5">
                <h2 className="text-sm font-semibold text-[#0B3954]">
                  Cart items
                </h2>
                <button
                  type="button"
                  onClick={clear}
                  className="text-xs font-semibold uppercase tracking-wide text-zinc-500 transition hover:text-[#800517]"
                >
                  Clear all
                </button>
              </div>

              <ul className="divide-y divide-zinc-100">
                {items.map((item) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <li
                      key={item.id}
                      className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 px-4 py-5 sm:grid-cols-[104px_minmax(0,1fr)_auto] sm:gap-5 sm:px-5"
                    >
                      <Link
                        href={`/product/${item.slug}`}
                        className="relative aspect-square bg-[#f4f5f6]"
                      >
                        {item.imageUrl ? (
                          <SiteImage
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            optimizeWidth={208}
                            sizes="104px"
                            className="object-contain p-2.5"
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-[10px] uppercase tracking-wide text-zinc-400">
                            No image
                          </span>
                        )}
                      </Link>

                      <div className="min-w-0">
                        <Link
                          href={`/product/${item.slug}`}
                          className="line-clamp-2 text-[15px] font-semibold leading-snug text-[#0B3954] transition hover:text-[#800517]"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1.5 text-sm text-zinc-500">
                          د.إ{item.price.toFixed(2)} each
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div className="inline-flex h-9 items-center border border-zinc-300 bg-white">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="grid h-9 w-9 place-items-center text-lg text-zinc-600 transition hover:bg-zinc-50"
                            >
                              −
                            </button>
                            <span className="grid h-9 w-10 place-items-center border-x border-zinc-300 text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="grid h-9 w-9 place-items-center text-lg text-zinc-600 transition hover:bg-zinc-50"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-xs font-semibold uppercase tracking-wide text-zinc-400 transition hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 flex items-center justify-between sm:col-auto sm:flex-col sm:items-end sm:justify-between sm:self-stretch">
                        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400 sm:hidden">
                          Line total
                        </span>
                        <strong className="text-base font-bold text-[#800517] sm:text-lg">
                          د.إ{lineTotal.toFixed(2)}
                        </strong>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>

            <aside className="h-fit border border-zinc-200 bg-white lg:sticky lg:top-28">
              <div className="border-b border-zinc-200 px-5 py-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#0B3954]">
                  Order summary
                </h2>
              </div>
              <div className="space-y-3 px-5 py-5 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-100 pt-4 text-base">
                  <span className="font-semibold text-[#0B3954]">Total</span>
                  <strong className="text-xl font-bold text-[#800517]">
                    د.إ{total.toFixed(2)}
                  </strong>
                </div>
              </div>
              <div className="space-y-3 border-t border-zinc-200 px-5 py-5">
                <a
                  href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-11 items-center justify-center gap-2 border border-[#800517]/20 bg-white text-sm font-bold text-[#800517] transition hover:bg-[#800517]/5"
                >
                  <ContactIcon name="whatsapp" className="h-5 w-5" />
                  Order on WhatsApp
                </a>
                <Link
                  href="/shop"
                  className="flex h-11 items-center justify-center border border-zinc-300 text-sm font-semibold text-[#0B3954] transition hover:border-[#0B3954]"
                >
                  Continue Shopping
                </Link>
                <p className="text-center text-xs leading-5 text-zinc-500">
                  Our team will confirm availability, delivery, and payment.
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
