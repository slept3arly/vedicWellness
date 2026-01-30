"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Package,
  FileText,
  Megaphone,
  ClipboardList,
  Users,
  ScrollText,
  LayoutDashboard,
} from "lucide-react";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Marquee", href: "/admin/marquee", icon: Megaphone },
  { label: "Leads", href: "/admin/leads", icon: ClipboardList },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Logs", href: "/admin/logs", icon: ScrollText },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-background/95 backdrop-blur">

      <div className="p-5 font-bold text-lg tracking-tight border-b border-border">
        Admin Panel
      </div>

      <nav className="flex flex-col gap-1 p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  active
                    ? "bg-primary/15 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
                active:scale-[0.98]
              `}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
