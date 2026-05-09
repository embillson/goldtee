import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatZAR } from "@/lib/format";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  return (
    <main className="pt-28 pb-20 px-4 max-w-2xl mx-auto">
      {/* Success header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-[var(--ok)]/20 border border-[var(--ok)]/40 flex items-center justify-center text-3xl mx-auto mb-5">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
        <p className="text-[var(--dim)]">
          Thanks {order.name.split(" ")[0]}, your order is on its way.
        </p>
        <p className="text-xs text-[var(--dim)] mt-2 font-mono">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Order details card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-white">Items Ordered</h2>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              {item.product.images[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-[var(--border)]"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {item.product.name}
                </p>
                <p className="text-xs text-[var(--dim)] mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <span className="text-sm text-[var(--gold)] font-semibold flex-shrink-0">
                {formatZAR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center px-6 py-4 border-t border-[var(--border)] bg-[var(--surface-2)]">
          <span className="font-semibold text-white">Total</span>
          <span className="text-[var(--gold)] text-lg font-bold">
            {formatZAR(order.total)}
          </span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-6 py-5 mb-8">
        <h2 className="font-semibold text-white mb-3">Delivery To</h2>
        <div className="text-sm text-[var(--dim)] space-y-1">
          <p className="text-white">{order.name}</p>
          <p>{order.address}</p>
          <p>{order.city}, {order.province} {order.postalCode}</p>
          <p className="pt-1">{order.email}</p>
          {order.phone && <p>{order.phone}</p>}
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/#shop"
          className="inline-block bg-[var(--gold)] text-[var(--dark)] font-semibold px-8 py-3.5 rounded-full hover:bg-[var(--gold-light)] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
