"use client";

import { User, ShoppingCart, Package } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const nav = [
  { label: "My Account", href: "/account", icon: User },
  { label: "My Cart", href: "/cart", icon: ShoppingCart },
  { label: "Orders", href: "/orders", icon: Package },
];

export default function CustomerTopBar() {
  const pathname = usePathname();

  return (
    <div
      className="
        sticky z-30
        top-[112px] md:top-[140px]
        px-4
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* masked container for fade */}
        <div
          className="
            surface
            relative
            px-2 py-2
            rounded-2xl
            overflow-x-auto
            marquee-mask
          "
        >
          <nav className="flex items-center justify-center gap-2">
            {nav.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;

              return (
                <a
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-2",
                    "rounded-xl px-4 py-2 text-sm whitespace-nowrap",
                    "border border-[var(--border-soft)]",
                    "transition-colors",
                    active
                      ? "bg-[var(--bg-surface)] shadow-sm font-medium"
                      : "hover:bg-[var(--bg-surface)] text-[var(--text-muted)]"
                  )}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
