import Card from "@/components/public/ui/Card";

type Props = {
  email: string;
  orderCount: number;
  addressCount: number;
};

export default function AccountOverviewCard({
  email,
  orderCount,
  addressCount,
}: Props) {
  return (
    <Card>
      <p className="text-sm text-[var(--text-muted)]">Logged in as</p>
      <p className="mt-1 font-medium">{email}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[var(--text-muted)]">Orders</p>
          <p className="font-medium">{orderCount}</p>
        </div>
        <div>
          <p className="text-[var(--text-muted)]">Saved Addresses</p>
          <p className="font-medium">{addressCount}</p>
        </div>
      </div>
    </Card>
  );
}