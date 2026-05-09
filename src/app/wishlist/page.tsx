"use client";
import { useWishlist } from "@/store/wishlist";
import { useCart } from "@/store/cart";
import { formatZAR } from "@/lib/format";
import Link from "next/link";

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem, toggleCart } = useCart();

  function moveToCart(item: (typeof items)[number]) {
    addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    remove(item.id);
    toggleCart();
  }

  return (
    <main className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">
          ♥ Wishlist
          {items.length > 0 && (
            <span className="ml-2 text-sm font-normal text-[var(--dim)]">
              {items.length} item{items.length !== 1 ? "s" : ""}
            </span>
          )}
        </h1>
        <Link href="/#shop" className="text-sm text-[var(--gold)] hover:underline">
          ← Back to shop
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-4xl sm:text-6xl mb-4 opacity-30">♡</div>
          <p className="text-[var(--dim)] mb-6">Your wishlist is empty</p>
          <Link
            href="/#shop"
            className="inline-block bg-[var(--gold)] text-[var(--dark)] font-semibold px-8 py-3 rounded-full hover:bg-[var(--gold-light)] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--gold)]/30 transition-colors"
            >
              <div className="aspect-square bg-[var(--surface-2)] relative">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-[var(--dim)]">⛳</div>
                )}
                <button
                  onClick={() => remove(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-red-400 hover:bg-black/70 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  ♥
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <span className="text-xs text-[var(--gold)] opacity-70">{item.category}</span>
                  <h3 className="font-semibold text-white text-sm mt-0.5">{item.name}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--gold)] font-bold">{formatZAR(item.price)}</span>
                </div>
                <button
                  onClick={() => moveToCart(item)}
                  className="w-full bg-[var(--gold)] text-[var(--dark)] text-sm font-semibold py-2.5 rounded-full hover:bg-[var(--gold-light)] transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
