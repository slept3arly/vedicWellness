"use client";

import { motion } from "framer-motion";
import { staggerFast, fadeUpSoft } from "@/app/animations";
import { ShoppingCart } from "lucide-react";
import CartItemsCard from "@/components/customer/cart/CartItemsCard";
import CartSummaryCard from "@/components/customer/cart/CartSummaryCard";
import EmptyCart from "@/components/customer/cart/EmptyCart";
import type { CartType } from "@/lib/types/cart";

type Props = {
  cart: CartType;
};

export default function CartClient({ cart }: Props) {
  const items = cart.items;

  if (!items.length) return <EmptyCart />;

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto flex flex-col gap-5 sm:gap-7 w-full py-6 px-4 sm:px-6"
    >
      {/* ── Page heading ── */}
      <motion.div variants={fadeUpSoft}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"
            aria-hidden="true"
          >
            <ShoppingCart className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                Your Cart
              </h1>
              {/* Live region so screen readers announce item count changes */}
              <span
                aria-live="polite"
                aria-atomic="true"
                className="text-xs font-bold font-heading text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full"
              >
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="text-sm font-body text-[var(--text-muted)] mt-0.5">
              Review your selections before checkout
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_380px] items-start">
        <motion.div variants={fadeUpSoft}>
          <CartItemsCard items={items} />
        </motion.div>

        {/* Sticky on desktop, natural flow on mobile (sits below items) */}
        <motion.div variants={fadeUpSoft} className="lg:sticky lg:top-6">
          <CartSummaryCard cart={cart} />
        </motion.div>
      </div>
    </motion.div>
  );
}