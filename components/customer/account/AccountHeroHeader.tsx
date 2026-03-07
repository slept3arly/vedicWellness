"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, ShoppingBag, IndianRupee, ShoppingCart, ArrowRight, User, Settings } from "lucide-react";
import Link from "next/link";
import type { Address } from "@prisma/client";
import { fadeUpSoft, staggerFast } from "@/app/animations";
import Card from "@/components/public/ui/Card";

type Props = {
  localPart: string;
  initials: string;
  email: string;
  defaultAddress: Address | null;
  orderCount: number;
  totalSpent: number;
  cartItemCount: number;
};

function formatSpent(amount: number) {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}k`;
  return `₹${amount}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const QUICK_ACTIONS = [
  { href: "/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/account/profile", icon: User, label: "Profile" },
  { href: "/account/settings", icon: Settings, label: "Settings" },
];

export default function AccountHeroHeader({
  localPart,
  initials,
  email,
  defaultAddress,
  orderCount,
  totalSpent,
  cartItemCount,
}: Props) {
  const greeting = getGreeting();

  return (
    <Card className="p-5 sm:p-6">
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5"
      >
        {/* ── Top row: Avatar + Greeting + Meta ── */}
        <motion.div variants={fadeUpSoft} className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-2xl font-bold font-heading">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-brand-primary rounded-full p-[3px] shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>

          {/* Greeting + info */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-brand-primary uppercase tracking-widest font-heading mb-0.5">
              {greeting},
            </p>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-[var(--text-main)] leading-tight truncate">
              {localPart}!
            </h1>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Mail className="w-3.5 h-3.5 text-brand-primary/50 shrink-0" />
                <p className="text-xs font-body truncate">{email}</p>
              </div>
              {defaultAddress && (
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary/50 shrink-0" />
                  <p className="text-xs font-body truncate">
                    {defaultAddress.city}, {defaultAddress.state}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ── */}
        <motion.div variants={fadeUpSoft} className="grid grid-cols-3 gap-2.5">
          {/* Orders */}
          <div className="flex flex-col items-center gap-1 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/40 px-3 py-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-lg font-bold tabular-nums text-violet-900 dark:text-violet-100 font-heading leading-none">
              {orderCount}
            </p>
            <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider font-heading">
              Orders
            </p>
          </div>

          {/* Spent */}
          <Link href="/orders" className="group">
            <div className="flex flex-col items-center gap-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 px-3 py-3 h-full group-hover:border-emerald-400/60 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-lg font-bold tabular-nums text-emerald-900 dark:text-emerald-100 font-heading leading-none">
                {formatSpent(totalSpent)}
              </p>
              <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider font-heading">
                Spent
              </p>
            </div>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="group">
            <div className="relative flex flex-col items-center gap-1 rounded-xl bg-brand-primary px-3 py-3 h-full shadow-md shadow-brand-primary/20 group-hover:shadow-brand-primary/30 transition-shadow">
              {cartItemCount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-brand-primary">
                  {cartItemCount}
                </span>
              )}
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              <p className="text-lg font-bold tabular-nums text-white font-heading leading-none">
                {cartItemCount}
              </p>
              <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider font-heading">
                Cart
              </p>
            </div>
          </Link>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div
          variants={fadeUpSoft}
          className="border-t border-[var(--border-soft)]"
        />

        {/* ── Quick actions ── */}
        <motion.div variants={fadeUpSoft} className="flex items-center gap-2">
          {QUICK_ACTIONS.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-subtle)] hover:border-brand-primary/30 hover:bg-brand-primary/[0.03] transition-all text-[var(--text-muted)] hover:text-brand-primary"
            >
              <Icon className="w-3.5 h-3.5 shrink-0 transition-colors" />
              <span className="text-xs font-semibold font-heading whitespace-nowrap transition-colors">
                {label}
              </span>
            </Link>
          ))}
          <Link
            href="/cart"
            className="group ml-auto flex items-center gap-1.5 text-xs font-semibold font-heading text-brand-primary hover:text-brand-accent transition-colors shrink-0"
          >
            View Cart
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </Card>
  );
}
