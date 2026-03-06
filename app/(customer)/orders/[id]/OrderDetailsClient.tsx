"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/public/ui/Button";
import { toast } from "@/lib/toast";
import { mockMarkPaidAction } from "./mockPaymentAcion";
import { cancelOrderAction } from "../serverActions";

import OrderStatusBanner from "@/components/customer/orders/OrderStatusBanner";
import OrderItemsCard from "@/components/customer/orders/OrderItemsCard";
import OrderShippingCard from "@/components/customer/orders/OrderShippingCard";
import OrderTimelineCard from "@/components/customer/orders/OrderTimelineCard";
import OrderMetaCard from "@/components/customer/orders/OrderMetaCard";
import type { OrderForClient } from "@/lib/types/order";

export default function OrderDetailsClient({ order }: { order: OrderForClient }) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isPayable = order.status === "CREATED" || order.status === "PAYMENT_FAILED";

  useEffect(() => {
    if (!order.expiresAt || !isPayable) return;

    const tick = () => {
      const diff = new Date(order.expiresAt!).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [order.expiresAt, isPayable]);

  async function handleCancel() {
    if (!confirm("Cancel this order?")) return;
    setLoading(true);
    try {
      await cancelOrderAction(order.id);
      toast.success("Order cancelled", "Your order has been cancelled.");
      router.refresh();
    } catch (err: unknown) {
      toast.error("Cancel failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    setLoading(true);
    try {
      await mockMarkPaidAction(order.id);
      toast.success("Payment successful", "Your order has been marked as paid.");
      router.refresh();
    } catch (err: unknown) {
      toast.error("Payment failed", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* Status banner — always full width */}
      <OrderStatusBanner
        status={order.status}
        totalAmount={order.totalAmount}
        currency={order.currency}
        timeLeft={timeLeft}
      />

      {/* Action buttons — only when payable */}
      {isPayable && timeLeft !== "Expired" && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button isLoading={loading} onClick={handlePay} className="flex-1">
            Simulate Payment
            <span className="ml-1.5 text-[10px] opacity-50 font-normal">(Dev Only)</span>
          </Button>

          {order.status === "CREATED" && (
            <Button
              variant="secondary"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 !border-red-400/40 !text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/30"
            >
              Cancel Order
            </Button>
          )}
        </div>
      )}

      {/* Two-col on desktop: items (wider) + right sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:items-start">

        {/* Left: items */}
        <div className="lg:col-span-3 space-y-4">
          <OrderItemsCard
            items={order.items}
            totalAmount={order.totalAmount}
            currency={order.currency}
          />
          <OrderShippingCard
            shippingName={order.shippingName}
            shippingPhone={order.shippingPhone}
            shippingAddr={order.shippingAddr}
          />
        </div>

        {/* Right: timeline + meta */}
        <div className="lg:col-span-2 space-y-4">
          <OrderTimelineCard
            status={order.status}
            createdAt={order.createdAt}
            paidAt={order.paidAt}
            expiresAt={order.expiresAt}
          />
          <OrderMetaCard
            orderId={order.id}
            paymentId={order.paymentId}
            currency={order.currency}
            createdAt={order.createdAt}
            paidAt={order.paidAt}
          />
        </div>
      </div>
    </div>
  );
}