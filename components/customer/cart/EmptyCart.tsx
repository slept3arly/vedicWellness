import Link from "next/link";
import { ShoppingCart, ArrowRight, Phone, Leaf } from "lucide-react";
import Card from "@/components/public/ui/Card";
import CustomerButton from "@/components/customer/CustomerButton";

export default function EmptyCart() {
  return (
    <main
      className="max-w-7xl mx-auto w-full py-6 px-4 sm:px-6"
      aria-labelledby="empty-cart-heading"
    >
      <Card className="p-0">
        <div className="flex flex-col items-center text-center gap-6 py-20 sm:py-28 px-6">

          {/* Icon */}
          <div
            className="w-20 h-20 rounded-3xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-inner"
            aria-hidden="true"
          >
            <ShoppingCart className="w-9 h-9 text-zinc-400 dark:text-zinc-500" />
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-2 max-w-sm">
            <h1
              id="empty-cart-heading"
              className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Your cart is empty
            </h1>
            <p className="text-sm font-body text-[var(--text-muted)] leading-relaxed">
              Add Ayurvedic and wellness products from our catalogue to start
              building your order with Vedic Wellness.
            </p>
          </div>

          {/* Trust bar */}
          <div
            className="flex items-center gap-2 text-xs font-body text-[var(--text-muted)] opacity-70"
            aria-label="Trust badges"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" aria-hidden="true" />
            <span>Trusted formulations · Free delivery · Franchise support</span>
          </div>

          {/* Actions */}
          <nav aria-label="Cart actions" className="flex flex-wrap justify-center gap-3">
            <Link href="/products">
              <CustomerButton className="h-10 gap-2">
                Browse Products
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </CustomerButton>
            </Link>
            <Link href="/contact">
              <CustomerButton
                variant="secondary"
                className="h-10 gap-2 border-zinc-200 dark:border-zinc-800"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                Contact Sales
              </CustomerButton>
            </Link>
          </nav>
        </div>
      </Card>
    </main>
  );
}