export default function DashboardLoading() {
  return (
    <main className="min-h-[calc(100vh-4rem)] animate-pulse px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="h-9 w-52 rounded bg-zinc-200" />
        <div className="mt-3 h-4 w-72 max-w-full rounded bg-zinc-200" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 rounded-xl border border-zinc-200 bg-white"
            />
          ))}
        </div>
        <div className="mt-7 h-96 rounded-xl border border-zinc-200 bg-white" />
      </div>
    </main>
  );
}
