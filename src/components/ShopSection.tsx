"use client";
import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";

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
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCat =
        activeCategory === "All" || p.category.name === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, search, activeCategory]);

  return (
    <section id="shop" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header — centred */}
      <div className="text-center mb-12">
        <p className="text-[var(--gold)] text-xs font-semibold tracking-widest uppercase mb-3">
          The Collection
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--white)]">
          {filtered.length} Product{filtered.length !== 1 ? "s" : ""}
        </h2>
      </div>

      {/* Filters — centred */}
      <div className="flex flex-col items-center gap-4 mb-12">
        {/* Search */}
        <div className="relative w-full max-w-sm">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--dim)]">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] text-[var(--white)] placeholder-[var(--dim)] rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap justify-center">
          {["All", ...categories.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-[var(--gold)] text-[var(--dark)]"
                  : "bg-[var(--surface)] text-[var(--dim)] border border-[var(--border)] hover:border-[var(--gold)]/40 hover:text-[var(--white)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid — centred with max width */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 text-[var(--dim)]">
          <div className="text-5xl mb-4">⛳</div>
          <p>No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              images={product.images}
              category={product.category.name}
              stock={product.stock}
              variants={product.variants}
            />
          ))}
        </div>
      )}
    </section>
  );
}
