"use client";
import { useState } from "react";
import { formatZAR } from "@/lib/format";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  images: string[];
  featured: boolean;
  category: { id: string; name: string };
};

type Category = { id: string; name: string };

type Order = {
  id: string;
  name: string;
  email: string;
  status: string;
  total: number;
  createdAt: Date | string;
  items: { quantity: number; price: number; product: { name: string } }[];
};

type Props = {
  products: Product[];
  categories: Category[];
  orders: Order[];
};

export default function AdminClient({ products, categories, orders }: Props) {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: categories[0]?.id ?? "",
    description: "",
    images: "",
    featured: false,
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target as HTMLInputElement;
    setForm({
      ...form,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: form.images ? form.images.split(",").map((s) => s.trim()) : [],
      }),
    });
    setSaving(false);
    setShowForm(false);
    setForm({
      name: "",
      price: "",
      stock: "",
      categoryId: categories[0]?.id ?? "",
      description: "",
      images: "",
      featured: false,
    });
    router.refresh();
  }

  async function updateStock(id: string, stock: number) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    router.refresh();
  }

  return (
    <main className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">⚙ Stock Manager</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-[var(--gold)] text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-[var(--gold-light)] transition-colors"
        >
          + Add Product
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-[var(--border)]">
        {(["products", "orders"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors -mb-px border-b-2 ${
              tab === t
                ? "border-[var(--gold)] text-[var(--gold)]"
                : "border-transparent text-[var(--dim)] hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Add product form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <h2 className="sm:col-span-2 font-semibold text-white">New Product</h2>
          {[
            { name: "name", label: "Product Name", type: "text" },
            { name: "price", label: "Price (ZAR)", type: "number" },
            { name: "stock", label: "Stock Qty", type: "number" },
            { name: "images", label: "Image URLs (comma-separated)", type: "text" },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-xs text-[var(--dim)] mb-1.5">{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name as keyof typeof form] as string}
                onChange={handleChange}
                required={["name", "price", "stock"].includes(f.name)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--gold)]/50"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-[var(--dim)] mb-1.5">Category</label>
            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-white rounded-lg px-3 py-2 text-sm focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              id="featured"
              checked={form.featured}
              onChange={handleChange}
              className="accent-[var(--gold)]"
            />
            <label htmlFor="featured" className="text-sm text-[var(--dim)]">
              Featured product
            </label>
          </div>
          <div className="sm:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-[var(--gold)] text-black font-semibold px-6 py-2.5 rounded-lg hover:bg-[var(--gold-light)] transition-colors text-sm disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Product"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[var(--dim)] hover:text-white text-sm px-4"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products tab */}
      {tab === "products" && (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface)] text-[var(--dim)] text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-center">Featured</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {products.map((p) => (
                <tr key={p.id} className="bg-[var(--surface-2)] hover:bg-[var(--surface)] transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-[var(--dim)]">{p.category.name}</td>
                  <td className="px-4 py-3 text-right text-[var(--gold)]">
                    {formatZAR(p.price)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => updateStock(p.id, p.stock - 1)}
                        disabled={p.stock === 0}
                        className="w-6 h-6 rounded bg-[var(--border)] text-white hover:bg-[var(--gold)] hover:text-black transition-colors text-xs disabled:opacity-30"
                      >
                        −
                      </button>
                      <span className={p.stock === 0 ? "text-red-400" : "text-white"}>
                        {p.stock}
                      </span>
                      <button
                        onClick={() => updateStock(p.id, p.stock + 1)}
                        className="w-6 h-6 rounded bg-[var(--border)] text-white hover:bg-[var(--gold)] hover:text-black transition-colors text-xs"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.featured ? "⭐" : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="text-center py-12 text-[var(--dim)]">No products yet. Add one above.</div>
          )}
        </div>
      )}

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <p className="font-medium text-white">{order.name}</p>
                  <p className="text-xs text-[var(--dim)]">{order.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      order.status === "PENDING"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : order.status === "CONFIRMED"
                        ? "bg-blue-500/20 text-blue-400"
                        : order.status === "SHIPPED"
                        ? "bg-purple-500/20 text-purple-400"
                        : order.status === "DELIVERED"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-[var(--gold)] font-semibold">
                    {formatZAR(order.total)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-[var(--dim)] space-y-0.5">
                {order.items.map((item, i) => (
                  <div key={i}>
                    {item.product.name} ×{item.quantity}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-12 text-[var(--dim)]">No orders yet.</div>
          )}
        </div>
      )}
    </main>
  );
}
