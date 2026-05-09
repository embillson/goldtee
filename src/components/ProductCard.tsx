"use client";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useToast } from "@/store/toast";
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
  slug: string;
  name: string;
  price: number;
  images: string[];
  description: string | null;
  category: string;
  stock: number;
  variants: Variant[];
  onOpenModal: () => void;
};

export default function ProductCard({
  id, slug, name, price, images, description, category, stock, variants, onOpenModal,
}: Props) {
  const { addItem } = useCart();
  const { toggle: toggleWishlist, has } = useWishlist();
  const { show: showToast } = useToast();
  const wishlisted = has(id);

  const hasVariants = variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    hasVariants ? variants[0] : null
  );
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const activePrice = selectedVariant?.price ?? price;
  const activeImage = images[selectedVariant?.imageIdx ?? 0] ?? images[0] ?? "";

  const stockStatus =
    stock === 0 ? "out" : stock <= 5 ? "low" : "ok";

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation();
    if (stock === 0) return;
    const variantLabel = selectedVariant?.label;
    addItem({
      id: hasVariants ? `${id}__${variantLabel}` : id,
      name: variantLabel ? `${name} — ${variantLabel}` : name,
      price: activePrice,
      image: activeImage,
    });
    showToast(`${name} added to cart`);
  }

  return (
    <div
      onClick={onOpenModal}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--gold)" : "var(--border)"}`,
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.5)" : "none",
        transition: "all 0.3s",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: "200px", background: "var(--surface-2)", overflow: "hidden" }}>
        {activeImage ? (
          <img
            src={activeImage}
            alt={name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.5s ease",
            }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem", color: "var(--dim)" }}>
            ⛳
          </div>
        )}

        {/* Out of stock overlay */}
        {stock === 0 && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#fff", background: "#c0392b", padding: "4px 12px", letterSpacing: "1px", textTransform: "uppercase" }}>
              Out of Stock
            </span>
          </div>
        )}

        {/* Low stock badge */}
        {stock > 0 && stock <= 5 && (
          <div style={{ position: "absolute", top: "10px", left: "10px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", fontWeight: 600, background: "var(--amber)", color: "#fff" }}>
              Only {stock} left
            </span>
          </div>
        )}

        {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist({ id, slug, name, price: activePrice, image: activeImage, category });
            showToast(wishlisted ? `${name} removed from wishlist` : `${name} saved to wishlist`, "info");
          }}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "30px",
            height: "30px",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "15px",
            color: wishlisted ? "#e74c3c" : "rgba(255,255,255,0.5)",
            transition: "color 0.2s",
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "♥" : "♡"}
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--gold)" }}>
          {category}
        </div>
        <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "20px", fontWeight: 600, color: "var(--white)", lineHeight: 1.2 }}>
          {name}
        </div>
        {description && (
          <div className="line-clamp-2" style={{ fontSize: "13px", color: "var(--dim)", lineHeight: 1.5 }}>
            {description}
          </div>
        )}

        {/* Variant selector */}
        {hasVariants && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" }}
          >
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "4px 10px",
                  border: `1px solid ${selectedVariant?.id === v.id ? "var(--gold)" : "var(--border)"}`,
                  background: selectedVariant?.id === v.id ? "rgba(200,168,75,0.1)" : "transparent",
                  color: selectedVariant?.id === v.id ? "var(--gold)" : "var(--dim)",
                  fontSize: "11px",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  borderRadius: "2px",
                }}
              >
                {v.color && (
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: v.color, border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }} />
                )}
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Footer — price + stock */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
          <span style={{ fontSize: "20px", fontWeight: 600, color: "var(--gold)" }}>
            {formatZAR(activePrice)}
          </span>
          <span style={{
            fontSize: "11px",
            padding: "3px 10px",
            borderRadius: "20px",
            fontWeight: 500,
            background: stockStatus === "ok" ? "rgba(45,110,45,0.25)" : stockStatus === "low" ? "rgba(212,130,10,0.2)" : "rgba(192,57,43,0.2)",
            color: stockStatus === "ok" ? "#6fcf6f" : stockStatus === "low" ? "#e8a020" : "#e74c3c",
            border: `1px solid ${stockStatus === "ok" ? "rgba(45,110,45,0.4)" : stockStatus === "low" ? "rgba(212,130,10,0.3)" : "rgba(192,57,43,0.3)"}`,
          }}>
            {stockStatus === "ok" ? "In Stock" : stockStatus === "low" ? `${stock} left` : "Out of Stock"}
          </span>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAdd}
          disabled={stock === 0}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            width: "100%",
            marginTop: "10px",
            padding: "11px",
            background: stock === 0 ? "transparent" : btnHovered ? "var(--gold)" : "transparent",
            border: `1px solid ${stock === 0 ? "var(--dim)" : "var(--gold)"}`,
            color: stock === 0 ? "var(--dim)" : btnHovered ? "var(--dark)" : "var(--gold)",
            fontFamily: "inherit",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: stock === 0 ? "not-allowed" : "pointer",
            transition: "all 0.25s",
            fontWeight: 500,
            opacity: stock === 0 ? 0.3 : 1,
          }}
        >
          {stock === 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
