import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";

type Props = {
  order: {
    id: string;
    totalAmount: number;
    createdAt: Date;
    firstProductName: string | null;
    itemCount: number;
  };
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function LastOrderBanner({ order }: Props) {
  const productLabel = order.firstProductName
    ? order.itemCount > 1
      ? `${order.firstProductName} +${order.itemCount - 1} more`
      : order.firstProductName
    : `${order.itemCount} item${order.itemCount !== 1 ? "s" : ""}`;

  return (
    <Link
      href={`/orders/${order.id}`}
      className="group flex items-center gap-4 rounded-xl border border-[var(--border-soft)] bg-white dark:bg-zinc-900 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
        <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--text-muted)] mb-0.5">
          Last order · {formatDate(order.createdAt)}
        </p>
        <p className="text-sm font-medium text-[var(--text-main)] truncate">
          {productLabel}
        </p>
      </div>

      <p className="text-sm font-semibold text-[var(--text-main)] shrink-0 tabular-nums">
        {formatAmount(order.totalAmount)}
      </p>

      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}