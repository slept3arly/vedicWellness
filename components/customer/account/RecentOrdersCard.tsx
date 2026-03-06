import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, XCircle, Package } from "lucide-react";

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
};

type Props = {
  orders: Order[];
};

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; className: string }> = {
  PAID: {
    label: "Paid",
    icon: <CheckCircle2 className="w-3 h-3" />,
    className: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
  },
  CREATED: {
    label: "Pending",
    icon: <Clock className="w-3 h-3" />,
    className: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40",
  },
  PAYMENT_FAILED: {
    label: "Failed",
    icon: <XCircle className="w-3 h-3" />,
    className: "text-red-500 bg-red-50 dark:bg-red-950/40",
  },
  EXPIRED: {
    label: "Expired",
    icon: <XCircle className="w-3 h-3" />,
    className: "text-red-400 bg-red-50/50 dark:bg-red-950/30",
  },
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function timeAgo(date: Date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function RecentOrdersCard({ orders }: Props) {
  const recent = orders.slice(0, 5);

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-main)]">Recent Orders</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">Your last {recent.length} orders</p>
        </div>
        <Link
          href="/orders"
          className="flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
        >
          View all
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {!recent.length ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-6">
          <Package className="w-8 h-8 text-[var(--text-muted)] opacity-40" />
          <p className="text-sm text-[var(--text-muted)]">No orders yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 flex-1">
          {recent.map((order) => {
            const config = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              icon: <Package className="w-3 h-3" />,
              className: "text-[var(--text-muted)] bg-[var(--bg-subtle)]",
            };

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="group flex items-center justify-between gap-3 rounded-lg border border-[var(--border-soft)] px-3 py-2.5 hover:border-[var(--text-muted)]/30 hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-mono font-semibold text-[var(--text-main)]">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    {timeAgo(order.createdAt)}
                  </p>
                </div>

                <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${config.className}`}>
                  {config.icon}
                  {config.label}
                </div>

                <p className="text-sm font-semibold text-[var(--text-main)] shrink-0 tabular-nums">
                  {formatAmount(order.totalAmount)}
                </p>

                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}