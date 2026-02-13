import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import { FileText, Truck, ArrowRight } from "lucide-react";
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
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <Card className="p-6 space-y-6">

      <div className="flex items-center gap-2">
        <FileText size={18} className="text-[var(--text-muted)]" />
        <p className="font-semibold text-lg">Order Summary</p>
      </div>

      <div className="space-y-4 text-sm">

        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Product Value</span>
          <span className="font-medium">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span className="flex items-center gap-2 text-[var(--text-muted)]">
            <Truck size={14} /> Logistics
          </span>
          <span className="font-medium">
            {shipping === 0 ? "Included" : `₹${shipping}`}
          </span>
        </div>

      </div>

      <div className="border-t border-[var(--border-soft)] pt-5 flex justify-between font-semibold">
        <span>Estimated Total</span>
        <span className="text-lg">₹{total.toLocaleString()}</span>
      </div>

      <Button className="w-full h-11 flex items-center justify-center gap-2">
        Proceed to Checkout
        <ArrowRight size={16} />
      </Button>

      <p className="text-xs text-[var(--text-muted)] text-center">
        Final pricing and dispatch details will be confirmed by the Vedic Wellness team.
      </p>

    </Card>
  );
}
