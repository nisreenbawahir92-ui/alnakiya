import type { Metadata } from "next";
import { changeAdminPassword } from "@/app/dashboard/actions";
import { requireAdmin } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Account Settings",
  robots: { index: false, follow: false },
};

type AccountPageProps = {
  searchParams: Promise<{
    updated?: string;
    error?: string;
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const [viewer, status] = await Promise.all([requireAdmin(), searchParams]);

  const errorMessage =
    status.error === "current"
      ? "Current password is incorrect."
      : status.error === "mismatch"
        ? "New password and confirmation do not match."
        : status.error === "same"
          ? "New password must be different from the current password."
          : status.error === "invalid"
            ? "Password must be at least 8 characters."
            : status.error === "session"
              ? "Please sign in again and try changing your password."
              : status.error
                ? "Password could not be updated. Please try again."
                : null;

  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold sm:text-3xl">Account Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage your administrator login details.
        </p>

        <section className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
            <h2 className="font-bold">Admin profile</h2>
          </div>
          <div className="grid gap-3 px-5 py-5 text-sm sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Email
              </p>
              <p className="mt-1 font-semibold text-[#0B3954]">{viewer.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Access
              </p>
              <p className="mt-1 font-semibold text-[#0B3954]">Administrator</p>
            </div>
          </div>
        </section>

        <section className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
            <h2 className="font-bold">Change password</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Use a strong password with at least 8 characters.
            </p>
          </div>

          {status.updated && (
            <div className="mx-5 mt-5 border-l-4 border-emerald-500 bg-emerald-50 p-4 text-sm text-emerald-800">
              Password updated successfully.
            </div>
          )}
          {errorMessage && (
            <div className="mx-5 mt-5 border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <form action={changeAdminPassword} className="grid gap-5 p-5">
            <label className="grid gap-1.5 text-sm font-semibold">
              Current password
              <input
                required
                type="password"
                name="currentPassword"
                minLength={8}
                autoComplete="current-password"
                className="h-11 rounded-lg border border-zinc-300 px-3 font-normal outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              New password
              <input
                required
                type="password"
                name="newPassword"
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                className="h-11 rounded-lg border border-zinc-300 px-3 font-normal outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
              />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold">
              Confirm new password
              <input
                required
                type="password"
                name="confirmPassword"
                minLength={8}
                maxLength={72}
                autoComplete="new-password"
                className="h-11 rounded-lg border border-zinc-300 px-3 font-normal outline-none focus:border-[#2271b1] focus:ring-2 focus:ring-[#2271b1]/10"
              />
            </label>
            <button className="justify-self-start rounded-lg bg-[#2271b1] px-5 py-3 text-sm font-bold text-white hover:bg-[#135e96]">
              Update Password
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
