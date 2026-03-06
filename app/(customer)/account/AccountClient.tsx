"use client";

import { useState } from "react";
import { ShoppingBag, IndianRupee, ShoppingCart } from "lucide-react";
import type { Address } from "@prisma/client";

import AccountProfileCard from "@/components/customer/account/AccountProfileCard";
import AccountStatsCard from "@/components/customer/account/AccountStatsCard";
import AccountQuickLinks from "@/components/customer/account/AccountQuickLinks";
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

function formatSpent(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${amount}`;
}

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

  return (
    <div className="bg-[var(--page-bg)] py-12 px-4 space-y-6">

      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--text-main)]">
          My Account
        </h1>
        <p className="text-sm md:text-base text-[var(--text-muted)]">
          Manage your profile, orders and saved addresses
        </p>
      </div>

      {/* ── MOBILE top section: stacked 1-2-1 ── */}
      <div className="flex flex-col gap-4 lg:hidden">

        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
          <AccountProfileCard email={user.email} defaultAddress={defaultAddress} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
            <AccountStatsCard
              label="Total Orders"
              value={orderCount}
              sub="All time"
              href="/orders"
            />
          </div>

          <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
            <AccountStatsCard
              label="Total Spent"
              value={formatSpent(totalSpent)}
              sub="Paid orders only"
            />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
          <AccountStatsCard
            label="Cart"
            value={`${cartItemCount} item${cartItemCount !== 1 ? "s" : ""}`}
            sub={cartItemCount > 0 ? "Tap to checkout" : "Your cart is empty"}
            href="/cart"
          />
        </div>
      </div>

      {/* ── DESKTOP top section: 5-col row ── */}
      <div className="hidden lg:grid lg:grid-cols-5 gap-4">

        <div className="lg:col-span-2 bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
          <AccountProfileCard email={user.email} defaultAddress={defaultAddress} />
        </div>

        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
          <AccountStatsCard
            icon={<ShoppingBag className="w-4 h-4" />}
            label="Total Orders"
            value={orderCount}
            sub="All time"
            href="/orders"
          />
        </div>

        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
          <AccountStatsCard
            icon={<IndianRupee className="w-4 h-4" />}
            label="Total Spent"
            value={formatSpent(totalSpent)}
            sub="Paid orders only"
          />
        </div>

        <div className="bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors rounded-xl">
          <AccountStatsCard
            icon={<ShoppingCart className="w-4 h-4" />}
            label="Cart Items"
            value={cartItemCount}
            sub={cartItemCount > 0 ? "Ready to checkout" : "Cart is empty"}
            href="/cart"
          />
        </div>
      </div>

      {/* Row 2: last order + pending banner */}
      {(lastPaidOrder || pendingCount > 0) && (
        <div className="flex flex-col gap-4">
          {lastPaidOrder && <LastOrderBanner order={lastPaidOrder} />}
          {pendingCount > 0 && <PendingOrdersCard count={pendingCount} />}
        </div>
      )}

      {/* Row 3: chart + quick links */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5 lg:items-stretch">

        <div className="lg:col-span-3 bg-[var(--card-bg)] rounded-xl flex flex-col">
          <AccountActivityChart orders={orders} />
        </div>

        <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-xl flex flex-col">
          <AccountQuickLinks cartItemCount={cartItemCount} />
        </div>

      </div>

      {/* Row 4: recent orders + address list */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5 lg:items-stretch">

        <div className="lg:col-span-2 bg-[var(--card-bg)] rounded-xl flex flex-col">
          <RecentOrdersCard orders={orders} />
        </div>

        <div className="lg:col-span-3 bg-[var(--card-bg)] rounded-xl flex flex-col">
          <AddressList
            addresses={addresses}
            externalOpen={addAddressOpen}
            onExternalOpenChange={setAddAddressOpen}
          />
        </div>

      </div>

    </div>
  );
}