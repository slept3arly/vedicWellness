"use client";

import SectionHeading from "@/components/public/ui/SectionHeading";
import CartItemCard from "@/components/customer/cart/CartItemCard";
import CartSummaryCard from "@/components/customer/cart/CartSummaryCard";
import EmptyCart from "@/components/customer/cart/EmptyCart";
import type { Prisma } from "@prisma/client";

type CartWithItems = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

type Props = {
  cart: CartWithItems;
};

export default function CartClient({ cart }: Props) {
  const items = cart.items;

  if (!items.length) return <EmptyCart />;

  return (
    <div className="space-y-8 md:animate-in md:fade-in md:duration-300">

      <SectionHeading
        align="left"
        title="Your Cart"
        subtitle="Review your selections before checkout"
      />

      {/* CART SURFACE */}
      <div className="
        rounded-2xl
        bg-[var(--bg-surface)]/70
        backdrop-blur-sm
        border border-[var(--border-soft)]
        p-4 sm:p-6
      ">
        <div
          className="
            grid
            gap-6 lg:gap-10
            lg:grid-cols-[minmax(0,1fr)_360px]
          "
        >
          {/* ITEMS COLUMN */}
          <div className="space-y-4 min-w-0">
            {items.map((item, index) => (
              <CartItemCard
                key={item.id}
                item={item}
                index={index}
              />
            ))}
          </div>

          {/* SUMMARY COLUMN */}
          <div className="lg:sticky lg:top-24 h-fit">
            <CartSummaryCard cart={cart} />
          </div>
        </div>
      </div>
    </div>
  );
}
