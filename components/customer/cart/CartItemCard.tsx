"use client";

import Image from "next/image";
import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/app/(customer)/cart/serverActions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Prisma } from "@prisma/client";

type CartItem = Prisma.CartItemGetPayload<{
  include: {
    product: true;
  };
}>;

type Props = {
  item: CartItem;
  index: number;
};

export default function CartItemCard({ item, index }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const lineTotal = item.product.price * item.quantity;

  function updateQty(newQty: number) {
    startTransition(async () => {
      await updateCartItemAction({
        itemId: item.id,
        quantity: newQty,
      });

      toast.success("Cart updated");
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeCartItemAction({
        itemId: item.id,
      });

      toast.success("Item removed");
      router.refresh();
    });
  }

  return (
    <Card className="flex gap-6 items-start p-6">

      <div className="text-sm font-semibold text-[var(--brand-accent)]">
        #{index + 1}
      </div>

      <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-[var(--bg-surface)]">
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-muted">
            No Image
          </div>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <p className="font-semibold">{item.product.name}</p>

        <p className="text-xs text-[var(--brand-accent)]">
          Estimated delivery: 4–5 days
        </p>

        <div className="space-y-1 pt-2">
          <p className="text-sm text-muted">
            Unit Price: ₹{item.product.price.toLocaleString()}
          </p>

          <p className="text-sm text-muted">
            Quantity: {item.quantity}
          </p>

          <p className="text-sm font-semibold">
            Line Total: ₹{lineTotal.toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            onClick={() =>
              item.quantity > 1 &&
              updateQty(item.quantity - 1)
            }
            className="h-8 w-8 rounded-md border border-[var(--border-soft)]"
            disabled={pending}
          >
            −
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => {
              if (item.quantity >= 20) {
                toast.warning("Maximum 20 units allowed per product");
                return;
              }
              updateQty(item.quantity + 1);
            }}
            className="h-8 w-8 rounded-md border border-[var(--border-soft)]"
            disabled={pending}
          >
            +
          </button>

          <Button
            variant="secondary"
            onClick={handleRemove}
            disabled={pending}
          >
            Remove
          </Button>
        </div>
      </div>
    </Card>
  );
}
