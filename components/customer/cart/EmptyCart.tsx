import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import { useRouter } from "next/navigation";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <Card className="text-center py-16">
      <p className="text-lg font-medium">Your cart is empty</p>

      <p className="mt-2 text-sm text-[var(--text-muted)]">
        Browse products and add items to cart
      </p>

      <Button
        className="mt-6"
        onClick={() => router.push("/products")}
      >
        Browse Products
      </Button>
    </Card>
  );
}
