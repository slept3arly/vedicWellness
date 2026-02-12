"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/public/ui/Button";
import Chip from "@/components/public/ui/Chip";
import { addToCartAction } from "@/app/(customer)/cart/serverActions";
import { toast } from "sonner";

type Props = {
  productId: string;
  tag?: string | null;
  medicineForm?: string | null;
  existingQty: number;
};

export default function ProductPurchaseCard({
  productId,
  tag,
  medicineForm,
  existingQty,
}: Props) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();

  const isMaxed = existingQty >= 20;

  function increase() {
    if (existingQty + quantity >= 20) {
      toast.warning("Maximum 20 units allowed per product");
      return;
    }

    setQuantity((q) => q + 1);
  }

  function decrease() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function handleAddToCart(redirect?: boolean) {
    if (isMaxed) {
      toast.warning("You already have 20 units in cart");
      return;
    }

    startTransition(async () => {
      await addToCartAction({
        productId,
        quantity,
      });

      toast.success("Added to cart");

      setQuantity(1);
      router.refresh();

      if (redirect) {
        router.push("/cart");
      }
    });
  }

  return (
    <div className="mt-8 space-y-5">

      <div className="flex flex-wrap gap-2">
        {tag && <Chip className="text-xs">{tag}</Chip>}
        {medicineForm && (
          <Chip className="text-xs">
            {medicineForm.toLowerCase()}
          </Chip>
        )}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity</span>

        <div className="flex items-center rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)]">
          <button
            onClick={decrease}
            className="px-4 py-2"
          >
            −
          </button>

          <span className="px-6 font-semibold">
            {quantity}
          </span>

          <button
            onClick={increase}
            className="px-4 py-2"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={() => handleAddToCart(false)}
          disabled={pending || isMaxed}
        >
          {isMaxed
            ? "Max 20 Reached"
            : pending
            ? "Adding..."
            : "Add to Cart"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => handleAddToCart(true)}
          disabled={pending || isMaxed}
        >
          Buy Now
        </Button>
      </div>

      <p className="text-xs text-muted">
        * Maximum 20 units per product allowed.
      </p>
    </div>
  );
}
