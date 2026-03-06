import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Package,
} from "lucide-react";

type Props = {
  status: string;
  totalAmount: number;
  currency: string;
  timeLeft?: string | null;
};

const STATUS = {
  PAID: {
    label: "Payment confirmed",
    sub: "Your order has been paid and is being processed.",
    icon: CheckCircle2,
    cardClass: "border-emerald-300/60 dark:border-emerald-700/40 bg-emerald-50/40 dark:bg-emerald-950/20",
    iconClass: "text-emerald-600 dark:text-emerald-400",
    labelClass: "text-emerald-700 dark:text-emerald-300",
  },
  CREATED: {
    label: "Awaiting payment",
    sub: "Complete payment before this order expires.",
    icon: Clock,
    cardClass: "border-amber-300/60 dark:border-amber-700/40 bg-amber-50/40 dark:bg-amber-950/20",
    iconClass: "text-amber-600 dark:text-amber-400",
    labelClass: "text-amber-700 dark:text-amber-300",
  },
  PAYMENT_FAILED: {
    label: "Payment failed",
    sub: "Something went wrong. You can retry payment below.",
    icon: XCircle,
    cardClass: "border-red-300/60 dark:border-red-700/40 bg-red-50/40 dark:bg-red-950/20",
    iconClass: "text-red-500 dark:text-red-400",
    labelClass: "text-red-600 dark:text-red-300",
  },
  EXPIRED: {
    label: "Order expired",
    sub: "Payment window closed. Please place a new order.",
    icon: AlertTriangle,
    cardClass: "border-zinc-300/60 dark:border-zinc-700/40 bg-zinc-50/40 dark:bg-zinc-800/20",
    iconClass: "text-zinc-500",
    labelClass: "text-zinc-600 dark:text-zinc-400",
  },
  CANCELLED: {
    label: "Order cancelled",
    sub: "This order was cancelled and will not be processed.",
    icon: XCircle,
    cardClass: "border-zinc-300/60 dark:border-zinc-700/40 bg-zinc-50/40 dark:bg-zinc-800/20",
    iconClass: "text-zinc-500",
    labelClass: "text-zinc-600 dark:text-zinc-400",
  },
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderStatusBanner({ status, totalAmount, currency, timeLeft }: Props) {
  const cfg = STATUS[status as keyof typeof STATUS] ?? {
    label: status,
    sub: "",
    icon: Package,
    cardClass: "border-[var(--border-soft)] bg-[var(--bg-subtle)]",
    iconClass: "text-[var(--text-muted)]",
    labelClass: "text-[var(--text-main)]",
  };

  const Icon = cfg.icon;
  const isPayable = status === "CREATED" || status === "PAYMENT_FAILED";

  return (
    <div className={`rounded-xl border p-4 sm:p-5 ${cfg.cardClass}`}>
      <div className="flex items-start gap-4">
        <div className={`shrink-0 mt-0.5 ${cfg.iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${cfg.labelClass}`}>{cfg.label}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{cfg.sub}</p>

          {isPayable && timeLeft && timeLeft !== "Expired" && (
            <div className="flex items-center gap-1.5 mt-2">
              <Clock className="w-3 h-3 text-amber-500" />
              <span className="text-xs text-[var(--text-muted)]">
                Expires in{" "}
                <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums font-mono">
                  {timeLeft}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 text-right">
          <p className="text-xs text-[var(--text-muted)] mb-0.5">Order total</p>
          <p className="text-xl font-bold text-[var(--text-main)] tabular-nums">
            {formatAmount(totalAmount, currency)}
          </p>
        </div>
      </div>
    </div>
  );
}