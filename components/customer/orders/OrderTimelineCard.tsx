import { CheckCircle2, Circle, Clock, XCircle } from "lucide-react";

type Props = {
  status: string;
  createdAt: Date | string;
  paidAt?: Date | string | null;
  expiresAt?: Date | string | null;
};

function formatDateTime(date: Date | string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTimelineCard({
  status,
  createdAt,
  paidAt,
  expiresAt,
}: Props) {
  const isCancelled = status === "CANCELLED";
  const isExpired = status === "EXPIRED";
  const isFailed = status === "PAYMENT_FAILED";
  const isPaid = status === "PAID";

  const isConfirmed = status === "CONFIRMED";
  const isShipped = status === "SHIPPED";
  const isDelivered = status === "DELIVERED";

  const steps: {
    label: string;
    time?: string | null;
    done: boolean;
    active: boolean;
    failed?: boolean;
  }[] = [
    {
      label: "Order placed",
      time: formatDateTime(createdAt),
      done: true,
      active: false,
    },
    {
      label:
        status === "PAYMENT_FAILED"
          ? "Payment failed"
          : status === "CANCELLED"
          ? "Order cancelled"
          : status === "EXPIRED"
          ? "Order expired"
          : isPaid || isConfirmed || isShipped || isDelivered
          ? "Payment confirmed"
          : "Awaiting payment",

      time:
        isPaid && paidAt
          ? formatDateTime(paidAt)
          : isExpired && expiresAt
          ? formatDateTime(expiresAt)
          : status === "CREATED" && expiresAt
          ? `Expires ${formatDateTime(expiresAt)}`
          : null,

      done: isPaid || isConfirmed || isShipped || isDelivered,
      active: status === "CREATED",
      failed: isFailed || isCancelled || isExpired,
    },
    {
      label: "Processing",
      time: null,
      done: isShipped || isDelivered,
      active: isConfirmed && !isShipped,
    },
    {
      label: "Shipped",
      time: null,
      done: isShipped || isDelivered,
      active: isShipped && !isDelivered,
    },
    {
      label: "Delivered",
      time: null,
      done: isDelivered,
      active: false,
    },
  ];

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-soft)]">
        <Clock className="w-4 h-4 text-[var(--text-muted)]" />
        <p className="text-sm font-semibold text-[var(--text-main)]">Order timeline</p>
      </div>

      <div className="px-4 py-4">
        <ol className="space-y-0">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;

            return (
              <li key={i} className="flex gap-3">
                {/* Connector column */}
                <div className="flex flex-col items-center">
                  <div className="shrink-0 mt-0.5">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : step.failed ? (
                      <XCircle className="w-4 h-4 text-red-400" />
                    ) : step.active ? (
                      <div className="w-4 h-4 rounded-full border-2 border-amber-400 bg-amber-400/20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4 text-[var(--border-soft)]" />
                    )}
                  </div>
                  {!isLast && (
                    <div className={`w-px flex-1 my-1 ${step.done ? "bg-emerald-400/40" : "bg-[var(--border-soft)]"}`} />
                  )}
                </div>

                {/* Content */}
                <div className={`pb-4 min-w-0 ${isLast ? "pb-0" : ""}`}>
                  <p className={`text-sm font-medium ${
                    step.done
                      ? "text-[var(--text-main)]"
                      : step.failed
                      ? "text-red-500 dark:text-red-400"
                      : step.active
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-[var(--text-muted)]"
                  }`}>
                    {step.label}
                  </p>
                  {step.time && (
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 tabular-nums">
                      {step.time}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}