"use client";

import Image from "next/image";
import Link from "next/link";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/app/(customer)/cart/serverActions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { Minus, Plus, Leaf, X } from "lucide-react";
import type { Prisma } from "@prisma/client";

type CartItem = Prisma.CartItemGetPayload<{
  include: { product: true };
}>;

type Props = {
  item: CartItem;
  index: number;
};

export default function CartItemCard({ item, index }: Props) {
  const router = useRouter();

  const [qtyPending, startQtyTransition] = useTransition();
  const [removePending, startRemoveTransition] = useTransition();

  const lineTotal = item.product.price * item.quantity;

  function updateQty(newQty: number) {
    startQtyTransition(async () => {
      try {
        await updateCartItemAction({ itemId: item.id, quantity: newQty });
        toast.success("Quantity updated", "Cart has been updated successfully.");
        router.refresh();
      } catch {
        toast.error("Update failed", "Unable to update quantity. Please try again.");
      }
    });
  }

  function handleRemove() {
    startRemoveTransition(async () => {
      try {
        await removeCartItemAction({ itemId: item.id });
        toast.delete("Item removed", "Product removed from your cart.");
        router.refresh();
      } catch {
        toast.error("Removal failed", "Unable to remove item. Please try again.");
      }
    });
  }

  return (
    <Card className="p-4 sm:p-6 border border-[var(--border-soft)]">

      {/* ═══════════════ MOBILE ═══════════════ */}
      <div className="flex flex-col gap-3 sm:hidden">

        {/* top row */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-muted)]">
            {index + 1}
          </div>

          <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[var(--bg-surface)] shrink-0">
            {item.product.imageUrl && (
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            )}
          </div>

          <div className="flex-1 min-w-0 mb-4">
            <p className="font-semibold text-sm truncate">{item.product.name}</p>
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)] mt-0.5">
              <Leaf size={11} />
              Estimated dispatch 4–5 days
            </div>
          </div>

          {/* remove */}
          <button
            onClick={handleRemove}
            disabled={removePending}
            aria-label="Remove item"
            className="h-8 w-8 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-950/30 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* controls row */}
        <div className="flex items-center justify-center gap-6">
          <div className="font-semibold text-sm">
            {item.quantity} × ₹{item.product.price.toLocaleString()}
          </div>

          {/* qty stepper */}
          <div
            className={`flex items-center rounded-full border border-[var(--border-soft)] transition-opacity ${qtyPending ? "opacity-50" : ""}`}
          >
            <button
              onClick={() => item.quantity > 1 && updateQty(item.quantity - 1)}
              className="h-8 w-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.quantity + 1)}
              className="h-8 w-8 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <Link href={`/products/${item.product.slug}`}>
            <Button className="h-9 min-w-0 px-4 text-[12px]">
              Details
            </Button>
          </Link>
        </div>
      </div>

      {/* ═══════════════ DESKTOP ═══════════════ */}
      <div className="hidden sm:flex flex-col gap-5">

        {/* product info row */}
        <div className="flex gap-5">
          <div className="flex gap-3 shrink-0">
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-muted)] self-start">
              {index + 1}
            </div>
            <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-[var(--bg-surface)]">
              {item.product.imageUrl && (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex justify-between items-start gap-4">
              <p className="font-semibold truncate">{item.product.name}</p>
              <div className="font-semibold text-base shrink-0">
                ₹{lineTotal.toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Leaf size={12} />
              Ayurvedic formulation • Estimated dispatch 4–5 days
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              ₹{item.product.price.toLocaleString()} per unit
            </div>
          </div>
        </div>

        {/* action bar */}
        <div className="flex justify-center items-center gap-4">

          <Link href={`/products/${item.product.slug}`}>
            <Button variant="ghost" className="min-w-0 px-4">
              Learn More
            </Button>
          </Link>

          {/* qty stepper */}
          <div
            className={`flex items-center rounded-full border border-[var(--border-soft)] transition-opacity ${qtyPending ? "opacity-50" : ""}`}
          >
            <button
              onClick={() => item.quantity > 1 && updateQty(item.quantity - 1)}
              className="h-9 w-9 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="px-4 font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.quantity + 1)}
              className="h-9 w-9 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* remove — red tint to signal destructive, works both modes */}
          <Button
            variant="ghost"
            onClick={handleRemove}
            isLoading={removePending}
            className="min-w-0 px-4 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
}