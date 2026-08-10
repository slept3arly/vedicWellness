"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/public/ui/Button";
import { toast } from "@/lib/toast";
import { cancelOrderAction } from "../serverActions";

import OrderStatusBanner from "@/components/customer/orders/OrderStatusBanner";
import OrderItemsCard from "@/components/customer/orders/OrderItemsCard";
import OrderShippingCard from "@/components/customer/orders/OrderShippingCard";
import OrderTimelineCard from "@/components/customer/orders/OrderTimelineCard";
import OrderMetaCard from "@/components/customer/orders/OrderMetaCard";
import type { OrderForClient } from "@/lib/types/order";

export default function OrderDetailsClient({
  order,
}: {
  order: OrderForClient;
}) {
  const router = useRouter();

  const [cancelLoading, setCancelLoading] = useState(false);
  const [locked, setLocked] = useState(false);

  async function handleCancel() {
    if (cancelLoading || locked) return;

    if (!confirm("Cancel this order?")) return;

    setCancelLoading(true);
    setLocked(true);

    try {
      await cancelOrderAction(order.id);
      toast.success("Order cancelled", "Your order has been cancelled.");
      router.refresh();
    } catch (err: unknown) {
      setLocked(false);
      toast.error(
        "Cancel failed",
        err instanceof Error ? err.message : "Please try again."
      );
    } finally {
      setCancelLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <OrderStatusBanner
        status={order.status}
        totalAmount={order.totalAmount}
        currency={order.currency}
      />

      {/* Customer action */}
      {order.status === "CREATED" && (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            isLoading={cancelLoading}
            onClick={handleCancel}
            disabled={locked || cancelLoading}
            className={`w-full sm:flex-1 !border-red-400/40 !text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/30 ${
              locked ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Cancel Order
          </Button>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:items-start">
        {/* Left */}
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

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          <OrderTimelineCard
            status={order.status}
            createdAt={order.createdAt}
            expiresAt={order.expiresAt}
          />

          <OrderMetaCard
            orderId={order.id}
            currency={order.currency}
            createdAt={order.createdAt}
          />
        </div>
      </div>
    </div>
  );
}
