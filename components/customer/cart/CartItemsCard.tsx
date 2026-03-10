"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, Package, Leaf, ArrowUpRight } from "lucide-react";
import Card from "@/components/public/ui/Card";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/app/(customer)/cart/serverActions";
import { toast } from "@/lib/toast";
import type { CartItemType } from "@/lib/types/cart";

// ─────────────────────────────────────────────
// Individual row
// ─────────────────────────────────────────────

type RowProps = {
  item: CartItemType;
  isLast: boolean;
};

function CartRow({ item, isLast }: RowProps) {
  const router = useRouter();
  const [qtyPending, startQtyTransition] = useTransition();
  const [removePending, startRemoveTransition] = useTransition();

  const unitPrice = item.product.price;
  const lineTotal = unitPrice * item.quantity;
  const compareAt = (item.product as any).compareAtPrice as number | null;
  const savings = compareAt && compareAt > unitPrice
    ? (compareAt - unitPrice) * item.quantity
    : null;

  function updateQty(newQty: number) {
    if (newQty < 1 || newQty > 20) return;
    startQtyTransition(async () => {
      try {
        await updateCartItemAction({ itemId: item.id, quantity: newQty });
        toast.success(
          "Cart updated",
          `${item.product.name} quantity set to ${newQty}.`
        );
        router.refresh();
      } catch (err: unknown) {
        toast.error(
          "Couldn't update quantity",
          err instanceof Error ? err.message : "Please try again."
        );
      }
    });
  }

  function handleRemove() {
    startRemoveTransition(async () => {
      try {
        await removeCartItemAction({ itemId: item.id });
        toast.delete("Item removed", `${item.product.name} removed from your cart.`);
        router.refresh();
      } catch (err: unknown) {
        toast.error(
          "Couldn't remove item",
          err instanceof Error ? err.message : "Please try again."
        );
      }
    });
  }

  return (
    <li
      className={`flex gap-4 py-5 ${
        !isLast ? "border-b border-[var(--border-soft)]" : ""
      }`}
    >
      {/* ── Thumbnail ── */}
      <Link
        href={`/products/${item.product.slug}`}
        aria-label={`View ${item.product.name} product page`}
        className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 shrink-0 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 group"
      >
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center" aria-hidden="true">
            <Package className="w-7 h-7 text-zinc-300 dark:text-zinc-600" />
          </div>
        )}
      </Link>

      {/* ── Details ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-2.5">

        {/* Name row + remove */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link
              href={`/products/${item.product.slug}`}
              className="group inline-flex items-start gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm"
            >
              <span className="font-heading text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {item.product.name}
              </span>
              <ArrowUpRight
                className="w-3 h-3 mt-0.5 shrink-0 opacity-0 group-hover:opacity-50 transition-opacity text-emerald-600"
                aria-hidden="true"
              />
            </Link>

            {/* Meta badges */}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap" aria-label="Product details">
              <span className="flex items-center gap-1 text-[10px] font-body text-[var(--text-muted)]">
                <Leaf className="w-3 h-3 text-emerald-500 opacity-70 shrink-0" aria-hidden="true" />
                Ayurvedic
              </span>
              <span className="text-[10px] text-zinc-300 dark:text-zinc-600" aria-hidden="true">·</span>
              <span className="text-[10px] font-body text-[var(--text-muted)]">
                Dispatch 4–5 days
              </span>
            </div>
          </div>

          {/* Remove button */}
          <button
            onClick={handleRemove}
            disabled={removePending}
            aria-label={`Remove ${item.product.name} from cart`}
            className="h-7 w-7 flex items-center justify-center rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 shrink-0"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>

        {/* Qty + price row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">

          {/* Quantity stepper */}
          <div
            role="group"
            aria-label={`Quantity for ${item.product.name}`}
            className={`flex items-center rounded-full border border-[var(--border-soft)] bg-[var(--bg-surface)] transition-opacity ${
              qtyPending ? "opacity-40 pointer-events-none" : ""
            }`}
          >
            <button
              onClick={() => updateQty(item.quantity - 1)}
              disabled={item.quantity <= 1 || qtyPending}
              aria-label={`Decrease quantity of ${item.product.name}`}
              className="h-8 w-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset rounded-l-full"
            >
              <Minus size={13} aria-hidden="true" />
            </button>

            <span
              aria-live="polite"
              aria-atomic="true"
              className="px-3 text-sm font-bold font-heading tabular-nums text-[var(--text-main)] min-w-[2rem] text-center"
            >
              {item.quantity}
            </span>

            <button
              onClick={() => updateQty(item.quantity + 1)}
              disabled={item.quantity >= 20 || qtyPending}
              aria-label={`Increase quantity of ${item.product.name}`}
              className="h-8 w-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-inset rounded-r-full"
            >
              <Plus size={13} aria-hidden="true" />
            </button>
          </div>

          {/* Line price */}
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              {compareAt && compareAt > unitPrice && (
                <span
                  className="text-xs font-body text-zinc-400 line-through tabular-nums"
                  aria-label={`Original price ₹${(compareAt * item.quantity).toLocaleString()}`}
                >
                  ₹{(compareAt * item.quantity).toLocaleString()}
                </span>
              )}
              <span className="text-base font-semibold font-heading text-zinc-900 dark:text-zinc-50 tabular-nums">
                ₹{lineTotal.toLocaleString()}
              </span>
            </div>

            {savings && savings > 0 ? (
              <span className="text-[10px] font-bold font-heading text-emerald-600 dark:text-emerald-400">
                Save ₹{savings.toLocaleString()}
              </span>
            ) : (
              <span className="text-[10px] font-body text-[var(--text-muted)] tabular-nums">
                ₹{unitPrice.toLocaleString()} × {item.quantity}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

// ─────────────────────────────────────────────
// Container card
// ─────────────────────────────────────────────

type Props = {
  items: CartItemType[];
};

export default function CartItemsCard({ items }: Props) {
  return (
    <Card className="p-0">
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold text-[var(--text-main)]">
          Cart Items
        </h2>
        <span className="text-xs font-body text-[var(--text-muted)]">
          {items.length} {items.length === 1 ? "product" : "products"} · max 15
        </span>
      </div>

      {/* Item list */}
      <ul
        aria-label="Cart items"
        className="px-5 sm:px-6 pb-5 sm:pb-6 list-none"
      >
        {items.map((item, i) => (
          <CartRow
            key={item.id}
            item={item}
            isLast={i === items.length - 1}
          />
        ))}
      </ul>
    </Card>
  );
}