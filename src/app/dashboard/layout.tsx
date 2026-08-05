import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AdminNavigation } from "@/components/admin-navigation";
import { requireAdmin } from "@/lib/admin-session";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#1d2327]">
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 border-b border-zinc-200 bg-white shadow-sm">
        <Link
          href="/dashboard"
          className="flex w-16 shrink-0 items-center justify-center gap-3 bg-[#17212b] px-2 text-white lg:w-64 lg:justify-start lg:px-5"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white">
            <Image
              src="/uploads/2025/08/WhatsApp_Image_2025-08-13_at_16.51.18-removebg-preview.png"
              alt="Al Nakiya Trading"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
          </span>
          <span className="hidden leading-tight lg:block">
            <strong className="block text-sm">Al Nakiya Trading</strong>
            <span className="text-[11px] text-zinc-400">Admin Panel</span>
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end pl-16 pr-3 sm:pr-5 lg:justify-between lg:px-6">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-zinc-800">
              Store Administration
            </p>
            <p className="hidden text-xs text-zinc-500 sm:block">
              Manage your products and website content
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden border-r border-zinc-200 pr-4 text-sm font-semibold text-[#2271b1] lg:block"
            >
              View Store ↗
            </Link>
            <Link
              href="/dashboard/account"
              className="hidden text-sm font-semibold text-[#2271b1] lg:block"
            >
              Account
            </Link>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#800517] text-sm font-bold text-white">
              A
            </span>
            <span className="hidden text-sm font-semibold text-zinc-700 xl:block">
              Administrator
            </span>
          </div>
        </div>
      </header>

      <AdminNavigation />
      <div className="pt-16 lg:pl-64">{children}</div>
    </div>
  );
}
