"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  deleteProduct,
  hideLegacyProduct,
  restoreLegacyProduct,
} from "@/app/dashboard/actions";
import type { DashboardProduct } from "@/lib/admin-catalog";

export function DashboardProductList({
  products,
  canWrite = true,
}: {
  products: DashboardProduct[];
  canWrite?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 25;
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        !search ||
        [product.title, product.slug, product.sku, product.category]
          .join(" ")
          .toLowerCase()
          .includes(search),
    );
  }, [products, query]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (safePage - 1) * perPage,
    safePage * perPage,
  );

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-zinc-600">
          {filtered.length} products
        </p>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="Search product, SKU or category"
          className="h-10 w-full border border-zinc-400 px-3 text-sm outline-none focus:border-[#2271b1] sm:w-80"
        />
      </div>

      <div className="mt-4 overflow-x-auto border border-zinc-300">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead className="bg-[#f6f7f7]">
            <tr>
              <th className="w-[34%] border-b border-zinc-300 px-4 py-3">
                Product
              </th>
              <th className="border-b border-zinc-300 px-4 py-3">SKU</th>
              <th className="border-b border-zinc-300 px-4 py-3">Category</th>
              <th className="border-b border-zinc-300 px-4 py-3">Stock</th>
              <th className="border-b border-zinc-300 px-4 py-3">Price</th>
              <th className="border-b border-zinc-300 px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {visible.map((product) => (
              <tr
                key={`${product.source}-${product.id}`}
                className="hover:bg-[#f6f7f7]"
              >
                <td className="px-4 py-3">
                  {product.isDeleted ? (
                    <span className="font-semibold text-zinc-400 line-through">
                      {product.title}
                    </span>
                  ) : (
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-semibold text-[#2271b1] hover:text-[#135e96]"
                    >
                      {product.title}
                    </Link>
                  )}
                  {product.isDeleted && (
                    <span className="ml-2 text-xs font-semibold text-red-700">
                      Hidden
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {product.sku || "—"}
                </td>
                <td className="px-4 py-3 text-zinc-600">
                  {product.category || "Uncategorized"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      product.stockStatus === "instock"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }
                  >
                    {product.stockStatus === "instock"
                      ? "In stock"
                      : "Out of stock"}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">
                  {product.price ? `د.إ ${product.price}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-3">
                    {!canWrite ? (
                      !product.isDeleted && (
                        <Link
                          href={`/product/${product.slug}`}
                          className="font-semibold text-[#2271b1]"
                        >
                          View
                        </Link>
                      )
                    ) : (
                      <>
                        {!product.isDeleted && (
                          <Link
                            href={`/dashboard/products/${product.source}/${product.id}`}
                            className="font-semibold text-[#2271b1]"
                          >
                            Edit
                          </Link>
                        )}
                        {product.source === "supabase" ? (
                          <form action={deleteProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <button className="font-semibold text-red-700">
                              Delete
                            </button>
                          </form>
                        ) : product.isDeleted || product.isOverridden ? (
                          <form action={restoreLegacyProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <button className="font-semibold text-emerald-700">
                              Restore
                            </button>
                          </form>
                        ) : (
                          <form action={hideLegacyProduct}>
                            <input type="hidden" name="id" value={product.id} />
                            <button className="font-semibold text-red-700">
                              Hide
                            </button>
                          </form>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            disabled={safePage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            className="border border-zinc-400 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-500">
            Page {safePage} of {pageCount}
          </span>
          <button
            type="button"
            disabled={safePage === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            className="border border-zinc-400 px-4 py-2 text-sm font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
