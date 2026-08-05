"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
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
    <main className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#800517]">
        Something went wrong
      </p>
      <h1 className="mt-2 text-2xl font-bold text-[#0B3954]">
        We could not load this page
      </h1>
      <p className="mt-3 text-sm leading-6 text-zinc-500">
        Please try again. If the problem continues, refresh the page or return
        home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="h-11 bg-[#800517] px-5 text-sm font-bold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="flex h-11 items-center border border-zinc-300 px-5 text-sm font-semibold text-[#0B3954]"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
