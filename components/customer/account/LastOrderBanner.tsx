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
    <Link href={`/orders/${order.id}`} className="group block active:scale-[0.98] transition-transform">
      <div className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 bg-sky-50 dark:bg-sky-950/50 border border-sky-200/60 dark:border-sky-700/40 shadow-sm shadow-sky-100 dark:shadow-none">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-900/60 flex items-center justify-center">
            <Package className="w-4.5 h-4.5 text-sky-600 dark:text-sky-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-sky-500 dark:text-sky-400 uppercase tracking-wide">
                Last Order
              </span>
              <span className="text-[10px] text-sky-400/80 dark:text-sky-500">
                · {formatDate(order.createdAt)}
              </span>
            </div>
            <p className="text-sm font-bold text-sky-900 dark:text-sky-100 truncate mt-0.5">
              {productLabel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <p className="text-sm font-bold text-sky-900 dark:text-sky-100 tabular-nums">
            {formatAmount(order.totalAmount)}
          </p>
          <ArrowRight className="w-3.5 h-3.5 text-sky-500 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}