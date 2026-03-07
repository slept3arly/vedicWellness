import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, XCircle, Package } from "lucide-react";
import Card from "@/components/public/ui/Card";

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
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    className: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
  },
  CREATED: {
    label: "Pending",
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "text-amber-600 dark:text-amber-500 bg-amber-500/10",
  },
  PAYMENT_FAILED: {
    label: "Failed",
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: "text-red-500 bg-red-500/10",
  },
  EXPIRED: {
    label: "Expired",
    icon: <XCircle className="w-3.5 h-3.5" />,
    className: "text-red-500 bg-red-500/10",
  },
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

export default function RecentOrdersCard({ orders }: Props) {
  const recent = orders.slice(0, 5);

  return (
    <Card className="flex flex-col h-full p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold font-heading text-[var(--text-main)]">Recent Orders</h3>
        <Link
          href="/orders"
          className="text-xs font-semibold font-heading text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1 group"
        >
          View All
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {!recent.length ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12 text-center">
          <Package className="w-7 h-7 text-[var(--text-muted)] opacity-40 mb-1" />
          <p className="text-sm font-accent italic text-[var(--text-muted)]">No orders placed yet.</p>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          {recent.map((order, i) => {
            const config = STATUS_CONFIG[order.status] ?? {
              label: order.status,
              icon: <Package className="w-3.5 h-3.5" />,
              className: "text-[var(--text-muted)] bg-[var(--bg-surface)]",
            };

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className={`group flex items-center justify-between gap-3 py-3.5 -mx-2 px-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/[0.02] transition-colors ${
                  i !== recent.length - 1 ? "border-b border-[var(--border-soft)]" : ""
                }`}
              >
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-bold font-heading text-[var(--text-main)] group-hover:text-brand-primary uppercase tracking-wider transition-colors">
                    #{order.id.slice(-8)}
                  </p>
                  <p className="text-xs font-body text-[var(--text-muted)] mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className={`flex items-center gap-1.5 text-xs font-bold font-heading px-2.5 py-1 rounded-full shrink-0 ${config.className}`}>
                  {config.icon}
                  {config.label}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-sm font-bold font-heading text-[var(--text-main)] tabular-nums">
                    {formatAmount(order.totalAmount)}
                  </p>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-0 -translate-x-1 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-brand-primary transition-all duration-200" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Card>
  );
}