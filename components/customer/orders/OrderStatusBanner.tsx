"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Package,
} from "lucide-react";
import { fadeUpSoft, scaleIn, softSpring } from "@/app/animations";

type Props = {
  status: string;
  totalAmount: number;
  currency: string;
  timeLeft?: string | null;
};

const STATUS = {
  PAID: {
    label: "Payment confirmed",
    sub: "Your payment was received. Order is being processed.",
    icon: CheckCircle2,
    iconClass: "text-[--brand-accent]",
    pillClass: "bg-[--brand-accent]/10 text-[--brand-accent] border-[--brand-accent]/20",
    pill: "Paid",
    barClass: "bg-[--brand-accent]",
  },
  CREATED: {
    label: "Awaiting payment",
    sub: "Complete your payment before this order expires.",
    icon: Clock,
    iconClass: "text-amber-400",
    pillClass: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    pill: "Pending",
    barClass: "bg-amber-400",
  },
  PAYMENT_FAILED: {
    label: "Payment failed",
    sub: "Something went wrong. You can retry payment below.",
    icon: XCircle,
    iconClass: "text-red-400",
    pillClass: "bg-red-400/10 text-red-400 border-red-400/20",
    pill: "Failed",
    barClass: "bg-red-400",
  },
  EXPIRED: {
    label: "Order expired",
    sub: "Payment window closed. Please place a new order.",
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
  timeLeft,
}: Props) {
  const cfg = STATUS[status as keyof typeof STATUS] ?? {
    label: status,
    sub: "",
    icon: Package,
    iconClass: "text-[--text-muted]",
    pillClass: "bg-[--border-soft] text-[--text-muted] border-[--border-soft]",
    pill: status,
    barClass: "bg-[--text-muted]",
  };

  const Icon = cfg.icon;
  const isPayable = status === "CREATED" || status === "PAYMENT_FAILED";

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="show"
      transition={softSpring}
      className="surface overflow-hidden"
    >
      {/* accent top bar */}
      <motion.div
        className={`h-0.5 w-full ${cfg.barClass} opacity-60`}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      />

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        {/* left — icon + text */}
        <div className="flex items-center gap-3 min-w-0">
          <motion.div
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            transition={{ ...softSpring, delay: 0.05 }}
            className={`shrink-0 ${cfg.iconClass}`}
          >
            <Icon size={18} strokeWidth={2} />
          </motion.div>

          <motion.div
            variants={fadeUpSoft}
            initial="hidden"
            animate="show"
            transition={{ ...softSpring, delay: 0.1 }}
            className="min-w-0"
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
            <p className="text-xs text-[--text-muted] leading-snug truncate">
              {cfg.sub}
            </p>

            {isPayable && timeLeft && timeLeft !== "Expired" && (
              <motion.div
                variants={fadeUpSoft}
                initial="hidden"
                animate="show"
                transition={{ ...softSpring, delay: 0.18 }}
                className="flex items-center gap-1.5 mt-1.5"
              >
                <Clock size={11} className="text-amber-400 shrink-0" />
                <span className="text-xs text-[--text-muted]">
                  Expires in{" "}
                  <span className="font-semibold tabular-nums text-amber-400">
                    {timeLeft}
                  </span>
                </span>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* right — amount */}
        <motion.div
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
        </motion.div>
      </div>
    </motion.div>
  );
}