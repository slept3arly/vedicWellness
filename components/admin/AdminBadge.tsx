type BadgeStatus =
  | "NEW"
  | "HOT"
  | "WARM"
  | "CONVERTED"
  | "LOST"
  | "USELESS"
  | "ADMIN"
  | "SALES"
  | "VIEWER"
  | "ACTIVE"
  | "INACTIVE"
  | "VERIFIED"     // ✅ add
  | "UNVERIFIED"   // ✅ add

  // ORDERS
  | "CREATED"
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
  VERIFIED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },

  UNVERIFIED: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-400",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },


  NEW: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    ring: "ring-blue-400/30",
    dot: "bg-blue-400",
  },

  HOT: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },

  WARM: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    ring: "ring-amber-400/30",
    dot: "bg-amber-400",
  },

  CONVERTED: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },

  LOST: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-400",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },

  USELESS: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    ring: "ring-zinc-400/25",
    dot: "bg-zinc-400",
  },

  ADMIN: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    ring: "ring-purple-400/30",
    dot: "bg-purple-400",
  },

  SALES: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    ring: "ring-yellow-400/30",
    dot: "bg-yellow-400",
  },

  VIEWER: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-300",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },

  ACTIVE: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },

  INACTIVE: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-400",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },

  /* ----------------------------- */
  /* ORDERS                        */
  /* ----------------------------- */

  CREATED: {
    bg: "bg-neutral-500/10",
    text: "text-neutral-400",
    ring: "ring-neutral-400/25",
    dot: "bg-neutral-400",
  },

  PAYMENT_FAILED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },

  PAID: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },

  CONFIRMED: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    ring: "ring-blue-400/30",
    dot: "bg-blue-400",
  },

  SHIPPED: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    ring: "ring-indigo-400/30",
    dot: "bg-indigo-400",
  },

  DELIVERED: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    ring: "ring-green-400/30",
    dot: "bg-green-400",
  },

  CANCELLED: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    ring: "ring-red-400/30",
    dot: "bg-red-400",
  },

  EXPIRED: {
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
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
  const s = BADGE_STYLE[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2
        px-3 py-1.5 text-xs font-semibold tracking-wide
        rounded-full  
        ring-1 ${s.ring}
        ${s.bg} ${s.text}
        shadow-[0_0_12px_rgba(0,0,0,0.15)]
        transition-all duration-200
        ${className}
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} shadow-sm`} />
      {status.replaceAll("_", " ")}
    </span>
  );
}