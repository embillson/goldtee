"use client";
export default function FooterSection() {
  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)] mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold text-white mb-3">
              ⛳ Gold<span className="text-[var(--gold)] font-light">Tee</span>
            </div>
            <p className="text-sm text-[var(--dim)] leading-relaxed">
              Premium golf gadgets & accessories for the modern golfer. Trusted
              quality, every round.
            </p>
          </div>

          {/* Delivery */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Delivery
            </h4>
            <p className="text-sm text-[var(--dim)] mb-2">
              Nationwide delivery across South Africa
            </p>
            <p className="text-xs text-[var(--dim)] bg-[var(--surface-2)] inline-block px-3 py-1 rounded-full border border-[var(--border)]">
              ⏳ Live tracking coming soon
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              Stay Updated
            </h4>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-[var(--surface-2)] border border-[var(--border)] text-white placeholder-[var(--dim)] text-sm rounded-full px-4 py-2 focus:outline-none focus:border-[var(--gold)]/50"
              />
              <button
                type="submit"
                className="bg-[var(--gold)] text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-[var(--gold-light)] transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--dim)]">
          © 2026 GoldTee · All rights reserved ·{" "}
          <em>
            The odds of hitting two holes-in-one in one round: 1 in 67 million
            🎯
          </em>
        </div>
      </div>
    </footer>
  );
}
