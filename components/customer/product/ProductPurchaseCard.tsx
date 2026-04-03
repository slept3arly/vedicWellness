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
  price: number;
  compareAtPrice?: number | null;
  stock: number;
};

export default function ProductPurchaseCard({
  productId,
  cartItemId,
  tag,
  medicineForm,
  existingQty,
  price,
  compareAtPrice,
  stock,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [localQty, setLocalQty] = useState(existingQty > 0 ? existingQty : 1);

  useEffect(() => {
    setLocalQty(existingQty > 0 ? existingQty : 1);
  }, [existingQty]);

  const inCart = Boolean(cartItemId);
  const isOutOfStock = stock <= 0;

  const discount =
    compareAtPrice && compareAtPrice > price
      ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
      : null;

  const handleCart = () => {
    if (isOutOfStock) return;

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
          toast.success("Cart updated");
          router.refresh();
        }
      } catch {
        toast.error("Something went wrong.");
      }
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    router.push(`/checkout?buyNow=true&productId=${productId}&qty=${localQty}`);
  };

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-soft)]">

      {/* TAGS */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {tag && <Chip className="text-xs px-2 py-0.5">{tag}</Chip>}
          {medicineForm && (
            <Chip className="text-xs px-2 py-0.5 bg-zinc-500/10 text-zinc-500 uppercase">
              {medicineForm}
            </Chip>
          )}
        </div>

        {inCart && !isOutOfStock && (
          <button
            onClick={() => router.push("/cart")}
            className="flex items-center gap-1 text-xs font-semibold text-[var(--brand-primary)] hover:underline"
          >
            View Cart <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* 💰 PRICE ROW (FIXED) */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xl md:text-2xl font-bold text-[var(--brand-primary)]">
          ₹{price}
        </span>

        {compareAtPrice && compareAtPrice > price && (
          <span className="text-sm line-through text-[var(--text-muted)] opacity-70">
            ₹{compareAtPrice}
          </span>
        )}

        {discount && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
            {discount}% OFF
          </span>
        )}
      </div>

      {/* ❌ OUT OF STOCK */}
      {isOutOfStock ? (
        <div className="flex flex-col gap-2">
          <div className="h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-semibold text-sm">
            Out of Stock
          </div>
          <p className="text-[11px] text-center text-[var(--text-muted)]">
            Currently unavailable
          </p>
        </div>
      ) : (
        <>
          {/* QTY */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase text-[var(--text-muted)]">
              Qty
            </span>

            <div className="flex items-center gap-1 border border-[var(--border-soft)] rounded-lg px-1 py-0.5">
              <button
                onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                className="p-1 hover:bg-[var(--bg-accent)] rounded"
                disabled={pending}
              >
                <Minus size={13} />
              </button>

              <span className="w-5 text-center text-sm font-semibold">
                {localQty}
              </span>

              <button
                onClick={() => setLocalQty((q) => Math.min(20, q + 1))}
                className="p-1 hover:bg-[var(--bg-accent)] rounded"
                disabled={pending}
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          {/* 🔘 BUTTONS (1 ROW) */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              className="h-10 text-sm gap-1.5 rounded-xl"
              onClick={handleCart}
              isLoading={pending}
            >
              <ShoppingCart size={14} />
              {inCart ? "Update" : "Add"}
            </Button>

            <Button
              variant="secondary"
              className="h-10 text-sm gap-1.5 rounded-xl"
              onClick={handleBuyNow}
            >
              <Zap size={14} />
              Buy
            </Button>
          </div>
        </>
      )}

      {/* TRUST */}
      <p className="text-[10px] text-center text-[var(--text-muted)] uppercase tracking-wide">
        Secure • Fast • Genuine
      </p>
    </div>
  );
}