import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Secure administrator sign-in for Al Nakiya Trading.",
  robots: { index: false, follow: false, nocache: true },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user?.app_metadata?.role === "admin") {
      redirect("/dashboard");
    }
  }

  return (
    <main className="flex-1 bg-[#f7f8f9]">
      <section className="border-b border-[#800517]/15 bg-gradient-to-r from-[#800517] to-[#a70722] px-4 py-7 text-center text-white sm:px-6 sm:py-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffb128]">
          Secure Administration
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Admin Sign In</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/90">
          Sign in to manage products and categories.
        </p>
      </section>

      <section className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 sm:py-10">
        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-4 py-2.5 text-center text-sm font-semibold text-red-800">
            {error === "config"
              ? "Supabase configuration is missing. Contact the site owner."
              : "Invalid admin email or password."}
          </div>
        )}

        <form action={login} className="grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-[#0B3954]">
            Email address
            <input
              required
              type="email"
              name="email"
              autoComplete="email"
              placeholder="admin@alnakiyatrading.com"
              className="h-11 border border-zinc-300 bg-white px-4 font-normal text-zinc-800 outline-none transition focus:border-[#800517] focus:ring-2 focus:ring-[#800517]/10"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#0B3954]">
            Password
            <input
              required
              type="password"
              name="password"
              autoComplete="current-password"
              minLength={8}
              placeholder="Enter your password"
              className="h-11 border border-zinc-300 bg-white px-4 font-normal text-zinc-800 outline-none transition focus:border-[#800517] focus:ring-2 focus:ring-[#800517]/10"
            />
          </label>
          <button
            type="submit"
            className="mt-1 h-11 bg-gradient-to-r from-[#800517] to-[#a70722] text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110"
          >
            Sign in to dashboard
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-600">
          <Link
            href="/"
            className="font-semibold text-[#800517] hover:underline"
          >
            Return to website
          </Link>
        </p>
      </section>
    </main>
  );
}
