"use client";

import React from "react";

/**
 * BadgeStatus includes:
 * 1. CRM/Leads (Legacy)
 * 2. Orders (Legacy)
 * 3. System Logs (New)
 * 4. Marquee/Content (New)
 * 5. Assignment (New)
 */
export type BadgeStatus =
  // LOG SPECIFIC
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  // MARQUEE / VISIBILITY
  | "VISIBLE"
  | "HIDDEN"
  // CRM & LEADS
  | "NEW"
  | "HOT"
  | "WARM"
  | "CONVERTED"
  | "LOST"
  | "USELESS"
  // ASSIGNMENT
  | "ASSIGNED"
  | "UNCLAIMED"
  // ROLES & STATUS
  | "ADMIN"
  | "SALES"
  | "VIEWER"
  | "ACTIVE"
  | "INACTIVE"
  | "VERIFIED"
  | "UNVERIFIED"
  // ORDERS
  | "PAYMENT_FAILED"
  | "PAID"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "EXPIRED";

const BADGE_STYLE: Record<
  BadgeStatus,
  {
    bg: string;
    text: string;
    ring: string;
    dot: string;
  }
> = {
  /* --- SYSTEM LOGS --- */
  CREATED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/20",
    dot: "bg-emerald-500",
  },
  UPDATED: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/20",
    dot: "bg-amber-500",
  },
  DELETED: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-500/20",
    dot: "bg-rose-500",
  },

  /* --- MARQUEE / VISIBILITY --- */
  VISIBLE: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/20",
    dot: "bg-blue-500",
  },
  HIDDEN: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-600 dark:text-zinc-400",
    ring: "ring-zinc-500/20",
    dot: "bg-zinc-500",
  },

  /* --- ASSIGNMENT (NEW) --- */
  ASSIGNED: {
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    ring: "ring-violet-400/30",
    dot: "bg-violet-400",
  },
  UNCLAIMED: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-500 dark:text-neutral-400",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },

  /* --- CRM & ROLES --- */
  VERIFIED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  UNVERIFIED: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-500",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },
  NEW: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    ring: "ring-blue-400/30",
    dot: "bg-blue-400",
  },
  HOT: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },
  WARM: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    ring: "ring-orange-400/30",
    dot: "bg-orange-400",
  },
  CONVERTED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  LOST: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-500",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },
  USELESS: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-500",
    ring: "ring-zinc-400/25",
    dot: "bg-zinc-400",
  },
  ADMIN: {
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    ring: "ring-purple-400/30",
    dot: "bg-purple-400",
  },
  SALES: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-600 dark:text-yellow-400",
    ring: "ring-yellow-400/30",
    dot: "bg-yellow-400",
  },
  VIEWER: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-500",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },
  ACTIVE: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  INACTIVE: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-500",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },

  /* --- ORDERS --- */
  PAYMENT_FAILED: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },
  PAID: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  CONFIRMED: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    ring: "ring-blue-400/30",
    dot: "bg-blue-400",
  },
  SHIPPED: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-500",
    ring: "ring-indigo-400/30",
    dot: "bg-indigo-400",
  },
  DELIVERED: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    ring: "ring-green-400/30",
    dot: "bg-green-400",
  },
  CANCELLED: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },
  EXPIRED: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-500",
    ring: "ring-zinc-400/25",
    dot: "bg-zinc-400",
  },
};

export default function AdminBadge({
  status,
  className = "",
}: {
  status: BadgeStatus;
  className?: string;
}) {
  const s = BADGE_STYLE[status] || BADGE_STYLE.VIEWER;

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-2.5 py-1 text-[10px] font-black tracking-widest uppercase
        rounded-md  
        ring-1 ring-inset ${s.ring}
        ${s.bg} ${s.text}
        transition-all duration-200
        ${className}
      `}
    >
      <span
        className={`h-1 w-1 rounded-full ${s.dot} animate-pulse shadow-[0_0_5px_rgba(0,0,0,0.1)]`}
      />
      {status.replaceAll("_", " ")}
    </span>
  );
}