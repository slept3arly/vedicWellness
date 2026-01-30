import Link from "next/link";
import AdminCard from "./components/ui/AdminCard";
import {
  Package,
  FileText,
  Megaphone,
  ClipboardList,
  Users,
  ScrollText,
} from "lucide-react";

const sections = [
  { label: "Products", href: "/admin/products", icon: Package, desc: "Manage product catalog" },
  { label: "Blogs", href: "/admin/blogs", icon: FileText, desc: "Content & SEO posts" },
  { label: "Marquee", href: "/admin/marquee", icon: Megaphone, desc: "Homepage banner text" },
  { label: "Leads", href: "/admin/leads", icon: ClipboardList, desc: "Customer inquiries" },
  { label: "Users", href: "/admin/users", icon: Users, desc: "Admins, sales & viewers" },
  { label: "Logs", href: "/admin/logs", icon: ScrollText, desc: "System activity history" },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((s) => {
          const Icon = s.icon;

          return (
            <Link key={s.href} href={s.href}>
              <AdminCard className="group cursor-pointer transition hover:shadow-md hover:border-primary">
                <div className="flex items-center gap-3">
                  <Icon className="text-primary" size={26} />
                  <h2 className="text-lg font-semibold">{s.label}</h2>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {s.desc}
                </p>
              </AdminCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
