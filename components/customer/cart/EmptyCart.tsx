import Card from "@/components/public/ui/Card";
import Button from "@/components/public/ui/Button";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Phone, Home, Leaf } from "lucide-react";

export default function EmptyCart() {
  return (
    <Card className="
      py-16 md:py-24 
      px-6 
      flex flex-col items-center 
      text-center 
      gap-8
      md:animate-in md:fade-in md:duration-500
    ">

      {/* Icon */}
      <div className="relative flex items-center justify-center">
        <div className="hidden md:block absolute inset-0 blur-2xl opacity-20 bg-primary/20 rounded-full scale-150" />
        <Leaf
          size={56}
          className="relative text-[var(--text-muted)]"
        />
      </div>

      {/* Text */}
      <div className="space-y-3 max-w-md">
        <p className="text-2xl font-semibold tracking-tight">
          Your order cart is currently empty
        </p>

        <p className="text-sm text-[var(--text-muted)] leading-relaxed">
          Explore our range of Ayurvedic and wellness formulations crafted for
          ethical healing and long-term health. Add products to begin building
          your franchise order with Vedic Wellness.
        </p>
      </div>

      {/* Subtle Trust Line */}
      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] opacity-80">
        <ShoppingCart size={14} />
        <span>Trusted Ayurvedic formulations for modern healthcare</span>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 pt-2">

        <Link href="/products">
          <Button className="flex items-center gap-2">
            View Products
            <ArrowRight size={16} />
          </Button>
        </Link>

        <Link href="/contact">
          <Button variant="secondary" className="flex items-center gap-2">
            <Phone size={16} />
            Contact Sales
          </Button>
        </Link>

        <Link href="/">
          <Button variant="secondary" className="flex items-center gap-2">
            <Home size={16} />
            Go Home
          </Button>
        </Link>

      </div>
    </Card>
  );
}
