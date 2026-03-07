"use client";

import { useState } from "react";
import { ShoppingBag, ShoppingCart, User, Settings, ArrowRight, Mail, MapPin, CheckCircle2, IndianRupee } from "lucide-react";
import Link from "next/link";
import type { Address } from "@prisma/client";

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

  const localPart = user.email.split("@")[0];
  const initials =
    localPart.split(/[._-]/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("") ||
    localPart[0]?.toUpperCase() ||
    "U";

  return (
    <div className="flex flex-col gap-3 w-full">

      {/* ════════════════════════════════════════
          ROW 1 — ALERTS (always at very top)
      ════════════════════════════════════════ */}
      {(pendingCount > 0 || lastPaidOrder) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {pendingCount > 0 && <div className="flex-1"><PendingOrdersCard count={pendingCount} /></div>}
          {lastPaidOrder && <div className="flex-1"><LastOrderBanner order={lastPaidOrder} /></div>}
        </div>
      )}

      {/* ════════════════════════════════════════
          ROW 2 — DENSE BENTO TOP GRID
          [ Profile (tall, left) ] [ Stats col (right top) ]
          [                      ] [ Nav links (right bot) ]
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

        {/* ── Profile card — spans 2 rows on the left ── */}
        <div className="col-span-2 sm:col-span-2 sm:row-span-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex flex-col justify-between p-5 gap-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-lg font-bold">
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-brand-primary rounded-full p-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--text-main)] truncate">Hi, {localPart}!</p>
              <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider mt-0.5">Verified</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Mail className="w-3.5 h-3.5 shrink-0 text-brand-primary/60" />
              <p className="text-xs truncate">{user.email}</p>
            </div>
            {defaultAddress && (
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-brand-primary/60" />
                <p className="text-xs truncate">{defaultAddress.city}, {defaultAddress.state}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Stat: Total Orders — violet ── */}
        <div className="col-span-1 rounded-2xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/40 flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">Orders</p>
            <p className="text-xl font-bold text-violet-900 dark:text-violet-100 tabular-nums">{orderCount}</p>
          </div>
        </div>

        {/* ── Stat: Total Spent — emerald, clickable ── */}
        <Link href="/orders" className="col-span-1 active:scale-[0.98] transition-transform">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-3 px-4 py-3.5 h-full">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
              <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Spent</p>
              <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100 tabular-nums">{formatSpent(totalSpent)}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          </div>
        </Link>

        {/* ── Cart — brand primary, spans full width on bottom right ── */}
        <Link href="/cart" className="col-span-2 active:scale-[0.98] transition-transform">
          <div className="relative rounded-2xl bg-brand-primary flex items-center gap-3 px-4 py-3.5 shadow-md shadow-brand-primary/20 h-full">
            <div className="relative w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-white" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-4.5 h-4.5 w-[18px] h-[18px] flex items-center justify-center rounded-full text-[9px] font-bold border-2 border-brand-primary">
                  {cartItemCount}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Cart</p>
              <p className="text-sm font-bold text-white">
                {cartItemCount > 0 ? `${cartItemCount} item${cartItemCount > 1 ? "s" : ""}` : "Empty"}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-white/70 shrink-0" />
          </div>
        </Link>

        {/* ── Orders History ── */}
        <Link href="/orders" className="col-span-1 active:scale-[0.98] transition-transform">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex flex-col items-center justify-center gap-2 p-4 text-center h-full hover:border-brand-primary/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-muted)]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[var(--text-main)] leading-tight">Orders</span>
          </div>
        </Link>

        {/* ── Profile ── */}
        <Link href="/account/profile" className="col-span-1 active:scale-[0.98] transition-transform">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex flex-col items-center justify-center gap-2 p-4 text-center h-full hover:border-brand-primary/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-muted)]">
              <User className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[var(--text-main)] leading-tight">Profile</span>
          </div>
        </Link>

        {/* ── Settings — full width row ── */}
        <Link href="/account/settings" className="col-span-2 sm:col-span-4 active:scale-[0.98] transition-transform">
          <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-surface)] flex items-center gap-3 px-4 py-3 hover:border-brand-primary/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-subtle)] flex items-center justify-center text-[var(--text-muted)] shrink-0">
              <Settings className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-[var(--text-main)] flex-1">Settings</span>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
          </div>
        </Link>

      </div>

      {/* ════════════════════════════════════════
          ROW 3 — MAIN CONTENT
      ════════════════════════════════════════ */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-1">
        <RecentOrdersCard orders={orders} />
        <AddressList
          addresses={addresses}
          externalOpen={addAddressOpen}
          onExternalOpenChange={setAddAddressOpen}
        />
      </div>

      {/* ════════════════════════════════════════
          ROW 4 — ACTIVITY CHART
      ════════════════════════════════════════ */}
      <AccountActivityChart orders={orders} />

    </div>
  );
}