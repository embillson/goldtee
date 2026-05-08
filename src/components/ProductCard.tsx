"use client";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatZAR } from "@/lib/format";

type Variant = {
  id: string;
  label: string;
  price: number;
  color: string | null;
  imageIdx: number;
};

type Props = {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  variants: Variant[];
};

export default function ProductCard({
  id, name, price, images, category, stock, variants,
}: Props) {
  const { addItem, toggleCart } = useCart();
  const hasVariants = variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    hasVariants ? variants[0] : null
  );

  const activePrice = selectedVariant?.price ?? price;
  const activeImage =
    images[selectedVariant?.imageIdx ?? 0] ?? images[0] ?? "";

  function handleAdd() {
    const variantLabel = selectedVariant?.label;
    addItem({
      id: hasVariants ? `${id}__${variantLabel}` : id,
      name: variantLabel ? `${name} — ${variantLabel}` : name,
      price: activePrice,
      image: activeImage,
    });
    toggleCart();
  }

  return (
    <div className="group bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--gold)]/40 transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-[var(--surface-2)]">
        {activeImage ? (
          <img
            src={activeImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-[var(--dim)]">
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
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-medium text-[var(--white)] text-sm leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Variant selector */}
        {hasVariants && (
          <div className="flex flex-wrap gap-1.5">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                title={v.label}
                className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedVariant?.id === v.id
                    ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
                    : "border-[var(--border)] text-[var(--dim)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]"
                }`}
              >
                {v.color && (
                  <span
                    className="w-3 h-3 rounded-full inline-block flex-shrink-0 border border-white/20"
                    style={{ background: v.color }}
                  />
                )}
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[var(--gold)] font-bold text-lg">
            {formatZAR(activePrice)}
          </span>
          <button
            onClick={handleAdd}
            disabled={stock === 0}
            className="bg-[var(--gold)] text-[var(--dark)] text-xs font-semibold px-4 py-2 rounded-full hover:bg-[var(--gold-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
