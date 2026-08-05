"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <h1 className="text-xl font-bold text-[#0B3954]">Dashboard error</h1>
        <p className="mt-2 text-sm text-zinc-500">
          This admin page failed to load. Try again or return to the dashboard.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="h-10 rounded-lg bg-[#2271b1] px-4 text-sm font-semibold text-white"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="flex h-10 items-center rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-[#0B3954]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
