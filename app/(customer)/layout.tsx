import CustomerTopBar from "@/components/customer/layout/CustomerTopBar";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {/* customer nav */}
      <CustomerTopBar />

      {/* page content */}
      <main className="mx-auto max-w-7xl px-6 py-10 space-y-10">
        {children}
      </main>
    </div>
  );
}
