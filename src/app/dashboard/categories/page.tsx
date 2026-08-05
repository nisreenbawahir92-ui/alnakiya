import type { Metadata } from "next";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/app/dashboard/actions";
import { requireAdminViewer } from "@/lib/admin-session";
import {
  getManagedCategories,
  getProductCategories,
} from "@/lib/products";
import { decodeHtml } from "@/lib/text";

export const metadata: Metadata = {
  title: "Product Categories",
  robots: { index: false, follow: false },
};

type CategoriesPageProps = {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const [, categories, managedCategories, status] = await Promise.all([
    requireAdminViewer(),
    getProductCategories(),
    getManagedCategories(),
    searchParams,
  ]);
  const managedSlugs = new Set(managedCategories.map((category) => category.slug));
  const catalogOnly = categories.filter(
    (category) => !managedSlugs.has(category.slug),
  );

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Product Categories</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create, edit, and delete Supabase categories used by new products.
        </p>

        {status.created && (
          <div className="mt-5 border-l-4 border-emerald-500 bg-white p-4 text-sm shadow-sm">
            Category created successfully.
          </div>
        )}
        {status.updated && (
          <div className="mt-5 border-l-4 border-emerald-500 bg-white p-4 text-sm shadow-sm">
            Category updated successfully.
          </div>
        )}
        {status.deleted && (
          <div className="mt-5 border-l-4 border-emerald-500 bg-white p-4 text-sm shadow-sm">
            Category deleted successfully.
          </div>
        )}
        {status.error && (
          <div className="mt-5 border-l-4 border-red-500 bg-white p-4 text-sm shadow-sm">
            {status.error === "slug"
              ? "This category slug already exists."
              : status.error === "delete"
                ? "Category could not be deleted."
                : "Category could not be saved. Check all required fields."}
          </div>
        )}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[340px_1fr]">
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
              <h2 className="font-bold">Add New Category</h2>
              <p className="mt-1 text-xs text-zinc-500">
                New categories become available in the product form.
              </p>
            </div>
            <form action={createCategory} className="grid gap-5 p-5">
              <div className="grid gap-5">
                <label className="grid gap-1.5 text-sm font-semibold">
                  Category name *
                  <input
                    required
                    name="name"
                    maxLength={100}
                    placeholder="e.g. Hand Tools"
                    className="h-11 rounded-lg border border-zinc-300 px-3 font-normal outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Slug
                  <input
                    name="slug"
                    maxLength={120}
                    placeholder="Generated automatically"
                    className="h-11 rounded-lg border border-zinc-300 px-3 font-normal outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                  />
                </label>
                <label className="grid gap-1.5 text-sm font-semibold">
                  Description
                  <textarea
                    name="description"
                    rows={5}
                    maxLength={1000}
                    placeholder="Optional category description"
                    className="rounded-lg border border-zinc-300 p-3 font-normal outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
                  />
                </label>
                <button className="rounded-lg bg-[#2271b1] px-5 py-3 text-sm font-bold text-white hover:bg-[#135e96]">
                  Add Category
                </button>
              </div>
            </form>
          </section>

          <div className="grid gap-6">
            <section className="min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <h2 className="font-bold">Managed Categories</h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                  {managedCategories.length} total
                </span>
              </div>
              <div className="divide-y divide-zinc-100">
                {managedCategories.length === 0 && (
                  <p className="px-5 py-8 text-sm text-zinc-500">
                    No Supabase categories yet. Add one from the form.
                  </p>
                )}
                {managedCategories.map((category) => (
                  <div key={category.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                    <form
                      action={updateCategory}
                      className="grid gap-3 sm:grid-cols-2"
                    >
                      <input type="hidden" name="id" value={category.id} />
                      <label className="grid gap-1 text-xs font-semibold sm:col-span-2">
                        Name
                        <input
                          required
                          name="name"
                          defaultValue={category.name}
                          
                          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm font-normal disabled:opacity-60"
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold">
                        Slug
                        <input
                          required
                          name="slug"
                          defaultValue={category.slug}
                          
                          className="h-10 rounded-lg border border-zinc-300 px-3 text-sm font-normal disabled:opacity-60"
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold">
                        Products
                        <input
                          readOnly
                          value={category.productCount}
                          className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm font-normal"
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold sm:col-span-2">
                        Description
                        <textarea
                          name="description"
                          rows={2}
                          defaultValue={category.description ?? ""}
                          
                          className="rounded-lg border border-zinc-300 p-3 text-sm font-normal disabled:opacity-60"
                        />
                      </label>
                      <button className="rounded-lg bg-[#2271b1] px-4 py-2 text-sm font-semibold text-white sm:col-span-2 sm:justify-self-start">
                        Save Changes
                      </button>
                    </form>
                    <form action={deleteCategory} className="self-start">
                      <input type="hidden" name="id" value={category.id} />
                      <button className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700">
                        Delete
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </section>

            <section className="min-w-0 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                <h2 className="font-bold">Catalog Categories</h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">
                  {catalogOnly.length} from JSON
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className="border-b px-5 py-3">Name</th>
                      <th className="border-b px-5 py-3">Slug</th>
                      <th className="border-b px-5 py-3 text-right">Products</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {catalogOnly.map((category) => (
                      <tr key={category.slug} className="hover:bg-zinc-50">
                        <td className="px-5 py-3 font-semibold text-[#2271b1]">
                          {decodeHtml(category.name)}
                        </td>
                        <td className="px-5 py-3 text-zinc-500">
                          {category.slug}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold">
                          {category.productCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
