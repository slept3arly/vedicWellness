"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Truck, ShieldCheck, Tag, IndianRupee } from "lucide-react";
import Card from "@/components/public/ui/Card";
import CustomerButton from "@/components/customer/CustomerButton";
import type { CartType } from "@/lib/types/cart";

type Props = {
  cart: CartType;
  /** * Set to false when using this card on the actual Checkout page 
   * to avoid a redundant "Proceed to Checkout" button.
   */
  showCheckoutButton?: boolean;
};

export default function CartSummaryCard({ cart, showCheckoutButton = true }: Props) {
  const router = useRouter();

  // 1. Calculate Subtotal (Price * Qty)
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // 2. Calculate MRP/CompareAt to show savings
  const totalMrp = cart.items.reduce((sum, item) => {
    const compareAt = (item.product as any).compareAtPrice as number | null;
    return sum + (compareAt ?? item.product.price) * item.quantity;
  }, 0);

  const totalSavings = totalMrp - subtotal;
  const total = subtotal; // Logic: Shipping is free for all wellness orders
  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Card className="p-0 overflow-hidden" aria-label="Order price summary">
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-[var(--border-soft)]">
        <p className="text-[10px] font-bold font-heading text-[var(--text-muted)] uppercase tracking-[0.1em] mb-1">
          Order Summary
        </p>
        <h3 className="text-sm font-semibold font-heading text-zinc-900 dark:text-zinc-100">
          {itemCount} {itemCount === 1 ? "Item" : "Items"} in your selection
        </h3>
      </div>

      {/* ── Pricing Details ── */}
      <div className="px-5 py-4 flex flex-col gap-3 border-b border-[var(--border-soft)] bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex justify-between items-center text-sm">
          <span className="font-body text-[var(--text-muted)] flex items-center gap-2">
            <Tag className="w-3.5 h-3.5" /> Subtotal (MRP)
          </span>
          <span className="font-medium font-heading text-zinc-900 dark:text-zinc-100 tabular-nums">
            ₹{totalMrp.toLocaleString()}
          </span>
        </div>

        {totalSavings > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="font-body text-emerald-600 dark:text-emerald-400">
              Product Discount
            </span>
            <span className="font-medium font-heading text-emerald-600 dark:text-emerald-400 tabular-nums">
              - ₹{totalSavings.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className="font-body text-[var(--text-muted)] flex items-center gap-2">
            <Truck className="w-3.5 h-3.5" /> Delivery Charges
          </span>
          <span className="font-medium font-heading text-emerald-600 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
            FREE
          </span>
        </div>
      </div>

      {/* ── Final Total ── */}
      <div className="px-5 py-5 bg-[var(--bg-surface)]">
        <div className="flex justify-between items-end">
          <span className="text-[11px] font-bold font-heading text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
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

      {/* ── CTA + Trust ── */}
      <div className="px-5 pb-5 pt-2 flex flex-col gap-3">
        {showCheckoutButton ? (
          <CustomerButton
            onClick={() => router.push("/checkout")}
            className="w-full h-12 gap-2 text-sm"
            aria-label="Proceed to checkout"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </CustomerButton>
        ) : (
          /* Empty state feedback/spacer when button is hidden in Checkout */
          <div className="h-2" />
        )}

        <p className="flex items-start gap-2 text-[11px] font-body text-[var(--text-muted)]">
          <ShieldCheck
            className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"
            aria-hidden="true"
          />
          Vedic Wellness Guarantee: 100% Authentic Products & Secure Payments.
        </p>
      </div>
    </Card>
  );
}