"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrderAction } from "./serverActions";
import Button from "@/components/public/ui/Button";

type Props = {
  cart: any;
  defaultAddress: any | null;
};

export default function CheckoutClient({
  cart,
  defaultAddress,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const total = cart.items.reduce(
    (sum: number, item: any) =>
      sum + item.product.price * item.quantity,
    0
  );

  function handlePlaceOrder() {
    if (!defaultAddress) return;

    startTransition(async () => {
      try {
        const order = await createOrderAction({
          addressId: defaultAddress.id,
        });

        // For now redirect to order confirmation page (we'll build later)
        router.push(`/orders/${order.id}`);
      } catch (err) {
        console.error(err);
        alert("Failed to create order");
      }
    });
  }

  return (
    <div className="space-y-8">

      {/* Address Section */}
      <div className="surface p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-lg">
            Shipping Address
          </h2>
          <button
            onClick={() => router.push("/account")}
            className="text-sm text-[color:var(--brand-accent)]"
          >
            Change Address
          </button>
        </div>

        {defaultAddress ? (
          <div className="text-sm space-y-1">
            <p className="font-medium">
              {defaultAddress.fullName}
            </p>
            <p>{defaultAddress.phone}</p>
            <p>{defaultAddress.line1}</p>
            {defaultAddress.line2 && (
              <p>{defaultAddress.line2}</p>
            )}
            <p>
              {defaultAddress.city}, {defaultAddress.state}{" "}
              {defaultAddress.postalCode}
            </p>
            <p>{defaultAddress.country}</p>
          </div>
        ) : (
          <div className="text-sm text-red-500">
            No default address found. Please set one in your
            account.
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="surface p-6 space-y-4">
        <h2 className="font-medium text-lg">
          Order Summary
        </h2>

        <div className="space-y-3">
          {cart.items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>
                ₹{item.product.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border-soft)] pt-4 flex justify-between font-medium">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <Button
          className="w-full mt-4"
          disabled={!defaultAddress || isPending}
          onClick={handlePlaceOrder}
        >
          {isPending ? "Processing..." : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
