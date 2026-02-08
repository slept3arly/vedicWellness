import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

export default function AddressList() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <p className="font-medium">Saved Addresses</p>
        <Button size="sm">Add New</Button>
      </div>

      <div className="space-y-3 text-sm">
        <div className="border border-[var(--border-soft)] rounded-xl p-4">
          Plot 149–150, Ambala City
        </div>
      </div>
    </Card>
  );
}
