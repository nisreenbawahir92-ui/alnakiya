"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { ContactIcon } from "@/components/contact-icon";

type AddToCartProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    price: number;
    imageUrl: string | null;
  };
  whatsappUrl: string;
};

export function AddToCart({ product, whatsappUrl }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const add = () => {
    addItem(product, quantity);
    setAdded(true);
  };

  return (
    <div className="mt-7 w-full max-w-md border-t border-zinc-200 pt-6 text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        Quantity
      </p>
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3">
        <div className="inline-flex h-11 items-center border border-zinc-300 bg-white">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="grid h-11 w-11 place-items-center text-xl text-zinc-600 hover:bg-zinc-50"
          >
            −
          </button>
          <span className="grid h-11 w-12 place-items-center border-x border-zinc-300 text-sm font-semibold">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((value) => value + 1)}
            className="grid h-11 w-11 place-items-center text-xl text-zinc-600 hover:bg-zinc-50"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={add}
          className="h-11 w-full bg-[#800517] px-6 text-sm font-bold text-white transition hover:bg-[#0B3954]"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(product, quantity);
            router.push("/cart");
          }}
          className="h-11 w-full border border-[#0B3954] px-5 text-sm font-bold text-[#0B3954] transition hover:bg-[#0B3954] hover:text-white"
        >
          Buy Now
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 w-full items-center justify-center gap-2 border border-[#800517]/30 px-5 text-sm font-bold text-[#800517] transition hover:bg-[#800517]/5"
        >
          <ContactIcon name="whatsapp" className="h-5 w-5" />
          Order on WhatsApp
        </a>
      </div>
      {added && (
        <div className="mx-auto mt-4 flex max-w-md flex-wrap items-center justify-center gap-3 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <span className="font-semibold">Added to cart.</span>
          <Link
            href="/cart"
            className="font-semibold underline underline-offset-2"
          >
            View cart
          </Link>
        </div>
      )}
    </div>
  );
}
