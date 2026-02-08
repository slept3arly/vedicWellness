import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";

export default function CartSummaryCard() {
  return (
    <Card>
      <p className="font-medium mb-4">Order Summary</p>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹2,400</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>₹0</span>
        </div>
      </div>

      <div className="mt-4 border-t border-[var(--border-soft)] pt-4 flex justify-between font-medium">
        <span>Total</span>
        <span>₹2,400</span>
      </div>

      <Button className="mt-6 w-full">Checkout</Button>
    </Card>
  );
}
