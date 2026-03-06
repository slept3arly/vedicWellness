import Link from "next/link";
import { ShoppingBag, ShoppingCart, ArrowUpRight } from "lucide-react";

type Props = {
  cartItemCount: number;
};

export default function AccountQuickLinks({ cartItemCount }: Props) {
  const LINKS = [
    {
      label: "My Orders",
      description: "View history & track deliveries",
      href: "/orders",
      icon: ShoppingBag,
      badge: null,
      accent: "group-hover:text-emerald-500 dark:group-hover:text-emerald-400",
      accentBg: "group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/40",
      accentBorder: "group-hover:border-emerald-300/50 dark:group-hover:border-emerald-700/40",
    },
    {
      label: "Cart",
      description: cartItemCount > 0 ? `${cartItemCount} item${cartItemCount > 1 ? "s" : ""} waiting` : "Review items & checkout",
      href: "/cart",
      icon: ShoppingCart,
      badge: cartItemCount > 0 ? cartItemCount : null,
      accent: "group-hover:text-sky-500 dark:group-hover:text-sky-400",
      accentBg: "group-hover:bg-sky-50 dark:group-hover:bg-sky-950/40",
      accentBorder: "group-hover:border-sky-300/50 dark:group-hover:border-sky-700/40",
    },
  ];

  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] p-5 flex flex-col h-full">
      <p className="text-sm font-semibold text-[var(--text-main)] mb-1">Quick Links</p>
      <p className="text-xs text-[var(--text-muted)] mb-4">Navigate your account</p>

      <div className="flex flex-col gap-3 flex-1">
        {LINKS.map(({ label, description, href, icon: Icon, badge, accent, accentBg, accentBorder }) => (
          <Link
            key={label}
            href={href}
            className={`
              group flex items-center gap-4 rounded-xl border border-[var(--border-soft)]
              bg-[var(--bg-subtle)] px-4 py-4 flex-1
              transition-colors duration-150
              ${accentBorder}
            `}
          >
            <div className={`relative shrink-0 w-10 h-10 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-soft)] flex items-center justify-center transition-colors ${accentBg}`}>
              <Icon className={`w-4 h-4 text-[var(--text-muted)] transition-colors ${accent}`} />
              {badge !== null && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] rounded-full bg-[var(--brand-primary)] text-white text-[10px] font-bold flex items-center justify-center px-1">
                  {badge}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold text-[var(--text-main)] transition-colors ${accent}`}>
                {label}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">
                {description}
              </p>
            </div>

            <ArrowUpRight className={`w-4 h-4 text-[var(--text-muted)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${accent}`} />
          </Link>
        ))}
      </div>
    </div>
  );
}