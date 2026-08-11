"use client";

import { m } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package,
} from "lucide-react";
import { fadeUpSoft, scaleIn, softSpring } from "@/app/animations";

type Props = {
  status: string;
  totalAmount: number;
  currency: string;
};

const STATUS = {
  CREATED: {
    label: "Order received",
    sub: "Your order has been received and is awaiting processing.",
    icon: Package,
    iconClass: "text-amber-400",
    pillClass: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    pill: "Received",
    barClass: "bg-amber-400",
  },
  CONFIRMED: {
    label: "Order confirmed",
    sub: "Your order has been received and will be processed by our team.",
    icon: CheckCircle2,
    iconClass: "text-[--brand-accent]",
    pillClass:
      "bg-[--brand-accent]/10 text-[--brand-accent] border-[--brand-accent]/20",
    pill: "Confirmed",
    barClass: "bg-[--brand-accent]",
  },
  EXPIRED: {
    label: "Order expired",
    sub: "This order is no longer active. Please place a new order if needed.",
    icon: AlertTriangle,
    iconClass: "text-[--text-muted]",
    pillClass: "bg-[--border-soft] text-[--text-muted] border-[--border-soft]",
    pill: "Expired",
    barClass: "bg-[--text-muted]",
  },
  CANCELLED: {
    label: "Order cancelled",
    sub: "This order was cancelled and will not be processed.",
    icon: XCircle,
    iconClass: "text-[--text-muted]",
    pillClass: "bg-[--border-soft] text-[--text-muted] border-[--border-soft]",
    pill: "Cancelled",
    barClass: "bg-[--text-muted]",
  },
};

function formatAmount(amount: number, currency: string) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OrderStatusBanner({
  status,
  totalAmount,
  currency,
}: Props) {
  const cfg = STATUS[status as keyof typeof STATUS] ?? {
    label: status === "PAID" || status === "PAYMENT_FAILED" ? "Order received" : status,
    sub: "Your order is being managed by our team.",
    icon: Package,
    iconClass: "text-[--text-muted]",
    pillClass: "bg-[--border-soft] text-[--text-muted] border-[--border-soft]",
    pill: status,
    barClass: "bg-[--text-muted]",
  };

  const Icon = cfg.icon;

  return (
    <m.div
      variants={scaleIn}
      initial="hidden"
      animate="show"
      transition={softSpring}
      className="surface overflow-hidden"
    >
      {/* accent top bar */}
      <m.div
        className={`h-0.5 w-full ${cfg.barClass} opacity-60`}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      />

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        {/* left — icon + text */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <m.div
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            transition={{ ...softSpring, delay: 0.05 }}
            className={`shrink-0 ${cfg.iconClass}`}
          >
            <Icon size={18} strokeWidth={2} />
          </m.div>

          <m.div
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            transition={{ ...softSpring, delay: 0.1 }}
            className="min-w-0 flex-1"
          >
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-sm font-semibold text-[--text-main]">
                {cfg.label}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cfg.pillClass}`}
              >
                {cfg.pill}
              </span>
            </div>

            <p className="text-xs text-[--text-muted] leading-snug whitespace-normal break-words">
              {cfg.sub}
            </p>
          </m.div>
        </div>

        {/* right — amount */}
        <m.div
          variants={fadeUpSoft}
          initial="hidden"
          animate="show"
          transition={{ ...softSpring, delay: 0.14 }}
          className="shrink-0 text-right"
        >
          <p className="text-[11px] text-[--text-muted] mb-0.5 uppercase tracking-wide">
            Total
          </p>
          <p className="text-2xl font-bold text-[--text-main] tabular-nums leading-none">
            {formatAmount(totalAmount, currency)}
          </p>
        </m.div>
      </div>
    </m.div>
  );
}
