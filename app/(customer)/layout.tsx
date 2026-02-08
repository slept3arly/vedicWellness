import FloatingSidebar from "@/components/customer/layout/FloatingSidebar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)]">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <FloatingSidebar />
        </aside>

        <main className="col-span-12 lg:col-span-9 space-y-10">
          {children}
        </main>
      </div>
    </div>
  );
}
