"use client";
import { useEffect, useState } from "react";

const BG_IMAGES = [
  "/hero/bg1.jpg",
  "/hero/bg2.jpg",
  "/hero/bg3.jpg",
  "/hero/bg4.jpg",
  "/hero/bg5.jpg",
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrev(current);
      setCurrent((c) => (c + 1) % BG_IMAGES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background layers */}
      {BG_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === current ? 1 : i === prev ? 0 : 0,
            zIndex: i === current ? 2 : i === prev ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 z-10" style={{ background: "linear-gradient(135deg, rgba(8,12,8,0.72) 0%, rgba(8,12,8,0.55) 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 bg-gradient-to-t from-[var(--dark)] to-transparent" />

      {/* Decorative circles */}
      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--gold)]/10 pointer-events-none" />
      <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[var(--gold)]/8 pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <p className="text-[var(--gold)] text-sm font-semibold tracking-widest uppercase mb-4">
          Premium Golf Equipment
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[var(--white)] mb-6 leading-tight">
          Elevate Your{" "}
          <span className="text-[var(--gold)]">Game.</span>
        </h1>
        <p className="text-[var(--dim)] text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Premium golf gadgets and accessories crafted for those who play
          seriously.
        </p>
        <button
          onClick={() => {
            const el = document.getElementById("shop");
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 64;
              window.scrollTo({ top: y, behavior: "smooth" });
            }
          }}
          className="inline-block bg-[var(--gold)] text-[var(--dark)] font-semibold px-8 py-4 rounded-full text-base hover:bg-[var(--gold-light)] transition-colors"
        >
          Shop the Collection →
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setPrev(current); setCurrent(i); }}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-[var(--gold)] w-4" : "bg-[var(--white)]/30"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-[var(--dim)]">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[var(--dim)] to-transparent" />
      </div>
    </section>
  );
}
