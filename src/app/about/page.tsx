export default function AboutPage() {
  const faqs = [
    {
      q: "How do I place an order?",
      a: "Browse our products, add items to your cart, and proceed to checkout. Simple and secure.",
    },
    {
      q: "Do you deliver across South Africa?",
      a: "Yes! We deliver nationwide. We're integrating a courier partner for live tracking — coming very soon.",
    },
    {
      q: "What is your return policy?",
      a: "We accept returns within 7 days of delivery for unused items in original packaging.",
    },
    {
      q: "How long does delivery take?",
      a: "Typically 3–5 business days for major cities and 5–7 days for outlying areas.",
    },
  ];

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="bg-[var(--surface)] py-20 px-4 text-center border-b border-[var(--border)]">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          ⛳ About <span className="text-[var(--gold)]">GoldTee</span>
        </h1>
        <p className="text-[var(--dim)] max-w-xl mx-auto text-lg">
          Premium golf accessories for the serious golfer. South African owned,
          golfer tested.
        </p>
      </section>

      {/* Cards */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            icon: "🏌️",
            title: "Golfer First",
            text: "Every product is tested and selected by golfers for golfers. We only stock what we'd use ourselves.",
          },
          {
            icon: "🇿🇦",
            title: "South African",
            text: "Based in South Africa, serving golfers nationwide. Prices in Rand, service in your timezone.",
          },
          {
            icon: "⭐",
            title: "Premium Quality",
            text: "From Ryder Cup caps to launch monitors, we source only the best gear for your game.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-center hover:border-[var(--gold)]/40 transition-colors"
          >
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="font-semibold text-white mb-2">{card.title}</h3>
            <p className="text-sm text-[var(--dim)] leading-relaxed">
              {card.text}
            </p>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group bg-[var(--surface)] border border-[var(--border)] rounded-xl px-5 py-4 cursor-pointer hover:border-[var(--gold)]/40 transition-colors"
            >
              <summary className="font-medium text-white flex justify-between items-center list-none">
                {faq.q}
                <span className="text-[var(--gold)] text-lg group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="text-sm text-[var(--dim)] mt-3 leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
