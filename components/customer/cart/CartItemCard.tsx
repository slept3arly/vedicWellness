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
import { toast } from "sonner";
import { Minus, Plus, Leaf, ArrowUpRight, X } from "lucide-react";
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
      await updateCartItemAction({
        itemId: item.id,
        quantity: newQty,
      });

      toast.success("Quantity updated");
      router.refresh();
    });
  }

  function handleRemove() {
    startRemoveTransition(async () => {
      await removeCartItemAction({ itemId: item.id });

      toast.error("Removed from order");
      router.refresh();
    });
  }

  return (
    <Card className="p-4 sm:p-6 border border-[var(--border-soft)]">

      {/* ================= MOBILE ================= */}
      <div className="flex flex-col gap-3 sm:hidden">

        {/* top row */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-muted)]">
            {index + 1}
          </div>

          <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[var(--bg-surface)]">
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
            <p className="font-semibold text-sm truncate">
              {item.product.name}
            </p>

            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Leaf size={11} />
              Estimated dispatch 4–5 days
            </div>
          </div>

          {/* remove */}
          <button
            onClick={handleRemove}
            disabled={removePending}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-muted)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* controls row */}
        <div className="flex items-center justify-center gap-8">
          {/* 👉 MOBILE PRICE FORMAT */}
          <div className="font-semibold text-sm">
            {item.quantity} × ₹{item.product.price.toLocaleString()}
          </div>

          {/* qty */}
          <div
            className={`
              flex items-center rounded-full border border-[var(--border-soft)]
              ${qtyPending ? "opacity-60" : ""}
            `}
          >
            <button
              onClick={() =>
                item.quantity > 1 && updateQty(item.quantity - 1)
              }
              className="h-8 w-8 flex items-center justify-center"
            >
              <Minus size={14} />
            </button>

            <span className="px-3 text-sm">{item.quantity}</span>

            <button
              onClick={() => updateQty(item.quantity + 1)}
              className="h-8 w-8 flex items-center justify-center"
            >
              <Plus size={14} />
            </button>
          </div>

          <Link href={`/products/${item.product.slug}`}>
            <Button size="sm" className="h-8 px-3">
              Details
            </Button>
          </Link>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden sm:flex flex-col gap-5">

        {/* top content */}
        <div className="flex gap-5">
          <div className="flex gap-3">
            <div className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-muted)]">
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

          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex justify-between items-start">
              <p className="font-semibold truncate">
                {item.product.name}
              </p>

              <div className="font-semibold text-base">
                ₹{lineTotal.toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <Leaf size={12} />
              Ayurvedic formulation • Estimated dispatch 4–5 days
            </div>

            <div className="text-sm text-[var(--text-muted)]">
              ₹{item.product.price.toLocaleString()} per unit
            </div>
          </div>
        </div>

        {/* 👉 BOTTOM CENTERED ACTION BAR */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4">

            {/* qty */}

            <Link href={`/products/${item.product.slug}`}>
              <Button variant="ghost" className="px-3">
                Learn More <ArrowUpRight size={14} />
              </Button>
            </Link>
            <div
              className={`
                flex items-center rounded-full border border-[var(--border-soft)]
                ${qtyPending ? "opacity-60" : ""}
              `}
            >
              
              <button
                onClick={() =>
                  item.quantity > 1 && updateQty(item.quantity - 1)
                }
                className="h-9 w-9 flex items-center justify-center"
              >
                <Minus size={14} />
              </button>

              <span className="px-4">{item.quantity}</span>

              <button
                onClick={() => updateQty(item.quantity + 1)}
                className="h-9 w-9 flex items-center justify-center"
              >
                <Plus size={14} />
              </button>
            </div>

            <Button
              variant="ghost"
              onClick={handleRemove}
              disabled={removePending}
              className="px-5"
            >
              {removePending ? "Removing…" : "Remove"}
            </Button>

          </div>
        </div>
      </div>
    </Card>
  );
}
