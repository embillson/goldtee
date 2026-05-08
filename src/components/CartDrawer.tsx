"use client";
import { useCart } from "@/store/cart";
import { formatZAR } from "@/lib/format";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQty, total, count } =
    useCart();

  const itemCount = count();
  const cartTotal = total();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={toggleCart}
      />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--surface)] z-50 flex flex-col shadow-2xl border-l border-[var(--border)]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-white">
            Cart{" "}
            {itemCount > 0 && (
              <span className="text-[var(--dim)] font-normal text-sm ml-1">
                ({itemCount} item{itemCount !== 1 ? "s" : ""})
              </span>
            )}
          </h2>
          <button
            onClick={toggleCart}
            className="text-[var(--dim)] hover:text-white text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-[var(--dim)] py-16">
              <div className="text-4xl mb-3">🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-[var(--surface-2)] rounded-lg p-3"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-[var(--gold)] mt-0.5">
                    {formatZAR(item.price)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-[var(--border)] text-white text-sm hover:bg-[var(--gold)] hover:text-black transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-[var(--border)] text-white text-sm hover:bg-[var(--gold)] hover:text-black transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-[var(--dim)] hover:text-red-400 text-sm self-start"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--dim)]">Subtotal</span>
              <span className="font-semibold text-white">
                {formatZAR(cartTotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full text-center bg-[var(--gold)] text-black font-semibold py-3 rounded-lg hover:bg-[var(--gold-light)] transition-colors"
            >
              Checkout →
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
