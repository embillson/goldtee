export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--dark)]">
      {/* Hero skeleton */}
      <div className="relative min-h-screen flex items-center justify-center bg-[var(--green)] animate-pulse">
        <div className="text-center px-4 space-y-6">
          <div className="h-3 w-40 bg-[var(--gold)]/20 rounded-full mx-auto" />
          <div className="h-16 w-96 max-w-full bg-white/5 rounded-xl mx-auto" />
          <div className="h-5 w-72 max-w-full bg-white/5 rounded-lg mx-auto" />
          <div className="h-12 w-48 bg-[var(--gold)]/20 rounded-full mx-auto" />
        </div>
      </div>

      {/* Shop section skeleton */}
      <section className="w-full py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8">
          {/* Header */}
          <div className="text-center mb-12 space-y-3">
            <div className="h-3 w-28 bg-[var(--gold)]/20 rounded-full mx-auto animate-pulse" />
            <div className="h-8 w-40 bg-white/5 rounded-lg mx-auto animate-pulse" />
          </div>

          {/* Filter bar */}
          <div className="flex flex-col items-center gap-4 mb-12">
            <div className="h-11 w-80 max-w-full bg-[var(--surface)] rounded-full animate-pulse" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-9 w-20 bg-[var(--surface)] rounded-full animate-pulse" />
              ))}
            </div>
          </div>

          {/* Product cards */}
          <div className="flex flex-wrap justify-center gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-full max-w-[260px]">
                <div className="bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)]">
                  <div className="aspect-square bg-[var(--surface-2)] animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 w-3/4 bg-[var(--border)] rounded mx-auto animate-pulse" />
                    <div className="h-6 w-1/2 bg-[var(--gold)]/15 rounded mx-auto animate-pulse" />
                    <div className="h-9 w-full bg-[var(--gold)]/20 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
