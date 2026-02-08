import Card from "@/components/public/ui/Card";

export default function AccountOverviewCard() {
  return (
    <Card>
      <p className="text-sm text-[var(--text-muted)]">Logged in as</p>
      <p className="mt-1 font-medium">customer@email.com</p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[var(--text-muted)]">Orders</p>
          <p className="font-medium">12</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Saved Addresses</p>
          <p className="font-medium">3</p>
        </div>
      </div>
    </Card>
  );
}
