"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/public/ui/Button";
import Chip from "@/components/public/ui/Chip";
import {
  addToCartAction,
  updateCartItemAction,
} from "@/app/(customer)/cart/serverActions";
import { toast } from "@/lib/toast";
import {
  ShoppingCart,
  Zap,
  Minus,
  Plus,
  ArrowRight,
} from "lucide-react";

type Props = {
  productId: string;
  cartItemId?: string;
  tag?: string | null;
  medicineForm?: string | null;
  existingQty: number;
};

export default function ProductPurchaseCard({
  productId,
  cartItemId,
  tag,
  medicineForm,
  existingQty,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [localQty, setLocalQty] = useState(existingQty > 0 ? existingQty : 1);

  useEffect(() => {
    setLocalQty(existingQty > 0 ? existingQty : 1);
  }, [existingQty]);

  const inCart = Boolean(cartItemId);

  const handleCart = () => {
    startTransition(async () => {
      try {
        let result;

        if (cartItemId) {
          result = await updateCartItemAction({
            itemId: cartItemId,
            quantity: localQty,
          });
        } else {
          result = await addToCartAction({
            productId,
            quantity: localQty,
          });
        }

        if (result?.success) {
          toast.success(
            "Cart updated",
            cartItemId
              ? "Quantity updated."
              : "Added to cart."
          );
          router.refresh();
        }
      } catch {
        toast.error("Something went wrong.");
      }
    });
  };

  const handleBuyNow = () => {
    router.push(
      `/checkout?buyNow=true&productId=${productId}&qty=${localQty}`
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-soft)]">

    <div className="flex items-center justify-between">

      {/* Left: product tags */}
      <div className="flex gap-2">
        {tag && (
          <Chip className="text-xs px-2 py-0.5">
            {tag}
          </Chip>
        )}

        {medicineForm && (
          <Chip className="text-xs px-2 py-0.5 bg-zinc-500/10 text-zinc-500 uppercase">
            {medicineForm}
          </Chip>
        )}
      </div>

      {/* Right: View Cart */}
      {inCart && (
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] hover:underline"
        >
          View Cart
          <ArrowRight size={12} />
        </button>
      )}
      </div>

      {/* Quantity */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">
          Qty
        </span>

        <div className="flex items-center gap-1 border border-[var(--border-soft)] rounded-xl p-1">
          <button
            onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
            className="p-1.5 hover:bg-[var(--bg-accent)] rounded-lg"
            disabled={pending}
          >
            <Minus size={14} />
          </button>

          <span className="w-6 text-center font-semibold text-sm">
            {localQty}
          </span>

          <button
            onClick={() => setLocalQty((q) => Math.min(20, q + 1))}
            className="p-1.5 hover:bg-[var(--bg-accent)] rounded-lg"
            disabled={pending}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Buttons row */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          className="h-10 text-sm gap-2 rounded-xl"
          onClick={handleCart}
          isLoading={pending}
        >
          <ShoppingCart size={16} />
          {inCart ? "Update Cart" : "Add to Cart"}
        </Button>

        <Button
          variant="secondary"
          className="h-10 text-sm gap-2 rounded-xl"
          onClick={handleBuyNow}
        >
          <Zap size={16} />
          Buy Now
        </Button>
      </div>

      <p className="text-[10px] text-center text-[var(--text-muted)] uppercase tracking-wide">
        Secure checkout
      </p>
    </div>
  );
}