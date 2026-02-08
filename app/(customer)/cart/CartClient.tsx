"use client";

import SectionHeading from "@/components/public/ui/SectionHeading";
import CartItemCard from "@/components/customer/cart/CartItemCard";
import CartSummaryCard from "@/components/customer/cart/CartSummaryCard";
import EmptyCart from "@/components/customer/cart/EmptyCart";

const items: any[] = [];

export default function CartClient() {
  if (!items.length) return <EmptyCart />;

  return (
    <>
      <SectionHeading
        align="left"
        title="Your Cart"
        subtitle="Review items before checkout"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((i) => (
            <CartItemCard key={i.id} item={i} />
          ))}
        </div>

        <CartSummaryCard />
      </div>
    </>
  );
}
