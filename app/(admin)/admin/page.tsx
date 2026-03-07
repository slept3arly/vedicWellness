import Link from "next/link";
import AdminCard from "../../../components/admin/AdminCard";
import PageHeader from "@/components/public/ui/PageHeader";
import SectionHeading from "@/components/public/ui/SectionHeading"; // Assuming the import path based on PageHeader
import {
  Package,
  FileText,
  Megaphone,
  ClipboardList,
  Users,
  ScrollText,
  Image as ImageIcon,
} from "lucide-react";

const sections = [
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    desc: "Manage product catalog",
  },
  {
    label: "Blogs",
    href: "/admin/blogs",
    icon: FileText,
    desc: "Content & SEO posts",
  },
  {
    label: "Slides",
    href: "/admin/slides",
    icon: ImageIcon,
    desc: "Manage homepage & campaign banners",
  },
  {
    label: "Marquee",
    href: "/admin/marquee",
    icon: Megaphone,
    desc: "Homepage banner text",
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: ClipboardList,
    desc: "Customer inquiries",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
    desc: "Admins, sales & viewers",
  },
  {
    label: "Logs",
    href: "/admin/logs",
    icon: ScrollText,
    desc: "System activity history",
  },
];

export default function AdminHomePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((s) => {
          const Icon = s.icon;

          return (
            <Link key={s.href} href={s.href}>
              <AdminCard className="group cursor-pointer transition hover:shadow-md hover:border-primary">
                <div className="flex items-center gap-3">
                  <Icon className="text-primary" size={26} />
                  <SectionHeading title={s.label} />
                </div>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
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