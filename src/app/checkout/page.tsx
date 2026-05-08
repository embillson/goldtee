"use client";
import { useState } from "react";
import { useCart } from "@/store/cart";
import { formatZAR } from "@/lib/format";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
          total: total(),
        }),
      });
      if (res.ok) {
        clearCart();
        router.push("/checkout/success");
      }
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="pt-28 text-center px-4">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Cart is empty</h1>
        <a href="/#shop" className="text-[var(--gold)] hover:underline">
          Back to shop →
        </a>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-semibold text-white text-lg mb-2">
            Delivery Details
          </h2>
          {[
            { name: "name", label: "Full Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone (optional)", type: "tel" },
            { name: "address", label: "Street Address", type: "text" },
            { name: "city", label: "City", type: "text" },
            { name: "postalCode", label: "Postal Code", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs text-[var(--dim)] mb-1.5 font-medium">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required={field.name !== "phone"}
                className="w-full bg-[var(--surface)] border border-[var(--border)] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)]/50 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-[var(--dim)] mb-1.5 font-medium">
              Province
            </label>
            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              required
              className="w-full bg-[var(--surface)] border border-[var(--border)] text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)]/50"
            >
              <option value="">Select province…</option>
              {[
                "Gauteng",
                "Western Cape",
                "KwaZulu-Natal",
                "Eastern Cape",
                "Limpopo",
                "Mpumalanga",
                "North West",
                "Northern Cape",
                "Free State",
              ].map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--gold)] text-black font-semibold py-3.5 rounded-lg hover:bg-[var(--gold-light)] transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? "Placing order…" : `Place Order · ${formatZAR(total())}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 h-fit">
          <h2 className="font-semibold text-white text-lg mb-4">
            Order Summary
          </h2>
          <div className="space-y-3 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[var(--dim)]">
                  {item.name}{" "}
                  <span className="text-xs">×{item.quantity}</span>
                </span>
                <span className="text-white">
                  {formatZAR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[var(--border)] pt-4 flex justify-between font-semibold">
            <span className="text-white">Total</span>
            <span className="text-[var(--gold)] text-lg">
              {formatZAR(total())}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
