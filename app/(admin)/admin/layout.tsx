import { requireAdmin } from "@/lib/auth/requireAdmin";
import AdminTabs from "./components/ui/AdminTabs";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const tabs = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Blogs", href: "/admin/blogs" },
  { label: "Marquee", href: "/admin/marquee" },
  { label: "Leads", href: "/admin/leads" },
  { label: "Users", href: "/admin/users" },
  { label: "Logs", href: "/admin/logs" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen px-6 lg:px-24 pt-6 space-y-6 text-white">
      <AdminTabs />
      <div>{children}</div>
    </div>
  );
}
