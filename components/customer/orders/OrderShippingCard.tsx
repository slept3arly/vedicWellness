import { MapPin, Phone, User } from "lucide-react";
import type { ShippingAddr } from "@/lib/types/order";

type Props = {
  shippingName: string;
  shippingPhone: string;
  shippingAddr: ShippingAddr | null;
};

export default function OrderShippingCard({ shippingName, shippingPhone, shippingAddr }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--bg-surface)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border-soft)]">
        <MapPin className="w-4 h-4 text-[var(--text-muted)]" />
        <p className="text-sm font-semibold text-[var(--text-main)]">Shipping address</p>
      </div>

      <div className="px-4 py-4 space-y-3">

        {/* Name */}
        <div className="flex items-start gap-3">
          <User className="w-3.5 h-3.5 text-[var(--text-muted)] mt-0.5 shrink-0" />
          <p className="text-sm font-medium text-[var(--text-main)]">{shippingName}</p>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <Phone className="w-3.5 h-3.5 text-[var(--text-muted)] mt-0.5 shrink-0" />
          <p className="text-sm text-[var(--text-muted)]">{shippingPhone}</p>
        </div>

        {/* Address */}
        {shippingAddr && (
          <div className="flex items-start gap-3">
            <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] mt-0.5 shrink-0" />
            <div className="text-sm text-[var(--text-muted)] leading-relaxed">
              <p>{shippingAddr.line1}</p>
              {shippingAddr.line2 && <p>{shippingAddr.line2}</p>}
              <p>
                {shippingAddr.city}, {shippingAddr.state} — {shippingAddr.postalCode}
              </p>
              <p>{shippingAddr.country}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}