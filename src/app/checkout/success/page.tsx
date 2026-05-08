import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="pt-28 pb-20 px-4 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-white mb-3">Order Placed!</h1>
      <p className="text-[var(--dim)] max-w-md mx-auto mb-8">
        Thank you for your order. We'll be in touch via email with your delivery
        details.
      </p>
      <Link
        href="/"
        className="inline-block bg-[var(--gold)] text-black font-semibold px-8 py-3 rounded-full hover:bg-[var(--gold-light)] transition-colors"
      >
        Back to Shop
      </Link>
    </main>
  );
}
