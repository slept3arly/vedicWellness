"use client";

import Card from "@/components/public/ui/Card";
import CustomerButton from "@/components/customer/CustomerButton";
import { addAddressAction } from "@/app/(customer)/account/serverActions";

type Props = {
  open: boolean;
  onClose: () => void;
};

function inputClass() {
  return `
    w-full rounded-[14px] px-4 py-3 text-sm
    bg-[var(--bg-surface)]
    border border-[var(--border-soft)]
    text-[var(--text-main)]
    placeholder:text-[var(--text-muted)]
    focus:outline-none
    focus:border-[color:var(--brand-primary)]/50
    focus:ring-2 focus:ring-[color:var(--brand-primary)]/25
  `;
}

export default function AddressFormModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <Card className="relative w-full max-w-lg p-6">
        <p className="font-medium mb-4">Add New Address</p>

        <form
          className="grid gap-4"
          action={async (formData) => {
            await addAddressAction(Object.fromEntries(formData));
            onClose();
          }}
        >
          <input name="fullName" className={inputClass()} placeholder="Full Name" required />
          <input name="phone" className={inputClass()} placeholder="Phone Number" required />
          <input name="line1" className={inputClass()} placeholder="Address Line" required />
          <input name="line2" className={inputClass()} placeholder="Apartment / Landmark (optional)" />

          <div className="grid grid-cols-2 gap-3">
            <input name="city" className={inputClass()} placeholder="City" required />
            <input name="state" className={inputClass()} placeholder="State" required />
          </div>

          <input
            name="postalCode"
            className={inputClass()}
            placeholder="Postal Code"
            required
          />

          <div className="flex gap-3 pt-2">
<CustomerButton type="submit" className="flex-1">
  Save Address
</CustomerButton>

<CustomerButton
  type="button"
  variant="secondary"
  ignoreFormStatus
  onClick={onClose}
  className="flex-1"
>
  Cancel
</CustomerButton>

          </div>
        </form>
      </Card>
    </div>
  );
}
