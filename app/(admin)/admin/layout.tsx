import { requireAdmin } from "@/lib/auth/requireAdmin";
import AdminTabs from "../../../components/admin/AdminTabs";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <AdminTabs />

      {/* Main content */}
      <main className="flex-1 px-4 py-6 sm:p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}
