"use client";
import { useCart } from "@/store/cart";
import { formatZAR } from "@/lib/format";

type Props = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  category,
  stock,
}: Props) {
  const { addItem, toggleCart } = useCart();

  function handleAdd() {
    addItem({ id, name, price, image });
    toggleCart();
  }

  return (
    <div className="group bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-[var(--surface-2)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            ⛳
          </div>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-white bg-red-600 px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-xs bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 px-2 py-1 rounded-full">
            {category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-white text-sm leading-snug mb-2 line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[var(--gold)] font-bold text-lg">
            {formatZAR(price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={stock === 0}
            className="bg-[var(--gold)] text-black text-xs font-semibold px-4 py-2 rounded-full hover:bg-[var(--gold-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
