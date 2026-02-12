import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
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

export default function CartSummaryCard({ cart }: Props) {
  const subtotal: number = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping: number = 0;
  const total: number = subtotal + shipping;

  return (
    <Card>
      <p className="font-medium mb-4">Order Summary</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shipping === 0
              ? "Free"
              : `₹${shipping.toLocaleString()}`}
          </span>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--border-soft)] pt-4 flex justify-between font-medium">
        <span>Total</span>
        <span>₹{total.toLocaleString()}</span>
      </div>

      <Button className="mt-6 w-full">
        Checkout
      </Button>
    </Card>
  );
}
