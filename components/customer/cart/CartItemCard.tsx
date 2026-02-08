import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

export default function CartItemCard({ item }: any) {
  return (
    <Card className="flex items-center gap-4">
      <div className="h-20 w-20 rounded-xl bg-[var(--bg-muted)]" />

      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-[var(--text-muted)]">₹{item.price}</p>
      </div>

      <Button variant="secondary">−</Button>
      <span>{item.qty}</span>
      <Button variant="secondary">+</Button>
    </Card>
  );
}
