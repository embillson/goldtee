export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--dark)] pt-16">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--green)] via-[var(--dark)] to-[var(--dark)]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--dark)] to-transparent" />

      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[var(--gold)]/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[var(--gold)]/8" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-[var(--gold)] text-sm font-semibold tracking-widest uppercase mb-4">
          Premium Golf Equipment
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Elevate Your{" "}
          <span className="text-[var(--gold)]">Game.</span>
        </h1>
        <p className="text-[var(--dim)] text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
          Premium golf gadgets and accessories crafted for those who play
          seriously.
        </p>
        <a
          href="#shop"
          className="inline-block bg-[var(--gold)] text-black font-semibold px-8 py-4 rounded-full text-base hover:bg-[var(--gold-light)] transition-colors"
        >
          Shop the Collection →
        </a>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[var(--dim)]">
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-[var(--dim)] to-transparent" />
      </div>
    </section>
  );
}
