"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Package,
  FileText,
  Megaphone,
  Users,
  ClipboardList,
} from "lucide-react";

const tabs = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Marquee", href: "/admin/marquee", icon: Megaphone },
  { label: "Leads", href: "/admin/leads", icon: ClipboardList },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminTabs() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex justify-center border-b border-neutral-800 pb-3">
      <div className="flex gap-6 flex-wrap">
        {tabs.map(tab => {
          const active = isActive(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 text-base font-semibold transition",

                active
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Icon size={20} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
