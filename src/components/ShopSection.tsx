"use client";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { useDebounce } from "@/lib/useDebounce";

type Variant = {
  id: string;
  label: string;
  price: number;
  color: string | null;
  imageIdx: number;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: string[];
  description: string | null;
  stock: number;
  category: { id: string; name: string };
  variants: Variant[];
};

type Category = { id: string; name: string };

type Props = {
  products: Product[];
  categories: Category[];
};

export default function ShopSection({ products, categories }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 250);
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalProduct, setModalProduct] = useState<Product | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get("product");
    if (slug) {
      const found = products.find((p) => p.slug === slug);
      if (found) setModalProduct(found);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openModal(product: Product) {
    setModalProduct(product);
    const params = new URLSearchParams(searchParams.toString());
    params.set("product", product.slug);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  function closeModal() {
    setModalProduct(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("product");
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/", { scroll: false });
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCat = activeCategory === "All" || p.category.name === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, debouncedSearch, activeCategory]);

  return (
    <>
      <section
        id="shop"
        className="px-4 sm:px-10"
        style={{ paddingTop: "5rem", paddingBottom: "5rem", background: "var(--dark)", position: "relative", zIndex: 1 }}
      >
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(32px,5vw,42px)", fontWeight: 700, color: "var(--white)", lineHeight: 1.1 }}>
              The <span style={{ color: "var(--gold)" }}>Collection</span>
            </h2>
          </div>
          <div style={{ fontSize: "13px", color: "var(--dim)" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Filter bar */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "2.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--dim)", fontSize: "15px" }}>⌕</span>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                padding: "12px 16px 12px 44px",
                fontSize: "14px",
                color: "var(--text)",
                outline: "none",
                transition: "border 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["All", ...categories.map((c) => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "inherit",
                  background: activeCategory === cat ? "var(--gold)" : "transparent",
                  color: activeCategory === cat ? "var(--dark)" : "var(--dim)",
                  borderColor: activeCategory === cat ? "var(--gold)" : "var(--border)",
                  fontWeight: activeCategory === cat ? 600 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: "var(--dim)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⛳</div>
            <p style={{ fontSize: "14px" }}>No products found</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "2px",
          }}>
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                images={product.images}
                description={product.description}
                category={product.category.name}
                stock={product.stock}
                variants={product.variants}
                onOpenModal={() => openModal(product)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Product modal */}
      <ProductModal
        product={
          modalProduct
            ? { ...modalProduct, category: modalProduct.category.name }
            : null
        }
        related={
          modalProduct
            ? products
                .filter((p) => p.category.id === modalProduct.category.id && p.id !== modalProduct.id)
                .slice(0, 3)
                .map((p) => ({ ...p, category: p.category.name }))
            : []
        }
        onClose={closeModal}
        onOpenProduct={(p) => {
          const full = products.find((x) => x.id === p.id);
          if (full) openModal(full);
        }}
      />
    </>
  );
}
