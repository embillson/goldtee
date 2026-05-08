"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/store/cart";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, toggleCart } = useCart();
  const itemCount = count();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-[var(--border)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-white"
        >
          ⛳ Gold<span className="text-[var(--gold)] font-light">Tee</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[var(--dim)]">
          <Link href="/#shop" className="hover:text-white transition-colors">
            Shop
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link
            href="/admin"
            className="text-xs border border-[var(--border)] px-3 py-1.5 rounded hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors"
          >
            ⚙ Stock Manager
          </Link>
        </div>

        {/* Cart + hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleCart}
            className="flex items-center gap-2 bg-[var(--gold)] text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-[var(--gold-light)] transition-colors"
          >
            🛒
            {itemCount > 0 && (
              <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-[var(--dim)] hover:text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--surface)] border-t border-[var(--border)] px-4 py-4 flex flex-col gap-4 text-sm">
          <Link
            href="/#shop"
            onClick={() => setMenuOpen(false)}
            className="text-[var(--dim)] hover:text-white transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="text-[var(--dim)] hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/admin"
            onClick={() => setMenuOpen(false)}
            className="text-[var(--dim)] hover:text-white transition-colors"
          >
            ⚙ Stock Manager
          </Link>
        </div>
      )}
    </header>
  );
}
