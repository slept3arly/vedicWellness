"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Truck, ShieldCheck, Tag, IndianRupee } from "lucide-react";
import Card from "@/components/public/ui/Card";
import CustomerButton from "@/components/customer/CustomerButton";
import type { CartType } from "@/lib/types/cart";

type Props = {
  cart: CartType;
};

export default function CartSummaryCard({ cart }: Props) {
  const router = useRouter();

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalMrp = cart.items.reduce((sum, item) => {
    const compareAt = (item.product as any).compareAtPrice as number | null;
    return sum + (compareAt ?? item.product.price) * item.quantity;
  }, 0);

  const totalSavings = totalMrp - subtotal;
  const total = subtotal; // shipping is free
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card className="p-0" aria-label="Order price summary">

      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-[var(--border-soft)]">
        <p className="text-[10px] font-black font-heading text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
          Price Details
        </p>
        <p className="text-xs font-body text-[var(--text-muted)] mt-0.5">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* ── Line items ── */}
      <dl className="px-5 py-4 flex flex-col gap-3.5">

        {/* MRP — only when savings exist */}
        {totalSavings > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-sm font-body text-[var(--text-muted)] flex items-center gap-2">
              <IndianRupee className="w-3.5 h-3.5 opacity-40 shrink-0" aria-hidden="true" />
              Total MRP
            </dt>
            <dd className="text-sm font-body text-zinc-400 line-through tabular-nums">
              ₹{totalMrp.toLocaleString()}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between">
          <dt className="text-sm font-body text-[var(--text-muted)] flex items-center gap-2">
            <IndianRupee className="w-3.5 h-3.5 opacity-40 shrink-0" aria-hidden="true" />
            Product Value
          </dt>
          <dd className="text-sm font-semibold font-heading text-zinc-900 dark:text-zinc-100 tabular-nums">
            ₹{subtotal.toLocaleString()}
          </dd>
        </div>

        {/* Discount */}
        {totalSavings > 0 && (
          <div className="flex items-center justify-between">
            <dt className="text-sm font-body text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              Discount
            </dt>
            <dd className="text-sm font-semibold font-heading text-emerald-600 dark:text-emerald-400 tabular-nums">
              −₹{totalSavings.toLocaleString()}
            </dd>
          </div>
        )}

        {/* Delivery */}
        <div className="flex items-center justify-between">
          <dt className="text-sm font-body text-[var(--text-muted)] flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 opacity-40 shrink-0" aria-hidden="true" />
            Delivery
          </dt>
          <dd className="text-sm font-bold font-heading text-emerald-600 dark:text-emerald-400 tracking-wide">
            FREE
          </dd>
        </div>
      </dl>

      {/* ── Total ── */}
      <div className="px-5 py-4 border-t border-[var(--border-soft)] bg-zinc-50/60 dark:bg-zinc-800/30">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold font-heading text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
            Total Payable
          </span>
          <span
            className="text-3xl font-semibold font-heading text-zinc-900 dark:text-zinc-50 tabular-nums leading-none"
            aria-label={`Total payable ₹${total.toLocaleString()}`}
          >
            ₹{total.toLocaleString()}
          </span>
        </div>

        {totalSavings > 0 && (
          <p
            aria-live="polite"
            className="text-xs font-body text-emerald-600 dark:text-emerald-400 mt-1.5"
          >
            🎉 You're saving ₹{totalSavings.toLocaleString()} on this order
          </p>
        )}
      </div>

      {/* ── CTA + trust ── */}
      <div className="px-5 pb-5 pt-4 flex flex-col gap-3">
        <CustomerButton
          onClick={() => router.push("/checkout")}
          className="w-full h-12 gap-2 text-sm"
          aria-label="Proceed to checkout"
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </CustomerButton>

        <p className="flex items-start gap-2 text-[11px] font-body text-[var(--text-muted)]">
          <ShieldCheck
            className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          Final pricing and dispatch details confirmed by the Vedic Wellness team after placement.
        </p>
      </div>
    </Card>
  );
}