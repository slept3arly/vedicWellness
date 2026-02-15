"use client";

import { useEffect, useState } from "react";
import Button from "@/components/public/ui/Button";
import { mockMarkPaidAction } from "./mockPaymentAcion";

type Props = {
  order: any;
};

export default function OrderDetailsClient({ order }: Props) {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPayable =
    order.status === "CREATED" ||
    order.status === "PAYMENT_FAILED";

  const isExpired = order.status === "EXPIRED";

  useEffect(() => {
    if (!order.expiresAt || !isPayable) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(order.expiresAt).getTime();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor(
        (diff % (1000 * 60)) / 1000
      );

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [order.expiresAt, isPayable]);

  async function handleSimulatePayment() {
    try {
      setError(null);
      setLoading(true);

      await mockMarkPaidAction(order.id);

      // reload to get updated status
      window.location.reload();
    } catch (err: any) {
      setError(err?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">

      {/* Status */}
      <div className="surface p-6 space-y-2">
        <h1 className="text-lg font-medium">
          Order Status: {order.status}
        </h1>

        {isPayable && timeLeft && (
          <p className="text-sm text-red-500">
            Payment expires in: {timeLeft}
          </p>
        )}

        {isExpired && (
          <p className="text-sm text-red-500">
            This order has expired.
          </p>
        )}
      </div>

      {/* Items */}
      <div className="surface p-6 space-y-4">
        <h2 className="font-medium">Items</h2>

        {order.items.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between text-sm"
          >
            <span>
              {item.productName} × {item.quantity}
            </span>
            <span>
              ₹{item.price * item.quantity}
            </span>
          </div>
        ))}

        <div className="border-t pt-4 font-medium flex justify-between">
          <span>Total</span>
          <span>₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Simulate Payment */}
      {isPayable && !isExpired && (
        <Button
          disabled={loading}
          onClick={handleSimulatePayment}
          className="w-full"
        >
          {loading ? "Processing..." : "Simulate Payment (Dev Only)"}
        </Button>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}

    </div>
  );
}
