"use client";

import AdminCard from "@/components/admin/AdminCard";
import AdminBadge from "@/components/admin/AdminBadge";
import PageHeader from "@/components/public/ui/PageHeader";
import AdminActionButton from "@/components/admin/AdminActionButton";

import { updateOrderStatus, cancelOrder } from "../serverActions";

import { IndianRupee, User, Phone, MapPin } from "lucide-react";
import type { BadgeStatus } from "@/components/admin/AdminBadge";

type ShippingAddress = {
  line1?: string;
  line2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type AdminOrderDetail = {
  id: string;
  status: string;
  totalAmount: number;
  currency: string;
  shippingAddr: unknown;
  shippingPhone: string;
  shippingName: string;
  user: { email: string; name: string | null } | null;
  items: { id: string; productName: string; price: number; quantity: number }[];
};

/* -------------------------------------------------- */

const ORDER_STATUSES = [
  "CREATED",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "EXPIRED",
];

/* -------------------------------------------------- */

function formatCurrency(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/* -------------------------------------------------- */

export default function AdminOrderDetailClient({
  order,
}: {
  order: AdminOrderDetail;
}) {
  const addr = order.shippingAddr && typeof order.shippingAddr === "object"
    ? order.shippingAddr as ShippingAddress
    : {};

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {/* Header */}
      <div>
        <PageHeader title="Order Details" subtitle={order.id} />

        {/* Copy ID */}
        <button
          onClick={() => navigator.clipboard.writeText(order.id)}
          className="text-xs text-neutral-400 hover:underline mt-1"
        >
          Copy Order ID
        </button>
      </div>

      {/* Status + Actions */}
      <AdminCard className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
        {/* LEFT */}
        <div className="space-y-2">
          <div className="text-sm text-neutral-500">Status</div>
          <AdminBadge status={order.status as BadgeStatus} />

          {/* STATUS UPDATE */}
          <form action={updateOrderStatus} className="mt-2 flex gap-2 items-center">
  <input type="hidden" name="id" value={order.id} />

  <select
    name="status"
    defaultValue={order.status}
    className="h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs px-2"
  >
    {ORDER_STATUSES.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>

  <AdminActionButton type="submit">
    Save
  </AdminActionButton>
</form>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className="text-right">
            <div className="text-sm text-neutral-500">Total</div>
            <div className="text-lg font-semibold flex items-center gap-1 justify-end">
              <IndianRupee className="h-4 w-4" />
              {formatCurrency(order.totalAmount, order.currency)}
            </div>
          </div>

          {/* CANCEL */}
          {order.status !== "CANCELLED" && (
            <form
              action={cancelOrder}
              onSubmit={(e) => {
                if (!confirm("Cancel this order?")) e.preventDefault();
              }}
            >
              <input type="hidden" name="id" value={order.id} />

              <AdminActionButton variant="danger">
                Cancel Order
              </AdminActionButton>
            </form>
          )}
        </div>
      </AdminCard>

      {/* Customer */}
      <AdminCard>
        <h3 className="font-semibold mb-3">Customer</h3>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {order.user?.email || "Guest"}
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {order.shippingPhone}
          </div>
        </div>
      </AdminCard>

      {/* Address */}
      <AdminCard>
        <h3 className="font-semibold mb-3">Shipping Address</h3>

        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {order.shippingName}
          </div>

          <div>{addr.line1}</div>
          {addr.line2 && <div>{addr.line2}</div>}
          <div>
            {addr.city}, {addr.state}
          </div>
          <div>
            {addr.postalCode}, {addr.country}
          </div>
        </div>
      </AdminCard>

      {/* Items */}
      <AdminCard>
        <h3 className="font-semibold mb-4">Items</h3>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <div>
                <div className="font-medium">
                  {item.productName}
                </div>
                <div className="text-xs text-neutral-500">
                  ₹{item.price} × {item.quantity}
                </div>
              </div>

              <div className="font-semibold">
                ₹{item.price * item.quantity}
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

    </div>
  );
}
