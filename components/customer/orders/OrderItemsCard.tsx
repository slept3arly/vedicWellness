import Link from "next/link";
import { ShoppingBag, ExternalLink } from "lucide-react";

type Item = {
  id: string;
  productName: string;
  productId: string | null;
  price: number;
  quantity: number;
};

type Props = {
  items: Item[];
  totalAmount: number;
  currency: string;
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderItemsCard({ items, totalAmount, currency }: Props) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-soft)]">
        <ShoppingBag className="w-4 h-4 text-[var(--text-muted)]" />
        <p className="text-sm font-semibold text-[var(--text-main)]">Items ordered</p>
        <span className="ml-auto text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] px-2 py-0.5 rounded-full">
          {items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Item rows */}
      <div className="divide-y divide-[var(--border-soft)]">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-4 py-3 group">
            {/* Color dot */}
            <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center text-xs font-bold text-[var(--text-muted)]">
              ×{item.quantity}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--text-main)] truncate">
                  {item.productName}
                </p>
                <Link
                  href={`/products/${item.productId}`}
                  className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                  title="View product"
                >
                  <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
                </Link>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {formatAmount(item.price, currency)} × {item.quantity}
              </p>
            </div>

            <p className="text-sm font-semibold text-[var(--text-main)] tabular-nums shrink-0">
              {formatAmount(item.price * item.quantity, currency)}
            </p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-[var(--border-soft)] bg-[var(--bg-subtle)] px-4 py-3 space-y-1.5">
        {subtotal !== totalAmount && (
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatAmount(subtotal, currency)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-bold text-[var(--text-main)]">
          <span>Total</span>
          <span className="tabular-nums">{formatAmount(totalAmount, currency)}</span>
        </div>
      </div>
    </div>
  );
}