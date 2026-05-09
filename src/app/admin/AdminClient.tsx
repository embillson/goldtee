"use client";
import { useState } from "react";
import { formatZAR } from "@/lib/format";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

type RowEdit = { stock: string; price: string };

export default function AdminClient({ products, categories, orders }: Props) {
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [edits, setEdits] = useState<Record<string, RowEdit>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>(
    () => Object.fromEntries(orders.map((o) => [o.id, o.status]))
  );
  const [statusSaving, setStatusSaving] = useState<Record<string, boolean>>({});

  async function updateOrderStatus(id: string, status: string) {
    setStatusSaving((s) => ({ ...s, [id]: true }));
    setOrderStatuses((s) => ({ ...s, [id]: status }));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setStatusSaving((s) => ({ ...s, [id]: false }));
  }
  const router = useRouter();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    categoryId: categories[0]?.id ?? "",
    description: "",
    images: "",
    featured: false,
  });

  function getEdit(p: Product): RowEdit {
    return edits[p.id] ?? { stock: String(p.stock), price: String(p.price) };
  }

  function setEdit(id: string, field: keyof RowEdit, value: string) {
    setEdits((prev) => ({
      ...prev,
      [id]: { ...getEditById(id), [field]: value },
    }));
  }

  function getEditById(id: string): RowEdit {
    const p = products.find((x) => x.id === id);
    return edits[id] ?? { stock: String(p?.stock ?? 0), price: String(p?.price ?? 0) };
  }

  async function saveRow(id: string) {
    const e = getEditById(id);
    setSaving((s) => ({ ...s, [id]: true }));
    await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: parseInt(e.stock), price: parseFloat(e.price) }),
    });
    setSaving((s) => ({ ...s, [id]: false }));
    router.refresh();
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const t = e.target as HTMLInputElement;
    setForm({ ...form, [t.name]: t.type === "checkbox" ? t.checked : t.value });
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSaving(true);
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
    setFormSaving(false);
    setShowForm(false);
    setForm({ name: "", price: "", stock: "", categoryId: categories[0]?.id ?? "", description: "", images: "", featured: false });
    router.refresh();
  }

  return (
    <div style={{ background: "var(--dark)", minHeight: "100vh", paddingTop: "64px" }}>

      {/* Header */}
      <div
        className="px-4 sm:px-10"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          paddingTop: "1.5rem",
          paddingBottom: "1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "28px", color: "var(--gold)", fontWeight: 700 }}>
            ⚙ GoldTee — Stock Manager
          </h1>
          <p style={{ fontSize: "13px", color: "var(--dim)", marginTop: "4px" }}>
            Manage your products, prices and stock levels
          </p>
        </div>
        <Link
          href="/"
          style={{
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--dim)",
            padding: "8px 18px",
            fontSize: "12px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            borderRadius: "2px",
            textDecoration: "none",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--gold)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--gold)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--dim)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)"; }}
        >
          ← Back to Store
        </Link>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-10" style={{ paddingTop: "2rem", paddingBottom: "2rem", display: "flex", flexDirection: "column", gap: "2rem" }}>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {[
            { label: "Total Revenue", val: formatZAR(totalRevenue), sub: `${orders.length} orders` },
            { label: "Products", val: String(products.length), sub: "in catalogue" },
            { label: "Low Stock", val: String(lowStock), sub: "items ≤ 5 units" },
            { label: "Out of Stock", val: String(outOfStock), sub: outOfStock === 0 ? "All good ✓" : "needs restocking" },
          ].map((s) => (
            <div key={s.label} style={{ background: "var(--surface)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "2px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--dim)", marginBottom: "8px" }}>
                {s.label}
              </div>
              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "32px", color: "var(--gold)", lineHeight: 1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "6px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Golf trivia */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--gold)",
          padding: "1rem 1.5rem",
          fontSize: "13px",
          color: "var(--dim)",
          borderRadius: "2px",
        }}>
          <span style={{ color: "var(--gold)", fontWeight: 600 }}>⛳ Golf trivia: </span>
          The modern wooden golf tee was patented in 1899 by Dr. George Grant — an African American dentist from Boston.
          Before that, golfers used small mounds of wet sand to tee up their ball.
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)" }}>
          {(["products", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "10px 20px",
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                fontWeight: 600,
                background: "transparent",
                border: "none",
                borderBottom: tab === t ? "2px solid var(--gold)" : "2px solid transparent",
                color: tab === t ? "var(--gold)" : "var(--dim)",
                cursor: "pointer",
                marginBottom: "-1px",
                transition: "color 0.2s",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Products table */}
        {tab === "products" && (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "var(--white)" }}>
                All Products
              </h3>
              <button
                onClick={() => setShowForm(!showForm)}
                style={{
                  background: "var(--gold)",
                  color: "var(--dark)",
                  border: "none",
                  padding: "8px 16px",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  cursor: "pointer",
                  borderRadius: "2px",
                  transition: "background 0.2s",
                }}
              >
                {showForm ? "✕ Cancel" : "+ Add Product"}
              </button>
            </div>

            {/* Add product form */}
            {showForm && (
              <form
                onSubmit={handleFormSubmit}
                className="px-4 sm:px-6"
              style={{ paddingTop: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "1rem" }}
              >
                {[
                  { name: "name", label: "Product Name", type: "text" },
                  { name: "price", label: "Price (ZAR)", type: "number" },
                  { name: "stock", label: "Stock Qty", type: "number" },
                  { name: "images", label: "Image URLs (comma-separated)", type: "text" },
                ].map((f) => (
                  <div key={f.name}>
                    <label style={{ display: "block", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--dim)", marginBottom: "6px" }}>
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      name={f.name}
                      value={form[f.name as keyof typeof form] as string}
                      onChange={handleFormChange}
                      required={["name", "price", "stock"].includes(f.name)}
                      style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--white)", padding: "7px 10px", fontSize: "13px", borderRadius: "2px", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "var(--dim)", marginBottom: "6px" }}>
                    Category
                  </label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleFormChange}
                    style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--white)", padding: "7px 10px", fontSize: "13px", borderRadius: "2px", outline: "none" }}
                  >
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    type="submit"
                    disabled={formSaving}
                    style={{ background: "var(--gold)", color: "var(--dark)", border: "none", padding: "8px 20px", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", borderRadius: "2px", opacity: formSaving ? 0.6 : 1 }}
                  >
                    {formSaving ? "Saving…" : "Save Product"}
                  </button>
                </div>
              </form>
            )}

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Product", "Category", "Price (R)", "Stock", "Status", "Actions"].map((h) => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--dim)", borderBottom: "1px solid var(--border)", fontWeight: 500 }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const e = getEdit(p);
                    const isSaving = saving[p.id];
                    const stock = parseInt(e.stock) || 0;
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid rgba(200,168,75,0.06)" }}>
                        <td style={{ padding: "12px 16px", fontSize: "14px", color: "var(--white)", fontWeight: 500 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {p.images[0] && (
                              <img src={p.images[0]} alt="" style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "2px", border: "1px solid var(--border)", flexShrink: 0 }} />
                            )}
                            {p.name}
                          </div>
                        </td>
                        <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--dim)" }}>
                          {p.category.name}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <input
                            type="number"
                            value={e.price}
                            onChange={(ev) => setEdit(p.id, "price", ev.target.value)}
                            style={{ width: "min(90px, 100%)", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", padding: "5px 8px", fontSize: "13px", textAlign: "center", borderRadius: "2px", outline: "none" }}
                          />
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <input
                            type="number"
                            value={e.stock}
                            onChange={(ev) => setEdit(p.id, "stock", ev.target.value)}
                            style={{ width: "min(70px, 100%)", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", padding: "5px 8px", fontSize: "13px", textAlign: "center", borderRadius: "2px", outline: "none" }}
                          />
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.5px",
                            padding: "3px 10px",
                            borderRadius: "2px",
                            background: stock === 0 ? "rgba(192,57,43,0.15)" : stock <= 5 ? "rgba(212,130,10,0.15)" : "rgba(45,110,45,0.15)",
                            color: stock === 0 ? "#e74c3c" : stock <= 5 ? "var(--amber)" : "#6fcf6f",
                            border: `1px solid ${stock === 0 ? "rgba(192,57,43,0.3)" : stock <= 5 ? "rgba(212,130,10,0.3)" : "rgba(45,110,45,0.3)"}`,
                          }}>
                            {stock === 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <button
                            onClick={() => saveRow(p.id)}
                            disabled={isSaving}
                            style={{
                              background: "transparent",
                              border: "1px solid var(--ok)",
                              color: "#6fcf6f",
                              padding: "5px 12px",
                              fontSize: "11px",
                              letterSpacing: "1px",
                              textTransform: "uppercase",
                              cursor: "pointer",
                              borderRadius: "2px",
                              opacity: isSaving ? 0.5 : 1,
                              transition: "all 0.2s",
                            }}
                          >
                            {isSaving ? "Saving…" : "Save"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {products.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--dim)", fontSize: "14px" }}>
                  No products yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === "orders" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {orders.map((order) => (
              <div key={order.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2px", padding: "1rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <div>
                    <p style={{ color: "var(--white)", fontWeight: 600, fontSize: "14px" }}>{order.name}</p>
                    <p style={{ color: "var(--dim)", fontSize: "12px", marginTop: "2px" }}>{order.email}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <select
                      value={orderStatuses[order.id] ?? order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      disabled={statusSaving[order.id]}
                      style={{
                        background: "var(--surface-2)",
                        border: "1px solid var(--border)",
                        color: (() => {
                          const s = orderStatuses[order.id] ?? order.status;
                          return s === "PENDING" ? "#facc15" : s === "DELIVERED" ? "#6fcf6f" : s === "CANCELLED" ? "#e74c3c" : "var(--gold)";
                        })(),
                        padding: "4px 8px",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.5px",
                        borderRadius: "2px",
                        outline: "none",
                        cursor: "pointer",
                        opacity: statusSaving[order.id] ? 0.5 : 1,
                      }}
                    >
                      {["PENDING","CONFIRMED","SHIPPED","DELIVERED","CANCELLED"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <span style={{ color: "var(--gold)", fontWeight: 700, fontFamily: "Georgia, serif", fontSize: "18px" }}>
                      {formatZAR(order.total)}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: "12px", color: "var(--dim)" }}>
                  {order.items.map((item, i) => (
                    <span key={i}>{item.product.name} ×{item.quantity}{i < order.items.length - 1 ? " · " : ""}</span>
                  ))}
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--dim)", fontSize: "14px" }}>No orders yet.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
