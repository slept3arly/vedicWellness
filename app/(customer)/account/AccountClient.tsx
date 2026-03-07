"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Address } from "@prisma/client";
import { staggerFast, fadeUpSoft } from "@/app/animations";

import AccountHeroHeader from "@/components/customer/account/AccountHeroHeader";
import AccountActivityChart from "@/components/customer/account/AccountActivityChart";
import RecentOrdersCard from "@/components/customer/account/RecentOrdersCard";
import LastOrderBanner from "@/components/customer/account/LastOrderBanner";
import PendingOrdersCard from "@/components/customer/account/PendingOrdersCard";
import AddressList from "@/components/customer/account/AddressList";

type Order = {
  id: string;
  status: string;
  createdAt: Date;
  totalAmount: number;
  currency?: string;
};

type LastPaidOrder = {
  id: string;
  totalAmount: number;
  createdAt: Date;
  firstProductName: string | null;
  itemCount: number;
} | null;

type Props = {
  user: { email: string };
  orderCount: number;
  orders: Order[];
  addresses: Address[];
  totalSpent: number;
  cartItemCount: number;
  lastPaidOrder: LastPaidOrder;
};

export default function AccountClient({
  user,
  orderCount,
  orders,
  addresses,
  totalSpent,
  cartItemCount,
  lastPaidOrder,
}: Props) {
  const [addAddressOpen, setAddAddressOpen] = useState(false);

  const pendingCount = orders.filter((o) => o.status === "CREATED").length;
  const defaultAddress = addresses.find((a) => a.isDefault) ?? null;

  const localPart = user.email.split("@")[0];
  const initials =
    localPart
      .split(/[._-]/)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase() ?? "")
      .join("") ||
    localPart[0]?.toUpperCase() ||
    "U";

  const hasAlerts = pendingCount > 0 || !!lastPaidOrder;

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4 w-full"
    >
      {/* ── Hero ── */}
      <motion.div variants={fadeUpSoft}>
        <AccountHeroHeader
          localPart={localPart}
          initials={initials}
          email={user.email}
          defaultAddress={defaultAddress}
          orderCount={orderCount}
          totalSpent={totalSpent}
          cartItemCount={cartItemCount}
        />
      </motion.div>

      {/* ── Alert strip (pending + last order) ── */}
      {hasAlerts && (
        <motion.div
          variants={fadeUpSoft}
          className="flex flex-col sm:flex-row gap-3"
        >
          {pendingCount > 0 && (
            <div className="flex-1">
              <PendingOrdersCard count={pendingCount} />
            </div>
          )}
          {lastPaidOrder && (
            <div className="flex-1">
              <LastOrderBanner order={lastPaidOrder} />
            </div>
          )}
        </motion.div>
      )}

      {/* ── Main content grid ── */}
      <motion.div
        variants={fadeUpSoft}
        className="grid grid-cols-1 xl:grid-cols-2 gap-4"
      >
        <RecentOrdersCard orders={orders} />
        <AddressList
          addresses={addresses}
          externalOpen={addAddressOpen}
          onExternalOpenChange={setAddAddressOpen}
        />
      </motion.div>

      {/* ── Activity chart ── */}
      <motion.div variants={fadeUpSoft}>
        <AccountActivityChart orders={orders} />
      </motion.div>
    </motion.div>
  );
}