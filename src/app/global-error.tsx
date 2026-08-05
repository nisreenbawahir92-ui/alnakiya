"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error);

  return (
    <html lang="en">
      <body className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-16 text-center font-sans">
        <h1 className="text-2xl font-bold text-[#0B3954]">
          Application error
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 h-11 bg-[#800517] px-5 text-sm font-bold text-white"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
