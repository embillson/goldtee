"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/store/cart";
import { formatZAR } from "@/lib/format";

type Variant = {
  id: string;
  label: string;
  price: number;
  color: string | null;
  imageIdx: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  description: string | null;
  category: string;
  stock: number;
  variants: Variant[];
};

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
  const { addItem, toggleCart } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (!product) return;
    setImgIdx(0);
    setSelectedVariant(product.variants.length > 0 ? product.variants[0] : null);
  }, [product]);

  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!product) return null;

  const images = product.images.length > 0 ? product.images : [""];
  const activePrice = selectedVariant?.price ?? product.price;

  // When variant changes, switch to that variant's image
  function handleVariantSelect(v: Variant) {
    setSelectedVariant(v);
    if (v.imageIdx < images.length) setImgIdx(v.imageIdx);
  }

  function handleAdd() {
    const variantLabel = selectedVariant?.label;
    addItem({
      id: selectedVariant ? `${product.id}__${variantLabel}` : product.id,
      name: variantLabel ? `${product.name} — ${variantLabel}` : product.name,
      price: activePrice,
      image: images[imgIdx] ?? "",
    });
    onClose();
    toggleCart();
  }

  function prev() {
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setImgIdx((i) => (i + 1) % images.length);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col md:flex-row">

            {/* Image gallery */}
            <div className="md:w-1/2 flex-shrink-0">
              <div className="relative aspect-square bg-[var(--surface-2)] rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden">
                {images[imgIdx] ? (
                  <img
                    src={images[imgIdx]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl text-[var(--dim)]">
                    ⛳
                  </div>
                )}

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors text-lg"
                    >
                      ‹
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors text-lg"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Dot indicators */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`rounded-full transition-all duration-200 ${
                          i === imgIdx
                            ? "bg-[var(--gold)] w-4 h-1.5"
                            : "bg-white/40 w-1.5 h-1.5"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === imgIdx
                          ? "border-[var(--gold)]"
                          : "border-[var(--border)] opacity-50 hover:opacity-100"
                      }`}
                    >
                      {src ? (
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[var(--surface-2)] flex items-center justify-center text-xl">⛳</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="md:w-1/2 p-6 flex flex-col gap-5">
              {/* Close button */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs bg-[var(--gold)]/20 text-[var(--gold)] border border-[var(--gold)]/30 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-[var(--dim)] hover:text-[var(--white)] text-xl leading-none ml-4"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-xl font-bold text-[var(--white)] leading-snug">
                {product.name}
              </h2>

              {product.description && (
                <p className="text-sm text-[var(--dim)] leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--dim)] uppercase tracking-wider mb-2 font-medium">
                    {product.variants[0].color ? "Colour" : "Size"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleVariantSelect(v)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                          selectedVariant?.id === v.id
                            ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
                            : "border-[var(--border)] text-[var(--dim)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]"
                        }`}
                      >
                        {v.color && (
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                            style={{ background: v.color }}
                          />
                        )}
                        {v.label}
                        {v.price !== product.price && (
                          <span className="text-xs opacity-60">
                            {formatZAR(v.price)}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock */}
              <p className={`text-xs font-medium ${product.stock > 0 ? "text-[var(--ok)]" : "text-red-400"}`}>
                {product.stock > 0 ? `✓ In stock (${product.stock} left)` : "✗ Out of stock"}
              </p>

              {/* Price + CTA */}
              <div className="mt-auto pt-4 border-t border-[var(--border)] flex items-center justify-between gap-4">
                <span className="text-2xl font-bold text-[var(--gold)]">
                  {formatZAR(activePrice)}
                </span>
                <button
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="flex-1 bg-[var(--gold)] text-[var(--dark)] font-semibold py-3 rounded-full hover:bg-[var(--gold-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
