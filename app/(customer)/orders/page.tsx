import { requireUser } from "@/lib/auth/requireUser";
import { getUserOrders } from "@/lib/services/orderService";
import Link from "next/link";
import {
  ArrowRight, Clock, CheckCircle2, XCircle,
  ShoppingBag, Package, AlertTriangle,
} from "lucide-react";

const STATUS = {
  PAID: {
    label: "Paid",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    badgeClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-700/40",
    rowHighlight: "",
    dotClass: "bg-emerald-500",
  },
  CREATED: {
    label: "Awaiting Payment",
    icon: <Clock className="w-3.5 h-3.5" />,
    badgeClass: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-700/40",
    rowHighlight: "bg-amber-50/20 dark:bg-amber-950/10",
    dotClass: "bg-amber-400 animate-pulse",
  },
  PAYMENT_FAILED: {
    label: "Failed",
    icon: <XCircle className="w-3.5 h-3.5" />,
    badgeClass: "text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200/60 dark:border-red-700/40",
    rowHighlight: "",
    dotClass: "bg-red-400",
  },
  EXPIRED: {
    label: "Expired",
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
    badgeClass: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-700/40",
    rowHighlight: "",
    dotClass: "bg-zinc-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <XCircle className="w-3.5 h-3.5" />,
    badgeClass: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200/60 dark:border-zinc-700/40",
    rowHighlight: "",
    dotClass: "bg-zinc-400",
  },
} as const;

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildItemSummary(items: { productName: string; quantity: number }[]): string {
  if (!items.length) return "No items";
  const first = items[0];
  const rest = items.length - 1;
  const label = first.quantity > 1
    ? `${first.productName} ×${first.quantity}`
    : first.productName;
  return rest > 0 ? `${label} +${rest} more` : label;
}

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getUserOrders(user.id);

  const pendingCount = orders.filter((o) => o.status === "CREATED").length;
  const paidCount    = orders.filter((o) => o.status === "PAID").length;
  const totalSpent   = orders
    .filter((o) => o.status === "PAID")
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="space-y-6 pb-10">

      {/* ── Centered heading ── */}
      <div className="text-center pt-2">
        <h1 className="text-3xl font-bold text-[var(--text-main)] tracking-tight">
          My Orders
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          {orders.length > 0
            ? `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`
            : "No orders placed yet"}
        </p>

        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-700/40 px-3 py-1.5 rounded-full">
            <Clock className="w-3 h-3" />
            {pendingCount} order{pendingCount !== 1 ? "s" : ""} awaiting payment
          </div>
        )}
      </div>

      {/* ── Stats strip ── */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-3 flex flex-col items-center text-center gap-0.5">
            <p className="text-xl font-bold text-[var(--text-main)] tabular-nums">{orders.length}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Total</p>
          </div>
          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-3 flex flex-col items-center text-center gap-0.5">
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{paidCount}</p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Paid</p>
          </div>
          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] px-4 py-3 flex flex-col items-center text-center gap-0.5">
            <p className="text-xl font-bold text-[var(--text-main)] tabular-nums">
              {totalSpent >= 1000 ? `₹${(totalSpent / 1000).toFixed(1)}k` : `₹${totalSpent}`}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Spent</p>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {orders.length === 0 && (
        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--bg-subtle)] flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-[var(--text-muted)]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-main)]">No orders yet</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Browse our products and place your first order</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-[var(--brand-primary)] hover:underline">
            Shop now →
          </Link>
        </div>
      )}

      {/* ── Order list ── */}
      {orders.length > 0 && (
        <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] divide-y divide-[var(--border-soft)] overflow-hidden">
          {orders.map((order) => {
            const cfg = STATUS[order.status as keyof typeof STATUS] ?? {
              label: order.status,
              icon: <Package className="w-3.5 h-3.5" />,
              badgeClass: "text-[var(--text-muted)] bg-[var(--bg-subtle)] border-[var(--border-soft)]",
              rowHighlight: "",
              dotClass: "bg-zinc-400",
            };

            const itemSummary = buildItemSummary(order.items ?? []);
            const itemCount   = (order.items ?? []).reduce((s, i) => s + i.quantity, 0);

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className={`group flex items-center gap-3 sm:gap-4 px-4 py-4 hover:bg-[var(--bg-subtle)] transition-colors ${cfg.rowHighlight}`}
              >
                {/* Status dot + icon */}
                <div className="shrink-0 relative">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-subtle)] group-hover:bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                  <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[var(--bg-surface)] ${cfg.dotClass}`} />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  {/* Top row: ID + amount */}
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-[var(--text-main)] font-mono tracking-wide">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm font-bold text-[var(--text-main)] tabular-nums shrink-0">
                      {formatAmount(order.totalAmount)}
                    </p>
                  </div>

                  {/* Middle row: item summary */}
                  <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                    {itemSummary}
                    {itemCount > 0 && (
                      <span className="ml-1 text-[var(--text-muted)] opacity-50">
                        · {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>

                  {/* Bottom row: date + badge */}
                  <div className="flex items-center justify-between mt-1.5 gap-2">
                    <p className="text-[10px] text-[var(--text-muted)] opacity-70">
                      {formatDate(order.createdAt)}
                    </p>
                    <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${cfg.badgeClass}`}>
                      {cfg.icon}
                      <span>{cfg.label}</span>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}