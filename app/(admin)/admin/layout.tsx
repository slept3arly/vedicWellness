import AdminNav from "./AdminNav";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ server-side RBAC gate
  await requireAdmin();

  return (
    <div className="px-4 font-bold text-black dark:text-white lg:px-28 lg:pt-8">
      <AdminNav />
      <div>{children}</div>
    </div>
  );
}
