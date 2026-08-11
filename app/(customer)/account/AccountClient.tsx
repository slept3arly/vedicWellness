"use client";

import { m } from "framer-motion";
import type { Address } from "@prisma/client";
import { ShoppingCart, History } from "lucide-react";
import Link from "next/link";
import { staggerFast, fadeUpSoft } from "@/app/animations";

import PageHeader from "@/components/public/ui/PageHeader";
import AccountProfileCard from "@/components/customer/account/AccountProfileCard";
import AccountStatsCard from "@/components/customer/account/AccountStatsCard";
import RecentOrdersCard from "@/components/customer/account/RecentOrdersCard";
import LastOrderBanner from "@/components/customer/account/LastOrderBanner";
import PendingOrdersCard from "@/components/customer/account/PendingOrdersCard";
import AddressList from "@/components/customer/account/AddressList";
import AccountActivityChart from "@/components/customer/account/AccountActivityChart";
import CustomerButton from "@/components/customer/CustomerButton";
import type { UserOrderListItem } from "@/lib/types/order";

type LastOrder = {
  id: string;
  totalAmount: number;
  createdAt: Date;
  firstProductName: string | null;
  itemCount: number;
} | null;

type Props = {
  user: { email: string };
  orderCount: number;
  orders: UserOrderListItem[];
  addresses: Address[];
  totalOrderValue: number;
  cartItemCount: number;
  lastOrder: LastOrder;
};

export default function AccountClient({
  user,
  orderCount,
  orders,
  addresses,
  totalOrderValue,
  cartItemCount,
  lastOrder,
}: Props) {
  const pendingCount = orders.filter((o) =>
    ["CREATED", "CONFIRMED"].includes(o.status)
  ).length;
  const defaultAddress = addresses.find((a) => a.isDefault) ?? null;

  const formatSpent = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
    return `₹${amount}`;
  };

  return (
    <m.div
      variants={staggerFast}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6 w-full py-4 px-4 sm:px-6"
    >
      <div className="flex flex-col gap-4">
        <PageHeader
          title="My Account"
          subtitle="Manage your profile, orders, and addresses"
          align="center"
        />
        
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <Link href="/cart">
            <CustomerButton variant="secondary" className="h-9 sm:h-10 min-w-[110px] sm:min-w-[130px] text-xs gap-2 border-emerald-500/20 text-emerald-700">
              <ShoppingCart className="w-4 h-4" />
              Cart
            </CustomerButton>
          </Link>
          <Link href="/orders">
            <CustomerButton variant="secondary" className="h-9 sm:h-10 min-w-[110px] sm:min-w-[130px] text-xs gap-2 border-zinc-200 dark:border-zinc-800">
              <History className="w-4 h-4" />
              History
            </CustomerButton>
          </Link>
        </div>
      </div>

      {/* ── 1. Profile Core Section (Mobile Optimized) ── */}
      <m.div variants={fadeUpSoft} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
        {/* Profile Card spans full width on mobile, top of the stack */}
        <div className="col-span-2 lg:col-span-2 order-first lg:order-none">
          <AccountProfileCard email={user.email} defaultAddress={defaultAddress} />
        </div>

        {/* Stats cards sit side-by-side on mobile */}
        <AccountStatsCard variant="orders" label="Total Orders" value={orderCount} />
        <AccountStatsCard variant="spent" label="Order Value" value={formatSpent(totalOrderValue)} />
      </m.div>

      {/* ── 2. Alerts Row ── */}
      <m.div variants={fadeUpSoft} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <PendingOrdersCard count={pendingCount} />
        <LastOrderBanner order={lastOrder} />
      </m.div>

      <m.div variants={fadeUpSoft}>
        <AddressList addresses={addresses} />
      </m.div>

      <m.div variants={fadeUpSoft}>
        <AccountActivityChart orders={orders} />
      </m.div>

      <m.div variants={fadeUpSoft}>
        <RecentOrdersCard orders={orders} />
      </m.div>
    </m.div>
  );
}
