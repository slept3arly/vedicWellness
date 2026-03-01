"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ShoppingCart, Zap, Truck, ShieldCheck } from "lucide-react";
import { toast } from "@/lib/toast";

import Card from "@/components/public/ui/Card";
import CustomerButton from "../CustomerButton";
import { addToCartAction } from "@/app/(customer)/cart/serverActions";
import { fmt, Product, ProductVariant } from "./types";

export default function ProductPriceCard({
  product,
  existingQty,
}: {
  product: Product;
  existingQty: number;
}) {
  const router = useRouter();
  const [addPending, startAddTransition] = useTransition();

  const [qty, setQty] = useState(1);
  const [selectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] ?? null
  );

  const [inCart, setInCart] = useState(existingQty > 0);

  const effectivePrice =
    selectedVariant?.price ?? product.price;

  const effectiveCompare =
    selectedVariant?.compareAtPrice ?? product.compareAtPrice;

  const effectiveStock =
    selectedVariant?.stock ?? product.stock;

  const discount =
    effectiveCompare && effectiveCompare > effectivePrice
      ? Math.round(((effectiveCompare - effectivePrice) / effectiveCompare) * 100)
      : null;

  const isMaxed = existingQty >= 20;

  function increase() {
    if (existingQty + qty >= 20) {
      toast.warning("Maximum limit reached", "You can only purchase up to 20 units per product.");
      return;
    }
    setQty((q) => Math.min(effectiveStock, q + 1));
  }

  function decrease() {
    setQty((q) => Math.max(1, q - 1));
  }

  function handleAddToCart() {
  if (isMaxed) {
    toast.warning(
      "Cart limit reached",
      "You already have 20 units of this product."
    );
    return;
  }

  startAddTransition(async () => {
    try {
      await addToCartAction({
        productId: product.id,
        quantity: qty,
      });

      toast.success(
        "Added to cart",
        `${qty} item${qty > 1 ? "s" : ""} added successfully.`
      );

      setInCart(true);
      setQty(1);
      router.refresh();
    } catch {
      toast.error(
        "Failed to add to cart",
        "Please try again."
      );
    }
  });
}

  function handleBuyNow() {
    router.push(
      `/checkout?buyNow=true&productId=${product.id}&qty=${qty}`
    );
  }

  function handleGoToCart() {
    router.push("/cart");
  }

  return (
    <Card className="p-6 space-y-6 flex flex-col">

      {/* PRICE */}
      <div className="space-y-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl font-black text-accent">
            {fmt(effectivePrice)}
          </span>

          {effectiveCompare && effectiveCompare > effectivePrice && (
            <span className="text-base text-muted line-through">
              {fmt(effectiveCompare)}
            </span>
          )}

          {discount && (
            <span className="text-xs font-bold bg-green-500/15 text-green-500 px-2 py-1 rounded-full">
              {discount}% OFF
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm">
          {effectiveStock > 0 ? (
            <>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 font-semibold">
                In Stock
              </span>
            </>
          ) : (
            <span className="text-red-500 font-semibold">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* QTY */}
      {effectiveStock > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">
            Quantity
          </p>

          <div className="flex items-center border rounded-xl overflow-hidden h-11">
            <button onClick={decrease} className="w-10">−</button>
            <span className="w-10 text-center font-bold">{qty}</span>
            <button onClick={increase} className="w-10">+</button>
          </div>
        </div>
      )}

      {/* BUTTONS */}
      {effectiveStock > 0 && (
        <div className="flex gap-3">

          {!inCart ? (
            <CustomerButton
              onClick={handleAddToCart}
              isLoading={addPending}
              disabled={addPending}
              className="flex-1 h-12 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </CustomerButton>
          ) : (
            <CustomerButton
              onClick={handleGoToCart}
              variant="secondary"
              className="flex-1 h-12 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} />
              Go to Cart
            </CustomerButton>
          )}

          <CustomerButton
            onClick={handleBuyNow}
            variant="secondary"
            className="h-12 px-6 flex items-center justify-center gap-2"
          >
            <Zap size={16} />
            Buy Now
          </CustomerButton>

        </div>
      )}

      {/* TRUST STRIP */}
      <div className="flex flex-wrap justify-center gap-3 pt-5 border-t">
        <span className="flex items-center gap-2 text-xs font-semibold">
          <Truck size={12} /> Free Delivery
        </span>
        <span className="flex items-center gap-2 text-xs font-semibold">
          <ShieldCheck size={12} /> 100% Genuine
        </span>
      </div>
    </Card>
  );
}