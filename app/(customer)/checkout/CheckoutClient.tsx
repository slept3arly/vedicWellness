"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { staggerFast, fadeUpSoft } from "@/app/animations";
import {
  MapPin,
  User,
  Phone,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  Truck,
  Tag,
  IndianRupee,
  AlertCircle,
} from "lucide-react";
import Card from "@/components/public/ui/Card";
import SectionHeading from "@/components/public/ui/SectionHeading";
import CustomerButton from "@/components/customer/CustomerButton";
import { createOrderAction } from "./serverActions";
import { toast } from "@/lib/toast";

type Props = {
  cart: any;
  defaultAddress: any | null;
  isBuyNow?: boolean;
  buyNowProductId?: string;
  buyNowQty?: number;
};

export default function CheckoutClient({
  cart,
  defaultAddress,
  isBuyNow,
  buyNowProductId,
  buyNowQty,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const subtotal: number = cart.items.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0
  );

  const totalMrp: number = cart.items.reduce((sum: number, item: any) => {
    const compareAt = item.product.compareAtPrice as number | null;
    return sum + (compareAt ?? item.product.price) * item.quantity;
  }, 0);

  const totalSavings = totalMrp - subtotal;

  function handlePlaceOrder() {
    if (!defaultAddress) {
      toast.warning(
        "No shipping address",
        "Please add a default address in your account before placing an order."
      );
      return;
    }

    startTransition(async () => {
      try {
        const order = await createOrderAction({
          addressId: defaultAddress.id,
          buyNow: isBuyNow,
          productId: buyNowProductId,
          quantity: buyNowQty,
        });

        toast.success("Order placed!", "You'll receive confirmation shortly.");
        router.push(`/orders/${order.id}`);
      } catch (err: unknown) {
        toast.error(
          "Order failed",
          err instanceof Error ? err.message : "Please try again in a moment."
        );
      }
    });
  }

  return (
    <motion.div
      variants={staggerFast}
      initial="hidden"
      animate="show"
      className="max-w-7xl mx-auto flex flex-col gap-5 sm:gap-7 w-full py-6 px-4 sm:px-6"
      aria-label="Checkout"
    >
      {/* ── Page heading ── */}
      <motion.div variants={fadeUpSoft}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0"
            aria-hidden="true"
          >
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
              Checkout
            </h1>
            <p className="text-sm font-body text-[var(--text-muted)] mt-0.5">
              Review your order and confirm your address
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Two-column layout ── */}
      <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1fr_380px] items-start">

        {/* LEFT: Address + Order items */}
        <div className="flex flex-col gap-5">

          {/* ── Shipping address ── */}
          <motion.div variants={fadeUpSoft}>
            <Card className="p-0" aria-labelledby="shipping-heading">
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-4 border-b border-[var(--border-soft)] flex items-center justify-between gap-3">
                <SectionHeading
                  title="Shipping Address"
                  align="left"
                  className="max-w-none"
                />
                <button
                  onClick={() => router.push("/account")}
                  className="text-xs font-semibold font-heading text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline-offset-2 hover:underline transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-sm"
                  aria-label="Change shipping address in account settings"
                >
                  Change
                </button>
              </div>

              <div className="px-5 sm:px-6 py-5">
                {defaultAddress ? (
                  <address
                    className="not-italic"
                    aria-label={`Shipping to ${defaultAddress.fullName}`}
                  >
                    <div className="flex flex-col gap-2.5">
                      {/* Name */}
                      <div className="flex items-center gap-2.5">
                        <User
                          className="w-4 h-4 text-[var(--text-muted)] opacity-60 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-semibold font-heading text-zinc-900 dark:text-zinc-100">
                          {defaultAddress.fullName}
                        </span>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-2.5">
                        <Phone
                          className="w-4 h-4 text-[var(--text-muted)] opacity-60 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-body text-[var(--text-muted)]">
                          {defaultAddress.phone}
                        </span>
                      </div>

                      {/* Address lines */}
                      <div className="flex items-start gap-2.5">
                        <MapPin
                          className="w-4 h-4 text-[var(--text-muted)] opacity-60 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div className="text-sm font-body text-[var(--text-muted)] leading-relaxed">
                          <span>{defaultAddress.line1}</span>
                          {defaultAddress.line2 && (
                            <span>, {defaultAddress.line2}</span>
                          )}
                          <br />
                          <span>
                            {defaultAddress.city}, {defaultAddress.state}{" "}
                            {defaultAddress.postalCode}
                          </span>
                          <br />
                          <span>{defaultAddress.country}</span>
                        </div>
                      </div>
                    </div>
                  </address>
                ) : (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 text-sm font-body text-red-600 dark:text-red-400"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      No default address found.{" "}
                      <button
                        onClick={() => router.push("/account")}
                        className="underline font-semibold hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-sm"
                      >
                        Add one in your account
                      </button>{" "}
                      before placing an order.
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* ── Order items ── */}
          <motion.div variants={fadeUpSoft}>
            <Card className="p-0" aria-labelledby="order-items-heading">
              <div className="px-5 sm:px-6 pt-5 sm:pt-6 pb-3 border-b border-[var(--border-soft)]">
                <SectionHeading
                  title="Order Items"
                  align="left"
                  className="max-w-none"
                />
              </div>

              <ul
                aria-label="Items in this order"
                className="px-5 sm:px-6 pb-5 sm:pb-6 list-none divide-y divide-[var(--border-soft)]"
              >
                {cart.items.map((item: any) => {
                  const lineTotal = item.product.price * item.quantity;
                  const compareAt = item.product.compareAtPrice as number | null;

                  return (
                    <li
                      key={item.id}
                      className="flex items-center justify-between gap-3 py-4 first:pt-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-heading text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs font-body text-[var(--text-muted)] mt-0.5">
                          ₹{item.product.price.toLocaleString()} × {item.quantity}
                        </p>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        {compareAt && compareAt > item.product.price && (
                          <span
                            className="text-xs font-body text-zinc-400 line-through tabular-nums"
                            aria-label={`Original ₹${(compareAt * item.quantity).toLocaleString()}`}
                          >
                            ₹{(compareAt * item.quantity).toLocaleString()}
                          </span>
                        )}
                        <span className="text-sm font-semibold font-heading text-zinc-900 dark:text-zinc-100 tabular-nums">
                          ₹{lineTotal.toLocaleString()}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* RIGHT: Price summary + CTA — sticky on desktop */}
        <motion.div variants={fadeUpSoft} className="lg:sticky lg:top-6">
          <Card className="p-0" aria-label="Order price summary">

            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-[var(--border-soft)]">
              <p className="text-[10px] font-black font-heading text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
                Price Details
              </p>
              <p className="text-xs font-body text-[var(--text-muted)] mt-0.5">
                {cart.items.length} {cart.items.length === 1 ? "product" : "products"}
              </p>
            </div>

            {/* Line items */}
            <dl className="px-5 py-4 flex flex-col gap-3.5">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-body text-[var(--text-muted)] flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5 opacity-40 shrink-0" aria-hidden="true" />
                    Total MRP
                  </dt>
                  <dd className="text-sm font-body text-zinc-400 line-through tabular-nums">
                    ₹{totalMrp.toLocaleString()}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between">
                <dt className="text-sm font-body text-[var(--text-muted)] flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 opacity-40 shrink-0" aria-hidden="true" />
                  Product Value
                </dt>
                <dd className="text-sm font-semibold font-heading text-zinc-900 dark:text-zinc-100 tabular-nums">
                  ₹{subtotal.toLocaleString()}
                </dd>
              </div>

              {totalSavings > 0 && (
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-body text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    Discount
                  </dt>
                  <dd className="text-sm font-semibold font-heading text-emerald-600 dark:text-emerald-400 tabular-nums">
                    −₹{totalSavings.toLocaleString()}
                  </dd>
                </div>
              )}

              <div className="flex items-center justify-between">
                <dt className="text-sm font-body text-[var(--text-muted)] flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 opacity-40 shrink-0" aria-hidden="true" />
                  Delivery
                </dt>
                <dd className="text-sm font-bold font-heading text-emerald-600 dark:text-emerald-400 tracking-wide">
                  FREE
                </dd>
              </div>
            </dl>

            {/* Total */}
            <div className="px-5 py-4 border-t border-[var(--border-soft)] bg-zinc-50/60 dark:bg-zinc-800/30">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold font-heading text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Total Payable
                </span>
                <span
                  className="text-3xl font-semibold font-heading text-zinc-900 dark:text-zinc-50 tabular-nums leading-none"
                  aria-label={`Total payable ₹${subtotal.toLocaleString()}`}
                >
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              {totalSavings > 0 && (
                <p
                  aria-live="polite"
                  className="text-xs font-body text-emerald-600 dark:text-emerald-400 mt-1.5"
                >
                  🎉 You're saving ₹{totalSavings.toLocaleString()} on this order
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="px-5 pb-5 pt-4 flex flex-col gap-3">
              <CustomerButton
                onClick={handlePlaceOrder}
                isLoading={isPending}
                disabled={!defaultAddress || isPending}
                className="w-full h-12 gap-2 text-sm"
                aria-label={
                  !defaultAddress
                    ? "Add a shipping address to place your order"
                    : "Place order"
                }
              >
                Place Order
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </CustomerButton>

              {!defaultAddress && (
                <p
                  role="alert"
                  className="text-xs font-body text-red-500 text-center"
                >
                  Add a default address in your account first.
                </p>
              )}

              <p className="flex items-start gap-2 text-[11px] font-body text-[var(--text-muted)]">
                <ShieldCheck
                  className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Order details confirmed by the Vedic Wellness team after placement.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}