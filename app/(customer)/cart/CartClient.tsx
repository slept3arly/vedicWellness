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
    <>
      <SectionHeading
        align="left"
        title="Your Cart"
        subtitle="Review items before checkout"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, index) => (
            <CartItemCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}
        </div>

        <CartSummaryCard cart={cart} />
      </div>
    </>
  );
}
