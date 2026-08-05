import type { Metadata } from "next";
import Link from "next/link";
import { DashboardProductList } from "@/components/dashboard-product-list";
import { getDashboardProducts } from "@/lib/admin-catalog";
import { requireAdminViewer } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

type ProductsPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const [viewer, status] = await Promise.all([
    requireAdminViewer(),
    searchParams,
  ]);
  const products = await getDashboardProducts(viewer.supabase);

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Products</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Manage all products from one catalog.
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="rounded-lg bg-[#2271b1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            Add New Product
          </Link>
        </div>

        {status.created && (
          <div className="mt-6 border-l-4 border-emerald-500 bg-white p-4 text-sm shadow-sm">
            Product created successfully.
          </div>
        )}
        {status.updated && (
          <div className="mt-6 border-l-4 border-emerald-500 bg-white p-4 text-sm shadow-sm">
            Product updated successfully.
          </div>
        )}
        {status.deleted && (
          <div className="mt-6 border-l-4 border-emerald-500 bg-white p-4 text-sm shadow-sm">
            Product deleted successfully.
          </div>
        )}
        {status.error && (
          <div className="mt-6 border-l-4 border-red-500 bg-white p-4 text-sm shadow-sm">
            Product action failed. Please try again.
          </div>
        )}

        <section className="mt-6 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-5">
          <DashboardProductList products={products} canWrite />
        </section>
      </div>
    </main>
  );
}
